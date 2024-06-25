import { withAuth } from '../../lib/middleware';

const handler = (req, res) => {
  res.status(200).json({ message: 'Acesso concedido', user: req.user });
};

export default withAuth(handler);
