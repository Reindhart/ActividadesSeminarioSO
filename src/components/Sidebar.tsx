import { Link, useRouterState } from '@tanstack/react-router';

export default function Sidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  // Cambiamos la ruta de inicio a /ActividadesSeminarioSO
  const HOME_PATH = '/ActividadesSeminarioSO';

  const isActive = (path: string) => currentPath === path || (path === HOME_PATH && currentPath === '/');
  
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        {/* Título del sidebar */}
        <div className="mb-4">
          <h2 className="text-xl font-bold px-4">Actividades tilin</h2>
          <p className="text-xs px-4 mt-1 opacity-70">Seminario SO</p>
        </div>
        
        <ul className="menu-vertical gap-2">
          {/* Botón de Inicio - solo se muestra si no estamos en la página de inicio */}
          {currentPath !== HOME_PATH && (
            <li>
              <Link
                to="/ActividadesSeminarioSO"
                className={isActive(HOME_PATH) ? 'active' : ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Inicio
              </Link>
            </li>
          )}
          
          <div className="divider my-1"></div>
          
          {/* Actividad 11 */}
          <li>
            <Link
              to="/ActividadesSeminarioSO/actividad11"
              className={isActive('/ActividadesSeminarioSO/actividad11') ? 'active' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Actividad 11
            </Link>
          </li>
          
          {/* Actividad 12 */}
          <li>
            <Link
              to="/ActividadesSeminarioSO/actividad12"
              className={isActive('/ActividadesSeminarioSO/actividad12') ? 'active' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Actividad 12
            </Link>
          </li>
          
          {/* Actividad 13 */}
          <li>
            <Link
              to="/ActividadesSeminarioSO/actividad13"
              className={`${isActive('/ActividadesSeminarioSO/actividad13') ? 'active' : ''} btn-disabled`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Actividad 13
            </Link>
          </li>
          
          {/* Actividad 14 */}
          <li>
            <Link
              to="/ActividadesSeminarioSO/actividad14"
              className={isActive('/ActividadesSeminarioSO/actividad14') ? 'active' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Actividad 14
            </Link>
          </li>
        </ul>
        
        {/* Footer del sidebar */}
        <div className="mt-auto pt-4 border-t border-base-300">
          <p className="text-xs px-4 opacity-50">© 2025 Joan Alejandro Piña Puga</p>
        </div>
      </div>
    </div>
  );
}
