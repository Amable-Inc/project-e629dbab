'use client';

import { useState } from 'react';
import { Camera, AlertTriangle, Leaf, Cloud } from 'lucide-react';

interface FieldReportFormProps {
  onSubmit: (data: FieldReportData) => Promise<void>;
  plots: Array<{ id: string; plot_name: string; crop_type: string }>;
}

export interface FieldReportData {
  plotId: string;
  logType: 'pest_control' | 'disease_prevention' | 'climate_action';
  description: string;
  severityLevel: number;
  actionTaken: string;
  cost: number;
  ndviIndex: number;
  photoFile?: File;
}

export default function FieldReportForm({ onSubmit, plots }: FieldReportFormProps) {
  const [formData, setFormData] = useState<Partial<FieldReportData>>({
    logType: 'pest_control',
    severityLevel: 1,
    ndviIndex: 0.7,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photoFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plotId || !formData.description) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as FieldReportData);
      // Reset form
      setFormData({
        logType: 'pest_control',
        severityLevel: 1,
        ndviIndex: 0.7,
      });
      setPhotoPreview(null);
      alert('✅ Reporte enviado exitosamente');
    } catch (error) {
      alert('❌ Error al enviar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const logTypeIcons = {
    pest_control: Leaf,
    disease_prevention: AlertTriangle,
    climate_action: Cloud,
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Nuevo Reporte de Campo
      </h2>

      {/* Seleccionar Parcela */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Parcela *
        </label>
        <select
          className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
          value={formData.plotId || ''}
          onChange={(e) => setFormData({ ...formData, plotId: e.target.value })}
          required
        >
          <option value="">Selecciona una parcela</option>
          {plots.map((plot) => (
            <option key={plot.id} value={plot.id}>
              {plot.plot_name} - {plot.crop_type}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de Acción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Tipo de Acción *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['pest_control', 'disease_prevention', 'climate_action'] as const).map((type) => {
            const Icon = logTypeIcons[type];
            const labels = {
              pest_control: 'Control de Plagas',
              disease_prevention: 'Prevención',
              climate_action: 'Clima',
            };
            return (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, logType: type })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.logType === type
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                  formData.logType === type ? 'text-green-600' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.logType === type ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {labels[type]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción de la Situación *
        </label>
        <textarea
          className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none resize-none"
          rows={4}
          placeholder="Describe qué encontraste y qué acción tomaste..."
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      {/* Acción Tomada */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Acción Realizada
        </label>
        <input
          type="text"
          className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
          placeholder="Ej: Aplicación de fungicida orgánico"
          value={formData.actionTaken || ''}
          onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
        />
      </div>

      {/* Costo de la Acción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Costo de la Acción (COP)
        </label>
        <input
          type="number"
          className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
          placeholder="0"
          value={formData.cost || ''}
          onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
        />
      </div>

      {/* Nivel de Severidad */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nivel de Severidad: {formData.severityLevel}
        </label>
        <input
          type="range"
          min="1"
          max="5"
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          value={formData.severityLevel || 1}
          onChange={(e) => setFormData({ ...formData, severityLevel: Number(e.target.value) })}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Leve</span>
          <span>Crítico</span>
        </div>
      </div>

      {/* Índice NDVI (Salud del Cultivo) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Salud del Cultivo (NDVI): {formData.ndviIndex?.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          value={formData.ndviIndex || 0.7}
          onChange={(e) => setFormData({ ...formData, ndviIndex: Number(e.target.value) })}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Bajo</span>
          <span>Óptimo</span>
        </div>
      </div>

      {/* Foto de Evidencia */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Foto de Evidencia
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <>
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-600 font-medium">Toca para tomar foto</span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition-colors"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
      </button>
    </form>
  );
}
