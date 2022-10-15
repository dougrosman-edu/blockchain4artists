connectButton.onclick = main;

async function main() {
  if(navigator.userAgent.indexOf("Safari") > -1) {
    alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)")
    return;
  }
  if(!window.ethereum) {
    alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)")
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const chainId = await provider.getNetwork();
  if(chainId.chainId != 5) {
    alert("Please switch to the Goerli Test Network.");
    return;
  }
  
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const contractWithSigner = contract.connect(signer);

  // if network changes, refresh the page
  provider.on("network", (newNetwork, oldNetwork) => {
    if (oldNetwork) {
        window.location.reload();
    }
  });

  //-----------ADD YOUR CODE BELOW THIS LINE------------//


  // CODE THAT EXECUTES AFTER CONNECTING
  displayText();

  // EVENT LISTENERS
  contract.on("TextSetEvent", (message, newText) => {
    textDisplay.textContent = newText;
  });
 
  textInputButton.onclick = setText;

  // FUNCTIONS
  async function displayText() {
    textDisplay.textContent = await contract.getText();;
  }

  function setText() {
    const newText = textInput.value;
    contractWithSigner.setText(newText);
  }
}