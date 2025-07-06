
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    appName: 'GrainAir',
    tagline: 'Smart Air Quality for Rural India',
    reportIncident: 'Report Incident',
    airQuality: 'Air Quality',
    forecast: 'Forecast',
    healthAdvice: 'Health Advice',
    currentAQI: 'Current AQI',
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO₂',
    good: 'Good',
    moderate: 'Moderate',
    unhealthy: 'Unhealthy',
    hazardous: 'Hazardous',
    next72Hours: 'Next 72 Hours',
    reportSmokeTitle: 'Report Smoke/Burning',
    location: 'Location',
    description: 'Description',
    submit: 'Submit Report',
    cancel: 'Cancel',
    selectLanguage: 'Language'
  },
  hi: {
    appName: 'ग्रेनएयर',
    tagline: 'ग्रामीण भारत के लिए स्मार्ट वायु गुणवत्ता',
    reportIncident: 'घटना रिपोर्ट करें',
    airQuality: 'वायु गुणवत्ता',
    forecast: 'पूर्वानुमान',
    healthAdvice: 'स्वास्थ्य सलाह',
    currentAQI: 'वर्तमान AQI',
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO₂',
    good: 'अच्छा',
    moderate: 'मध्यम',
    unhealthy: 'अस्वास्थ्यकर',
    hazardous: 'खतरनाक',
    next72Hours: 'अगले 72 घंटे',
    reportSmokeTitle: 'धुआं/जलने की रिपोर्ट करें',
    location: 'स्थान',
    description: 'विवरण',
    submit: 'रिपोर्ट जमा करें',
    cancel: 'रद्द करें',
    selectLanguage: 'भाषा'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
