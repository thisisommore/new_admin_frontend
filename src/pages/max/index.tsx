import { NFTStorage, File } from "nft.storage";
import { createNews } from "@/program/out/instructions";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import BN from "bn.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  SystemProgram,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
function stringToBuffer(str: string, len: number) {
  let buf = Buffer.alloc(len);
  buf.write(str);
  return Array.from(buf.slice(0, len));
}

const DISC = 8;
const MONTH_LEN = 1;
const VIEWS_LEN = 8;
const TITLE_LEN = 32;
const DESCRIPTION_LEN = 64;
const PLACE_LEN = 32;
const IMAGE_LEN = 32;
const CATEGORY_LEN = 32;
const VIDEO_LINK_LEN = 64;
const KEYWORDS_LEN = 8;
interface NewsForm {
  title: string;
  category: string;
  date: string;
  description: string;
  image: FileList;
  keywords: string;
  place: string;
  videoLink: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
  date: yup.date().required("Date is required"),
  description: yup.string().required("Description is required"),
  image: yup
    .mixed<FileList>()
    .required("Image is required")
    .test(
      "fileSize",
      "File size should be less than or equal to 2MB",
      (value: FileList | undefined | null) => {
        if (!value || !value[0]) {
          return false;
        }
        return value[0].size <= 2 * 1024 * 1024;
      }
    ),
  keywords: yup.string().required("Keywords are required"),
  place: yup.string().required("Place is required"),
  videoLink: yup.string().required("Video Link is required"),
});

const Max: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsForm>({
    resolver: yupResolver(schema),
  });

  const nftStorageApiKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU3Q0M3QzQwYmVmN2UwYzJmNUJhMEUxNWFFMjFGRGUyNUYyNjViN0EiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTgwMTY5MzAxMSwibmFtZSI6Ik1heCJ9.YUx1HpK4kAYdITAZ5BEKHJgcv1FUNW9Y4s0p4h0wCak";
  const client = new NFTStorage({ token: nftStorageApiKey });

  const create_news = async (data: NewsForm) => {
    if (!publicKey) throw new WalletNotConnectedError();

    // Upload the image to NFT Storage
    const imageFile = data.image[0];
    const cid_str = await client.storeBlob(
      new File([imageFile], imageFile.name, { type: imageFile.type })
    );
    const imageHash = cid_str.toString();
    const dateObj = new Date(data.date);
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const news_account = Keypair.generate();
    const tx = new Transaction();
    const create_news_tx = createNews(
      {
        category: stringToBuffer(data.category, CATEGORY_LEN),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        description: stringToBuffer(data.description, DESCRIPTION_LEN),
        image: stringToBuffer(imageHash, IMAGE_LEN),
        keywords: data.keywords
          .split(",")
          .map((e) => stringToBuffer(e, KEYWORDS_LEN)),
        place: stringToBuffer(data.place, PLACE_LEN),
        title: stringToBuffer(data.title, TITLE_LEN),
        videoLink: stringToBuffer(data.videoLink, VIDEO_LINK_LEN),
      },
      {
        creator: publicKey,
        news: news_account.publicKey,
        systemProgram: SystemProgram.programId,
      }
    );

    tx.add(create_news_tx);
    const signature = await sendTransaction(tx, connection, {
      signers: [news_account],
    });
    console.log(signature);

    await connection.confirmTransaction(signature, "processed");
    console.log("dom");
  };

  const onSubmit: SubmitHandler<NewsForm> = (data) => {
    create_news(data);
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("title")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Title"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("category")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Category"
            />
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("date")}
              type="date"
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Date"
            />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("image")}
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("keywords")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Keywords (comma separated)"
            />
            {errors.keywords && (
              <p className="text-red-500">{errors.keywords.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("place")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Place"
            />
            {errors.place && (
              <p className="text-red-500">{errors.place.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("videoLink")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Video Link"
            />
            {errors.videoLink && (
              <p className="text-red-500">{errors.videoLink.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Max;
