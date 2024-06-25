import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db';

// Configurações do JWT
const JWT_SECRET = 'sua_chave_secreta'; // Mantenha esta chave segura e privada
const JWT_EXPIRES_IN = '1h';

export async function registerUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await db('users')
    .insert({ username, email, password: hashedPassword })
    .returning('*');
  return user;
}

export async function authenticateUser(email, password) {
  const user = await db('users').where({ email }).first();
  if (!user) throw new Error('Usuário não encontrado');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('Senha inválida');

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { user, token };
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}