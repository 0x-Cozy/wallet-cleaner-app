import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';
import type { NFT } from '../types/nft';
import truncateString from '../helpers/utils';

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

      console.log('Fetching NFTs for address:', account.address);
      
      const objects = await client.getOwnedObjects({
        owner: account.address,
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      });

      console.log('Total objects found:', objects.data.length);
      const walletNFTs: NFT[] = [];

      for (const object of objects.data) {
        if (object.data && 'content' in object.data) {
          const content = object.data.content as any;
          const display = object.data.display as any;
          const type = object.data.type;
          
          console.log('Object type:', type);
          console.log('Has display data:', display?.data);
          console.log('Content fields:', content?.fields);
          
          
          const isVaultObject = type?.includes('vault::Vault');
          const isCoinObject = type?.includes('coin::Coin');
          
          if (!isVaultObject && !isCoinObject) {
            const nft: NFT = {
              id: object.data.objectId,
              name: String(display?.data?.name || 
                    content?.fields?.name || 
                    content?.fields?.title ||
                    truncateString(String(type))),
              image: String(display?.data?.image_url || 
                     content?.fields?.image_url || 
                     content?.fields?.image ||
                     '/images/img.png'),
              description: String(display?.data?.description || 
                          content?.fields?.description || 
                          content?.fields?.desc ||
                          'No description'),
              collection: String(display?.data?.collection || 
                         content?.fields?.collection || 
                         content?.fields?.series ||
                         truncateString(String(content?.fields?.package)) ||
                         truncateString(String(type)) ||
                         'Unknown Collection'),
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

      console.log('Found NFTs:', walletNFTs.length, walletNFTs);
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
