import './App.css'
import {DepositToCasino} from  './components/depositToCasino/depositToCasino';

// const client_id = import.meta.env.VITE_APP_CLIENT_ID

import {
  ConnectButton, useWallet,  addressEllipsis,  
  useAccountBalance,
  SuiChainId,
  ErrorCode,
  formatSUI
} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import * as tweetnacl from 'tweetnacl'
import {TransactionBlock, fromB64} from '@mysten/sui.js'
import {useMemo} from "react";

const OwnerCap='0xcfce2f7fe28f10949036ab67e1ba1a89df341d02bdb92c7dda5195b85afcf683';
const Casino = new Map([
  ['sui:devnet', '0x5a64d469ff0e39a2dd86d295bf268fd6ccb4474dde6495f5e90e5ef6a4f241e1::G5Game_core'],
  ['sui:testnet', '0x5a64d469ff0e39a2dd86d295bf268fd6ccb4474dde6495f5e90e5ef6a4f241e1::G5Game_core'],
  ['sui:mainnet', '0x5a64d469ff0e39a2dd86d295bf268fd6ccb4474dde6495f5e90e5ef6a4f241e1::G5Game_core'],
])


function Mytest (){
  return <span>a test </span>;
}


const App = () => {
  const wallet = useWallet();


  
  const {balance} = useAccountBalance();
  const casinoContractAddr = useMemo(() => {
    if (!wallet.chain) return '';
    return Casino.get(wallet.chain.id) ?? '';
  }, [wallet]);

console.log('casinoContractAddr', casinoContractAddr);

function uint8arrayToHex(value ) {
  if (!value) return ''
   return value.toString('hex')
}

async function handleExecuteMoveCall() {
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
            </div>
            <div className={'btn-group'} style={{margin: '8px 0'}}>
              {casinoContractAddr && (
                <button onClick={() => handleExecuteMoveCall(casinoContractAddr)}>Call {chainName(wallet.chain?.id)} fct</button>
              )}
              <button onClick={handleSignMsg}>signMessage</button>
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