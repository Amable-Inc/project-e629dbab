'use client';

interface CreditMeterProps {
  score: number;
  riskLevel: 'bajo' | 'medio' | 'alto';
}

export default function CreditMeter({ score, riskLevel }: CreditMeterProps) {
  // Determinar color basado en el score
  const getColor = () => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskColor = () => {
    if (riskLevel === 'bajo') return 'text-green-600 bg-green-50';
    if (riskLevel === 'medio') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMessage = () => {
    if (score >= 80) return '¡Excelente! Muy probable aprobación';
    if (score >= 70) return 'Buenas probabilidades de aprobación';
    if (score >= 50) return 'Sigue mejorando tu puntaje';
    if (score >= 30) return 'Necesitas más acciones preventivas';
    return 'Comienza a registrar tus prácticas';
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
      {/* Título */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Termómetro de Crédito
        </h2>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskColor()}`}>
          Riesgo {riskLevel.toUpperCase()}
        </span>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            {/* Círculo de fondo */}
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="#E5E7EB"
              strokeWidth="16"
              fill="none"
            />
            {/* Círculo de progreso */}
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="16"
              fill="none"
              strokeDasharray={`${(score / 100) * 502.4} 502.4`}
              strokeLinecap="round"
              className={`${getColor().replace('bg-', 'text-')} transition-all duration-1000`}
            />
          </svg>
          {/* Número del score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-gray-800">{score}</span>
            <span className="text-sm text-gray-500">de 100</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso lineal */}
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">{getMessage()}</p>
      </div>

      {/* Indicadores de rango */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 rounded bg-red-50">
          <span className="text-red-600 font-semibold">0-39</span>
          <p className="text-red-500">Alto</p>
        </div>
        <div className="text-center p-2 rounded bg-yellow-50">
          <span className="text-yellow-600 font-semibold">40-69</span>
          <p className="text-yellow-500">Medio</p>
        </div>
        <div className="text-center p-2 rounded bg-green-50">
          <span className="text-green-600 font-semibold">70-100</span>
          <p className="text-green-500">Bajo</p>
        </div>
      </div>
    </div>
  );
}
