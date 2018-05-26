pragma solidity ^0.4.23;


import "../node_modules/openzeppelin-solidity/contracts/access/SignatureBouncer.sol";


contract SmartAccount is SignatureBouncer {
	string public version = "0.0.1";
	mapping(address => bool) public extensionAuthorized;
	address[] public extensions;
	
	event Authorization(address plugin, bool authorized);
	event TransferOwnership(address sender, address owner, address newOwner);
	event Transfer(address sender, address destination, uint256 value);
	event Execute(address sender, address destination, uint256 value, uint256 gasLimit, bytes data);

	modifier authorized() {
	    require(extensionAuthorized[msg.sender] || msg.sender == owner, "Unauthorized");
	    _;
	}
	
	constructor() public {
		addBouncer(msg.sender);
	}
	
	function() payable external {
	}
	
	function extensionsCount() view external returns(uint256) {
	    return extensions.length;
	}
	
	function extensionByIndex(uint256 _index) view external returns(address) {
	    return extensions[_index];
	}
	
	function authorization(address _extension, bool _authorized) onlyOwner external {
	    if (_authorized) {
	        require(!extensionAuthorized[_extension], "Already authorized");
	        extensions.push(_extension);
	    } else {
	        require(extensionAuthorized[_extension], "Already unauthorized");
            address last = extensions[extensions.length - 1];
            if (last != _extension) {
                for (uint256 i = 0; i < extensions.length; ++i) {
                    if (extensions[i] == _extension) {
                        extensions[i] = last;
                        break;
                    }
                }
            }
            extensions.length--;
	    }
		extensionAuthorized[_extension] = _authorized;
		emit Authorization(_extension, _authorized);
	}
	
	function transferOwnership(address _newOwner) public authorized {
        require(_newOwner != address(0));
        owner = _newOwner;
        emit TransferOwnership(msg.sender, owner, _newOwner);
    }
	
	function transfer(address _destination, uint256 _value) authorized public {
	    _destination.transfer(_value);
	    emit Transfer(msg.sender, _destination, _value);
	}
	
	function execute(address _destination, uint256 _value, uint256 _gasLimit, bytes _data) authorized public {
        internalExecute(_destination, _value, _gasLimit, _data);
    }
    
	function executeSigned(address _destination, uint256 _value, uint256 _gasLimit, bytes _data, bytes _sign) public {
	    require(isValidDataHash(keccak256(abi.encodePacked(address(this), _destination, _value, _data)), _sign));
	    internalExecute(_destination, _value, _gasLimit, _data);
    }
    
    //TODO: include nonce and no reentrancy
    function internalExecute(address _destination, uint256 _value, uint256 _gasLimit, bytes _data) private {
        if (_gasLimit > 0) {
            assert(_destination.call.value(_value).gas(_gasLimit)(_data));
	    } else {
	        assert(_destination.call.value(_value)(_data));
	    }
        emit Execute(msg.sender, _destination, _value, _gasLimit, _data);   
    }
}