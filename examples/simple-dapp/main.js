async function main() {

  // check website compatibility
  let userAgentString = navigator.userAgent;
  if(userAgentString.indexOf("Safari") > -1) {
    alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)")
    return;
  }

  // check if user has installed MetaMask
  if(!window.ethereum) {
    alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)")
    return;
  }

  // connect to Web3 provider
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  // check if user is signed in to correct network (Goerli)
  const chainId = await provider.getNetwork();
  if(chainId.chainId != 5) {
    alert("Please switch to the Goerli Test Network.");
    return;
  }
  
  // request to connect current wallet to website
  await provider.send("eth_requestAccounts", []);

  // store the signer (whoever is signed in) in a variable
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const contractWithSigner = contract.connect(signer);

  // if network changes (e.g. mainnet to goerli, refresh page)
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
  * 
  * 
  * 
  * 
  */

  //-----------ADD YOUR CODE BELOW THIS LINE------------//

  ///// THINGS THAT HAPPEN WHEN THE PAGE LOADS

  displayCurrentNumber();
  signerDisplay.textContent = await signer.getAddress();


  //////////////////////////// EVENT LISTENERS

  // contract event: emits when NumIncreased is called
  contract.on("NumIncreased", (message, newNumber) => {
    currentNum.textContent = +newNumber;
  });

  // click button to increase num 
  increaseNumButton.addEventListener('click', function() {
    contractWithSigner.increaseNum();
  })

  
  //////////////////////////// FUNCTIONS

  async function displayCurrentNumber() {
    let numFromContract = await contract.getNum();
    currentNum.textContent = +numFromContract;
  }

}

main();

// if the user clicks the connect button
connectButton.onclick = function() {
  main();
}








