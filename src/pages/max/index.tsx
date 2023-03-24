import { CounterData } from "@/program/accounts";
import { increment, initialize } from "@/program/instructions";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, Keypair, PublicKey } from "@solana/web3.js";
import React from "react";

const Max = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const create_account = async () => {
    console.log("wa");

    if (!publicKey) throw new WalletNotConnectedError();

    const transactions = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 0,
      })
    );

    const signature = await sendTransaction(transactions, connection);
    await connection.confirmTransaction(signature, "processed");
    console.log("dom");
  };


  const initiate = async ()=>{
    if (!publicKey) throw new WalletNotConnectedError();

    const baseAccount = Keypair.generate()
    const tx = new Transaction()
    const tx1 = initialize({
      baseAccount: baseAccount.publicKey,
      user:publicKey,
      systemProgram:SystemProgram.programId
    })
    console.log("backup this account",baseAccount.secretKey.toString());

    tx.add(tx1)

    const signature = await sendTransaction(tx, connection);
    console.log(signature);

    await connection.confirmTransaction(signature, "processed");
    console.log("dom");
  }
  const increment_counter = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    // Fill base account secret here
    const baseAccountSecret = [0,0,0,0]
    const baseAccount = Keypair.fromSecretKey(Uint8Array.from(baseAccountSecret))
    const tx = new Transaction()
    console.log(await CounterData.fetch(connection, baseAccount.publicKey));
    const tx1 = increment({
      baseAccount: baseAccount.publicKey
    })

    tx.add(tx1)

    const signature = await sendTransaction(tx, connection);
    console.log(signature);

    await connection.confirmTransaction(signature, "processed");
    console.log("dom");
    console.log(await CounterData.fetch(connection, baseAccount.publicKey));
  }
  return (
    <div>
      <button onClick={create_account}>Max</button>
      <button onClick={increment_counter}>Incre</button>
    </div>
  );
};

export default Max;
