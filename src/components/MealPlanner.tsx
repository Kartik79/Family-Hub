import React, { useState } from 'react';
import { ChefHat, Plus, Edit2, Trash2, Sparkles, ShoppingCart, Heart, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MealPlan } from '../types';
import { AIMealGenerator } from './AIMealGenerator';

export function MealPlanner() {
  const { mealPlans, setMealPlans, shoppingList, setShoppingList, currentUser, familyMembers } = useAppContext();
  const [editingMeal, setEditingMeal] = useState<MealPlan | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSaveMeal = (meal: MealPlan) => {
    if (editingMeal) {
      setMealPlans(mealPlans.map(m => m.id === meal.id ? meal : m));
    } else {
      setMealPlans([...mealPlans, { ...meal, id: Date.now().toString() }]);
    }
    setEditingMeal(null);
  };

  const handleDeleteMeal = (id: string) => {
    setMealPlans(mealPlans.filter(m => m.id !== id));
  };

  const handleAIGeneratedMeals = (newMeals: MealPlan[]) => {
    const mealsWithPreferences = newMeals.map(meal => {
      const childPreferences: { [childName: string]: string[] } = {};
      familyMembers.filter(m => m.role === 'child').forEach(child => {
        if (child.mealPreferences) {
          childPreferences[child.name] = child.mealPreferences;
        }
      });
      return { ...meal, childPreferences };
    });
    
    setMealPlans(mealsWithPreferences);
    setShowAIGenerator(false);
  };

  const generateShoppingList = () => {
    const ingredients = mealPlans.flatMap(meal => [
      ...meal.breakfast.split(',').map(item => item.trim()),
      ...meal.lunch.split(',').map(item => item.trim()),
      ...meal.dinner.split(',').map(item => item.trim()),
      ...(meal.snacks || []).flatMap(snack => snack.split(',').map(item => item.trim()))
    ]).filter(item => item.length > 0);

    const newItems = ingredients.map(ingredient => ({
      id: Date.now().toString() + Math.random(),
      name: ingredient,
      category: 'Groceries',
      quantity: '1',
      completed: false,
      addedBy: currentUser?.name || 'Meal Planner'
    }));

    setShoppingList([...shoppingList, ...newItems]);
  };

  const isReadOnly = currentUser?.role === 'child';
  const children = familyMembers.filter(m => m.role === 'child');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isReadOnly ? 'My Meals' : 'Weekly Meal Planner'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isReadOnly ? 'See what delicious meals are planned for you' : 'Plan delicious meals for your family'}
          </p>
        </div>
        {!isReadOnly && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAIGenerator(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Meal Generator
            </button>
            {currentUser?.role === 'cook' && (
              <button
                onClick={generateShoppingList}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Shopping List
              </button>
            )}
          </div>
        )}
      </div>

      {}
      {!isReadOnly && children.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center mb-4">
            <Heart className="h-5 w-5 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Children's Meal Preferences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children.map(child => (
              <div key={child.id} className="bg-white rounded-lg p-4 border border-orange-100">
                <h3 className="font-medium text-gray-900 mb-2">{child.name}</h3>
                {child.mealPreferences && child.mealPreferences.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {child.mealPreferences.map((pref, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {pref}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No preferences set</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-orange-700 mt-3">💡 Consider these preferences when planning meals to ensure everyone enjoys their food!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {daysOfWeek.map(day => {
          const dayMeal = mealPlans.find(meal => meal.day === day);
          return (
            <div key={day} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">{day}</h3>
              </div>
              <div className="p-6">
                {dayMeal ? (
                  <div className="space-y-4">
                    <MealSection title="Breakfast\" meal={dayMeal.breakfast} />
                    <MealSection title="Lunch" meal={dayMeal.lunch} />
                    <MealSection title="Dinner" meal={dayMeal.dinner} />
                    {dayMeal.snacks && dayMeal.snacks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Snacks</h4>
                        <div className="flex flex-wrap gap-2">
                          {dayMeal.snacks.map((snack, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                              {snack}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {}
                    {dayMeal.childPreferences && Object.keys(dayMeal.childPreferences).length > 0 && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-orange-600 mr-2" />
                          <span className="text-sm font-medium text-orange-800">Preferences Considered</span>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(dayMeal.childPreferences).map(([childName, preferences]) => (
                            <div key={childName} className="text-xs">
                              <span className="font-medium text-orange-700">{childName}:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {preferences.map((pref, index) => (
                                  <span key={index} className="px-1 py-0.5 bg-orange-100 text-orange-600 rounded">
                                    {pref}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isReadOnly && (
                      <div className="flex space-x-2 pt-4">
                        <button
                          onClick={() => setEditingMeal(dayMeal)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(dayMeal.id)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No meal planned</p>
                    {!isReadOnly && (
                      <button
                        onClick={() => setEditingMeal({
                          id: '',
                          day,
                          breakfast: '',
                          lunch: '',
                          dinner: '',
                          snacks: []
                        })}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Plan Meals
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {}
      {showAIGenerator && (
        <AIMealGenerator
          onMealsGenerated={handleAIGeneratedMeals}
          onClose={() => setShowAIGenerator(false)}
        />
      )}

      {}
      {editingMeal && (
        <MealEditor
          meal={editingMeal}
          familyMembers={familyMembers}
          onSave={handleSaveMeal}
          onCancel={() => setEditingMeal(null)}
        />
      )}
    </div>
  );
}

function MealSection({ title, meal }: { title: string; meal: string }) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{meal}</p>
    </div>
  );
}

interface MealEditorProps {
  meal: MealPlan;
  familyMembers: any[];
  onSave: (meal: MealPlan) => void;
  onCancel: () => void;
}

function MealEditor({ meal, familyMembers, onSave, onCancel }: MealEditorProps) {
  const [formData, setFormData] = useState(meal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const childPreferences: { [childName: string]: string[] } = {};
    familyMembers.filter(m => m.role === 'child').forEach(child => {
      if (child.mealPreferences) {
        childPreferences[child.name] = child.mealPreferences;
      }
    });
    
    onSave({ ...formData, childPreferences });
  };

  const children = familyMembers.filter(m => m.role === 'child');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Plan Meals for {formData.day}
          </h2>
        </div>

        {}
        {children.length > 0 && (
          <div className="px-6 py-4 bg-orange-50 border-b border-orange-200">
            <div className="flex items-center mb-3">
              <Heart className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-800">Consider Children's Preferences</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {children.map(child => (
                <div key={child.id} className="bg-white rounded p-3 border border-orange-100">
                  <h4 className="font-medium text-gray-900 text-sm mb-2">{child.name}</h4>
                  {child.mealPreferences && child.mealPreferences.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {child.mealPreferences.map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs">No preferences set</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breakfast
            </label>
            <input
              type="text"
              value={formData.breakfast}
              onChange={(e) => setFormData({ ...formData, breakfast: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter breakfast meal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lunch
            </label>
            <input
              type="text"
              value={formData.lunch}
              onChange={(e) => setFormData({ ...formData, lunch: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter lunch meal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dinner
            </label>
            <input
              type="text"
              value={formData.dinner}
              onChange={(e) => setFormData({ ...formData, dinner: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter dinner meal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Snacks (comma-separated)
            </label>
            <input
              type="text"
              value={formData.snacks?.join(', ') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                snacks: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter snacks separated by commas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Add any notes or special instructions"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
            >
              Save Meal Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}