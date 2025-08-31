import { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import FloorManagementModal from './FloorManagementModal.jsx';
import DataManagement from './DataManagement.jsx'; 
import { useTheme } from '../hooks/useTheme.jsx';
import logo from '../assets/images/logo.png';
import logoWhite from '../assets/images/logo-white.png';
import { BsTools, BsMoon, BsSun } from "react-icons/bs";

const MainLayout = ({
  children,
  currentFloor,
  currentZone,
  onFloorChange,
  onAddDevice,
  floors,
  addFloor,
  updateFloor,
  deleteFloor,
  addZone,
  updateZone,
  deleteZone
}) => {
  const [showFloorManagement, setShowFloorManagement] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Ocultar sidebar automáticamente en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-gray-400 dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo y tema */}
            <div className="flex items-center justify-between w-full sm:w-auto">
              <img 
                src={theme === 'dark' ? logoWhite : logo}
                alt="Manager Plane Tool Logo" 
                className="object-contain h-12 w-auto sm:h-20 transition-all duration-200"
              />
            </div>
            {/* Botones de gestión */}
            <div className="
              flex flex-row gap-2
              sm:gap-4 sm:justify-end
              w-full sm:w-auto
              relative
            ">
              <DataManagement />
              <div className="flex-1 flex justify-end relative">
                <button
                  onClick={() => setShowFloorManagement(true)}
                  className="
                    px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg 
                    hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors 
                    flex items-center space-x-2
                    absolute right-0 top-0
                    sm:static
                  "
                  title="Gestionar tus planos"
                >
                  <span><BsTools /></span>
                  <span>Administrar Zonas</span>
                </button>
              </div>
              {/* Botón de cambio de tema */}
              <button
                onClick={toggleTheme}
                className={`
                  ml-2 sm:ml-6
                  relative p-2.5 rounded-xl transition-all duration-300 ease-in-out
                  transform hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                  ${theme === 'light' 
                    ? 'bg-gradient-to-br from-gray-600 to-black hover:from-blue-900 hover:to-indigo-800 border border-blue-200' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600'
                  }
                `}
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? (
                  <BsMoon className="w-5 h-5 text-gray-100 transition-colors duration-300" />
                ) : (
                  <BsSun className="w-5 h-5 text-yellow-400 transition-colors duration-300" />
                )}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 hover:opacity-20 transition-opacity duration-300
                  ${theme === 'light' 
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-500' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }
                `} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-14 min-w-[3.5rem]' : 'w-64 min-w-[16rem]'}`}>
          <Sidebar
            currentFloor={currentFloor}
            currentZone={currentZone}
            onFloorChange={onFloorChange}
            onAddDevice={onAddDevice}
            addFloor={addFloor}
            addZone={addZone}
            floors={floors}
            collapsed={sidebarCollapsed} 
            onToggleCollapse={() => setSidebarCollapsed(v => !v)} 
          />
        </div>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      
      <FloorManagementModal
        isOpen={showFloorManagement}
        floors={floors}
        onClose={() => setShowFloorManagement(false)}
        onAddFloor={addFloor}
        onUpdateFloor={updateFloor}
        onDeleteFloor={deleteFloor}
        onAddZone={addZone}
        onUpdateZone={updateZone}
        onDeleteZone={deleteZone}
      />
    </div>
  );
};

export default MainLayout;