import './App.css'

import {
    ConnectButton, useWallet,  
    useAccountBalance,
    SuiChainId,
    ErrorCode,
    formatSUI
  } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import {TransactionBlock} from '@mysten/sui.js/transactions'
import {useMemo} from "react";



const Casino = new Map([
  ['sui:devnet', '0xba11890eba9ff9c9a90101c7815515d2287a81b49810612b9fb630048b1c37e3'],
  ['sui:testnet', '0xba11890eba9ff9c9a90101c7815515d2287a81b49810612b9fb630048b1c37e3'],
  ['sui:mainnet', '0xba11890eba9ff9c9a90101c7815515d2287a81b49810612b9fb630048b1c37e3'],
])

const App = () => {


  const wallet = useWallet();
  let arrayAccountObjects  =[];
  const {balance} = useAccountBalance();

  const casinoContractAddr = useMemo(() => {
    if (!wallet.chain) return '';
    return Casino.get(wallet.chain.id) ?? '';
  }, [wallet]);

console.log('casinoContractAddr', casinoContractAddr);

const casinoAddress="0x5835e6527d7362c7665bf98bf9b18c550e634a815d064eef791bbbadb6c4d8cc";
console.log('casinoAddress', casinoAddress);



function uint8arrayToHex(value ) {
  if (!value) return ''
   return value.toString('hex')
}


async function handleExecuteMoveCall(target) {
  if (!target) return;

  try {
    const tx = new TransactionBlock()
    tx.moveCall({
      target: target ,
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
  const target=casinoContractAddr+"::G5Game_core::depositToCasino";

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


const chainName = (chainId ) => {
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
    
    console.log('callGamblefct 0', wallet)
    if (!wallet.account) return
    console.log('callGamblefct 1', wallet.getAccounts())
    
    const target=casinoContractAddr+"::G5Game_core::gamble";
  
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
  
  
  















  return (
    <>
      <header>
      </header>
      <h3>
        Welcome to Game 5 Casino! 🎉
      </h3>
      <div className="card">
      <ConnectButton
          onConnectError={(error) => {
            if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
              console.warn('user rejected the connection to ' + error.details?.wallet)
            } else {
              console.warn('unknown connect error: ', error)
            }
          }}
        />
     

        {!wallet.connected ? (
          <p>Connect DApp with Suiet wallet from now!</p>
        ) : (
          <div>
            <div>
              <p>current wallet: {wallet.adapter?.name}</p>
              <p>
                wallet status:{' '}
                {wallet.connecting
                  ? 'connecting'
                  : wallet.connected
                    ? 'connected'
                    : 'disconnected'}
              </p>
              <p>wallet address: {wallet.account?.address}</p>
              <p>current network: {wallet.chain?.name}</p>
              <p>wallet balance: {formatSUI(balance ?? 0, {
                withAbbr: false
              })} SUI</p>
              <p>wallet publicKey: {uint8arrayToHex(wallet.account?.publicKey)}</p>
              <p>casino address: {casinoContractAddr } </p>
              <p> list of objects: {arrayAccountObjects}</p>

            </div>
            <div className={'btn-group'} style={{margin: '8px 0'}}>
              {casinoContractAddr && (
                <button onClick={() => handleExecuteMoveCall(casinoContractAddr)}>Call {chainName(wallet.chain?.id)} fct</button>
              )}
              <button onClick={handleSignMsg}>signMessage</button>
              <button onClick={DeposittoCasino}>Deposit To Casino </button>
              <button onClick={callGamblefct}>Call Gamble</button>
            </div>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and Suiet logos to learn more
      </p>




    </>
  )
};

export default App;