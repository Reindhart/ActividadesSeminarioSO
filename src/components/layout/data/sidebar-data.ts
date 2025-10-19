import { Home, FileText, Users, Database, Settings } from 'lucide-react'
import { type SidebarData, type NavGroup } from '../types'

const Actividades: NavGroup = {
  title: 'Actividades',
  items: [
    {
      title: 'Inicio',
      url: '/',
      icon: Home,
    },
    {
      title: 'Actividad 11',
      url: '/actividad11',
      icon: FileText,
      items: [
        { title: 'Condición de Carrera', url: '/actividad11/condicion-carrera', icon: FileText },
        { title: 'Deadlock', url: '/actividad11/deadlock', icon: FileText },
        { title: 'Starvation', url: '/actividad11/starvation', icon: FileText },
        { title: 'Livelock', url: '/actividad11/livelock', icon: FileText },
        { title: 'Lectura/Escritura', url: '/actividad11/lectura-escritura', icon: FileText },
        { title: 'Contención de Recursos', url: '/actividad11/contencion-recursos', icon: FileText },
        { title: 'Bloqueos Innecesarios', url: '/actividad11/bloqueos-innecesarios', icon: FileText },
        { title: 'Eventos', url: '/actividad11/eventos', icon: FileText },
        { title: 'Priority Inversion', url: '/actividad11/priority-inversion', icon: FileText },
        { title: 'ABA', url: '/actividad11/aba', icon: FileText },
        { title: 'Memory Consistency', url: '/actividad11/memory-consistency', icon: FileText },
        { title: 'Thundering Herd', url: '/actividad11/thundering-herd', icon: FileText },
        { title: 'Convoying', url: '/actividad11/convoying', icon: FileText },
        { title: 'False Sharing', url: '/actividad11/false-sharing', icon: FileText },
        { title: 'Lost Wakeup', url: '/actividad11/lost-wakeup', icon: FileText },
      ],
    },
    {
      title: 'Actividad 12',
      url: '/actividad12',
      icon: Users,
    },
    {
      title: 'Actividad 13',
      url: '/actividad13',
      icon: Database,
    },
    {
      title: 'Actividad 14',
      url: '/actividad14',
      icon: Settings,
    },
  ],
}

export const sidebarData: SidebarData = {
  navGroups: [Actividades],
}
