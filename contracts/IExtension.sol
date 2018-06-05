pragma solidity ^0.4.24;


import "./AccountRoles.sol";
import "./ManagerExtension.sol";
import "./UIExtension.sol";


contract IExtension is UIExtension, ManagerExtension, AccountRoles {
}