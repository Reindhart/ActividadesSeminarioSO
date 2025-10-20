import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Script {
  id: number;
  title: string;
  description: string;
  code: string;
  usage: string;
}

const linuxScripts: Script[] = [
  // Scripts Bash Shell (.sh)
  {
    id: 1,
    title: 'Respaldo Automatizado con Compresión (.sh)',
    description: 'Script Bash que crea respaldos comprimidos de directorios importantes con fecha y hora.',
    code: `#!/bin/bash
# Respaldo automático con tar y gzip

ORIGEN="/home/usuario/documentos"
DESTINO="/backup"
FECHA=$(date +%Y%m%d_%H%M%S)
ARCHIVO="backup_$FECHA.tar.gz"

# Crear directorio de respaldo si no existe
mkdir -p "$DESTINO"

# Crear respaldo comprimido
tar -czf "$DESTINO/$ARCHIVO" "$ORIGEN"

# Verificar si se creó correctamente
if [ $? -eq 0 ]; then
    echo "Respaldo creado exitosamente: $DESTINO/$ARCHIVO"
    ls -lh "$DESTINO/$ARCHIVO"
else
    echo "Error al crear el respaldo"
    exit 1
fi`,
    usage: 'Dar permisos de ejecución con: chmod +x script.sh. Modificar rutas según necesidades. Programar con cron para respaldos automáticos.'
  },
  {
    id: 2,
    title: 'Monitoreo de Recursos del Sistema (.sh)',
    description: 'Script Bash que monitorea CPU, memoria y disco, enviando alertas cuando superan umbrales definidos.',
    code: `#!/bin/bash
# Monitoreo de recursos del sistema

LOG="/var/log/monitor_recursos.log"
UMBRAL_CPU=80
UMBRAL_MEM=85
UMBRAL_DISK=90

# Fecha y hora
echo "========== $(date) ==========" >> "$LOG"

# Verificar CPU
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "Uso de CPU: $CPU%" >> "$LOG"
if (( $(echo "$CPU > $UMBRAL_CPU" | bc -l) )); then
    echo "ALERTA: CPU sobre el umbral!" >> "$LOG"
fi

# Verificar Memoria
MEM=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
echo "Uso de Memoria: \${MEM}%" >> "$LOG"
if (( $(echo "$MEM > $UMBRAL_MEM" | bc -l) )); then
    echo "ALERTA: Memoria sobre el umbral!" >> "$LOG"
fi

# Verificar Disco
DISK=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
echo "Uso de Disco: $DISK%" >> "$LOG"
if [ $DISK -gt $UMBRAL_DISK ]; then
    echo "ALERTA: Disco sobre el umbral!" >> "$LOG"
fi

echo "" >> "$LOG"`,
    usage: 'Ejecutar con permisos de root. Configurar en crontab para monitoreo continuo: */5 * * * * /ruta/script.sh'
  },
  {
    id: 3,
    title: 'Actualización Automática del Sistema (.sh)',
    description: 'Script Bash que actualiza paquetes del sistema y limpia archivos innecesarios automáticamente.',
    code: `#!/bin/bash
# Script de actualización automática (Debian/Ubuntu)

LOG="/var/log/actualizacion_sistema.log"

echo "========== Actualización iniciada: $(date) ==========" >> "$LOG"

# Actualizar lista de paquetes
echo "Actualizando lista de paquetes..." >> "$LOG"
apt update >> "$LOG" 2>&1

# Actualizar paquetes instalados
echo "Actualizando paquetes instalados..." >> "$LOG"
apt upgrade -y >> "$LOG" 2>&1

# Actualización de distribución
echo "Verificando actualización de distribución..." >> "$LOG"
apt dist-upgrade -y >> "$LOG" 2>&1

# Limpiar paquetes obsoletos
echo "Limpiando paquetes obsoletos..." >> "$LOG"
apt autoremove -y >> "$LOG" 2>&1
apt autoclean >> "$LOG" 2>&1

echo "========== Actualización completada: $(date) ==========" >> "$LOG"
echo "" >> "$LOG"

# Verificar si requiere reinicio
if [ -f /var/run/reboot-required ]; then
    echo "ATENCIÓN: Se requiere reiniciar el sistema" >> "$LOG"
fi`,
    usage: 'Ejecutar como root o con sudo. Programar con cron para actualizaciones nocturnas: 0 2 * * 0 /ruta/script.sh'
  },
  {
    id: 4,
    title: 'Gestión de Usuarios y Permisos (.sh)',
    description: 'Script Bash que automatiza la creación de usuarios con configuración predefinida y permisos.',
    code: `#!/bin/bash
# Script de gestión de usuarios

function crear_usuario() {
    read -p "Nombre de usuario: " username
    read -s -p "Contraseña: " password
    echo
    
    # Crear usuario
    useradd -m -s /bin/bash "$username"
    echo "$username:$password" | chpasswd
    
    # Agregar a grupos
    usermod -aG sudo,www-data "$username"
    
    # Crear estructura de directorios
    mkdir -p /home/$username/{proyectos,documentos,descargas}
    chown -R $username:$username /home/$username
    
    echo "Usuario $username creado exitosamente"
}

function eliminar_usuario() {
    read -p "Usuario a eliminar: " username
    read -p "¿Eliminar directorio home? (s/n): " eliminar_home
    
    if [ "$eliminar_home" = "s" ]; then
        userdel -r "$username"
    else
        userdel "$username"
    fi
    
    echo "Usuario $username eliminado"
}

function listar_usuarios() {
    echo "=== Usuarios del sistema ==="
    awk -F: '$3 >= 1000 && $3 < 65534 {print $1}' /etc/passwd
}

# Menú principal
echo "1. Crear usuario"
echo "2. Eliminar usuario"
echo "3. Listar usuarios"
read -p "Seleccione opción: " opcion

case $opcion in
    1) crear_usuario ;;
    2) eliminar_usuario ;;
    3) listar_usuarios ;;
    *) echo "Opción inválida" ;;
esac`,
    usage: 'Debe ejecutarse como root. Personalizar grupos y estructura de directorios según necesidades organizacionales.'
  },

  // Scripts Python (.py)
  {
    id: 5,
    title: 'Análisis de Logs y Reportes (.py)',
    description: 'Script Python que analiza archivos de log del sistema y genera reportes de eventos importantes.',
    code: `#!/usr/bin/env python3
# Análisis de logs del sistema

import re
from datetime import datetime
from collections import Counter

def analizar_logs():
    reporte = f"/var/log/analisis_logs_{datetime.now().strftime('%Y%m%d')}.txt"
    
    with open(reporte, 'w') as f:
        f.write("========== ANÁLISIS DE LOGS ==========\\n")
        f.write(f"Fecha: {datetime.now()}\\n\\n")
        
        # Errores en syslog
        f.write("=== ERRORES EN SYSLOG ===\\n")
        try:
            with open('/var/log/syslog', 'r') as syslog:
                errores = [line for line in syslog if 'error' in line.lower()]
                for error in errores[-20:]:
                    f.write(error)
        except Exception as e:
            f.write(f"Error al leer syslog: {e}\\n")
        
        f.write("\\n=== INTENTOS DE LOGIN FALLIDOS ===\\n")
        try:
            with open('/var/log/auth.log', 'r') as auth:
                fallidos = [line for line in auth if 'Failed password' in line]
                for intento in fallidos[-20:]:
                    f.write(intento)
        except Exception as e:
            f.write(f"Error al leer auth.log: {e}\\n")
    
    print(f"Reporte generado: {reporte}")

if __name__ == "__main__":
    analizar_logs()`,
    usage: 'Ejecutar con: python3 script.py. Requiere permisos de lectura sobre archivos de log. Instalar con: chmod +x script.py'
  },
  {
    id: 6,
    title: 'Monitor de Red y Conexiones (.py)',
    description: 'Script Python que monitorea conexiones de red activas y genera alertas sobre actividad sospechosa.',
    code: `#!/usr/bin/env python3
# Monitor de red y conexiones

import subprocess
import socket
from datetime import datetime

def obtener_conexiones():
    """Obtiene conexiones de red activas"""
    try:
        resultado = subprocess.check_output(
            ['ss', '-tuln'], 
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )
        return resultado
    except subprocess.CalledProcessError as e:
        return f"Error: {e}"

def verificar_puertos_comunes():
    """Verifica el estado de puertos comunes"""
    puertos = {
        22: 'SSH',
        80: 'HTTP',
        443: 'HTTPS',
        3306: 'MySQL',
        5432: 'PostgreSQL'
    }
    
    resultado = []
    for puerto, servicio in puertos.items():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        estado = sock.connect_ex(('localhost', puerto))
        
        if estado == 0:
            resultado.append(f"✓ {servicio} (puerto {puerto}): ABIERTO")
        else:
            resultado.append(f"✗ {servicio} (puerto {puerto}): CERRADO")
        
        sock.close()
    
    return '\\n'.join(resultado)

def main():
    log_file = f"/var/log/monitor_red_{datetime.now().strftime('%Y%m%d')}.log"
    
    with open(log_file, 'w') as f:
        f.write(f"========== Monitor de Red - {datetime.now()} ==========\\n\\n")
        
        f.write("=== CONEXIONES ACTIVAS ===\\n")
        f.write(obtener_conexiones())
        f.write("\\n\\n")
        
        f.write("=== ESTADO DE PUERTOS ===\\n")
        f.write(verificar_puertos_comunes())
        f.write("\\n")
    
    print(f"Reporte generado: {log_file}")

if __name__ == "__main__":
    main()`,
    usage: 'Ejecutar como root para acceso completo a conexiones. Instalar dependencias: pip install psutil'
  },
  {
    id: 7,
    title: 'Gestor de Backups Inteligente (.py)',
    description: 'Script Python que gestiona backups automáticos con rotación, verificación de integridad y notificaciones.',
    code: `#!/usr/bin/env python3
# Gestor de backups inteligente

import os
import shutil
import hashlib
from datetime import datetime, timedelta
from pathlib import Path

class GestorBackup:
    def __init__(self, origen, destino, dias_retencion=7):
        self.origen = Path(origen)
        self.destino = Path(destino)
        self.dias_retencion = dias_retencion
        
    def crear_backup(self):
        """Crea un nuevo backup"""
        fecha = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = self.destino / f"backup_{fecha}"
        
        print(f"Creando backup en {backup_dir}...")
        shutil.copytree(self.origen, backup_dir)
        
        # Calcular checksum
        checksum = self._calcular_checksum(backup_dir)
        checksum_file = backup_dir / 'checksum.txt'
        checksum_file.write_text(checksum)
        
        print(f"✓ Backup creado exitosamente")
        return backup_dir
    
    def _calcular_checksum(self, directorio):
        """Calcula checksum MD5 del directorio"""
        md5_hash = hashlib.md5()
        for filepath in sorted(Path(directorio).rglob('*')):
            if filepath.is_file() and filepath.name != 'checksum.txt':
                with open(filepath, 'rb') as f:
                    md5_hash.update(f.read())
        return md5_hash.hexdigest()
    
    def limpiar_antiguos(self):
        """Elimina backups antiguos"""
        fecha_limite = datetime.now() - timedelta(days=self.dias_retencion)
        
        for backup_dir in self.destino.glob('backup_*'):
            fecha_str = backup_dir.name.replace('backup_', '')
            try:
                fecha_backup = datetime.strptime(fecha_str, '%Y%m%d_%H%M%S')
                if fecha_backup < fecha_limite:
                    print(f"Eliminando backup antiguo: {backup_dir}")
                    shutil.rmtree(backup_dir)
            except ValueError:
                continue

def main():
    gestor = GestorBackup(
        origen='/home/usuario/documentos',
        destino='/backup',
        dias_retencion=7
    )
    
    gestor.crear_backup()
    gestor.limpiar_antiguos()

if __name__ == "__main__":
    main()`,
    usage: 'Modificar rutas en la clase GestorBackup. Ejecutar con permisos adecuados. Programar con cron para ejecución automática.'
  },
  {
    id: 8,
    title: 'Auditoría de Seguridad del Sistema (.py)',
    description: 'Script Python que realiza auditoría de seguridad básica verificando configuraciones y vulnerabilidades.',
    code: `#!/usr/bin/env python3
# Auditoría de seguridad del sistema

import os
import pwd
import subprocess
from datetime import datetime

class AuditoriaSeguridad:
    def __init__(self):
        self.reporte = []
        
    def verificar_usuarios_sin_password(self):
        """Verifica usuarios sin contraseña"""
        self.reporte.append("\\n=== USUARIOS SIN CONTRASEÑA ===")
        
        try:
            with open('/etc/shadow', 'r') as f:
                for line in f:
                    parts = line.split(':')
                    if len(parts) > 1 and parts[1] in ['', '!', '*']:
                        self.reporte.append(f"⚠ Usuario sin contraseña: {parts[0]}")
        except PermissionError:
            self.reporte.append("✗ Requiere permisos de root")
    
    def verificar_permisos_criticos(self):
        """Verifica permisos de archivos críticos"""
        self.reporte.append("\\n=== PERMISOS DE ARCHIVOS CRÍTICOS ===")
        
        archivos_criticos = [
            '/etc/passwd',
            '/etc/shadow',
            '/etc/ssh/sshd_config'
        ]
        
        for archivo in archivos_criticos:
            if os.path.exists(archivo):
                permisos = oct(os.stat(archivo).st_mode)[-3:]
                self.reporte.append(f"{archivo}: {permisos}")
    
    def verificar_puertos_abiertos(self):
        """Lista puertos abiertos"""
        self.reporte.append("\\n=== PUERTOS ABIERTOS ===")
        
        try:
            resultado = subprocess.check_output(
                ['ss', '-tuln'],
                universal_newlines=True
            )
            self.reporte.append(resultado)
        except subprocess.CalledProcessError:
            self.reporte.append("Error al obtener puertos")
    
    def generar_reporte(self):
        """Genera reporte completo"""
        archivo = f"/var/log/auditoria_{datetime.now().strftime('%Y%m%d')}.txt"
        
        with open(archivo, 'w') as f:
            f.write(f"========== AUDITORÍA DE SEGURIDAD ==========\\n")
            f.write(f"Fecha: {datetime.now()}\\n")
            f.write('\\n'.join(self.reporte))
        
        print(f"Reporte generado: {archivo}")

def main():
    auditoria = AuditoriaSeguridad()
    auditoria.verificar_usuarios_sin_password()
    auditoria.verificar_permisos_criticos()
    auditoria.verificar_puertos_abiertos()
    auditoria.generar_reporte()

if __name__ == "__main__":
    main()`,
    usage: 'Ejecutar como root: sudo python3 script.py. Revisar reporte generado en /var/log/'
  },

  // Scripts Perl (.pl)
  {
    id: 9,
    title: 'Procesamiento de Logs con Regex (.pl)',
    description: 'Script Perl que utiliza expresiones regulares avanzadas para procesar y filtrar logs del sistema.',
    code: `#!/usr/bin/perl
# Procesamiento de logs con regex

use strict;
use warnings;
use POSIX qw(strftime);

my $log_file = "/var/log/syslog";
my $output = "/var/log/procesado_" . strftime("%Y%m%d", localtime) . ".txt";

open(my $log_fh, '<', $log_file) or die "No se puede abrir $log_file: $!";
open(my $out_fh, '>', $output) or die "No se puede crear $output: $!";

print $out_fh "========== ANÁLISIS DE LOGS ==========\\n";
print $out_fh "Fecha: " . strftime("%Y-%m-%d %H:%M:%S", localtime) . "\\n\\n";

my %estadisticas = (
    errores => 0,
    advertencias => 0,
    info => 0
);

# Procesar cada línea
while (my $line = <$log_fh>) {
    # Detectar errores
    if ($line =~ /error|failed|failure/i) {
        $estadisticas{errores}++;
        print $out_fh "[ERROR] $line";
    }
    # Detectar advertencias
    elsif ($line =~ /warning|warn/i) {
        $estadisticas{advertencias}++;
        print $out_fh "[WARN] $line";
    }
    # Detectar información relevante
    elsif ($line =~ /started|stopped|restart/i) {
        $estadisticas{info}++;
        print $out_fh "[INFO] $line";
    }
}

# Resumen estadístico
print $out_fh "\\n========== RESUMEN ==========\\n";
print $out_fh "Errores encontrados: $estadisticas{errores}\\n";
print $out_fh "Advertencias: $estadisticas{advertencias}\\n";
print $out_fh "Eventos informativos: $estadisticas{info}\\n";

close($log_fh);
close($out_fh);

print "Procesamiento completado. Reporte: $output\\n";`,
    usage: 'Dar permisos de ejecución: chmod +x script.pl. Ejecutar con: ./script.pl o perl script.pl'
  },
  {
    id: 10,
    title: 'Monitor de Servicios CGI (.pl)',
    description: 'Script Perl que monitorea servicios web y genera reportes de disponibilidad tipo CGI.',
    code: `#!/usr/bin/perl
# Monitor de servicios web estilo CGI

use strict;
use warnings;
use LWP::UserAgent;
use Time::HiRes qw(time);

my @servicios = (
    { nombre => "Servidor Web", url => "http://localhost:80" },
    { nombre => "API REST", url => "http://localhost:3000/api/health" },
    { nombre => "Base de Datos", url => "http://localhost:3306" }
);

my $reporte = "/var/log/monitor_servicios.html";

# Crear reporte HTML
open(my $fh, '>', $reporte) or die "Error: $!";

print $fh <<'HTML';
<!DOCTYPE html>
<html>
<head>
    <title>Monitor de Servicios</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .activo { color: green; font-weight: bold; }
        .inactivo { color: red; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>Monitor de Servicios</h1>
HTML

print $fh "<p>Fecha: " . localtime() . "</p>\\n";
print $fh "<table>\\n";
print $fh "<tr><th>Servicio</th><th>Estado</th><th>Tiempo (ms)</th></tr>\\n";

my $ua = LWP::UserAgent->new(timeout => 5);

foreach my $servicio (@servicios) {
    my $inicio = time();
    my $response = $ua->get($servicio->{url});
    my $tiempo = sprintf("%.2f", (time() - $inicio) * 1000);
    
    my $estado = $response->is_success ? 
        '<span class="activo">ACTIVO</span>' : 
        '<span class="inactivo">INACTIVO</span>';
    
    print $fh "<tr>";
    print $fh "<td>$servicio->{nombre}</td>";
    print $fh "<td>$estado</td>";
    print $fh "<td>$tiempo ms</td>";
    print $fh "</tr>\\n";
}

print $fh "</table>\\n</body>\\n</html>";
close($fh);

print "Reporte generado: $reporte\\n";`,
    usage: 'Instalar módulos: cpan LWP::UserAgent Time::HiRes. Ejecutar con: perl script.pl'
  },
  {
    id: 11,
    title: 'Generador de Reportes CSV (.pl)',
    description: 'Script Perl que genera reportes en formato CSV del uso de recursos del sistema.',
    code: `#!/usr/bin/perl
# Generador de reportes CSV de recursos

use strict;
use warnings;
use POSIX qw(strftime);

my $csv_file = "/var/log/recursos_" . strftime("%Y%m%d", localtime) . ".csv";

# Abrir archivo CSV
open(my $csv_fh, '>', $csv_file) or die "Error al crear CSV: $!";

# Cabecera CSV
print $csv_fh "Timestamp,CPU_Usage,Memory_Total,Memory_Used,Disk_Usage\\n";

# Función para obtener uso de CPU
sub get_cpu_usage {
    my $cpu = \`top -bn1 | grep "Cpu(s)" | awk '{print \\$2}'\`;
    chomp($cpu);
    $cpu =~ s/%//g;
    return $cpu || 0;
}

# Función para obtener memoria
sub get_memory_info {
    my $mem_total = \`free -m | grep Mem | awk '{print \\$2}'\`;
    my $mem_used = \`free -m | grep Mem | awk '{print \\$3}'\`;
    chomp($mem_total);
    chomp($mem_used);
    return ($mem_total, $mem_used);
}

# Función para obtener uso de disco
sub get_disk_usage {
    my $disk = \`df -h / | awk 'NR==2 {print \\$5}'\`;
    chomp($disk);
    $disk =~ s/%//g;
    return $disk || 0;
}

# Recolectar datos (ejemplo: 10 muestras cada 5 segundos)
for (my $i = 0; $i < 10; $i++) {
    my $timestamp = strftime("%Y-%m-%d %H:%M:%S", localtime);
    my $cpu = get_cpu_usage();
    my ($mem_total, $mem_used) = get_memory_info();
    my $disk = get_disk_usage();
    
    print $csv_fh "$timestamp,$cpu,$mem_total,$mem_used,$disk\\n";
    
    print "Muestra $i recolectada...\\n";
    sleep(5) if $i < 9;
}

close($csv_fh);

print "\\nReporte CSV generado: $csv_file\\n";
print "Puede importarlo en Excel o LibreOffice Calc\\n";`,
    usage: 'Ejecutar como root para acceso completo. El script genera un CSV importable en hojas de cálculo.'
  },
  {
    id: 12,
    title: 'Validador de Configuraciones (.pl)',
    description: 'Script Perl que valida archivos de configuración del sistema y reporta inconsistencias.',
    code: `#!/usr/bin/perl
# Validador de archivos de configuración

use strict;
use warnings;
use File::Basename;

my @archivos_config = (
    '/etc/ssh/sshd_config',
    '/etc/nginx/nginx.conf',
    '/etc/apache2/apache2.conf',
    '/etc/mysql/my.cnf'
);

my $reporte = "/var/log/validacion_config.txt";
open(my $fh, '>', $reporte) or die "Error: $!";

print $fh "========== VALIDACIÓN DE CONFIGURACIONES ==========\\n";
print $fh "Fecha: " . localtime() . "\\n\\n";

foreach my $archivo (@archivos_config) {
    print $fh "\\n--- Validando: $archivo ---\\n";
    
    unless (-e $archivo) {
        print $fh "✗ Archivo no existe\\n";
        next;
    }
    
    unless (-r $archivo) {
        print $fh "✗ No se tienen permisos de lectura\\n";
        next;
    }
    
    # Validaciones específicas según tipo de archivo
    my $nombre = basename($archivo);
    
    if ($nombre eq 'sshd_config') {
        validar_ssh($archivo, $fh);
    } elsif ($nombre =~ /nginx|apache/) {
        validar_web($archivo, $fh);
    }
    
    print $fh "✓ Archivo validado\\n";
}

sub validar_ssh {
    my ($archivo, $fh) = @_;
    
    open(my $ssh_fh, '<', $archivo) or return;
    
    my %config;
    while (my $line = <$ssh_fh>) {
        next if $line =~ /^#/ or $line =~ /^\\s*$/;
        
        if ($line =~ /^(\\w+)\\s+(.+)/) {
            $config{$1} = $2;
        }
    }
    
    # Verificar configuraciones de seguridad
    if ($config{PermitRootLogin} && $config{PermitRootLogin} ne 'no') {
        print $fh "⚠ ADVERTENCIA: PermitRootLogin no está en 'no'\\n";
    }
    
    if ($config{PasswordAuthentication} && $config{PasswordAuthentication} eq 'yes') {
        print $fh "⚠ INFO: PasswordAuthentication está habilitado\\n";
    }
    
    close($ssh_fh);
}

sub validar_web {
    my ($archivo, $fh) = @_;
    
    # Verificar sintaxis básica
    my $test_cmd = (-e '/usr/sbin/nginx') ? 
        "nginx -t -c $archivo 2>&1" : 
        "apache2ctl -t -f $archivo 2>&1";
    
    my $resultado = \`$test_cmd\`;
    
    if ($? == 0) {
        print $fh "✓ Sintaxis correcta\\n";
    } else {
        print $fh "✗ Errores de sintaxis:\\n$resultado\\n";
    }
}

close($fh);

print "Validación completada. Reporte: $reporte\\n";`,
    usage: 'Ejecutar como root: sudo perl script.pl. Revisa configuraciones de SSH, Nginx, Apache y MySQL.'
  }
];

export default function LinuxTab() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {/* Sección: Scripts Bash Shell (.sh) */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-green-500 to-green-300 rounded"></div>
          <h3 className="text-xl font-bold text-green-700 px-4 py-2 bg-green-50 rounded-lg border-2 border-green-300">
            Scripts Bash Shell (.sh)
          </h3>
          <div className="h-1 flex-1 bg-gradient-to-l from-green-500 to-green-300 rounded"></div>
        </div>
        
        {linuxScripts.slice(0, 4).map((script) => (
          <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(script.id)}
              type="button"
              className="w-full px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-colors flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center size-8 rounded-full bg-green-600 text-white font-bold text-sm">
                  {script.id}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{script.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`size-5 text-green-600 transition-transform flex-shrink-0 ml-4 ${
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
                      <span className="text-green-600">{'</>'}</span>
                      Código del Script
                    </h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{script.code}</code>
                    </pre>
                  </div>

                  {/* Uso */}
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-semibold text-green-900 mb-2">📝 Instrucciones de Uso</h4>
                    <p className="text-sm text-gray-700">{script.usage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sección: Scripts Python (.py) */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded"></div>
          <h3 className="text-xl font-bold text-yellow-700 px-4 py-2 bg-yellow-50 rounded-lg border-2 border-yellow-300">
            Scripts Python (.py)
          </h3>
          <div className="h-1 flex-1 bg-gradient-to-l from-yellow-500 to-yellow-300 rounded"></div>
        </div>
        
        {linuxScripts.slice(4, 8).map((script) => (
          <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(script.id)}
              type="button"
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-colors flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center size-8 rounded-full bg-yellow-600 text-white font-bold text-sm">
                  {script.id}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{script.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`size-5 text-yellow-600 transition-transform flex-shrink-0 ml-4 ${
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
                      <span className="text-yellow-600">{'</>'}</span>
                      Código del Script
                    </h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{script.code}</code>
                    </pre>
                  </div>

                  {/* Uso */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h4 className="font-semibold text-yellow-900 mb-2">📝 Instrucciones de Uso</h4>
                    <p className="text-sm text-gray-700">{script.usage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sección: Scripts Perl (.pl) */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-teal-500 to-teal-300 rounded"></div>
          <h3 className="text-xl font-bold text-teal-700 px-4 py-2 bg-teal-50 rounded-lg border-2 border-teal-300">
            Scripts Perl (.pl)
          </h3>
          <div className="h-1 flex-1 bg-gradient-to-l from-teal-500 to-teal-300 rounded"></div>
        </div>
        
        {linuxScripts.slice(8, 12).map((script) => (
          <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden mb-3">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(script.id)}
              type="button"
              className="w-full px-6 py-4 bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 transition-colors flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center size-8 rounded-full bg-teal-600 text-white font-bold text-sm">
                  {script.id}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{script.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`size-5 text-teal-600 transition-transform flex-shrink-0 ml-4 ${
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
                      <span className="text-teal-600">{'</>'}</span>
                      Código del Script
                    </h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{script.code}</code>
                    </pre>
                  </div>

                  {/* Uso */}
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
                    <h4 className="font-semibold text-teal-900 mb-2">📝 Instrucciones de Uso</h4>
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
