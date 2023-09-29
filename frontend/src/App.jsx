import './App.css'


import {
  ConnectButton, useWallet,
} from '@suiet/wallet-kit';

let objectID = "";

const App = () => {
  const wallet = useWallet();

  async function handleSignAndExecuteTx() {

    console.log("Transacting")
    if (!wallet.connected) {
      alert("wallet not connected");
      return
    }
    try {
      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: 'moveCall',
          data: {
            packageObjectId: '0x2',
            module: 'devnet_nft',
            function: 'mint',
            typeArguments: [],
            arguments: [
              "Group5 NFT",
              "The most trusted wallet in the Move Ecosystem",
              "https://moveecosystem.com/wp-content/uploads/2022/12/martian.gif"
            ],
            gasBudget: 10000,
          }
        }
      });
      console.log('nft minted successfully!', resData);
      if (resData.EffectsCert) {
        objectID = resData?.EffectsCert?.effects?.effects?.created[0]?.reference?.objectId;
      }
      else {
        objectID = resData?.effects?.created[0]?.reference?.objectId;
      }
      console.log(objectID);
    } catch (e) {
      console.error('nft mint failed', e);
    }
    const mintAudio = new Audio('../spacesound.wav');
    mintAudio.play();
    var url = "https://explorer.sui.io/objects/" + encodeURIComponent(objectID);
    document.getElementById('mint-btn').style.cssText = `
      background-color: lightgreen;
      border-radius: 0;
    `;
    document.getElementById('mint-btn').innerHTML = '<p>Success! View NFT <a href="#" id="explorer-link">Here</a></p>'
    document.getElementById("explorer-link").href = url;
    document.getElementById('mint-btn').onclick = "";
  }



  return (
    <>
      <header>
        <ConnectButton>Connect Wallet to mint NFT</ConnectButton>
      </header>
      <h3>
        Welcome to Game 5 Casino! 🎉
      </h3>
      <p>

        <span className="gradient">Current chain of wallet: </span>
        {wallet.chain.name}


      </p>
      <button onClick={handleSignAndExecuteTx}>Mint NFT</button>

    </>
  )
};

export default App;