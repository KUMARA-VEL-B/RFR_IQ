// East coast port identities and schematic map positions only. No operational metrics.
export interface PortInfo {
  id: string;
  name: string;
  state: string;
  x: number;
  y: number;
}

export const PORTS: PortInfo[] = [
  { id: "haldia", name: "Haldia", state: "West Bengal", x: 78, y: 12 },
  { id: "paradip", name: "Paradip", state: "Odisha", x: 62, y: 42 },
  { id: "dhamra", name: "Dhamra", state: "Odisha", x: 70, y: 58 },
  { id: "gopalpur", name: "Gopalpur", state: "Odisha", x: 52, y: 78 },
  { id: "vizag", name: "Visakhapatnam", state: "Andhra Pradesh", x: 44, y: 108 },
  { id: "gangavaram", name: "Gangavaram", state: "Andhra Pradesh", x: 36, y: 128 },
];
