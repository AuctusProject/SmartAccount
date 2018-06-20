pragma solidity ^0.4.24;


contract ISmartAccount {
  function transferOwnership(address _newOwner) public;
  function executeCall(address _destination, uint256 _value, uint256 _gasLimit, bytes _data) public;
}
