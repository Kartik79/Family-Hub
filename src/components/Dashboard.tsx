import React from 'react';
import { ChefHat, ShoppingCart, Calendar, Clock, Users, AlertCircle, Baby, Heart, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Dashboard() {
  const { currentUser, mealPlans, shoppingList, activities, familyMembers } = useAppContext();

  const todaysMeal = mealPlans.find(plan => plan.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const upcomingActivities = activities.filter(activity => 
    new Date(activity.date) >= new Date() && new Date(activity.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).slice(0, 3);
  const pendingShoppingItems = shoppingList.filter(item => !item.completed).length;

  const getRoleSpecificCards = () => {
    switch (currentUser?.role) {
      case 'admin':
        return (
          <>
            <DashboardCard
              title="Family Overview"
              subtitle={`${familyMembers.length} members`}
              icon={Users}
              color="bg-blue-500"
              content={
                <div className="space-y-2">
                  {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        member.role === 'cook' ? 'bg-orange-100 text-orange-700' :
                        member.role === 'driver' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              }
            />
          </>
        );
      case 'cook':
        return (
          <>
            <DashboardCard
              title="Today's Menu"
              subtitle={todaysMeal?.day || 'No meal planned'}
              icon={ChefHat}
              color="bg-orange-500"
              content={
                todaysMeal ? (
                  <div className="space-y-2">
                    <div><span className="font-medium">Breakfast:</span> {todaysMeal.breakfast}</div>
                    <div><span className="font-medium">Lunch:</span> {todaysMeal.lunch}</div>
                    <div><span className="font-medium">Dinner:</span> {todaysMeal.dinner}</div>
                    {todaysMeal.childPreferences && Object.keys(todaysMeal.childPreferences).length > 0 && (
                      <div className="mt-3 p-2 bg-orange-50 rounded">
                        <div className="flex items-center mb-1">
                          <Heart className="h-3 w-3 text-orange-600 mr-1" />
                          <span className="text-xs font-medium text-orange-800">Preferences considered</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No meals planned for today</p>
                )
              }
            />
          </>
        );
      case 'driver':
        return (
          <>
            <DashboardCard
              title="My Driving Schedule"
              subtitle={`${upcomingActivities.filter(a => a.driver === currentUser.name).length} upcoming trips`}
              icon={Calendar}
              color="bg-green-500"
              content={
                <div className="space-y-2">
                  {upcomingActivities
                    .filter(activity => activity.driver === currentUser.name)
                    .map(activity => (
                      <div key={activity.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm flex items-center">
                            {activity.title}
                            {activity.matchesPreferences && (
                              <Heart className="h-3 w-3 text-pink-500 fill-current ml-1" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{activity.childName}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  {upcomingActivities.filter(a => a.driver === currentUser.name).length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming trips assigned</p>
                  )}
                </div>
              }
            />
          </>
        );
      case 'child':
        const myActivities = upcomingActivities.filter(activity => 
          activity.childName === currentUser.name || activity.childName.includes(currentUser.name.split(' ')[0])
        );
        const currentChild = familyMembers.find(m => m.name === currentUser.name && m.role === 'child');
        
        return (
          <>
            <DashboardCard
              title="My Activities"
              subtitle={`${myActivities.length} upcoming`}
              icon={Baby}
              color="bg-blue-500"
              content={
                <div className="space-y-2">
                  {myActivities.map(activity => (
                    <div key={activity.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm flex items-center">
                          {activity.title}
                          {activity.matchesPreferences && (
                            <Heart className="h-3 w-3 text-pink-500 fill-current ml-1\" title="Matches your preferences!" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{activity.location}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {myActivities.length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming activities</p>
                  )}
                </div>
              }
            />
            <DashboardCard
              title="Today's Meals"
              subtitle={todaysMeal?.day || 'No meal planned'}
              icon={ChefHat}
              color="bg-orange-500"
              content={
                todaysMeal ? (
                  <div className="space-y-2">
                    <div><span className="font-medium">Breakfast:</span> {todaysMeal.breakfast}</div>
                    <div><span className="font-medium">Lunch:</span> {todaysMeal.lunch}</div>
                    <div><span className="font-medium">Dinner:</span> {todaysMeal.dinner}</div>
                    {todaysMeal.snacks && todaysMeal.snacks.length > 0 && (
                      <div><span className="font-medium">Snacks:</span> {todaysMeal.snacks.join(', ')}</div>
                    )}
                    {todaysMeal.childPreferences && todaysMeal.childPreferences[currentUser.name] && (
                      <div className="mt-2 p-2 bg-orange-50 rounded">
                        <div className="flex items-center mb-1">
                          <Heart className="h-3 w-3 text-orange-600 mr-1" />
                          <span className="text-xs font-medium text-orange-800">Made with your preferences in mind!</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No meals planned for today</p>
                )
              }
            />
            {currentChild && currentChild.mealPreferences && currentChild.mealPreferences.length > 0 && (
              <DashboardCard
                title="My Food Preferences"
                subtitle="What I like to eat"
                icon={Heart}
                color="bg-pink-500"
                content={
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {currentChild.mealPreferences.map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                }
              />
            )}
            {currentChild && currentChild.activityPreferences && currentChild.activityPreferences.length > 0 && (
              <DashboardCard
                title="My Activity Preferences"
                subtitle="What I love to do"
                icon={Star}
                color="bg-indigo-500"
                content={
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {currentChild.activityPreferences.map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                }
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your family today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {}
        {currentUser?.role !== 'child' && (
          <>
            <DashboardCard
              title="Shopping List"
              subtitle={`${pendingShoppingItems} items pending`}
              icon={ShoppingCart}
              color="bg-emerald-500"
              content={
                <div className="space-y-2">
                  {shoppingList.filter(item => !item.completed).slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.quantity}</span>
                    </div>
                  ))}
                  {pendingShoppingItems > 4 && (
                    <p className="text-xs text-gray-500">+{pendingShoppingItems - 4} more items</p>
                  )}
                </div>
              }
            />

            <DashboardCard
              title="Upcoming Activities"
              subtitle={`${upcomingActivities.length} this week`}
              icon={Calendar}
              color="bg-indigo-500"
              content={
                <div className="space-y-2">
                  {upcomingActivities.map(activity => (
                    <div key={activity.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm flex items-center">
                          {activity.title}
                          {activity.matchesPreferences && (
                            <Heart className="h-3 w-3 text-pink-500 fill-current ml-1" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{activity.childName}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {upcomingActivities.length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming activities</p>
                  )}
                </div>
              }
            />
          </>
        )}

        {getRoleSpecificCards()}
      </div>

      {}
      {currentUser?.role !== 'child' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={ChefHat}
              label="Plan Meals"
              color="bg-orange-100 text-orange-700 hover:bg-orange-200"
            />
            <QuickActionButton
              icon={ShoppingCart}
              label="Add to List"
              color="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            />
            <QuickActionButton
              icon={Calendar}
              label="Schedule Activity"
              color="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            />
            <QuickActionButton
              icon={Clock}
              label="Set Reminder"
              color="bg-purple-100 text-purple-700 hover:bg-purple-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  content: React.ReactNode;
}

function DashboardCard({ title, subtitle, icon: Icon, color, content }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        {content}
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
}

function QuickActionButton({ icon: Icon, label, color }: QuickActionButtonProps) {
  return (
    <button className={`p-4 rounded-lg transition-colors duration-200 ${color} flex flex-col items-center space-y-2`}>
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}