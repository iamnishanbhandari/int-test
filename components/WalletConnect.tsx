"use client";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";
import { getConfig } from "../utils/config";
import type { WalletState } from "../types";

const WalletConnect: React.FC = () => {
  const [state, setState] = useState<WalletState>({
    address: "",
    balance: "0",
    network: "",
    isConnected: false,
  });
  const [error, setError] = useState<string>("");

  const connect = useCallback(async () => {
    try {
      setError("");
      if (!(globalThis as any).ethereum) {
        throw new Error("No injected wallet found. Please install MetaMask.");
      }
      const provider = new BrowserProvider(
        (globalThis as any).ethereum,
        Number(getConfig().chainId)
      );
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const bal = await provider.getBalance(address);
      const network = await provider.getNetwork();
      setState({
        address,
        balance: formatEther(bal),
        network: String(network.chainId),
        isConnected: true,
      });
    } catch (e: any) {
      setError(e?.message || "Failed to connect wallet");
      setState((s) => ({ ...s, isConnected: false }));
    }
  }, []);

  useEffect(() => {}, []);

  return (
    <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
      <button
        onClick={connect}
        style={{ padding: "8px 14px", borderRadius: 8 }}
      >
        Connect Wallet
      </button>
      {state.isConnected && (
        <div style={{ marginTop: 12 }}>
          <div>
            <b>Address:</b> {state.address}
          </div>
          <div>
            <b>Balance:</b> {state.balance} ETH
          </div>
          <div>
            <b>Network:</b> {state.network}
          </div>
          <div>
            <b>Status:</b> Connected
          </div>
        </div>
      )}
      {!state.isConnected && (
        <div style={{ marginTop: 12 }}>
          <b>Status:</b> Disconnected
        </div>
      )}
      {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default WalletConnect;
