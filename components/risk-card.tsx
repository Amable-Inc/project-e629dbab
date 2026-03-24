'use client';

import { AlertTriangle, Leaf, Cloud, Calendar } from 'lucide-react';

interface RiskCardProps {
  logType: 'pest_control' | 'disease_prevention' | 'climate_action';
  description: string;
  actionTaken?: string;
  cost?: number;
  ndviIndex?: number;
  loggedAt: string;
  photoUrl?: string;
  severityLevel?: number;
}

export default function RiskCard({
  logType,
  description,
  actionTaken,
  cost,
  ndviIndex,
  loggedAt,
  photoUrl,
  severityLevel,
}: RiskCardProps) {
  const icons = {
    pest_control: Leaf,
    disease_prevention: AlertTriangle,
    climate_action: Cloud,
  };

  const titles = {
    pest_control: 'Control de Plagas',
    disease_prevention: 'Prevención de Enfermedades',
    climate_action: 'Acción Climática',
  };

  const colors = {
    pest_control: 'bg-green-100 text-green-700 border-green-300',
    disease_prevention: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    climate_action: 'bg-blue-100 text-blue-700 border-blue-300',
  };

  const Icon = icons[logType];
  const date = new Date(loggedAt);
  const formattedDate = date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden">
      {/* Foto (si existe) */}
      {photoUrl && (
        <div className="w-full h-48 bg-gray-200">
          <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${colors[logType]}`}>
            <Icon className="w-5 h-5" />
            <span className="text-sm font-semibold">{titles[logType]}</span>
          </div>
          
          {severityLevel && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 rounded-sm ${
                    i < severityLevel ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Descripción */}
        <p className="text-gray-700 text-base mb-4 leading-relaxed">
          {description}
        </p>

        {/* Acción Tomada */}
        {actionTaken && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-800 mb-1">Acción Realizada:</p>
            <p className="text-sm text-green-700">{actionTaken}</p>
          </div>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {cost !== undefined && cost > 0 && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Inversión</p>
              <p className="text-sm font-bold text-gray-800">
                ${(cost / 1000).toFixed(1)}k
              </p>
            </div>
          )}
          
          {ndviIndex !== undefined && (
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">NDVI</p>
              <p className="text-sm font-bold text-green-700">
                {ndviIndex.toFixed(2)}
              </p>
            </div>
          )}

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Fecha</p>
            <p className="text-xs font-bold text-blue-700">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Registrado hace {Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))} días</span>
        </div>
      </div>
    </div>
  );
}
