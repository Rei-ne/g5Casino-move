


#[allow(unused_field,unused_use,unused_variable,unused_function)]
module 0x0::BasicNFT {
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


    struct NFT has key {
        id:UID,
        name:String,
        description:String,
        url:Url,
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
        }
    }

    // add a function to mint an NFT and transfer it to an address
    public entry fun mint_to_address(_:&AdminCap,address_a:address,  name_str:vector<u8>,  description_str:vector<u8>,url_str:vector<u8>,ctx: &mut TxContext) {
    //public entry fun mint_to_address(address_a:address,  name_str:vector<u8>,  description_str:vector<u8>,url_str:vector<u8>,ctx: &mut TxContext) {
        let name = string::utf8(name_str);
        let description = string::utf8(description_str);
        let url = url::new_unsafe_from_bytes(url_str);
        let myNFT = create_nft( name,description, url,ctx);
        transfer::transfer( myNFT, address_a);
    }

    // add a function to create additional admin addresses

public entry fun mint_to_address_no_cap(address_a:address,  name_str:vector<u8>,  description_str:vector<u8>,url_str:vector<u8>,ctx: &mut TxContext) {
    //public entry fun mint_to_address(address_a:address,  name_str:vector<u8>,  description_str:vector<u8>,url_str:vector<u8>,ctx: &mut TxContext) {
        let name = string::utf8(name_str);
        let description = string::utf8(description_str);
        let url = url::new_unsafe_from_bytes(url_str);
        let myNFT = create_nft( name,description, url,ctx);
        transfer::transfer( myNFT, address_a);
    }



    // add getter functions for the NFT fields
        /// Get the NFT's `name`
    public entry fun name(nft: &NFT): string::String {
        nft.name
    }

    public entry fun description(nft: &NFT): string::String {
        nft.description
    }

    public entry fun url(nft: &NFT): Url {
        nft.url
    }







#[test]


fun test_create_nft() {
   
    let ctx =  tx_context::dummy();
    let dummy_address = @0xCAFE;    
    
    mint_to_address(dummy_address,b"test",b"test",b"https://www.alamy.com/stock-image-red-rose-flower-detailed-imge-166017846.html",&mut ctx);

  //  transfer::public_transfer(tt,dummy_address);



    
    // assert_eq!(nft.name,"test");
    // assert_eq!(nft.description,"test");
    // assert_eq!(nft.url,"https://www.alamy.com/stock-image-red-rose-flower-detailed-imge-166017846.html");

  
    }
}

