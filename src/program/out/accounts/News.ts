import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface NewsFields {
  title: Array<number>
  description: Array<number>
  place: Array<number>
  image: Array<number>
  category: Array<number>
  views: BN
  month: number
  year: number
  videoLink: Array<number>
  keywords: Array<Array<number>>
  creator: PublicKey
}

export interface NewsJSON {
  title: Array<number>
  description: Array<number>
  place: Array<number>
  image: Array<number>
  category: Array<number>
  views: string
  month: number
  year: number
  videoLink: Array<number>
  keywords: Array<Array<number>>
  creator: string
}

export class News {
  readonly title: Array<number>
  readonly description: Array<number>
  readonly place: Array<number>
  readonly image: Array<number>
  readonly category: Array<number>
  readonly views: BN
  readonly month: number
  readonly year: number
  readonly videoLink: Array<number>
  readonly keywords: Array<Array<number>>
  readonly creator: PublicKey

  static readonly discriminator = Buffer.from([
    110, 125, 33, 126, 45, 231, 25, 133,
  ])

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 32, "title"),
    borsh.array(borsh.u8(), 64, "description"),
    borsh.array(borsh.u8(), 32, "place"),
    borsh.array(borsh.u8(), 32, "image"),
    borsh.array(borsh.u8(), 32, "category"),
    borsh.u64("views"),
    borsh.u8("month"),
    borsh.u16("year"),
    borsh.array(borsh.u8(), 64, "videoLink"),
    borsh.array(borsh.array(borsh.u8(), 8), 5, "keywords"),
    borsh.publicKey("creator"),
  ])

  constructor(fields: NewsFields) {
    this.title = fields.title
    this.description = fields.description
    this.place = fields.place
    this.image = fields.image
    this.category = fields.category
    this.views = fields.views
    this.month = fields.month
    this.year = fields.year
    this.videoLink = fields.videoLink
    this.keywords = fields.keywords
    this.creator = fields.creator
  }

  static async fetch(c: Connection, address: PublicKey): Promise<News | null> {
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
  ): Promise<Array<News | null>> {
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

  static decode(data: Buffer): News {
    if (!data.slice(0, 8).equals(News.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = News.layout.decode(data.slice(8))

    return new News({
      title: dec.title,
      description: dec.description,
      place: dec.place,
      image: dec.image,
      category: dec.category,
      views: dec.views,
      month: dec.month,
      year: dec.year,
      videoLink: dec.videoLink,
      keywords: dec.keywords,
      creator: dec.creator,
    })
  }

  toJSON(): NewsJSON {
    return {
      title: this.title,
      description: this.description,
      place: this.place,
      image: this.image,
      category: this.category,
      views: this.views.toString(),
      month: this.month,
      year: this.year,
      videoLink: this.videoLink,
      keywords: this.keywords,
      creator: this.creator.toString(),
    }
  }

  static fromJSON(obj: NewsJSON): News {
    return new News({
      title: obj.title,
      description: obj.description,
      place: obj.place,
      image: obj.image,
      category: obj.category,
      views: new BN(obj.views),
      month: obj.month,
      year: obj.year,
      videoLink: obj.videoLink,
      keywords: obj.keywords,
      creator: new PublicKey(obj.creator),
    })
  }
}
