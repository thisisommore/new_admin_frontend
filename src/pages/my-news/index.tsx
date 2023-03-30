import { useEffect, useState } from "react";
import { createNews, updateViews } from "@/program/out/instructions";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_ID } from "@/program/out/programId";
import { PublicKey, Transaction } from "@solana/web3.js";
import { News } from "@/program/out/accounts";

export default function NewsList() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    async function fetchData() {
      const programAccounts = await connection.getProgramAccounts(PROGRAM_ID);
      const newsAccounts = programAccounts.map((account) =>
        News.decode(account.account.data)
      );

      setNewsList(newsAccounts);
    }
    fetchData();
  }, [connection]);

  return (
    <div className="max-w-2xl mx-auto">
      {newsList.map((news, i) => (
        <div key={i} className="bg-white shadow-lg rounded-lg mb-6">
          <img
            className="h-48 w-full object-cover rounded-t-lg"
            src={`https://ipfs.io/ipfs/${news.image}?filename=${news.image}`}
            alt={news.title}
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold">{news.title}</h3>
            <p className="text-gray-600">{news.description}</p>
            <p className="mt-4 text-gray-700 font-medium">
              Place: {news.place}
            </p>
            <p className="mt-4 text-gray-700 font-medium">
              Category: {news.category}
            </p>
            <p className="mt-4 text-gray-700 font-medium">
              {news.views.toNumber()} views
            </p>
            <p className="mt-4 text-gray-700 font-medium">
              Date: {new Date(news.date.toNumber()).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-700 font-medium">
              Video Link: {news.videoLink}
            </p>
            <ul className="mt-4">
              {news.keywords.map((keyword, index) => (
                <li
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
