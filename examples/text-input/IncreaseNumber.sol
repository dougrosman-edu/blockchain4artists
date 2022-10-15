/*
Contract: IncreaseNumber
Author: Doug Rosman

This contract stores a number, and allows anyone to increase
that number

*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract IncreaseNumber {

  // a number stored permanently in the contract
  uint public num;

  // an event that stores a string and a uint
  event NumIncreasedEvent(string message, uint newNumber);

  // function to increase num by 1
  function increaseNum() public {

    // num++ is the shorthand version of 'num = num + 1'
    num++;

    // when num is increased, emit 'NumIncreasedEvent' with the
    // message "Number was increased", as well as the updated number
    emit NumIncreasedEvent("Number was increased", num);
  }

  // function to view the number stored in the contract
  function getNum() public view returns (uint) {
    return num;
  }
}