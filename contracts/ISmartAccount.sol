pragma solidity 0.4.24;


contract ISmartAccount {
    function transferOwnership(address _newOwner) public;
	function transfer(address _destination, uint256 _value) public;
    function execute(address destination, uint256 value, uint256 gasLimit, bytes data) public;
}