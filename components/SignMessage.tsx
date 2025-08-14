"use client";
import React, { useState } from "react";
import { BrowserProvider, TypedDataDomain, TypedDataField } from "ethers";

/**

 * @param {string} message - Message to be signed
 */
const SignMessage: React.FC<{ message: string }> = ({ message }) => {
  const [sig191, setSig191] = useState<string>("");
  const [sig712, setSig712] = useState<string>("");
  const [verifyResp, setVerifyResp] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const signEIP191 = async () => {
    try {
      setError("");
      if (!(globalThis as any).ethereum) throw new Error("No wallet");
      const provider = new BrowserProvider((globalThis as any).ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      setSig191(signature);

      const res = await fetch("/api/verify-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureType: "EIP191",
          message,
          signature,
          address: await signer.getAddress(),
        }),
      });
      setVerifyResp(await res.json());
    } catch (e: any) {
      setError(e.message || "Failed signing");
    }
  };

  const signEIP712 = async () => {
    try {
      setError("");
      if (!(globalThis as any).ethereum) throw new Error("No wallet");
      const provider = new BrowserProvider((globalThis as any).ethereum);
      const signer = await provider.getSigner();

      const domain: TypedDataDomain = {
        name: "Web3 Test",
        version: "1",
        chainId: 1,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      };
      const types: Record<string, Array<TypedDataField>> = {
        Mail: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "contents", type: "string" },
        ],
      };
      const value = {
        from: await signer.getAddress(),
        to: await signer.getAddress(),
        contents: message,
      };
      const signature = await signer.signTypedData(domain, types, value);
      setSig712(signature);

      const res = await fetch("/api/verify-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureType: "EIP712",
          message,
          signature,
          address: await signer.getAddress(),
          domain,
          types,
          value,
        }),
      });
      setVerifyResp(await res.json());
    } catch (e: any) {
      setError(e.message || "Failed 712 signing");
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={signEIP191}
          style={{ padding: "8px 14px", borderRadius: 8 }}
        >
          Sign EIP-191
        </button>
        <button
          onClick={signEIP712}
          style={{ padding: "8px 14px", borderRadius: 8 }}
        >
          Sign EIP-712
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        <div>
          <b>EIP-191:</b> <code>{sig191}</code>
        </div>
        <div>
          <b>EIP-712:</b> <code>{sig712}</code>
        </div>
      </div>
      {verifyResp && (
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: 12,
            borderRadius: 8,
            marginTop: 12,
          }}
        >
          {JSON.stringify(verifyResp, null, 2)}
        </pre>
      )}
      {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default SignMessage;
