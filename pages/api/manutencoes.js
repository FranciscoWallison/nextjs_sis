import db from '../../db';

/*
Para obter dados de todos os anos e meses: http://localhost:3000/api/manutencoes
Para obter dados de um ano específico: http://localhost:3000/api/manutencoes?ano=2023
Para obter dados de um mês específico em um ano específico: http://localhost:3000/api/manutencoes?ano=2023&mes=Janeiro
Para obter dados de um tipo de equipamento específico: http://localhost:3000/api/manutencoes?tipo_equipamento=Tipo A
Para obter dados de um equipamento específico: http://localhost:3000/api/manutencoes?equipamento=Equipamento 1
Para obter dados de uma área específica: http://localhost:3000/api/manutencoes?area=Área 1
Para obter dados de um responsável específico: http://localhost:3000/api/manutencoes?responsavel=Responsável 1
*/

export default async function handler(req, res) {
  try {
    const { ano, mes, tipo_equipamento, equipamento, area, responsavel } = req.query;
    
    let query = db('manutencoes')
      .select('tipo_equipamento', 'equipamento', 'area', 'responsavel', 'mes', 'ano')
      .sum('quantidade as quantidade')
      .groupBy('tipo_equipamento', 'equipamento', 'area', 'responsavel', 'mes', 'ano')
      .orderBy(['ano', 'mes']);

    if (ano) {
      query = query.where('ano', ano);
    }
    if (mes) {
      query = query.where('mes', mes);
    }
    if (tipo_equipamento) {
      query = query.where('tipo_equipamento', tipo_equipamento);
    }
    if (equipamento) {
      query = query.where('equipamento', equipamento);
    }
    if (area) {
      query = query.where('area', area);
    }
    if (responsavel) {
      query = query.where('responsavel', responsavel);
    }

    const manutencoes = await query;

    res.status(200).json(manutencoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar dados de manutenções' });
  }
}
