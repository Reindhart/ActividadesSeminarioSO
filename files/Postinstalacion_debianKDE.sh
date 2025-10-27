#!/usr/bin/env bash
#
# 🎨 Tuneador Archi Requete Recontra Guay 💅🐮
# Script post-instalación para KDE Plasma + Zsh + Powerlevel10k
# --------------------------------------------------------------

set -euo pipefail

# Inicializar log
echo "=== INICIO DE INSTALACIÓN: $(date) ===" > /tmp/install.log
echo "" >> /tmp/install.log

# Colores
verde="\033[1;32m"
amarillo="\033[1;33m"
azul="\033[1;34m"
reset="\033[0m"

# 🔍 Comprobar dependencias básicas
for cmd in whiptail; do
  if ! command -v "$cmd" &>/dev/null; then
    echo -e "${amarillo}Instalando $cmd...${reset}"
    sudo apt install -y "$cmd"
  fi
done

# 🐮 Instalar cowsay y fortune (diversión obligatoria)
if ! command -v cowsay &>/dev/null; then
  echo -e "${verde}Instalando cowsay para máxima diversión bovina...${reset}"
  sudo apt install -y cowsay fortune-mod
fi

# 🎉 Bienvenida
ANIMAL_ALEATORIO=$(cowsay -l | tail -n +2 | tr ' ' '\n' | grep -v '^$' | shuf -n 1)
MENSAJE_INICIO=$(cowsay -f "$ANIMAL_ALEATORIO" "¡Hora de tunear tu sistema! 🚀")

whiptail --title "🐮 Tuneador Archi Requete Recontra Guay" \
  --msgbox "Bienvenido al configurador más elegante, vacuno y exageradamente guay 🐄✨\n\nVamos a dejar tu sistema más fino que un KDE con brillantina 😎\n\n$MENSAJE_INICIO" 20 70

# 🔧 Detectar entorno KDE Plasma
if ! pgrep -x plasmashell >/dev/null 2>&1; then
  whiptail --title "Atención" --msgbox "No se detectó KDE Plasma. Algunas configuraciones gráficas pueden no aplicarse 🧠" 10 60
fi

# 🧩 Actualizar sistema
if whiptail --title "Actualización del Sistema" --yesno "¿Deseas actualizar el sistema ahora?\n\nEsto ejecutará apt update && apt upgrade" 10 60; then
  (
    echo "10" ; sleep 1
    echo "30" ; sudo apt update -y
    echo "50" ; sleep 1
    echo "80" ; sudo apt upgrade -y
    echo "100" ; sleep 1
  ) | whiptail --title "Actualizando Sistema" --gauge "Actualizando paquetes..." 8 60 0
else
  whiptail --title "Saltando actualización" --msgbox "Actualización omitida. Continuando con la instalación..." 8 60
fi

# 🛠️ Instalar herramientas
INSTALL_ERROR=""
(
  echo "10" ; sleep 1
  if ! sudo apt install -y fastfetch 2>&1 | tee -a /tmp/install.log; then
    echo "ERROR: fastfetch" >> /tmp/install-errors.log
  fi
  echo "25" ; sleep 1
  if ! sudo apt install -y nala zsh git wget curl unzip 2>&1 | tee -a /tmp/install.log; then
    echo "ERROR: nala, zsh, git, wget, curl, unzip" >> /tmp/install-errors.log
  fi
  echo "45" ; sleep 1
  if ! sudo apt install -y fonts-hack-ttf cowsay fortune-mod 2>&1 | tee -a /tmp/install.log; then
    echo "ERROR: fonts-hack-ttf, cowsay, fortune-mod" >> /tmp/install-errors.log
  fi
  echo "65" ; sleep 1
  if ! sudo apt install -y x11-xserver-utils 2>&1 | tee -a /tmp/install.log; then
    echo "ERROR: x11-xserver-utils (necesario para xrdb)" >> /tmp/install-errors.log
  fi
  echo "80" ; sleep 1
  if ! sudo apt install -y plasma-workspace kde-config-gtk-style 2>&1 | tee -a /tmp/install.log; then
    echo "ERROR: plasma-workspace, kde-config-gtk-style" >> /tmp/install-errors.log
  fi
  echo "100" ; sleep 1
) | whiptail --title "Instalando Herramientas" --gauge "Instalando Fastfetch, Nala, Zsh, herramientas X11 y más... 🧙" 8 75 0

# Verificar si hubo errores de instalación
if [ -f /tmp/install-errors.log ]; then
  ERROR_MSG=$(cat /tmp/install-errors.log)
  whiptail --title "⚠️ Errores de Instalación" --msgbox "Algunos paquetes no pudieron instalarse:\n\n$ERROR_MSG\n\nEl script continuará, pero algunas funciones pueden no estar disponibles.\n\nRevisa /tmp/install.log para más detalles." 16 70
  rm /tmp/install-errors.log
fi

# 🧠 Variables
ZSH_CUSTOM=${ZSH_CUSTOM:-~/.oh-my-zsh/custom}

# 🐚 Instalar Oh-My-Zsh
if [ ! -d "$HOME/.oh-my-zsh" ]; then
  whiptail --title "Oh My Zsh" --infobox "Instalando Oh My Zsh... 🐚" 8 60
  if ! RUNZSH=no KEEP_ZSHRC=yes CHSH=no sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" 2>&1 | tee -a /tmp/install.log; then
    whiptail --title "❌ Error" --msgbox "No se pudo instalar Oh My Zsh.\n\nPuede ser un problema de conexión a internet.\n\nRevisa /tmp/install.log para más detalles." 12 60
  fi
  sleep 2
else
  whiptail --title "Oh My Zsh" --infobox "Oh My Zsh ya está instalado ✓" 8 60
  sleep 1
fi

# 🔌 Plugins de Zsh
whiptail --title "Plugins de Zsh" --infobox "Instalando plugins de Zsh... 🔌" 8 60

[ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ] && \
  git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM/plugins/zsh-autosuggestions" 2>&1 | tee -a /tmp/install.log || true

[ ! -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ] && \
  git clone https://github.com/zsh-users/zsh-syntax-highlighting "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" 2>&1 | tee -a /tmp/install.log || true

[ ! -d "$ZSH_CUSTOM/plugins/fast-syntax-highlighting" ] && \
  git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git "$ZSH_CUSTOM/plugins/fast-syntax-highlighting" 2>&1 | tee -a /tmp/install.log || true

sleep 2

# 💅 Tema Powerlevel10k
if [ ! -d "$ZSH_CUSTOM/themes/powerlevel10k" ]; then
  whiptail --title "Powerlevel10k" --infobox "Instalando tema Powerlevel10k... 💅" 8 60
  if ! git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$ZSH_CUSTOM/themes/powerlevel10k" 2>&1 | tee -a /tmp/install.log; then
    whiptail --title "❌ Error" --msgbox "No se pudo clonar Powerlevel10k.\n\nVerifica tu conexión a internet.\n\nRevisa /tmp/install.log para más detalles." 12 60
  fi
  sleep 2
else
  whiptail --title "Powerlevel10k" --infobox "Powerlevel10k ya está instalado ✓" 8 60
  sleep 1
fi

# ⚙️ Configurar .zshrc
whiptail --title "Configuración" --infobox "Configurando .zshrc... ⚙️" 8 60
echo "" >> /tmp/install.log
echo "=== CONFIGURANDO .zshrc ===" >> /tmp/install.log
sed -i 's/^ZSH_THEME=.*/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc 2>&1 | tee -a /tmp/install.log || echo 'ZSH_THEME="powerlevel10k/powerlevel10k"' >> ~/.zshrc 2>&1 | tee -a /tmp/install.log
sed -i 's/^plugins=.*/plugins=(git zsh-autosuggestions zsh-syntax-highlighting colored-man-pages)/' ~/.zshrc 2>&1 | tee -a /tmp/install.log || echo 'plugins=(git zsh-autosuggestions zsh-syntax-highlighting colored-man-pages)' >> ~/.zshrc 2>&1 | tee -a /tmp/install.log
echo "✓ .zshrc configurado" >> /tmp/install.log
sleep 1

# 🧾 Alias personalizados para Zsh
whiptail --title "Alias" --infobox "Agregando alias personalizados a Zsh... 🧾" 8 60
echo "" >> /tmp/install.log
echo "=== CONFIGURANDO ALIAS EN ZSH ===" >> /tmp/install.log
if [ -f ~/.zshrc ]; then
  if ! grep -q "# === Alias personalizados ===" ~/.zshrc; then
    {
      echo ""
      echo "# === Alias personalizados ==="
      echo "alias cls='clear'"
      echo "alias lsa='ls -lah'"
    } >> ~/.zshrc
    echo "✓ Alias agregados a .zshrc" >> /tmp/install.log
  else
    echo "ℹ Alias ya existen en .zshrc" >> /tmp/install.log
  fi
fi
sleep 1

# 🧾 Alias personalizados para Bash
whiptail --title "Alias" --infobox "Agregando alias personalizados a Bash... 🧾" 8 60
echo "" >> /tmp/install.log
echo "=== CONFIGURANDO ALIAS EN BASH ===" >> /tmp/install.log
if [ -f ~/.bashrc ]; then
  if ! grep -q "# === Alias personalizados ===" ~/.bashrc; then
    {
      echo ""
      echo "# === Alias personalizados ==="
      echo "alias cls='clear'"
      echo "alias lsa='ls -lah'"
    } >> ~/.bashrc
    echo "✓ Alias agregados a .bashrc" >> /tmp/install.log
  else
    echo "ℹ Alias ya existen en .bashrc" >> /tmp/install.log
  fi
else
  # Crear .bashrc si no existe
  {
    echo "# === Alias personalizados ==="
    echo "alias cls='clear'"
    echo "alias lsa='ls -lah'"
  } >> ~/.bashrc
  echo "✓ .bashrc creado con alias" >> /tmp/install.log
fi
sleep 1

# 🔠 Fuente Hack Nerd Font
if [ ! -d "$HOME/.local/share/fonts/HackNerdFont" ]; then
  FONT_ERROR=""
  echo "" >> /tmp/install.log
  echo "=== INSTALANDO HACK NERD FONT ===" >> /tmp/install.log
  (
    echo "10" ; sleep 1
    mkdir -p ~/.local/share/fonts/HackNerdFont 2>&1 | tee -a /tmp/install.log || FONT_ERROR="mkdir"
    echo "30" ; sleep 1
    if ! wget -qO HackNerdFont.zip https://github.com/ryanoasis/nerd-fonts/releases/latest/download/Hack.zip 2>&1 | tee -a /tmp/install.log; then
      FONT_ERROR="wget"
    fi
    echo "60" ; sleep 1
    if ! unzip -q HackNerdFont.zip -d ~/.local/share/fonts/HackNerdFont 2>&1 | tee -a /tmp/install.log; then
      FONT_ERROR="unzip"
    fi
    echo "80" ; sleep 1
    echo "Actualizando caché de fuentes..." >> /tmp/install.log
    fc-cache -fv >> /tmp/install.log 2>&1
    echo "90" ; sleep 1
    rm -f HackNerdFont.zip
    echo "✓ Hack Nerd Font instalada" >> /tmp/install.log
    echo "100" ; sleep 1
  ) | whiptail --title "Hack Nerd Font" --gauge "Descargando e instalando fuente..." 8 60 0
  
  if [ -n "$FONT_ERROR" ]; then
    echo "✗ Error al instalar fuente: $FONT_ERROR" >> /tmp/install.log
    whiptail --title "⚠️ Advertencia" --msgbox "Hubo un problema al instalar Hack Nerd Font.\n\nError en: $FONT_ERROR\n\nPuedes instalarla manualmente más tarde.\nEl script continuará sin la fuente." 12 60
  fi
else
  echo "" >> /tmp/install.log
  echo "=== HACK NERD FONT ===" >> /tmp/install.log
  echo "ℹ Hack Nerd Font ya está instalada" >> /tmp/install.log
  whiptail --title "Hack Nerd Font" --infobox "Hack Nerd Font ya está instalada ✓" 8 60
  sleep 1
fi

# 🖱️ Instalar Posy's Cursor
if [ ! -d "$HOME/.icons/posy-improved-cursor-linux" ]; then
  whiptail --title "Posy's Cursor" --infobox "Descargando Posy's Cursor... 🖱️" 8 60
  
  echo "" >> /tmp/install.log
  echo "=== INSTALANDO POSY'S CURSOR ===" >> /tmp/install.log
  
  # Crear directorio de iconos si no existe
  mkdir -p "$HOME/.icons" 2>&1 | tee -a /tmp/install.log
  
  # Clonar el repositorio
  if git clone https://github.com/simtrami/posy-improved-cursor-linux.git "$HOME/.icons/posy-improved-cursor-linux" 2>&1 | tee -a /tmp/install.log; then
    # Instalar el cursor básico
    if [ -d "$HOME/.icons/posy-improved-cursor-linux/Posy_Cursor" ]; then
      # Copiar el cursor básico a la ubicación correcta
      cp -r "$HOME/.icons/posy-improved-cursor-linux/Posy_Cursor" "$HOME/.icons/" 2>&1 | tee -a /tmp/install.log
      echo "✓ Posy's Cursor instalado correctamente" >> /tmp/install.log
      whiptail --title "Posy's Cursor" --infobox "Posy's Cursor instalado exitosamente ✓" 8 60
      sleep 2
    else
      echo "⚠ Variante básica de Posy's Cursor no encontrada" >> /tmp/install.log
      whiptail --title "⚠️ Advertencia" --msgbox "Se descargó Posy's Cursor pero no se encontró la variante básica.\n\nRevisa $HOME/.icons/posy-improved-cursor-linux/ para ver las variantes disponibles." 12 70
    fi
  else
    echo "✗ Error al clonar repositorio de Posy's Cursor" >> /tmp/install.log
    whiptail --title "❌ Error" --msgbox "No se pudo clonar Posy's Cursor.\n\nVerifica tu conexión a internet.\n\nRevisa /tmp/install.log para más detalles." 12 60
  fi
else
  # Si ya existe, actualizar y reinstalar
  whiptail --title "Posy's Cursor" --infobox "Actualizando Posy's Cursor... 🔄" 8 60
  
  echo "" >> /tmp/install.log
  echo "=== ACTUALIZANDO POSY'S CURSOR ===" >> /tmp/install.log
  
  (cd "$HOME/.icons/posy-improved-cursor-linux" && git pull 2>&1 | tee -a /tmp/install.log) || true
  
  # Reinstalar el cursor
  if [ -d "$HOME/.icons/posy-improved-cursor-linux/Posy_Cursor" ]; then
    cp -rf "$HOME/.icons/posy-improved-cursor-linux/Posy_Cursor" "$HOME/.icons/" 2>&1 | tee -a /tmp/install.log
    echo "✓ Posy's Cursor actualizado" >> /tmp/install.log
    whiptail --title "Posy's Cursor" --infobox "Posy's Cursor actualizado ✓" 8 60
    sleep 1
  fi
fi

# 🎨 Configurar KDE (si aplica)
if command -v kwriteconfig5 &>/dev/null; then
  if whiptail --title "Configuración KDE" --yesno "¿Deseas aplicar la configuración de apariencia de KDE Plasma?\n\n- Tema oscuro Breeze\n- Iconos Breeze Dark\n- Posy's Cursor\n- Sin splash screen" 12 70; then
    whiptail --title "Configurando KDE" --infobox "Aplicando ajustes ultra guays de Plasma... 🎨" 8 70
    
    echo "" >> /tmp/install.log
    echo "=== CONFIGURANDO KDE PLASMA ===" >> /tmp/install.log
    
    sleep 1

    # Ajustes de apariencia - Tema global y colores
    echo "Configurando tema global..." >> /tmp/install.log
    kwriteconfig5 --file kdeglobals --group General --key ColorScheme "BreezeDark" 2>&1 | tee -a /tmp/install.log
    kwriteconfig5 --file kdeglobals --group KDE --key LookAndFeelPackage "org.kde.breezedark.desktop" 2>&1 | tee -a /tmp/install.log
    kwriteconfig5 --file kdeglobals --group KDE --key widgetStyle "Breeze" 2>&1 | tee -a /tmp/install.log
    kwriteconfig5 --file kdeglobals --group Icons --key Theme "breeze-dark" 2>&1 | tee -a /tmp/install.log
    
    # Configurar Posy's Cursor
    whiptail --title "Cursor" --infobox "Configurando Posy's Cursor... 🖱️" 8 60
    echo "Configurando Posy's Cursor..." >> /tmp/install.log
    
    # Configurar en múltiples ubicaciones para asegurar que se aplique
    kwriteconfig5 --file kcminputrc --group Mouse --key cursorTheme "Posy_Cursor" 2>&1 | tee -a /tmp/install.log
    kwriteconfig5 --file kdeglobals --group Icons --key cursorTheme "Posy_Cursor" 2>&1 | tee -a /tmp/install.log
    kwriteconfig5 --file ~/.config/kcminputrc --group Mouse --key cursorTheme "Posy_Cursor" 2>&1 | tee -a /tmp/install.log
    
    # Crear archivo index.theme
    mkdir -p "$HOME/.icons/default"
    cat > "$HOME/.icons/default/index.theme" << EOF
[Icon Theme]
Inherits=Posy_Cursor
EOF
    echo "✓ index.theme creado" >> /tmp/install.log
    
    # Configurar en X11
    touch ~/.Xresources
    if grep -q "^Xcursor.theme:" ~/.Xresources 2>/dev/null; then
      sed -i "s/^Xcursor.theme:.*/Xcursor.theme: Posy_Cursor/" ~/.Xresources
      echo "✓ Xresources actualizado" >> /tmp/install.log
    else
      echo "Xcursor.theme: Posy_Cursor" >> ~/.Xresources
      echo "✓ Xresources configurado" >> /tmp/install.log
    fi
    
    if ! grep -q "^Xcursor.size:" ~/.Xresources 2>/dev/null; then
      echo "Xcursor.size: 24" >> ~/.Xresources
      echo "✓ Tamaño de cursor configurado" >> /tmp/install.log
    fi
    
    # Aplicar Xresources
    if command -v xrdb &>/dev/null; then
      xrdb -merge ~/.Xresources 2>&1 | tee -a /tmp/install.log || true
    fi
    
    # Estilo de Plasma - Breeze oscuro
    echo "Configurando estilo de Plasma..." >> /tmp/install.log
    kwriteconfig5 --file plasmarc --group Theme --key name "breeze-dark" 2>&1 | tee -a /tmp/install.log
    
    # Decoración de ventanas - Breeze
    echo "Configurando decoración de ventanas..." >> /tmp/install.log
    kwriteconfig5 --file kwinrc --group org.kde.kdecoration2 --key library "org.kde.breeze" 2>&1 | tee -a /tmp/install.log
    kwriteconfig5 --file kwinrc --group org.kde.kdecoration2 --key theme "Breeze" 2>&1 | tee -a /tmp/install.log
    
    # Sonidos del sistema - Océano
    echo "Configurando sonidos..." >> /tmp/install.log
    kwriteconfig5 --file kdeglobals --group Sounds --key Theme "ocean" 2>&1 | tee -a /tmp/install.log
    
    # Splash screen - None (sin pantalla de splash)
    echo "Desactivando splash screen..." >> /tmp/install.log
    kwriteconfig5 --file ksplashrc --group KSplash --key Engine "none" 2>&1 | tee -a /tmp/install.log
    kwriteconfig5 --file ksplashrc --group KSplash --key Theme "None" 2>&1 | tee -a /tmp/install.log
    
    # Pantalla de inicio de sesión SDDM - Debian Breeze
    echo "Configurando tema SDDM..." >> /tmp/install.log
    kwriteconfig5 --file ~/.config/sddm-theme/theme.conf.user --group General --key Current "debian-breeze" 2>&1 | tee -a /tmp/install.log
    
    # Fondo de escritorio - Next (tema oscuro)
    whiptail --title "Fondo" --infobox "Configurando fondo de escritorio... 🖼️" 8 60
    echo "Buscando wallpaper..." >> /tmp/install.log
    WALLPAPER_FOUND=""
    for WALLPAPER in \
      "/usr/share/wallpapers/Next/contents/images_dark/1920x1080.png" \
      "/usr/share/wallpapers/Next/contents/images_dark/2560x1600.png" \
      "/usr/share/wallpapers/Next/contents/images_dark/1920x1200.png" \
      "/usr/share/wallpapers/Next/contents/images/1920x1080.png"; do
      if [ -f "$WALLPAPER" ]; then
        WALLPAPER_FOUND="$WALLPAPER"
        echo "✓ Wallpaper encontrado: $WALLPAPER_FOUND" >> /tmp/install.log
        break
      fi
    done
    
    if [ -n "$WALLPAPER_FOUND" ]; then
      if command -v plasma-apply-wallpaperimage &>/dev/null; then
        echo "Aplicando wallpaper con plasma-apply-wallpaperimage..." >> /tmp/install.log
        plasma-apply-wallpaperimage "$WALLPAPER_FOUND" 2>&1 | tee -a /tmp/install.log || true
      fi
      
      sleep 1
      if command -v qdbus &>/dev/null; then
        echo "Aplicando wallpaper con qdbus..." >> /tmp/install.log
        qdbus org.kde.plasmashell /PlasmaShell org.kde.PlasmaShell.evaluateScript "
          var allDesktops = desktops();
          for (i=0;i<allDesktops.length;i++) {
            d = allDesktops[i];
            d.wallpaperPlugin = 'org.kde.image';
            d.currentConfigGroup = Array('Wallpaper', 'org.kde.image', 'General');
            d.writeConfig('Image', 'file://$WALLPAPER_FOUND');
          }
        " 2>&1 | tee -a /tmp/install.log || true
      fi
    else
      echo "⚠ No se encontró ningún wallpaper de Next" >> /tmp/install.log
    fi
    
    # Recargar KWin para aplicar cambios
    echo "Recargando KWin..." >> /tmp/install.log
    if command -v qdbus &>/dev/null; then
      qdbus org.kde.KWin /KWin reconfigure 2>&1 | tee -a /tmp/install.log || true
    fi
    
    echo "✓ Configuración de KDE completada" >> /tmp/install.log
    
    whiptail --title "KDE Configurado" --msgbox "Configuración de KDE aplicada exitosamente ✓

Los siguientes cambios se aplicaron:
✅ Tema oscuro Breeze
✅ Iconos Breeze Dark
✅ Cursor: Posy's Cursor
✅ Estilo de Plasma: Breeze oscuro
✅ Decoración de ventanas: Breeze
✅ Sonidos: Océano
✅ Fondo de escritorio: Next (tema oscuro)
✅ Sin splash screen

⚠️  IMPORTANTE:
• Cierra sesión y vuelve a entrar para aplicar 
  todos los cambios completamente
• Para configurar el tema SDDM (pantalla de login),
  ve a: Preferencias del Sistema > Inicio y apagado
  > Pantalla de inicio de sesión (requiere root)" 20 70
  else
    whiptail --title "KDE Omitido" --msgbox "Configuración de KDE omitida" 8 60
  fi
else
  whiptail --title "KDE No Detectado" --msgbox "KDE Plasma no está disponible. Saltando configuración gráfica." 8 60
fi

# 🐚 Cambiar shell predeterminada
if whiptail --title "Cambiar Shell" --yesno "¿Deseas establecer Zsh como tu shell predeterminada?\n\n(Requerirá tu contraseña)" 10 60; then
  whiptail --title "Cambiando Shell" --infobox "Estableciendo Zsh como shell predeterminada... 🐚" 8 60
  
  echo "" >> /tmp/install.log
  echo "=== CAMBIANDO SHELL A ZSH ===" >> /tmp/install.log
  
  if command -v zsh &>/dev/null; then
    ZSH_PATH=$(which zsh)
    echo "Ruta de zsh: $ZSH_PATH" >> /tmp/install.log
    echo "Usuario: $USER" >> /tmp/install.log
    
    if chsh -s "$ZSH_PATH" 2>&1 >> /tmp/install.log; then
      echo "✓ Shell cambiada exitosamente a $ZSH_PATH" >> /tmp/install.log
      whiptail --title "Shell Cambiada" --msgbox "Zsh es ahora tu shell predeterminada ✓\n\nShell configurada: $ZSH_PATH\n\nDeberás cerrar sesión completamente y volver a entrar para que surta efecto." 12 60
    else
      echo "✗ Error al cambiar shell" >> /tmp/install.log
      whiptail --title "❌ Error" --msgbox "No se pudo cambiar la shell a Zsh.\n\nPuede requerir privilegios adicionales.\n\nPrueba manualmente:\n  chsh -s $ZSH_PATH\n\nO verifica que zsh esté en /etc/shells:\n  cat /etc/shells" 14 70
    fi
  else
    echo "✗ zsh no está instalado" >> /tmp/install.log
    whiptail --title "❌ Error" --msgbox "Zsh no está instalado.\n\nNo se puede establecer como shell predeterminada." 10 60
  fi
  sleep 2
else
  echo "" >> /tmp/install.log
  echo "=== SHELL NO CAMBIADA ===" >> /tmp/install.log
  echo "ℹ Usuario decidió mantener shell actual" >> /tmp/install.log
  whiptail --title "Shell Sin Cambios" --msgbox "Manteniendo tu shell actual" 8 60
fi

# Finalizar log
echo "" >> /tmp/install.log
echo "=== FIN DE INSTALACIÓN: $(date) ===" >> /tmp/install.log

# 🎊 Mensaje final
clear
ANIMAL_FINAL=$(cowsay -l | tail -n +2 | tr ' ' '\n' | grep -v '^$' | shuf -n 1)
MENSAJE_FINAL=$(cowsay -f "$ANIMAL_FINAL" "🎉 ¡Tu sistema quedó archi requete recontra guay! 🎉")

whiptail --title "¡Éxito Total! 🎊" --msgbox "$MENSAJE_FINAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tu sistema ahora luce tan guay que 
hasta Tux quiere copiarlo 🐧💅

Se han realizado los siguientes cambios:

✅ Repositorios actualizados
✅ Paquetes instalados: 
   • fastfetch, nala, cowsay, fortune-mod
   • x11-xserver-utils, plasma-workspace
   • kde-config-gtk-style
✅ Hack Nerd Font instalada
✅ Posy's Cursor instalado (desde GitHub)
✅ Zsh con Oh-My-Zsh configurado
✅ Tema Powerlevel10k instalado
✅ Plugins de Zsh:
   • zsh-autosuggestions
   • zsh-syntax-highlighting
   • fast-syntax-highlighting
   • colored-man-pages
✅ Alias personalizados (cls, lsa) en Bash y Zsh
✅ KDE Plasma configurado (si elegiste):
   • Aspecto Global: Brisa Oscuro
   • Estilo de Aplicaciones: Brisa
   • Estilo de Plasma: Brisa oscuro
   • Colores: BrisaOscuro
   • Iconos: BeautyLine
   • Cursor: Posy_Cursor
   • Decoración de Ventanas: Brisa
   • Fondo de Escritorio: Next (tema oscuro)
   • Pantalla de Bienvenida: None

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANTE:
• Cierra sesión y vuelve a entrar para 
  aplicar todos los cambios completamente
• La primera vez que abras Zsh, Powerlevel10k 
  te guiará en la configuración inicial
• Para cambiar tema SDDM, ve a Preferencias 
  del Sistema (requiere permisos root)

📋 Logs: /tmp/install.log

¡Disfruta tu sistema renovado! 🚀" 40 70

# Mostrar log si hubo problemas
if [ -f /tmp/install.log ]; then
  if whiptail --title "Registro de Instalación" --yesno "¿Deseas ver el registro de instalación completo?\n\n(Se abrirá con 'less' para navegar)\nUsa flechas ↑↓ para moverte, 'q' para salir" 12 65; then
    clear
    echo -e "${verde}=== LOG DE INSTALACIÓN ===${reset}"
    echo -e "${amarillo}Usa las flechas para navegar, presiona 'q' para salir${reset}"
    echo ""
    sleep 2
    less /tmp/install.log
    clear
  fi
fi
