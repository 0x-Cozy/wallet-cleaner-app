import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';
import type { NFT } from '../types/nft';

export const useWalletNFTs = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!account?.address) {
      setNfts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const objects = await client.getOwnedObjects({
        owner: account.address,
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      });

      const walletNFTs: NFT[] = [];

      for (const object of objects.data) {
        if (object.data && 'content' in object.data) {
          const content = object.data.content as any;
          const display = object.data.display as any;
          const type = object.data.type;
          
          //check if it's a n nft object with display
          const hasDisplayData = display?.data && (
            display.data.name || 
            display.data.image_url || 
            display.data.description
          );
          
          const isNFTType = type?.includes('nft') || 
                           type?.includes('NFT') || 
                           type?.includes('collectible') ||
                           type?.includes('token');
          
          if (hasDisplayData || isNFTType) {
            const nft: NFT = {
              id: object.data.objectId,
              name: display?.data?.name || 
                    content?.fields?.name || 
                    content?.fields?.title ||
                    'Unknown NFT',
              image: display?.data?.image_url || 
                     content?.fields?.image_url || 
                     content?.fields?.image ||
                     '/images/img.png',
              description: display?.data?.description || 
                          content?.fields?.description || 
                          content?.fields?.desc ||
                          'No description',
              collection: display?.data?.collection || 
                         content?.fields?.collection || 
                         content?.fields?.series ||
                         'Unknown Collection',
              rating: 'legit',
              userVotes: {
                legit: 0,
                suspicious: 0,
                scam: 0
              }
            };

            walletNFTs.push(nft);
          }
        }
      }

      setNfts(walletNFTs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
      console.error('Error fetching NFTs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [account?.address]);

  return {
    nfts,
    loading,
    error,
    refetch: fetchNFTs
  };
};
