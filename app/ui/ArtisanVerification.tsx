"use client";

import React, { useState, useEffect } from "react";
import { getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";

function VerificationPage() {
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [userId] = useState(ethers.ZeroAddress);

  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
        endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT,
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: "0xf5EB53dB21A49F7d52BdD2e1D7A0a789019Ce69B",
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: "Bonjour Cannes!",
        devMode: true,
        disclosures: {
          minimumAge: 18,
          nationality: true,
          gender: true,
        },
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, [userId]);


  const handleSuccessfulVerification = () => {
    console.log("Verification successful with mock passport!");

  };

  return (
    <div className="verification-container">
      <div className="p-20">
        {selfApp ? (
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={() => {
              handleSuccessfulVerification();
            }}
            onError={(err) => {
              console.error("Failed to verify identity", err);
            }}
          />
        ) : (
          <div>Loading QR Code...</div>
        )}
      </div>
    </div>
  );
}

export default VerificationPage;
