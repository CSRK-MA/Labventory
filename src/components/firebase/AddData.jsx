// src/components/firebase/AddData.jsx
// Component for adding new equipment/items to Firestore

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebase';

export function AddData() {
  // State for form data
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchasePrice: '',
    condition: 'excellent',
    status: 'available',
    location: '',
    description: ''
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess(false);
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.itemName.trim()) {
      setError('Item name is required');
      return false;
    }
    if (!formData.itemCode.trim()) {
      setError('Item code is required');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Prepare data for Firestore
      const dataToSave = {
        ...formData,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add document to Firestore
      const docRef = await addDoc(
        collection(db, COLLECTIONS.EQUIPMENT), 
        dataToSave
      );

      console.log('Document written with ID: ', docRef.id);
      
      // Show success message
      setSuccess(true);
      alert('✅ Equipment added successfully!\nDocument ID: ' + docRef.id);

      // Reset form
      setFormData({
        itemName: '',
        itemCode: '',
        category: '',
        brand: '',
        model: '',
        serialNumber: '',
        purchasePrice: '',
        condition: 'excellent',
        status: 'available',
        location: '',
        description: ''
      });

    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Failed to add equipment: ' + err.message);
      alert('❌ Error: Failed to add equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      itemName: '',
      itemCode: '',
      category: '',
      brand: '',
      model: '',
      serialNumber: '',
      purchasePrice: '',
      condition: 'excellent',
      status: 'available',
      location: '',
      description: ''
    });
    setError('');
    setSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
            Add New Equipment
          </h2>
          <p className="text-gray-600">
            Fill in the details below to add new equipment to the inventory
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm sm:text-base">
              ✅ Equipment added successfully!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm sm:text-base">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Item Name & Item Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="itemName" className="block text-sm text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g., Digital pH Meter"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="itemCode" className="block text-sm text-gray-700 mb-2">
                Item Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="itemCode"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                placeholder="e.g., EQ-PH-001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Row 2: Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="category" className="block text-sm text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Category</option>
                <option value="Glassware">Glassware</option>
                <option value="Instruments">Instruments</option>
                <option value="Electronics">Electronics</option>
                <option value="Safety Equipment">Safety Equipment</option>
                <option value="Chemicals">Chemicals</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Mettler Toledo"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Row 3: Model & Serial Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="model" className="block text-sm text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., SevenCompact S220"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-sm text-gray-700 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g., SN12345678"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Row 4: Purchase Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="purchasePrice" className="block text-sm text-gray-700 mb-2">
                Purchase Price ($)
              </label>
              <input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder="e.g., 1250.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Shelf A-12, Lab Room 101"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Row 5: Condition & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="condition" className="block text-sm text-gray-700 mb-2">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="available">Available</option>
                <option value="in-use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>

          {/* Row 6: Description */}
          <div>
            <label htmlFor="description" className="block text-sm text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description of the equipment..."
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Equipment'
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
