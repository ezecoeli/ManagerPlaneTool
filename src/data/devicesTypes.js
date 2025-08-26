import { BsEthernet, BsPrinter, BsLaptop, BsPcDisplay } from "react-icons/bs";
import { FaRegFloppyDisk } from "react-icons/fa6";

export const DEVICE_TYPES = {
  desktop: {
    icon: BsPcDisplay,
    name: "PC Escritorio",
    fields: ["name", "ram", "processor", "ip", "mac", "os", "network_port"]
  },
  laptop: {
    icon: BsLaptop,
    name: "Notebook",
    fields: ["name", "ram", "processor", "ip", "mac", "os", "network_port"]
  },
  network: {
    icon: BsEthernet,
    name: "Red",
    fields: ["name", "ram", "processor", "ip", "mac", "os", "network_port"]
  },
  printer: {
    icon: BsPrinter,
    name: "Impresora",
    fields: ["name", "model", "ip", "toner"]
  },
  others: {
    icon: FaRegFloppyDisk,
    name: "Otros Dispositivos",
    fields: ["name", "model", "ip", "network_port", "info"]
  },
};

export const DEVICE_STATUS = {
  active: { color: "#10b981", name: "Activo" },
  inactive: { color: "#6b7280", name: "Inactivo" },
  maintenance: { color: "#f59e0b", name: "Mantenimiento" },
  error: { color: "#ef4444", name: "Error" }
};