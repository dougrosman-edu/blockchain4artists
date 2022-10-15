// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract TextInput {

  string public word;

  event WordSetEvent(string message, string newWord);

  function setWord(string memory _word) public {
    word = _word;
    emit WordSetEvent("A new word was set.", word);
  }

  function getWord() public view returns (string memory) {
    return word;
  }
}