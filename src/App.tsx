import {
  ClaimButton,
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
} from "thirdweb/react";
import { client, chain, token, contract } from "./client";

export function App() {
  const account = useActiveAccount();

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "50px",
            }}
          >
            <MediaRenderer
              client={client}
              src="https://ipfs.io/ipfs/bafybeiadqsdrobyipewpy4w3asomlxw5wdmqyn67ahg2lenz47zozeupfq/Gemini_Generated_Image_xbq8s3xbq8s3xbq8.jpeg"
              width="200"
            />
          </div>
          <div className="flex justify-center mb-20">
            <div style={{ marginRight: "10px" }}>
              <ConnectButton
                client={client}
                appMetadata={{
                  name: "ERC-1155 Edition Drop",
                  url: "https://example.com",
                }}
              />
            </div>
            {/* // For Edition Drop (ERC1155) */}
            {account ? (
              <ClaimButton
                contractAddress={contract} // contract address of the Edition Drop
                chain={chain}
                client={client}
                claimParams={{
                  type: "ERC1155",
                  quantity: 1n,
                  tokenId: token,
                }}
                onTransactionConfirmed={(tx) => {
                  alert(`Minted successfully: ${tx.transactionHash}`);
                }}
                onError={(error) => {
                  alert(`Error: ${error.cause}`);
                }}
              >
                Claim now
              </ClaimButton>
            ) : null}
          </div>
        </>
      </div>
    </main>
  );
}
