class DatabaseManager {
  constructor() {
    this.storageKeys = {
      floors: 'managerplane-floors',
      devices: 'managerplane-devices',
      roomObjects: 'managerplane-roomObjects'
    };
    
    this.jsonFiles = {
      floors: '/src/data/floors.json',
      devices: '/src/data/devices.json',
      roomObjects: '/src/data/roomObjects.json'
    };
  }

  // Cargar entidad específica
  async loadEntity(entityName) {
    try {
      // 1. Intentar localStorage primero
      const stored = localStorage.getItem(this.storageKeys[entityName]);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data || parsed; // Compatibilidad con ambos formatos
      }

      // 2. Fallback: cargar JSON inicial
      const response = await fetch(this.jsonFiles[entityName]);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 3. Guardar en localStorage para próximas veces
      this.saveEntity(entityName, data);
      return data;
    } catch (error) {
      return []; // Retornar array vacío en caso de error
    }
  }

  // Guardar entidad específica
  saveEntity(entityName, data) {
    try {
      const dataWithMetadata = {
        data: data,
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      };
      
      localStorage.setItem(
        this.storageKeys[entityName], 
        JSON.stringify(dataWithMetadata)
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obtener entidad actual
  getEntity(entityName) {
    try {
      const stored = localStorage.getItem(this.storageKeys[entityName]);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data || parsed;
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  // Exportar entidad específica
  exportEntity(entityName) {
    const data = this.getEntity(entityName);
    const fileName = `${entityName}-${new Date().toISOString().split('T')[0]}.json`;
    
    this.downloadJSON(data, fileName);
  }

  // Exportar TODO
  exportAll() {
    const allData = {
      floors: this.getEntity('floors'),
      devices: this.getEntity('devices'),
      roomObjects: this.getEntity('roomObjects'),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const fileName = `manager-plane-backup-${new Date().toISOString().split('T')[0]}.json`;
    this.downloadJSON(allData, fileName);
  }

  // Importar desde archivo completo
  async importAll(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validar estructura
          if (this.validateImportData(data)) {
            // Guardar cada entidad
            this.saveEntity('floors', data.floors || []);
            this.saveEntity('devices', data.devices || []);
            this.saveEntity('roomObjects', data.roomObjects || []);
            
            resolve(data);
          } else {
            reject(new Error('Formato de archivo inválido'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.readAsText(file);
    });
  }

  // Importar entidad específica
  async importEntity(entityName, file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (Array.isArray(data)) {
            this.saveEntity(entityName, data);
            resolve(data);
          } else {
            reject(new Error('El archivo debe contener un array'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.readAsText(file);
    });
  }

  // Helpers privados
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  validateImportData(data) {
    return data && 
           (Array.isArray(data.floors) || data.floors === undefined) && 
           (Array.isArray(data.devices) || data.devices === undefined) && 
           (Array.isArray(data.roomObjects) || data.roomObjects === undefined);
  }

  // Limpiar todos los datos (para testing)
  clearAll() {
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Instancia singleton
export const dbManager = new DatabaseManager();