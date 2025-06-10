import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function LocationTracker() {
  const { activities, familyMembers, currentUser } = useAppContext();
  const [childLocations, setChildLocations] = useState<{ [key: string]: any }>({});
  const [isTracking, setIsTracking] = useState(false);

  const todaysActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const today = new Date();
    return activityDate.toDateString() === today.toDateString() && 
           activity.driver === currentUser?.name;
  });

  const simulateChildLocation = (childName: string, activity: any) => {
    const locations = [
      { name: 'Home', lat: 19.0760, lng: 72.8777, address: '123 Home Street, Mumbai' },
      { name: activity.location, lat: 19.0760 + Math.random() * 0.1, lng: 72.8777 + Math.random() * 0.1, address: activity.location },
      { name: 'School', lat: 19.0860, lng: 72.8877, address: '456 School Road, Mumbai' },
      { name: 'Friend\'s House', lat: 19.0660, lng: 72.8677, address: '789 Friend Lane, Mumbai' }
    ];
    
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const startTracking = () => {
    setIsTracking(true);
    
    const locations: { [key: string]: any } = {};
    
    todaysActivities.forEach(activity => {
      const child = familyMembers.find(m => m.name === activity.childName);
      if (child) {
        locations[child.name] = {
          ...simulateChildLocation(child.name, activity),
          lastUpdated: new Date(),
          activity: activity,
          status: getChildStatus(activity)
        };
      }
    });
    
    setChildLocations(locations);
  };

  const getChildStatus = (activity: any) => {
    const now = new Date();
    const activityTime = new Date(`${activity.date} ${activity.time}`);
    const timeDiff = activityTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    if (minutesDiff > 30) return 'waiting';
    if (minutesDiff > 0) return 'ready';
    if (minutesDiff > -60) return 'in-progress';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-gray-100 text-gray-800';
      case 'ready': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'Waiting for pickup time';
      case 'ready': return 'Ready for pickup';
      case 'in-progress': return 'Activity in progress';
      case 'completed': return 'Activity completed';
      default: return 'Unknown status';
    }
  };

  const refreshLocation = (childName: string) => {
    const activity = todaysActivities.find(a => a.childName === childName);
    if (activity) {
      setChildLocations(prev => ({
        ...prev,
        [childName]: {
          ...simulateChildLocation(childName, activity),
          lastUpdated: new Date(),
          activity: activity,
          status: getChildStatus(activity)
        }
      }));
    }
  };

  const getDirections = (location: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  const callChild = (childName: string) => {
    alert(`Calling ${childName}... (This is a demo - no actual call will be made)`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Child Location Tracker</h1>
          <p className="text-gray-600 mt-2">Track children's locations for efficient pickup and drop-off</p>
        </div>
        <button
          onClick={startTracking}
          disabled={isTracking}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isTracking ? 'Tracking Active' : 'Start Tracking'}
        </button>
      </div>

      {!isTracking && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Location Tracking</h3>
              <p className="mt-1 text-sm text-blue-800">
                Click "Start Tracking" to see the current locations of children with activities today. 
                This demo uses simulated locations for privacy and safety.
              </p>
            </div>
          </div>
        </div>
      )}

      {todaysActivities.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Today</h3>
          <p className="text-gray-500">No children have activities assigned to you for today.</p>
        </div>
      )}

      {isTracking && todaysActivities.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {todaysActivities.map(activity => {
            const child = familyMembers.find(m => m.name === activity.childName);
            const location = childLocations[activity.childName];
            
            if (!child || !location) return null;

            return (
              <div key={activity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{child.name}</h3>
                      <p className="text-green-100 text-sm">{activity.title}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(location.status)}`}>
                      {getStatusText(location.status)}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {}
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Current Location</h4>
                        <p className="text-sm text-gray-600">{location.name}</p>
                        <p className="text-xs text-gray-500">{location.address}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last updated: {location.lastUpdated.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {}
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Activity Schedule</h4>
                        <p className="text-sm text-gray-600">
                          {activity.time} at {activity.location}
                        </p>
                        {activity.notes && (
                          <p className="text-xs text-gray-500 mt-1">{activity.notes}</p>
                        )}
                      </div>
                    </div>

                    {}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => getDirections(location)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Directions
                      </button>
                      <button
                        onClick={() => callChild(child.name)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </button>
                      <button
                        onClick={() => refreshLocation(child.name)}
                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-900">Privacy & Safety Notice</h3>
            <p className="mt-1 text-sm text-yellow-800">
              This is a demo feature using simulated locations. In a real implementation, proper consent and privacy measures would be essential. 
              Location tracking should only be used with appropriate permissions and safety protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}