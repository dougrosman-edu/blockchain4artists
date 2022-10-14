// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract IncreaseNumber {

  // a number stored permanently in the contract
  uint public num;

  // an event that stores a string and a uint
  event NumIncreased(string message, uint newNumber);

  // function to increase num by 1
  function increaseNum() public {

    num++;

    // when num is increased, emit the 'NumIncreased' event with
    // the message "Number was increased", as well as the number
    emit NumIncreased("Number was increased", num);
  }

  // function to view the number stored in the contract
  function getNum() public view returns (uint) {
    return num;
  }
}