module g5game::G5Game_core {
    // Part 1: imports
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::tx_context::{Self, TxContext};
    // Use this dependency to get a type wrapper for UTF-8 strings
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use std::vector;
    use sui::event;

    /// User doesn't have enough coins to play a round on the G5Game
    const ENotEnoughMoney: u64 = 1;
    const EOutOfService: u64 = 2;

    const EInvalidStakeAmount: u64 = 0;
    const EInvalidGuess: u64 = 1;
    const EInvalidBlsSig: u64 = 2;
    const EPoolNotEnough: u64 = 3;
    

    /// Max multiplier for someone to win. e.g. max gains of this casino is cost_per_agem * 1000 (5000*1000 = 5000000)
    const MaxWinningsMultiplier: u64 = 5;

    /// max amount of combinations (we have a spinner of 5 elements (4+0)
    const AmountOfCombinations: u8 = 4;

    struct Casino has key, store{
        id: UID,
        name: String,
        description: String,
        cost_per_game: u64,
        casino_balance: Balance<SUI>
    }

    struct CasinoOwnership has key, store{
        id: UID
    }

    struct GambleEvent has copy, drop{
        id: ID,
        winnings: u64,
        gambler: address,
        slot_1: u8,
        slot_2: u8,
        slot_3: u8,
        slot_4: u8,
        slot_5: u8,
        slot_6: u8
    }

      struct ProfitsCollected has copy, drop {
        amount: u64
    }


    // initialize our G5Game
    fun init(ctx: &mut TxContext) {

        // transfers owner capabilites to the sender of the transaction.
        transfer::transfer(CasinoOwnership{id: object::new(ctx)}, tx_context::sender(ctx));

        // create a new casino
        transfer::share_object(Casino {
            id: object::new(ctx),
            name: string::utf8(b"group5ino"),
            description: string::utf8(b"A small unsafe group5ino. Inspired by Manolis Liolios SUIZINO used  for the group5 MoveCamp."),
            cost_per_game: 5000,
            casino_balance: balance::zero()
        });

    }

    // get the cost per game Question: what does self stands for?
    public fun cost_per_game(self: &Casino): u64 {
        self.cost_per_game
    }

    public fun casino_balance(self:  &Casino): u64{
       balance::value<SUI>(&self.casino_balance)
    }

    // let's play a game
    //public entry fun gamble(casino: &mut Casino, wallet: &mut Coin<SUI>, ctx: &mut TxContext){
    public entry fun gamble(casino: &mut Casino, wallet: Coin<SUI>, ctx: &mut TxContext){

        // calculate max user earnings through the casino
       // let max_earnings = casino.cost_per_game * MaxWinningsMultiplier; // we calculate the maximum potential winnings on the casino.

        // Make sure Casino has enough money to support this gameplay.
       // assert!(casino_balance(casino) >= max_earnings, EOutOfService);
        // make sure we have enough money to play a game!
      //  assert!(coin::value(wallet) >= casino.cost_per_game, ENotEnoughMoney);

      let stake_amount = coin::value(&wallet);
        // assert!(
        //     stake_amount >= house.min_stake_amount &&
        //     stake_amount <= house.max_stake_amount,
        //     EInvalidStakeAmount
        // );
        let stake = coin::into_balance(wallet);
        // house place the stake
             
        assert!(casino_balance(casino) >= stake_amount, EPoolNotEnough);

        let house_stake = balance::split(&mut casino.casino_balance, stake_amount);
        //  the house matches the stake in the pot (stake)
        balance::join(&mut stake, house_stake);            
        // so nasty 100% back to casino this helped for debug has stake cannot be left  without drop
        balance::join(&mut casino.casino_balance, stake);  

        // get balance reference
       // let wallet_balance = coin::balance_mut(wallet);
    //   let wallet_balance = coin::into_balance(wallet);

    //     // get money from balance
    //     let payment = balance::split(&wallet_balance, casino.cost_per_game);

    //     // add to casino's balance.
    //     balance::join(&mut casino.casino_balance, payment);


        let uid = object::new(ctx);

        let randomNums = pseudoRandomNumGenerator(&uid);
        let winnings = 0;

        let slot_1 = *vector::borrow(&randomNums, 0);
        let slot_2 = *vector::borrow(&randomNums, 1);
        let slot_3 = *vector::borrow(&randomNums, 2);
         let slot_4 = *vector::borrow(&randomNums, 3);
        let slot_5 = *vector::borrow(&randomNums, 4);
        let slot_6 = *vector::borrow(&randomNums, 5);

        //possible couples of numbers cases
          let _ambo1 = false;
        let _ambo2 = false;
        let _ambo3 = false;
        let _ambo4 = false;
        let _ambo5 = false;
        let _ambo6 = false;
        
        //possible double couples of numbers cases: for example the occurrence of 2 couples of 2 differen numbers that are ugual
        let _doubleBIS = false;
        //possible tris of numbers cases
        let _tris = false;
        // no ugual numbers occurred, NO WINNING
        let _NOwinning=false;


        //TODO maybe I'll semplify the code with !assert - later or something else
            //ugual couple with slot1
      if(slot_1 == slot_2 || slot_1 == slot_3 || slot_1 == slot_4 || slot_1 == slot_5 || slot_1 == slot_6){ 
            let _ambo1 = true;
            
            //ugual couple with slot2
        }else if(slot_2 == slot_1 || slot_2 == slot_3 || slot_2 == slot_4 || slot_2 == slot_5 || slot_2 == slot_6){
             _ambo2 = true;
            //ugual couple with slot3
        }else if(slot_3 == slot_1 || slot_3 == slot_2 || slot_3 == slot_4 || slot_3 == slot_5 || slot_3 == slot_6){
             _ambo3 = true;
            //ugual couple with slot4
        }else if(slot_4 == slot_1 || slot_4 == slot_3 || slot_4 == slot_2 || slot_4 == slot_5 || slot_4 == slot_6){
             _ambo3 = true;
            //ugual couple with slot5
        }else if(slot_5 == slot_1 || slot_5 == slot_2 || slot_5 == slot_4 || slot_5 == slot_3 || slot_5 == slot_6){
             _ambo4 = true;
            //ugual couple with slot6
        }else if(slot_6 == slot_1 || slot_6 == slot_2 || slot_6 == slot_4 || slot_6 == slot_3 || slot_6 == slot_5){
             _ambo5 = true;
            //closing IF TODO-  ahead
        }


        else if(
            // slot 1=slot2=slot3
            (slot_1 == slot_2  && slot_2 == slot_3  )
        
            || 
            // slot1=slot3=slot4
            (slot_1 == slot_3  && slot_3== slot_4 )
            ||
            // slot1=slot4=slot2
            (slot_1 == slot_4  &&  slot_4 == slot_2 )

            ||
            // slot1=slot4=slot5
            (slot_1 == slot_4  && slot_4 == slot_5 ) 
            ||
            // slot1=slot4=slot6
            (slot_1 == slot_4  && slot_4 == slot_6 ) 
           
            ||
            // slot2=slot3=slot4
            (slot_2 == slot_3  && slot_3 == slot_4 ) 
            ||
            // slot2=slot3=slot5
            (slot_2 == slot_3  && slot_3 == slot_5 )
            ||
            // slot2=slot3=slot6
            (slot_2 == slot_3  && slot_3 == slot_6 )
            ||
           
            // slot3=slot4=slot5
            (slot_3 == slot_3  && slot_3 == slot_6 )
            ||
            // slot3=slot4=slot6
            (slot_3 == slot_4  && slot_4 == slot_6 )
            ||
            // slot4=slot5=slot6
            (slot_4 == slot_5  && slot_5 == slot_6 )

            )
            {
               let _tris=true;
            };


 // UNCOMPLETE CODE WORK IN PROGRESS 
     //TODO DOUBLE COUPLES AND DOUBLES TRIS OF UGUAL NUMBERS OCCURRING
     // TODO DIFFERENT WINNINGS FOR DIFFERENT CASES: 1 COUPLE, 2 COUPLES, 1 TRIS, 2 TRIS
   if ( _ambo1 == true || _ambo2 == true || _ambo3 == true || _ambo4 == true || _ambo5 == true|| _ambo6 == true){
        //


           let win_amount =  1*stake_amount;
            winnings=win_amount;
            event::emit(ProfitsCollected {amount: win_amount });
            //we pay the winner 2 times the stake
             let coin = coin::take(&mut casino.casino_balance, 2*stake_amount, ctx);
             transfer::public_transfer(coin, tx_context::sender(ctx));


    //case at least 1 tris of numbers are ugual
    }else if(_tris == true){
            
            
            let win_amount =  2*stake_amount;
            winnings=win_amount;
            event::emit(ProfitsCollected {amount: win_amount });
            //we pay the winner 2 times the stake
             let coin = coin::take(&mut casino.casino_balance, 2*stake_amount, ctx);
             transfer::public_transfer(coin, tx_context::sender(ctx));

        
        //case ALL numbers are ugual     
    }else if(slot_1 == slot_2 && slot_1 == slot_3 && slot_1 == slot_4 && slot_1 == slot_5 && slot_1 == slot_6){
           
            let win_amount =  10*stake_amount;
            winnings=win_amount;
            event::emit(ProfitsCollected {amount: win_amount });
            //we pay the winner 2 times the stake
             let coin = coin::take(&mut casino.casino_balance, 2*stake_amount, ctx);
             transfer::public_transfer(coin, tx_context::sender(ctx));


    

    //TODO THERE's a bug to fix it could occur 
    //1 couple of ugual numbers are counted 2 times 
    //as they were 2 couples instead it'a one only
    //TO DO: EXCLUDE that case

    //the case 2 couple of numbers occurring    
    }else if (

           // 2 couples where one occures with slot_1

           (_ambo1 == true && _ambo2 == true  ) 
            ||
           (_ambo1 == true && _ambo3 == true  ) 
           ||
           (_ambo1 == true && _ambo4 == true  ) 
            ||
           (_ambo1 == true && _ambo5 == true  ) 
           ||
           (_ambo1 == true && _ambo6 == true  ) 

            ||

           // 2 couples where one occures with slot_1

           (_ambo2 == true && _ambo1 == true  ) 
            ||
           (_ambo2 == true && _ambo3 == true  ) 
           ||
           (_ambo2 == true && _ambo4 == true  ) 
            ||
           (_ambo2 == true && _ambo5 == true  ) 
           ||
           (_ambo2 == true && _ambo6 == true  ) 

           ||

           // 2 couples where one occures with slot_2

           (_ambo2 == true && _ambo1 == true  ) 
            ||
           (_ambo2 == true && _ambo3 == true  ) 
           ||
           (_ambo2 == true && _ambo4 == true  ) 
            ||
           (_ambo2 == true && _ambo5 == true  ) 
           ||
           (_ambo2 == true && _ambo6 == true  ) 


           ||

           // 2 couples where one occures with slot_3

           (_ambo3 == true && _ambo1 == true  ) 
            ||
           (_ambo3 == true && _ambo2 == true  ) 
           ||
           (_ambo3 == true && _ambo4 == true  ) 
            ||
           (_ambo3 == true && _ambo5 == true  ) 
           ||
           (_ambo3 == true && _ambo6 == true  ) 

            ||
           // 2 couples where one occures with slot_4

           (_ambo4 == true && _ambo1 == true  ) 
            ||
           (_ambo4 == true && _ambo2 == true  ) 
           ||
           (_ambo4 == true && _ambo3 == true  ) 
            ||
           (_ambo4 == true && _ambo5 == true  ) 
           ||
           (_ambo4 == true && _ambo6 == true  ) 


            ||
           // 2 couples where one occures with slot_5

           (_ambo5 == true && _ambo1 == true  ) 
            ||
           (_ambo5 == true && _ambo2 == true  ) 
           ||
           (_ambo5 == true && _ambo3 == true  ) 
            ||
           (_ambo5 == true && _ambo4 == true  ) 
           ||
           (_ambo5 == true && _ambo6 == true  ) 


            ||
           // 2 couples where one occures with slot_6

           (_ambo6 == true && _ambo1 == true  ) 
            ||
           (_ambo6 == true && _ambo2 == true  ) 
           ||
           (_ambo6 == true && _ambo3 == true  ) 
            ||
           (_ambo6 == true && _ambo4 == true  ) 
           ||
           (_ambo6 == true && _ambo5 == true  ) 
    ){
         let _doubleBIS = true;

           {
            let win_amount =  10*stake_amount;
            winnings=win_amount;
            event::emit(ProfitsCollected {amount: win_amount });
            //we pay the winner 2 times the stake
             let coin = coin::take(&mut casino.casino_balance, 2*stake_amount, ctx);
             transfer::public_transfer(coin, tx_context::sender(ctx));

        };
    
    }else if(slot_1 != slot_2 && slot_1 != slot_3 && slot_1 != slot_4 && slot_1 != slot_5 && slot_1 != slot_6){
            let _NOwinning=true;
            


    }else{
           {
            let win_amount =  5*stake_amount;
            winnings=win_amount;
            event::emit(ProfitsCollected {amount: win_amount });
            //we pay the winner 2 times the stake
             let coin = coin::take(&mut casino.casino_balance, 2*stake_amount, ctx);
             transfer::public_transfer(coin, tx_context::sender(ctx));

        };
            // add winnings to user's wallet
    };



        

        // if(slot_1 == slot_2 && slot_2 == slot_3)
        // {
        //     let win_amount =  5*stake_amount;
        //     winnings=win_amount;
        //     event::emit(ProfitsCollected {amount: win_amount });
        //     //we pay the winner 2 times the stake
        //      let coin = coin::take(&mut casino.casino_balance, 2*stake_amount, ctx);
        //      transfer::public_transfer(coin, tx_context::sender(ctx));

        // };



        // emit event
        event::emit( GambleEvent{
            id: object::uid_to_inner(&uid),
            gambler: tx_context::sender(ctx),
            winnings,
            slot_1,
            slot_2,
            slot_3,
            slot_4,
            slot_5,
            slot_6,
        });
        // delete unused id
        object::delete(uid);
  
        // now let's play with luck!
  
  
    }

    /* A function for admins to deposit money to the casino so it can still function!  */
public entry fun depositToCasino( casino :&mut Casino,payment:  Coin<SUI>){
         let balance = coin::into_balance(payment);
        balance::join(&mut casino.casino_balance, balance);
    }


/* A function for admins to deposit money to the casino so it can still function!  */
    public entry fun anybodyDepositToCasino(casino :&mut Casino, amount: u64, payment: &mut Coin<SUI>){
        let availableCoins = coin::value(payment);
        assert!(availableCoins > amount, ENotEnoughMoney);
        let balance = coin::balance_mut(payment);
        let payment = balance::split(balance, amount);
        balance::join(&mut casino.casino_balance, payment);
    }

    public entry fun anybodydoNothing( payment: &mut Coin<SUI>){
        let availableCoins = coin::value(payment);
        assert!(availableCoins < 1, ENotEnoughMoney);
    }

    /*
       A function for admins to get their profits.
    */
    public entry fun withdraw(_:&CasinoOwnership, casino: &mut Casino, amount: u64, wallet: &mut Coin<SUI>){

        let availableCoins = casino_balance(casino);
        assert!(availableCoins > amount, ENotEnoughMoney);

        let balance = coin::balance_mut(wallet);

        // split money from casino's balance.
        let payment = balance::split(&mut casino.casino_balance, amount);

        // execute the transaction
        balance::join(balance, payment);
    }

    /*
        *** This is not production ready code. Please use with care ***
       Pseudo-random generator. requires VRF in the future to verify randomness! Now it just relies on
       transaction ids.
    */

    fun pseudoRandomNumGenerator(uid: &UID):vector<u8>{
        // create random ID
        let random = object::uid_to_bytes(uid);
        let vec = vector::empty<u8>();

        // add 3 random numbers based on UID of next tx ID.
        vector::push_back(&mut vec, (*vector::borrow(&random, 0) as u8) % AmountOfCombinations);
        vector::push_back(&mut vec, (*vector::borrow(&random, 1) as u8) % AmountOfCombinations);
        vector::push_back(&mut vec, (*vector::borrow(&random, 2) as u8) % AmountOfCombinations);
        vector::push_back(&mut vec, (*vector::borrow(&random, 3) as u8) % AmountOfCombinations);
        vector::push_back(&mut vec, (*vector::borrow(&random, 4) as u8) % AmountOfCombinations);
        vector::push_back(&mut vec, (*vector::borrow(&random, 5) as u8) % AmountOfCombinations);
        vec
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }



}
