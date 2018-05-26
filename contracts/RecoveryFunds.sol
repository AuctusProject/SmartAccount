pragma solidity 0.4.24;


import "./IExtension.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


//TODO: add events, comments, fix code smells
contract RecoveryFunds is IExtension {
    using SafeMath for uint256;
    
    struct Configuration {
        uint256 delayTime;
        uint256 numberOfConfirmations;
        address[] providers;
    }
    
    struct Data {
        address destination;
        uint256 start;
        address[] confirmedAddresses;
    }
    
    mapping(address => Configuration) private configuration;
    mapping(address => Data) private recoveryProcess;
    
    modifier isProvider(address _smartAccount) {
        bool provider = false;
        for (uint256 i = 0; i < configuration[_smartAccount].providers.length; ++i) {
            if (configuration[_smartAccount].providers[i] == msg.sender) {
                provider = true;
                break;
            }
        }
        require(provider);
        _;
    }
    
    function getName() pure external returns(string) {
        return "Fund Recovery";
    }
    
    function getDescription() pure external returns(string) {
        return "Define a list of providers to recover funds from lost smart account.";
    }
    
    function getSetupParameters() pure internal returns(Setup) {
        ConfigParameter[] memory parameters = new ConfigParameter[](3);
        parameters[0] = ConfigParameter(true, Parameter("Time to disprove in seconds", UINT, false));
        parameters[1] = ConfigParameter(true, Parameter("Number of confirmations", UINT, false));
        parameters[2] = ConfigParameter(true, Parameter("Providers addresses", ADDRESS, true));
        return Setup(bytes4(keccak256("setup(uint256,uint256,address[])")), parameters);
    }
    
    function getActions() pure internal returns(Action[]) {
        Parameter[] memory parameters1 = new Parameter[](2);
        parameters1[0] = Parameter("Smart account", ADDRESS, false);
        parameters1[1] = Parameter("Destination", ADDRESS, false);
        Parameter[] memory parameters2 = new Parameter[](1);
        parameters2[0] = Parameter("Smart account", ADDRESS, false);
        Action[] memory action = new Action[](5);
        action[0].description = "Start recovery process";
        action[0].parameters = parameters1;
        action[0].functionSignature = bytes4(keccak256("startRecovery(address,address)"));
        action[1].description = "Confirm recovery";
        action[1].parameters = parameters2;
        action[1].functionSignature = bytes4(keccak256("confirm(address)"));
        action[2].description = "Cancel recovery";
        action[2].parameters = parameters2;
        action[2].functionSignature = bytes4(keccak256("cancel(address)"));
        action[3].description = "Disprove recovery process";
        action[3].functionSignature = bytes4(keccak256("disprove()"));
        action[4].description = "Complete recovery";
        action[4].parameters = parameters2;
        action[4].functionSignature = bytes4(keccak256("complete(address)"));
        return action;
    }
    
    function getViewDatas() pure internal returns(ViewData[]) {
        ViewData[] memory viewData = new ViewData[](4);
        viewData[0].functionSignature = bytes4(keccak256("isStarted(address,bytes32)"));
        viewData[0].output = Parameter("Recovery process is started", BOOL, false);
        viewData[1].functionSignature = bytes4(keccak256("destinationAddress(address,bytes32)"));
        viewData[1].output = Parameter("Destination address", ADDRESS, false);
        viewData[2].functionSignature = bytes4(keccak256("getConfirmations(address,bytes32)"));
        viewData[2].output = Parameter("Confirmations", ADDRESS, true);
        viewData[3].functionSignature = bytes4(keccak256("timeToDisprove(address,bytes32)"));
        viewData[3].output = Parameter("Time in seconds to disprove", UINT, false);
        return viewData;
    }
    
    function setup(uint256 _delay,  uint256 _confirmations, address[] _providers) external {
        require(configuration[msg.sender].numberOfConfirmations == 0 || recoveryProcess[msg.sender].start == 0);
        require(_providers.length > 0);
        require(_confirmations > 0);
        require(_confirmations <= _providers.length);
        for(uint256 i = 0; i < _providers.length; ++i) {
            require(_providers[i] != address(0) && _providers[i] != msg.sender);
            for (uint256 j = 0; j < i; ++j) {
                require(_providers[j] != _providers[i]);
            }
        }
        configuration[msg.sender] = Configuration(_delay, _confirmations, _providers);
        setIdentifier(msg.sender, bytes32(0));
    }
        
    function getSetup(address _reference, bytes32) 
        view 
        external 
        returns (uint256, uint256, address[]) 
    {
        return (configuration[_reference].delayTime, 
            configuration[_reference].numberOfConfirmations, 
            configuration[_reference].providers);
    }

    function isStarted(address _reference, bytes32) view external returns(bool) {
        return recoveryProcess[_reference].start > 0;
    }

    function destinationAddress(address _reference, bytes32) view external returns(address) {
        return recoveryProcess[_reference].destination;
    }

    function getConfirmations(address _reference, bytes32) view external returns(address[]) {
        return recoveryProcess[_reference].confirmedAddresses;
    }
    
    function timeToDisprove(address _reference, bytes32) view external returns(uint256) {
        if (recoveryProcess[_reference].start == 0) {
            return 0;
        } else {
            uint256 timePassed = now.sub(recoveryProcess[_reference].start);
            return timePassed > configuration[_reference].delayTime ? 0 : 
                configuration[_reference].delayTime.sub(timePassed);
        }
    }
    
    function startRecovery(address _smartAccount, address _destination) isProvider(_smartAccount) external { 
        require(recoveryProcess[_smartAccount].start == 0);
        require(_destination != address(0));
        require(_destination != _smartAccount);
        address[] memory confirmed = new address[](1);
        confirmed[0] = msg.sender;
        recoveryProcess[_smartAccount] = Data(_destination, now, confirmed);
    }
    
    function confirm(address _smartAccount) isProvider(_smartAccount) external { 
        require(recoveryProcess[_smartAccount].start > 0);
        for (uint256 i = 0; i < recoveryProcess[_smartAccount].confirmedAddresses.length; ++i) {
            require(recoveryProcess[_smartAccount].confirmedAddresses[i] != msg.sender);
        }
        recoveryProcess[_smartAccount].confirmedAddresses.push(msg.sender);
    }
    
    function cancel(address _smartAccount) isProvider(_smartAccount) external {  
        require(recoveryProcess[_smartAccount].start > 0);
        bool canCancel = false;
        uint256 index;
        for (uint256 i = 0; i < recoveryProcess[_smartAccount].confirmedAddresses.length; ++i) {
            if (recoveryProcess[_smartAccount].confirmedAddresses[i] == msg.sender) {
                canCancel = true;
                index = i;
                break;
            }
        }
        require(canCancel);
        recoveryProcess[_smartAccount].confirmedAddresses[index] = 
            recoveryProcess[_smartAccount].confirmedAddresses[recoveryProcess[_smartAccount].confirmedAddresses.length - 1];
        recoveryProcess[_smartAccount].confirmedAddresses.length--;
    }
    
    function complete(address _smartAccount) external {  
        require(recoveryProcess[_smartAccount].start > 0);
        require(now.sub(recoveryProcess[_smartAccount].start) > configuration[_smartAccount].delayTime);
        ISmartAccount(_smartAccount).transferOwnership(recoveryProcess[_smartAccount].destination);
        configuration[_smartAccount] = Configuration(0, 0, new address[](0));
        recoveryProcess[_smartAccount] = Data(address(0), 0, new address[](0));
    }
    
    function disprove() external {
        require(recoveryProcess[msg.sender].start > 0);
        require(now.sub(recoveryProcess[msg.sender].start) <= configuration[msg.sender].delayTime);
        recoveryProcess[msg.sender] = Data(address(0), 0, new address[](0));
    }
}