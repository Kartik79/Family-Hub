import React, { useState } from 'react';
import { ShoppingCart, Plus, Check, X, Filter, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ShoppingItem } from '../types';

export function ShoppingList() {
  const { shoppingList, setShoppingList, currentUser } = useAppContext();
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Produce', 'Dairy', 'Meat', 'Pantry', 'Frozen', 'Household', 'Other'];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        name: newItem.trim(),
        category: 'Other',
        quantity: '1',
        completed: false,
        addedBy: currentUser?.name || 'Unknown',
      };
      setShoppingList([...shoppingList, item]);
      setNewItem('');
    }
  };

  const toggleItemCompleted = (id: string) => {
    setShoppingList(shoppingList.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ShoppingItem>) => {
    setShoppingList(shoppingList.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const filteredItems = shoppingList.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedItems = filteredItems.filter(item => item.completed);
  const pendingItems = filteredItems.filter(item => !item.completed);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping List</h1>
        <p className="text-gray-600 mt-2">Keep track of what you need from the store</p>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <form onSubmit={handleAddItem} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add a new item to your shopping list..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </form>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {}
      <div className="space-y-6">
        {}
        {pendingItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                To Buy ({pendingItems.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingItems.map(item => (
                <ShoppingItemRow
                  key={item.id}
                  item={item}
                  onToggle={toggleItemCompleted}
                  onDelete={deleteItem}
                  onUpdate={updateItem}
                />
              ))}
            </div>
          </div>
        )}

        {}
        {completedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Completed ({completedItems.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {completedItems.map(item => (
                <ShoppingItemRow
                  key={item.id}
                  item={item}
                  onToggle={toggleItemCompleted}
                  onDelete={deleteItem}
                  onUpdate={updateItem}
                />
              ))}
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your filters or search term'
                : 'Start by adding some items to your shopping list'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ShoppingItem>) => void;
}

function ShoppingItemRow({ item, onToggle, onDelete, onUpdate }: ShoppingItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);
  const [editCategory, setEditCategory] = useState(item.category);

  const categories = ['Produce', 'Dairy', 'Meat', 'Pantry', 'Frozen', 'Household', 'Other'];

  const handleSave = () => {
    onUpdate(item.id, {
      name: editName,
      quantity: editQuantity,
      category: editCategory,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditCategory(item.category);
    setIsEditing(false);
  };

  return (
    <div className={`p-4 ${item.completed ? 'opacity-60' : ''}`}>
      {isEditing ? (
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            value={editQuantity}
            onChange={(e) => setEditQuantity(e.target.value)}
            className="w-20 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-700"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggle(item.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                item.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-gray-300 hover:border-emerald-500'
              }`}
            >
              {item.completed && <Check className="h-3 w-3" />}
            </button>
            <div className="flex-1">
              <div className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {item.name}
              </div>
              <div className="text-sm text-gray-500">
                {item.quantity} • {item.category} • Added by {item.addedBy}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}