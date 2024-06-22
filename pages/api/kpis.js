import db from "../../db/db";

/*
Para obter dados de todos os anos e meses: http://localhost:3000/api/kpis
Para obter dados de um ano específico: http://localhost:3000/api/kpis?ano=2023
Para obter dados de um mês específico em um ano específico: http://localhost:3000/api/kpis?ano=2023&mes=Janeiro
*/

export default async function handler(req, res) {
  try {
    const { ano, mes } = req.query;

    // Consulta base
    let query = db("kpi_manutencoes")
      .select("mes", "ano")
      .avg("mtbf as mtbf")
      .avg("mttr as mttr")
      .avg("disponibilidade as disponibilidade")
      .groupBy("mes", "ano")
      .orderBy(["ano", "mes"]);

    // Adiciona filtro pelo ano se fornecido
    if (ano) {
      query = query.where("ano", ano);
    }

    // Adiciona filtro pelo mês se fornecido
    if (mes) {
      query = query.where("mes", mes);
    }

    const kpis = await query;

    res.status(200).json(kpis);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar dados de KPIs de manutenções" });
  }
}
