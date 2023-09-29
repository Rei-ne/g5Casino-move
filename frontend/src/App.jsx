import './App.css'

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

//export const suiRpcUrl = 'https://fullnode.devnet.sui.io:443'

const OwnerCap='0xcfce2f7fe28f10949036ab67e1ba1a89df341d02bdb92c7dda5195b85afcf683';

//const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });

const Casino = new Map([
  ['sui:devnet', '0xac4d9c62091570a928124289bfed3bce5f4fd273cae6ef5d6fe341fd52533d1a'],
  ['sui:testnet', '0xac4d9c62091570a928124289bfed3bce5f4fd273cae6ef5d6fe341fd52533d1a'],
  ['sui:mainnet', '0xac4d9c62091570a928124289bfed3bce5f4fd273cae6ef5d6fe341fd52533d1a'],
])


function Mytest (){
  return <span>a test </span>;
}

//const provider = new JsonRpcProvider(suiRpcUrl);



const App = () => {


  const wallet = useWallet();
  let arrayAccountObjects  =[];
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




async function refreshAccountObjects() {
  console.log('refreshAccountObjects 0', wallet)
  if (!wallet.account) return
  console.log('refreshAccountObjects 1', wallet.getAccounts())
  const target="0xac4d9c62091570a928124289bfed3bce5f4fd273cae6ef5d6fe341fd52533d1a::G5Game_core::anybodyDepositToCasino";

    try {
      const tx = new TransactionBlock()
     // const [coin] = tx.splitCoins(tx.gas, [tx.pure(10000000)]);
    //  tx.setGasBudget(10000000);
      // Transfer the split coin to a specific address.
    //  tx.transferObjects([coin], tx.pure("0x26755bebf3d61936b39b14e1f7e6802e27ce6c1baddc016f3b739d22dd272c5f"));
    //tx.setGasPrice(100000000);
    tx.setGasBudget(100000000);

    tx.setGasPayment([coin1, coin2]);
       tx.moveCall({
         target: target,
         arguments: [
       //   tx.pure( OwnerCap),
          tx.pure("0xf0758770c3a1439e873975f5add81d215a3914fba6869b84965b4255bfaa6740"),
          tx.pure("5000"),
          tx.pure("0x23b130490999dee73eac63410117b80c227caf819f897911477b43411460fb9a"),
        ]
      });
      


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
              <p>casino address: {casinoContractAddr } </p>
              <p> list of objects: {arrayAccountObjects}</p>

            </div>
            <div className={'btn-group'} style={{margin: '8px 0'}}>
              {casinoContractAddr && (
                <button onClick={() => handleExecuteMoveCall(casinoContractAddr)}>Call {chainName(wallet.chain?.id)} fct</button>
              )}
              <button onClick={handleSignMsg}>signMessage</button>
              <button onClick={refreshAccountObjects}>Refresh Objects</button>
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