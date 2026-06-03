"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Lead } from "@/types/lead";

const PRIMARY = "#0058be";
const NEUTRAL = "#727785";
const SUCCESS = "#006c49";

const buildIcon = (color: string) =>
  L.divIcon({
    className: "maplead-pin",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 24 30" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));">
      <path fill="${color}" d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 18 12 18s12-9.5 12-18C24 5.373 18.627 0 12 0z"/>
      <circle cx="12" cy="12" r="4.5" fill="#fff"/>
    </svg>`,
    iconSize: [32, 40],
    iconAnchor: [16, 38],
    popupAnchor: [0, -34],
  });

const ICON_DEFAULT = buildIcon(NEUTRAL);
const ICON_ACTIVE = buildIcon(PRIMARY);
const ICON_VERIFIED = buildIcon(SUCCESS);

function FitBounds({ leads }: { leads: Lead[] }) {
  const map = useMap();
  useEffect(() => {
    const points = leads
      .filter((l) => l.latitude && l.longitude)
      .map((l) => [l.latitude!, l.longitude!] as [number, number]);
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [leads, map]);
  return null;
}

function FlyToSelected({
  lead,
}: {
  lead?: Lead;
}) {
  const map = useMap();
  useEffect(() => {
    if (lead?.latitude && lead?.longitude) {
      map.flyTo([lead.latitude, lead.longitude], 15, { duration: 0.6 });
    }
  }, [lead, map]);
  return null;
}

export interface ResultsMapProps {
  leads: Lead[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export default function ResultsMap({
  leads,
  selectedId,
  onSelect,
}: ResultsMapProps) {
  const center = useMemo<[number, number]>(() => {
    const withCoords = leads.filter((l) => l.latitude && l.longitude);
    if (withCoords.length === 0) return [37.7749, -122.4194]; // SF default
    const lat =
      withCoords.reduce((s, l) => s + (l.latitude ?? 0), 0) / withCoords.length;
    const lng =
      withCoords.reduce((s, l) => s + (l.longitude ?? 0), 0) /
      withCoords.length;
    return [lat, lng];
  }, [leads]);

  const selected = leads.find((l) => l.id === selectedId);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds leads={leads} />
        <FlyToSelected lead={selected} />
        {leads.map((l) => {
          if (!l.latitude || !l.longitude) return null;
          const isActive = l.id === selectedId;
          const icon = isActive
            ? ICON_ACTIVE
            : l.verified
              ? ICON_VERIFIED
              : ICON_DEFAULT;
          return (
            <Marker
              key={l.id}
              position={[l.latitude, l.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelect?.(l.id),
              }}
              ref={(ref) => {
                if (ref) markersRef.current.set(l.id, ref);
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{l.name}</strong>
                  <br />
                  {l.address}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
