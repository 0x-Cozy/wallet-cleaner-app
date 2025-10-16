import type { NFT, HiddenNFTWithIndex } from '../types/nft';
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import truncateString from './utils';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;

export async function getWalletObjects(walletAddress: string): Promise<any[]> {
  const client = useSuiClient();
    try {
    const objects = await client.getOwnedObjects({
        owner: walletAddress,
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      });

      return objects.data;
    } catch (error) {
      console.error('Error fetching wallet objects:', error);
      return [];
    }
  }

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
    type === 'success' 
      ? 'bg-green-600 text-white' 
      : 'bg-red-600 text-white'
  }`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};


export async function getWalletVault(walletAddress: string, client: any): Promise<string | null> {
  try {
    const objects = await client.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: `${PACKAGE_ID}::vault::Vault`
      },
      options: {
        showContent: true,
        showType: true
      }
    });

    if (objects.data.length > 0) {
      return objects.data[0].data?.objectId || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching vault:', error);
    return null;
  }
}

export async function getHiddenNFTsFromVault(vaultId: string, client: any): Promise<HiddenNFTWithIndex[]> {
  try {
    const vaultObject = await client.getObject({
      id: vaultId,
      options: {
        showContent: true,
        showDisplay: true,
        showType: true
      }
    });

    if (!vaultObject.data || !('content' in vaultObject.data)) {
      return [];
    }

    const content = vaultObject.data.content as any;

    if (!content.fields || !content.fields.indices) {
      return [];
    }

    const indices = content.fields.indices;
    const hiddenNFTs: HiddenNFTWithIndex[] = [];

    for (const index of indices) {
      try {
        const nftObject = await client.getDynamicFieldObject({
          parentId: vaultId,
          name: {
            type: 'u64',
            value: index.toString()
          }
        });

        if (nftObject.data && nftObject.data.objectId) {
          const actualNFT = await client.getObject({
            id: nftObject.data.objectId,
            options: {
              showContent: true,
              showDisplay: true,
              showType: true
            }
          });

          if (actualNFT.data && 'content' in actualNFT.data) {
            const nftContent = actualNFT.data.content as any;
            const nftDisplay = actualNFT.data.display as any;
            const nftType = actualNFT.data.type;

                  const nft: NFT = {
                    id: actualNFT.data.objectId,
                    name: String(nftDisplay?.data?.name || 
                          nftContent?.fields?.name || 
                          nftContent?.fields?.title ||
                          truncateString(String(nftType))),
                    image: String(nftDisplay?.data?.image_url || 
                           nftContent?.fields?.image_url || 
                           nftContent?.fields?.image ||
                           '/images/img.png'),
                    description: String(nftDisplay?.data?.description || 
                                nftContent?.fields?.description || 
                                nftContent?.fields?.desc ||
                                'No description'),
                    collection: String(nftDisplay?.data?.collection || 
                               nftContent?.fields?.collection || 
                               nftContent?.fields?.series ||
                               truncateString(String(nftContent?.fields?.package)) ||
                               truncateString(String(nftType)) ||
                               'Unknown Collection'),
                    rating: 'legit',
                    userVotes: {
                      legit: 0,
                      suspicious: 0,
                      scam: 0
                    }
                  };
                  
                  const hiddenNFTWithIndex: HiddenNFTWithIndex = {
                    id: actualNFT.data.objectId,
                    nft: nft,
                    hiddenAt: new Date(),
                    vaultIndex: index
                  };
                  
                  hiddenNFTs.push(hiddenNFTWithIndex);
            
            console.log('HIDDEN NFT DETAILS:', {
              id: nft.id,
              name: nft.name,
              image: nft.image,
              description: nft.description,
              collection: nft.collection,
              nftContent: nftContent,
              nftDisplay: nftDisplay
            });
          }
        }
      } catch (error) {
        console.error('Error fetching NFT details for index:', index, error);
      }
    }

    return hiddenNFTs;
  } catch (error) {
    console.error('Error fetching hidden NFTs from vault:', error);
    return [];
  }
}

export const useHideNFT = () => {
  const { mutateAsync } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const hideNFTMutation = useMutation({
    mutationFn: async ({ vaultId, nftId }: { vaultId: string, nftId: string }) => {
      const tx = new Transaction();

      const nftObject = await suiClient.getObject({
        id: nftId,
        options: {
          showType: true,
        },
      });

      if (!nftObject.data || !('type' in nftObject.data)) {
        throw new Error('NFT object not found or invalid');
      }

      const nftType = nftObject.data.type;

      if (!nftType) {
        throw new Error('NFT type not found');
      }

      tx.moveCall({
        target: `${PACKAGE_ID}::vault::hide_nft`,
        arguments: [
          tx.object(vaultId),
          tx.object(nftId),
        ],
        typeArguments: [nftType],
      });

      tx.setGasBudget(10000000);
      const result = await mutateAsync({ transaction: tx });
      await suiClient.waitForTransaction({ digest: result.digest });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOwnedObjects"] });
      queryClient.invalidateQueries({ queryKey: ["multiGetObjects"] });
      showToast('NFT hidden successfully!', 'success');
      
      window.dispatchEvent(new CustomEvent('nftHidden'));
    },
    onError: (error) => {
      console.error('Failed to hide NFT:', error);
      showToast('Failed to hide NFT. Please try again.', 'error');
    },
  });

  return {
    hideNFT: hideNFTMutation.mutate,
    isPending: hideNFTMutation.isPending,
  };
};

export const useCreateVault = () => {
  const { mutateAsync } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const createVaultMutation = useMutation({
    mutationFn: async () => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::vault::create_vault_entry`,
        arguments: [],
      });

      tx.setGasBudget(10000000);
      const result = await mutateAsync({ transaction: tx });
      await suiClient.waitForTransaction({ digest: result.digest });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOwnedObjects"] });
      queryClient.invalidateQueries({ queryKey: ["multiGetObjects"] });
      showToast('Vault created successfully!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create vault:', error);
      showToast('Failed to create vault. Please try again.', 'error');
    },
  });

  return {
    createVault: createVaultMutation.mutate,
    isPending: createVaultMutation.isPending,
  };
};

export const useUnhideNFT = () => {
  const { mutateAsync } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();
  const account = useCurrentAccount();
  const unhideNFTMutation = useMutation({
    mutationFn: async ({ vaultId, index }: { vaultId: string, index: number }) => {
      const tx = new Transaction();

      const nftObject = await suiClient.getDynamicFieldObject({
        parentId: vaultId,
        name: {
          type: 'u64',
          value: index.toString()
        }
      });

      if (!nftObject.data || !('type' in nftObject.data)) {
        throw new Error('NFT object not found or invalid');
      }

      const nftType = nftObject.data.type;
      if (!nftType) {
        throw new Error('NFT type not found');
      }

      console.log('NFT Type for unhide:', nftType);

      if (account) {
      const unhiddenNFT = tx.moveCall({
        target: `${PACKAGE_ID}::vault::unhide_nft`,
        arguments: [
          tx.object(vaultId),
          tx.pure.u64(index),
        ],
        typeArguments: [nftType],
      });

      tx.transferObjects([unhiddenNFT], tx.pure.address(account.address));

      tx.setGasBudget(10000000);
      const result = await mutateAsync({ transaction: tx });
      await suiClient.waitForTransaction({ digest: result.digest });

      return result;
      } else {
        throw new Error('No account connected');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOwnedObjects"] });
      queryClient.invalidateQueries({ queryKey: ["multiGetObjects"] });
      showToast('NFT unhidden successfully!', 'success');
      
      window.dispatchEvent(new CustomEvent('nftUnhidden'));
    },
    onError: (error) => {
      console.error('Failed to unhide NFT:', error);
      showToast('Failed to unhide NFT. Please try again.', 'error');
    },
  });

  return {
    unhideNFT: unhideNFTMutation.mutate,
    isPending: unhideNFTMutation.isPending,
  };
};

export const useBurnNFT = () => {
  const { mutateAsync } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const burnNFTMutation = useMutation({
    mutationFn: async (nftId: string) => {
      const tx = new Transaction();

      tx.transferObjects([tx.object(nftId)], '0x0');
      tx.setGasBudget(10000000);
      const result = await mutateAsync({ transaction: tx });
      await suiClient.waitForTransaction({ digest: result.digest });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOwnedObjects"] });
      queryClient.invalidateQueries({ queryKey: ["multiGetObjects"] });
      showToast('NFT burned successfully!', 'success');
    },
    onError: (error) => {
      console.error('Failed to burn NFT:', error);
      showToast('Failed to burn NFT. Please try again.', 'error');
    },
  });

  return {
    burnNFT: burnNFTMutation.mutate,
    isPending: burnNFTMutation.isPending,
  };
};