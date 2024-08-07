import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;
const chainId = import.meta.env.VITE_TEMPLATE_CHAIN_ID;
const contractAdd: string = import.meta.env.VITE_TEMPLATE_CONTRACT_ADDRESS;

const activeTokenId = import.meta.env.VITE_TEMPLATE_ACTIVE_TOKEN_ID;
const activeClaimId = import.meta.env.VITE_TEMPLATE_ACTIVE_CLAIM_ID;

export const chain = defineChain(Number(chainId)); // change this to your chain ID
export const contractAddress = contractAdd;
export const token = BigInt(activeTokenId);

export const claimId = BigInt(activeClaimId);
export const client = createThirdwebClient({
  clientId: clientId,
});
