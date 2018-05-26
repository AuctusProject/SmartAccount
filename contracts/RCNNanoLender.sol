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
        uint256 lentAmount;
        uint256 minInterestRate;
        uint256 minPunitoryInterestRate;
        
        uint256 maxLendingTime;
        uint256 maxEndNonPunitory;
        
        address nanoLoanEngineAddress;
    }
    
    mapping(address => mapping(address => Configuration)) configuration;
    
    function getDescription() pure external returns(string) {
        return "Define desired params (max amount, interest rates, expiration time and cancelable date) to allow anyone to borrow RCN from the smart account.";
    }
    
    function getSetupParameters() pure internal returns(Setup) {
        ConfigParameter[] memory parameters = new ConfigParameter[](6);
        parameters[0] = ConfigParameter(true, Parameter("Max Loan Amount", UINT, false));
        parameters[1] = ConfigParameter(true, Parameter("Minimum Interest Rate", UINT, false));
        parameters[2] = ConfigParameter(true, Parameter("Minimum Punitory Interest Rate", UINT, false));
        parameters[3] = ConfigParameter(true, Parameter("Max Lending Time", UINT, false));
        parameters[4] = ConfigParameter(true, Parameter("Max Cancelable Date", UINT, false));
        parameters[5] = ConfigParameter(true, Parameter("NanoLoanEngine Address", ADDRESS, false));
        return Setup(bytes4(keccak256("setup(uint256,uint256,uint256,uint256,uint256,address)")), parameters);
    }
    
    function getActions() pure internal returns(Action[]) {
        /*Parameter[] memory parameters1 = new Parameter[](2);
        parameters1[0] = Parameter("Smart account address", ADDRESS, false);
        parameters1[1] = Parameter("Amount", UINT, false);
        Parameter[] memory parameters2 = new Parameter[](1);
        parameters2[0] = Parameter("Beneficiary", BYTE, false);
        Action[] memory action = new Action[](2);
        action[0].description = "Make a withdraw";
        action[0].parameters = parameters1;
        action[0].functionSignature = bytes4(keccak256("withdrawal(address,uint256)"));
        action[1].description = "Cancel recurrent payment";
        action[1].parameters = parameters2;
        action[1].functionSignature = bytes4(keccak256("cancelRecurrentPayment(bytes32)"));*/
        Action[] memory action = new Action[](0);
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
        uint256 _maxAmount,
        uint256 _minInterestRate,
        uint256 _minPunitoryInterestRate,
        uint256 _maxLendingTime,
        uint256 _maxEndNonPunitory,
        address _nanoLoanEngineAddress
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
        configuration[msg.sender][_nanoLoanEngineAddress].lentAmount = 0;
        configuration[msg.sender][_nanoLoanEngineAddress].minInterestRate = _minInterestRate;
        configuration[msg.sender][_nanoLoanEngineAddress].minPunitoryInterestRate = _minPunitoryInterestRate;
        configuration[msg.sender][_nanoLoanEngineAddress].maxLendingTime = _maxLendingTime;
        configuration[msg.sender][_nanoLoanEngineAddress].maxEndNonPunitory = _maxEndNonPunitory;
        configuration[msg.sender][_nanoLoanEngineAddress].nanoLoanEngineAddress = _nanoLoanEngineAddress;
    }
        
    function getSetup(address _reference, bytes32 _engineAddress) 
        view 
        external 
        returns (uint256, uint256, uint256, uint256, uint256, address) 
    {
        return (configuration[_reference][address(_engineAddress)].maxAmount,
            configuration[_reference][address(_engineAddress)].minInterestRate,
            configuration[_reference][address(_engineAddress)].minPunitoryInterestRate,
            configuration[_reference][address(_engineAddress)].maxLendingTime,
            configuration[_reference][address(_engineAddress)].maxEndNonPunitory,
            configuration[_reference][address(_engineAddress)].nanoLoanEngineAddress);
    }
    
    function lend(address _reference, address _engineAddress, uint _index)
    {
        NanoLoanEngine engine = NanoLoanEngine(_engineAddress);
        
        require(engine.getAmount(_index) <= configuration[_reference][address(_engineAddress)].lentAmount + configuration[_reference][address(_engineAddress)].maxAmount);
        require(engine.getInterestRate(_index) <= configuration[_reference][address(_engineAddress)].minInterestRate);
        require(engine.getInterestRatePunitory(_index) <= configuration[_reference][address(_engineAddress)].minPunitoryInterestRate);
        require(engine.getDueTime(_index) <= configuration[_reference][address(_engineAddress)].maxLendingTime);
        require(engine.getCancelableAt(_index) <= configuration[_reference][address(_engineAddress)].maxEndNonPunitory);
        
        bytes memory data = abi.encodePacked(bytes4(keccak256(abi.encodePacked("lend(uint,bytes,Cosigner,bytes)"))), 
                                        bytes32(_index), bytes32(0x0), bytes32(0x0), bytes32(0x0));
                                        
        ISmartAccount(_reference).execute(_engineAddress, 0, 0, data);
        
        configuration[_reference][address(_engineAddress)].lentAmount += engine.getAmount(_index);
    }
    
    function cancelNanoLending(bytes32 _identifier) external {
        require(configuration[msg.sender][address(_identifier)].maxAmount > 0);
        configuration[msg.sender][address(_identifier)].maxAmount = 0;
        configuration[msg.sender][address(_identifier)].lentAmount = 0;
        configuration[msg.sender][address(_identifier)].maxLendingTime = 0;
        configuration[msg.sender][address(_identifier)].nanoLoanEngineAddress = address(0);
        removeIdentifier(msg.sender, _identifier);
    }
	
	function min(uint256 x, uint256 y) internal pure returns (uint256) {
		return x < y ? x : y;
	}
}