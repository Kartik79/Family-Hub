export interface FamilyMember {
  id: string;
  name: string;
  role: 'admin' | 'cook' | 'driver' | 'child';
  avatar?: string;
  preferences?: string[];
  mealPreferences?: string[];
  activityPreferences?: string[];
  password: string;
}

export interface MealPlan {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks?: string[];
  notes?: string;
  childPreferences?: { [childName: string]: string[] };
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  completed: boolean;
  addedBy: string;
}

export interface Activity {
  id: string;
  childName: string;
  title: string;
  type: 'soccer' | 'music' | 'study' | 'other';
  date: string;
  time: string;
  location: string;
  driver?: string;
  notes?: string;
  recurring?: boolean;
  matchesPreferences?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cook' | 'driver' | 'child';
}

export interface AppSettings {
  openaiApiKey?: string;
}