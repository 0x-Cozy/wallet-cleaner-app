export type NFTRating = 'legit' | 'suspicious' | 'scam';

export interface NFT {
  id: string;
  name: string;
  image: string;
  description: string;
  collection: string;
  rating: NFTRating;
  userVotes: {
    legit: number;
    suspicious: number;
    scam: number;
  };
  userRating?: NFTRating;
}

export interface HiddenNFT {
  id: string;
  nft: NFT;
  hiddenAt: Date;
}

export interface HiddenNFTWithIndex {
  id: string;
  nft: NFT;
  hiddenAt: Date;
  vaultIndex: number;
}

export interface UserVote {
  nftId: string;
  rating: NFTRating;
  timestamp: Date;
}
