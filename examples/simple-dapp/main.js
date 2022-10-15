// connect to provider when user clicks button with id "connectButton"

// if you want the page to connect on page load automatically without having to press the 'connect' button, move the "main()" function outside of the onclick function below.
connectButton.onclick = function() {
  main();
}


// everything that happens on the page happens in the main() function
async function main() {

  // check website compatibility
  if(navigator.userAgent.indexOf("Safari") > -1) {
    alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)")
    return;
  }

  // check if user has installed MetaMask
  if(!window.ethereum) {
    alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)")
    return;
  }

  // connect to Web3 provider (MetaMask in most cases)
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  // check if user is signed in to correct network (Goerli)
  const chainId = await provider.getNetwork();
  if(chainId.chainId != 5) {
    alert("Please switch to the Goerli Test Network.");
    return;
  }
  
  // request to connect current wallet to website
  await provider.send("eth_requestAccounts", []);

  // store the signer (whoever is signed in to MetaMask) in a variable
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const contractWithSigner = contract.connect(signer);

  // if network changes (e.g. switching from mainnet to goerli, refresh the page)
  provider.on("network", (newNetwork, oldNetwork) => {
    if (oldNetwork) {
        window.location.reload();
    }
  });

  //---- EVERYTHING ABOVE THIS LINE SHOULD BE AT THE TOP OF ANY JAVASCRIPT FILE NEEDED FOR A WEB3-ENABLED SITE ----//

  /*
  *
  *
  * 
  * 
  * 
  * 
  */

  //-----------ADD YOUR CODE BELOW THIS LINE------------//


  ///////////// THINGS THAT HAPPEN WHEN CONNECTION IS ESTABLISHED ////////////

  // display the current number stored in the contract
  displayCurrentNumberFromContract();

  // display the address of the signed in wallet
  signerDisplay.textContent = await signer.getAddress();



  //////////// EVENT LISTENERS ////////////////

  // contract event: emits when NumIncreasedEvent is emitted by contract
  contract.on("NumIncreasedEvent", (message, newNumber) => {

    // update the text of the span with id "currentNumberDisplay" to the new number
    currentNumberDisplay.textContent = newNumber;
  });

  // click event: click the button with id 'increaseNumButton' to increase num 
  increaseNumButton.addEventListener('click', function() {
    
    // call the 'increaseNum()' function in the contract
    contractWithSigner.increaseNum();
  })


  ////////////// FUNCTIONS ///////////////////

  async function displayCurrentNumberFromContract() {

    // read the number stored in the contract using the 'getNum()' function in the contract
    const numberFromContract = await contract.getNum();

    // sets the text of the span with id "currentNumberDisplay" to the number
    currentNumberDisplay.textContent = numberFromContract;
  }
}