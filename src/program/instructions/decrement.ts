import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DecrementAccounts {
  baseAccount: PublicKey
}

export function decrement(accounts: DecrementAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.baseAccount, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([106, 227, 168, 59, 248, 27, 150, 101])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
