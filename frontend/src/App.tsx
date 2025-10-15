import { useState } from 'react';
import type { NFT, NFTRating, HiddenNFT } from './types/nft';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { useWalletNFTs } from './hooks/useWalletNFTs';
import { FaWallet } from 'react-icons/fa';
import Header from './components/Header';
import NFTGrid from './components/NFTGrid';
import HiddenNFTsPanel from './components/HiddenNFTsPanel';
import VotingModal from './components/VotingModal';


function App() {
  const account = useCurrentAccount();
  const { nfts: walletNFTs, loading, error, refetch } = useWalletNFTs();
  const [hiddenNFTs, setHiddenNFTs] = useState<HiddenNFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showHiddenPanel, setShowHiddenPanel] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const displayNFTs = account ? walletNFTs : [];

  const handleVote = (nftId: string, rating: NFTRating) => {
    // backend servie for voting
    console.log('Voting on NFT:', nftId, rating);
    setShowVotingModal(false);
    setSelectedNFT(null);
  };

  const handleHide = (nft: NFT) => {
    if (account) {
      // move contract interaction for hiding
      console.log('Hiding wallet NFT:', nft);
    } else {
      const hiddenNFT: HiddenNFT = {
        id: `hidden_${nft.id}_${Date.now()}`,
        nft,
        hiddenAt: new Date()
      };
      setHiddenNFTs(prev => [...prev, hiddenNFT]);
    }
  };

  const handleBurn = (nft: NFT) => {
    if (account) {
      // burning interaction or sending to 0x0
      console.log('Burning wallet NFT:', nft);
    } else {
      console.log('Burning NFT:', nft);
    }
  };

  const handleRemoveFromHidden = (hiddenNFTId: string) => {
    const hiddenNFT = hiddenNFTs.find(h => h.id === hiddenNFTId);
    if (hiddenNFT) {
      setHiddenNFTs(prev => prev.filter(h => h.id !== hiddenNFTId));
      // move contract interaction for unhiding
      console.log('Removing from hidden:', hiddenNFT.nft);
    }
  };

  const openVotingModal = (nft: NFT) => {
    setSelectedNFT(nft);
    setShowVotingModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header 
        onToggleHiddenPanel={() => setShowHiddenPanel(!showHiddenPanel)}
        hiddenCount={hiddenNFTs.length}
        onRefresh={refetch}
        loading={loading}
        error={error}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!account ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-2xl mx-auto">
              <div className="bg-blue-600/20 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaWallet className="text-blue-400 text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                To view and manage your NFTs, please connect your Sui wallet. 
                This will allow you to see all your NFTs and use the hide/burn functionality.
              </p>
              <div className="space-y-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <NFTGrid 
            nfts={displayNFTs}
            onVote={openVotingModal}
            onHide={handleHide}
            onBurn={handleBurn}
          />
        )}

        {showHiddenPanel && (
          <HiddenNFTsPanel 
            hiddenNFTs={hiddenNFTs}
            onRemove={handleRemoveFromHidden}
            onClose={() => setShowHiddenPanel(false)}
          />
        )}

        {showVotingModal && selectedNFT && (
          <VotingModal 
            nft={selectedNFT}
            onVote={handleVote}
            onClose={() => setShowVotingModal(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;