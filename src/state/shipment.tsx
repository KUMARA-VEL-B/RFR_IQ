import { createContext, useContext, useState, type ReactNode } from "react";
import type { Level, Market } from "../domain/decision";

export type Shipment = { cargo: string; quantity: string; origin: string; destination: string; deliveryPressure: Level; marketScenario: Market; weatherScenario: "LIVE" | "HIGH" };
const init: Shipment = { cargo: "Coking Coal", quantity: "75000", origin: "Australia", destination: "visakhapatnam", deliveryPressure: "NORMAL", marketScenario: "BASE", weatherScenario: "LIVE" };
const Ctx = createContext<{ s: Shipment; set: (p: Partial<Shipment>) => void }>({ s: init, set: () => {} });

export function ShipmentProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState(init);
  return <Ctx.Provider value={{ s, set: (p) => setS((o) => ({ ...o, ...p })) }}>{children}</Ctx.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const useShipment = () => useContext(Ctx);
