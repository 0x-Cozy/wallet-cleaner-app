module shield::vault;

use std::string::{utf8};
use sui::package;
use sui::display;
use sui::dynamic_object_field as dof;

const EOnlyOwnerCanHide: u64 = 0;
const EOnlyOwnerCanUnhide: u64 = 1;
const ENotFound: u64 = 3;

public struct VAULT has drop {}

public struct Vault has key {
    id: UID,
    owner: address,
    indices: vector<u64>,
    next_index: u64,
}

fun init(otw: VAULT, ctx: &mut TxContext) {
    let keys = vector[
        utf8(b"name"),
        utf8(b"image_url"),
    ];
    let items = vector[
        utf8(b"Vault"),
        utf8(b"https://i.imgur.com/RE9dzyy.png"),
    ];
    let pub = package::claim(otw, ctx);
    let mut vault_display = display::new_with_fields<Vault>(&pub, keys, items, ctx);
    
    display::update_version(&mut vault_display);

    transfer::public_transfer(pub, ctx.sender());
    transfer::public_transfer(vault_display, ctx.sender());
}

public fun create_vault(ctx: &mut TxContext): Vault {
    Vault {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        indices: vector::empty(),
        next_index: 0,
    }
}

public entry fun create_vault_entry(ctx: &mut TxContext) {
    transfer::transfer(create_vault(ctx), tx_context::sender(ctx));
}

public fun hide_nft<Obj: key + store>(vault: &mut Vault, nft: Obj, ctx: &mut TxContext) {
    assert!(vault.owner == tx_context::sender(ctx), EOnlyOwnerCanHide);
    let index = vault.next_index;
    dof::add<u64, Obj>(&mut vault.id, index, nft);
    vector::push_back(&mut vault.indices, index);
    vault.next_index = index + 1;
}

public fun unhide_nft<Obj: key + store>(vault: &mut Vault, index: u64, ctx: &mut TxContext): Obj {
    assert!(vault.owner == tx_context::sender(ctx), EOnlyOwnerCanUnhide);
    let (found, pos) = vector::index_of(&vault.indices, &index);
    assert!(found, ENotFound);
    vector::remove(&mut vault.indices, pos);
    dof::remove<u64, Obj>(&mut vault.id, index)
}

public fun get_hidden_indices(vault: &Vault): &vector<u64> {
    &vault.indices
}


#[test_only]
public fun destroy_vault(vault: Vault) {
    let Vault { id, owner: _, mut indices, next_index: _ } = vault;
    while (!vector::is_empty(&indices)) {
        let _ = vector::pop_back(&mut indices);
    };
    vector::destroy_empty(indices);
    object::delete(id);
}