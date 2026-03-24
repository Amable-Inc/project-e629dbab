'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FieldReportForm, { FieldReportData } from '@/components/field-report-form';
import { db, type Plot } from '@/lib/db';

export default function ReportePage() {
  const router = useRouter();
  const [plots, setPlots] = useState<Plot[]>([]);

  useEffect(() => {
    // Cargar parcelas del agricultor actual
    const currentFarmerId = 'farmer-1';
    db.getPlotsByFarmerId(currentFarmerId).then(setPlots);
  }, []);

  const handleSubmit = async (data: FieldReportData) => {
    // Simular guardado en DB
    await db.createRiskLog({
      plotId: data.plotId,
      farmerId: 'farmer-1',
      logType: data.logType,
      description: data.description,
      severityLevel: data.severityLevel,
      actionTaken: data.actionTaken,
      cost: data.cost,
      ndviIndex: data.ndviIndex,
      photoUrl: data.photoFile ? URL.createObjectURL(data.photoFile) : undefined,
      loggedAt: new Date().toISOString(),
    });

    // Esperar 1 segundo para simular
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirigir al dashboard
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-6 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/">
            <button className="p-2 hover:bg-green-700 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Reporte de Campo</h1>
            <p className="text-green-100 text-sm">Registra tus acciones preventivas</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> Cada reporte que hagas aumenta tu puntaje de crédito. 
            Sube fotos para mejor evidencia.
          </p>
        </div>

        {/* Form */}
        <FieldReportForm 
          onSubmit={handleSubmit} 
          plots={plots.map(p => ({ 
            id: p.id, 
            plot_name: p.plotName, 
            crop_type: p.cropType 
          }))} 
        />

        {/* Info Footer */}
        <div className="mt-6 p-5 bg-white rounded-xl shadow-md border-2 border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">¿Por qué reportar?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Aumenta tu Green Credit Score</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Demuestra prácticas responsables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Facilita la aprobación de créditos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Genera historial auditable</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
