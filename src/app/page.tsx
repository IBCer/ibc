"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ethers } from "ethers";

const factoryAddress = "0x099434Bb08979F172aAFC3E72109455EF387AD07";
const factoryAbi = [
  {
    inputs: [
      {
        internalType: "string[]",
        name: "channels",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "_salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_tokenSupply",
        type: "uint256",
      },
    ],
    name: "deployXPolyERC20",
    outputs: [
      {
        internalType: "contract PolyERC20FixedSupply",
        name: "token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Component() {
  const [network, setNetwork] = useState("optimism_sepolia");
  const [tokenName, setTokenName] = useState("MyToken");
  const [tokenSymbol, setTokenSymbol] = useState("MTK");
  const [totalSupply, setTotalSupply] = useState("1000000");

  const handleDeploy = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Attempt to switch to the desired network
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexlify(11155420) }], // Replace YOUR_CHAIN_ID with the actual chain ID
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: ethers.utils.hexlify(11155420),
                    rpcUrl: "YOUR_RPC_URL", // Necessary for adding a new network
                    // Add other parameters as needed
                  },
                ],
              });
            } catch (addError) {
              // Handle errors from adding a new network
              console.error("Error adding new network:", addError);
              throw new Error("Failed to add the network.");
            }
          } else {
            // Handle other errors
            throw new Error(
              `Failed to switch to the network: ${switchError.message}`
            );
          }
        }

        const selectedNetwork = await provider.getNetwork();
        const networkName = selectedNetwork.name;

        if (networkName !== network) {
          throw new Error(
            `Please switch to the ${network} network in your wallet.`
          );
        }

        const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);
        const salt = ethers.utils.randomBytes(32);
        const tx = await factory.deployXPolyERC20(
          ["channel-8", "channel-9"], // Replace with actual channel IDs
          tokenName,
          tokenSymbol,
          salt,
          ethers.utils.parseUnits(totalSupply, 18)
        );

        console.log("Transaction sent:", tx.hash);

        const receipt = await tx.wait();
        console.log("Token deployed successfully:", receipt.transactionHash);
      } catch (error) {
        console.error("Error deploying token:", error);
      }
    } else {
      console.error("No Ethereum wallet found. Please install MetaMask.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-100 dark:bg-gray-800">
      <section className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center">
              Deploy Your PolyERC20 Token
            </h1>
            <p className="text-center text-gray-500">
              Welcome to the future of token deployment. Get ready for an
              unparalleled experience.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token-name">Token Name</Label>
                <Input
                  id="token-name"
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="MyToken"
                  required
                  value={tokenName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token-symbol">Token Symbol</Label>
                <Input
                  id="token-symbol"
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="MTK"
                  required
                  value={tokenSymbol}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supply">Total Supply</Label>
                <Input
                  id="supply"
                  onChange={(e) => setTotalSupply(e.target.value)}
                  placeholder="1000000"
                  required
                  value={totalSupply}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger>
                    <SelectValue>{network}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimism_sepolia">
                      Optimism Sepolia
                    </SelectItem>
                    <SelectItem value="base_sepolia">Base Sepolia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-red-500"
                onClick={handleDeploy}
              >
                Deploy Your Token
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img
              alt="Deploy Token Image"
              className="object-cover rounded-lg shadow-2xl"
              height={500}
              src="/oip61teo.png"
              style={{
                aspectRatio: "500/500",
                objectFit: "cover",
              }}
              width={500}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
