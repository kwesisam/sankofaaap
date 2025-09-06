import { Globe, Shield, Verified } from "lucide-react";
import React from "react";

const ValueProp = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-16 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Sankofa?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <Verified className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Verified Authenticity
            </h3>
            <p className="text-gray-600">
              Every item comes with a blockchain certificate of authenticity,
              verifying its origin and creator.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              Our escrow system ensures both buyers and artisans are protected
              throughout the purchase process.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <Globe className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-gray-600">
              We connect talented artisans directly to global markets,
              eliminating traditional barriers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
