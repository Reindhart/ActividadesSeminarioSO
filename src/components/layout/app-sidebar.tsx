import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { sidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className='bg-gray-50' collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-1'>
          <div className='flex size-8 items-center justify-center rounded-lg bg-gray-950 text-gray-50'>
            <span className='text-sm font-bold'>SO</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold'>Seminario SO</span>
            <span className='text-xs text-gray-600'>Actividades React</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => {
          if (!props.title || !props.items) return null
          return <NavGroup key={props.title} {...props} />
        })}
      </SidebarContent>
      <SidebarFooter>
        <div className='px-2 py-1'>
          <p className='text-xs text-gray-500'>© 2025 Joan Alejandro Piña Puga</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
