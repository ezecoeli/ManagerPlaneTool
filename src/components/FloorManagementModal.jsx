import { useState } from 'react';
import ConfirmDeleteZoneModal from './ConfirmDeleteZoneModal.jsx';
import { BsBuildings, BsPin, BsPen, BsTrash } from "react-icons/bs";
import { SiOnlyoffice } from "react-icons/si";

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
  const [activeTab, setActiveTab] = useState('floors');
  const [editingFloor, setEditingFloor] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  const [newFloorName, setNewFloorName] = useState('');
  const [newZoneName, setNewZoneName] = useState('');
  const [selectedFloorForZone, setSelectedFloorForZone] = useState('');
  
  // Estados para confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteFloorName, setDeleteFloorName] = useState('');

  if (!isOpen) return null;

  const handleAddFloor = () => {
    if (newFloorName.trim()) {
      onAddFloor({ name: newFloorName.trim() });
      setNewFloorName('');
    }
  };

  const handleUpdateFloor = (floorId, newName) => {
    if (newName.trim()) {
      onUpdateFloor(floorId, { name: newName.trim() });
      setEditingFloor(null);
    }
  };

  const handleAddZone = () => {
    if (newZoneName.trim() && selectedFloorForZone) {
      onAddZone(selectedFloorForZone, newZoneName.trim());
      setNewZoneName('');
      setSelectedFloorForZone('');
    }
  };

  const handleUpdateZone = (floorId, zoneId, newName) => {
    if (newName.trim()) {
      onUpdateZone(floorId, zoneId, newName.trim());
      setEditingZone(null);
    }
  };

  // Funciones para manejar eliminación con confirmación
  const handleRequestDeleteFloor = (floor) => {
    setDeleteItem(floor);
    setDeleteType('floor');
    setDeleteFloorName('');
    setShowDeleteConfirm(true);
  };

  const handleRequestDeleteZone = (floor, zone) => {
    setDeleteItem(zone);
    setDeleteType('zone');
    setDeleteFloorName(floor.name);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'floor') {
      onDeleteFloor(deleteItem.id);
    } else if (deleteType === 'zone') {
      // Encontrar la planta que contiene esta zona
      const floor = floors.find(f => f.zones.some(z => z.id === deleteItem.id));
      if (floor) {
        onDeleteZone(floor.id, deleteItem.id);
      }
    }
    
    setShowDeleteConfirm(false);
    setDeleteItem(null);
    setDeleteType(null);
    setDeleteFloorName('');
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteItem(null);
    setDeleteType(null);
    setDeleteFloorName('');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-[600px] max-w-[90vw] max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <BsBuildings className="w-5 h-5" />
                <span>Gestión de Plantas y Zonas</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('floors')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'floors'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <SiOnlyoffice className="w-4 h-4" />
              <span>Plantas ({floors.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'zones'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BsPin className="w-4 h-4" />
              <span>Zonas ({floors.reduce((acc, floor) => acc + floor.zones.length, 0)})</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[500px]">
            {activeTab === 'floors' && (
              <div className="space-y-4">
                {/* Añadir nueva planta */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-3">Añadir Nueva Planta</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFloorName}
                      onChange={(e) => setNewFloorName(e.target.value)}
                      placeholder="Nombre de la planta"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFloor()}
                    />
                    <button
                      onClick={handleAddFloor}
                      disabled={!newFloorName.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                {/* Lista de plantas */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Plantas Existentes</h3>
                  {floors.map(floor => (
                    <div key={floor.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                          {editingFloor === floor.id ? (
                            <input
                              type="text"
                              defaultValue={floor.name}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onBlur={(e) => handleUpdateFloor(floor.id, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateFloor(floor.id, e.target.value);
                                } else if (e.key === 'Escape') {
                                  setEditingFloor(null);
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-800">{floor.name}</span>
                              <span className="text-xs text-gray-500">
                                ({floor.zones.length} zona{floor.zones.length !== 1 ? 's' : ''})
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setEditingFloor(floor.id)}
                            className="text-blue-800 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <BsPen />
                          </button>
                          {/* Botón con confirmación */}
                          <button
                            onClick={() => handleRequestDeleteFloor(floor)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar"
                            disabled={floors.length <= 1}
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'zones' && (
              <div className="space-y-4">
                {/* Añadir nueva zona */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-3">Añadir Nueva Zona</h3>
                  <div className="space-y-2">
                    <select
                      value={selectedFloorForZone}
                      onChange={(e) => setSelectedFloorForZone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecciona una planta</option>
                      {floors.map(floor => (
                        <option key={floor.id} value={floor.id}>{floor.name}</option>
                      ))}
                    </select>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newZoneName}
                        onChange={(e) => setNewZoneName(e.target.value)}
                        placeholder="Nombre de la zona"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddZone()}
                      />
                      <button
                        onClick={handleAddZone}
                        disabled={!newZoneName.trim() || !selectedFloorForZone}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de zonas por planta */}
                <div className="space-y-4">
                  {floors.map(floor => (
                    <div key={floor.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">{floor.name}</h3>
                      <div className="space-y-2">
                        {floor.zones.map(zone => (
                          <div key={zone.id} className="bg-gray-50 rounded p-2">
                            <div className="flex items-center justify-between space-x-2">
                              <div className="flex-1">
                                {editingZone === zone.id ? (
                                  <input
                                    type="text"
                                    defaultValue={zone.name}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                    onBlur={(e) => handleUpdateZone(floor.id, zone.id, e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleUpdateZone(floor.id, zone.id, e.target.value);
                                      } else if (e.key === 'Escape') {
                                        setEditingZone(null);
                                      }
                                    }}
                                    autoFocus
                                  />
                                ) : (
                                  <span className="text-gray-800">{zone.name}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setEditingZone(zone.id)}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Editar"
                                >
                                  <BsPen />
                                </button>
                                {/* Botón con confirmación */}
                                <button
                                  onClick={() => handleRequestDeleteZone(floor, zone)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Eliminar"
                                  disabled={floor.zones.length <= 1}
                                >
                                  <BsTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteZoneModal 
        isOpen={showDeleteConfirm}
        type={deleteType}
        item={deleteItem}
        floorName={deleteFloorName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default FloorManagementModal;