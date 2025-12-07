// src/AppFirebaseExample.jsx
// Example App.js file showing how to integrate AddData and ViewData components

import { useState } from 'react';
import { AddData } from './components/firebase/AddData';
import { ViewData } from './components/firebase/ViewData';
import { Database, Plus, List } from 'lucide-react';

function AppFirebaseExample() {
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'add'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Firebase Integration Demo
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Lab Inventory Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all ${
              activeTab === 'view'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">View Data</span>
          </button>
          
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Add Data</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-12">
        {activeTab === 'view' && <ViewData />}
        {activeTab === 'add' && <AddData />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Firebase + React Integration for Lab Inventory Management
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Powered by Firestore Database
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppFirebaseExample;
