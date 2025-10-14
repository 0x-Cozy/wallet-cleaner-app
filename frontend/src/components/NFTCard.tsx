import React from 'react';
import type { NFT } from '../types/nft';
import { FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';

interface NFTCardProps {
  nft: NFT;
  onVote: () => void;
  onHide: () => void;
  onBurn: () => void;
  ratingColor: string;
  ratingIcon: React.ReactNode;
}

const NFTCard: React.FC<NFTCardProps> = ({ 
  nft, 
  onVote, 
  onHide, 
  onBurn, 
  ratingColor, 
  ratingIcon 
}) => {
  const getTotalVotes = () => {
    return nft.userVotes.legit + nft.userVotes.suspicious + nft.userVotes.scam;
  };

  const getVotePercentage = (votes: number) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="relative">
        <img 
          src={nft.image} 
          alt={nft.name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border ${ratingColor} backdrop-blur-sm`}>
          <span className="flex items-center space-x-1 text-sm font-medium">
            {ratingIcon}
            <span className="capitalize">{nft.rating}</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-lg truncate">{nft.name}</h3>
          <p className="text-gray-400 text-sm">{nft.collection}</p>
        </div>

        <p className="text-gray-300 text-sm line-clamp-2">{nft.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-green-400 flex items-center space-x-1">
              <FaCheckCircle />
              <span>Legit: {nft.userVotes.legit}</span>
            </span>
            <span className="text-yellow-400 flex items-center space-x-1">
              <FaExclamationTriangle />
              <span>Suspicious: {nft.userVotes.suspicious}</span>
            </span>
            <span className="text-red-400 flex items-center space-x-1">
              <FaExclamationCircle />
              <span>Scam: {nft.userVotes.scam}</span>
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="flex h-full">
              <div 
                className="bg-green-500 rounded-l-full" 
                style={{ width: `${getVotePercentage(nft.userVotes.legit)}%` }}
              />
              <div 
                className="bg-yellow-500" 
                style={{ width: `${getVotePercentage(nft.userVotes.suspicious)}%` }}
              />
              <div 
                className="bg-red-500 rounded-r-full" 
                style={{ width: `${getVotePercentage(nft.userVotes.scam)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onVote}
            className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/50 hover:border-blue-400/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Vote
          </button>
          <button
            onClick={onHide}
            className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-500/50 hover:border-yellow-400/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Hide
          </button>
          <button
            onClick={onBurn}
            className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 hover:border-red-400/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Burn
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
