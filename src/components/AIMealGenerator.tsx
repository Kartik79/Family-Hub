import React, { useState } from 'react';
import { Sparkles, Loader2, X, Key, Settings } from 'lucide-react';
import { MealPlan } from '../types';
import { useAppContext } from '../context/AppContext';

interface AIMealGeneratorProps {
  onMealsGenerated: (meals: MealPlan[]) => void;
  onClose: () => void;
}

export function AIMealGenerator({ onMealsGenerated, onClose }: AIMealGeneratorProps) {
  const { settings, setSettings } = useAppContext();
  const [step, setStep] = useState<'setup' | 'generating' | 'review'>('setup');
  const [generatedMeals, setGeneratedMeals] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(settings.openaiApiKey || '');
  const [saveApiKey, setSaveApiKey] = useState(false);

  const predefinedPrompt = "Give a meal plan for vegetarian Indian cuisine for breakfast lunch and dinner which can be prepared in at most an hour. Please provide exactly 7 days of meals in this format:\n\nMonday:\nBreakfast: [specific meal name]\nLunch: [specific meal name]\nDinner: [specific meal name]\nSnacks: [snack1, snack2]\n\nTuesday:\nBreakfast: [specific meal name]\nLunch: [specific meal name]\nDinner: [specific meal name]\nSnacks: [snack1, snack2]\n\n[Continue for all 7 days: Wednesday, Thursday, Friday, Saturday, Sunday]\n\nRequirements:\n- All meals should be vegetarian Indian cuisine\n- Each meal should take maximum 1 hour to prepare\n- Provide variety across the week\n- Include 2-3 healthy snack options per day\n- Make meals family-friendly and appealing";

  const handleSetupComplete = () => {
    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key to continue.');
      return;
    }

    if (saveApiKey) {
      setSettings({ ...settings, openaiApiKey: apiKey });
    }

    setStep('generating');
    generateWithChatGPT();
  };

  const generateWithChatGPT = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful meal planning assistant specializing in Indian vegetarian cuisine. Provide meal plans in the exact format requested.'
            },
            {
              role: 'user',
              content: predefinedPrompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const mealPlanText = data.choices[0].message.content;
      
      const meals = parseMealPlanResponse(mealPlanText);
      setGeneratedMeals(meals);
      setStep('review');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert(`Failed to generate meal plan: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and try again.`);
      setStep('setup');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseMealPlanResponse = (text: string): MealPlan[] => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const meals: MealPlan[] = [];

    days.forEach(day => {
      const dayRegex = new RegExp(`${day}:\\s*\\n?Breakfast:\\s*([^\\n]+)\\n?Lunch:\\s*([^\\n]+)\\n?Dinner:\\s*([^\\n]+)\\n?Snacks:\\s*([^\\n]+)`, 'i');
      const match = text.match(dayRegex);
      
      if (match) {
        const snacks = match[4] ? match[4].split(',').map(s => s.trim().replace(/^\[|\]$/g, '')) : [];
        meals.push({
          id: Date.now().toString() + day,
          day,
          breakfast: match[1].trim(),
          lunch: match[2].trim(),
          dinner: match[3].trim(),
          snacks
        });
      }
    });

    return meals;
  };

  if (step === 'setup') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Meal Generator Setup</h3>
            <p className="text-gray-600">Configure your OpenAI API key to generate personalized meal plans</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  OpenAI API Key
                </div>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="sk-..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Your API key is used to generate meal plans and is not stored permanently unless you choose to save it.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveApiKey"
                checked={saveApiKey}
                onChange={(e) => setSaveApiKey(e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="saveApiKey" className="ml-2 block text-sm text-gray-900">
                Save API key for future use
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Settings className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">How to get your API key:</h4>
                  <ol className="mt-2 text-xs text-blue-800 space-y-1">
                    <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI API Keys</a></li>
                    <li>2. Sign in or create an account</li>
                    <li>3. Click "Create new secret key"</li>
                    <li>4. Copy and paste the key here</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSetupComplete}
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Generate Meals
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <Loader2 className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Meal Plan</h3>
          <p className="text-gray-600">AI is creating vegetarian Indian meals that can be prepared in under an hour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Review Generated Meal Plan</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Vegetarian Indian cuisine - Quick preparation (under 1 hour)</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {generatedMeals.map(meal => (
              <div key={meal.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-center bg-white rounded-md py-2">{meal.day}</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-md p-2">
                    <span className="font-medium text-orange-700">Breakfast:</span> 
                    <span className="block text-gray-800 mt-1">{meal.breakfast}</span>
                  </div>
                  <div className="bg-white rounded-md p-2">
                    <span className="font-medium text-orange-700">Lunch:</span> 
                    <span className="block text-gray-800 mt-1">{meal.lunch}</span>
                  </div>
                  <div className="bg-white rounded-md p-2">
                    <span className="font-medium text-orange-700">Dinner:</span> 
                    <span className="block text-gray-800 mt-1">{meal.dinner}</span>
                  </div>
                  {meal.snacks && meal.snacks.length > 0 && (
                    <div className="bg-white rounded-md p-2">
                      <span className="font-medium text-orange-700">Snacks:</span> 
                      <span className="block text-gray-800 mt-1">{meal.snacks.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setStep('setup');
                setGeneratedMeals([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Generate New Plan
            </button>
            <button
              onClick={() => onMealsGenerated(generatedMeals)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-200"
            >
              Use This Meal Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}