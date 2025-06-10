import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Clock, User, Edit2, Trash2, Star, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Activity } from '../types';

export function ActivityPlanner() {
  const { activities, setActivities, familyMembers, currentUser } = useAppContext();
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const handleSaveActivity = (activity: Activity) => {
    const child = familyMembers.find(m => m.name === activity.childName && m.role === 'child');
    const matchesPreferences = child?.activityPreferences?.some(pref => 
      activity.title.toLowerCase().includes(pref.toLowerCase()) ||
      activity.type.toLowerCase().includes(pref.toLowerCase())
    ) || false;

    const activityWithPreferences = { ...activity, matchesPreferences };

    if (editingActivity && editingActivity.id) {
      setActivities(activities.map(a => a.id === activity.id ? activityWithPreferences : a));
    } else {
      setActivities([...activities, { ...activityWithPreferences, id: Date.now().toString() }]);
    }
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const getFilteredActivities = () => {
    if (currentUser?.role === 'child') {
      return activities.filter(activity => 
        activity.childName === currentUser.name || 
        activity.childName.includes(currentUser.name.split(' ')[0])
      );
    } else if (currentUser?.role === 'driver') {
      return activities.filter(activity => activity.driver === currentUser.name);
    }
    return activities;
  };

  const filteredActivities = getFilteredActivities();
  const upcomingActivities = filteredActivities
    .filter(activity => new Date(activity.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastActivities = filteredActivities
    .filter(activity => new Date(activity.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isReadOnly = currentUser?.role === 'child';
  const isDriverView = currentUser?.role === 'driver';

  const getTitle = () => {
    if (currentUser?.role === 'child') return 'My Activities';
    if (currentUser?.role === 'driver') return 'My Driving Schedule';
    return 'Activity Planner';
  };

  const getSubtitle = () => {
    if (currentUser?.role === 'child') return 'See your upcoming activities and schedules';
    if (currentUser?.role === 'driver') return 'Manage pickup and drop-off schedules';
    return 'Manage your children\'s activities and schedules';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-600 mt-2">{getSubtitle()}</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l-0 border ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
          </div>
          {!isReadOnly && (
            <button
              onClick={() => setEditingActivity({
                id: '',
                childName: '',
                title: '',
                type: 'other',
                date: '',
                time: '',
                location: '',
                driver: '',
                notes: '',
                recurring: false,
              })}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </button>
          )}
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-6">
          {}
          {upcomingActivities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isDriverView ? 'Upcoming Pickups' : 'Upcoming Activities'} ({upcomingActivities.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onEdit={setEditingActivity}
                    onDelete={handleDeleteActivity}
                    isReadOnly={isReadOnly}
                    isDriverView={isDriverView}
                    familyMembers={familyMembers}
                  />
                ))}
              </div>
            </div>
          )}

          {}
          {pastActivities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isDriverView ? 'Past Pickups' : 'Past Activities'} ({pastActivities.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 opacity-75">
                {pastActivities.slice(0, 5).map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onEdit={setEditingActivity}
                    onDelete={handleDeleteActivity}
                    isPast={true}
                    isReadOnly={isReadOnly}
                    isDriverView={isDriverView}
                    familyMembers={familyMembers}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredActivities.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDriverView ? 'No pickups assigned' : 'No activities scheduled'}
              </h3>
              <p className="text-gray-500 mb-6">
                {isReadOnly 
                  ? 'No activities have been scheduled for you yet'
                  : isDriverView
                  ? 'No pickup or drop-off activities have been assigned to you'
                  : 'Start by adding your first activity to keep track of your children\'s schedule'
                }
              </p>
              {!isReadOnly && (
                <button
                  onClick={() => setEditingActivity({
                    id: '',
                    childName: '',
                    title: '',
                    type: 'other',
                    date: '',
                    time: '',
                    location: '',
                    driver: '',
                    notes: '',
                    recurring: false,
                  })}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Activity
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <CalendarView activities={upcomingActivities} />
      )}

      {}
      {editingActivity && (
        <ActivityEditor
          activity={editingActivity}
          familyMembers={familyMembers}
          onSave={handleSaveActivity}
          onCancel={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
}

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  isPast?: boolean;
  isReadOnly?: boolean;
  isDriverView?: boolean;
  familyMembers: any[];
}

function ActivityCard({ activity, onEdit, onDelete, isPast = false, isReadOnly = false, isDriverView = false, familyMembers }: ActivityCardProps) {
  const getActivityTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'soccer':
        return '⚽';
      case 'music':
        return '🎵';
      case 'study':
        return '📚';
      default:
        return '📅';
    }
  };

  const getActivityTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'soccer':
        return 'bg-green-100 text-green-800';
      case 'music':
        return 'bg-purple-100 text-purple-800';
      case 'study':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const child = familyMembers.find(m => m.name === activity.childName && m.role === 'child');

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{getActivityTypeIcon(activity.type)}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                {activity.matchesPreferences && (
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-pink-500 fill-current" title="Matches child's preferences" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">{activity.childName}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityTypeColor(activity.type)}`}>
              {activity.type}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(activity.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {activity.time}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {activity.location}
            </div>
          </div>
          
          {activity.driver && (
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <User className="h-4 w-4 mr-2" />
              {isDriverView ? 'Pickup for:' : 'Driver:'} {isDriverView ? activity.childName : activity.driver}
            </div>
          )}
          
          {activity.notes && (
            <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
          )}

          {}
          {child && child.activityPreferences && child.activityPreferences.length > 0 && !isReadOnly && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">{activity.childName}'s Activity Preferences</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {child.activityPreferences.map((pref, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {!isPast && !isReadOnly && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(activity)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(activity.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarView({ activities }: { activities: Activity[] }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getActivitiesForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter(activity => activity.date === dateStr);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[80px] p-2 border border-gray-200 ${
              day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
            }`}
          >
            {day && (
              <>
                <div className={`text-sm font-medium mb-1 ${
                  day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                    ? 'text-indigo-600 font-bold'
                    : 'text-gray-900'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {getActivitiesForDay(day).map(activity => (
                    <div
                      key={activity.id}
                      className={`text-xs p-1 rounded truncate flex items-center ${
                        activity.matchesPreferences 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                      title={`${activity.title} - ${activity.childName}${activity.matchesPreferences ? ' (Matches preferences)' : ''}`}
                    >
                      {activity.matchesPreferences && <Heart className="h-2 w-2 mr-1 fill-current" />}
                      {activity.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ActivityEditorProps {
  activity: Activity;
  familyMembers: any[];
  onSave: (activity: Activity) => void;
  onCancel: () => void;
}

function ActivityEditor({ activity, familyMembers, onSave, onCancel }: ActivityEditorProps) {
  const [formData, setFormData] = useState(activity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const drivers = familyMembers.filter(member => member.role === 'driver' || member.role === 'admin');
  const children = familyMembers.filter(member => member.role === 'child');
  const selectedChild = familyMembers.find(m => m.name === formData.childName && m.role === 'child');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {activity.id ? 'Edit Activity' : 'Add New Activity'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child's Name
              </label>
              <select
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select a child</option>
                {children.map(child => (
                  <option key={child.id} value={child.name}>{child.name}</option>
                ))}
              </select>
            </div>
          </div>

          {}
          {selectedChild && selectedChild.activityPreferences && selectedChild.activityPreferences.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">{selectedChild.name}'s Activity Preferences</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedChild.activityPreferences.map((pref, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {pref}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">Consider these preferences when planning activities</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Activity['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="soccer">Soccer</option>
                <option value="music">Music</option>
                <option value="study">Study</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Driver
            </label>
            <select
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select a driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.name}>{driver.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Any additional notes or instructions"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
              Recurring activity
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              {activity.id ? 'Update Activity' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}