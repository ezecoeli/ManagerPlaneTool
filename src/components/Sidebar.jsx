import React, { useState } from 'react';
import { BsPlus, BsPlusCircle, BsChevronDown, BsChevronRight } from 'react-icons/bs';
import ModalSidebar from './ModalSidebar.jsx';
import { BiSolidChevronsRight, BiSolidChevronsLeft } from "react-icons/bi";

const Sidebar = ({
  currentFloor,
  currentZone,
  onFloorChange,
  onAddDevice,
  addFloor, 
  addZone,
  floors = [],
  collapsed = false,
  onToggleCollapse
}) => {
  const [expandedFloors, setExpandedFloors] = useState({
    [currentFloor]: true
  });

  // Estado para controlar la modal personalizada
  const [modal, setModal] = useState({ open: false, type: null });
  const [subZoneFloorId, setSubZoneFloorId] = useState(floors[0]?.id || '');

  // Abrir modal para zona principal
  const handleAddZone = () => setModal({ open: true, type: "zone" });

  // Abrir modal para sub-zona
  const handleAddSubZone = () => setModal({ open: true, type: "subzone" });

  // Confirmar desde modal
  const handleModalConfirm = (name) => {
    if (modal.type === "zone") {
      addFloor({ name });
    } else if (modal.type === "subzone" && subZoneFloorId) {
      addZone(subZoneFloorId, name);
    }
    setModal({ open: false, type: null });
  };

  // Cancelar modal
  const handleModalCancel = () => setModal({ open: false, type: null });

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

  // Actualiza el floorId seleccionado cuando cambia la lista de floors
  // o cuando se abre la modal de subzona para que siempre haya un valor válido..
  React.useEffect(() => {
    if (modal.open && modal.type === "subzone") {
      setSubZoneFloorId(floors[0]?.id || '');
    }
  }, [modal.open, modal.type, floors]);

  return (
    <div className="h-full flex flex-col bg-gray-300 dark:bg-gray-700 transition-colors duration-200">
      {/* Header del Sidebar */}
      <div className="flex justify-center items-center p-2 mb-2 mt-2"> 
        {!collapsed && (
          <h1 className="text-xl font-black ml-2 text-gray-800 dark:text-gray-100 flex-1">LISTADO DE ZONAS</h1>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center rounded-full h-8 w-8 bg-gray-400 dark:bg-gray-800 hover:bg-gray-500 dark:hover:bg-gray-600 transition-colors"
          title={collapsed ? "Mostrar Sidebar" : "Ocultar Sidebar"}
        >
          {collapsed
            ? <BiSolidChevronsRight className="w-5 h-5 text-gray-800 dark:text-gray-300" />
            : <BiSolidChevronsLeft className="w-5 h-5 text-gray-800 dark:text-gray-300" />
          }
        </button>
      </div>
      
      {/* Modal para añadir zona o sub-zona */}
      <ModalSidebar
        isOpen={modal.open}
        title={modal.type === "zone" ? "Añadir nueva zona" : "Añadir sub-zona"}
        label="Nombre:"
        placeholder={modal.type === "zone" ? "Escribe el nombre" : "Escribe el nombre"}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      >
        {/* Si es subzona muestra el selector de planta */}
        {modal.type === "subzone" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Añadir en:
            </label>
            <select
              value={subZoneFloorId}
              onChange={e => setSubZoneFloorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              {floors.map(floor => (
                <option key={floor.id} value={floor.id}>
                  {getDisplayName(floor.name)}
                </option>
              ))}
            </select>
          </div>
        )}
      </ModalSidebar>

      {/* Botones para añadir zona y sub-zona */}
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        {/* Añadir Zona */}
        <button
          onClick={handleAddZone}
          className={
            collapsed
              ? "w-full h-12 flex items-center justify-center bg-transparent text-[#478262] dark:text-teal-500 hover:bg-teal-800/10 dark:hover:bg-teal-500/10 transition-all"
              : "w-52 flex items-center justify-left px-4 py-2 space-x-6 bg-[#007b8b] text-white rounded-lg hover:bg-[#005d69] transition-all"
          }
          title="Añadir nueva zona"
        >
          <BsPlusCircle className={`transition-all ${collapsed ? 'w-7 h-7' : 'w-5 h-5'}`} />
          {!collapsed && <span className="ml-2">Añadir Zona</span>}
        </button>
        {/* Añadir Sub-zona */}
        <button
          onClick={handleAddSubZone}
          className={
            collapsed
              ? "w-full h-12 flex items-center justify-center bg-transparent text-rose-800 dark:text-rose-400 hover:bg-rose-900/10 dark:hover:bg-rose-500/10 transition-all"
              : "w-52 flex items-center justify-left px-4 py-2 space-x-6 bg-rose-800 text-white rounded-lg hover:bg-rose-950 transition-all"
          }
          title="Añadir sub-zona"
        >
          <BsPlusCircle className={`transition-all ${collapsed ? 'w-7 h-7' : 'w-5 h-5'}`} />
          {!collapsed && <span className="ml-2">Añadir Sub-zona</span>}
        </button>
      </div>

      {/* Lista de plantas y zonas  si no está colapsado */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto pt-2">
          <div className="space-y-2">
            {floors.map((floor) => (
              <div key={floor.id} className="dark:border-gray-700 rounded-lg bg-gray-400 dark:bg-gray-500/50 transition-colors duration-200">
                {/* Header zonas*/}
                <div className="w-full pl-2 pr-4 py-3 flex items-center justify-between text-left rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-medium flex rounded-lg w-full px-3 py-2 bg-[#007b8b] dark:text-white">
                      {getDisplayName(floor.name)}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleFloor(floor.id)}
                    className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title={expandedFloors[floor.id] ? "Colapsar" : "Expandir"}
                  >
                    {expandedFloors[floor.id] ? (
                      <BsChevronDown className="w-4 h-4 text-gray-800 dark:text-gray-300" />
                    ) : (
                      <BsChevronRight className="w-4 h-4 text-gray-800 dark:text-gray-300" />
                    )}
                  </button>
                </div>

                {/* Lista de zonas */}
                {expandedFloors[floor.id] && Array.isArray(floor.zones) && (
                  <div className="px-4 pb-3 ml-4 space-y-2">
                    {floor.zones.map((zone, zoneIndex) => {
                      const isActive = currentFloor === floor.id && currentZone === zone.id;
                      const zoneColorClass = getZoneColor(zoneIndex);
                      
                      return (
                        <button
                          key={zone.id}
                          onClick={() => onFloorChange(floor.id, zone.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                            isActive
                              ? `${zoneColorClass} ring-2 ring-rose-800`
                              : `bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border-2 border-rose-800`
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{getDisplayName(zone.name)}</span>
                            {isActive && (
                              <span className="text-xs bg-lime-600 text-white px-2 py-1 rounded-full">
                                
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
      )}

      {/* Espacio entre botones solo cuando no está colapsado */}
      {!collapsed && <div className="my-2" />}

      {/* Botón de añadir dispositivo */}
      <div
        className={`flex justify-center items-center border-t border-gray-400 ${!collapsed ? 'p-4' : ''}`}
      >
        <button
          onClick={onAddDevice}
          className={
            collapsed
              ? "w-full h-12 flex items-center justify-center bg-transparent text-blue-700 dark:text-blue-400 hover:bg-blue-900/10 dark:hover:bg-blue-500/10 transition-all"
              : "w-52 h-10 flex items-center justify-center px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded-lg transition-all"
          }
          title="Añadir nuevo dispositivo"
        >
          <BsPlusCircle className={`transition-all ${collapsed ? 'w-7 h-7' : 'w-5 h-5'}`} />
          {!collapsed && <span className="ml-2 whitespace-nowrap">Añadir Dispositivo</span>}
        </button>
        {(!currentFloor || !currentZone) && !collapsed && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Selecciona una zona primero
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;