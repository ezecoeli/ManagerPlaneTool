import { useState } from 'react';
import { SiOnlyoffice } from "react-icons/si";

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
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#f97316', // orange
    ];
    return colors[zoneIndex % colors.length];
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white border-r-2 border-gray-200 shadow-lg">
      {/* Add Device Button */}
      <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <button
          onClick={onAddDevice}
          className="w-full bg-[#1288d7] text-white p-1 rounded-lg hover:bg-blue-700 hover:shadow-md transform hover:scale-105 flex items-center justify-center transition-all duration-200 shadow-sm border border-blue-600"
        >
          <span className="text-xl mr-2">+</span>
          Añadir Dispositivo
        </button>
      </div>

      {/* Navigation con datos dinámicos */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 border-b border-gray-200 pb-2">
            Planta/Zona
          </h2>
          {floors.map(floor => (
            <div key={floor.id} className="mb-2">
              <button
                onClick={() => toggleFloor(floor.id)}
                className={`w-full text-left p-2 rounded-md transition-all duration-200 border flex items-center ${
                  currentFloor === floor.id 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium border-blue-200 shadow-sm' 
                    : 'hover:bg-gray-100 border-transparent hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <SiOnlyoffice 
                  className={`mr-2 transition-transform duration-200 ${
                    expandedFloors[floor.id] ? 'rotate-0' : '-rotate-90'
                  } ${currentFloor === floor.id ? 'text-blue-600' : 'text-gray-500'}`}
                  size={16}
                />
                {floor.name}
              </button>
              {expandedFloors[floor.id] && (
                <div className="ml-4 space-y-1 mt-1 pl-2 border-l-2 border-gray-200">
                  {floor.zones.map((zone, zoneIndex) => (
                    <button
                      key={zone.id}
                      onClick={() => onFloorChange(floor.id, zone.id)}
                      className={`block w-full text-left p-2 text-sm rounded transition-all duration-200 border ${
                        currentFloor === floor.id && currentZone === zone.id
                          ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium border-blue-300 shadow-sm transform scale-105'
                          : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2 border border-white shadow-sm"
                        style={{ backgroundColor: getZoneColor(zoneIndex) }}
                      />
                      {zone.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;