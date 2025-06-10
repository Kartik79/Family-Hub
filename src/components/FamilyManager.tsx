import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Crown, ChefHat, Car, Baby, Heart, Star, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FamilyMember } from '../types';

export function FamilyManager() {
  const { familyMembers, setFamilyMembers } = useAppContext();
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const handleSaveMember = (member: FamilyMember) => {
    if (editingMember && editingMember.id) {
      setFamilyMembers(familyMembers.map(m => m.id === member.id ? member : m));
    } else {
      setFamilyMembers([...familyMembers, { ...member, id: Date.now().toString() }]);
    }
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const getRoleIcon = (role: FamilyMember['role']) => {
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
        return Users;
    }
  };

  const getRoleColor = (role: FamilyMember['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cook':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'driver':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'child':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
          <p className="text-gray-600 mt-2">Manage your family members, their roles, and preferences</p>
        </div>
        <button
          onClick={() => setEditingMember({
            id: '',
            name: '',
            role: 'admin',
            password: '',
            preferences: [],
            mealPreferences: [],
            activityPreferences: [],
          })}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map(member => {
          const RoleIcon = getRoleIcon(member.role);
          return (
            <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-700">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Password: {member.password ? '••••••••' : 'Not set'}</span>
                  </div>
                </div>

                {}
                {member.mealPreferences && member.mealPreferences.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <ChefHat className="h-4 w-4 text-orange-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-700">Meal Preferences</h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.mealPreferences.map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {}
                {member.activityPreferences && member.activityPreferences.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-indigo-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-700">Activity Preferences</h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.activityPreferences.map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {}
                {member.preferences && member.preferences.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Heart className="h-4 w-4 text-pink-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-700">General Preferences</h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.preferences.map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {familyMembers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No family members</h3>
          <p className="text-gray-500 mb-6">Start by adding your family members to get organized</p>
          <button
            onClick={() => setEditingMember({
              id: '',
              name: '',
              role: 'admin',
              password: '',
              preferences: [],
              mealPreferences: [],
              activityPreferences: [],
            })}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Member
          </button>
        </div>
      )}

      {}
      {editingMember && (
        <MemberEditor
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={() => setEditingMember(null)}
        />
      )}
    </div>
  );
}

interface MemberEditorProps {
  member: FamilyMember;
  onSave: (member: FamilyMember) => void;
  onCancel: () => void;
}

function MemberEditor({ member, onSave, onCancel }: MemberEditorProps) {
  const [formData, setFormData] = useState(member);
  const [preferencesText, setPreferencesText] = useState(
    member.preferences?.join(', ') || ''
  );
  const [mealPreferencesText, setMealPreferencesText] = useState(
    member.mealPreferences?.join(', ') || ''
  );
  const [activityPreferencesText, setActivityPreferencesText] = useState(
    member.activityPreferences?.join(', ') || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preferences = preferencesText
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    const mealPreferences = mealPreferencesText
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    const activityPreferences = activityPreferencesText
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    onSave({
      ...formData,
      preferences,
      mealPreferences,
      activityPreferences,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {member.id ? 'Edit Family Member' : 'Add Family Member'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as FamilyMember['role'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="admin">Admin/Parent</option>
                <option value="cook">Cook</option>
                <option value="driver">Driver</option>
                <option value="child">Child</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-gray-600 mr-2" />
                Password
              </div>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a secure password"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              This password will be required to access this family member's account
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <ChefHat className="h-4 w-4 text-orange-600 mr-2" />
                Meal Preferences (comma-separated)
              </div>
            </label>
            <input
              type="text"
              value={mealPreferencesText}
              onChange={(e) => setMealPreferencesText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., mild spice, sweet dishes, no vegetables, rice dishes"
            />
            <p className="mt-1 text-sm text-gray-500">
              These preferences will be shown to cooks when planning meals
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-indigo-600 mr-2" />
                Activity Preferences (comma-separated)
              </div>
            </label>
            <input
              type="text"
              value={activityPreferencesText}
              onChange={(e) => setActivityPreferencesText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., soccer, music, art, swimming, outdoor activities"
            />
            <p className="mt-1 text-sm text-gray-500">
              These preferences will be shown to parents when planning activities
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-pink-600 mr-2" />
                General Preferences (comma-separated)
              </div>
            </label>
            <input
              type="text"
              value={preferencesText}
              onChange={(e) => setPreferencesText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., loves outdoors, early riser, quiet activities"
            />
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {member.id ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}