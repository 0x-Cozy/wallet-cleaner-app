## Sui Wallet Cleanup App - RFP 1 mini implementation

SHIELD is a small demo app built to help clean up your Sui wallet.

It lets you:
- **Burn unwanted NFTs** by sending them to a burn address.  
- **Hide NFTs** by creating a Soulbound "Vault" object where you can store their IDs.  

The hiding logic uses a SBT (soulbound token) vault with dynamic object fields.  
Other methods like `bags` or `object_bags` could have been used too.

> ⚠️ The voting system mentioned in the UI isn’t implemented — it would require a backend for handling votes and decisions.

---

### How it works
- When you choose to hide an NFT, it gets linked inside your vault as a dynamic field.
- When you burn an NFT, it’s transferred to a burn address.
- You can later unhide NFTs by unlinking them from the vault.

This isn’t a production tool — it’s just a working demo to show how cleanup actions could work on Sui.

---

### Setup

Create a `.env` file and add:

VITE_PACKAGE_ID=0x6e1856bacc3a234213b73a5c55c876ebdc5bf27602a6a46193731e77d82deedb

---

Feel free to fork or modify it.
The code is kept straightforward so it’s easy to extend or hook into a backend later.