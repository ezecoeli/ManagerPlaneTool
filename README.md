# Manager Plane Tool

Manager Plane Tool es una aplicación web desarrollada en React que permite la gestión visual y administrativa de planos, zonas, dispositivos y objetos en instalaciones.  
Fue pensada y creada para facilitar la organización y el control de los dispositivos informáticos en cualquier tipo de establecimiento, permitiendo a los usuarios dibujar, editar y exportar la información de sus planos de manera sencilla y eficiente.

---

## Stack Tecnológico

**Stack principal:** React 19 + Vite 7 + Tailwind CSS 3

### Librerías destacadas

| Librería | Uso |
|---|---|
| **react-konva / konva** | Canvas interactivo para el plano (zoom, pan, drag & drop) |
| **@dnd-kit** | Drag & Drop para objetos y dispositivos sobre el plano |
| **react-icons** | Sistema de iconos para tipos de dispositivos y UI |
| **uuid** | Generación de IDs únicos para dispositivos y zonas |
| **styled-components** | Estilos dinámicos en componentes puntuales |

---

## Características principales

- **Visualización de planos**: Navega entre diferentes plantas y zonas de una instalación con canvas interactivo.
- **Gestión de zonas y sub-zonas**: Añade, edita y elimina zonas y sub-zonas. Barra lateral con pestaña dedicada y buscador.
- **Listado de dispositivos en sidebar**: Pestaña DISPOSITIVOS con buscador por nombre y doble clic para ver el detalle completo.
- **Gestión de dispositivos**: Crea dispositivos con nombre, tipo (PC, Laptop, Red, Impresora, Otros), estado y propiedades personalizadas. Los asigna a una zona.
- **Drag & Drop avanzado**: Mueve dispositivos y objetos de layout sobre el plano con feedback visual.
- **Zoom y pan**: Navega por planos grandes con controles de zoom y desplazamiento.
- **Editor de layout**: Añade paredes, puertas y textos al plano desde la toolbar del canvas.
- **Modal de detalle de dispositivo**: Doble clic sobre un dispositivo o desde el listado para ver toda su información. Icono de lápiz para editar.
- **Exportación e importación de datos**: Descarga o carga un archivo JSON con toda la configuración de la instalación.
- **Modo oscuro**: Interfaz adaptable con soporte completo de tema claro/oscuro.
- **Despliegue en GitHub Pages**: Acceso público desde cualquier navegador.

---

## Tipos de dispositivos soportados

| Tipo | Icono |
|---|---|
| PC Escritorio | Monitor |
| Laptop | Portátil |
| Red | Ethernet |
| Impresora | Printer |
| Otros dispositivos | Genérico |

Cada dispositivo admite **propiedades personalizadas** (clave/valor) para registrar cualquier dato adicional.

---

## Estados de dispositivo

| Estado | Color |
|---|---|
| Activo | Verde |
| Inactivo | Negro |
| Mantenimiento | Amarillo |
| Error | Rojo |

---

## Exportación e importación de datos

- **Exportar**: Desde el menú de gestión de datos descarga un JSON con dispositivos, zonas y objetos del plano.
- **Importar**: Carga un archivo previamente exportado para restaurar toda la configuración.

---

## Contribución

Si deseas contribuir, por favor contáctame.  
¡Toda mejora es bienvenida!

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT.

---
