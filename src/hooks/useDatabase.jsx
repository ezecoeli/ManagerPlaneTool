import { useState, useEffect } from 'react';
import { dbManager } from '../data/databaseManager.js';

// Hook para floors
export const useFloors = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFloors();
  }, []);

  const loadFloors = async () => {
    try {
      setLoading(true);
      const data = await dbManager.loadEntity('floors');
      setFloors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveFloors = (newFloors) => {
    setFloors(newFloors);
    dbManager.saveEntity('floors', newFloors);
  };

  const addFloor = (floorData) => {
    const newFloor = {
      id: `planta-${Date.now()}`,
      name: floorData.name,
      zones: floorData.zones || [{ id: 'zona-principal', name: 'Zona Principal' }]
    };

    const updatedFloors = [...floors, newFloor];
    saveFloors(updatedFloors);
    return newFloor.id;
  };

  const updateFloor = (floorId, floorData) => {
    const updatedFloors = floors.map(floor =>
      floor.id === floorId ? { ...floor, ...floorData } : floor
    );
    saveFloors(updatedFloors);
  };

  const deleteFloor = (floorId) => {
    const updatedFloors = floors.filter(floor => floor.id !== floorId);
    saveFloors(updatedFloors);
  };

  const addZone = (floorId, zoneName) => {
    const newZone = {
      id: `zona-${Date.now()}`,
      name: zoneName
    };

    const updatedFloors = floors.map(floor =>
      floor.id === floorId
        ? { ...floor, zones: [...floor.zones, newZone] }
        : floor
    );

    saveFloors(updatedFloors);
    return newZone.id;
  };

  const updateZone = (floorId, zoneId, zoneName) => {
    const updatedFloors = floors.map(floor =>
      floor.id === floorId
        ? {
            ...floor,
            zones: floor.zones.map(zone =>
              zone.id === zoneId ? { ...zone, name: zoneName } : zone
            )
          }
        : floor
    );

    saveFloors(updatedFloors);
  };

  const deleteZone = (floorId, zoneId) => {
    const updatedFloors = floors.map(floor =>
      floor.id === floorId
        ? { ...floor, zones: floor.zones.filter(zone => zone.id !== zoneId) }
        : floor
    );

    saveFloors(updatedFloors);
  };

  return {
    floors,
    loading,
    error,
    addFloor,
    updateFloor,
    deleteFloor,
    addZone,
    updateZone,
    deleteZone,
    reload: loadFloors
  };
};

// Hook para devices
export const useDevicesDB = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await dbManager.loadEntity('devices');
      setDevices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveDevices = (newDevices) => {
    setDevices(newDevices);
    dbManager.saveEntity('devices', newDevices);
  };

  const addDevice = (newDevice) => {
    const deviceWithId = {
      ...newDevice,
      id: newDevice.id || `device-${Date.now()}`
    };
    
    const updatedDevices = [...devices, deviceWithId];
    saveDevices(updatedDevices);
  };

  const updateDevice = (id, updatedData) => {
    const updatedDevices = devices.map(device =>
      device.id === id ? { ...device, ...updatedData } : device
    );
    saveDevices(updatedDevices);
  };

  const updateDevicePosition = (id, position) => {
    updateDevice(id, { position });
  };

  const deleteDevice = (id) => {
    const updatedDevices = devices.filter(device => device.id !== id);
    saveDevices(updatedDevices);
  };

  return {
    devices,
    loading,
    error,
    addDevice,
    updateDevice,
    updateDevicePosition,
    deleteDevice,
    reload: loadDevices
  };
};

// Hook para roomObjects
export const useRoomObjectsDB = () => {
  const [roomObjects, setRoomObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRoomObjects();
  }, []);

  const loadRoomObjects = async () => {
    try {
      setLoading(true);
      const data = await dbManager.loadEntity('roomObjects');
      setRoomObjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveRoomObjects = (newRoomObjects) => {
    setRoomObjects(newRoomObjects);
    dbManager.saveEntity('roomObjects', newRoomObjects);
  };

  const addRoomObject = (newObject) => {
    const updatedObjects = [...roomObjects, newObject];
    saveRoomObjects(updatedObjects);
  };

  const updateRoomObject = (id, updatedData) => {
    const updatedObjects = roomObjects.map(obj =>
      obj.id === id ? { ...obj, ...updatedData } : obj
    );
    saveRoomObjects(updatedObjects);
  };

  const deleteRoomObject = (id) => {
    const updatedObjects = roomObjects.filter(obj => obj.id !== id);
    saveRoomObjects(updatedObjects);
  };

  return {
    roomObjects,
    loading,
    error,
    addRoomObject,
    updateRoomObject,
    deleteRoomObject,
    reload: loadRoomObjects
  };
};