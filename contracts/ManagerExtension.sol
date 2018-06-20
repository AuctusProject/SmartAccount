pragma solidity ^0.4.24;


import "./ISmartAccount.sol";


contract ManagerExtension {
  string public managerExtensionVersion = "0.0.1";

  mapping(address => bytes32[]) private identifier; //all extensions should define the identifier, it is necessary because the smart account can add the extension more than once
  mapping(bytes32 => uint256) private indexes;
  
  event SetIdentifier(address smartAccount, bytes32 identifier);
  event RemoveIdentifier(address smartAccount, bytes32 identifier);
  
  // Options are ROLE_TRANSFER_ETHER, ROLE_TRANSFER_TOKEN and/or ROLE_TRANSFER_OWNERSHIP
  function getRoles() pure public returns(bytes32[]);
  
  function setIdentifier(bytes32 _identifier) internal {
    bool alreadyExist = false;
    for (uint256 i = 0; i < identifier[msg.sender].length; ++i) {
      if (identifier[msg.sender][i] == _identifier) {
        alreadyExist = true;
        break;
      }
    }
    if (!alreadyExist) {
      indexes[keccak256(abi.encodePacked(msg.sender, _identifier))] = identifier[msg.sender].push(_identifier) - 1;
      emit SetIdentifier(msg.sender, _identifier);
    }
  }
  
  function removeIdentifier(bytes32 _identifier) internal {
    require(getIdentifiersCount(msg.sender) > 0);
    uint256 index = indexes[keccak256(abi.encodePacked(msg.sender, _identifier))];
    bytes32 indexReplacer = identifier[msg.sender][identifier[msg.sender].length - 1];
    identifier[msg.sender][index] = indexReplacer;
    indexes[keccak256(abi.encodePacked(msg.sender, indexReplacer))] = index;
    identifier[msg.sender].length--;
    emit RemoveIdentifier(msg.sender, _identifier);
  }
  
  function getIdentifiers(address _smartAccount) 
    view 
    public 
    returns(bytes32[]) 
  {
    return identifier[_smartAccount];
  }
  
  function getIdentifiersCount(address _smartAccount) 
    view 
    public 
    returns(uint256) 
  {
    return identifier[_smartAccount].length;
  }
  
  function getIdentifierByIndex(address _smartAccount, uint256 _index) view public returns(bytes32) {
    return identifier[_smartAccount][_index];
  }
  
  function transferTokenFrom(address _smartAccount, address _tokenAddress, address _to, uint256 _amount) internal {
    bytes memory data = abi.encodePacked(bytes4(keccak256("transfer(address,uint256)")), bytes32(_to), _amount);
    ISmartAccount(_smartAccount).executeCall(_tokenAddress, 0, 0, data);
  }
  
  function transferEtherFrom(address _smartAccount, address _to, uint256 _amount) internal {
    ISmartAccount(_smartAccount).executeCall(_to, _amount, 0, "");
  }
}
