// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract TextInput {

  string public text;

  event TextSetEvent(string message, string newText);

  function setText(string memory _text) public {
    text = _text;
    emit TextSetEvent("A new text was set.", text);
  }

  function getText() public view returns (string memory) {
    return text;
  }
}