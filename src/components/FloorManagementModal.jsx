import { useState } from 'react';
import ConfirmDeleteZoneModal from './ConfirmDeleteZoneModal.jsx';
import { BsPlus, BsTrash, BsPencil, BsBuilding, BsGrid } from 'react-icons/bs';

const FloorManagementModal = ({ 
  isOpen, 
  floors, 
  onClose, 
  onAddFloor, 
  onUpdateFloor, 
  onDeleteFloor,
  onAddZone,
  onUpdateZone,
  onDeleteZone
}) => {
  const [newFloorName, setNewFloorName] = useState('');
  const [newZoneNames, setNewZoneNames] = useState({});
  const [editingFloor, setEditingFloor] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: null, item: null });

  if (!isOpen) return null;

  // Función para obtener el nombre
  const getDisplayName = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.name || 'Sin nombre';
    }
    return 'Sin nombre';
  };

  const handleAddFloor = () => {
    if (newFloorName.trim()) {
      onAddFloor({ name: newFloorName.trim() });
      setNewFloorName('');
    }
  };

  const handleAddZone = (floorId) => {
    const zoneName = newZoneNames[floorId]?.trim();
    if (zoneName) {
      onAddZone(floorId, { name: zoneName });
      setNewZoneNames(prev => ({ ...prev, [floorId]: '' }));
    }
  };

  const handleDeleteRequest = (type, item, floorId = null) => {
    setDeleteModal({ show: true, type, item, floorId });
  };

  const handleConfirmDelete = () => {
    const { type, item, floorId } = deleteModal;
    
    if (type === 'floor') {
      onDeleteFloor(item.id);
    } else if (type === 'zone') {
      onDeleteZone(floorId, item.id);
    }
    
    setDeleteModal({ show: false, type: null, item: null });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transition-colors duration-200">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <BsBuilding className="w-6 h-6 mr-2" />
                Gestión de Zonas
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Panel izquierdo - Añadir nueva planta */}
            <div className="w-1/3 bg-gray-50 dark:bg-gray-700 p-6 border-r border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
                Añadir Nueva
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={newFloorName}
                    onChange={(e) => setNewFloorName(e.target.value)}
                    placeholder="Ej: Planta 1, Sala 4, etc."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFloor()}
                  />
                </div>
                
                <button
                  onClick={handleAddFloor}
                  disabled={!newFloorName.trim()}
                  className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                  <BsPlus className="w-4 h-4" />
                  <span>Crear Zona</span>
                </button>
              </div>
            </div>

            {/* Panel derecho - Lista de zonas existentes */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
                Zonas y sub-zonas Existentes ({floors.length})
              </h3>

              {floors.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <BsBuilding className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay zonas configuradas</p>
                  <p className="text-sm mt-1">Crea tu primera zona para empezar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {floors.map((floor) => (
                    <div key={floor.id} className="border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 transition-colors duration-200">
                      {/* Header de la planta */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <BsBuilding className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            {editingFloor === floor.id ? (
                              <input
                                type="text"
                                defaultValue={getDisplayName(floor.name)}
                                onBlur={(e) => {
                                  if (e.target.value.trim() && e.target.value !== getDisplayName(floor.name)) {
                                    onUpdateFloor(floor.id, { name: e.target.value.trim() });
                                  }
                                  setEditingFloor(null);
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur();
                                  }
                                }}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                autoFocus
                              />
                            ) : (
                              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                {getDisplayName(floor.name)}
                              </h4>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({Array.isArray(floor.zones) ? floor.zones.length : 0} sub-zona{(Array.isArray(floor.zones) ? floor.zones.length : 0) !== 1 ? 's' : ''})
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingFloor(floor.id)}
                              className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="Editar nombre"
                            >
                              <BsPencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRequest('floor', floor)}
                              className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Eliminar planta"
                            >
                              <BsTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Subzonas*/}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <BsGrid className="w-4 h-4 mr-2" />
                            Sub-zonas actuales
                          </h5>
                        </div>

                        {/* Lista de sub-zonas */}
                        {Array.isArray(floor.zones) && (
                          <div className="space-y-2 mb-4">
                            {floor.zones.map((zone) => (
                              <div key={zone.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                {editingZone === zone.id ? (
                                  <input
                                    type="text"
                                    defaultValue={getDisplayName(zone.name)}
                                    onBlur={(e) => {
                                      if (e.target.value.trim() && e.target.value !== getDisplayName(zone.name)) {
                                        onUpdateZone(floor.id, zone.id, { name: e.target.value.trim() });
                                      }
                                      setEditingZone(null);
                                    }}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.target.blur();
                                      }
                                    }}
                                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">
                                    {getDisplayName(zone.name)}
                                  </span>
                                )}
                                
                                <div className="flex items-center space-x-1 ml-2">
                                  <button
                                    onClick={() => setEditingZone(zone.id)}
                                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="Editar zona"
                                  >
                                    <BsPencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRequest('zone', zone, floor.id)}
                                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    title="Eliminar zona"
                                  >
                                    <BsTrash className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Añadir nueva sub-zona */}
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newZoneNames[floor.id] || ''}
                            onChange={(e) => setNewZoneNames(prev => ({
                              ...prev,
                              [floor.id]: e.target.value
                            }))}
                            placeholder="Nombre de la sub-zona"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddZone(floor.id)}
                          />
                          <button
                            onClick={() => handleAddZone(floor.id)}
                            disabled={!newZoneNames[floor.id]?.trim()}
                            className="px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded text-sm hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors duration-200"
                          >
                            <BsPlus className="w-3 h-3" />
                            <span>Crear sub-zona</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteZoneModal
        isOpen={deleteModal.show}
        type={deleteModal.type}
        item={deleteModal.item}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ show: false, type: null, item: null })}
      />
    </>
  );
};

export default FloorManagementModal;