import type { NFT, NFTRating } from '../types/nft';
import { FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

interface VotingModalProps {
  nft: NFT;
  onVote: (nftId: string, rating: NFTRating) => void;
  onClose: () => void;
}

const VotingModal = ({ nft, onVote, onClose }: VotingModalProps) => {
  const handleVote = (rating: NFTRating) => {
    onVote(nft.id, rating);
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

  const getRatingColor = (rating: NFTRating) => {
    switch (rating) {
      case 'legit':
        return 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30';
      case 'suspicious':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30';
      case 'scam':
        return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400 hover:bg-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Vote on NFT</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <img 
              src={nft.image} 
              alt={nft.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-white font-semibold text-lg mb-2">{nft.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{nft.collection}</p>
            <p className="text-gray-300 text-sm">{nft.description}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-white font-medium mb-3">Current Community Rating</h4>
            <div className="flex items-center space-x-3">
              {getRatingIcon(nft.rating)}
              <span className="text-white capitalize font-medium">{nft.rating}</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
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
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-medium">Your Vote</h4>
            <div className="space-y-2">
              {(['legit', 'suspicious', 'scam'] as NFTRating[]).map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleVote(rating)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${getRatingColor(rating)}`}
                >
                  {getRatingIcon(rating)}
                  <div className="text-left">
                    <div className="font-medium capitalize">{rating}</div>
                    <div className="text-sm opacity-75">
                      {rating === 'legit' && 'This NFT appears to be legitimate and safe'}
                      {rating === 'suspicious' && 'This NFT has some concerning characteristics'}
                      {rating === 'scam' && 'This NFT is likely a scam or fraudulent'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <p className="text-gray-400 text-sm text-center">
              Your vote helps improve the community's understanding of this NFT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;
