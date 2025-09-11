import { Request, Response } from 'express';
import { PartnershipService } from './partnershipService';
import type { AuthenticatedUser } from '../../shared/types'; // Ajuste o caminho conforme necessário

// Interface para tipar o usuário no request
interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser; // Use o tipo correto aqui
}

export class PartnershipController {
  private partnershipService: PartnershipService;

  constructor() {
    this.partnershipService = new PartnershipService();
  }

  public getAvailableProposals = async (req: Request, res: Response): Promise<void> => {
    try {
      const proposals = await this.partnershipService.getAvailableProposals();
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getMyProposals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const driverId = req.user?.uid; // Mude de id para uid
      if (!driverId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }
      const proposals = await this.partnershipService.getDriverProposals(driverId);
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getMyApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const driverId = req.user?.uid; // Mude de id para uid
      if (!driverId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }
      const applications = await this.partnershipService.getDriverApplications(driverId);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public acceptProposal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { proposalId } = req.params;
      const driverId = req.user?.uid; // Mude de id para uid
      
      if (!driverId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const agreement = await this.partnershipService.acceptProposal(proposalId, driverId);
      res.json(agreement);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public rejectProposal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { proposalId } = req.params;
      const driverId = req.user?.uid; // Mude de id para uid
      
      if (!driverId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const result = await this.partnershipService.rejectProposal(proposalId, driverId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public createProposal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const hotelId = req.user?.uid; // Mude de id para uid
      if (!hotelId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const proposal = await this.partnershipService.createProposal(hotelId, req.body);
      res.status(201).json(proposal);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getHotelProposals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const hotelId = req.user?.uid; // Mude de id para uid
      if (!hotelId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const proposals = await this.partnershipService.getHotelProposals(hotelId);
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getProposalApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { proposalId } = req.params;
      const hotelId = req.user?.uid; // Mude de id para uid
      
      if (!hotelId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      // Verificar se a proposta pertence ao hotel
      const proposal = await this.partnershipService.findProposalById(proposalId);
      if (!proposal || proposal.hotelId !== hotelId) {
        res.status(403).json({ error: 'Acesso não autorizado' });
        return;
      }

      const applications = await this.partnershipService.getProposalApplications(proposalId);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Método auxiliar para buscar proposta por ID
  private async findProposalById(proposalId: string) {
    return this.partnershipService.findProposalById(proposalId);
  }
}