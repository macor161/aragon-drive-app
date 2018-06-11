pragma solidity ^0.4.4;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/apps/AppProxyUpgradeable.sol";
import "@aragon/os/contracts/kernel/KernelStorage.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";


pragma solidity ^0.4.18;


contract Datastore {

    event FileRename(address indexed entity, uint fileId);
    event FileContentUpdate(address indexed entity, uint fileId);
    event NewFile(address indexed entity, uint fileId);
    event NewWritePermission(address indexed entity, uint fileId);
    event NewReadPermission(address indexed entity, uint fileId);

    struct File {
        string storageRef;
        string name;
        uint fileSize;
        string keepRef;
        bool isPublic;
        bool isDeleted;
        address owner;
        uint lastModification;
        mapping (address => Permission) permissions;
        address[] permissionAddresses;
    }

    struct Permission {
        bool write;
        bool read;
        bool exists;
    }

    uint public lastFileId = 0;

    mapping (uint => File) private files;
    

    function addFile(string _storageRef, string _name, uint _fileSize, bool _isPublic) external returns (uint fileId) {
        lastFileId++;
        files[lastFileId] = File({ 
            storageRef: _storageRef,
            name: _name,
            fileSize: _fileSize,
            keepRef: "",
            isPublic: _isPublic,
            isDeleted: false,
            owner: msg.sender,
            lastModification: now,
            permissionAddresses: new address[](0)
        });
        NewFile(msg.sender, lastFileId);
        return lastFileId;
    }

    function getSender() external view returns (address) {
        return msg.sender;
    }

    function getFile(uint _fileId) 
        external
        view 
        returns (
            string storageRef,
            string name,
            uint fileSize,
            bool isPublic,
            bool isDeleted,
            address owner,
            bool isOwner,
            uint lastModification,
            address[] permissionAddresses,
            bool writeAccess
        ) 
    {
        File storage file = files[_fileId];

        storageRef = file.storageRef;
        name = file.name;
        fileSize = file.fileSize;
        isPublic = file.isPublic;
        isDeleted = file.isDeleted;
        owner = file.owner;
        isOwner = this.isOwner(_fileId, msg.sender);
        lastModification = file.lastModification;
        permissionAddresses = file.permissionAddresses;
        writeAccess = hasWriteAccess(_fileId, msg.sender);
    }

    function deleteFile(uint _fileId) public {
        require(isOwner(_fileId, msg.sender));

        files[_fileId].isDeleted = true;
    }

    function setFilename(uint _fileId, string _newName) external {
        require(hasWriteAccess(_fileId, msg.sender));

        files[_fileId].name = _newName;
        FileRename(msg.sender, lastFileId);
    }


    function setFileContent(uint _fileId, string _storageRef, uint _fileSize) external {
        require(hasWriteAccess(_fileId, msg.sender));

        files[_fileId].storageRef = _storageRef;
        files[_fileId].fileSize = _fileSize;
        FileContentUpdate(msg.sender, lastFileId);
    }

    function getPermissionAddresses(uint _fileId) external view returns (address[] addresses) {
        return files[_fileId].permissionAddresses;
    }

    function setWritePermission(uint _fileId, address _entity, bool _hasPermission) external {
        require(isOwner(_fileId, msg.sender));

        if (!files[_fileId].permissions[_entity].exists) {
            files[_fileId].permissionAddresses.push(_entity);
            files[_fileId].permissions[_entity].exists = true;
        }

        files[_fileId].permissions[_entity].write = _hasPermission;
        NewWritePermission(msg.sender, lastFileId);
    }

    function isOwner(uint _fileId, address _entity) public view returns (bool) {
        return files[_fileId].owner == _entity;
    }

    function hasReadAccess(uint _fileId, address _entity) public view returns (bool) {
        return files[_fileId].permissions[_entity].read;
    }

    function hasWriteAccess(uint _fileId, address _entity) public view returns (bool) {
        return isOwner(_fileId, _entity) || files[_fileId].permissions[_entity].write;
    }
}




contract DriveApp is AragonApp, Datastore {
    using SafeMath for uint256;

    /// Events
    event Increment(address indexed entity, uint256 step);
    event Decrement(address indexed entity, uint256 step);

    /// State
    uint256 public value;



    /// ACL
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");
    bytes32 constant public DATASTORE_ROLE = keccak256("DATASTORE_ROLE");



    function initialize() onlyInit external {
        initialized();

    }



    /**
     * @notice Increment the counter by `step`
     * @param step Amount to increment by
     */
    function increment(uint256 step) auth(INCREMENT_ROLE) external {
        value = value.add(step);
        Increment(msg.sender, step);
    }

    /**
     * @notice Decrement the counter by `step`
     * @param step Amount to decrement by
     */
    function decrement(uint256 step) auth(DECREMENT_ROLE) external {
        value = value.sub(step);
        Decrement(msg.sender, step);
    }
}




