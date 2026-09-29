// Legitimate East Coast India vessel availability service
// Since free, verified live AIS and port lineup feeds are not publicly accessible for Indian waters without commercial subscriptions,
// this service truthfully returns UNAVAILABLE rather than fabricating positions or queues.

export type VesselAvailabilityStatus = "UNAVAILABLE";

export type PortVesselTelemetry = {
  portKey: string;
  portName: string;
  availability: VesselAvailabilityStatus;
  message: string;
};

export type VesselState =
  | { status: "loading" }
  | { status: "unavailable"; message: string };

export function useLiveVesselAvailability(portKey: string | null | undefined): VesselState {
  if (!portKey) {
    return { status: "unavailable", message: "No destination port selected" };
  }
  return {
    status: "unavailable",
    message: "Live vessel tracking unavailable for this region.",
  };
}

export function getAllPortsVesselData(): Record<string, PortVesselTelemetry> {
  return {};
}
