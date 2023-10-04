import './App.css'

import {
  ConnectButton, useWallet,
  useAccountBalance,
  ErrorCode,
  formatSUI
} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { useMemo, useState, useEffect } from "react";

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

const casinoAddress = "0x6965bf15b754ae4e65198ab946ee3b80c8db8c2c681fb3e1f4f3ca30950eef2c";

const Casino = new Map([
  ['sui:devnet', '0xb158f466c17cc5b6e42211ed228f12288ed883a2432d152afee4db824767d766'],
  ['sui:testnet', '0xcfbe9730ce848436481b198060b8abe309f9d012bea8c068ce4cde5b3687335d'],
  ['sui:mainnet', '0xcfbe9730ce848436481b198060b8abe309f9d012bea8c068ce4cde5b3687335d'],
])




const App = () => {

  const sui_client = new SuiClient({ url: getFullnodeUrl('devnet') });


  const wallet = useWallet();


  // const { balance } = useAccountBalance();

  const casinoContractAddr = useMemo(() => {
    if (!wallet.chain) return '';
    return Casino.get(wallet.chain.id) ?? '';
  }, [wallet]);


  const [walletBalance, setWalletBalance] = useState("");
  const [casinoBalance, setCasinoBalance] = useState("");



  const getWalletBalance = async () => {
    try {
      const wallet_bal = await sui_client.getBalance({
        owner: wallet.account.address,
      });

      // Round the balance to three decimal places
      const roundedBalance = (wallet_bal.totalBalance / 1000000000).toFixed(3);

      // Update the state with the rounded balance
      setWalletBalance(roundedBalance);

      console.log(wallet.account.address);
      console.log(roundedBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  }


  console.log("Casino address", casinoAddress)

  // try to get casino balance
  const getCasinoBalance = async () => {

    try {
      const casino_bal = await sui_client.getBalance({
        owner: casinoAddress,
      });
      console.log(casino_bal);
      setCasinoBalance(casino_bal.totalBalance);


    } catch (error) {
      console.error("Error fetching casino balance:", error);
    }
  }

  // useEffect to get wallet balance on page render
  useEffect(() => {
    getWalletBalance(),
      getCasinoBalance();
  }, [wallet, casinoAddress]);


  async function DeposittoCasino() {
    console.log('DeposittoCasino 0', wallet)
    if (!wallet.account) return
    console.log('DeposittoCasino 1', wallet.getAccounts())
    const target = casinoContractAddr + "::G5Game_core::depositToCasino";
    try {
      const tx = new TransactionBlock()
      //split 1 sui to coin
      const coin = tx.splitCoins(tx.gas, [tx.pure(1000000000)]);
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
      alert("Deposit to Casino Successful!")
      getWalletBalance();
      console.log('executeMoveCall success', resData);
    } catch (e) {
      console.error('executeMoveCall failed', e);
    }
  }




  async function callPastEvents() {
    const past_events = await sui_client.queryEvents({
      query: { Sender: wallet.account.address },
      //filter:{Sender:'0x4651a914db63a612ea1fb775a6cb3c04439470279175556b45a8def3d0582497'},
      limit: 5,
    });
    console.log('past_events for that sender', past_events);




  }

  // async function subscribeEvents() {  //should be called
  //   //const myEventFilter={MoveModule:{ package: casinoContractAddr ,module:'g5Game_core'},};
  //   //const myEventFilter={MoveModule:{ package: casinoContractAddr ,module:'g5Game_core'},};

  //   const mysub = await sui_client.subscribeEvent({
  //     filter: { Sender: wallet.account.address },
  //     onMessage(event) {
  //       //     console.log('event',event);
  //     },
  //   });


  // }

  // async function unsubscribeEvents() {
  //   sui_client.unsubscribeEvent();
  // }



  async function callCasinoBalance() {

    // const wallet_bal = await sui_client.getBalance({
    //   owner: wallet.account.address,
    // });

    // console.log('wallet_bal', wallet_bal, 'address', wallet.account.address);

    // const casino_bal = await sui_client.getBalance({
    //   owner: casinoAddress,
    // });

    // console.log('casinoBalance', casino_bal, 'address', casinoAddress);


    // const rpcVersion = await sui_client.getRpcApiVersion();

    // console.log('getRpcApiVersion', rpcVersion);

    // const myObjectCasino = await sui_client.getOwnedObjects({ owner: wallet.account.address });

    // console.log('myObjectCasino', myObjectCasino);

    // const balance=await sui_client.queryBalance({
    //   address:casinoAddress,
    // });

    getCasinoBalance()
  }


  async function callGamblefct() {
    console.log('callGamblefct 0', wallet)
    if (!wallet.account) return
    console.log('callGamblefct 1', wallet.getAccounts())

    const target = casinoContractAddr + "::G5Game_core::gamble";
    try {
      const tx = new TransactionBlock()
      const coin = tx.splitCoins(tx.gas, [tx.pure(10000000)]);
      tx.setGasBudget(70000000);
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
      alert("You win. yaay!")
      getWalletBalance();
      console.log('executeMoveCall success', resData);
    } catch (e) {
      console.error('executeMoveCall failed', e);
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
              <p className="info">Wallet balance: {walletBalance} SUI</p>
            </div>
            <div className='casino-div'>
              <h3>Deposit some SUI to the casino and call gamble</h3>
              <p className="wallet-address">Casino address: {casinoAddress} </p>
              <p className="info">Casino balance: {casinoBalance} SUI</p>
            </div>
            <div className='btn-group'>
              <button className="action-btn" onClick={DeposittoCasino}>Deposit To Casino</button>
              <button className="action-btn" onClick={callGamblefct}>Call Gamble</button>
              <button className="action-btn" onClick={callPastEvents}>Call PastEvents</button>
              <button className="action-btn" onClick={callCasinoBalance}>Call CasinoBal</button>
            </div>
          </div>
        )}
      </div>

    </>
  )
};

export default App;