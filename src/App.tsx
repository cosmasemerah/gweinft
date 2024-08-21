import {
  ClaimButton,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getContract } from "thirdweb";
import { formatUnits } from "ethers";

import { client, chain, token, contractAddress, claimId } from "./client";

import Header from "./components/header";
import Footer from "./components/footer";
import { useMemo, useState } from "react";

export function App() {
  // State to track the quantity of NFTs to mint
  const [quantity, setQuantity] = useState(1);

  const account = useActiveAccount();

  const contract = getContract({
    client,
    address: contractAddress,
    chain: chain,
  });

  //   // Get the claim condition details by ID
  const { data: claimConditionData } = useReadContract({
    contract,
    method:
      "function getClaimConditionById(uint256 _tokenId, uint256 _conditionId) view returns ((uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata) condition)",
    params: [token, claimId],
  });

  // Get the total circulating supply of NFTs
  const { data: claimedSupply, isLoading: isLoadingClaimedSupply } =
    useReadContract({
      contract,
      method: "function totalSupply(uint256 id) view returns (uint256)",
      params: [token],
    });

  const { data: supplyClaimedByWallet } = useReadContract({
    contract,
    method:
      "function getSupplyClaimedByWallet(uint256 _tokenId, uint256 _conditionId, address _claimer) view returns (uint256 supplyClaimedByWallet)",
    params: [
      token,
      claimId,
      account?.address || "0x0000000000000000000000000000000000000000",
    ],
  });

  // Calculate the total available supply of NFTs
  const totalAvailableSupply = useMemo(() => {
    return BigInt(claimConditionData?.maxClaimableSupply || 0);
  }, [claimConditionData?.maxClaimableSupply]);

  // Get the number of NFTs claimed so far
  const numberClaimed = useMemo(() => {
    return BigInt(claimedSupply || 0).toString();
  }, [claimedSupply]);

  // Calculate the total number of NFTs Left
  const numberTotal = BigInt(
    claimConditionData?.maxClaimableSupply || 0
  ).toString();

  // Calculate the maximum number of NFTs to mint
  const maxClaimable = useMemo(() => {
    let bnMaxClaimable = BigInt(claimConditionData?.maxClaimableSupply || 0);
    let perTransactionClaimable = BigInt(
      claimConditionData?.quantityLimitPerWallet || 0
    );

    if (perTransactionClaimable <= bnMaxClaimable) {
      bnMaxClaimable = perTransactionClaimable;
    }

    let max;
    if (totalAvailableSupply < bnMaxClaimable) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max >= 1_000_000) {
      return 1_000_000;
    }
    return max;
  }, [
    totalAvailableSupply,
    claimConditionData?.maxClaimableSupply,
    claimConditionData?.quantityLimitPerWallet,
  ]);

  const maxClaimableByWallet = useMemo(() => {
    const claimedByWallet = BigInt(supplyClaimedByWallet || 0);
    const limitPerWallet = BigInt(
      claimConditionData?.quantityLimitPerWallet || 0
    );
    const remainingForWallet = limitPerWallet - claimedByWallet;

    return remainingForWallet < maxClaimable
      ? remainingForWallet
      : maxClaimable;
  }, [
    supplyClaimedByWallet,
    claimConditionData?.quantityLimitPerWallet,
    maxClaimable,
  ]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigInt(claimConditionData?.pricePerToken || 0);
    const totalPrice = bnPrice * BigInt(quantity);
    return `${formatUnits(totalPrice.toString(), 18)} ETH`;
  }, [claimConditionData?.pricePerToken, quantity]);
  console.log(priceToMint);

  // Check if the NFTs are sold out
  const isSoldOut = useMemo(() => {
    return (
      BigInt(claimConditionData?.maxClaimableSupply || 0) <=
      BigInt(claimedSupply || 0)
    );
  }, [claimConditionData?.maxClaimableSupply, claimedSupply]);

  const canClaim = useMemo(() => {
    return !isSoldOut;
  }, [isSoldOut]);

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return "Sold Out";
    }

    if (canClaim) {
      const pricePerToken = BigInt(claimConditionData?.pricePerToken || 0);
      if (pricePerToken === BigInt(0)) {
        return "Mint (Free)";
      }
      return `Mint (${priceToMint})`;
    }

    return "Claiming not available";
  }, [isSoldOut, canClaim, priceToMint, claimConditionData]);

  return (
    <>
      <Header />
      <main className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-mokoto">Gwei Token Presale Pass</h1>
        <div className="py-14">
          <>
            <div className="flex items-center justify-center mb-10">
              <MediaRenderer
                className="h-[24rem] w-[24rem] rounded-xl"
                client={client}
                src="https://ipfs.io/ipfs/bafybeigmyczgj5hr7a66x3boegnh4x6lrmke5htnr26ojd43klxjlvocgq/IMG_5717.png"
                width="200"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-6 mb-20">
              <div className="flex w-full items-start justify-between gap-[10%]">
                <div>
                  <p>Total Minted</p>
                </div>
                <div className="text-dark">
                  {claimedSupply ? (
                    <p>
                      <b>{numberClaimed}</b>
                      {" / "}
                      {numberTotal || "∞"}
                    </p>
                  ) : (
                    // Show loading state if we're still loading the supply
                    <p>Loading...</p>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-row items-center justify-between gap-8">
                <p>Mint:</p>
                <div className="flex items-center justify-start gap-12 text-black">
                  <button
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-dark text-3xl disabled:opacity-25`}
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>

                  <h4>{quantity}</h4>

                  <button
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-dark text-3xl disabled:opacity-25`}
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= maxClaimableByWallet}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* // Claim Button */}
              <div className="mt-2 w-full">
                <ClaimButton
                  className="flex !w-full"
                  theme="light"
                  contractAddress={contractAddress} // contract address of the Edition Drop
                  chain={chain}
                  client={client}
                  claimParams={{
                    type: "ERC1155",
                    quantity: BigInt(quantity),
                    tokenId: token,
                  }}
                  onTransactionConfirmed={(tx) => {
                    setQuantity(1);
                    alert(`Minted successfully: ${tx.transactionHash}`);
                  }}
                  onError={(error) => {
                    console.log(`Error: ${error.message}`);
                  }}
                  disabled={maxClaimableByWallet === BigInt(0)}
                >
                  {buttonText}
                </ClaimButton>
              </div>
            </div>
          </>
        </div>
      </main>
      <Footer />
    </>
  );
}
