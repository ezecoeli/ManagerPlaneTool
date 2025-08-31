import { useState } from 'react';
import { dbManager } from '../data/databaseManager.js';
import { BsDatabase, BsDownload, BsUpload, BsTrash, BsFileEarmarkText } from 'react-icons/bs';
import { createPortal } from 'react-dom';

const DataManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const handleExportAll = () => {
    try {
      dbManager.exportAll();
      setExportStatus('Exportación exitosa');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('Error en la exportación');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleImportAll = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      await dbManager.importAll(file);
      setExportStatus('Importación exitosa - Recarga la página');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setExportStatus('Error en la importación');
      setTimeout(() => setExportStatus(''), 3000);
    }
    setImporting(false);
    event.target.value = '';
  };

  const handleExportEntity = (entityName) => {
    try {
      dbManager.exportEntity(entityName);
      setExportStatus(`${entityName} exportado exitosamente`);
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus(`Error al exportar ${entityName}`);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center space-x-2"
        title="Gestión de datos"
      >
        <BsDatabase className="w-4 h-4" />
        <span>Exportar / Importar</span>
      </button>

      {showModal && createPortal(
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors duration-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                  <BsDatabase className="w-6 h-6 mr-2" />
                  Gestión de Datos
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Exportar/Importar todo */}
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-300 dark:bg-gray-700 transition-colors duration-200">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                    Copia de Seguridad Completa:
                  </h3>
                  <div className="space-y-3">
                    {/* Exportar Todo */}
                    <button
                      onClick={handleExportAll}
                      className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <BsDownload className="w-4 h-4" />
                      <span>Exportar Todo</span>
                    </button>
                    {/* Importar Todo */}
                    <div className="relative w-full">
                      <label className="w-full cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportAll}
                          disabled={importing}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <BsUpload className="w-4 h-4" />
                        <span>{importing ? 'Importando...' : 'Importar Todo'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Exportaciones individuales */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                    Exportar por Categoría:
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleExportEntity('devices')}
                      className="px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <BsFileEarmarkText className="w-4 h-4" />
                      <span>Dispositivos</span>
                    </button>
                    
                    <button
                      onClick={() => handleExportEntity('roomObjects')}
                      className="px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <BsFileEarmarkText className="w-4 h-4" />
                      <span>Objetos de Habitación</span>
                    </button>
                    
                    <button
                      onClick={() => handleExportEntity('floors')}
                      className="px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <BsFileEarmarkText className="w-4 h-4" />
                      <span>Zonas y sub-zonas</span>
                    </button>
                  </div>
                </div>

                {/* Status */}
                {exportStatus && (
                  <div className={`p-3 rounded-lg text-sm ${
                    exportStatus.includes('Error') 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  } transition-colors duration-200`}>
                    {exportStatus}
                  </div>
                )}
              </div>

              {/* Botón cerrar */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DataManagement;