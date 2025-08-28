import { BsEthernet, BsPrinter, BsLaptop, BsPcDisplay } from "react-icons/bs";
import { FaRegFloppyDisk } from "react-icons/fa6";

export const DEVICE_TYPES = {
  desktop: {
    icon: BsPcDisplay,
    name: "PC Escritorio"
  },
  laptop: {
    icon: BsLaptop,
    name: "Notebook"
  },
  network: {
    icon: BsEthernet,
    name: "Red"
  },
  printer: {
    icon: BsPrinter,
    name: "Impresora"
  },
  others: {
    icon: FaRegFloppyDisk,
    name: "Otros Dispositivos"
  },
};

export const DEVICE_STATUS = {
  active: { color: "#10b981", name: "Activo" },
  inactive: { color: "#6b7280", name: "Inactivo" },
  maintenance: { color: "#f59e0b", name: "Mantenimiento" },
  error: { color: "#ef4444", name: "Error" }
};