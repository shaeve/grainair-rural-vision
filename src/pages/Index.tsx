
import React, { useState } from 'react';
import { LeafletMap } from '../components/LeafletMap';
import { Header } from '../components/Header';
import { LocationDetails } from '../components/LocationDetails';
import { IncidentReport } from '../components/IncidentReport';
import { LanguageProvider } from '../contexts/LanguageContext';

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showIncidentReport, setShowIncidentReport] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
        <Header onReportIncident={() => setShowIncidentReport(true)} />
        
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
          {/* Map Section */}
          <div className="flex-1 relative">
            <LeafletMap 
              onLocationSelect={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          </div>
          
          {/* Details Panel */}
          <div className="lg:w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
            {selectedLocation ? (
              <LocationDetails location={selectedLocation} />
            ) : (
              <div className="p-6 text-center text-gray-500">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    🌱
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Welcome to GrainAir
                  </h3>
                  <p className="text-sm">
                    Click on any location on the map to view air quality data and forecasts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Incident Report Modal */}
        {showIncidentReport && (
          <IncidentReport onClose={() => setShowIncidentReport(false)} />
        )}
      </div>
    </LanguageProvider>
  );
};

export default Index;
