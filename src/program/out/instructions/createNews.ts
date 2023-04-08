import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateNewsArgs {
  title: Array<number>
  description: Array<number>
  place: Array<number>
  image: Array<number>
  category: Array<number>
  month: number
  year: number
  videoLink: Array<number>
  keywords: Array<Array<number>>
}

export interface CreateNewsAccounts {
  news: PublicKey
  creator: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.array(borsh.u8(), 32, "title"),
  borsh.array(borsh.u8(), 64, "description"),
  borsh.array(borsh.u8(), 32, "place"),
  borsh.array(borsh.u8(), 32, "image"),
  borsh.array(borsh.u8(), 32, "category"),
  borsh.u8("month"),
  borsh.u16("year"),
  borsh.array(borsh.u8(), 64, "videoLink"),
  borsh.array(borsh.array(borsh.u8(), 8), 5, "keywords"),
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
      month: args.month,
      year: args.year,
      videoLink: args.videoLink,
      keywords: args.keywords,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
