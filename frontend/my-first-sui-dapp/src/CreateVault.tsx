import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";

export const CreateVault = () => {
  const account = useCurrentAccount();
  const { mutateAsync } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const packageObjectId = "PACKAGE_ID"; 

  const handleCreateVault = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${packageObjectId}::shield::create_vault`,
      arguments: [],
      typeArguments: [],
    });

    try {
      const result = await mutateAsync({ transaction: tx });
      console.log("Transaction result:", result.digest);

      await suiClient.waitForTransaction({ digest: result.digest });

      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "testnet" || query.queryKey[0] === "getOwnedObject"
      });
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Transaction failed or was rejected.");
    }
  };

  return <Button onClick={handleCreateVault}>Create Vault</Button>;
};
