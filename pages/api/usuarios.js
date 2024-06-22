import db from '../../db/db';

export default async function handler(req, res) {
  try {
    const usuarios = await db('usuarios').select('*');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
}
