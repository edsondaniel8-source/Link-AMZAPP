import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimpleRoleSelectorProps {
  onRoleSelected: (role: string) => void;
  userEmail: string;
}

export default function SimpleRoleSelector({ onRoleSelected, userEmail }: SimpleRoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>('client');

  const roles = [
    {
      id: 'client',
      title: '🧳 Passageiro',
      description: 'Quero reservar viagens e hospedagem'
    },
    {
      id: 'driver', 
      title: '🚗 Motorista',
      description: 'Quero oferecer serviços de transporte'
    },
    {
      id: 'hotel',
      title: '🏨 Hotel',
      description: 'Quero gerir acomodações'
    },
    {
      id: 'event',
      title: '🎭 Organizador de Eventos', 
      description: 'Quero criar e gerir eventos'
    }
  ];

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail, 
          password: 'temp-password', // Em produção viria do Firebase
          role: selectedRole 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Registro concluído:', data);
        onRoleSelected(selectedRole);
      }
    } catch (error) {
      console.error('❌ Erro no registro:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Escolha seu tipo de conta</h2>
        <p className="text-gray-600 mt-2">Para: {userEmail}</p>
      </div>

      <div className="grid gap-3">
        {roles.map((role) => (
          <Card 
            key={role.id}
            className={`cursor-pointer transition-all ${
              selectedRole === role.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{role.title}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
                {selectedRole === role.id && (
                  <Badge variant="default">Selecionado</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={handleSubmit}
        className="w-full"
        data-testid="button-confirm-role"
      >
        Confirmar e Criar Conta
      </Button>
    </div>
  );
}