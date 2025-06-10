import React from 'react';
import { Home, ChefHat, ShoppingCart, Calendar, Users, Car, Baby, LogOut, Crown, Settings, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const { currentUser, setCurrentUser } = useAppContext();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (currentUser?.role) {
      case 'admin':
        return [
          ...baseItems,
          { id: 'meals', label: 'Meal Plans', icon: ChefHat },
          { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
          { id: 'activities', label: 'Activities', icon: Calendar },
          { id: 'family', label: 'Family', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'cook':
        return [
          ...baseItems,
          { id: 'meals', label: 'Meal Plans', icon: ChefHat },
          { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'driver':
        return [
          ...baseItems,
          { id: 'activities', label: 'Activities', icon: Calendar },
          { id: 'location', label: 'Child Locations', icon: MapPin },
        ];
      case 'child':
        return [
          ...baseItems,
          { id: 'meals', label: 'My Meals', icon: ChefHat },
          { id: 'activities', label: 'My Activities', icon: Calendar },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Crown;
      case 'cook':
        return ChefHat;
      case 'driver':
        return Car;
      case 'child':
        return Baby;
      default:
        return Home;
    }
  };

  const RoleIcon = getRoleIcon(currentUser?.role || '');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <Home className="h-8 w-8 text-emerald-600" />
                <span className="text-xl font-bold text-gray-900">FamilyHub</span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      activeView === item.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentUser?.role === 'admin' ? 'bg-purple-100' :
                currentUser?.role === 'cook' ? 'bg-orange-100' :
                currentUser?.role === 'driver' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                <RoleIcon className={`h-4 w-4 ${
                  currentUser?.role === 'admin' ? 'text-purple-700' :
                  currentUser?.role === 'cook' ? 'text-orange-700' :
                  currentUser?.role === 'driver' ? 'text-green-700' :
                  'text-blue-700'
                }`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1 bg-gray-50">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center w-full px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  activeView === item.id
                    ? 'text-emerald-600 bg-emerald-50 border-r-4 border-emerald-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}