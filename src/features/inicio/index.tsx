import { Link } from '@tanstack/react-router';
import { FileText, Users, FileCode, Settings, Info } from 'lucide-react';

export default function Inicio() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-12 mb-8 shadow-sm">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Bienvenido</h1>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Seminario de Solución de Problemas de Uso, Adaptación y Explotación de Sistemas Operativos
          </h2>
          <p className="text-lg mb-6 text-gray-600">
            Este proyecto está diseñado para visualizar y explorar las diferentes actividades de la materia.
          </p>
          <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
            Autor: Joan Alejandro Piña Puga
          </div>
        </div>
      </div>

      {/* Sección de Actividades */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-900">Actividades Disponibles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Actividad 11 */}
          <Link 
            to="/ActividadesSeminarioSO/actividad11" 
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <FileText className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Actividad 11</h2>
                <p className="text-gray-600 mb-4">
                  Aplicaciones y soluciones de problemas de concurrencia
                </p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Disponible
                </span>
              </div>
            </div>
          </Link>

          {/* Actividad 12 */}
          <Link 
            to="/ActividadesSeminarioSO/actividad12" 
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Users className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Actividad 12</h2>
                <p className="text-gray-600 mb-4">
                  Problema Productor-Consumidor con semáforos
                </p>
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                  Disponible
                </span>
              </div>
            </div>
          </Link>

          {/* Actividad 13 */}
          <Link 
            to="/ActividadesSeminarioSO/actividad13" 
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FileCode className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Actividad 13</h2>
                <p className="text-gray-600 mb-4">
                  Scripts en Sistemas Operativos (Windows y Linux)
                </p>
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                  Disponible
                </span>
              </div>
            </div>
          </Link>

          {/* Actividad 14 */}
          <Link 
            to="/ActividadesSeminarioSO/actividad14" 
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Settings className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Actividad 14</h2>
                <p className="text-gray-600 mb-4">
                  Algoritmo del Banquero para prevención de deadlock
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  Disponible
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Información adicional */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
        <Info className="size-5 text-blue-600 mt-0.5" />
        <p className="text-sm text-blue-900">
          Selecciona una actividad disponible del menú lateral o de las tarjetas superiores para comenzar.
        </p>
      </div>
    </div>
  );
}

