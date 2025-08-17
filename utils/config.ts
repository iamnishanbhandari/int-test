export const getConfig = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "";
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "1";
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
  return { rpcUrl, chainId, wsUrl };
};
