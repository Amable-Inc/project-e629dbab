'use client';

import { useState, useEffect } from 'react';
import { Building2, CheckCircle, XCircle, TrendingUp, MapPin } from 'lucide-react';
import { db, type Farmer, type Plot, type CreditScore, type RiskLog } from '@/lib/db';

export default function BankViewPage() {
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [profile, setProfile] = useState<{
    farmer: Farmer;
    plots: Plot[];
    creditScore: CreditScore;
    recentActivity: RiskLog[];
  } | null>(null);

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar token
    const tokenData = await db.getTokenByValue(token);
    if (!tokenData || !tokenData.isActive) {
      alert('Token inválido o expirado');
      return;
    }

    // Cargar datos del agricultor
    const farmer = await db.getFarmer(tokenData.farmerId);
    const plots = await db.getPlotsByFarmerId(tokenData.farmerId);
    const creditScore = await db.getCreditScoreByFarmerId(tokenData.farmerId);
    const recentActivity = await db.getRiskLogsByFarmerId(tokenData.farmerId, 5);

    if (farmer && creditScore) {
      setProfile({
        farmer,
        plots,
        creditScore,
        recentActivity,
      });
      setIsValidToken(true);

      // Actualizar contador de accesos
      await db.updateToken(tokenData.id, {
        accessCount: tokenData.accessCount + 1,
        lastAccessedAt: new Date().toISOString(),
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      bajo: 'bg-green-100 text-green-700 border-green-300',
      medio: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      alto: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[level as keyof typeof colors];
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Portal Bancario AgroCredit
            </h1>
            <p className="text-gray-600">
              Ingrese el token de acceso proporcionado por el agricultor
            </p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Token de Acceso
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Ej: a1b2c3d4e5f6g7h8..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tokens de prueba: <code className="bg-gray-100 px-2 py-1 rounded">a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Acceder al Perfil
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Nota de seguridad:</span> Este portal solo muestra información 
              de agricultores que han autorizado explícitamente el acceso. Los tokens expiran 
              automáticamente según los términos acordados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Evaluación de Riesgo Crediticio</h1>
              <p className="text-blue-100 text-sm">Perfil del Agricultor</p>
            </div>
            <Building2 className="w-10 h-10" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Información del Agricultor */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profile.farmer.fullName}
              </h2>
              <p className="text-gray-600">{profile.farmer.farmName}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border-2 ${getRiskBadge(profile.creditScore.riskLevel)}`}>
              <span className="text-sm font-bold">
                Riesgo {profile.creditScore.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Ubicación</p>
                <p className="text-sm font-semibold text-gray-800">
                  {profile.farmer.municipality}, {profile.farmer.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Hectáreas</p>
                <p className="text-sm font-semibold text-gray-800">
                  {profile.creditScore.totalHectares} ha
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Parcelas</p>
                <p className="text-sm font-semibold text-gray-800">
                  {profile.creditScore.totalPlots}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-gray-500">Zona de Riesgo</p>
                <p className="text-sm font-semibold text-gray-800">
                  Nivel {profile.farmer.riskZoneLevel}/5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Green Credit Score */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Green Credit Score</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Score Principal */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreColor(profile.creditScore.score)} border-4`}>
                <div>
                  <p className="text-4xl font-bold">{profile.creditScore.score}</p>
                  <p className="text-xs">de 100</p>
                </div>
              </div>
              <p className="mt-4 font-semibold text-gray-700">Puntaje General</p>
            </div>

            {/* Componentes del Score */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Resiliencia Climática</span>
                  <span className="text-gray-600">{profile.creditScore.climateResilienceScore}/50</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${((profile.creditScore.climateResilienceScore || 0) / 50) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Compromiso Financiero</span>
                  <span className="text-gray-600">{profile.creditScore.financialCommitmentScore}/30</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${((profile.creditScore.financialCommitmentScore || 0) / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">NDVI Promedio</p>
                  <p className="text-2xl font-bold text-green-700">
                    {profile.creditScore.avgNdvi?.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Reportes (6m)</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {profile.creditScore.preventionActionsCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parcelas */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Parcelas Registradas</h3>
          <div className="space-y-3">
            {profile.plots.map((plot) => (
              <div key={plot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800">{plot.plotName}</p>
                  <p className="text-sm text-gray-600">{plot.cropType} • {plot.hectares} ha</p>
                </div>
                {plot.certifiedSeeds ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Semillas Certificadas</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm">Sin certificar</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Inversión en Prevención</h3>
          <div className="space-y-3">
            {profile.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-gray-50 rounded-r-xl">
                <div>
                  <p className="font-semibold text-gray-800">{activity.description.substring(0, 60)}...</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.loggedAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  ${((activity.cost || 0) / 1000).toFixed(0)}k
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-semibold text-blue-800">
              Inversión Total (últimos reportes): ${(profile.recentActivity.reduce((sum, a) => sum + (a.cost || 0), 0) / 1000).toFixed(0)}k COP
            </p>
          </div>
        </div>

        {/* Recomendación */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-3">Recomendación de Análisis</h3>
          <p className="text-green-50 mb-4">
            {profile.creditScore.score >= 70
              ? '✅ Este perfil demuestra prácticas agrícolas responsables y un compromiso consistente con la mitigación de riesgo. Se recomienda considerar favorablemente la solicitud.'
              : profile.creditScore.score >= 40
              ? '⚠️ Perfil con potencial. El agricultor está activo en prevención pero requiere más consistencia. Se recomienda acompañamiento técnico junto con el crédito.'
              : '❌ Perfil de alto riesgo. Se recomienda que el agricultor aumente su actividad preventiva antes de proceder con el crédito.'}
          </p>
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
              Descargar Reporte PDF
            </button>
            <button className="flex-1 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-colors">
              Aprobar Solicitud
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
