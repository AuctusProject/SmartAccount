pragma solidity 0.4.24;


import "./IExtension.sol";
import "./SafeMath.sol";


//TODO: add events, comments, fix code smells
contract RecurringPaymentWithDAI is IExtension {
    using SafeMath for uint256;
    
    struct Configuration {
        uint256 recurrenceTime;
        uint256 numberPeriods;
        bool paymentInEther;
        address tokenAddress;
        uint256 maximumAmountPerPeriod;
        bool convertToDAI;
    }
    
    struct Data {
        uint256 releasedPeriods;
	    uint256 releasedAmount;
	    uint256 start;
	    mapping(uint256 => uint256) releasedPerPeriod;
    }
    
    mapping(address => mapping(address => Configuration)) configuration;
    mapping(bytes32 => Data) paymentData;
    
    function getName() pure external returns(string) {
        return "Recurring Payment";
    }
    
    function getDescription() pure external returns(string) {
        return "Define an address that is authorized to withdraw a number of Ethers or Tokens for some recurring period.";
    }
    
    function getSetupParameters() pure internal returns(Setup) {
        ConfigParameter[] memory parameters = new ConfigParameter[](7);
        parameters[0] = ConfigParameter(false, Parameter("Beneficiary address", ADDRESS, false));
        parameters[1] = ConfigParameter(false, Parameter("Recurrence time in seconds", UINT, false));
        parameters[2] = ConfigParameter(true, Parameter("Number of periods", UINT, false));
        parameters[3] = ConfigParameter(false, Parameter("Payment in Ether", BOOL, false));
        parameters[4] = ConfigParameter(false, Parameter("Token address if payment not in Ether", ADDRESS, false));
        parameters[5] = ConfigParameter(true, Parameter("Limit amount per period", UINT, false));
        parameters[6] = ConfigParameter(false, Parameter("Automatically converts ETH to DAI", BOOL, false));
        return Setup(bytes4(keccak256("setup(address,uint256,uint256,bool,address,uint256,bool)")), parameters);
    }
    
    function getActions() pure internal returns(Action[]) {
        Parameter[] memory parameters1 = new Parameter[](2);
        parameters1[0] = Parameter("Smart account address", ADDRESS, false);
        parameters1[1] = Parameter("Amount", UINT, false);
        Parameter[] memory parameters2 = new Parameter[](1);
        parameters2[0] = Parameter("Beneficiary", BYTE, false);
        Action[] memory action = new Action[](2);
        action[0].description = "Make a withdraw";
        action[0].parameters = parameters1;
        action[0].functionSignature = bytes4(keccak256("withdrawal(address,uint256)"));
        action[1].description = "Cancel recurring payment";
        action[1].parameters = parameters2;
        action[1].functionSignature = bytes4(keccak256("cancelRecurringPayment(bytes32)"));
        return action;
    }
    
    function getViewDatas() pure internal returns(ViewData[]) {
        ViewData[] memory viewData = new ViewData[](3);
        viewData[0].functionSignature = bytes4(keccak256("getAvailableAmountWithdrawal(address,bytes32)"));
        viewData[0].output = Parameter("Available amount to withdrawal", UINT, false);
        viewData[1].functionSignature = bytes4(keccak256("getAmountWithdrawal(address,bytes32)"));
        viewData[1].output = Parameter("Amount already withdrawal", UINT, false);
        viewData[2].functionSignature = bytes4(keccak256("getPeriodsWithdrawal(address,bytes32)"));
        viewData[2].output = Parameter("Amount of periods withdrawal", UINT, false);
        return viewData;
    }
    
    function setup(
        address _beneficiary, 
        uint256 _recurrenceTime, 
        uint256 _numberPeriods, 
        bool _paymentInEther, 
        address _tokenAddress, 
        uint256 _maximumAmountPerPeriod, 
        bool _convertToDAI
    )
        external
    {
        require(_beneficiary != address(0));
        require(_recurrenceTime > 0);
        require(_numberPeriods > 0);
        require(_maximumAmountPerPeriod > 0);
        require(_paymentInEther || _convertToDAI || _tokenAddress != address(0));
        if (configuration[msg.sender][_beneficiary].recurrenceTime > 0) {
            require(configuration[msg.sender][_beneficiary].recurrenceTime == _recurrenceTime);
            require(configuration[msg.sender][_beneficiary].paymentInEther == _paymentInEther);
            require(configuration[msg.sender][_beneficiary].tokenAddress == _tokenAddress);
            require(configuration[msg.sender][_beneficiary].convertToDAI == _convertToDAI);
        } else {
            configuration[msg.sender][_beneficiary].recurrenceTime = _recurrenceTime;
            configuration[msg.sender][_beneficiary].paymentInEther = _paymentInEther;
            configuration[msg.sender][_beneficiary].tokenAddress = _tokenAddress;
            configuration[msg.sender][_beneficiary].convertToDAI = _convertToDAI;
            setIdentifier(msg.sender, bytes32(_beneficiary));
        }
        configuration[msg.sender][_beneficiary].numberPeriods = _numberPeriods;
        configuration[msg.sender][_beneficiary].maximumAmountPerPeriod = _maximumAmountPerPeriod;
    }
        
    function getSetup(address _reference, bytes32 _identifier) 
        view 
        external 
        returns (address, uint256, uint256, bool, address, uint256, bool) 
    {
        Configuration memory config = configuration[_reference][address(_identifier)];
        
        return (address(_identifier),
            config.recurrenceTime,
            config.numberPeriods,
            config.paymentInEther,
            config.tokenAddress,
            config.maximumAmountPerPeriod,
            config.convertToDAI);
    }

    function getPeriodsWithdrawal(address _reference, bytes32 _identifier) view external returns(uint256) {
        return paymentData[keccak256(abi.encodePacked(_reference, _identifier))].releasedPeriods;
    }

    function getAmountWithdrawal(address _reference, bytes32 _identifier) view external returns(uint256) {
        return paymentData[keccak256(abi.encodePacked(_reference, _identifier))].releasedAmount;
    }

    function getAvailableAmountWithdrawal(address _reference, bytes32 _identifier) view external returns(uint256) {
        bytes32 key = keccak256(abi.encodePacked(_reference, _identifier));
        uint256 allowedAmount;
        uint256 pendingPeriods;
        (allowedAmount, pendingPeriods) = getAllowedAmountAndPendingPeriods(_reference, address(_identifier), key);
        return allowedAmount;
    }
    
    function cancelRecurringPayment(bytes32 _identifier) external {
        require(configuration[msg.sender][address(_identifier)].recurrenceTime > 0);
        configuration[msg.sender][address(_identifier)].recurrenceTime = 0;
        configuration[msg.sender][address(_identifier)].numberPeriods = 0;
        configuration[msg.sender][address(_identifier)].maximumAmountPerPeriod = 0;
        configuration[msg.sender][address(_identifier)].paymentInEther = false;
        configuration[msg.sender][address(_identifier)].tokenAddress = address(0);
        configuration[msg.sender][address(_identifier)].convertToDAI = false;
        removeIdentifier(msg.sender, _identifier);
    }
    
    function withdrawal(address _smartAccount, uint256 _amount) external { 
        require(_amount > 0);
        require(configuration[_smartAccount][msg.sender].recurrenceTime > 0);
        bytes32 key = keccak256(abi.encodePacked(_smartAccount, bytes32(msg.sender)));
        require(paymentData[key].releasedPeriods == 0 
            || configuration[_smartAccount][msg.sender].numberPeriods > paymentData[key].releasedPeriods);
        
        uint256 allowedAmount;
        uint256 pendingPeriods;
        (allowedAmount, pendingPeriods) = getAllowedAmountAndPendingPeriods(_smartAccount, msg.sender, key);
        require(allowedAmount >= _amount);

        if (paymentData[key].start == 0) {
            paymentData[key].start = now;
        }
        paymentData[key].releasedPeriods = paymentData[key].releasedPeriods.add(pendingPeriods);
        paymentData[key].releasedPerPeriod[paymentData[key].releasedPeriods] = 
            paymentData[key].releasedPerPeriod[paymentData[key].releasedPeriods].add(_amount); 
        paymentData[key].releasedAmount = paymentData[key].releasedAmount.add(_amount);

        if (configuration[_smartAccount][msg.sender].convertToDAI) {
            address daiAddress = 0xc4375b7de8af5a38a93548eb8453a498222c4ff2;
            
            convertEthToDai(_smartAccount, daiAddress, _amount);
            
            transferTokenFrom(_smartAccount, daiAddress, msg.sender, _amount);
        } else if (configuration[_smartAccount][msg.sender].paymentInEther) {
            transferEtherFrom(_smartAccount, msg.sender, _amount);
        } else {
            transferTokenFrom(_smartAccount, configuration[_smartAccount][msg.sender].tokenAddress, msg.sender, _amount);
        }
    }
    
    function convertEthToDai(address _smartAccount, address _daiAddress, uint256 _amount) {
        //TODO
    }
    
    function getAllowedAmountAndPendingPeriods(address _smartAccount, address _beneficiary, bytes32 _key) internal view returns (uint256, uint256) {
        if (paymentData[_key].start == 0) {
            return (configuration[_smartAccount][_beneficiary].maximumAmountPerPeriod, 1);
        } else {
    		uint256 secondsFromTheStart = now.sub(paymentData[_key].start);
            uint256 pendingPeriods = min(secondsFromTheStart.div(configuration[_smartAccount][_beneficiary].recurrenceTime).add(1), 
                                        configuration[_smartAccount][msg.sender].numberPeriods
                                        .sub(paymentData[_key].releasedPeriods));
                                        
    		if (pendingPeriods == 0) {
                return (configuration[_smartAccount][_beneficiary].maximumAmountPerPeriod 
                        .sub(paymentData[_key].releasedPerPeriod[paymentData[_key].releasedPeriods]), 0);
    		} else {
    			return (configuration[_smartAccount][_beneficiary].maximumAmountPerPeriod.mul(pendingPeriods), pendingPeriods);
    		}
        }
	}
	
	function min(uint256 x, uint256 y) internal pure returns (uint256) {
		return x < y ? x : y;
	}
}