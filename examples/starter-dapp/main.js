// set to 'true' to automatically connect to Web3 Provider on page load
// set to 'false' to enable "click to connect" button
const CONNECT_AUTOMATICALLY = false;

if(CONNECT_AUTOMATICALLY) {
  connectButton.setAttribute("disabled", "true");
  main();
} else {
  connectButton.onclick = main;
}


// Everything that happens on the page happens in the main() function. Any code that interacts with a blockchain should be written in main()
async function main() {
  loadingIconConnect.style.display = "block";

  // check website compatibility
  if(navigator.userAgent.indexOf("Safari") != -1
  && navigator.userAgent.indexOf("Chrome") == -1) {
    alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)")
    return;
  }
  console.log("Browser is Web3 compatible");


  // check if user has installed MetaMask
  if(!window.ethereum) {
    alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)")
    return;
  }
  console.log("MetaMask is installed");


  // connect to Web3 provider (MetaMask in most cases)
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  // request to connect current wallet to website
  try {
    await provider.send("eth_requestAccounts", []);
  } catch(error) {
    const errorMessage = "Cannot connect to wallet. There might be an issue with another Chrome Extenstion. Try disabling some Chrome extensions (other than MetaMask), then attempt to reconnect"
    console.error(errorMessage, error);
    alert(errorMessage);
    return;
  }

  await provider.send("eth_requestAccounts", []);
  
  
  console.log("Wallet connected")

  // check if user is signed in to correct network (Goerli)
  const chainId = await provider.getNetwork();
  if(chainId.chainId != 5) {
    alert("Please switch to the Goerli Test Network. The page will automatically refresh after switching.");
    return;
  }
  console.log("Connected to Goerli");
  
  
  connectionStatus.textContent = "🟢 Connected";
  connectButton.setAttribute("disabled", "true");

  // store the signer (whoever is signed in to MetaMask) in a variable
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const contractWithSigner = contract.connect(signer);

  // display the address of the signed in wallet
  const connectedWalletAddress = await signer.getAddress();
  connectedWallet.textContent = connectedWalletAddress;
  console.log(`Connected Wallet: ${connectedWalletAddress}`);

  // display the user's balance
  let balance = (await provider.getBalance(connectedWalletAddress));
  // Convert balance to a more readable decimal format
  balance = ethers.utils.formatEther(balance);
  goerliBalance.textContent = balance;
  if(balance == 0) {
    goerliBalance.innerHTML+=` (Goerli ETH needed to interact with this contract. Visit <a href="https://goerlifaucet.com/" target="_blank">goerlifaucet.com</a> to get free Goerli ETH.)`;
  }
  console.log(`Goerli ETH balance: ${balance}`);

  loadingIconConnect.style.display = "none";

  // periodically check and update user's balance on the page 
  setInterval(async function() {
    let balance = (await provider.getBalance(connectedWalletAddress));
  // Convert balance to a more readable decimal format
  balance = ethers.utils.formatEther(balance);
  goerliBalance.textContent = balance;
  if(balance == 0) {
    goerliBalance.innerHTML+=` (Goerli ETH needed to interact with this contract. Visit <a href="https://goerlifaucet.com/" target="_blank">goerlifaucet.com</a> to get free Goerli ETH.)`;
  }
  }, 5000);

  // If the blockchain network changes (e.g. the user switches from mainnet to goerli) Refresh the page
  provider.on("network", (newNetwork, oldNetwork) => {
    if (oldNetwork) {
        window.location.reload();
    }
  });

  //----------------------------------------------------//
  //-----------ADD YOUR CODE BELOW THIS LINE------------//
  //----------------------------------------------------//


  // display the current number stored in the contract
  displayCurrentNumberFromContract();


  //////////// EVENT LISTENERS ////////////////

  // contract event: emits when NumIncreasedEvent is emitted by contract
  contract.on("NumIncreasedEvent", (message, newNumber) => {

    // update the text of the span with id "currentNumberDisplay" to the new number
    currentNumberDisplay.textContent = newNumber;
  });

  // click event: click the button with id 'increaseNumButton' to increase num 
  increaseNumButton.addEventListener('click', async function() {
    
    console.log("Initiating transaction...");
    loadingIconIncreaseNum.style.display = "block";
    // call the 'increaseNum()' function in the contract
    await contractWithSigner.increaseNum();
    loadingIconIncreaseNum.style.display = "none";
  })


  ////////////// FUNCTIONS ///////////////////

  async function displayCurrentNumberFromContract() {

    // Read the number stored in the contract using the contract's 'getNum()' function, and set the text of the span with id "currentNumberDisplay" to the number
    currentNumberDisplay.textContent = await contract.getNum();
  }
}