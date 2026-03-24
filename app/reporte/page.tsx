'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FieldReportForm, { FieldReportData } from '@/components/field-report-form';

// Mock plots data
const mockPlots = [
  { id: '1', plot_name: 'Lote Norte', crop_type: 'Arroz' },
  { id: '2', plot_name: 'Lote Sur', crop_type: 'Maíz' },
  { id: '3', plot_name: 'Parcela Este', crop_type: 'Café' },
];

export default function ReportePage() {
  const handleSubmit = async (data: FieldReportData) => {
    // En producción: enviar a Supabase
    console.log('Datos del reporte:', data);
    
    // Simular upload de foto
    if (data.photoFile) {
      console.log('Subiendo foto:', data.photoFile.name);
      // const { data: uploadData, error } = await supabase.storage
      //   .from('risk-logs')
      //   .upload(`${farmerId}/${Date.now()}-${photoFile.name}`, photoFile);
    }

    // Insertar en risk_logs
    // const { error } = await supabase.from('risk_logs').insert({
    //   plot_id: data.plotId,
    //   farmer_id: farmerId,
    //   log_type: data.logType,
    //   description: data.description,
    //   severity_level: data.severityLevel,
    //   action_taken: data.actionTaken,
    //   cost: data.cost,
    //   ndvi_index: data.ndviIndex,
    //   photo_url: uploadData?.path,
    // });

    // Esperar 1 segundo para simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
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
        <FieldReportForm onSubmit={handleSubmit} plots={mockPlots} />

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
