// Set CONNECT_AUTOMATICALLY to 'true' to automatically connect to Web3 Provider on page load. (main() will be called automatically when the page loads)
// Set CONNECT_AUTOMATICALLY to 'false' to enable "click to connect" button. (main() will be called when user clicks 'Connect' button)
const CONNECT_AUTOMATICALLY = true;

if(CONNECT_AUTOMATICALLY) {
  connectButton.setAttribute("disabled", "true");
  main();
} else {
  connectButton.onclick = main;
}

/* MAIN() (PLEASE READ)

Because dApps require reading data from a blockchain (an asynchronous process), creating a primary asynchronous function to contain all our code simplifies things. There are a number of required steps to initialize this dApp so that it may connect to "Web3", and also properly inform the user of any steps they might need to take to interact with the dApp.

Much of the code in the main() function is good code to include in any dApp you create.

SCROLL DOWN TOWARD THE BOTTOM OF THE MAIN() FUNCTION TO ADD YOUR OWN CODE

*/

async function main() {

  // INITIALIZAING STEPS (SKIP TO THE BOTTOM TO WRITE YOUR OWN CODE)

  // Display the loading icon (this will disappear once the user successfully connects)
  loadingIconConnect.style.display = "block";


  // Check website compatibility
  if(navigator.userAgent.indexOf("Safari") != -1
  && navigator.userAgent.indexOf("Chrome") == -1) {
    alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)");
    loadingIconConnect.style.display = "none";
    return;
  }
  console.log("Browser is Web3 compatible");




  // Check if MetaMask is installed
  if(!window.ethereum) {
    alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)");
    loadingIconConnect.style.display = "none";
    return;
  }
  console.log("MetaMask is installed");




  // Connect to a Web3 provider (MetaMask in most cases)
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");



  // Request to connect current wallet to the dApp
  try {
    await provider.send("eth_requestAccounts", []);
  } catch(error) {
    const errorMessage = "Cannot connect to wallet. There might be an issue with another browser extenstion. Try disabling some browser extensions (other than MetaMask), then attempt to reconnect."
    console.error(errorMessage, error);
    alert(errorMessage);
    loadingIconConnect.style.display = "none";
    return;
  }  
  console.log("Wallet connected");




  // Check if user is signed in to correct network
  // 1 - Mainnet
  // 5 - Goerli (Ethereum Testnet)
  // 137 - Polygon
  // 80001 - Mumbai (Polygon Testnet)
  const chainId = await provider.getNetwork();
  if(chainId.chainId != 5) {
    alert("Please switch to the Goerli Test Network in MetaMask. The page will automatically refresh after switching.");
    loadingIconConnect.style.display = "none";
    return;
  }
  console.log("Connected to Goerli");




  
  // Update the page to show the user is connected
  connectionStatus.textContent = "🟢 Connected";

  // Disable the 'Connect' button once the user is connected
  connectButton.setAttribute("disabled", "true");

  // Store the Signer (the account signed in to MetaMask) in a variable
  const signer = provider.getSigner();

  // Create a contract object based on the contract address and contract ABI from abi.js
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  // Use contractWithSigner whenever you have to execute a contract function that requires a transaction
  const contractWithSigner = contract.connect(signer);

  // Display the address of the signed-in wallet
  const connectedWalletAddress = await signer.getAddress();
  connectedWallet.textContent = connectedWalletAddress;
  console.log(`Connected Wallet: ${connectedWalletAddress}`);


  // A function to display the wallet's balance
  async function displayBalance() {
    // Store the wallet's balance
    let balance = await provider.getBalance(connectedWalletAddress);
    // Convert balance to a more readable decimal format
    balance = ethers.utils.formatEther(balance);
    // Display the wallet's balance
    goerliBalance.textContent = balance;

    // Notify the user they need Goerli ETH to do any transactions with this smart contract
    if(balance == 0) {
      goerliBalance.innerHTML+=` (Goerli ETH needed to interact with this contract. Visit <a href="https://goerlifaucet.com/" target="_blank">goerlifaucet.com</a> to get free Goerli ETH.)`;
    }
  }

  displayBalance()

  // Once all the above connection steps have completed, hide the loading icon.
  loadingIconConnect.style.display = "none";

  // Periodically check and update user's balance on the page 
  setInterval(displayBalance, 5000);

  // If the network changes, refresh the page. (e.g. the user switches from mainnet to goerli)
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

  // click the button with id 'increaseNumButton' to increase num 
  increaseNumButton.addEventListener('click', increaseNumber)


  ////////////// FUNCTIONS ///////////////////

  // A function to call the "increaseNum()" function in the contract
  async function increaseNumber() {
    console.log("Initiating transaction...");

    // Display a loading icon next to the 'Increase Number' button 
    loadingIconIncreaseNum.style.display = "block";
    
    // A 'try-catch' block is useful for improving the user experience when dealing with asynchronous JavaScript; it allows you to trigger events that happen when the asynchronous data you were waiting for never arrives. A try block "tries" to do something that might fail (like initiate a transaction), and if it fails (like a user rejects a transaction), the catch block "catches" the failure and reports an error, rather than let it pass.
    
    // In this instance, the 'try-catch' block allows the loading icon to be hidden if the user rejects a transaction. Without the try-catch block, we wouldn't be able to trigger any effects based on the failed transaction. Specifically, we wouldn't be able to hide the loading icon, meaning it would continue to spin, giving the appearace that something was still waiting to happen (even if nothing actually was, which is bad UX!).
    try {
      // Call the 'increaseNum()' function in the contract
      await contractWithSigner.increaseNum();
    } catch(error) {
      // If the user rejected the transaction, hide the loading icon
      loadingIconIncreaseNum.style.display = "none";
      // Log the errors to the console
      console.error("User rejected the transaction");
      console.error(error);
    }
    // If the user completed the transaction, hide the loading icon
    loadingIconIncreaseNum.style.display = "none";
  }

  // A function to read the "num" variable stored in the contract and update the page to display the number
  async function displayCurrentNumberFromContract() {
    currentNumberDisplay.textContent = await contract.getNum();
  }
}