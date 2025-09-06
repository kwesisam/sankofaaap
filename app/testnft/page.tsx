"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractJson  from "../../lib/AuthenticityCertificate.json";
export default function CertificatePage() {
  const CERTIFICATE_ABI = contractJson.abi;
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const CERTIFICATE_CONTRACT_ADDRESS =
    "0x9891A3Fa6039D42Bdb973acaF1Ad8DC57bFC2a45";

  // Form state
  const [buyer, setBuyer] = useState("");
  const [craftId, setCraftId] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [certificateData, setCertificateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // const testSto = async () => {
  //   const res = await testStorachaConnection();
  // };

  // useEffect(() => {
  //   testSo();
  // }, []);
  // Connect Wallet
  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _signer = await _provider.getSigner();
    const _contract = new ethers.Contract(
      CERTIFICATE_CONTRACT_ADDRESS,
      CERTIFICATE_ABI,
      _signer
    );
    setProvider(_provider);
    setSigner(_signer);
    setContract(_contract);
  }

  async function mintCertificate(): Promise<void> {
    if (!contract || !signer) return alert("Connect wallet first");
    if (!buyer || !craftId || !metadataURI) return alert("Fill all fields");

    try {
      setLoading(true);

      const nextNonce = await provider!.getTransactionCount(
        await signer.getAddress(),
        "pending"
      );

      // Send the transaction
      const tx = await contract.mintCertificate(buyer, craftId, metadataURI, {
        nonce: nextNonce,
      });

      // Wait for it to be mined
      const receipt = await tx.wait();

      // Parse the CertificateMinted event from logs
      const iface = new ethers.Interface(CERTIFICATE_ABI);
      let tokenId: bigint | null = null;

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === "CertificateMinted") {
            tokenId = parsed.args.tokenId as bigint; // ethers v6 returns bigint
            break;
          }
        } catch {
          // Not the event we want
        }
      }

      if (tokenId === null)
        throw new Error("No CertificateMinted event found in logs");

      alert(`✅ Certificate minted! Token ID: ${tokenId.toString()}`);
      setTokenId(tokenId.toString());
    } catch (err: unknown) {
      console.error("❌ Minting error:", err);
      alert("Minting failed. See console.");
    } finally {
      setLoading(false);
    }
  }

  // View Certificate
  async function viewCertificate() {
    console.log(2222);
    if (!contract) return alert("⚠️ Connect wallet first");

    try {
      setLoading(true);

      // Ensure tokenId is converted to BigInt before calling contract
      const id = BigInt(tokenId);
      const data = await contract.certificate(id);

      console.log(id, data);

      // Convert BigInt fields to string for React rendering
      const safeData = {
        artisan: data.artisan,
        craftId: data.craftId,
        metadataURI: data.metadataURI,
        issuedAt: data.issuedAt.toString(), // bigint -> string
      };

      setCertificateData(safeData);
    } catch (err) {
      console.error("❌ View error:", err);
      alert("Failed to fetch certificate. See console.");
    } finally {
      setLoading(false);
    }
  }

  // Burn Certificate
  async function burnCertificate() {
    if (!contract) return alert("Connect wallet first");
    try {
      setLoading(true);
      const tx = await contract.burnCertificate(tokenId);
      await tx.wait();
      alert("🔥 Certificate burned");
    } catch (err) {
      console.error(err);
      alert("❌ Burn failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎓 Authenticity Certificate</h1>
      <button onClick={connectWallet}>🔌 Connect Wallet</button>

      <hr />

      <h2>🧾 Mint Certificate</h2>
      <input
        placeholder="Buyer Address"
        value={buyer}
        onChange={(e) => setBuyer(e.target.value)}
      />
      <input
        placeholder="Craft ID"
        value={craftId}
        onChange={(e) => setCraftId(e.target.value)}
      />
      <input
        placeholder="Metadata URI"
        value={metadataURI}
        onChange={(e) => setMetadataURI(e.target.value)}
      />
      <button onClick={mintCertificate} disabled={loading}>
        Mint
      </button>

      <hr />

      <h2>🔍 View Certificate</h2>
      <input
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button onClick={viewCertificate} disabled={loading}>
        View
      </button>

      {certificateData && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Artisan:</strong> {certificateData[0]}
          </p>
          <p>
            <strong>Craft ID:</strong> {certificateData[1]}
          </p>
          <p>
            <strong>Metadata URI:</strong> {certificateData[2]}
          </p>
          <p>
            <strong>Issued At:</strong>{" "}
            {new Date(certificateData[3] * 1000).toLocaleString()}
          </p>
        </div>
      )}

      <hr />

      <h2>🔥 Burn Certificate</h2>
      <button onClick={burnCertificate} disabled={loading}>
        Burn
      </button>
    </div>
  );
}
