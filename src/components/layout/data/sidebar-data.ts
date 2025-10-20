import { Home, FileText, Users, Database, Settings } from 'lucide-react'
import { type SidebarData, type NavGroup } from '../types'

const Actividades: NavGroup = {
  title: 'Actividades',
  items: [
    {
      title: 'Inicio',
      url: '/ActividadesSeminarioSO',
      icon: Home,
    },
    {
      title: 'Actividad 11',
      url: '/ActividadesSeminarioSO/actividad11',
      icon: FileText,
      items: [
        { title: 'Condición de Carrera', url: '/ActividadesSeminarioSO/actividad11/condicion-carrera', icon: FileText },
        { title: 'Deadlock', url: '/ActividadesSeminarioSO/actividad11/deadlock', icon: FileText },
        { title: 'Starvation', url: '/ActividadesSeminarioSO/actividad11/starvation', icon: FileText },
        { title: 'Livelock', url: '/ActividadesSeminarioSO/actividad11/livelock', icon: FileText },
        { title: 'Lectura/Escritura', url: '/ActividadesSeminarioSO/actividad11/lectura-escritura', icon: FileText },
        { title: 'Contención de Recursos', url: '/ActividadesSeminarioSO/actividad11/contencion-recursos', icon: FileText },
        { title: 'Bloqueos Innecesarios', url: '/ActividadesSeminarioSO/actividad11/bloqueos-innecesarios', icon: FileText },
        { title: 'Eventos', url: '/ActividadesSeminarioSO/actividad11/eventos', icon: FileText },
        { title: 'Priority Inversion', url: '/ActividadesSeminarioSO/actividad11/priority-inversion', icon: FileText },
        { title: 'ABA', url: '/ActividadesSeminarioSO/actividad11/aba', icon: FileText },
        { title: 'Memory Consistency', url: '/ActividadesSeminarioSO/actividad11/memory-consistency', icon: FileText },
        { title: 'Thundering Herd', url: '/ActividadesSeminarioSO/actividad11/thundering-herd', icon: FileText },
        { title: 'Convoying', url: '/ActividadesSeminarioSO/actividad11/convoying', icon: FileText },
        { title: 'False Sharing', url: '/ActividadesSeminarioSO/actividad11/false-sharing', icon: FileText },
        { title: 'Lost Wakeup', url: '/ActividadesSeminarioSO/actividad11/lost-wakeup', icon: FileText },
      ],
    },
    {
      title: 'Actividad 12',
      url: '/ActividadesSeminarioSO/actividad12',
      icon: Users,
    },
    {
      title: 'Actividad 13',
      url: '/ActividadesSeminarioSO/actividad13',
      icon: Database,
    },
    {
      title: 'Actividad 14',
      url: '/ActividadesSeminarioSO/actividad14',
      icon: Settings,
    },
  ],
}

export const sidebarData: SidebarData = {
  navGroups: [Actividades],
}
