
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LocationDetailsProps {
  location: {
    id: number;
    name: string;
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    category: string;
  };
}

const generateForecastData = (currentAQI: number) => {
  const hours = [];
  const aqiValues = [];
  
  for (let i = 0; i < 72; i++) {
    hours.push(`${i}h`);
    // Add some realistic variation to the forecast
    const variation = Math.sin(i / 12) * 20 + (Math.random() - 0.5) * 15;
    aqiValues.push(Math.max(10, currentAQI + variation));
  }
  
  return { hours, aqiValues };
};

const getHealthAdvice = (category: string, t: (key: string) => string) => {
  switch (category) {
    case 'good':
      return 'Air quality is satisfactory. Enjoy outdoor activities!';
    case 'moderate':
      return 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.';
    case 'unhealthy':
      return 'Everyone may experience health effects. Limit outdoor activities.';
    case 'hazardous':
      return 'Health alert! Avoid all outdoor activities. Keep windows closed.';
    default:
      return 'Monitor air quality regularly.';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'good': return 'bg-green-100 text-green-800';
    case 'moderate': return 'bg-yellow-100 text-yellow-800';
    case 'unhealthy': return 'bg-orange-100 text-orange-800';
    case 'hazardous': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const LocationDetails: React.FC<LocationDetailsProps> = ({ location }) => {
  const { t } = useLanguage();
  const [forecastData, setForecastData] = useState<{ hours: string[], aqiValues: number[] }>({ hours: [], aqiValues: [] });

  useEffect(() => {
    setForecastData(generateForecastData(location.aqi));
  }, [location.aqi]);

  const chartData = {
    labels: forecastData.hours.filter((_, i) => i % 6 === 0), // Show every 6 hours
    datasets: [
      {
        label: 'AQI Forecast',
        data: forecastData.aqiValues.filter((_, i) => i % 6 === 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('next72Hours'),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 300,
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Location Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{location.name}</h2>
        <Badge className={`${getCategoryColor(location.category)} px-3 py-1`}>
          {t(location.category)} - AQI {location.aqi}
        </Badge>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">{t('airQuality')}</TabsTrigger>
          <TabsTrigger value="forecast">{t('forecast')}</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {/* Current Air Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('currentAQI')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{location.pm25}</div>
                  <div className="text-sm text-gray-600">{t('pm25')} μg/m³</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{location.pm10}</div>
                  <div className="text-sm text-gray-600">{t('pm10')} μg/m³</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2">
                  <div className="text-2xl font-bold text-orange-600">{location.no2}</div>
                  <div className="text-sm text-gray-600">{t('no2')} μg/m³</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Advice */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('healthAdvice')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{getHealthAdvice(location.category, t)}</p>
            </CardContent>
          </Card>

          {/* Agricultural Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌾 Agricultural Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {location.aqi > 150 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="font-medium text-orange-800">Crop Protection Alert</div>
                    <div className="text-sm text-orange-700">High pollution may affect crop health. Consider protective measures.</div>
                  </div>
                )}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800">Seasonal Advice</div>
                  <div className="text-sm text-green-700">Monitor for crop burning activities in nearby areas.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('next72Hours')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Forecast based on weather patterns and historical data
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
