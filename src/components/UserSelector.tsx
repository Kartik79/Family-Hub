import React, { useState } from 'react';
import { Crown, ChefHat, Car, Baby, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';

export function UserSelector() {
  const { setCurrentUser, familyMembers } = useAppContext();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
    setPassword('');
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) return;
    if (password === selectedMember.password) {
      const user: User = {
        id: selectedMember.id,
        name: selectedMember.name,
        role: selectedMember.role,
      };
      setCurrentUser(user);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleBack = () => {
    setSelectedMember(null);
    setPassword('');
    setError('');
  };

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
        return Crown;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-purple-500 to-purple-600';
      case 'cook':
        return 'from-orange-500 to-orange-600';
      case 'driver':
        return 'from-green-500 to-green-600';
      case 'child':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full access to all family management features';
      case 'cook':
        return 'Meal planning and shopping list management';
      case 'driver':
        return 'Activity scheduling and transportation coordination';
      case 'child':
        return 'View meals and personal activities';
      default:
        return '';
    }
  };

  if (selectedMember) {
    const RoleIcon = getRoleIcon(selectedMember.role);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className={`h-20 w-20 bg-gradient-to-r ${getRoleColor(selectedMember.role)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <RoleIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMember.name}</h2>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                selectedMember.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                selectedMember.role === 'cook' ? 'bg-orange-100 text-orange-800' :
                selectedMember.role === 'driver' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {selectedMember.role.charAt(0).toUpperCase() + selectedMember.role.slice(1)}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
                >
                  Login
                </button>
              </div>
            </form>

            {}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <strong>Demo Password:</strong> {selectedMember.password}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to FamilyHub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your all-in-one family management solution. Choose your profile to access personalized features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {familyMembers.map(member => {
            const RoleIcon = getRoleIcon(member.role);
            return (
              <button
                key={member.id}
                onClick={() => handleMemberSelect(member)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-center"
              >
                <div className={`h-16 w-16 bg-gradient-to-r ${getRoleColor(member.role)} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <RoleIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                  member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  member.role === 'cook' ? 'bg-orange-100 text-orange-800' :
                  member.role === 'driver' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </div>
                
                <p className="text-gray-600 text-xs leading-relaxed mb-3">
                  {getRoleDescription(member.role)}
                </p>

                <div className="flex items-center justify-center text-gray-400">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-xs">Password Protected</span>
                </div>
                
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-300 transition-colors duration-300"></div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Each role provides access to specific features tailored to family responsibilities.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            🔒 All accounts are password protected for security
          </p>
        </div>
      </div>
    </div>
  );
}