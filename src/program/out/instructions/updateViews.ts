import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateViewsArgs {
  views: BN
}

export interface UpdateViewsAccounts {
  news: PublicKey
  creator: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("views")])

export function updateViews(
  args: UpdateViewsArgs,
  accounts: UpdateViewsAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.news, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([60, 27, 7, 193, 176, 190, 86, 222])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      views: args.views,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
