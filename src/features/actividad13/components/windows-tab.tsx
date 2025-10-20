import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Script {
  id: number;
  title: string;
  description: string;
  code: string;
  usage: string;
}

const windowsScripts: Script[] = [
  {
    id: 1,
    title: 'Respaldo Automático de Archivos',
    description: 'Script para copiar archivos de una carpeta a otra ubicación de respaldo con marca de tiempo.',
    code: `@echo off
REM Respaldo automático con fecha
set "source=C:\\Documentos"
set "backup=D:\\Respaldos"
set fecha=%date:~-4,4%%date:~-10,2%%date:~-7,2%

xcopy "%source%" "%backup%\\Backup_%fecha%\\" /E /I /Y
echo Respaldo completado en %backup%\\Backup_%fecha%
pause`,
    usage: 'Ejecutar como administrador. Modificar rutas de origen y destino según necesidades.'
  },
  {
    id: 2,
    title: 'Limpieza de Archivos Temporales',
    description: 'Elimina archivos temporales del sistema para liberar espacio en disco.',
    code: `@echo off
echo Limpiando archivos temporales...

REM Limpiar carpeta Temp del usuario
del /q /f /s %TEMP%\\* 2>nul
for /d %%p in (%TEMP%\\*) do rmdir "%%p" /s /q 2>nul

REM Limpiar carpeta Temp de Windows
del /q /f /s C:\\Windows\\Temp\\* 2>nul
for /d %%p in (C:\\Windows\\Temp\\*) do rmdir "%%p" /s /q 2>nul

echo Limpieza completada.
pause`,
    usage: 'Ejecutar con permisos de administrador para acceder a todas las carpetas temporales.'
  },
  {
    id: 3,
    title: 'Información del Sistema',
    description: 'Recopila información detallada del sistema y la guarda en un archivo de texto.',
    code: `@echo off
set "output=C:\\info_sistema.txt"

echo ========== INFORMACION DEL SISTEMA ========== > "%output%"
echo. >> "%output%"

echo Fecha y Hora: %date% %time% >> "%output%"
echo. >> "%output%"

systeminfo >> "%output%"

echo. >> "%output%"
echo ========== DISCOS ========== >> "%output%"
wmic logicaldisk get caption,description,freespace,size >> "%output%"

echo Información guardada en %output%
pause`,
    usage: 'Generar un reporte completo del sistema para documentación o diagnóstico.'
  },
  {
    id: 4,
    title: 'Gestión de Servicios Windows',
    description: 'Permite iniciar, detener o reiniciar servicios de Windows de manera automatizada.',
    code: `@echo off
REM Configurar el nombre del servicio
set "servicio=Spooler"

echo Seleccione una opcion:
echo 1. Iniciar servicio
echo 2. Detener servicio
echo 3. Reiniciar servicio
echo 4. Ver estado

set /p opcion="Ingrese opcion (1-4): "

if "%opcion%"=="1" net start "%servicio%"
if "%opcion%"=="2" net stop "%servicio%"
if "%opcion%"=="3" (
    net stop "%servicio%"
    timeout /t 2 /nobreak
    net start "%servicio%"
)
if "%opcion%"=="4" sc query "%servicio%"

pause`,
    usage: 'Modificar la variable "servicio" con el nombre del servicio deseado. Requiere privilegios de administrador.'
  },
  {
    id: 5,
    title: 'Creación Masiva de Carpetas',
    description: 'Crea múltiples carpetas organizadas por fecha o proyecto automáticamente.',
    code: `@echo off
set "ruta_base=C:\\Proyectos"
set fecha=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%

REM Crear estructura de carpetas
mkdir "%ruta_base%\\Proyecto_%fecha%\\Documentos"
mkdir "%ruta_base%\\Proyecto_%fecha%\\Codigo"
mkdir "%ruta_base%\\Proyecto_%fecha%\\Recursos"
mkdir "%ruta_base%\\Proyecto_%fecha%\\Pruebas"

echo Estructura de carpetas creada en:
echo %ruta_base%\\Proyecto_%fecha%
pause`,
    usage: 'Ideal para iniciar proyectos nuevos con una estructura predefinida.'
  },
  {
    id: 6,
    title: 'Verificación de Conectividad de Red',
    description: 'Comprueba la conectividad a múltiples hosts y registra los resultados.',
    code: `@echo off
set "log=C:\\conectividad.log"

echo ========== TEST DE CONECTIVIDAD ========== > "%log%"
echo Fecha: %date% %time% >> "%log%"
echo. >> "%log%"

echo Probando Google...
ping -n 4 8.8.8.8 >> "%log%"

echo Probando DNS...
ping -n 4 www.google.com >> "%log%"

echo Probando gateway local...
for /f "tokens=3" %%a in ('route print ^| findstr "0.0.0.0"') do (
    ping -n 4 %%a >> "%log%"
)

echo Resultados guardados en %log%
pause`,
    usage: 'Útil para diagnosticar problemas de red y documentar el estado de conectividad.'
  },
  {
    id: 7,
    title: 'Instalador Silencioso de Programas',
    description: 'Automatiza la instalación de múltiples programas sin intervención del usuario.',
    code: `@echo off
echo Iniciando instalaciones automatizadas...

REM Instalar Chrome
start /wait chrome_installer.exe /silent /install

REM Instalar Adobe Reader
start /wait AcroRdrDC.exe /sAll /msi EULA_ACCEPT=YES

REM Instalar 7-Zip
start /wait 7z-x64.msi /quiet /qn

echo Instalaciones completadas.
pause`,
    usage: 'Colocar los instaladores en la misma carpeta del script. Requiere permisos de administrador.'
  },
  {
    id: 8,
    title: 'Apagado Programado del Sistema',
    description: 'Programa el apagado del sistema después de un tiempo específico o cancelación.',
    code: `@echo off
echo Seleccione una opcion:
echo 1. Apagar en 30 minutos
echo 2. Apagar en 1 hora
echo 3. Apagar en 2 horas
echo 4. Cancelar apagado programado

set /p opcion="Ingrese opcion (1-4): "

if "%opcion%"=="1" shutdown /s /t 1800
if "%opcion%"=="2" shutdown /s /t 3600
if "%opcion%"=="3" shutdown /s /t 7200
if "%opcion%"=="4" shutdown /a

echo Comando ejecutado.
pause`,
    usage: 'Útil para programar apagados automáticos después de descargas o procesos largos.'
  },
  {
    id: 9,
    title: 'Gestión de Usuarios Locales',
    description: 'Crear, eliminar o modificar usuarios locales del sistema de manera automatizada.',
    code: `@echo off
echo === GESTION DE USUARIOS ===
echo.
echo 1. Crear nuevo usuario
echo 2. Eliminar usuario
echo 3. Cambiar contraseña
echo 4. Listar usuarios

set /p opcion="Seleccione opcion: "

if "%opcion%"=="1" (
    set /p usuario="Nombre de usuario: "
    set /p pass="Contraseña: "
    net user %usuario% %pass% /add
)

if "%opcion%"=="2" (
    set /p usuario="Usuario a eliminar: "
    net user %usuario% /delete
)

if "%opcion%"=="3" (
    set /p usuario="Usuario: "
    set /p pass="Nueva contraseña: "
    net user %usuario% %pass%
)

if "%opcion%"=="4" net user

pause`,
    usage: 'Requiere ejecutar como administrador. Útil para gestión rápida de cuentas locales.'
  },
  {
    id: 10,
    title: 'Monitoreo de Espacio en Disco',
    description: 'Verifica el espacio disponible en discos y alerta si está por debajo de un umbral.',
    code: `@echo off
set "umbral=10"
set "log=C:\\espacio_disco.log"

echo ========== MONITOREO DE DISCO ========== > "%log%"
echo Fecha: %date% %time% >> "%log%"
echo. >> "%log%"

for /f "tokens=1,2,3" %%a in ('wmic logicaldisk get caption^,freespace^,size ^| findstr /r "^[A-Z]"') do (
    set /a libre=%%b/1073741824
    set /a total=%%c/1073741824
    set /a porcentaje=100*%%b/%%c
    
    echo Disco %%a: !libre! GB libres de !total! GB ^(!porcentaje!%%^) >> "%log%"
    
    if !porcentaje! LSS %umbral% (
        echo ALERTA: Disco %%a tiene menos del %umbral%%% libre >> "%log%"
    )
)

type "%log%"
pause`,
    usage: 'Programar con el Programador de tareas para monitoreo automático del espacio en disco.'
  }
];

export default function WindowsTab() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {windowsScripts.map((script) => (
        <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Accordion Header */}
          <button
            onClick={() => toggleAccordion(script.id)}
            type="button"
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center size-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                {script.id}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{script.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{script.description}</p>
              </div>
            </div>
            <ChevronDown
              className={`size-5 text-blue-600 transition-transform flex-shrink-0 ml-4 ${
                openAccordion === script.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Accordion Content */}
          {openAccordion === script.id && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="space-y-4">
                {/* Código */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">{'</>'}</span>
                    Código del Script
                  </h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{script.code}</code>
                  </pre>
                </div>

                {/* Uso */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-semibold text-blue-900 mb-2">📝 Instrucciones de Uso</h4>
                  <p className="text-sm text-gray-700">{script.usage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
