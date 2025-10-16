import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { getWalletVault, getHiddenNFTsFromVault, useHideNFT, useUnhideNFT, useCreateVault } from '../helpers/sui';
import type { HiddenNFTWithIndex } from '../types/nft';

export const useVault = () => {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [vaultId, setVaultId] = useState<string | null>(null);
  const [hiddenNFTs, setHiddenNFTs] = useState<HiddenNFTWithIndex[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { hideNFT, isPending: isHiding } = useHideNFT();
  const { unhideNFT, isPending: isUnhiding } = useUnhideNFT();
  const { createVault, isPending: isCreatingVault } = useCreateVault();

  const checkVault = async () => {
    if (!account?.address) {
      setVaultId(null);
      setHiddenNFTs([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const vault = await getWalletVault(account.address, client);
      setVaultId(vault);
      
      if (vault) {
        const hidden = await getHiddenNFTsFromVault(vault, client);
        setHiddenNFTs(hidden);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check vault');
      console.error('Error checking vault:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVault();
  }, [account?.address]);

  const hideNFTInVault = async (nftId: string) => {
    if (!vaultId) {
      setError('No vault found. Please create a vault first.');
      return;
    }

    hideNFT({ vaultId, nftId });
  };

  const unhideNFTFromVault = async (vaultIndex: number) => {
    if (!vaultId) {
      setError('No vault found.');
      return;
    }

    unhideNFT({ vaultId, index: vaultIndex });
  };

  const createVaultForUser = async (onSuccess?: () => void) => {
    if (!account?.address) {
      setError('No account connected');
      return;
    }

    createVault();
    
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    }, 3000);
  };

  const refreshHiddenNFTs = async () => {
    if (!vaultId || !account?.address) return;

    try {
      setLoading(true);
      const hidden = await getHiddenNFTsFromVault(vaultId, client);
      setHiddenNFTs(hidden);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh hidden NFTs');
    } finally {
      setLoading(false);
    }
  };

  return {
    vaultId,
    hiddenNFTs,
    loading,
    error,
    isHiding,
    isUnhiding,
    isCreatingVault,
    hideNFTInVault,
    unhideNFTFromVault,
    createVaultForUser,
    refreshHiddenNFTs,
    hasVault: !!vaultId
  };
};
