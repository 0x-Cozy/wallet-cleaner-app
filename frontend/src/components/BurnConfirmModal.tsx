import { FaExclamationTriangle, FaTimes, FaFire } from 'react-icons/fa';
import type { NFT } from '../types/nft';

interface BurnConfirmModalProps {
  nft: NFT;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const BurnConfirmModal = ({ 
  nft, 
  isOpen, 
  onConfirm, 
  onCancel, 
  loading = false 
}: BurnConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600/20 p-3 rounded-xl">
              <FaFire className="text-red-400 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Burn NFT</h2>
              <p className="text-gray-400 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center space-x-3">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/img.png';
                }}
              />
              <div>
                <h3 className="text-white font-semibold">{nft.name}</h3>
                <p className="text-gray-400 text-sm">{nft.collection}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-red-400 text-lg mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-400 font-semibold mb-2">Warning: Permanent Loss</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• This NFT will be sent to address <code className="bg-gray-700 px-1 rounded">0x0</code></li>
                  <li>• This action cannot be reversed</li>
                  <li>• You will lose ownership forever</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Burning...</span>
                </>
              ) : (
                <>
                  <FaFire />
                  <span>Burn Forever</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnConfirmModal;
