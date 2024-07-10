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
  const new_perfil = {
    uid: "pNgGlYyMOTZ1M9QZwMMVKwWP4S03",
    email: "franciscowallison@gmail.com",
    nome_sindico: "sdfsdf",
    nome_predio: "sdf",
    sindicoName: "sdfsdf",
    buildingName: "sdf",
    address: "sdf",
    buildingAge: "3",
    hasElevator: true,
    elevatorCount: "2",
    grupo_gerador: true,
  };

  console.log("==========pegarTodos===========");
  await salvarNovo(new_perfil);
  console.log("====================================");

  res.status(200).json({ name: "John Doe" });
}
