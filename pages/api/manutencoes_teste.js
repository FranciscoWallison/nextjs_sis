// http://localhost:3000/api/manutencoes_teste?periodoInicio=2023-01-01&periodoFim=2023-12-31&area=Área 1&categoria=Executadas&responsavel=Responsável 1

import db from '../../db/db';

export default async function handler(req, res) {
  try {
    const { periodoInicio, periodoFim, area, categoria, responsavel } = req.query;

    // Construção da consulta com os filtros fornecidos
    const query = db('manutencoes')
      .leftJoin('relacionamento_manutencao', 'manutencoes.id', 'relacionamento_manutencao.id_manutencao')
      .leftJoin('areas', 'relacionamento_manutencao.id_area', 'areas.id')
      .leftJoin('responsaveis', 'relacionamento_manutencao.id_responsavel', 'responsaveis.id')
      .select(
        'manutencoes.*',
        'areas.nome as nome_area',
        'responsaveis.nome as nome_responsavel'
      );

    // Aplicando filtros dinamicamente
    if (periodoInicio) {
      query.where('manutencoes.data_abertura', '>=', periodoInicio);
    }
    if (periodoFim) {
      query.where('manutencoes.data_abertura', '<=', periodoFim);
    }
    if (area) {
      query.where('areas.nome', area);
    }
    if (categoria) {
      query.where('manutencoes.categoria', categoria);
    }
    if (responsavel) {
      query.where('responsaveis.nome', responsavel);
    }

    // Executando a consulta e obtendo os resultados
    const results = await query;

    res.status(200).json(results);
  } catch (error) {
    console.error('Erro ao buscar manutenções:', error);
    res.status(500).json({ message: 'Erro ao buscar manutenções' });
  }
}
