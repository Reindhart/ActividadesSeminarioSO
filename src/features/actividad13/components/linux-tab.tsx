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
  {
    id: 1,
    title: 'Respaldo Automatizado con Compresión',
    description: 'Script que crea respaldos comprimidos de directorios importantes con fecha y hora.',
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
    title: 'Monitoreo de Recursos del Sistema',
    description: 'Monitorea CPU, memoria y disco, enviando alertas cuando superan umbrales definidos.',
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
    title: 'Actualización Automática del Sistema',
    description: 'Actualiza paquetes del sistema y limpia archivos innecesarios automáticamente.',
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
    title: 'Gestión de Usuarios y Permisos',
    description: 'Automatiza la creación de usuarios con configuración predefinida y permisos.',
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
  {
    id: 5,
    title: 'Análisis de Logs y Reportes',
    description: 'Analiza archivos de log del sistema y genera reportes de eventos importantes.',
    code: `#!/bin/bash
# Análisis de logs del sistema

REPORTE="/var/log/analisis_logs_$(date +%Y%m%d).txt"

echo "========== ANÁLISIS DE LOGS ==========" > "$REPORTE"
echo "Fecha: $(date)" >> "$REPORTE"
echo "" >> "$REPORTE"

# Errores en syslog
echo "=== ERRORES EN SYSLOG ===" >> "$REPORTE"
grep -i "error" /var/log/syslog | tail -20 >> "$REPORTE"
echo "" >> "$REPORTE"

# Intentos de login fallidos
echo "=== INTENTOS DE LOGIN FALLIDOS ===" >> "$REPORTE"
grep "Failed password" /var/log/auth.log | tail -20 >> "$REPORTE"
echo "" >> "$REPORTE"

# Servicios reiniciados
echo "=== SERVICIOS REINICIADOS ===" >> "$REPORTE"
grep "Started\\|Stopped" /var/log/syslog | tail -20 >> "$REPORTE"
echo "" >> "$REPORTE"

# Espacio en disco
echo "=== ESPACIO EN DISCO ===" >> "$REPORTE"
df -h >> "$REPORTE"
echo "" >> "$REPORTE"

# Procesos que más consumen
echo "=== TOP 10 PROCESOS (CPU) ===" >> "$REPORTE"
ps aux --sort=-%cpu | head -11 >> "$REPORTE"

echo "Reporte generado: $REPORTE"`,
    usage: 'Ejecutar con permisos de lectura sobre archivos de log. Programar diariamente para análisis rutinario.'
  },
  {
    id: 6,
    title: 'Configuración de Firewall',
    description: 'Configura reglas básicas de firewall con iptables para seguridad del sistema.',
    code: `#!/bin/bash
# Configuración básica de firewall con iptables

# Limpiar reglas existentes
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Políticas por defecto
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT

# Permitir conexiones establecidas
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir SSH (puerto 22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir HTTP y HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Permitir ping
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# Protección contra escaneo de puertos
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# Guardar reglas
iptables-save > /etc/iptables/rules.v4

echo "Firewall configurado correctamente"`,
    usage: 'Ejecutar como root. Ajustar puertos según servicios. Hacer backup de reglas antes de aplicar cambios.'
  },
  {
    id: 7,
    title: 'Sincronización con Servidor Remoto',
    description: 'Sincroniza archivos con un servidor remoto usando rsync de manera eficiente.',
    code: `#!/bin/bash
# Sincronización de archivos con rsync

LOCAL_DIR="/home/usuario/proyectos"
REMOTE_USER="usuario"
REMOTE_HOST="servidor.ejemplo.com"
REMOTE_DIR="/backup/proyectos"
LOG="/var/log/sincronizacion.log"

echo "========== Sincronización: $(date) ==========" >> "$LOG"

# Sincronizar archivos
rsync -avz --delete \\
    --exclude '*.tmp' \\
    --exclude '.git' \\
    --exclude 'node_modules' \\
    -e "ssh -p 22" \\
    "$LOCAL_DIR/" \\
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/" \\
    >> "$LOG" 2>&1

if [ $? -eq 0 ]; then
    echo "Sincronización completada exitosamente" >> "$LOG"
else
    echo "ERROR en la sincronización" >> "$LOG"
fi

echo "" >> "$LOG"`,
    usage: 'Configurar SSH con claves públicas para acceso sin contraseña. Programar con cron para sincronización automática.'
  },
  {
    id: 8,
    title: 'Verificación de Servicios Críticos',
    description: 'Monitorea servicios críticos y los reinicia automáticamente si están caídos.',
    code: `#!/bin/bash
# Monitoreo y reinicio de servicios críticos

SERVICIOS=("nginx" "mysql" "ssh" "cron")
LOG="/var/log/servicios_monitor.log"

echo "========== $(date) ==========" >> "$LOG"

for servicio in "\${SERVICIOS[@]}"; do
    if systemctl is-active --quiet "$servicio"; then
        echo "$servicio: ACTIVO" >> "$LOG"
    else
        echo "$servicio: CAÍDO - Intentando reiniciar..." >> "$LOG"
        systemctl start "$servicio"
        
        sleep 2
        
        if systemctl is-active --quiet "$servicio"; then
            echo "$servicio: REINICIADO EXITOSAMENTE" >> "$LOG"
        else
            echo "$servicio: ERROR AL REINICIAR" >> "$LOG"
            # Enviar alerta por email
            echo "Servicio $servicio no pudo reiniciarse" | \\
                mail -s "ALERTA: Servicio caído" admin@ejemplo.com
        fi
    fi
done

echo "" >> "$LOG"`,
    usage: 'Ejecutar como root. Programar cada 5 minutos con cron: */5 * * * * /ruta/script.sh'
  },
  {
    id: 9,
    title: 'Rotación de Logs Personalizada',
    description: 'Rota y comprime archivos de log antiguos para gestionar el espacio en disco.',
    code: `#!/bin/bash
# Rotación personalizada de logs

LOG_DIR="/var/log/aplicacion"
DIAS_RETENCION=30
BACKUP_DIR="/backup/logs"

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

# Buscar logs antiguos
find "$LOG_DIR" -name "*.log" -type f -mtime +1 | while read logfile; do
    # Nombre del archivo con fecha
    fecha=$(date +%Y%m%d)
    nombre=$(basename "$logfile")
    
    # Comprimir log
    gzip -c "$logfile" > "$BACKUP_DIR/\${nombre}_\${fecha}.gz"
    
    # Limpiar log original
    > "$logfile"
    
    echo "Log rotado: $nombre"
done

# Eliminar logs antiguos del backup
find "$BACKUP_DIR" -name "*.gz" -type f -mtime +$DIAS_RETENCION -delete

echo "Rotación de logs completada"`,
    usage: 'Ejecutar diariamente con cron a medianoche: 0 0 * * * /ruta/script.sh. Ajustar días de retención según políticas.'
  },
  {
    id: 10,
    title: 'Instalación Automatizada de LAMP Stack',
    description: 'Instala y configura automáticamente Apache, MySQL, PHP (LAMP stack).',
    code: `#!/bin/bash
# Instalación automatizada de LAMP Stack

echo "Instalando LAMP Stack..."

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Apache
echo "Instalando Apache..."
apt install apache2 -y
systemctl enable apache2
systemctl start apache2

# Instalar MySQL
echo "Instalando MySQL..."
apt install mysql-server -y
systemctl enable mysql
systemctl start mysql

# Configurar MySQL
mysql_secure_installation

# Instalar PHP
echo "Instalando PHP..."
apt install php libapache2-mod-php php-mysql -y

# Instalar extensiones PHP comunes
apt install php-curl php-gd php-mbstring php-xml php-xmlrpc php-zip -y

# Reiniciar Apache
systemctl restart apache2

# Crear archivo de prueba PHP
echo "<?php phpinfo(); ?>" > /var/www/html/info.php

# Verificar instalación
echo "=== Verificación de instalación ==="
apache2 -v
mysql -V
php -v

echo "LAMP Stack instalado correctamente"
echo "Accede a http://tu-servidor/info.php para verificar PHP"`,
    usage: 'Ejecutar como root en sistema Debian/Ubuntu. Seguir prompts de configuración de MySQL. Eliminar info.php después de verificar.'
  }
];

export default function LinuxTab() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {linuxScripts.map((script) => (
        <div key={script.id} className="border border-gray-200 rounded-lg overflow-hidden">
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
  );
}
