import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { UserSelector } from './components/UserSelector';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { MealPlanner } from './components/MealPlanner';
import { ShoppingList } from './components/ShoppingList';
import { ActivityPlanner } from './components/ActivityPlanner';
import { FamilyManager } from './components/FamilyManager';
import { Settings } from './components/Settings';
import { LocationTracker } from './components/LocationTracker';

function AppContent() {
  const { currentUser } = useAppContext();
  const [activeView, setActiveView] = useState('dashboard');

  if (!currentUser) {
    return <UserSelector />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'meals':
        return <MealPlanner />;
      case 'shopping':
        return <ShoppingList />;
      case 'activities':
        return <ActivityPlanner />;
      case 'family':
        return <FamilyManager />;
      case 'settings':
        return <Settings />;
      case 'location':
        return <LocationTracker />;
      case 'driving':
        return <ActivityPlanner />; // Driver-specific view of activities
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main>
        {renderActiveView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;