import db from '../../db/db';
// /api/cumprimento_manutencoes?ano=2023
export default async function handler(req, res) {
  try {
    const { ano } = req.query;
    
    // Consulta base
    let query = db('cumprimento_manutencoes')
      .select('mes', 'ano')
      .sum('executadas as executadas')
      .sum('pendentes as pendentes')
      .sum('concluidas as concluidas')
      .groupBy('mes', 'ano')
      .orderBy(['ano', 'mes']);

    // Adiciona filtro pelo ano se fornecido
    if (ano) {
      query = query.where('ano', ano);
    }

    const manutencoes = await query;

    res.status(200).json(manutencoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar dados de cumprimento de manutenções' });
  }
}
