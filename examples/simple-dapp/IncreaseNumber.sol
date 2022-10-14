// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract IncreaseNumber {

  uint public num;

  event NumIncreased(string message, uint newNumber);

  function increaseNum() public {
    num++;
    emit NumIncreased("Number was increased", num);
  }

  function getNum() public view returns (uint) {
    return num;
  }
}