import './App.css'

import {
  ConnectButton, useWallet,
  useAccountBalance,
  SuiChainId,
  ErrorCode,
  formatSUI
} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { useMemo } from "react";



const Casino = new Map([
  ['sui:devnet', '0xba11890eba9ff9c9a90101c7815515d2287a81b49810612b9fb630048b1c37e3'],
  ['sui:testnet', '0xba11890eba9ff9c9a90101c7815515d2287a81b49810612b9fb630048b1c37e3'],
  ['sui:mainnet', '0xba11890eba9ff9c9a90101c7815515d2287a81b49810612b9fb630048b1c37e3'],
])

const App = () => {


  const wallet = useWallet();
  let arrayAccountObjects = [];
  const { balance } = useAccountBalance();

  const casinoContractAddr = useMemo(() => {
    if (!wallet.chain) return '';
    return Casino.get(wallet.chain.id) ?? '';
  }, [wallet]);
  // try to get casino balance
  const casinoBalance = useMemo(() => {
    if (!wallet.chain) return '';
    return Casino.get(wallet.balance) ?? '';
  }, [wallet]);
  console.log('casinoContractAddr', casinoBalance);

  const casinoAddress = "0x5835e6527d7362c7665bf98bf9b18c550e634a815d064eef791bbbadb6c4d8cc";
  console.log('casinoAddress', casinoAddress);



  function uint8arrayToHex(value) {
    if (!value) return ''
    return value.toString('hex')
  }


  async function handleExecuteMoveCall(target) {
    if (!target) return;

    try {
      const tx = new TransactionBlock()
      tx.moveCall({
        target: target,
        arguments: [
          tx.pure('Suiet NFT'),
          tx.pure('Suiet Sample NFT'),
          tx.pure('https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4')
        ]
      })
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      console.log('executeMoveCall success', resData);
      alert('executeMoveCall succeeded (see response in the console)');
    } catch (e) {
      console.error('executeMoveCall failed', e);
      alert('executeMoveCall failed (see response in the console)');
    }
  }


  async function handleSignMsg() {
    if (!wallet.account) return
    try {
      const msg = 'Hello world!'
      const msgBytes = new TextEncoder().encode(msg)
      const result = await wallet.signMessage({
        message: msgBytes
      })
      const verifyResult = await wallet.verifySignedMessage(result, wallet.account.publicKey)
      console.log('verify signedMessage', verifyResult)
      if (!verifyResult) {
        alert(`signMessage succeed, but verify signedMessage failed`)
      } else {
        alert(`signMessage succeed, and verify signedMessage succeed!`)
      }
    } catch (e) {
      console.error('signMessage failed', e)
      alert('signMessage failed (see response in the console)')
    }
  }




  async function DeposittoCasino() {

    console.log('DeposittoCasino 0', wallet)
    if (!wallet.account) return
    console.log('DeposittoCasino 1', wallet.getAccounts())
    const target = casinoContractAddr + "::G5Game_core::depositToCasino";

    try {
      const tx = new TransactionBlock()
      const coin = tx.splitCoins(tx.gas, [tx.pure(500000000)]);
      tx.setGasBudget(100000000);
      tx.moveCall({
        target: target,
        arguments: [
          tx.object(casinoAddress),
          coin
        ]
      });



      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      console.log('executeMoveCall success', resData);
      //  alert('executeMoveCall succeeded (see response in the console)');
    } catch (e) {
      console.error('executeMoveCall failed', e);
      //  alert('executeMoveCall failed (see response in the console)');
    }
  }





  function getAddress() {
    if (!wallet.account) return null;
    return wallet.account.address;
  }


  // gets the user's object and checks if we have a casino ownership.
  // We also keep a list of SUI Coin addresses to use for transactions.
  //   const getUserCasinoOwnershipAndUserCoinAddresses = () => {
  //     const address = getAddress();
  //     if(!address) return;

  //     provider.getObjectsOwnedByAddress(address).then(res =>{
  //         let casinoOwnership = res.find(x => x.type.includes('CasinoOwnership') /*&& x.type.startsWith(moduleAddress)*/);
  //         if(casinoOwnership){
  //             console.log('casinoOwnership TRUE', casinoOwnership);
  //             //authStore.casinoAdmin.isAdmin = true;
  //             //authStore.casinoAdmin.objectAddress = casinoOwnership.objectId;
  //         }

  //         let coinAddresses = res.filter(x => x.type.includes('Coin'));

  //         provider.getObjectBatch(coinAddresses.map(x => x.objectId)).then(res=>{

  //             const coins = res.map(x => {
  //                 return {
  //                     id: x?.details?.data?.fields?.id?.id,
  //                     balance: x?.details?.data?.fields?.balance
  //                 }
  //             });
  //             console.log('coins', coins);

  //             //authStore.coins = coins;
  //         })

  //     }).catch(e =>{ console.log('error', e); });
  //        // uiStore.setNotification(e.message);
  //     });
  // }





  const chainName = (chainId) => {
    switch (chainId) {
      case SuiChainId.MAIN_NET:
        return 'Mainnet'
      case SuiChainId.TEST_NET:
        return 'Testnet'
      case SuiChainId.DEV_NET:
        return 'Devnet'
      default:
        return 'Unknown'
    }
  }






  async function callGamblefct() {
    const CREATION_FEE = 1000 * 1e9;
    console.log('callGamblefct 0', wallet)
    if (!wallet.account) return
    console.log('callGamblefct 1', wallet.getAccounts())
    const target = "0xfa5f05f0915dca5757ca7e499e9fa39e61ed354b0fcdee370aa25072e687ccd5::G5Game_core::anybodydoNothing";

    try {
      const tx = new TransactionBlock()
      tx.setGasBudget(100000000);
      const coin = tx.splitCoins(tx.gas, [tx.pure(50000)]);
      tx.moveCall({
        target: target,
        arguments: [
          //   tx.pure( OwnerCap),
          //tx.pure("0xf0758770c3a1439e873975f5add81d215a3914fba6869b84965b4255bfaa6740"),
          coin
          //tx.pure("500000"),
          //  tx.pure("0x23b130490999dee73eac63410117b80c227caf819f897911477b43411460fb9a"),

        ]
      });




      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      console.log('executeMoveCall success', resData);
      //   alert('executeMoveCall succeeded (see response in the console)');
    } catch (e) {
      console.error('executeMoveCall failed', e);
      //   alert('executeMoveCall failed (see response in the console)');
    }
  }


















  return (
    <>
      <header>

        <h1>
          Welcome to Group 5 Casino! 🎉
        </h1>
      </header>
      <div className="card">
        <div className='connect-btn'>
          <ConnectButton
            onConnectError={(error) => {
              if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
                console.warn('user rejected the connection to ' + error.details?.wallet)
              } else {
                console.warn('unknown connect error: ', error)
              }
            }}
          >Connect your wallet</ConnectButton></div>


        {!wallet.connected ? (
          <p>Connect DApp with Sui wallet!</p>
        ) : (
          <div className='container'>
            <div className="wallet-div">
              <p className="info">Current wallet: {wallet.adapter?.name}</p>
              <p className="info">
                Wallet status:{' '}
                {wallet.connecting
                  ? 'connecting'
                  : wallet.connected
                    ? 'connected'
                    : 'disconnected'}
              </p>
              <p className="wallet-address">Wallet address: {wallet.account?.address}</p>
              <p className="info">Current network: {wallet.chain?.name}</p>
              <p className="info">Wallet balance: {formatSUI(balance ?? 0, {
                withAbbr: false
              })} SUI</p>
            </div>
            <div className='casino-div'>
              <h3>Deposit some SUI to the casino and call gamble</h3>
              <p className="wallet-address">Casino address: {casinoContractAddr} </p>
              <p className="info">Casino balance: {formatSUI(casinoBalance ?? 0, {
                withAbbr: false
              })} SUI</p>
            </div>
            <div className='btn-group'>
              <button className="action-btn" onClick={DeposittoCasino}>Deposit To Casino</button>
              <button className="action-btn" onClick={callGamblefct}>Call Gamble</button>
            </div>
          </div>
        )}
      </div>

    </>
  )
};

export default App;