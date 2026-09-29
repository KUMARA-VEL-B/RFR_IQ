// Lane and vessel vocabulary used by the UI selectors. No rates or market values.
export type Commodity = "Iron Ore" | "Coal" | "Limestone";
export type Origin = "Australia" | "Brazil" | "South Africa";
export type Destination = "Visakhapatnam" | "Gangavaram" | "Paradip" | "Dhamra";
export type VesselClass = "Handysize" | "Supramax" | "Capesize";

export const COMMODITIES: Commodity[] = ["Iron Ore", "Coal", "Limestone"];
export const ORIGINS: Origin[] = ["Australia", "Brazil", "South Africa"];
export const DESTINATIONS: Destination[] = ["Visakhapatnam", "Gangavaram", "Paradip", "Dhamra"];
export const VESSELS: VesselClass[] = ["Handysize", "Supramax", "Capesize"];
export const HORIZON_DAYS = [7, 30, 60, 90] as const;

// Shape a Stage 2 forecast series will need to provide to FreightChart.
export interface FreightPoint {
  day: number;
  label: string;
  date: string;
  historical?: number;
  forecast?: number;
  upper?: number;
  lower?: number;
}
