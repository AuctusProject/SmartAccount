pragma solidity ^0.4.24;


contract AccountRoles {
  bytes32 public constant ROLE_TRANSFER_ETHER = keccak256("transfer_ether");
  bytes32 public constant ROLE_TRANSFER_TOKEN = keccak256("transfer_token");
  bytes32 public constant ROLE_TRANSFER_OWNERSHIP = keccak256("transfer_ownership");  
  
  /**
  * @dev modifier to validate the roles 
  * @param roles to be validated
  * // reverts
  */
  modifier validAccountRoles(bytes32[] roles) {
    for (uint8 i = 0; i < roles.length; i++) {
      require(roles[i] == ROLE_TRANSFER_ETHER 
        || roles[i] == ROLE_TRANSFER_TOKEN
        || roles[i] == ROLE_TRANSFER_OWNERSHIP, "Invalid account role");
    }
    _;
  }
}
