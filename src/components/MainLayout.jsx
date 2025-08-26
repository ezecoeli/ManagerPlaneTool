import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import FloorManagementModal from './FloorManagementModal.jsx';
import DataManagement from './DataManagement.jsx'; 
import { useFloors } from '../hooks/useDatabase.jsx'; 
import logo from '../assets/images/icon.png';
import { BsTools } from "react-icons/bs";


const MainLayout = ({ children, currentFloor, currentZone, onFloorChange, onAddDevice }) => {
  const [showFloorManagement, setShowFloorManagement] = useState(false);
  
  
  const {
    floors,
    loading,
    addFloor,
    updateFloor,
    deleteFloor,
    addZone,
    updateZone,
    deleteZone
  } = useFloors();

  // loading mientras cargan los datos de plantas/zonas
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <img 
            src={logo} 
            alt="Manager Plane Tool" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <div className="text-lg text-gray-600">Cargando configuración...</div>
          <div className="text-sm text-gray-500 mt-2">Plantas y zonas</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/*  Header con logo */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Título */}
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Manager Plane Tool Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-800">ManagerPlaneTool</h1>
            </div>
            
            {/* Controles de datos + gestión */}
            <div className="flex items-center space-x-4">
              <DataManagement />
              
              <button
                onClick={() => setShowFloorManagement(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                title="Gestionar plantas y zonas"
              >
                <span><BsTools /></span>
                <span>Crear/Modificar Zonas</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout principal con sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r shadow-sm">
          <Sidebar
            currentFloor={currentFloor}
            currentZone={currentZone}
            onFloorChange={onFloorChange}
            onAddDevice={onAddDevice}
            floors={floors}
          />
        </div>

        {/* Contenido principal */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Modal de gestión de plantas/zonas */}
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