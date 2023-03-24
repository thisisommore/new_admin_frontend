import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import React from "react";

const NavBar = () => {
  return <div><WalletMultiButton /></div> ;
};

export default dynamic(() => Promise.resolve(NavBar), {
  ssr: false,
});
