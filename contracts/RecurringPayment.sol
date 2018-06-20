pragma solidity 0.4.24;


import "./IExtension.sol";
import "./SafeMath.sol";


//Simple Example 2
//TODO: add comments and events
contract RecurringPayment is IExtension {
  using SafeMath for uint256;
  
  struct Configuration {
    uint256 recurrenceTime;
    uint256 periods;
    bool paymentInEther;
    address tokenAddress;
    uint256 maximumAmountPerPeriod;
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
    return "Define an authorized address to withdraw a number of Ethers or Tokens for some recurrent period.";
  }
  
  function getSetupParameters() pure internal returns(Setup) {
    ConfigParameter[] memory parameters = new ConfigParameter[](6);
    parameters[0] = ConfigParameter(false, Parameter(false, false, ADDRESS, 0, "Beneficiary address"));
    parameters[1] = ConfigParameter(false, Parameter(false, false, INTEGER, 86400, "Recurrence time in days"));
    parameters[2] = ConfigParameter(true, Parameter(false, false, INTEGER, 0, "Number of periods"));
    parameters[3] = ConfigParameter(false, Parameter(false, false, BOOL, 0, "Payment in Ether"));
    parameters[4] = ConfigParameter(false, Parameter(false, true, ADDRESS, 0, "Token address if payment not in Ether"));
    parameters[5] = ConfigParameter(true, Parameter(false, false, FLOAT, 1000000000000000000, "Maximum amount per period"));
    return Setup(bytes4(keccak256("createSetup(address,uint256,uint256,bool,address,uint256)")), bytes4(keccak256("updateSetup(bytes32,address,uint256,uint256,bool,address,uint256)")), parameters);
  }
  
  function getActions() pure internal returns(Action[]) {
    Parameter[] memory parameters1 = new Parameter[](2);
    parameters1[0] = Parameter(false, false, SMARTACCOUNTADDRESS, 0, "Smart account");
    parameters1[1] = Parameter(false, false, FLOAT, 1000000000000000000, "Amount");
    Parameter[] memory parameters2 = new Parameter[](1);
    parameters2[0] = Parameter(false, false, ADDRESS, 0, "Beneficiary");
    Action[] memory action = new Action[](2);
    action[0].description = "Make a withdraw";
    action[0].parameters = parameters1;
    action[0].directlyCallFunction = true;
    action[0].functionSignature = bytes4(keccak256("withdrawal(address,uint256)"));
    action[1].description = "Cancel recurring payment";
    action[1].parameters = parameters2;
    action[1].functionSignature = bytes4(keccak256("cancelRecurringPayment(bytes32)"));
    return action;
  }
  
  function getViewDatas() pure internal returns(ViewData[]) {
    ViewData[] memory viewData = new ViewData[](3);
    viewData[0].functionSignature = bytes4(keccak256("getAvailableAmountWithdrawal(address,bytes32)"));
    viewData[0].output = Parameter(false, false, FLOAT, 1000000000000000000, "Available amount to withdrawal");
    viewData[1].functionSignature = bytes4(keccak256("getAmountWithdrawal(address,bytes32)"));
    viewData[1].output = Parameter(false, false, FLOAT, 1000000000000000000, "Amount released");
    viewData[2].functionSignature = bytes4(keccak256("getPeriodsWithdrawal(address,bytes32)"));
    viewData[2].output = Parameter(false, false, INTEGER, 0, "Amount of periods released");
    return viewData;
  }
  
  function getRoles() pure public returns(bytes32[]) {
    bytes32[] memory roles = new bytes32[](2); 
    roles[0] = ROLE_TRANSFER_ETHER;
    roles[1] = ROLE_TRANSFER_TOKEN;
    return roles;
  }
  
  function createSetup(
    address _beneficiary, 
    uint256 _recurrenceTime, 
    uint256 _periods, 
    bool _paymentInEther, 
    address _tokenAddress, 
    uint256 _maximumAmountPerPeriod
  )
    public
  {
    require(_beneficiary != address(0) && msg.sender != _beneficiary);
    require(_recurrenceTime > 0);
    require(_periods > 0);
    require(_maximumAmountPerPeriod > 0);
    require(_paymentInEther || _tokenAddress != address(0));
    if (configuration[msg.sender][_beneficiary].recurrenceTime > 0) {
      require(configuration[msg.sender][_beneficiary].recurrenceTime == _recurrenceTime);
      require(configuration[msg.sender][_beneficiary].paymentInEther == _paymentInEther);
      require(configuration[msg.sender][_beneficiary].tokenAddress == _tokenAddress);
    } else {
      configuration[msg.sender][_beneficiary].recurrenceTime = _recurrenceTime;
      configuration[msg.sender][_beneficiary].paymentInEther = _paymentInEther;
      configuration[msg.sender][_beneficiary].tokenAddress = _tokenAddress;
      setIdentifier(bytes32(_beneficiary));
    }
    configuration[msg.sender][_beneficiary].periods = _periods;
    configuration[msg.sender][_beneficiary].maximumAmountPerPeriod = _maximumAmountPerPeriod;
  }
  
  function updateSetup(
    bytes32,
    address _beneficiary, 
    uint256 _recurrenceTime, 
    uint256 _periods, 
    bool _paymentInEther, 
    address _tokenAddress, 
    uint256 _maximumAmountPerPeriod
  )
    external
  {
    createSetup(_beneficiary, _recurrenceTime, _periods, _paymentInEther, _tokenAddress, _maximumAmountPerPeriod);
  }
      
  function getSetup(address _reference, bytes32 _identifier) 
    view 
    external 
    returns (address, uint256, uint256, bool, address, uint256) 
  {
    return (address(_identifier),
      configuration[_reference][address(_identifier)].recurrenceTime,
      configuration[_reference][address(_identifier)].periods,
      configuration[_reference][address(_identifier)].paymentInEther,
      configuration[_reference][address(_identifier)].tokenAddress,
      configuration[_reference][address(_identifier)].maximumAmountPerPeriod);
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
  
  function cancelRecurringPayment(address _beneficiary) external {
    require(configuration[msg.sender][_beneficiary].recurrenceTime > 0);
    configuration[msg.sender][_beneficiary].recurrenceTime = 0;
    configuration[msg.sender][_beneficiary].periods = 0;
    configuration[msg.sender][_beneficiary].maximumAmountPerPeriod = 0;
    configuration[msg.sender][_beneficiary].paymentInEther = false;
    configuration[msg.sender][_beneficiary].tokenAddress = address(0);
    removeIdentifier(bytes32(_beneficiary));
  }
  
  function withdrawal(address _smartAccount, uint256 _amount) external { 
    require(_amount > 0);
    require(configuration[_smartAccount][msg.sender].recurrenceTime > 0);
    bytes32 key = keccak256(abi.encodePacked(_smartAccount, bytes32(msg.sender)));
    require(paymentData[key].releasedPeriods == 0 || configuration[_smartAccount][msg.sender].periods > paymentData[key].releasedPeriods);
    
    uint256 allowedAmount;
    uint256 pendingPeriods;
    (allowedAmount, pendingPeriods) = getAllowedAmountAndPendingPeriods(_smartAccount, msg.sender, key);
    require(allowedAmount >= _amount);

    if (paymentData[key].start == 0) {
      paymentData[key].start = now;
    }
    paymentData[key].releasedPeriods = paymentData[key].releasedPeriods.add(pendingPeriods);
    paymentData[key].releasedPerPeriod[paymentData[key].releasedPeriods] = paymentData[key].releasedPerPeriod[paymentData[key].releasedPeriods].add(_amount); 
    paymentData[key].releasedAmount = paymentData[key].releasedAmount.add(_amount);

    if (configuration[_smartAccount][msg.sender].paymentInEther) {
      transferEtherFrom(_smartAccount, msg.sender, _amount);
    } else {
      transferTokenFrom(_smartAccount, configuration[_smartAccount][msg.sender].tokenAddress, msg.sender, _amount);
    }
  }
  
  function getAllowedAmountAndPendingPeriods(address _smartAccount, address _beneficiary, bytes32 _key) internal view returns (uint256, uint256) {
    if (paymentData[_key].start == 0) {
      return (configuration[_smartAccount][_beneficiary].maximumAmountPerPeriod, 1);
    } else {
      uint256 secondsFromTheStart = now.sub(paymentData[_key].start);
      uint256 pendingPeriods = min(secondsFromTheStart.div(configuration[_smartAccount][_beneficiary].recurrenceTime).add(1), configuration[_smartAccount][_beneficiary].periods.sub(paymentData[_key].releasedPeriods));
                                      
      if (pendingPeriods == 0) {
        return (configuration[_smartAccount][_beneficiary].maximumAmountPerPeriod.sub(paymentData[_key].releasedPerPeriod[paymentData[_key].releasedPeriods]), 0);
      } else {
        return (configuration[_smartAccount][_beneficiary].maximumAmountPerPeriod.mul(pendingPeriods), pendingPeriods);
      }
    }
  }
  
  function min(uint256 x, uint256 y) internal pure returns (uint256) {
    return x < y ? x : y;
  }
}