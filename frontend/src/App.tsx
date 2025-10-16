import { useState, useEffect } from 'react';
import type { NFT, NFTRating } from './types/nft';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { useWalletNFTs } from './hooks/useWalletNFTs';
import { useVault } from './hooks/useVault';
import { useBurnNFT } from './helpers/sui';
import { FaWallet } from 'react-icons/fa';
import Header from './components/Header';
import NFTGrid from './components/NFTGrid';
import HiddenNFTsPanel from './components/HiddenNFTsPanel';
import VotingModal from './components/VotingModal';
import BurnConfirmModal from './components/BurnConfirmModal';


function App() {
  const account = useCurrentAccount();
  const { nfts: walletNFTs, loading, error, refetch } = useWalletNFTs();
  const { burnNFT, isPending: isBurning } = useBurnNFT();
  const { 
    hiddenNFTs: vaultHiddenNFTs, 
    loading: vaultLoading, 
    error: vaultError,
    hideNFTInVault,
    unhideNFTFromVault,
    createVaultForUser,
    isCreatingVault,
    hasVault,
    refreshHiddenNFTs
  } = useVault();
  
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showHiddenPanel, setShowHiddenPanel] = useState(false);
  const [showBurnModal, setShowBurnModal] = useState(false);
  const [nftToBurn, setNftToBurn] = useState<NFT | null>(null);

  const displayNFTs = account ? walletNFTs : [];

  useEffect(() => {
    const handleNFTHidden = () => {
      setTimeout(() => {
        refreshHiddenNFTs();
        refetch();
      }, 2000);
    };

    const handleNFTUnhidden = () => {
      setTimeout(() => {
        refreshHiddenNFTs();
        refetch();
      }, 2000);
    };

    window.addEventListener('nftHidden', handleNFTHidden);
    window.addEventListener('nftUnhidden', handleNFTUnhidden);

    return () => {
      window.removeEventListener('nftHidden', handleNFTHidden);
      window.removeEventListener('nftUnhidden', handleNFTUnhidden);
    };
  }, [refreshHiddenNFTs, refetch]);

  const handleVote = (nftId: string, rating: NFTRating) => {
    // backend servie for voting
    console.log('Voting on NFT:', nftId, rating);
    setShowVotingModal(false);
    setSelectedNFT(null);
  };

  const handleHide = async (nft: NFT) => {
    if (account && hasVault) {
      hideNFTInVault(nft.id);
      setTimeout(() => {
        refreshHiddenNFTs();
        refetch(); // Also refresh wallet NFTs
      }, 3000);
    } else if (account && !hasVault) {
      // Create vault firstthen hide the NFT
      createVaultForUser(() => {
        hideNFTInVault(nft.id);
        setTimeout(() => {
          refreshHiddenNFTs();
          refetch();
        }, 3000);
      });
    }
  };

  const handleBurn = (nft: NFT) => {
    setNftToBurn(nft);
    setShowBurnModal(true);
  };

  const confirmBurn = () => {
    if (!nftToBurn) return;

    burnNFT(nftToBurn.id);
    setShowBurnModal(false);
    setNftToBurn(null);
  };

  const cancelBurn = () => {
    setShowBurnModal(false);
    setNftToBurn(null);
  };

  const handleRemoveFromHidden = async (hiddenNFTId: string) => {
    if (hasVault && vaultHiddenNFTs.length > 0) {
      const hiddenNFT = vaultHiddenNFTs.find(nft => nft.id === hiddenNFTId);
      if (hiddenNFT) {
        unhideNFTFromVault(hiddenNFT.vaultIndex);
        setTimeout(() => {
          refreshHiddenNFTs();
          refetch(); // Also refresh wallet NFTs
        }, 3000);
      }
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
              hiddenCount={vaultHiddenNFTs.length}
              onRefresh={refetch}
              loading={loading || vaultLoading || isCreatingVault}
              error={error || vaultError}
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
                   hiddenNFTs={vaultHiddenNFTs.map(nft => ({
                     id: nft.id,
                     nft: nft.nft,
                     hiddenAt: nft.hiddenAt
                   }))}
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

        {showBurnModal && nftToBurn && (
          <BurnConfirmModal 
            nft={nftToBurn}
            isOpen={showBurnModal}
            onConfirm={confirmBurn}
            onCancel={cancelBurn}
            loading={isBurning}
          />
        )}
      </main>
    </div>
  );
}

export default App;