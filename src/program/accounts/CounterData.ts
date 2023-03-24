import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CounterDataFields {
  value: number
}

export interface CounterDataJSON {
  value: number
}

export class CounterData {
  readonly value: number

  static readonly discriminator = Buffer.from([
    195, 168, 35, 222, 246, 249, 206, 42,
  ])

  static readonly layout = borsh.struct([borsh.i32("value")])

  constructor(fields: CounterDataFields) {
    this.value = fields.value
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CounterData | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<CounterData | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): CounterData {
    if (!data.slice(0, 8).equals(CounterData.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CounterData.layout.decode(data.slice(8))

    return new CounterData({
      value: dec.value,
    })
  }

  toJSON(): CounterDataJSON {
    return {
      value: this.value,
    }
  }

  static fromJSON(obj: CounterDataJSON): CounterData {
    return new CounterData({
      value: obj.value,
    })
  }
}
