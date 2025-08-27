import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import FloorManagementModal from './FloorManagementModal.jsx';
import DataManagement from './DataManagement.jsx'; 
import { useTheme } from '../hooks/useTheme.jsx';
import logo from '../assets/images/icon.png';
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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Manager Plane Tool Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                ManagerPlaneTool
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Botón de cambio de tema */}
              <button
                onClick={toggleTheme}
                className={`
                  relative p-3 rounded-xl transition-all duration-300 ease-in-out
                  transform hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                  ${theme === 'light' 
                    ? 'bg-gradient-to-br from-gray-600 to-black hover:from-blue-900 hover:to-indigo-800 border border-blue-200' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600'
                  }
                `}
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {/* Icono colores  */}
                {theme === 'light' ? (
                  <BsMoon className="w-5 h-5 text-gray-100 transition-colors duration-300" />
                ) : (
                  <BsSun className="w-5 h-5 text-yellow-400 transition-colors duration-300" />
                )}
                
                {/* Efecto de brillo */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 hover:opacity-20 transition-opacity duration-300
                  ${theme === 'light' 
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-500' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }
                `} />
              </button>

              <DataManagement />
              
              <button
                onClick={() => setShowFloorManagement(true)}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                title="Gestionar plantas y zonas"
              >
                <span><BsTools /></span>
                <span>Crear/Modificar Zonas</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
          <Sidebar
            currentFloor={currentFloor}
            currentZone={currentZone}
            onFloorChange={onFloorChange}
            onAddDevice={onAddDevice}
            floors={floors}
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