import type { HiddenNFT } from '../types/nft';
import { FaEye, FaTimes } from 'react-icons/fa';

interface HiddenNFTsPanelProps {
  hiddenNFTs: HiddenNFT[];
  onRemove: (hiddenNFTId: string) => void;
  onClose: () => void;
}

const HiddenNFTsPanel = ({ hiddenNFTs, onRemove, onClose }: HiddenNFTsPanelProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Hidden NFTs</h2>
              <p className="text-gray-400">Manage your hidden NFT collection</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {hiddenNFTs.length === 0 ? (
            <div className="text-center py-16">
              <FaEye className="text-6xl mb-4 mx-auto text-yellow-400" />
              <h3 className="text-2xl font-bold text-white mb-2">No Hidden NFTs</h3>
              <p className="text-gray-400">NFTs you hide will appear here for safe keeping.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hiddenNFTs.map((hiddenNFT) => (
                  <div
                    key={hiddenNFT.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300"
                  >
                    <div className="relative">
                      <img 
                        src={hiddenNFT.nft.image} 
                        alt={hiddenNFT.nft.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-2 py-1 rounded-full backdrop-blur-sm">
                        <span className="text-xs font-medium flex items-center space-x-1">
                          <FaEye />
                          <span>Hidden</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-white font-semibold text-sm truncate">{hiddenNFT.nft.name}</h3>
                        <p className="text-gray-400 text-xs">{hiddenNFT.nft.collection}</p>
                      </div>

                      <button
                        onClick={() => onRemove(hiddenNFT.id)}
                        className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/50 hover:border-blue-400/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Restore to Wallet
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Hidden NFT Summary</h4>
                    <p className="text-gray-400 text-sm">
                      {hiddenNFTs.length} NFT{hiddenNFTs.length !== 1 ? 's' : ''} currently hidden
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Safely Hidden in your vault (still in your wallet)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiddenNFTsPanel;
