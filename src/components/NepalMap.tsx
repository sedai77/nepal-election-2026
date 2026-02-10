"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PROVINCE_COLORS, getDistrictData } from "@/data/electionData";
import { getRealDominantPartyColor, getRealDominantPartyName } from "@/data/partyStrength";
import type { MapColorMode } from "./MapModeToggle";
import type { DistrictSentiment } from "@/hooks/useSentiment";

interface NepalMapProps {
  onDistrictSelect: (districtName: string | null) => void;
  selectedDistrict: string | null;
  colorMode: MapColorMode;
  sentimentData?: Record<string, DistrictSentiment>;
}

export default function NepalMap({ onDistrictSelect, selectedDistrict, colorMode, sentimentData }: NepalMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);

  // Load GeoJSON
  useEffect(() => {
    fetch("/api/geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(console.error);
  }, []);

  const getDistrictStyle = useCallback(
    (feature: GeoJSON.Feature | undefined, isHovered: boolean, isSelected: boolean): L.PathOptions => {
      const districtName = feature?.properties?.DISTRICT || "";
      const province = feature?.properties?.PROVINCE || 1;

      let baseColor: string;
      if (colorMode === "party") {
        baseColor = getRealDominantPartyColor(districtName);
      } else if (colorMode === "election2026") {
        // Use sentiment data if available, otherwise grey
        const sentiment = sentimentData?.[districtName.toUpperCase()];
        baseColor = sentiment?.color || "#475569";
      } else {
        baseColor = PROVINCE_COLORS[province] || "#6b7280";
      }

      return {
        fillColor: baseColor,
        weight: isSelected ? 3 : isHovered ? 2.5 : 1.2,
        opacity: 1,
        color: isSelected ? "#fbbf24" : isHovered ? "#ffffff" : "#1e293b",
        fillOpacity: isSelected ? 0.85 : isHovered ? 0.75 : colorMode === "party" ? 0.7 : colorMode === "election2026" ? 0.45 : 0.55,
        dashArray: "",
      };
    },
    [colorMode, sentimentData]
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [28.3, 84.1],
      zoom: 7,
      minZoom: 6,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [
        [25.5, 78],
        [31.5, 90],
      ],
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add GeoJSON layer
  useEffect(() => {
    if (!mapRef.current || !geoData) return;

    if (geoLayerRef.current) {
      geoLayerRef.current.remove();
    }

    const layer = L.geoJSON(geoData, {
      style: (feature) => getDistrictStyle(feature, false, false),
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.DISTRICT || "Unknown";
        const province = feature.properties?.PROVINCE || 0;
        const hq = feature.properties?.HQ || "";
        const districtData = getDistrictData(name);
        const zones = districtData?.zones.length || 0;
        const dominantParty = getRealDominantPartyName(name);

        const tooltipContent = `
          <div class="district-tooltip">
            <strong>${titleCase(name)}</strong>
            <div class="tooltip-detail">HQ: ${titleCase(hq)}</div>
            <div class="tooltip-detail">Province: ${province}</div>
            <div class="tooltip-detail">Election Zones: ${zones}</div>
            ${colorMode === "party" ? `<div class="tooltip-detail" style="color:#e2e8f0;margin-top:2px">🏛️ 2022 Winner: ${dominantParty}</div>` : ""}
            ${colorMode === "election2026" ? (() => {
              const s = sentimentData?.[name.toUpperCase()];
              return s
                ? `<div class="tooltip-detail" style="color:#e2e8f0;margin-top:2px">🔥 Top Sentiment: ${s.partyShort} (${s.totalLikes} likes)</div>`
                : `<div class="tooltip-detail" style="color:#94a3b8;margin-top:2px">📊 No sentiment data yet</div>`;
            })() : ""}
          </div>
        `;

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          className: "custom-tooltip",
          direction: "top",
          offset: [0, -10],
        });

        layer.on({
          mouseover: (e) => {
            const target = e.target;
            setHoveredDistrict(name);
            target.setStyle(getDistrictStyle(feature, true, selectedDistrict === name));
            target.bringToFront();
          },
          mouseout: (e) => {
            const target = e.target;
            setHoveredDistrict(null);
            target.setStyle(getDistrictStyle(feature, false, selectedDistrict === name));
          },
          click: () => {
            onDistrictSelect(name);
          },
        });
      },
    });

    layer.addTo(mapRef.current);
    geoLayerRef.current = layer;
  }, [geoData, getDistrictStyle, onDistrictSelect, selectedDistrict, colorMode, sentimentData]);

  // Update styles when selection or color mode changes
  useEffect(() => {
    if (!geoLayerRef.current) return;

    geoLayerRef.current.eachLayer((layer) => {
      const geoLayer = layer as L.GeoJSON & { feature: GeoJSON.Feature };
      const feature = geoLayer.feature;
      if (feature) {
        const name = feature.properties?.DISTRICT || "";
        const isHovered = hoveredDistrict === name;
        const isSelected = selectedDistrict === name;
        (layer as L.Path).setStyle(getDistrictStyle(feature, isHovered, isSelected));
        if (isSelected) {
          (layer as L.Path).bringToFront();
        }
      }
    });
  }, [selectedDistrict, hoveredDistrict, getDistrictStyle]);

  return <div ref={containerRef} className="w-full h-full rounded-xl" />;
}

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
