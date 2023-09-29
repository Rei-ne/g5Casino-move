import React,  { Component } from 'react';

import {
   ConnectButton, useWallet,  addressEllipsis,  
 } from '@suiet/wallet-kit';
 
export class  DepositToCasino extends Component{
   constructor(props) {
      super(props);  
      this.state = {
         value: '',
         casino: '',
         amount: '',
         message: ''
      };
   }  

   

   handleChange(event) {
      this.setState({value: event.target.value});
   }  


   render () {

//const mywallet=useWallet();       

      return <span> DepositToCasino Component </span>
}
}
