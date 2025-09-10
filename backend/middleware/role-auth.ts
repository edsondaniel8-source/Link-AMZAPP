import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../shared/types';

export const verifyFirebaseToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Simulação básica - depois implementamos Firebase
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Simular usuário autenticado (para desenvolvimento)
    req.user = {
      id: 'user-id-from-token',
      uid: 'firebase-uid',
      email: 'user@example.com',
      roles: ['user']
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireAdminRole = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.user?.roles?.includes('admin')) {
    return res.status(403).json({ error: 'Acesso negado. Requer role admin.' });
  }
  next();
};

export const requireProviderRole = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.user?.roles?.includes('provider')) {
    return res.status(403).json({ error: 'Acesso negado. Requer role provider.' });
  }
  next();
};

export const requireClientRole = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.user?.roles?.includes('client')) {
    return res.status(403).json({ error: 'Acesso negado. Requer role client.' });
  }
  next();
};

export const requireDriverRole = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.user?.roles?.includes('driver')) {
    return res.status(403).json({ error: 'Acesso negado. Requer role driver.' });
  }
  next();
};
