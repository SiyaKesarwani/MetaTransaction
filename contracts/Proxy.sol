// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Proxy{
  using ECDSA for bytes32;
  
  mapping(address => bool) private isWhitelisted;

  address toAddr = 0x9cC16250e83ebEf01EC56cfBA9C440C3C3dC56f5;

  
  // verify the data and execute the data at the target address
  function forward(address _to, bytes calldata _data, bytes memory _signature) payable external returns (bytes memory _result) {
    bool success;
    
    verifySignature(_to, _data, _signature);
    
    (success, _result) = _to.call(_data);
    if (!success) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            returndatacopy(0, 0, returndatasize())
            revert(0, returndatasize())
        }
    }
    
    payable(toAddr).transfer(msg.value);

  }
  
  // Recover signer public key and verify that it's a whitelisted signer.
  function verifySignature(address _to, bytes calldata _data, bytes memory signature) private view {
    require(_to != address(0), "invalid target address");
    
    bytes memory payload = abi.encode(_to, _data);
    address signerAddress = keccak256(payload).toEthSignedMessageHash().recover(signature);
    require(isWhitelisted[signerAddress], "Signature validation failed");
  }
  
  function addToWhitelist(address _signer) external {
      isWhitelisted[_signer] = true;
  }
}