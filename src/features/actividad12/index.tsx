import ProductoConsumidor from './components/producto-consumidor';
import { AlertCircle, BookOpen } from 'lucide-react';

export default function Actividad12() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-purple-600 text-white">
              <BookOpen className="size-6" />
            </div>
            <h1 className="text-4xl font-bold text-white">Problema Productor-Consumidor</h1>
          </div>
          <p className="text-gray-400 text-sm">Sincronización clásica con buffer limitado usando semáforos</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Explicación del Planteamiento */}
        <div className="bg-white text-gray-900 rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="size-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Planteamiento del Problema</h2>
          </div>
          
          <div className="prose prose-gray max-w-none space-y-4">
            <p className="text-gray-700 leading-relaxed">
              El problema del <strong className="text-purple-600">Productor-Consumidor</strong> es uno de los problemas clásicos 
              de sincronización en sistemas concurrentes. En este escenario, uno o más hilos productores generan datos que son 
              depositados en un buffer compartido, mientras que uno o más hilos consumidores retiran datos de ese buffer para procesarlos.
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
              <h3 className="font-bold text-purple-900 mb-2">🎯 Objetivo del Problema</h3>
              <p className="text-gray-700 text-sm">
                Coordinar el acceso al buffer compartido de manera que:
              </p>
              <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                <li>Los productores no intenten agregar elementos cuando el buffer está lleno</li>
                <li>Los consumidores no intenten retirar elementos cuando el buffer está vacío</li>
                <li>No ocurran condiciones de carrera al acceder al buffer</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Componentes del Sistema</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">👷 Productor</h4>
                <p className="text-sm text-gray-700">
                  Genera items y los deposita en el buffer compartido. Debe esperar si el buffer está lleno.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">📦 Buffer</h4>
                <p className="text-sm text-gray-700">
                  Estructura de datos compartida con capacidad limitada que almacena temporalmente los items.
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-2">👨‍💼 Consumidor</h4>
                <p className="text-sm text-gray-700">
                  Retira items del buffer para procesarlos. Debe esperar si el buffer está vacío.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Solución con Semáforos</h3>
            <p className="text-gray-700 leading-relaxed">
              Para resolver este problema utilizamos <strong>tres semáforos</strong> que coordinan el acceso al buffer:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 my-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900">mutex (binario)</h4>
                  <p className="text-sm text-gray-700">
                    Garantiza exclusión mutua al acceder al buffer. Solo un hilo (productor o consumidor) puede modificar 
                    el buffer a la vez.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900">empty (contador)</h4>
                  <p className="text-sm text-gray-700">
                    Cuenta los espacios vacíos en el buffer. Inicializado con el tamaño del buffer. Los productores esperan 
                    (wait) en este semáforo antes de agregar items.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900">full (contador)</h4>
                  <p className="text-sm text-gray-700">
                    Cuenta los items disponibles en el buffer. Inicializado en 0. Los consumidores esperan (wait) en este 
                    semáforo antes de retirar items.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-900 mb-1">Orden Crítico</h4>
                  <p className="text-sm text-gray-700">
                    Es crucial que los productores hagan <code className="bg-yellow-100 px-1 rounded">wait(empty)</code> antes 
                    de <code className="bg-yellow-100 px-1 rounded">wait(mutex)</code>, y los consumidores hagan{' '}
                    <code className="bg-yellow-100 px-1 rounded">wait(full)</code> antes de{' '}
                    <code className="bg-yellow-100 px-1 rounded">wait(mutex)</code>. De lo contrario, puede ocurrir un deadlock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demostración Interactiva */}
        <ProductoConsumidor />
      </div>
    </div>
  );
}