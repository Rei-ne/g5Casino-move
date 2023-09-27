import './App.css'


// const client_id = import.meta.env.VITE_APP_CLIENT_ID

import {
  ConnectButton, useWallet,
} from '@suiet/wallet-kit';

const App = () => {
  const wallet = useWallet();

  return (
    <>
      <header>
        <ConnectButton>Connect Wallet</ConnectButton>
      </header>
      <h3>
        Welcome to Game 5 Casino! 🎉
      </h3>
      <p>

        <span className="gradient">Current chain of wallet: </span>
        {wallet.chain.name}
      </p>

    </>
  )
};

export default App;