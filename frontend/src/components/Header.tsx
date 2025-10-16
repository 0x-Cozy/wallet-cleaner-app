import { FaEye, FaSpinner } from 'react-icons/fa';
import { ConnectButton } from '@mysten/dapp-kit';

interface HeaderProps {
  onToggleHiddenPanel: () => void;
  hiddenCount: number;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string | null;
}

const Header = ({ onToggleHiddenPanel, hiddenCount, onRefresh, loading, error }: HeaderProps) => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-white font-mono italic">SHIELD</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleHiddenPanel}
              className="relative bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50"
            >
              <span className="flex items-center space-x-2">
                <FaEye />
                <span>Hidden NFTs</span>
                {hiddenCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {hiddenCount}
                  </span>
                )}
              </span>
            </button>
            
            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Refresh NFTs'}
              </button>
            )}
            
            <ConnectButton />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
