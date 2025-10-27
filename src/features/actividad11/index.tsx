import { AlertTriangle, BookOpen, Lightbulb, Lock, Zap } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const problemas = [
  { id: 'condicion-carrera', titulo: 'Condición de Carrera', icon: '⚡', color: 'from-red-400 to-red-600' },
  { id: 'deadlock', titulo: 'Deadlock', icon: '🔒', color: 'from-orange-400 to-orange-600' },
  { id: 'starvation', titulo: 'Starvation', icon: '🍽️', color: 'from-yellow-400 to-yellow-600' },
  { id: 'livelock', titulo: 'Livelock', icon: '🔄', color: 'from-green-400 to-green-600' },
  { id: 'lectura-escritura', titulo: 'Lectura/Escritura', icon: '📖', color: 'from-teal-400 to-teal-600' },
  { id: 'contencion-recursos', titulo: 'Contención de Recursos', icon: '⚔️', color: 'from-cyan-400 to-cyan-600' },
  { id: 'bloqueos-innecesarios', titulo: 'Bloqueos Innecesarios', icon: '🚧', color: 'from-blue-400 to-blue-600' },
  { id: 'eventos', titulo: 'Eventos', icon: '📡', color: 'from-indigo-400 to-indigo-600' },
  { id: 'priority-inversion', titulo: 'Priority Inversion', icon: '⬆️', color: 'from-purple-400 to-purple-600' },
  { id: 'aba', titulo: 'ABA Problem', icon: '🔀', color: 'from-pink-400 to-pink-600' },
  { id: 'memory-consistency', titulo: 'Memory Consistency', icon: '💾', color: 'from-rose-400 to-rose-600' },
  { id: 'thundering-herd', titulo: 'Thundering Herd', icon: '🦬', color: 'from-amber-400 to-amber-600' },
  { id: 'convoying', titulo: 'Convoying', icon: '🚛', color: 'from-lime-400 to-lime-600' },
  { id: 'false-sharing', titulo: 'False Sharing', icon: '🔗', color: 'from-emerald-400 to-emerald-600' },
  { id: 'lost-wakeup', titulo: 'Lost Wakeup', icon: '😴', color: 'from-sky-400 to-sky-600' },
];

export default function Actividad11() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-gray-700 text-white">
              <Lock className="size-6" />
            </div>
            <h1 className="text-4xl font-bold text-white">Aplicaciones y Solución de Problemas de Concurrencia</h1>
          </div>
          <p className="text-gray-400 text-sm">Análisis de 15 problemas clásicos y sus soluciones</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white text-gray-900 rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="size-6 text-blue-600" />
            <h2 className="text-2xl font-bold">¿Qué es la Concurrencia?</h2>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              La <strong className="text-blue-600">concurrencia</strong> es la capacidad de un sistema para ejecutar múltiples tareas aparentemente al mismo tiempo. 
              En sistemas modernos, esto permite aprovechar procesadores multinúcleo y mejorar significativamente el rendimiento de las aplicaciones.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Sin embargo, la programación concurrente introduce <strong className="text-red-600">complejidad adicional</strong> y diversos problemas que pueden 
              afectar la correctitud y rendimiento del sistema. Estos problemas pueden ser sutiles, difíciles de reproducir y detectar.
            </p>
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="size-6 text-red-600" />
            <h2 className="text-2xl font-bold text-red-900">Problemas Más Comunes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border-l-4 border-red-500 p-4 rounded shadow-sm">
              <h3 className="font-bold text-red-900 mb-2">⚡ Condiciones de Carrera</h3>
              <p className="text-sm text-gray-700">Múltiples threads acceden a datos compartidos simultáneamente.</p>
            </div>
            <div className="bg-white border-l-4 border-orange-500 p-4 rounded shadow-sm">
              <h3 className="font-bold text-orange-900 mb-2">🔒 Deadlocks</h3>
              <p className="text-sm text-gray-700">Procesos bloqueados esperando recursos mutuamente.</p>
            </div>
            <div className="bg-white border-l-4 border-yellow-500 p-4 rounded shadow-sm">
              <h3 className="font-bold text-yellow-900 mb-2">🍽️ Starvation</h3>
              <p className="text-sm text-gray-700">Un proceso nunca obtiene los recursos necesarios.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="size-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">15 Problemas de Concurrencia</h2>
          </div>

          <p className="text-gray-300 mb-6">
            A continuación se presentan 15 problemas clásicos de concurrencia. Cada uno incluye una descripción detallada y múltiples soluciones implementadas. 
            Haz clic en cualquier problema para explorar su análisis completo:
          </p>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {problemas.map((problema) => (
              <Link
                key={problema.id}
                // @ts-expect-error - Dynamic route construction for problem pages
                to={`/ActividadesSeminarioSO/actividad11/${problema.id}`}
                className={`block rounded-lg bg-gradient-to-br ${problema.color} p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105`}
              >
                <div className="text-4xl mb-3">{problema.icon}</div>
                <h3 className="text-lg font-bold text-white">{problema.titulo}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 flex items-start gap-3">
          <Lightbulb className="size-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-200">
            Explora cada problema de concurrencia para entender sus causas, consecuencias y las diferentes estrategias para resolverlo de manera efectiva.
          </p>
        </div>
      </div>
    </div>
  );
}
