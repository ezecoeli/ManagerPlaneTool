import { useState } from 'react';
import { dbManager } from '../data/databaseManager.js';
import { BiImport, BiExport } from "react-icons/bi";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { SiOnlyoffice } from "react-icons/si";
import { BsDeviceSsd, BsTrash } from "react-icons/bs";
import { IoHammerOutline } from "react-icons/io5";

const DataManagement = () => {
  const [importing, setImporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const handleExportAll = () => {
    try {
      dbManager.exportAll();
      setExportStatus('✅ Datos exportados correctamente');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('❌ Error al exportar: ' + error.message);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleImportAll = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    
    try {
      await dbManager.importAll(file);
      
      if (confirm('✅ Datos importados correctamente.\n¿Recargar la aplicación para aplicar los cambios?')) {
        window.location.reload();
      }
    } catch (error) {
      alert('❌ Error al importar: ' + error.message);
    } finally {
      setImporting(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleExportEntity = (entityName) => {
    try {
      dbManager.exportEntity(entityName);
      setExportStatus(`✅ ${entityName} exportado correctamente`);
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('❌ Error al exportar: ' + error.message);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Exportar todo */}
      <button 
        onClick={handleExportAll}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1"
        title="Exportar todos los datos"
      >
        <span><BiExport /></span>
        <span>Exportar Datos</span>
      </button>
      
      {/* Importar */}
      <label className="px-3 py-1 bg-green-700 text-white rounded text-sm hover:bg-green-600 cursor-pointer transition-colors flex items-center space-x-1">
        <span><BiImport /></span>
        <span>{importing ? 'Importando...' : 'Importar Datos'}</span>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleImportAll} 
          className="hidden"
          disabled={importing}
        />
      </label>

      {/* Dropdown para exportaciones específicas */}
      <div className="relative group">
        <button className="px-3 py-1 bg-orange-700 text-white rounded text-sm hover:bg-gray-600 transition-colors flex items-center space-x-1">
          <span><MdOutlineMiscellaneousServices /></span>
          <span>Avanzado</span>
          <span className="text-xs">▼</span>
        </button>
        
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <button
            onClick={() => handleExportEntity('floors')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <SiOnlyoffice /> Exportar Plantas
          </button>
          <button
            onClick={() => handleExportEntity('devices')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <BsDeviceSsd /> Exportar Dispositivos
          </button>
          <button
            onClick={() => handleExportEntity('roomObjects')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <IoHammerOutline /> Exportar Objetos
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={() => {
              if (confirm('⚠️ ¿Estás seguro de que quieres borrar TODOS los datos?\n\nEsta acción no se puede deshacer.')) {
                dbManager.clearAll();
                window.location.reload();
              }
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <BsTrash /> Limpiar Todo
          </button>
        </div>
      </div>

      {/* Status */}
      {exportStatus && (
        <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {exportStatus}
        </div>
      )}
    </div>
  );
};

export default DataManagement;