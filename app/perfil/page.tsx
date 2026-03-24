'use client';

import { useState } from 'react';
import { ArrowLeft, Edit, MapPin, Phone, Mail, Leaf } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockFarmer = {
  fullName: 'Juan Pérez García',
  phone: '+57 300 123 4567',
  email: 'juan.perez@ejemplo.com',
  documentId: '1234567890',
  farmName: 'Finca El Progreso',
  farmAddress: 'Vereda Las Flores, Km 8',
  municipality: 'Montería',
  department: 'Córdoba',
  riskZoneLevel: 2,
  memberSince: '2023-03-15',
};

const mockPlots = [
  { id: '1', plotName: 'Lote Norte', hectares: 5, cropType: 'Arroz', certifiedSeeds: true },
  { id: '2', plotName: 'Lote Sur', hectares: 4.5, cropType: 'Maíz', certifiedSeeds: true },
  { id: '3', plotName: 'Parcela Este', hectares: 3, cropType: 'Café', certifiedSeeds: false },
];

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-6 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Mi Perfil</h1>
              <p className="text-green-100 text-sm">Información del agricultor</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 bg-green-700 hover:bg-green-800 rounded-xl transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Información Personal */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Nombre Completo</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                value={mockFarmer.fullName}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Cédula</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                value={mockFarmer.documentId}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                  value={mockFarmer.phone}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                  value={mockFarmer.email}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información de la Finca */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Información de la Finca</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Nombre de la Finca</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                value={mockFarmer.farmName}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                <MapPin className="w-4 h-4 inline mr-1" />
                Dirección
              </label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                value={mockFarmer.farmAddress}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Municipio</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                  value={mockFarmer.municipality}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Departamento</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                  value={mockFarmer.department}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Zona de Riesgo:</span> Nivel {mockFarmer.riskZoneLevel}/5
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Basado en histórico de desastres naturales en tu región
              </p>
            </div>
          </div>
        </div>

        {/* Mis Parcelas */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Mis Parcelas</h2>
            <button className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors">
              + Agregar
            </button>
          </div>

          <div className="space-y-3">
            {mockPlots.map((plot) => (
              <div key={plot.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-800">{plot.plotName}</h3>
                      <p className="text-sm text-gray-600">{plot.cropType}</p>
                      <p className="text-xs text-gray-500 mt-1">{plot.hectares} hectáreas</p>
                    </div>
                  </div>
                  
                  {plot.certifiedSeeds && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Semillas Certificadas
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Total:</span> {mockPlots.length} parcelas, {mockPlots.reduce((sum, p) => sum + p.hectares, 0)} hectáreas
            </p>
          </div>
        </div>

        {/* Estadísticas de Membresía */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-3">Miembro desde</h3>
          <p className="text-3xl font-bold">
            {new Date(mockFarmer.memberSince).toLocaleDateString('es-CO', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-green-100 text-sm mt-2">
            {Math.floor((Date.now() - new Date(mockFarmer.memberSince).getTime()) / (1000 * 60 * 60 * 24))} días contribuyendo al ecosistema AgroCredit
          </p>
        </div>

        {/* Botón de Guardar */}
        {isEditing && (
          <button className="w-full py-5 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 transition-colors">
            Guardar Cambios
          </button>
        )}
      </main>
    </div>
  );
}
