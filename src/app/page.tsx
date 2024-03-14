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

export default function Component() {
  const [network, setNetwork] = useState("ethereum");
  const [tokenName, setTokenName] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  const handleDeploy = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Replace the following with your actual ERC20 token contract ABI and bytecode
        const erc20Abi = [
          // ...
        ];
        const erc20Bytecode = "0x60806040...";

        // Deploy the ERC20 token contract
        const factory = new ethers.ContractFactory(
          erc20Abi,
          erc20Bytecode,
          signer
        );
        const contract = await factory.deploy(tokenName, "SYM", totalSupply);
        await contract.deployed();

        console.log("Token deployed at address:", contract.address);
        // Display success message to the user
      } catch (error) {
        console.error("Error deploying token:", error);
        // Display error message to the user
      }
    } else {
      console.error("No Ethereum wallet found. Please install MetaMask.");
      // Display error message to the user
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-100 dark:bg-gray-800">
      <section className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center">
              Deploy Your ERC20 Token
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
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
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
