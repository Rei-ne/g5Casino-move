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

import { SuiClient,getFullnodeUrl } from '@mysten/sui.js/client';

const casinoAddress = "0x026c3a56cb7366f2e2422251fd7913c5536d98ea6327d8a1895fc29bf076412a";

const Casino = new Map([
  ['sui:devnet', '0x1832f5488b99342a50a02a85e08e671cf5a8fe11085f1540b67377a7e21dc6d4'],
  ['sui:testnet', '0x1832f5488b99342a50a02a85e08e671cf5a8fe11085f1540b67377a7e21dc6d4'],
  ['sui:mainnet', '0x1832f5488b99342a50a02a85e08e671cf5a8fe11085f1540b67377a7e21dc6d4'],
])




const App = () => {

  const sui_client=new SuiClient({url:getFullnodeUrl('devnet')});


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
  console.log('casinoAddress', casinoAddress);

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
      console.log('executeMoveCall success', resData);
    } catch (e) {
      console.error('executeMoveCall failed', e);
    }
  }




  async function callGamblefct() {
    console.log('callGamblefct 0', wallet)
    if (!wallet.account) return
    console.log('callGamblefct 1', wallet.getAccounts())

    const target=casinoContractAddr+"::G5Game_core::gamble";
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
        console.log('executeMoveCall success', resData);
      } catch (e) {
        console.error('executeMoveCall failed', e);
      }
    }

    async function callPastEvents(){
      const past_events=await sui_client.queryEvents({
        query:  {Sender:wallet.account.address},
        //filter:{Sender:'0x4651a914db63a612ea1fb775a6cb3c04439470279175556b45a8def3d0582497'},
        limit:5,
      });
      console.log('past_events',past_events);
    }




    
  async function subscribeEvents(){  //should be called in useEffect ?

    //const myEventFilter={MoveModule:{ package: casinoContractAddr ,module:'g5Game_core'},};
    //const myEventFilter={MoveModule:{ package: casinoContractAddr ,module:'g5Game_core'},};
 
    
    const mysub=await sui_client.subscribeEvent({
      filter:  {Sender:wallet.account.address},
      onMessage(event){
        console.log('event',event);
      },
    });



    }

    async function unsubscribeEvents(){
      sui_client.unsubscribeEvent();
    }


async function callCasinoBalance(){

  const wallet_bal = await sui_client.getBalance({
    owner: wallet.account.address,
  });

  console.log('wallet_bal',wallet_bal,'address',wallet.account.address);

  const casino_bal = await sui_client.getCoins({
    owner: casinoAddress,
  });

  console.log('casinoBalance',casino_bal,'address',casinoAddress);


  const rpcVersion = await sui_client.getRpcApiVersion();

  console.log('getRpcApiVersion',rpcVersion);

const myObjetcCasino=await sui_client.getObject({owner:casinoAddress});

console.log('myObjetcCasino',myObjetcCasino);

  // const balance=await sui_client.queryBalance({
  //   address:casinoAddress,
  // });
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
              <p className="wallet-address">Casino address: {casinoAddress} </p>
              <p className="info">Casino balance: {formatSUI(casinoBalance ?? 0, {
                withAbbr: false
              })} SUI</p>
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