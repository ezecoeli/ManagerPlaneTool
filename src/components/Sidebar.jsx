import { useState } from 'react';
import { BsPlus, BsPlusCircle, BsChevronDown, BsChevronRight } from 'react-icons/bs';
import ModalSidebar from './ModalSidebar.jsx';

const Sidebar = ({
  currentFloor,
  currentZone,
  onFloorChange,
  onAddDevice,
  addFloor, 
  addZone,
  floors = []
}) => {
  const [expandedFloors, setExpandedFloors] = useState({
    [currentFloor]: true
  });

  // Estado para controlar la modal personalizada
  const [modal, setModal] = useState({ open: false, type: null, floorId: null });

  // Abrir modal para zona principal
  const handleAddZone = () => setModal({ open: true, type: "zone", floorId: null });

  // Abrir modal para sub-zona
  const handleAddSubZone = (floorId) => setModal({ open: true, type: "subzone", floorId });

  // Confirmar desde modal
  const handleModalConfirm = (name) => {
    if (modal.type === "zone") {
      addFloor({ name });
    } else if (modal.type === "subzone" && modal.floorId) {
      addZone(modal.floorId, name);
    }
    setModal({ open: false, type: null, floorId: null });
  };

  // Cancelar modal
  const handleModalCancel = () => setModal({ open: false, type: null, floorId: null });

  const toggleFloor = (floorId) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorId]: !prev[floorId]
    }));
  };

  // Generar colores para las zonas dinámicamente
  const getZoneColor = (zoneIndex) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
      'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
    ];
    return colors[zoneIndex % colors.length];
  };

  const getDisplayName = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.name || 'Sin nombre';
    }
    return 'Sin nombre';
  };

  return (
    <div className="h-full flex flex-col bg-gray-200 dark:bg-gray-700 transition-colors duration-200">
      {/* Header del Sidebar */}
      <div className="justify-center p-3 flex items-center">
        <h1 className="text-xl font-black text-gray-800 dark:text-gray-100">ZONAS DISPONIBLES</h1>
      </div>
      
      {/* Modal para añadir zona o sub-zona */}
      <ModalSidebar
        isOpen={modal.open}
        title={modal.type === "zone" ? "Añadir nueva zona" : "Añadir sub-zona"}
        label="Nombre:"
        placeholder={modal.type === "zone" ? "Escribe el nombre" : "Escribe el nombre"}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      {/* Lista de plantas y zonas */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {floors.map((floor) => (
            <div key={floor.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-300 dark:bg-gray-500/50 transition-colors duration-200">
              {/* Header zonas*/}
              <div className="w-full px-4 py-3 flex items-center justify-between text-left rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium flex rounded-lg w-full px-3 py-2 bg-teal-800 dark:text-white">
                    {getDisplayName(floor.name)}
                  </h3>
                  <button
                    onClick={() => handleAddSubZone(floor.id)}
                    className="p-1 rounded-full bg-rose-500 text-white hover:bg-gray-900 transition-colors"
                    title="Añadir sub-zona"
                  >
                    <BsPlus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => toggleFloor(floor.id)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title={expandedFloors[floor.id] ? "Colapsar" : "Expandir"}
                >
                  {expandedFloors[floor.id] ? (
                    <BsChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                  ) : (
                    <BsChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                  )}
                </button>
              </div>

              {/* Lista de zonas */}
              {expandedFloors[floor.id] && Array.isArray(floor.zones) && (
                <div className="px-4 pb-3 space-y-2">
                  {floor.zones.map((zone, zoneIndex) => {
                    const isActive = currentFloor === floor.id && currentZone === zone.id;
                    const zoneColorClass = getZoneColor(zoneIndex);
                    
                    return (
                      <button
                        key={zone.id}
                        onClick={() => onFloorChange(floor.id, zone.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          isActive
                            ? `${zoneColorClass} ring-2 ring-blue-500 dark:ring-blue-400`
                            : `bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border-2 border-rose-500`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{getDisplayName(zone.name)}</span>
                          {isActive && (
                            <span className="text-xs bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-full">
                              
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botón para añadir nueva zona */}
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleAddZone}
            className="w-full flex items-center justify-center px-4 py-2 mt-2 bg-teal-800 text-white rounded-lg hover:bg-teal-600 transition-colors"
            title="Añadir nueva zona"
          >
            <BsPlusCircle className="w-5 h-5 mr-2" />
            <span>Añadir Zona</span>
          </button>
        </div>

        {/* Mensaje si no hay plantas */}
        {floors.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No hay plantas configuradas</p>
            <p className="text-xs mt-1">Usa "Crear/Modificar Zonas" para empezar</p>
          </div>
        )}
      </div>

      {/* Botón de añadir dispositivo */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onAddDevice}
          className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
          disabled={!currentFloor || !currentZone}
        >
          <BsPlusCircle className="w-5 h-5" />
          <span>Añadir Dispositivo</span>
        </button>
        
        {(!currentFloor || !currentZone) && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Selecciona una zona primero
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;