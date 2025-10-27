# AsistenteGuay.ps1
# Autor: ChatGPT & Joan Jhy
# Proposito: Crear un asistente grafico post-instalacion para Windows 11

Add-Type -AssemblyName PresentationFramework

function Show-Message($title, $message, $icon="Information") {
    [System.Windows.MessageBox]::Show($message, $title, [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::$icon) | Out-Null
}

Clear-Host
$Host.UI.RawUI.WindowTitle = "[*] Asistente Guay para Windows 11"

Show-Message "Bienvenido" "Preparate para tunear tu sistema operativo!"

$opciones = @(
    "[1] Cambiar al tema oscuro",
    "[2] Cambiar fondo de pantalla (Resplandor)",
    "[3] Configurar Explorador de archivos",
    "[4] Instalar Windows Terminal y PowerShell 7",
    "[5] Instalar Scoop y herramientas",
    "[6] Configurar PowerShell",
    "[7] Crear carpeta ZonaGuayPS",
    "[8] Mostrar informacion del sistema",
    "[X] Salir del asistente"
)

do {
    $seleccion = $opciones | Out-GridView -Title "Selecciona una accion" -OutputMode Single

    switch ($seleccion) {
        "[1] Cambiar al tema oscuro" {
            Write-Host "[*] Activando modo oscuro..." -ForegroundColor Cyan
            New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name "AppsUseLightTheme" -Value 0 -PropertyType DWord -Force | Out-Null
            New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name "SystemUsesLightTheme" -Value 0 -PropertyType DWord -Force | Out-Null
            Show-Message "Modo Oscuro" "El modo oscuro esta activo."
        }

        "[2] Cambiar fondo de pantalla (Resplandor)" {
            $fondo = "C:\Windows\Web\Wallpaper\ThemeA\img20.jpg"
            Show-Message "Fondo de pantalla" "Estableciendo fondo Resplandor..."
            try {
                $code = @"
using System.Runtime.InteropServices;
public class Wallpaper {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@
                Add-Type $code
                [Wallpaper]::SystemParametersInfo(20, 0, $fondo, 3) | Out-Null
                Show-Message "Fondo cambiado" "Fondo de pantalla Resplandor establecido con exito."
            } catch {
                Show-Message "Error" "No se pudo cambiar el fondo: $_" "Error"
            }
        }

        "[3] Configurar Explorador de archivos" {
            Write-Host "[*] Configurando Explorador de archivos..." -ForegroundColor Cyan
            
            # Mostrar extensiones de archivo (0 = mostrar, 1 = ocultar)
            Write-Host "[*] Mostrando extensiones de archivo..." -ForegroundColor Cyan
            New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "HideFileExt" -Value 0 -PropertyType DWord -Force | Out-Null
            
            # Mostrar archivos ocultos (1 = mostrar, 2 = no mostrar)
            Write-Host "[*] Mostrando archivos ocultos..." -ForegroundColor Cyan
            New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "Hidden" -Value 1 -PropertyType DWord -Force | Out-Null
            
            # Establecer inicio del Explorador en "Este equipo" (1 = Este equipo, 2 = Acceso rapido)
            Write-Host "[*] Configurando inicio en Este equipo..." -ForegroundColor Cyan
            New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "LaunchTo" -Value 1 -PropertyType DWord -Force | Out-Null
            
            # Reiniciar el explorador de archivos para aplicar cambios
            Write-Host "[*] Reiniciando Explorador de Windows..." -ForegroundColor Cyan
            Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Start-Process explorer
            
            Show-Message "Explorador configurado" "Se configuraron las siguientes opciones:`n- Extensiones visibles`n- Archivos ocultos visibles`n- Inicio en Este equipo`n`nEl Explorador de archivos se ha reiniciado."
        }

        "[5] Instalar Scoop y herramientas" {
            Show-Message "Instalacion de Scoop" "Instalando Scoop y herramientas..."
            Write-Host "[*] Instalando Scoop..." -ForegroundColor Cyan
            
            # Verificar si Scoop ya esta instalado
            if (Get-Command scoop -ErrorAction SilentlyContinue) {
                Write-Host "[+] Scoop ya esta instalado" -ForegroundColor Yellow
            } else {
                try {
                    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
                    Write-Host "[+] Scoop instalado correctamente" -ForegroundColor Green
                } catch {
                    Write-Host "[-] Error instalando Scoop: $_" -ForegroundColor Red
                    Show-Message "Error" "No se pudo instalar Scoop. Verifica tu conexion a internet." "Error"
                    return
                }
            }
            
            Start-Sleep -Seconds 2
            
            # Instalar Git
            Write-Host "[*] Verificando Git..." -ForegroundColor Cyan
            if (scoop list git -ErrorAction SilentlyContinue) {
                Write-Host "[+] Git ya esta instalado" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando Git..." -ForegroundColor Cyan
                scoop install git
            }
            
            # Agregar buckets
            Write-Host "[*] Agregando buckets..." -ForegroundColor Cyan
            if (-not (scoop bucket list | Select-String "extras")) {
                scoop bucket add extras
            } else {
                Write-Host "[+] Bucket extras ya agregado" -ForegroundColor Yellow
            }
            
            if (-not (scoop bucket list | Select-String "nerd-fonts")) {
                scoop bucket add nerd-fonts
            } else {
                Write-Host "[+] Bucket nerd-fonts ya agregado" -ForegroundColor Yellow
            }
            
            # Instalar Oh-My-Posh
            Write-Host "[*] Verificando Oh-My-Posh..." -ForegroundColor Cyan
            if (scoop list oh-my-posh -ErrorAction SilentlyContinue) {
                Write-Host "[+] Oh-My-Posh ya esta instalado" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando Oh-My-Posh..." -ForegroundColor Cyan
                scoop install oh-my-posh
            }
            
            # Instalar Hack Nerd Font
            Write-Host "[*] Verificando Hack Nerd Font..." -ForegroundColor Cyan
            if (scoop list Hack-NF -ErrorAction SilentlyContinue) {
                Write-Host "[+] Hack Nerd Font ya esta instalado" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando Hack Nerd Font..." -ForegroundColor Cyan
                scoop install Hack-NF
            }
            
            # Instalar fastfetch
            Write-Host "[*] Verificando fastfetch..." -ForegroundColor Cyan
            if (scoop list fastfetch -ErrorAction SilentlyContinue) {
                Write-Host "[+] fastfetch ya esta instalado" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando fastfetch..." -ForegroundColor Cyan
                scoop install fastfetch
            }
            
            # Instalar modulos de PowerShell
            Write-Host "[*] Verificando modulos de PowerShell..." -ForegroundColor Cyan
            
            if (Get-Module -ListAvailable -Name PSReadLine) {
                Write-Host "[+] PSReadLine ya esta instalado" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando PSReadLine..." -ForegroundColor Cyan
                Install-Module -Name PSReadLine -Scope CurrentUser -Force -SkipPublisherCheck
            }
            
            if (Get-Module -ListAvailable -Name Terminal-Icons) {
                Write-Host "[+] Terminal-Icons ya esta instalado" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando Terminal-Icons..." -ForegroundColor Cyan
                Install-Module -Name Terminal-Icons -Scope CurrentUser -Force -SkipPublisherCheck
            }
            
            Show-Message "Instalacion completa" "Todas las herramientas fueron verificadas/instaladas correctamente."
        }

        "[6] Configurar PowerShell" {
            Show-Message "Configuracion" "Configurando perfil de PowerShell..."
            Write-Host "[*] Configurando PowerShell..." -ForegroundColor Cyan
            
            # Solicitar tema de Oh-My-Posh al usuario
            Add-Type -AssemblyName Microsoft.VisualBasic
            $tema = [Microsoft.VisualBasic.Interaction]::InputBox(
                "Ingresa el nombre del tema de Oh-My-Posh que deseas usar (por ejemplo: montys, jandedobbeleer, dracula, etc.)`n`nSi dejas vacio, se usara 'montys' por defecto.",
                "Seleccionar Tema",
                "montys"
            )
            
            # Si el usuario no ingreso nada o cancelo, usar montys por defecto
            if ([string]::IsNullOrWhiteSpace($tema)) {
                $tema = "montys"
            }
            
            Write-Host "[*] Tema seleccionado: $tema" -ForegroundColor Cyan
            
            # Crear el archivo de perfil si no existe
            $profilePath = $PROFILE
            Write-Host "[*] Creando archivo de perfil en: $profilePath" -ForegroundColor Cyan
            New-Item -Path $profilePath -Type File -Force | Out-Null
            
            # Contenido del perfil
            $profileContent = @"
# Importar modulos
Import-Module -Name Terminal-Icons

# Inicializar Oh-My-Posh con el tema seleccionado
oh-my-posh init pwsh --config "`$env:POSH_THEMES_PATH/$tema.omp.json" | Invoke-Expression

# Configuracion de PSReadLine (compatible con todas las versiones)
`$psReadLineVersion = (Get-Module PSReadLine).Version
if (`$psReadLineVersion -ge [version]"2.1.0") {
    Set-PSReadLineOption -PredictionSource History
    Set-PSReadLineOption -PredictionViewStyle ListView
}
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineOption -BellStyle None

# Alias utiles
Set-Alias -Name vim -Value notepad
Set-Alias -Name ll -Value Get-ChildItem

Write-Host '[+] PowerShell cargado con estilo!' -ForegroundColor Cyan
"@
            
            # Crear directorio del perfil si no existe
            $profileDir = Split-Path -Parent $profilePath
            if (-not (Test-Path $profileDir)) {
                New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
            }
            
            # Guardar el perfil
            Set-Content -Path $profilePath -Value $profileContent -Force
            Write-Host "[+] Perfil de PowerShell creado/actualizado" -ForegroundColor Green
            
            # Configurar fuente Hack Nerd Font para Windows Terminal (si existe)
            $wtSettingsPath = "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"
            if (Test-Path $wtSettingsPath) {
                Write-Host "[*] Configurando fuente Hack Nerd Font en Windows Terminal..." -ForegroundColor Cyan
                try {
                    $wtSettings = Get-Content $wtSettingsPath -Raw | ConvertFrom-Json
                    
                    # Configurar la fuente predeterminada en defaults
                    if (-not $wtSettings.profiles.PSObject.Properties.Name.Contains("defaults")) {
                        $wtSettings.profiles | Add-Member -MemberType NoteProperty -Name "defaults" -Value @{} -Force
                    }
                    
                    # Establecer la fuente predeterminada para todos los perfiles
                    $wtSettings.profiles.defaults = @{
                        font = @{
                            face = "Hack Nerd Font"
                            size = 11
                        }
                    }
                    
                    # Tambien configurar cada perfil de PowerShell individualmente
                    foreach ($profile in $wtSettings.profiles.list) {
                        if ($profile.name -like "*PowerShell*" -or $profile.name -like "*pwsh*") {
                            if (-not $profile.PSObject.Properties.Name.Contains("font")) {
                                $profile | Add-Member -MemberType NoteProperty -Name "font" -Value @{} -Force
                            }
                            $profile.font = @{
                                face = "Hack Nerd Font"
                                size = 11
                            }
                            Write-Host "[+] Fuente configurada para: $($profile.name)" -ForegroundColor Green
                        }
                    }
                    
                    # Guardar configuracion
                    $wtSettings | ConvertTo-Json -Depth 100 | Set-Content $wtSettingsPath -Encoding UTF8 -Force
                    Write-Host "[+] Fuente Hack Nerd Font configurada en Windows Terminal" -ForegroundColor Green
                } catch {
                    Write-Host "[-] No se pudo configurar la fuente en Windows Terminal: $_" -ForegroundColor Yellow
                }
            } else {
                Write-Host "[!] Windows Terminal no encontrado. Instala Windows Terminal primero." -ForegroundColor Yellow
            }
            
            Show-Message "Configuracion completa" "PowerShell configurado con el tema '$tema'.`n`nFuente Hack Nerd Font configurada en Windows Terminal.`n`nReinicia la terminal para ver los cambios."
        }

        "[4] Instalar Windows Terminal y PowerShell 7" {
            Show-Message "Instalacion" "Instalando Windows Terminal y PowerShell 7..."
            
            # Verificar e instalar Windows Terminal
            Write-Host "[*] Verificando Windows Terminal..." -ForegroundColor Cyan
            $wtInstalled = Get-AppxPackage -Name Microsoft.WindowsTerminal -ErrorAction SilentlyContinue
            if ($wtInstalled) {
                Write-Host "[+] Windows Terminal ya esta instalado (Version: $($wtInstalled.Version))" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando Windows Terminal..." -ForegroundColor Cyan
                try {
                    Start-Process powershell -ArgumentList "winget install --id=Microsoft.WindowsTerminal -e -h --accept-package-agreements --accept-source-agreements" -Wait -NoNewWindow
                    Write-Host "[+] Windows Terminal instalado" -ForegroundColor Green
                } catch {
                    Write-Host "[-] Error instalando Windows Terminal: $_" -ForegroundColor Red
                }
            }
            
            # Verificar e instalar PowerShell 7
            Write-Host "[*] Verificando PowerShell 7..." -ForegroundColor Cyan
            $ps7Installed = Get-Command pwsh -ErrorAction SilentlyContinue
            if ($ps7Installed) {
                $ps7Version = & pwsh -NoProfile -Command '$PSVersionTable.PSVersion.ToString()'
                Write-Host "[+] PowerShell 7 ya esta instalado (Version: $ps7Version)" -ForegroundColor Yellow
            } else {
                Write-Host "[*] Instalando PowerShell 7..." -ForegroundColor Cyan
                try {
                    Start-Process powershell -ArgumentList "winget install --id=Microsoft.PowerShell -e -h --accept-package-agreements --accept-source-agreements" -Wait -NoNewWindow
                    Write-Host "[+] PowerShell 7 instalado" -ForegroundColor Green
                    # Actualizar la variable PATH para que pwsh este disponible
                    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
                } catch {
                    Write-Host "[-] Error instalando PowerShell 7: $_" -ForegroundColor Red
                }
            }
            
            # Configurar PowerShell 7 como shell predeterminado en Windows Terminal
            Write-Host "[*] Configurando PowerShell 7 como shell predeterminado..." -ForegroundColor Cyan
            $wtSettingsPath = "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"
            if (Test-Path $wtSettingsPath) {
                try {
                    $wtSettings = Get-Content $wtSettingsPath -Raw | ConvertFrom-Json
                    
                    # Buscar el GUID de PowerShell 7
                    $ps7Profile = $wtSettings.profiles.list | Where-Object { $_.name -like "*PowerShell*" -and $_.source -like "*PowerShell*" } | Select-Object -First 1
                    
                    if ($ps7Profile) {
                        # Establecer como perfil predeterminado
                        $wtSettings.defaultProfile = $ps7Profile.guid
                        
                        # Guardar configuracion
                        $wtSettings | ConvertTo-Json -Depth 100 | Set-Content $wtSettingsPath -Encoding UTF8 -Force
                        Write-Host "[+] PowerShell 7 configurado como shell predeterminado" -ForegroundColor Green
                    } else {
                        Write-Host "[!] No se encontro el perfil de PowerShell 7 en Windows Terminal" -ForegroundColor Yellow
                    }
                } catch {
                    Write-Host "[-] Error configurando shell predeterminado: $_" -ForegroundColor Red
                }
            }
            
            # Verificar si Scoop esta instalado antes de configurar modulos
            if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
                Write-Host "[!] Scoop no esta instalado. Se omitira la configuracion de Terminal-Icons y Oh-My-Posh." -ForegroundColor Yellow
                Write-Host "[!] Instala Scoop primero (opcion [5]) para configurar completamente PowerShell 7." -ForegroundColor Yellow
                Show-Message "Instalacion completa" "Windows Terminal y PowerShell 7 instalados.`n`nPowerShell 7 es ahora el shell predeterminado.`n`nNOTA: Instala Scoop (opcion [5]) y luego configura PowerShell (opcion [6]) para obtener Terminal-Icons y Oh-My-Posh."
                continue
            }
            
            # Crear perfil de PowerShell 7 con Terminal-Icons y Oh-My-Posh
            Write-Host "[*] Configurando perfil de PowerShell 7..." -ForegroundColor Cyan
            
            # Verificar e instalar módulos en PowerShell 7
            Write-Host "[*] Verificando modulos de PowerShell 7..." -ForegroundColor Cyan
            
            # Verificar si pwsh está disponible
            $pwshPath = (Get-Command pwsh -ErrorAction SilentlyContinue).Source
            if ($pwshPath) {
                # Instalar Terminal-Icons en PowerShell 7 si no está instalado
                Write-Host "[*] Verificando Terminal-Icons en PowerShell 7..." -ForegroundColor Cyan
                $checkTerminalIcons = & pwsh -NoProfile -Command "Get-Module -ListAvailable -Name Terminal-Icons"
                if (-not $checkTerminalIcons) {
                    Write-Host "[*] Instalando Terminal-Icons en PowerShell 7..." -ForegroundColor Cyan
                    & pwsh -NoProfile -Command "Install-Module -Name Terminal-Icons -Scope CurrentUser -Force -SkipPublisherCheck"
                    Write-Host "[+] Terminal-Icons instalado en PowerShell 7" -ForegroundColor Green
                } else {
                    Write-Host "[+] Terminal-Icons ya está instalado en PowerShell 7" -ForegroundColor Yellow
                }
                
                # Verificar PSReadLine en PowerShell 7
                Write-Host "[*] Verificando PSReadLine en PowerShell 7..." -ForegroundColor Cyan
                $checkPSReadLine = & pwsh -NoProfile -Command "Get-Module -ListAvailable -Name PSReadLine"
                if (-not $checkPSReadLine) {
                    Write-Host "[*] Instalando PSReadLine en PowerShell 7..." -ForegroundColor Cyan
                    & pwsh -NoProfile -Command "Install-Module -Name PSReadLine -Scope CurrentUser -Force -SkipPublisherCheck -AllowPrerelease"
                    Write-Host "[+] PSReadLine instalado en PowerShell 7" -ForegroundColor Green
                } else {
                    Write-Host "[+] PSReadLine ya está instalado en PowerShell 7" -ForegroundColor Yellow
                }
            } else {
                Write-Host "[!] PowerShell 7 (pwsh) no encontrado. Instala PowerShell 7 primero." -ForegroundColor Yellow
            }
            
            # Solicitar tema para PowerShell 7
            Add-Type -AssemblyName Microsoft.VisualBasic
            $tema = [Microsoft.VisualBasic.Interaction]::InputBox(
                "Ingresa el nombre del tema de Oh-My-Posh para PowerShell 7 (por ejemplo: montys, jandedobbeleer, dracula, etc.)`n`nSi dejas vacio, se usara 'montys' por defecto.",
                "Seleccionar Tema para PowerShell 7",
                "montys"
            )
            
            if ([string]::IsNullOrWhiteSpace($tema)) {
                $tema = "montys"
            }
            
            Write-Host "[*] Tema seleccionado: $tema" -ForegroundColor Cyan
            
            # Ruta del perfil de PowerShell 7
            $ps7ProfilePath = "$env:USERPROFILE\Documents\PowerShell\Microsoft.PowerShell_profile.ps1"
            
            # Crear el archivo de perfil
            Write-Host "[*] Creando perfil en: $ps7ProfilePath" -ForegroundColor Cyan
            $ps7ProfileDir = Split-Path -Parent $ps7ProfilePath
            if (-not (Test-Path $ps7ProfileDir)) {
                New-Item -ItemType Directory -Path $ps7ProfileDir -Force | Out-Null
            }
            
            # Contenido del perfil de PowerShell 7
            $ps7ProfileContent = @"
# Importar modulos
Import-Module -Name Terminal-Icons

# Inicializar Oh-My-Posh con el tema seleccionado
oh-my-posh init pwsh --config "`$env:POSH_THEMES_PATH/$tema.omp.json" | Invoke-Expression

# Configuracion de PSReadLine
`$psReadLineVersion = (Get-Module PSReadLine).Version
if (`$psReadLineVersion -ge [version]"2.1.0") {
    Set-PSReadLineOption -PredictionSource History
    Set-PSReadLineOption -PredictionViewStyle ListView
}
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineOption -BellStyle None

# Alias utiles
Set-Alias -Name vim -Value notepad
Set-Alias -Name ll -Value Get-ChildItem

Write-Host '[+] PowerShell 7 cargado con estilo!' -ForegroundColor Cyan
"@
            
            Set-Content -Path $ps7ProfilePath -Value $ps7ProfileContent -Force
            Write-Host "[+] Perfil de PowerShell 7 creado exitosamente" -ForegroundColor Green
            
            Show-Message "Instalacion completa" "Windows Terminal y PowerShell 7 instalados y configurados.`n`nPowerShell 7 es ahora el shell predeterminado.`n`nPerfil configurado con Terminal-Icons y Oh-My-Posh.`n`nReinicia Windows Terminal para ver los cambios."
        }

        "[7] Crear carpeta ZonaGuayPS" {
            $path = Join-Path $env:USERPROFILE "Documents\ZonaGuayPS"
            if (-not (Test-Path -Path $path)) {
                New-Item -Path $path -ItemType Directory -Force | Out-Null
                Show-Message "Carpeta creada" "Se creo ZonaGuayPS en Documentos."
            } else {
                Show-Message "Ya existe" "La carpeta ya existia."
            }

            $frases = @(
                "PowerShell: porque CMD se quedo en 1990",
                "Un sistema bien tuneado es un sistema feliz",
                "No todo heroe usa capa, algunos usan scripts",
                "Tu maquina ahora brilla con estilo"
            )
            $frase = Get-Random -InputObject $frases
            $archivo = Join-Path $path "mensaje_del_dia.txt"
            Set-Content -Path $archivo -Value $frase -Force
            Show-Message "Mensaje del dia" "Mensaje: $frase"
        }

        "[8] Mostrar informacion del sistema" {
            # Verificar si fastfetch esta instalado
            if (Get-Command fastfetch -ErrorAction SilentlyContinue) {
                Write-Host "[*] Mostrando informacion del sistema con fastfetch..." -ForegroundColor Cyan
                fastfetch
            } else {
                Write-Host "[*] Mostrando informacion del sistema..." -ForegroundColor Cyan
                $info = Get-ComputerInfo | Select-Object CsName, OsName, OsVersion, CsManufacturer, CsModel
                $msg = "Equipo: $($info.CsName)`nSistema: $($info.OsName)`nVersion: $($info.OsVersion)`nFabricante: $($info.CsManufacturer)`nModelo: $($info.CsModel)"
                Show-Message "Informacion del sistema" $msg
            }
        }

        "[X] Salir del asistente" {
            Show-Message "Hasta luego" "Tu sistema esta mas guay que nunca!"
            break
        }
    }
} while ($seleccion -ne "[X] Salir del asistente")
