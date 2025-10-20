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
  // Scripts .BAT (Batch)
  {
    id: 1,
    title: 'Respaldo Automático de Archivos (.bat)',
    description: 'Script Batch para copiar archivos de una carpeta a otra ubicación de respaldo con marca de tiempo.',
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
    title: 'Limpieza de Archivos Temporales (.bat)',
    description: 'Script Batch que elimina archivos temporales del sistema para liberar espacio en disco.',
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
    title: 'Información del Sistema (.bat)',
    description: 'Script Batch que recopila información detallada del sistema y la guarda en un archivo de texto.',
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
    title: 'Verificación de Conectividad de Red (.bat)',
    description: 'Script Batch que comprueba la conectividad a múltiples hosts y registra los resultados.',
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

  // Scripts .CMD
  {
  id: 5,
  title: 'Listado de Programas Instalados (.cmd)',
  description: 'Genera un listado de programas instalados y lo exporta a un archivo de texto para auditoría documental.',
  code: `@echo off
REM Exportar lista de programas instalados (WMIC)
set "output=C:\\installed_programs_%date:~-4,4%-%date:~-10,2%-%date:~-7,2%.txt"

echo Generando listado de programas instalados...
echo Fecha: %date% %time% > "%output%"

REM Intentar obtener listado con WMIC (puede tardar)
wmic product get name,version >> "%output%" 2>nul

REM Alternativa: listar desinstaladores del registro (más completo)
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" /s /v DisplayName >> "%output%" 2>nul
reg query "HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall" /s /v DisplayName >> "%output%" 2>nul

echo Listado guardado en %output%
pause`,
  usage: 'Ejecutar como administrador para permitir acceso al registro y a WMIC. El archivo generado se guarda en C:\\ con fecha.'
  },
  {
    id: 6,
    title: 'Creación Masiva de Carpetas (.cmd)',
    description: 'Script CMD que crea múltiples carpetas organizadas por fecha o proyecto automáticamente.',
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
    id: 7,
    title: 'Gestión de Usuarios Locales (.cmd)',
    description: 'Script CMD para crear, eliminar o modificar usuarios locales del sistema de manera automatizada.',
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
    id: 8,
    title: 'Apagado Programado del Sistema (.cmd)',
    description: 'Script CMD que programa el apagado del sistema después de un tiempo específico o cancelación.',
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

  // Scripts PowerShell (.ps1)
  {
    id: 9,
    title: 'Monitoreo de Espacio en Disco (.ps1)',
    description: 'Script PowerShell que verifica el espacio disponible en discos y alerta si está por debajo de un umbral.',
    code: `# Script de monitoreo de espacio en disco
$umbral = 20
$logPath = "C:\\espacio_disco.log"

"========== MONITOREO DE DISCO ==========" | Out-File -FilePath $logPath
"Fecha: $(Get-Date)" | Out-File -FilePath $logPath -Append
"" | Out-File -FilePath $logPath -Append

$discos = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -gt 0 }

foreach ($disco in $discos) {
    $porcentajeLibre = [math]::Round(($disco.Free / ($disco.Used + $disco.Free)) * 100, 2)
    $mensaje = "Disco $($disco.Name): $([math]::Round($disco.Free/1GB, 2)) GB libres ($porcentajeLibre% libre)"
    
    $mensaje | Out-File -FilePath $logPath -Append
    
    if ($porcentajeLibre -lt $umbral) {
        "ALERTA: Disco $($disco.Name) tiene menos del $umbral% libre!" | Out-File -FilePath $logPath -Append
    }
}

Get-Content $logPath
Write-Host "Reporte guardado en: $logPath"`,
    usage: 'Ejecutar con permisos de administrador. Puede programarse con el Programador de tareas.'
  },
  {
    id: 10,
    title: 'Instalador Silencioso de Programas (.ps1)',
    description: 'Script PowerShell que automatiza la instalación de múltiples programas sin intervención del usuario.',
    code: `# Instalación automatizada de software
Write-Host "Iniciando instalaciones automatizadas..." -ForegroundColor Green

# Lista de instaladores (ruta completa)
$instaladores = @(
    @{Nombre="Google Chrome"; Ruta=".\\chrome_installer.exe"; Args="/silent /install"},
    @{Nombre="Adobe Reader"; Ruta=".\\AcroRdrDC.exe"; Args="/sAll /msi EULA_ACCEPT=YES"},
    @{Nombre="7-Zip"; Ruta=".\\7z-x64.msi"; Args="/quiet /qn"}
)

foreach ($app in $instaladores) {
    Write-Host "Instalando $($app.Nombre)..." -ForegroundColor Yellow
    
    if (Test-Path $app.Ruta) {
        Start-Process -FilePath $app.Ruta -ArgumentList $app.Args -Wait
        Write-Host "$($app.Nombre) instalado correctamente." -ForegroundColor Green
    } else {
        Write-Host "Error: No se encontró $($app.Ruta)" -ForegroundColor Red
    }
}

Write-Host "Instalaciones completadas." -ForegroundColor Green`,
    usage: 'Colocar los instaladores en la misma carpeta del script. Ejecutar como administrador.'
  },
  {
    id: 11,
    title: 'Análisis de Logs del Sistema (.ps1)',
    description: 'Script PowerShell que analiza eventos del sistema y genera reportes de errores y advertencias.',
    code: `# Análisis de logs del sistema Windows
$reporte = "C:\\analisis_logs_$(Get-Date -Format 'yyyyMMdd').txt"

"========== ANÁLISIS DE EVENTOS DEL SISTEMA ==========" | Out-File -FilePath $reporte
"Fecha: $(Get-Date)" | Out-File -FilePath $reporte -Append
"" | Out-File -FilePath $reporte -Append

# Errores recientes del sistema
"=== ERRORES DEL SISTEMA (últimas 24h) ===" | Out-File -FilePath $reporte -Append
$errores = Get-EventLog -LogName System -EntryType Error -After (Get-Date).AddDays(-1) | 
    Select-Object -First 20 TimeGenerated, Source, Message
$errores | Format-Table -AutoSize | Out-File -FilePath $reporte -Append -Width 200

# Advertencias de aplicaciones
"=== ADVERTENCIAS DE APLICACIONES ===" | Out-File -FilePath $reporte -Append
$advertencias = Get-EventLog -LogName Application -EntryType Warning -After (Get-Date).AddDays(-1) | 
    Select-Object -First 20 TimeGenerated, Source, Message
$advertencias | Format-Table -AutoSize | Out-File -FilePath $reporte -Append -Width 200

Write-Host "Reporte generado: $reporte" -ForegroundColor Green
notepad $reporte`,
    usage: 'Ejecutar con permisos de administrador para acceder a todos los logs del sistema.'
  },
  {
    id: 12,
    title: 'Respaldo con Compresión (.ps1)',
    description: 'Script PowerShell que crea respaldos comprimidos de directorios con marca de tiempo.',
    code: `# Respaldo automatizado con compresión
$origen = "C:\\Documentos"
$destino = "D:\\Respaldos"
$fecha = Get-Date -Format "yyyyMMdd_HHmmss"
$archivoZip = "$destino\\Backup_$fecha.zip"

# Crear directorio de destino si no existe
if (!(Test-Path $destino)) {
    New-Item -ItemType Directory -Path $destino | Out-Null
}

Write-Host "Iniciando respaldo de $origen..." -ForegroundColor Yellow

try {
    # Crear archivo comprimido
    Compress-Archive -Path $origen -DestinationPath $archivoZip -CompressionLevel Optimal
    
    $tamaño = (Get-Item $archivoZip).Length / 1MB
    Write-Host "Respaldo completado exitosamente!" -ForegroundColor Green
    Write-Host "Archivo: $archivoZip" -ForegroundColor Cyan
    Write-Host "Tamaño: $([math]::Round($tamaño, 2)) MB" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error al crear el respaldo: $_" -ForegroundColor Red
}`,
    usage: 'Modificar rutas de origen y destino. Puede programarse con el Programador de tareas.'
  }
];

export default function WindowsTab() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {/* Sección: Scripts Batch (.bat) */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded"></div>
          <h3 className="text-xl font-bold text-blue-700 px-4 py-2 bg-blue-50 rounded-lg border-2 border-blue-300">
            Scripts Batch (.bat)
          </h3>
          <div className="h-1 flex-1 bg-gradient-to-l from-blue-500 to-blue-300 rounded"></div>
        </div>
        
        {windowsScripts.slice(0, 4).map((script) => (
          <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden mb-3">
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

      {/* Sección: Scripts CMD (.cmd) */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500 to-indigo-300 rounded"></div>
          <h3 className="text-xl font-bold text-indigo-700 px-4 py-2 bg-indigo-50 rounded-lg border-2 border-indigo-300">
            Scripts CMD (.cmd)
          </h3>
          <div className="h-1 flex-1 bg-gradient-to-l from-indigo-500 to-indigo-300 rounded"></div>
        </div>
        
        {windowsScripts.slice(4, 8).map((script) => (
          <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(script.id)}
              type="button"
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-colors flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center size-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                  {script.id}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{script.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`size-5 text-indigo-600 transition-transform flex-shrink-0 ml-4 ${
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
                      <span className="text-indigo-600">{'</>'}</span>
                      Código del Script
                    </h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{script.code}</code>
                    </pre>
                  </div>

                  {/* Uso */}
                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                    <h4 className="font-semibold text-indigo-900 mb-2">📝 Instrucciones de Uso</h4>
                    <p className="text-sm text-gray-700">{script.usage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sección: Scripts PowerShell (.ps1) */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded"></div>
          <h3 className="text-xl font-bold text-purple-700 px-4 py-2 bg-purple-50 rounded-lg border-2 border-purple-300">
            Scripts PowerShell (.ps1)
          </h3>
          <div className="h-1 flex-1 bg-gradient-to-l from-purple-500 to-purple-300 rounded"></div>
        </div>
        
        {windowsScripts.slice(8, 12).map((script) => (
          <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(script.id)}
              type="button"
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-colors flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center size-8 rounded-full bg-purple-600 text-white font-bold text-sm">
                  {script.id}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{script.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`size-5 text-purple-600 transition-transform flex-shrink-0 ml-4 ${
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
                      <span className="text-purple-600">{'</>'}</span>
                      Código del Script
                    </h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{script.code}</code>
                    </pre>
                  </div>

                  {/* Uso */}
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <h4 className="font-semibold text-purple-900 mb-2">📝 Instrucciones de Uso</h4>
                    <p className="text-sm text-gray-700">{script.usage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
