module shield::vault;

use std::string::{utf8};
use sui::package;
use sui::display;

const EOnlyOwnerCanHide: u64 = 0;
const EOnlyOwnerCanUnhide: u64 = 1;
const EOnlyOwnerCanAdd: u64 = 2;
const EOnlyOwnerCanRemove: u64 = 3;

public struct VAULT has drop {}

public struct Vault<T> has key {
    id: UID,
    owner: address,
    hidden: vector<T>,
    platform_hidden: vector<ID>,
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

public fun create_vault<T: store>(ctx: &mut TxContext): Vault<T> {
    Vault<T> {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        hidden: vector::empty(),
        platform_hidden: vector::empty(),
    }
}

public fun hide_nft<T: store>(vault: &mut Vault<T>, nft: T, ctx: &mut TxContext) {
    assert!(vault.owner == tx_context::sender(ctx), EOnlyOwnerCanHide);
    vector::push_back(&mut vault.hidden, nft);
}

public fun unhide_nft<T: store>(vault: &mut Vault<T>, index: u64, ctx: &mut TxContext): T {
    assert!(vault.owner == tx_context::sender(ctx), EOnlyOwnerCanUnhide);
    vector::remove(&mut vault.hidden, index)
}

public fun get_hidden_nfts<T: store>(vault: &Vault<T>): &vector<T> {
    &vault.hidden
}


public fun add_to_platform_hidden<T: store>(
    vault: &mut Vault<T>,
    nft_id: ID,
    ctx: &mut TxContext
) {
    let owner = tx_context::sender(ctx);
    assert!(vault.owner == owner, EOnlyOwnerCanAdd);
    
    vector::push_back(&mut vault.platform_hidden, nft_id);
}

public fun remove_from_platform_hidden<T: store>(
    vault: &mut Vault<T>,
    nft_id: ID,
    ctx: &mut TxContext
) {
    let owner = tx_context::sender(ctx);
    assert!(vault.owner == owner, EOnlyOwnerCanRemove);
    
    let mut index = find_id_index(&vault.platform_hidden, nft_id);
    if (option::is_some(&index)) {
        let _ = vector::remove(&mut vault.platform_hidden, option::extract(&mut index));
    };
}

public fun get_platform_hidden<T: store>(vault: &Vault<T>): &vector<ID> {
    &vault.platform_hidden
}

fun find_id_index(vec: &vector<ID>, target_id: ID): Option<u64> {
    let mut i = 0;
    let len = vector::length(vec);
    while (i < len) {
        if (vector::borrow(vec, i) == &target_id) {
            return option::some(i)
        };
        i = i + 1;
    };
    option::none()
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
    let Vault { id, owner: _, mut hidden, mut platform_hidden} = vault;
    while (!vector::is_empty(&hidden)) {
        let ExampleNFT { id } = vector::pop_back(&mut hidden);
        object::delete(id);
    };
    vector::destroy_empty(hidden);

    while (!vector::is_empty(&platform_hidden)) {
        let _ = vector::pop_back(&mut platform_hidden);
    };
    vector::destroy_empty(platform_hidden);
    object::delete(id);
}