# ActividadesReact — Seminario de Sistemas Operativos

Este repositorio contiene las actividades prácticas y materiales del curso "Seminario de Solución de Problemas de Uso, Adaptación y Explotación de Sistemas Operativos".

Autor: Joan Alejandro Piña Puga

## 🚀 Tecnologías principales

- React 19 + TypeScript
- Vite (dev server y build)
- TanStack Router (enrutamiento)
- Tailwind CSS + DaisyUI + Shadcn
- lucide-react (íconos)

## 📁 Estructura del Proyecto

```
ActividadesReact/
├─ src/
│  ├─ index.tsx                # Entrada principal
│  ├─ index.css
│  ├─ features/
│  │  ├─ actividad11/
│  │  ├─ actividad12/          # Productor-Consumidor (logs, scroll inteligente)
│  │  ├─ actividad13/          # Scripts y recursos (Windows / Linux) - UI de tabs/accordions
│  │  └─ actividad14/          # Algoritmo del Banquero (interactivo)
│  ├─ components/              # Componentes compartidos (Sidebar, Header...)
│  └─ routes/                  # Rutas del proyecto (TanStack Router)
├─ public/
├─ package.json
└─ README.md
```

## 📚 Estado actual 

- Actividad 11: contenidos disponibles.
- Actividad 12: demo interactiva (Productor-Consumidor) con scroll inteligente y control de buffer.
- Actividad 13: página de scripts organizada por plataforma (Windows / Linux) y por extensión (.bat, .cmd, .ps1 / .sh, .py, .pl).
- Actividad 14: implementación del Algoritmo del Banquero y demo interactiva.

Nota: el proyecto sigue en desarrollo y puede haber ajustes de contenido y estilo.

## Cómo ejecutar (desarrollo)

Instala dependencias y arranca el servidor de desarrollo:

```pwsh
# desde la raíz del proyecto
npm install
npm run dev
```

El servidor corre por defecto en: http://localhost:5173/ActividadesSeminarioSO (o puerto similar según la configuración).

Para construir la versión de producción:

```pwsh
npm run build
```

## Notas de implementación y decisiones importantes

- Las páginas de actividad están organizadas en `src/features/actividadXX` para facilitar la extensión y pruebas independientes.


