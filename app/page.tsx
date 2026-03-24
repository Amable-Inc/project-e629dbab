'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Leaf, Plus } from 'lucide-react';
import CreditMeter from '@/components/credit-meter';
import RiskCard from '@/components/risk-card';
import Link from 'next/link';
import { db, type CreditScore, type RiskLog } from '@/lib/db';

export default function Dashboard() {
  const [farmerName, setFarmerName] = useState('Agricultor');
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [recentLogs, setRecentLogs] = useState<RiskLog[]>([]);

  useEffect(() => {
    // Cargar datos del agricultor actual (simulado)
    const currentFarmerId = 'farmer-1';
    
    db.getFarmer(currentFarmerId).then(farmer => {
      if (farmer) setFarmerName(farmer.fullName);
    });

    db.getCreditScoreByFarmerId(currentFarmerId).then(score => {
      setCreditScore(score);
    });

    db.getRiskLogsByFarmerId(currentFarmerId, 3).then(logs => {
      setRecentLogs(logs);
    });
  }, []);

  const mockAlerts = [
    {
      id: '1',
      type: 'weather',
      message: 'Lluvias intensas esperadas para el fin de semana',
      urgency: 'media',
    },
    {
      id: '2',
      type: 'action',
      message: `Hace ${creditScore?.daysSinceLastReport || 0} días desde tu último reporte. Mantén tu puntaje activo.`,
      urgency: 'baja',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header Mobile */}
      <header className="bg-green-600 text-white p-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Hola, {farmerName} 👋</h1>
          <p className="text-green-100 text-sm">Finca El Progreso</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Alertas Tempranas */}
        {mockAlerts.length > 0 && (
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl flex items-start gap-3 ${
                  alert.urgency === 'media'
                    ? 'bg-yellow-50 border-2 border-yellow-300'
                    : 'bg-blue-50 border-2 border-blue-200'
                }`}
              >
                <AlertCircle
                  className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                    alert.urgency === 'media' ? 'text-yellow-600' : 'text-blue-600'
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    alert.urgency === 'media' ? 'text-yellow-800' : 'text-blue-800'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Credit Meter */}
        {creditScore && (
          <CreditMeter
            score={creditScore.score}
            riskLevel={creditScore.riskLevel}
          />
        )}

        {/* Métricas Rápidas */}
        {creditScore && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-md p-5 border-2 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Reportes</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {creditScore.preventionActionsCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">Últimos 6 meses</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 border-2 border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">NDVI Prom.</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {creditScore.avgNdvi?.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Salud del cultivo</p>
            </div>
          </div>
        )}

        {/* CTA: Nuevo Reporte */}
        <Link href="/reporte">
          <button className="w-full py-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3">
            <Plus className="w-6 h-6" />
            <span className="text-lg font-bold">Nuevo Reporte de Campo</span>
          </button>
        </Link>

        {/* Reportes Recientes */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Reportes Recientes
          </h2>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <RiskCard key={log.id} {...log} />
            ))}
          </div>
        </div>

        {/* Acceso Bancario */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-2">¿Listo para solicitar crédito?</h3>
          <p className="text-blue-100 text-sm mb-4">
            Comparte tu perfil de riesgo con instituciones financieras
          </p>
          <Link href="/compartir">
            <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
              Generar Token de Acceso
            </button>
          </Link>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <Link href="/">
            <button className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl">
              Inicio
            </button>
          </Link>
          <Link href="/reporte">
            <button className="w-full py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200">
              Reportar
            </button>
          </Link>
          <Link href="/perfil">
            <button className="w-full py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200">
              Perfil
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
