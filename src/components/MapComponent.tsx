
import React, { useState, useEffect } from 'react';
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

interface MapComponentProps {
  onLocationSelect: (location: any) => void;
  selectedLocation: any;
}

const getAQIColor = (category: string) => {
  switch (category) {
    case 'good': return 'bg-green-500';
    case 'moderate': return 'bg-yellow-500';
    case 'unhealthy': return 'bg-orange-500';
    case 'hazardous': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, selectedLocation }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Center of India
  const [zoom, setZoom] = useState(5);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-100 to-green-100 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
        {/* Simulated India Map Outline */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 800 600"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          <path
            d="M200,150 Q250,120 300,140 Q350,160 400,150 Q450,140 500,160 Q550,180 580,220 Q600,280 580,340 Q560,400 520,450 Q480,480 430,490 Q380,500 330,480 Q280,460 240,420 Q200,380 180,320 Q160,260 180,200 Q190,170 200,150 Z"
            fill="rgba(34,197,94,0.3)"
            stroke="rgba(34,197,94,0.5)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* AQI Monitoring Stations */}
      {mockAQIData.map((station) => {
        const x = ((station.lng - 68) / (97 - 68)) * 100; // Convert to percentage
        const y = ((35 - station.lat) / (35 - 8)) * 100; // Convert to percentage
        const isSelected = selectedLocation?.id === station.id;
        
        return (
          <button
            key={station.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => onLocationSelect(station)}
          >
            <div className={`w-8 h-8 rounded-full ${getAQIColor(station.category)} shadow-lg flex items-center justify-center relative`}>
              <MapPin className="w-4 h-4 text-white" />
              {isSelected && (
                <div className="absolute -inset-2 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            <div className={`mt-1 px-2 py-1 bg-white rounded shadow-md text-xs font-medium ${
              isSelected ? 'ring-2 ring-blue-400' : ''
            }`}>
              <div className="text-gray-800">{station.name}</div>
              <div className={`${getAQIColor(station.category).replace('bg-', 'text-')}`}>
                AQI {station.aqi}
              </div>
            </div>
          </button>
        );
      })}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => setZoom(Math.min(zoom + 1, 10))}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 1, 1))}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          -
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">AQI Levels</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Good (0-50)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Moderate (51-100)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Unhealthy (101-200)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Hazardous (201+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
