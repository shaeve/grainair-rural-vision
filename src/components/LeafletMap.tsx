import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Mock AQI data for Indian cities
const mockAQIData = [
  { id: 1, name: 'Delhi', lat: 28.6139, lng: 77.2090, aqi: 245, pm25: 89, pm10: 156, no2: 45, category: 'hazardous' },
  { id: 2, name: 'Mumbai', lat: 19.0760, lng: 72.8777, aqi: 134, pm25: 52, pm10: 87, no2: 32, category: 'unhealthy' },
  { id: 3, name: 'Bangalore', lat: 12.9716, lng: 77.5946, aqi: 78, pm25: 28, pm10: 45, no2: 18, category: 'moderate' },
  { id: 4, name: 'Chennai', lat: 13.0827, lng: 80.2707, aqi: 92, pm25: 34, pm10: 58, no2: 22, category: 'moderate' },
  { id: 5, name: 'Kolkata', lat: 22.5726, lng: 88.3639, aqi: 167, pm25: 63, pm10: 98, no2: 38, category: 'unhealthy' },
  { id: 6, name: 'Pune', lat: 18.5204, lng: 73.8567, aqi: 89, pm25: 31, pm10: 52, no2: 25, category: 'moderate' },
  { id: 7, name: 'Jaipur', lat: 26.9124, lng: 75.7873, aqi: 156, pm25: 58, pm10: 89, no2: 34, category: 'unhealthy' },
  { id: 8, name: 'Lucknow', lat: 26.8467, lng: 80.9462, aqi: 198, pm25: 74, pm10: 123, no2: 42, category: 'unhealthy' },
  { id: 9, name: 'Kanpur', lat: 26.4499, lng: 80.3319, aqi: 234, pm25: 85, pm10: 145, no2: 48, category: 'hazardous' },
  { id: 10, name: 'Nagpur', lat: 21.1458, lng: 79.0882, aqi: 112, pm25: 42, pm10: 67, no2: 28, category: 'unhealthy' }
];

interface LeafletMapProps {
  onLocationSelect: (location: any) => void;
  selectedLocation: any;
}

const getAQIColor = (category: string) => {
  switch (category) {
    case 'good': return '#10B981';
    case 'moderate': return '#F59E0B';
    case 'unhealthy': return '#F97316';
    case 'hazardous': return '#EF4444';
    default: return '#6B7280';
  }
};

const getAQICategory = (aqi: number) => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'unhealthy';
  return 'hazardous';
};

// Custom marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const MapController: React.FC<{ selectedLocation: any }> = ({ selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 10);
    }
  }, [selectedLocation, map]);

  return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({ onLocationSelect, selectedLocation }) => {
  const [mapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Center of India
  const [zoom] = useState(5);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <MapController selectedLocation={selectedLocation} />
        
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* AQI Monitoring Stations */}
        {mockAQIData.map((station) => {
          const color = getAQIColor(station.category);
          const icon = createCustomIcon(color);
          const isSelected = selectedLocation?.id === station.id;

          return (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onLocationSelect(station),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-lg mb-2">{station.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">AQI:</span>
                      <span className={`font-bold ${getAQIColor(station.category).replace('#', 'text-')}`}>
                        {station.aqi}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PM2.5:</span>
                      <span>{station.pm25} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PM10:</span>
                      <span>{station.pm10} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NO₂:</span>
                      <span>{station.no2} ppb</span>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white`}
                            style={{ backgroundColor: color }}>
                        {station.category.charAt(0).toUpperCase() + station.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">AQI Levels</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
            <span>Good (0-50)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F59E0B' }}></div>
            <span>Moderate (51-100)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F97316' }}></div>
            <span>Unhealthy (101-200)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#EF4444' }}></div>
            <span>Hazardous (201+)</span>
          </div>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
          <h3 className="font-semibold text-lg mb-2">{selectedLocation.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">AQI:</span>
              <span className={`font-bold ${getAQIColor(selectedLocation.category).replace('#', 'text-')}`}>
                {selectedLocation.aqi}
              </span>
            </div>
            <div className="flex justify-between">
              <span>PM2.5:</span>
              <span>{selectedLocation.pm25} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>PM10:</span>
              <span>{selectedLocation.pm10} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>NO₂:</span>
              <span>{selectedLocation.no2} ppb</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 