import { useState } from 'react';
import { BsPlus, BsChevronDown, BsChevronRight } from 'react-icons/bs';

const Sidebar = ({ currentFloor, currentZone, onFloorChange, onAddDevice, floors = [] }) => {
  const [expandedFloors, setExpandedFloors] = useState({
    [currentFloor]: true
  });

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

  // Función para obtener el nombre de forma segura
  const getDisplayName = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.name || 'Sin nombre';
    }
    return 'Sin nombre';
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
      {/* Header del Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Zonas y sub-zonas</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Selecciona donde trabajar</p>
      </div>

      {/* Lista de plantas y zonas */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {floors.map((floor) => (
            <div key={floor.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors duration-200">
              {/* Header de la planta */}
              <button
                onClick={() => toggleFloor(floor.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100">
                    {getDisplayName(floor.name)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Array.isArray(floor.zones) ? floor.zones.length : 0} sub-zona{(Array.isArray(floor.zones) ? floor.zones.length : 0) !== 1 ? 's' : ''}
                  </p>
                </div>
                {expandedFloors[floor.id] ? (
                  <BsChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <BsChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>

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
                            : `bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-600`
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
          <BsPlus className="w-5 h-5" />
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