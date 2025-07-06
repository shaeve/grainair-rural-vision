
import React, { useState } from 'react';
import { MapPin, Bell, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onReportIncident: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReportIncident }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t('appName')}</h1>
          <p className="text-sm text-gray-600">{t('tagline')}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'English' : 'हिंदी'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('hi')} className="cursor-pointer">
              हिंदी
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Report Incident Button */}
        <Button 
          onClick={onReportIncident}
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">{t('reportIncident')}</span>
        </Button>
      </div>
    </header>
  );
};
