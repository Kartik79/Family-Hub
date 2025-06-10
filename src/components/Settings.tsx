import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Save, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Settings() {
  const { settings, setSettings } = useAppContext();
  const [apiKey, setApiKey] = useState(settings.openaiApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    setSettings({ ...settings, openaiApiKey: apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setSettings({ ...settings, openaiApiKey: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your application preferences and API configurations</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 text-gray-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">AI Meal Generator Configuration</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                OpenAI API Key
              </div>
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="sk-..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Clear API key"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your OpenAI API key is used to generate personalized meal plans. It's stored locally and never shared.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">How to get your OpenAI API key:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">OpenAI API Keys page</a></li>
              <li>2. Sign in to your OpenAI account (or create one if needed)</li>
              <li>3. Click "Create new secret key"</li>
              <li>4. Give your key a name and copy it</li>
              <li>5. Paste the key in the field above</li>
            </ol>
            <p className="text-xs text-blue-700 mt-2">
              Note: You'll need to add billing information to your OpenAI account to use the API.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                saved 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About API Usage</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• The AI meal generator uses OpenAI's GPT-3.5-turbo model to create personalized meal plans</p>
          <p>• Each meal plan generation typically costs less than $0.01 USD</p>
          <p>• Your API key is stored locally in your browser and is never transmitted to our servers</p>
          <p>• You can remove your API key at any time using the trash icon next to the input field</p>
        </div>
      </div>
    </div>
  );
}