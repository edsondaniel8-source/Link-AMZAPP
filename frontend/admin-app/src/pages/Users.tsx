import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  Phone,
  Mail,
  Calendar,
  Star,
  FileCheck,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: string;
  status: string;
  canOfferServices: boolean;
  rating: number;
  totalReviews: number;
  joinDate: string;
  lastActivity: string;
  verificationDate?: string;
  verificationNotes?: string;
  hasDocuments: boolean;
  profilePhotoUrl?: string;
  identityDocumentUrl?: string;
}

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Hook para buscar usuários com filtros
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/users', { 
      page: currentPage, 
      type: typeFilter, 
      status: statusFilter, 
      search: searchTerm 
    }],
    staleTime: 10000 // Cache por 10 segundos
  });

  // Mutation para aprovar usuário
  const approveMutation = useMutation({
    mutationFn: async ({ userId, notes }: { userId: string; notes: string }) => {
      const response = await fetch(`/api/admin/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ notes })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao aprovar usuário');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Usuário aprovado",
        description: "O usuário foi aprovado com sucesso",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUser(null);
      setApprovalNotes("");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o usuário",
        variant: "destructive"
      });
    }
  });

  // Mutation para rejeitar usuário
  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const response = await fetch(`/api/admin/reject/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao rejeitar usuário');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Usuário rejeitado",
        description: "O usuário foi rejeitado",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUser(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o usuário",
        variant: "destructive"
      });
    }
  });

  const handleApprove = useCallback((user: User) => {
    approveMutation.mutate({ 
      userId: user.id, 
      notes: approvalNotes || `Aprovado em ${new Date().toLocaleDateString()}` 
    });
  }, [approveMutation, approvalNotes]);

  const handleReject = useCallback((user: User) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, forneça um motivo para a rejeição",
        variant: "destructive"
      });
      return;
    }
    
    rejectMutation.mutate({ 
      userId: user.id, 
      reason: rejectionReason 
    });
  }, [rejectMutation, rejectionReason]);

  const getStatusBadge = (status: string) => {
    const colors = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      active: "bg-blue-100 text-blue-800"
    };
    
    const labels = {
      verified: "Verificado",
      pending: "Pendente",
      rejected: "Rejeitado",
      active: "Ativo"
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      client: "👤",
      driver: "🚗",
      host: "🏨",
      restaurant: "🍽️",
      admin: "⚡"
    };
    return icons[type as keyof typeof icons] || "👤";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Carregando usuários...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar usuários</h3>
          <p className="text-gray-600">Tente novamente em alguns instantes</p>
        </div>
      </div>
    );
  }

  const users = usersData?.users || [];
  const pagination = usersData?.pagination || { total: 0, page: 1, totalPages: 1 };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8" />
                Gestão de Usuários
              </h1>
              <p className="text-gray-600 mt-1">
                Gerir todos os usuários registrados na plataforma
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white px-4 py-2">
                Total: {pagination.total}
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="client">Clientes</SelectItem>
                  <SelectItem value="driver">Motoristas</SelectItem>
                  <SelectItem value="host">Hostellers</SelectItem>
                  <SelectItem value="restaurant">Restaurantes</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="verified">Verificados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Usuários ({users.length} de {pagination.total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.profilePhotoUrl ? (
                              <img 
                                src={user.profilePhotoUrl} 
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">{getTypeIcon(user.type)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline">
                          {user.type}
                        </Badge>
                        {user.canOfferServices && (
                          <Badge className="ml-1 bg-blue-100 text-blue-800 text-xs">
                            Prestador
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(user.status)}
                        {user.hasDocuments && (
                          <FileCheck className="w-4 h-4 text-green-600 inline ml-2" />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {user.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{user.rating.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">({user.totalReviews})</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Sem avaliações</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {user.joinDate}
                        </div>
                        <div className="text-xs text-gray-400">
                          Último acesso: {user.lastActivity}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Usuário</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Nome</label>
                                      <p>{selectedUser.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p>{selectedUser.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Telefone</label>
                                      <p>{selectedUser.phone || 'Não informado'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <p>{getStatusBadge(selectedUser.status)}</p>
                                    </div>
                                  </div>
                                  
                                  {selectedUser.verificationNotes && (
                                    <div>
                                      <label className="text-sm font-medium">Notas de Verificação</label>
                                      <p className="bg-gray-50 p-2 rounded text-sm">{selectedUser.verificationNotes}</p>
                                    </div>
                                  )}

                                  {selectedUser.status === 'pending' && (
                                    <div className="border-t pt-4 space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">Notas de Aprovação (opcional)</label>
                                        <Textarea
                                          value={approvalNotes}
                                          onChange={(e) => setApprovalNotes(e.target.value)}
                                          placeholder="Adicione observações sobre a aprovação..."
                                          className="mt-1"
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="text-sm font-medium">Motivo da Rejeição</label>
                                        <Textarea
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          placeholder="Descreva o motivo da rejeição..."
                                          className="mt-1"
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <Button 
                                          onClick={() => handleApprove(selectedUser)}
                                          disabled={approveMutation.isPending}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <UserCheck className="w-4 h-4 mr-2" />
                                          {approveMutation.isPending ? 'Aprovando...' : 'Aprovar'}
                                        </Button>
                                        
                                        <Button 
                                          onClick={() => handleReject(selectedUser)}
                                          disabled={rejectMutation.isPending || !rejectionReason.trim()}
                                          variant="destructive"
                                        >
                                          <UserX className="w-4 h-4 mr-2" />
                                          {rejectMutation.isPending ? 'Rejeitando...' : 'Rejeitar'}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {user.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedUser(user);
                                  handleApprove(user);
                                }}
                                disabled={approveMutation.isPending}
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                              
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => setSelectedUser(user)}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Página {pagination.page} de {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Anterior
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}