module shield::vault;

use std::string::{utf8};
use sui::package;
use sui::display;

const EOnlyOwnerCanHide: u64 = 0;
const EOnlyOwnerCanUnhide: u64 = 1;

public struct VAULT has drop {}

public struct Vault<T> has key {
    id: UID,
    owner: address,
    hidden: vector<T>,
}

public struct ExampleNFT has key, store { id: UID }

fun init(otw: VAULT, ctx: &mut TxContext) {
    let keys = vector[
        utf8(b"name"),
        utf8(b"image_url"),
    ];
    let items = vector[
        utf8(b"Vault"),
        utf8(b"https://i.imgur.com/BkqIy0x.png"),
    ];
    let pub = package::claim(otw, ctx);
    let mut vault_display = display::new_with_fields<Vault<ExampleNFT>>(&pub, keys, items, ctx);
        
    display::update_version(&mut vault_display);

    transfer::public_transfer(pub, ctx.sender());
    transfer::public_transfer(vault_display, ctx.sender());
}

public fun create_vault<T>(ctx: &mut TxContext): Vault<T> {
    Vault<T> {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        hidden: vector::empty(),
    }
}

public fun hide_nft<T>(vault: &mut Vault<T>, nft: T, ctx: &mut TxContext) {
    assert!(vault.owner == tx_context::sender(ctx), EOnlyOwnerCanHide);
    vector::push_back(&mut vault.hidden, nft);
}

public fun unhide_nft<T>(vault: &mut Vault<T>, index: u64, ctx: &mut TxContext): T {
    assert!(vault.owner == tx_context::sender(ctx), EOnlyOwnerCanUnhide);
    vector::remove(&mut vault.hidden, index)
}

public fun get_hidden_nfts<T>(vault: &Vault<T>): &vector<T> {
    &vault.hidden
}


#[test_only]
public fun create_example_nft(ctx: &mut TxContext): ExampleNFT {
    ExampleNFT { id: object::new(ctx) }
}

#[test_only]
public fun destroy_example_nft(nft: ExampleNFT) {
    let ExampleNFT { id } = nft;
    object::delete(id);
}

#[test_only]
public fun clear_and_destroy_vault(vault: Vault<ExampleNFT>) {
    let Vault { id, owner: _, mut hidden} = vault;
    while (!vector::is_empty(&hidden)) {
        let ExampleNFT { id } = vector::pop_back(&mut hidden);
        object::delete(id);
    };
    vector::destroy_empty(hidden);
    object::delete(id);
}