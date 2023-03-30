import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface NewsFields {
  title: string
  description: string
  place: string
  image: string
  category: string
  views: BN
  date: BN
  videoLink: string
  keywords: Array<string>
  creator: PublicKey
}

export interface NewsJSON {
  title: string
  description: string
  place: string
  image: string
  category: string
  views: string
  date: string
  videoLink: string
  keywords: Array<string>
  creator: string
}

export class News {
  readonly title: string
  readonly description: string
  readonly place: string
  readonly image: string
  readonly category: string
  readonly views: BN
  readonly date: BN
  readonly videoLink: string
  readonly keywords: Array<string>
  readonly creator: PublicKey

  static readonly discriminator = Buffer.from([
    110, 125, 33, 126, 45, 231, 25, 133,
  ])

  static readonly layout = borsh.struct([
    borsh.str("title"),
    borsh.str("description"),
    borsh.str("place"),
    borsh.str("image"),
    borsh.str("category"),
    borsh.u64("views"),
    borsh.i64("date"),
    borsh.str("videoLink"),
    borsh.vec(borsh.str(), "keywords"),
    borsh.publicKey("creator"),
  ])

  constructor(fields: NewsFields) {
    this.title = fields.title
    this.description = fields.description
    this.place = fields.place
    this.image = fields.image
    this.category = fields.category
    this.views = fields.views
    this.date = fields.date
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
      date: dec.date,
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
      date: this.date.toString(),
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
      date: new BN(obj.date),
      videoLink: obj.videoLink,
      keywords: obj.keywords,
      creator: new PublicKey(obj.creator),
    })
  }
}
