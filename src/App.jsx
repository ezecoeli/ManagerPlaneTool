import { useState, useEffect } from 'react';
import { useDevicesDB, useRoomObjectsDB, useFloors } from './hooks/useDatabase.jsx'; 
import { useObjectMovement } from './hooks/useObjectMovement.jsx';
import MainLayout from './components/MainLayout.jsx';
import Canvas from './components/Canvas.jsx';
import DeviceTypeSelector from './components/DeviceTypeSelector.jsx';
import DeviceInfoModal from './components/DeviceInfoModal.jsx';

import { FiMove } from 'react-icons/fi';

function App() {
  
  const { devices, loading: devicesLoading, addDevice, updateDevicePosition, deleteDevice } = useDevicesDB();
  const { roomObjects, loading: roomObjectsLoading, addRoomObject, updateRoomObject, deleteRoomObject } = useRoomObjectsDB();
  const { floors, loading: floorsLoading, addFloor, updateFloor, deleteFloor, addZone, updateZone, deleteZone } = useFloors();
  const { dragState, startDrag, updateDrag, endDrag, cancelDrag } = useObjectMovement();
  
  // Inicializar con null hasta que los datos se carguen
  const [currentFloor, setCurrentFloor] = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  
  // Estados para los modales
  const [showDeviceTypeSelector, setShowDeviceTypeSelector] = useState(false);
  const [showDeviceInfoModal, setShowDeviceInfoModal] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);

  // Efecto para inicializar ubicación con los primeros datos disponibles
  useEffect(() => {
    if (floors.length > 0 && !currentFloor) {
      const firstFloor = floors[0];
      const firstZone = firstFloor.zones.length > 0 ? firstFloor.zones[0] : null;
      
      if (firstZone) {
        setCurrentFloor(firstFloor.id);
        setCurrentZone(firstZone.id);
        console.log(`📍 Ubicación inicial: ${firstFloor.name} > ${firstZone.name}`);
      }
    }
  }, [floors, currentFloor]);

  // Validar que currentFloor y currentZone existan antes de filtrar
  const currentRoomObjects = roomObjects.filter(obj => 
    obj.floor === currentFloor && obj.zone === currentZone
  );

  const currentDevices = devices.filter(device => 
    device.floor === currentFloor && device.zone === currentZone
  );

  // detectar el tipo de objeto
  const isDevice = (object) => {
    return object.hasOwnProperty('status');
  };

  const isRoomObject = (object) => {
    return object.hasOwnProperty('size');
  };

  // Funciones de eliminación
  const handleDeleteObject = (object) => {
    if (isDevice(object)) {
      deleteDevice(object.id);
    } else if (isRoomObject(object)) {
      deleteRoomObject(object.id);
    }
  };

  // Función para actualizar posición de objetos de habitación
  const updateRoomObjectPosition = (objectId, newPosition) => {
    updateRoomObject(objectId, { position: newPosition });
  };

  // Eventos globales de mouse para el drag
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragState.isDragging) {
        updateDrag(e);
      }
    };

    const handleMouseUp = (e) => {
      if (dragState.isDragging) {
        endDrag((objectId, newPosition) => {
          const draggedObject = dragState.dragObject;
          
          if (isDevice(draggedObject)) {
            updateDevicePosition(objectId, newPosition);
          } else if (isRoomObject(draggedObject)) {
            updateRoomObject(objectId, { position: newPosition });
          }
        });
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && dragState.isDragging) {
        cancelDrag();
      }
    };

    // Agregar listeners globalmente
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dragState, updateDrag, endDrag, cancelDrag, updateDevicePosition, updateRoomObject]);

  const handleFloorChange = (floorId, zoneId) => {
    setCurrentFloor(floorId);
    setCurrentZone(zoneId);
  };

  const handleAddDevice = () => {
    setShowDeviceTypeSelector(true);
  };

  const handleDeviceTypeSelect = (deviceType) => {
    setSelectedDeviceType(deviceType);
    setShowDeviceTypeSelector(false);
    setShowDeviceInfoModal(true);
  };

  const handleDeviceSave = (newDevice) => {
    const randomX = Math.random() * 400 + 200;
    const randomY = Math.random() * 300 + 200;
    
    const deviceWithPosition = {
      ...newDevice,
      position: { x: randomX, y: randomY }
    };
    
    addDevice(deviceWithPosition);
    setShowDeviceInfoModal(false);
    setSelectedDeviceType(null);
  };

  const handleModalCancel = () => {
    setShowDeviceTypeSelector(false);
    setShowDeviceInfoModal(false);
    setSelectedDeviceType(null);
  };

  // Considerar todos los loadings
  const loading = devicesLoading || roomObjectsLoading || floorsLoading;

  // Mostrar loading hasta  ubicación válida
  if (loading || !currentFloor || !currentZone) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Cargando aplicación...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MainLayout
        currentFloor={currentFloor}
        currentZone={currentZone}
        onFloorChange={handleFloorChange}
        onAddDevice={handleAddDevice}
        floors={floors}
        addFloor={addFloor}
        updateFloor={updateFloor}
        deleteFloor={deleteFloor}
        addZone={addZone}
        updateZone={updateZone}
        deleteZone={deleteZone}
      >
        <Canvas
          devices={currentDevices}
          roomObjects={currentRoomObjects}
          floorId={currentFloor}
          zoneId={currentZone}
          onStartDrag={startDrag}
          onAddRoomObject={addRoomObject}
          onUpdateRoomObject={updateRoomObjectPosition} 
          onDeleteObject={handleDeleteObject}
          dragState={dragState}
        />
      </MainLayout>

      {/* VISTA PREVIA DE ARRASTRE */}
      {dragState.isDragging && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragState.currentPos.x - 20,
            top: dragState.currentPos.y - 20,
            transform: 'scale(1.1)',
            opacity: 0.9
          }}
        >
          <div className={`w-10 h-10 rounded-lg border-2 border-white shadow-lg flex items-center justify-center ${
            isRoomObject(dragState.dragObject) ? 'bg-purple-500' : 'bg-blue-500'
          }`}>
            <FiMove className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {/* Modales */}
      {showDeviceTypeSelector && (
        <DeviceTypeSelector
          onSelectType={handleDeviceTypeSelect}
          onCancel={handleModalCancel}
        />
      )}

      {showDeviceInfoModal && selectedDeviceType && (
        <DeviceInfoModal
          deviceType={selectedDeviceType}
          currentFloor={currentFloor}
          currentZone={currentZone}
          onSave={handleDeviceSave}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
}

export default App;