import { FileCode, BookOpen, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import WindowsTab from './components/windows-tab';
import LinuxTab from './components/linux-tab';

export default function Actividad13() {
  const [activeScriptsTab, setActiveScriptsTab] = useState<'windows' | 'linux'>('windows');
  const [activeVideosTab, setActiveVideosTab] = useState<'windows' | 'linux'>('windows');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FileCode className="size-6" />
            </div>
            <h1 className="text-4xl font-bold text-white">Scripts en Sistemas Operativos</h1>
          </div>
          <p className="text-gray-400 text-sm">Automatización de tareas en Windows y Linux mediante scripts</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Sección 1: Explicación */}
        <div className="bg-white text-gray-900 rounded-lg p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="size-6 text-blue-600" />
            <h2 className="text-2xl font-bold">¿Qué son los Scripts en Sistemas Operativos?</h2>
          </div>
          
          <div className="prose prose-gray max-w-none space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Los <strong className="text-blue-600">scripts</strong> son archivos que contienen una serie de comandos que se ejecutan 
              de manera secuencial para automatizar tareas en el sistema operativo. Son herramientas fundamentales para administradores 
              de sistemas y usuarios avanzados que buscan optimizar y simplificar procesos repetitivos.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <h3 className="font-bold text-blue-900 mb-2">🎯 Propósito de los Scripts</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                <li>Automatizar tareas repetitivas y reducir el trabajo manual</li>
                <li>Ejecutar múltiples comandos con un solo archivo</li>
                <li>Programar tareas para que se ejecuten en momentos específicos</li>
                <li>Administrar sistemas de manera eficiente y consistente</li>
                <li>Realizar operaciones por lotes (batch operations)</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Windows Scripts */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-600 text-white rounded-lg p-2">
                    <FileCode className="size-5" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">Scripts en Windows</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">Batch Scripts (.bat, .cmd)</h4>
                    <p>Scripts tradicionales de Windows que ejecutan comandos del símbolo del sistema (CMD).</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">PowerShell Scripts (.ps1)</h4>
                    <p>Scripts más modernos y potentes con acceso completo al .NET Framework y cmdlets especializados.</p>
                  </div>

                  <div className="bg-white rounded p-3 mt-4">
                    <p className="font-semibold text-blue-900 mb-2">¿Qué se puede hacer?</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Gestión de archivos y directorios</li>
                      <li>Configuración del sistema y registro</li>
                      <li>Administración de usuarios y permisos</li>
                      <li>Automatización de instalaciones</li>
                      <li>Tareas de mantenimiento y limpieza</li>
                      <li>Respaldo y sincronización de datos</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Linux Scripts */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-600 text-white rounded-lg p-2">
                    <FileCode className="size-5" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900">Scripts en Linux</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-bold text-green-800 mb-1">Shell Scripts (.sh)</h4>
                    <p>Scripts que utilizan shells como Bash, Zsh, o Fish para automatizar tareas del sistema.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-green-800 mb-1">Python/Perl Scripts</h4>
                    <p>Scripts más avanzados usando lenguajes de programación completos para tareas complejas.</p>
                  </div>

                  <div className="bg-white rounded p-3 mt-4">
                    <p className="font-semibold text-green-900 mb-2">¿Qué se puede hacer?</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Administración de paquetes y servicios</li>
                      <li>Configuración de red y firewall</li>
                      <li>Automatización de despliegues</li>
                      <li>Monitoreo del sistema y logs</li>
                      <li>Gestión de usuarios y grupos</li>
                      <li>Tareas programadas con cron</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
              <h4 className="font-bold text-yellow-900 mb-2">💡 Ventajas de usar Scripts</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Eficiencia:</strong> Ahorro de tiempo en tareas repetitivas</li>
                  <li><strong>Consistencia:</strong> Las tareas se ejecutan de la misma manera cada vez</li>
                  <li><strong>Documentación:</strong> El script sirve como registro de los pasos realizados</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Escalabilidad:</strong> Fácil aplicar cambios a múltiples sistemas</li>
                  <li><strong>Reducción de errores:</strong> Menos intervención manual</li>
                  <li><strong>Programación:</strong> Ejecución automática en horarios específicos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2: Scripts (Acordeones con Tabs) */}
        <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileCode className="size-6" />
              Scripts
            </h2>
          </div>

          {/* Tabs para Scripts */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveScriptsTab('windows')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors cursor-pointer ${
                activeScriptsTab === 'windows'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              type="button"
            >
              Windows
            </button>
            <button
              onClick={() => setActiveScriptsTab('linux')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors cursor-pointer ${
                activeScriptsTab === 'linux'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              type="button"
            >
              Linux
            </button>
          </div>

          {/* Contenido de los tabs */}
          <div className="p-6">
            {activeScriptsTab === 'windows' ? <WindowsTab /> : <LinuxTab />}
          </div>
        </div>

        {/* Sección 3: Videos demostrativos (Tabs) */}
        <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <PlayCircle className="size-6" />
              Videos del funcionamiento de Scripts
            </h2>
          </div>

          {/* Tabs para Videos */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveVideosTab('windows')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors cursor-pointer ${
                activeVideosTab === 'windows'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              type="button"
            >
              Windows
            </button>
            <button
              onClick={() => setActiveVideosTab('linux')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors cursor-pointer ${
                activeVideosTab === 'linux'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              type="button"
            >
              Linux
            </button>
          </div>

          {/* Contenido de videos */}
          <div className="p-8">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <PlayCircle className="size-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">
                  Video demostrativo de los scripts en {activeVideosTab === 'windows' ? 'Windows' : 'Linux'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Próximamente disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}