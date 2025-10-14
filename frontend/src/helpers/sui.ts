import { SuiClient } from '@mysten/sui/client';
import type { NFT } from '../types/nft';

const SUI_RPC_URL = 'https://fullnode.mainnet.sui.io:443';

export class SuiService {
  private client: SuiClient;

  constructor() {
    this.client = new SuiClient({ url: SUI_RPC_URL });
  }

  async getWalletNFTs(walletAddress: string): Promise<NFT[]> {
    try {
      const objects = await this.client.getOwnedObjects({
        owner: walletAddress,
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      });

      const nfts: NFT[] = [];

      for (const object of objects.data) {
        if (object.data && 'content' in object.data) {
          const content = object.data.content as any;
          const display = object.data.display as any;
          const type = object.data.type;
          
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

            nfts.push(nft);
          }
        }
      }

      return nfts;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  }

  async getWalletObjects(walletAddress: string): Promise<any[]> {
    try {
      const objects = await this.client.getOwnedObjects({
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
}

export const suiService = new SuiService();
