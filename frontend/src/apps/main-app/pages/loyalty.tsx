import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import PageHeader from "@/shared/components/PageHeader";

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader title="Programa de Fidelidade" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <i className="fas fa-crown text-white text-3xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Programa de Fidelidade Link-A
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Ganhe pontos em cada viagem e estadia, troque por recompensas incríveis
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 text-center">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Sistema de Fidelidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              O programa de fidelidade Link-A está em desenvolvimento e requer integração com dados reais.
            </p>
            <p className="text-sm text-gray-500">
              Funcionalidades planejadas: pontos por viagens, níveis de membro, recompensas e benefícios exclusivos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}