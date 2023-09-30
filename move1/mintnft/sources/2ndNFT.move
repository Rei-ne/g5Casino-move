#[allow(unused_field,unused_use,unused_variable,unused_function)]
module 0x0::LessBasicNFT {
    use sui::transfer::{Self};
    use sui::object::{Self, ID,UID};
    use sui::tx_context::{Self,TxContext};
    use sui::url::{Self, Url};
    use std::string::{Self,String};

    use std::debug;
    use std::option::{Self,Option};
    use std::vector;

    // add a capability for the admin role
    struct AdminCap has key {
        id : UID,
    }

    struct NFT has key,store {
        id:UID,
        name:String,
        description:String,
        url:Url,
        previousowner:address,
    }

    // add a funtion to initialise the program 
    fun init(ctx: &mut  TxContext) {
        let adminCap= AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(adminCap, tx_context::sender(ctx));
    }   

    // add a function to create an NFT
    fun create_nft(name:String, description:String, url:Url,ctx: &mut TxContext) :NFT {

        NFT {
            id: object::new(ctx),
            name:name,
            description:description,
            url:url,
            previousowner:tx_context::sender(ctx),
        }
    }

    // add a function to mint an NFT and transfer it to an address
    public entry fun mint_to_address(_:&AdminCap,address_a:address,  name_str:vector<u8>,  description_str:vector<u8>,url_str:vector<u8>,ctx: &mut TxContext) {
    //public entry fun mint_to_address(address_a:address,  name_str:vector<u8>,  description_str:vector<u8>,url_str:vector<u8>,ctx: &mut TxContext) {
        let name = string::utf8(name_str);
        let description = string::utf8(description_str);
        let url = url::new_unsafe_from_bytes(url_str);
        let myNFT = create_nft( name,description, url,ctx);
        //transfer::transfer( myNFT, address_a);
        transfer::public_transfer( myNFT, address_a);
    }

    // add a function to create additional admin addresses

  



    // add getter functions for the NFT fields
        /// Get the NFT's `name`
    public entry fun get_name(nft: &NFT): string::String {
        nft.name
    }

    public entry fun get_description(nft: &NFT): string::String {
        nft.description
    }

    public entry fun get_url(nft: &NFT): Url {
        nft.url
    }

    public entry fun get_previousowner(nft: &NFT): address {
        nft.previousowner
    }

    public fun set_previous_owner(nft : &mut NFT, new_address : address)  {
         nft.previousowner = new_address
    }

#[test]
fun test_create_nft() {
   
    let ctx =  tx_context::dummy();
    let dummy_address = @0xCAFE;    

  

    let mycap= AdminCap {
        id: object::new(&mut ctx),
    };

   

    mint_to_address(&mycap,dummy_address,b"test",b"test",b"https://www.alamy.com/stock-image-red-rose-flower-detailed-imge-166017846.html",&mut ctx);

  //  transfer::public_transfer(tt,dummy_address);
 transfer::transfer(mycap, dummy_address);

    // assert_eq!(nft.name,"test");
    // assert_eq!(nft.description,"test");
    // assert_eq!(nft.url,"https://www.alamy.com/stock-image-red-rose-flower-detailed-imge-166017846.html");

  
    }
}


#[allow(unused_field,unused_use,unused_variable,unused_function)]
module 0x0::NFTMarketPlace {

    use sui::transfer::{Self};
    use sui::object::{Self, ID,UID};
    use sui::tx_context::{Self,TxContext};
    use sui::url::{Self, Url};
    use std::string::{Self,String};
    use 0x0::LessBasicNFT::{Self,NFT};


    struct marketPlace has key,store {
        id:UID,
        name:String,
      
    }

    public entry fun transfer_nft(nft: NFT, address_a:address,ctx: &mut TxContext) {
        let my_address = tx_context::sender(ctx);
        LessBasicNFT::set_previous_owner(&mut nft,my_address);
        transfer::public_transfer(nft, address_a);
    }

}