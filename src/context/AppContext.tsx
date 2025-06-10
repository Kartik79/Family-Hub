import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FamilyMember, MealPlan, ShoppingItem, Activity, User, AppSettings } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  familyMembers: FamilyMember[];
  setFamilyMembers: (members: FamilyMember[]) => void;
  mealPlans: MealPlan[];
  setMealPlans: (plans: MealPlan[]) => void;
  shoppingList: ShoppingItem[];
  setShoppingList: (items: ShoppingItem[]) => void;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultFamilyMembers: FamilyMember[] = [
  { 
    id: '1', 
    name: 'Ramesh (Parent)', 
    role: 'admin',
    password: 'admin123',
    preferences: ['Healthy eating', 'Outdoor activities'],
    mealPreferences: ['Vegetarian', 'Low spice'],
    activityPreferences: ['Sports', 'Educational']
  },
  { 
    id: '2', 
    name: 'Suresh (Cook)', 
    role: 'cook',
    password: 'cook123',
    preferences: ['Quick recipes', 'Indian cuisine'],
    mealPreferences: ['Traditional Indian', 'Vegetarian'],
    activityPreferences: []
  },
  { 
    id: '3', 
    name: 'Jayesh (Driver)', 
    role: 'driver',
    password: 'driver123',
    preferences: ['Nearby locations', 'Flexible timing'],
    mealPreferences: [],
    activityPreferences: ['Local activities', 'Group activities']
  },
  { 
    id: '4', 
    name: 'Dinesh', 
    role: 'child',
    password: 'dinesh123',
    preferences: ['Sweet foods', 'Fun activities'],
    mealPreferences: ['Mild spice', 'Sweet dishes', 'Fruits', 'No bitter vegetables'],
    activityPreferences: ['Soccer', 'Dancing', 'Art & Crafts', 'Swimming']
  },
  { 
    id: '5', 
    name: 'Pragnesh', 
    role: 'child',
    password: 'pragnesh123',
    preferences: ['Music', 'Outdoor games'],
    mealPreferences: ['Medium spice', 'Rice dishes', 'Snacks', 'No green vegetables'],
    activityPreferences: ['Music lessons', 'Cricket', 'Video games', 'Reading']
  },
];

const defaultMealPlans: MealPlan[] = [
  {
    id: '1',
    day: 'Monday',
    breakfast: 'Poha with vegetables',
    lunch: 'Dal rice with sabzi',
    dinner: 'Roti with paneer curry',
    snacks: ['Samosa', 'Chai'],
    childPreferences: {
      'Dinesh': ['Sweet dishes', 'Mild spice'],
      'Pragnesh': ['Rice dishes', 'Medium spice']
    }
  },
  {
    id: '2',
    day: 'Tuesday',
    breakfast: 'Upma with coconut chutney',
    lunch: 'Rajma rice',
    dinner: 'Chapati with aloo gobi',
    snacks: ['Pakora', 'Lassi'],
    childPreferences: {
      'Dinesh': ['Sweet dishes', 'Fruits'],
      'Pragnesh': ['Rice dishes', 'Snacks']
    }
  },
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    childName: 'Dinesh',
    title: 'Soccer Practice',
    type: 'soccer',
    date: '2024-12-20',
    time: '16:00',
    location: 'Community Sports Center',
    driver: 'Jayesh (Driver)',
    notes: 'Bring water bottle and cleats',
    matchesPreferences: true
  },
  {
    id: '2',
    childName: 'Pragnesh',
    title: 'Piano Lesson',
    type: 'music',
    date: '2024-12-21',
    time: '15:30',
    location: 'Music Academy',
    driver: 'Jayesh (Driver)',
    notes: 'Practice scales before lesson',
    matchesPreferences: true
  },
  {
    id: '3',
    childName: 'Dinesh',
    title: 'Art Class',
    type: 'other',
    date: '2024-12-22',
    time: '14:00',
    location: 'Community Center',
    driver: 'Jayesh (Driver)',
    notes: 'Bring art supplies',
    matchesPreferences: true
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [familyMembers, setFamilyMembers] = useLocalStorage<FamilyMember[]>('familyMembers', defaultFamilyMembers);
  const [mealPlans, setMealPlans] = useLocalStorage<MealPlan[]>('mealPlans', defaultMealPlans);
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingItem[]>('shoppingList', []);
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', defaultActivities);
  const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', {});

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        familyMembers,
        setFamilyMembers,
        mealPlans,
        setMealPlans,
        shoppingList,
        setShoppingList,
        activities,
        setActivities,
        settings,
        setSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}