import { useState } from 'react';
import type { NFT, NFTRating, HiddenNFT } from './types/nft';
import sampleNFTs from './data/sampleNFTs.json';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useWalletNFTs } from './hooks/useWalletNFTs';
import Header from './components/Header';
import NFTGrid from './components/NFTGrid';
import HiddenNFTsPanel from './components/HiddenNFTsPanel';
import VotingModal from './components/VotingModal';

function App() {
  const account = useCurrentAccount();
  const { nfts: walletNFTs, loading, error, refetch } = useWalletNFTs();
  const [nfts, setNfts] = useState<NFT[]>(sampleNFTs as NFT[]);
  const [hiddenNFTs, setHiddenNFTs] = useState<HiddenNFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showHiddenPanel, setShowHiddenPanel] = useState(false);

  const displayNFTs = account ? walletNFTs : nfts;

  const handleVote = (nftId: string, rating: NFTRating) => {
    setNfts(prev => prev.map(nft => 
      nft.id === nftId 
        ? { 
            ...nft, 
            userRating: rating,
            userVotes: {
              ...nft.userVotes,
              [rating]: nft.userVotes[rating] + 1
            }
          }
        : nft
    ));
    setShowVotingModal(false);
    setSelectedNFT(null);
  };

  const handleHide = (nft: NFT) => {
    const hiddenNFT: HiddenNFT = {
      id: `hidden_${nft.id}_${Date.now()}`,
      nft,
      hiddenAt: new Date()
    };
    setHiddenNFTs(prev => [...prev, hiddenNFT]);
    setNfts(prev => prev.filter(n => n.id !== nft.id));
  };

  const handleBurn = (nft: NFT) => {
    setNfts(prev => prev.filter(n => n.id !== nft.id));
    console.log('Burning NFT:', nft);
  };

  const handleRemoveFromHidden = (hiddenNFTId: string) => {
    const hiddenNFT = hiddenNFTs.find(h => h.id === hiddenNFTId);
    if (hiddenNFT) {
      setHiddenNFTs(prev => prev.filter(h => h.id !== hiddenNFTId));
      setNfts(prev => [...prev, hiddenNFT.nft]);
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
        <NFTGrid 
          nfts={displayNFTs}
          onVote={openVotingModal}
          onHide={handleHide}
          onBurn={handleBurn}
        />

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