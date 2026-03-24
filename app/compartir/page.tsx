'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Copy, CheckCircle, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { db, type BankAccessToken } from '@/lib/db';

export default function CompartirPage() {
  const [tokens, setTokens] = useState<BankAccessToken[]>([]);
  const [showNewTokenModal, setShowNewTokenModal] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    const currentFarmerId = 'farmer-1';
    db.getTokensByFarmerId(currentFarmerId).then(setTokens);
  }, []);

  const handleGenerateToken = async () => {
    if (!newBankName.trim()) {
      alert('Por favor ingresa el nombre del banco');
      return;
    }

    // Generar token simulado
    const newTokenValue = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const token = await db.createToken({
      farmerId: 'farmer-1',
      token: newTokenValue,
      bankName: newBankName,
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      accessCount: 0,
    });

    setTokens([token, ...tokens]);
    setNewBankName('');
    setShowNewTokenModal(false);
    
    // Auto-copiar el token
    handleCopyToken(newTokenValue);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleRevokeToken = async (tokenId: string) => {
    if (confirm('¿Estás seguro de que deseas revocar este token? El banco no podrá acceder más a tu perfil.')) {
      await db.revokeToken(tokenId);
      setTokens(tokens.map(t => t.id === tokenId ? { ...t, isActive: false } : t));
    }
  };

  const getDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return 0;
    const days = Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/">
            <button className="p-2 hover:bg-purple-700 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Compartir Perfil</h1>
            <p className="text-purple-100 text-sm">Tokens de acceso bancario</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 mb-2">¿Cómo funciona?</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Genera un token de acceso para el banco que necesita evaluar tu crédito</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Comparte el token de forma segura (WhatsApp, email, presencial)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>El banco accede a tu Green Credit Score usando el token</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Puedes revocar el acceso en cualquier momento</span>
            </li>
          </ol>
        </div>

        {/* Botón Generar Token */}
        <button
          onClick={() => setShowNewTokenModal(true)}
          className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <Share2 className="w-6 h-6" />
          <span className="text-lg font-bold">Generar Nuevo Token</span>
        </button>

        {/* Modal Nuevo Token */}
        {showNewTokenModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nuevo Token de Acceso</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Banco o Entidad Financiera
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Ej: Banco Agrario"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                />
              </div>

              <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">⏰ Expiración:</span> El token será válido por 30 días. 
                  Puedes revocarlo antes si es necesario.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewTokenModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerateToken}
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Generar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tokens Activos */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tokens Activos</h2>
          <div className="space-y-4">
            {tokens.filter(t => t.isActive).map((token) => {
              const daysRemaining = getDaysRemaining(token.expiresAt);
              const isCopied = copiedToken === token.token;

              return (
                <div key={token.id} className="bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{token.bankName}</h3>
                      <p className="text-sm text-gray-500">
                        Creado el {new Date(token.grantedAt).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Activo
                    </span>
                  </div>

                  {/* Token Display */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl font-mono text-sm break-all border-2 border-gray-200">
                    {token.token}
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-700">
                        Expira en <span className="font-semibold">{daysRemaining}d</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">
                        <span className="font-semibold">{token.accessCount}</span> accesos
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopyToken(token.token)}
                      className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copiar Token
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRevokeToken(token.id)}
                      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                    >
                      Revocar
                    </button>
                  </div>
                </div>
              );
            })}

            {tokens.filter(t => t.isActive).length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
                <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No tienes tokens activos</p>
                <p className="text-sm text-gray-500 mt-1">Genera uno para compartir tu perfil</p>
              </div>
            )}
          </div>
        </div>

        {/* Tokens Revocados */}
        {tokens.filter(t => !t.isActive).length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tokens Revocados</h2>
            <div className="space-y-3">
              {tokens.filter(t => !t.isActive).map((token) => (
                <div key={token.id} className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300 opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-700">{token.bankName}</h3>
                      <p className="text-sm text-gray-500">Token revocado</p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Inactivo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advertencia de Seguridad */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Advertencia de Seguridad</h3>
          <ul className="space-y-1 text-sm text-yellow-800">
            <li>• No compartas tokens con entidades no verificadas</li>
            <li>• Verifica la identidad del banco antes de compartir</li>
            <li>• Revoca tokens si sospechas uso indebido</li>
            <li>• Los tokens expiran automáticamente en 30 días</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
