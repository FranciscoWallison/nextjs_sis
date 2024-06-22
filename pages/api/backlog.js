import db from '../../db/db';

/*
Para obter dados de todos os anos e meses: http://localhost:3000/api/backlog
Para obter dados de um ano específico: http://localhost:3000/api/backlog?ano=2023
Para obter dados de um mês específico em um ano específico: http://localhost:3000/api/backlog?ano=2023&mes=Janeiro
*/

export default async function handler(req, res) {
  try {
    const { ano, mes } = req.query;
    
    // Consulta base
    let query = db('backlog_ordens_servico')
      .select('mes', 'ano')
      .sum('pendentes as pendentes')
      .groupBy('mes', 'ano')
      .orderBy(['ano', 'mes']);

    // Adiciona filtro pelo ano se fornecido
    if (ano) {
      query = query.where('ano', ano);
    }

    // Adiciona filtro pelo mês se fornecido
    if (mes) {
      query = query.where('mes', mes);
    }

    const backlog = await query;

    res.status(200).json(backlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar dados de backlog de ordens de serviço' });
  }
}
