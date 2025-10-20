import AlgoritmoBanquero from './components/algoritmo-banquero';
import { AlertCircle, BookOpen, Shield } from 'lucide-react';

export default function Actividad14() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-12">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="size-6" />
            </div>
            <h1 className="text-4xl font-bold text-white">Algoritmo del Banquero</h1>
          </div>
          <p className="text-gray-400 text-sm">Prevención de interbloqueo mediante asignación segura de recursos</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Explicación del Planteamiento */}
        <div className="bg-white text-gray-900 rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="size-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Planteamiento del Problema</h2>
          </div>
          
          <div className="prose prose-gray max-w-none space-y-4">
            <p className="text-gray-700 leading-relaxed">
              El <strong className="text-blue-600">Algoritmo del Banquero</strong> es un algoritmo de prevención de 
              interbloqueo (deadlock) propuesto por Edsger Dijkstra. Su nombre proviene de la analogía con un banquero 
              que debe decidir si otorgar préstamos a clientes de manera que siempre pueda satisfacer todas las 
              necesidades máximas de sus clientes sin quedarse sin recursos.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <h3 className="font-bold text-blue-900 mb-2">🎯 Objetivo del Algoritmo</h3>
              <p className="text-gray-700 text-sm">
                Determinar si es <strong>seguro</strong> asignar recursos a un proceso en un momento dado. 
                Un estado es seguro si existe al menos una secuencia de ejecución que permite a todos los 
                procesos completar su trabajo sin entrar en deadlock.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Conceptos Fundamentales</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">✅ Estado Seguro</h4>
                <p className="text-sm text-gray-700">
                  Existe al menos una secuencia de procesos que permite completar todos sin deadlock. 
                  El sistema puede satisfacer todas las necesidades máximas de los procesos.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-900 mb-2">❌ Estado Inseguro</h4>
                <p className="text-sm text-gray-700">
                  No hay garantía de evitar deadlock. Puede llevar a un estado donde ningún proceso 
                  puede continuar por falta de recursos.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Estructuras de Datos</h3>
            <p className="text-gray-700 leading-relaxed">
              El algoritmo mantiene cuatro estructuras principales para <strong>n</strong> procesos y <strong>m</strong> tipos de recursos:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 my-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900">Available (Disponible)</h4>
                  <p className="text-sm text-gray-700">
                    Vector de tamaño <code className="bg-gray-200 px-1 rounded">m</code>. Indica cuántas instancias 
                    de cada tipo de recurso están disponibles actualmente.
                  </p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    Available[j] = k → hay k instancias del recurso j disponibles
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900">Max (Máximo)</h4>
                  <p className="text-sm text-gray-700">
                    Matriz <code className="bg-gray-200 px-1 rounded">n × m</code>. Define la demanda máxima de 
                    cada proceso. Número máximo de instancias que cada proceso puede solicitar.
                  </p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    Max[i][j] = k → proceso i puede solicitar máximo k instancias del recurso j
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-orange-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900">Allocation (Asignación)</h4>
                  <p className="text-sm text-gray-700">
                    Matriz <code className="bg-gray-200 px-1 rounded">n × m</code>. Define cuántas instancias de 
                    cada recurso están actualmente asignadas a cada proceso.
                  </p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    Allocation[i][j] = k → proceso i tiene asignadas k instancias del recurso j
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-900">Need (Necesidad)</h4>
                  <p className="text-sm text-gray-700">
                    Matriz <code className="bg-gray-200 px-1 rounded">n × m</code>. Indica cuántos recursos 
                    adicionales puede necesitar cada proceso. Se calcula como: <strong>Need = Max - Allocation</strong>
                  </p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    Need[i][j] = Max[i][j] - Allocation[i][j]
                  </code>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Algoritmo de Seguridad</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Para determinar si un estado es seguro, el algoritmo sigue estos pasos:
            </p>

            <div className="bg-blue-900/10 border border-blue-300 rounded-lg p-4 space-y-2">
              <div className="flex gap-2">
                <span className="font-bold text-blue-900">1.</span>
                <p className="text-sm text-gray-700">
                  Inicializar <code className="bg-blue-100 px-1 rounded">Work = Available</code> y 
                  <code className="bg-blue-100 px-1 rounded ml-1">Finish[i] = false</code> para todos los procesos.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-900">2.</span>
                <p className="text-sm text-gray-700">
                  Buscar un proceso <code className="bg-blue-100 px-1 rounded">i</code> tal que:
                  <br/>
                  • <code className="bg-blue-100 px-1 rounded">Finish[i] = false</code>
                  <br/>
                  • <code className="bg-blue-100 px-1 rounded">Need[i] ≤ Work</code> (puede completarse con recursos disponibles)
                </p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-900">3.</span>
                <p className="text-sm text-gray-700">
                  Si se encuentra tal proceso:
                  <br/>
                  • <code className="bg-blue-100 px-1 rounded">Work = Work + Allocation[i]</code> (libera recursos)
                  <br/>
                  • <code className="bg-blue-100 px-1 rounded">Finish[i] = true</code>
                  <br/>
                  • Volver al paso 2
                </p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-900">4.</span>
                <p className="text-sm text-gray-700">
                  Si <code className="bg-blue-100 px-1 rounded">Finish[i] = true</code> para todos, el estado es <strong className="text-green-600">SEGURO</strong>.
                  <br/>
                  Si no, el estado es <strong className="text-red-600">INSEGURO</strong>.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-900 mb-1">Decisión de Asignación</h4>
                  <p className="text-sm text-gray-700">
                    Cuando un proceso solicita recursos, el sistema simula la asignación y ejecuta el algoritmo 
                    de seguridad. Solo si el nuevo estado es seguro, se concede la solicitud. De lo contrario, 
                    el proceso debe esperar hasta que sea seguro asignar los recursos.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Ventajas y Limitaciones</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">✅ Ventajas</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Previene deadlock de forma proactiva</li>
                  <li>Garantiza que el sistema nunca entre en estado inseguro</li>
                  <li>Permite utilización eficiente de recursos</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-2">⚠️ Limitaciones</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Requiere conocer de antemano las necesidades máximas</li>
                  <li>El número de procesos debe ser fijo</li>
                  <li>Puede ser conservador y rechazar solicitudes seguras</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Demostración Interactiva */}
        <AlgoritmoBanquero />
      </div>
    </div>
  );
}