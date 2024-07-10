// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { pegarTodos, salvarNovo } from "@/services/firebaseService";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("==========pegarTodos===========");
  console.log(await pegarTodos());
  console.log("====================================");

  res.status(200).json({ name: "John Doe" });
}
