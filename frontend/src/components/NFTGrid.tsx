import React from 'react';
import type { NFT, NFTRating } from '../types/nft';
import { FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaCheck } from 'react-icons/fa';
import NFTCard from './NFTCard';

interface NFTGridProps {
  nfts: NFT[];
  onVote: (nft: NFT) => void;
  onHide: (nft: NFT) => void;
  onBurn: (nft: NFT) => void;
}

const NFTGrid: React.FC<NFTGridProps> = ({ nfts, onVote, onHide, onBurn }) => {
  const getRatingColor = (rating: NFTRating) => {
    switch (rating) {
      case 'legit':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'suspicious':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'scam':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getRatingIcon = (rating: NFTRating) => {
    switch (rating) {
      case 'legit':
        return <FaCheckCircle className="text-green-400" />;
      case 'suspicious':
        return <FaExclamationTriangle className="text-yellow-400" />;
      case 'scam':
        return <FaExclamationCircle className="text-red-400" />;
      default:
        return <FaExclamationCircle className="text-gray-400" />;
    }
  };

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16">
        <FaCheck className="text-6xl mb-4 mx-auto text-green-400" />
        <h3 className="text-2xl font-bold text-white mb-2">All Clean!</h3>
        <p className="text-gray-400">No NFTs to review at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your NFTs</h2>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <FaCheckCircle className="text-green-400" />
              <span className="text-white">Legit</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaExclamationTriangle className="text-yellow-400" />
              <span className="text-white">Suspicious</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaExclamationCircle className="text-red-400" />
              <span className="text-white">Scam</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            onVote={() => onVote(nft)}
            onHide={() => onHide(nft)}
            onBurn={() => onBurn(nft)}
            ratingColor={getRatingColor(nft.rating)}
            ratingIcon={getRatingIcon(nft.rating)}
          />
        ))}
      </div>
    </div>
  );
};

export default NFTGrid;
