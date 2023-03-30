import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateNewsArgs {
  title: string
  description: string
  place: string
  image: string
  category: string
  date: BN
  videoLink: string
  keywords: Array<string>
}

export interface CreateNewsAccounts {
  news: PublicKey
  creator: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.str("title"),
  borsh.str("description"),
  borsh.str("place"),
  borsh.str("image"),
  borsh.str("category"),
  borsh.i64("date"),
  borsh.str("videoLink"),
  borsh.vec(borsh.str(), "keywords"),
])

export function createNews(args: CreateNewsArgs, accounts: CreateNewsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.news, isSigner: true, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([223, 40, 244, 122, 144, 66, 26, 174])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      title: args.title,
      description: args.description,
      place: args.place,
      image: args.image,
      category: args.category,
      date: args.date,
      videoLink: args.videoLink,
      keywords: args.keywords,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
