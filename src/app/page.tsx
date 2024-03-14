// pages/deploy_token.js
"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ethers } from "ethers";

export default function DeployToken() {
  const [network, setNetwork] = useState("ethereum");
  const [tokenName, setTokenName] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  const handleDeploy = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Replace the following with your actual ERC20 token contract ABI
        const erc20Abi = [
          {
            inputs: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "symbol",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "initialSupply",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          // Add more ABI entries as needed
        ];

        // Replace the following with your actual ERC20 token contract bytecode
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
      } catch (error) {
        console.error("Error deploying token:", error);
      }
    } else {
      console.error("No Ethereum wallet found. Please install MetaMask.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-4">
        <CardTitle>Deploy ERC20 Token</CardTitle>
        <CardDescription>
          Enter the information below to deploy your ERC20 token
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token-name">Token Name</Label>
          <Input
            id="token-name"
            placeholder="MyToken"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supply">Total Supply</Label>
          <Input
            id="supply"
            placeholder="1000000"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="network">Network</Label>
          <RadioGroup
            className="flex items-center gap-4"
            value={network}
            onValueChange={setNetwork}
            id="network"
          >
            <Label
              className="flex items-center gap-2 cursor-pointer"
              htmlFor="ethereum"
            >
              <RadioGroupItem
                className="peer sr-only"
                id="ethereum"
                value="ethereum"
              />
              <span>Ethereum</span>
            </Label>
            <Label
              className="flex items-center gap-2 cursor-pointer"
              htmlFor="bsc"
            >
              <RadioGroupItem className="peer sr-only" id="bsc" value="bsc" />
              <span>Binance Smart Chain</span>
            </Label>
            <Label
              className="flex items-center gap-2 cursor-pointer"
              htmlFor="polygon"
            >
              <RadioGroupItem
                className="peer sr-only"
                id="polygon"
                value="polygon"
              />
              <span>Polygon</span>
            </Label>
          </RadioGroup>
        </div>
        <Button className="w-full" onClick={handleDeploy}>
          Deploy
        </Button>
      </CardContent>
    </Card>
  );
}
