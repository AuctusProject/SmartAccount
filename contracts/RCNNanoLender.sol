pragma solidity 0.4.24;


import "./IExtension.sol";
import "./SafeMath.sol";
import "./NanoLoanEngine.sol";
import "./ISmartAccount.sol";


//TODO: add events, comments, fix code smells
contract RCNNanoLender is IExtension {
    using SafeMath for uint256;
    
    struct Configuration {
        uint256 maxAmount;
        uint256 minInterestRate;
        uint256 minPunitoryInterestRate;
        
        uint256 maxLendingTime;
        uint256 maxEndNonPunitory;
        
        address nanoLoanEngineAddress;
        address[] whitelist;
    }
    
    struct Data {
        uint256 lentAmount;
    }
    
    mapping(address => mapping(address => Configuration)) configuration;
    mapping(bytes32 => Data) loanData;
    
    function getName() pure external returns(string) {
        return "RCN Nano Lender";
    }
    
    function getDescription() pure external returns(string) {
        return "Define desired params (max amount, interest rates, expiration time and cancelable date) to allow anyone to borrow RCN from the smart account.";
    }
    
    function getSetupParameters() pure internal returns(Setup) {
        ConfigParameter[] memory parameters = new ConfigParameter[](7);
        parameters[0] = ConfigParameter(false, Parameter("Max Loan Amount", UINT, false));
        parameters[1] = ConfigParameter(false, Parameter("Minimum Interest Rate", UINT, false));
        parameters[2] = ConfigParameter(false, Parameter("Minimum Punitory Interest Rate", UINT, false));
        parameters[3] = ConfigParameter(false, Parameter("Max Lending Time", UINT, false));
        parameters[4] = ConfigParameter(false, Parameter("Max Cancelable Date", UINT, false));
        parameters[5] = ConfigParameter(false, Parameter("NanoLoanEngine Address", ADDRESS, false));
        parameters[6] = ConfigParameter(false, Parameter("Loan Creator Whitelist", ADDRESS, true));
        return Setup(bytes4(keccak256("setup(uint256,uint256,uint256,uint256,uint256,address,address[])")), parameters);
    }
    
    function getActions() pure internal returns(Action[]) {
        Action[] memory action = new Action[](3);
        
        Parameter[] memory paramLend = new Parameter[](3);
        paramLend[0] = Parameter("Smart account address", ADDRESS, false);
        paramLend[1] = Parameter("Engine Address", ADDRESS, false);
        paramLend[2] = Parameter("Loan Index", UINT, false);
        
        action[0].description = "Lend RCN";
        action[0].parameters = paramLend;
        action[0].functionSignature = bytes4(keccak256("lendRCN(address,address,uint)"));
        
        Parameter[] memory paramWithdraw = new Parameter[](4);
        paramWithdraw[0] = Parameter("Smart account address", ADDRESS, false);
        paramWithdraw[1] = Parameter("Engine Address", ADDRESS, false);
        paramWithdraw[2] = Parameter("Loan Index", UINT, false);
        paramWithdraw[3] = Parameter("RCN Amount", UINT, false);
        
        action[1].description = "Withdraw Returned Loan";
        action[1].parameters = paramWithdraw;
        action[1].functionSignature = bytes4(keccak256("withdrawReturnedLoan(address,address,uint,uint256)"));
        
        Parameter[] memory paramCancel = new Parameter[](1);
        paramCancel[0] = Parameter("Engine address", BYTE, false);
        
        action[2].description = "Cancel Lending";
        action[2].parameters = paramCancel;
        action[2].functionSignature = bytes4(keccak256("cancelNanoLending(bytes32)"));
        
        return action;
    }
    
    function getViewDatas() pure internal returns(ViewData[]) {
        ViewData[] memory viewData = new ViewData[](0);
        
        //TODO - show useful info on dapp (lent amount, limits...)
        return viewData;
    }
    
    function setup(
        uint256 _maxAmount,
        uint256 _minInterestRate,
        uint256 _minPunitoryInterestRate,
        uint256 _maxLendingTime,
        uint256 _maxEndNonPunitory,
        address _nanoLoanEngineAddress,
        address[] _whitelist
    )
        external
    {
        require(_nanoLoanEngineAddress != address(0));
        require(_maxAmount > 0);
        require(_minInterestRate > 0);
        require(_minPunitoryInterestRate > 0);
        require(_maxLendingTime > 0);
        require(_maxEndNonPunitory > 0);
        
        configuration[msg.sender][_nanoLoanEngineAddress].maxAmount = _maxAmount;
        configuration[msg.sender][_nanoLoanEngineAddress].minInterestRate = _minInterestRate;
        configuration[msg.sender][_nanoLoanEngineAddress].minPunitoryInterestRate = _minPunitoryInterestRate;
        configuration[msg.sender][_nanoLoanEngineAddress].maxLendingTime = _maxLendingTime;
        configuration[msg.sender][_nanoLoanEngineAddress].maxEndNonPunitory = _maxEndNonPunitory;
        configuration[msg.sender][_nanoLoanEngineAddress].nanoLoanEngineAddress = _nanoLoanEngineAddress;
        configuration[msg.sender][_nanoLoanEngineAddress].whitelist = _whitelist;
        setIdentifier(msg.sender, bytes32(_nanoLoanEngineAddress));
    }
        
    function getSetup(address _smartAccount, bytes32 _engineAddress) 
        view 
        external 
        returns (uint256, uint256, uint256, uint256, uint256, address, address[]) 
    {
        Configuration memory config = configuration[_smartAccount][address(_engineAddress)];
        
        return (config.maxAmount,
            config.minInterestRate,
            config.minPunitoryInterestRate,
            config.maxLendingTime,
            config.maxEndNonPunitory,
            config.nanoLoanEngineAddress,
            config.whitelist);
    }
    
    function lendRCN(address _smartAccount, address _engineAddress, uint _index) external {
        NanoLoanEngine engine = NanoLoanEngine(_engineAddress);
        
        bytes32 key = keccak256(abi.encodePacked(_smartAccount, bytes32(_engineAddress)));
        require(engine.getAmount(_index) <= loanData[key].lentAmount + configuration[_smartAccount][address(_engineAddress)].maxAmount);
        require(engine.getInterestRate(_index) <= configuration[_smartAccount][address(_engineAddress)].minInterestRate);
        require(engine.getInterestRatePunitory(_index) <= configuration[_smartAccount][address(_engineAddress)].minPunitoryInterestRate);
        require(engine.getDueTime(_index) <= configuration[_smartAccount][address(_engineAddress)].maxLendingTime);
        require(engine.getCancelableAt(_index) <= configuration[_smartAccount][address(_engineAddress)].maxEndNonPunitory);
        bool isWhitelisted = false;
        for (uint i = 0; i < configuration[_smartAccount][address(_engineAddress)].whitelist.length; i++) {
            if (configuration[_smartAccount][address(_engineAddress)].whitelist[i] == engine.getCreator(_index)) {
                isWhitelisted = true;
                break;
            }
        }
        require(isWhitelisted);
        
        bytes memory data = abi.encodePacked(bytes4(keccak256(abi.encodePacked("lend(uint,bytes,Cosigner,bytes)"))), 
                                        bytes32(_index), bytes32(0x0), bytes32(0x0), bytes32(0x0));
                                        
        ISmartAccount(_smartAccount).execute(_engineAddress, 0, 0, data);
        
        loanData[key].lentAmount.add(engine.getAmount(_index));
    }
    
    function withdrawReturnedLoan(address _smartAccount, address _engineAddress, uint _index, uint256 _amount) external {
        bytes32 key = keccak256(abi.encodePacked(_smartAccount, bytes32(_engineAddress)));
        
        bytes memory data = abi.encodePacked(bytes4(keccak256(abi.encodePacked("withdrawal(uint,address,uint256)"))), 
                                        bytes32(_index), bytes32(_smartAccount), bytes32(_amount));
                                        
        ISmartAccount(_smartAccount).execute(_engineAddress, 0, 0, data);
        
        if (_amount > loanData[key].lentAmount) {
            loanData[key].lentAmount = 0;
        } else {
            loanData[key].lentAmount = loanData[key].lentAmount.sub(_amount);
        }
    }
    
    function cancelNanoLending(bytes32 _identifier) external {
        require(configuration[msg.sender][address(_identifier)].maxAmount > 0);
        
        bytes32 key = keccak256(abi.encodePacked(msg.sender, _identifier));
        configuration[msg.sender][address(_identifier)].maxAmount = 0;
        loanData[key] = Data(0);
        configuration[msg.sender][address(_identifier)].maxLendingTime = 0;
        configuration[msg.sender][address(_identifier)].nanoLoanEngineAddress = address(0);
        removeIdentifier(msg.sender, _identifier);
    }
	
	function min(uint256 x, uint256 y) internal pure returns (uint256) {
		return x < y ? x : y;
	}
}