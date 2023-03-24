import SolanaWalletProvider from "@/contexts/SolanaWallet";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";
import NavBar from "@/components/NavBar";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaWalletProvider>
      <NavBar />
      <Component {...pageProps} />
    </SolanaWalletProvider>
  );
}
