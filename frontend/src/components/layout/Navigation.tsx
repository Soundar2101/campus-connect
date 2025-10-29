import React from 'react';
import { Home, Plus, Calendar, Users, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user } = useAuth();

  const studentTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'All Events', icon: Calendar },
  ];

  const staffTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'All Events', icon: Calendar },
    { id: 'create', label: 'Create Event', icon: Plus },
    { id: 'manage', label: 'My Events', icon: Settings },
    // {id : 'alldeparments',label:'All deparments students',icon:settings},
    
  ];

  const tabs = user?.role === 'staff' ? staffTabs : studentTabs;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}