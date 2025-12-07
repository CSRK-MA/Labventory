// src/components/qr/QRCheckInOut.jsx
// Integrated QR-based Check-In/Out System

import { useState } from 'react';
import { QRScanner } from './QRScanner';
import { 
  Package, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  QrCode,
  Calendar
} from 'lucide-react';
import { 
  addDoc, 
  updateDoc, 
  doc, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebase';

export function QRCheckInOut({ userInfo }) {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [action, setAction] = useState('check-out'); // 'check-out' or 'check-in'
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState(2); // hours
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  // Handle QR scan success
  const handleScanSuccess = (itemData) => {
    console.log('Item scanned:', itemData);
    setSelectedItem(itemData);
    setShowScanner(false);

    // Auto-determine action based on item status
    if (itemData.status === 'available') {
      setAction('check-out');
    } else if (itemData.status === 'in-use') {
      setAction('check-in');
    }
  };

  // Process check-out
  const handleCheckOut = async () => {
    if (!selectedItem || !purpose.trim()) {
      alert('Please provide a purpose for checking out');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      // Validate item is available
      if (selectedItem.status !== 'available') {
        throw new Error('Item is not available for checkout');
      }

      const checkOutTime = new Date();
      const expectedReturnTime = new Date(checkOutTime.getTime() + duration * 60 * 60 * 1000);

      // Create check-out transaction
      const transactionData = {
        itemType: selectedItem.type || 'equipment',
        itemId: selectedItem.id,
        itemName: selectedItem.itemName || selectedItem.chemicalName,
        itemCode: selectedItem.itemCode || selectedItem.chemicalCode,
        userId: userInfo?.uid || 'unknown',
        userName: userInfo?.displayName || userInfo?.email || 'User',
        userEmail: userInfo?.email || '',
        action: 'check-out',
        purpose: purpose,
        checkOutTime: serverTimestamp(),
        expectedReturnTime: new Date(expectedReturnTime),
        returned: false,
        createdAt: serverTimestamp()
      };

      // Add transaction to database
      const transactionRef = await addDoc(
        collection(db, COLLECTIONS.CHECKINOUT),
        transactionData
      );

      // Update item status to 'in-use'
      const itemCollection = selectedItem.type === 'chemical' 
        ? COLLECTIONS.CHEMICALS 
        : COLLECTIONS.EQUIPMENT;

      await updateDoc(doc(db, itemCollection, selectedItem.id), {
        status: 'in-use',
        currentUser: userInfo?.uid || 'unknown',
        currentUserName: userInfo?.displayName || userInfo?.email || 'User',
        lastCheckOut: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Success
      setResult({
        success: true,
        message: 'Item checked out successfully',
        transactionId: transactionRef.id,
        expectedReturn: expectedReturnTime
      });

      console.log('✅ Check-out successful:', transactionRef.id);
      
      // Reset form after delay
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('❌ Check-out failed:', error);
      setResult({
        success: false,
        message: error.message || 'Failed to check out item'
      });
    } finally {
      setProcessing(false);
    }
  };

  // Process check-in
  const handleCheckIn = async () => {
    if (!selectedItem) return;

    setProcessing(true);
    setResult(null);

    try {
      // Validate item is in-use
      if (selectedItem.status !== 'in-use') {
        throw new Error('Item is not currently checked out');
      }

      // Create check-in transaction
      const transactionData = {
        itemType: selectedItem.type || 'equipment',
        itemId: selectedItem.id,
        itemName: selectedItem.itemName || selectedItem.chemicalName,
        itemCode: selectedItem.itemCode || selectedItem.chemicalCode,
        userId: userInfo?.uid || 'unknown',
        userName: userInfo?.displayName || userInfo?.email || 'User',
        userEmail: userInfo?.email || '',
        action: 'check-in',
        returnTime: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      // Add transaction to database
      const transactionRef = await addDoc(
        collection(db, COLLECTIONS.CHECKINOUT),
        transactionData
      );

      // Update item status to 'available'
      const itemCollection = selectedItem.type === 'chemical' 
        ? COLLECTIONS.CHEMICALS 
        : COLLECTIONS.EQUIPMENT;

      await updateDoc(doc(db, itemCollection, selectedItem.id), {
        status: 'available',
        currentUser: null,
        currentUserName: null,
        lastCheckIn: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Success
      setResult({
        success: true,
        message: 'Item checked in successfully',
        transactionId: transactionRef.id
      });

      console.log('✅ Check-in successful:', transactionRef.id);
      
      // Reset form after delay
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('❌ Check-in failed:', error);
      setResult({
        success: false,
        message: error.message || 'Failed to check in item'
      });
    } finally {
      setProcessing(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedItem(null);
    setPurpose('');
    setDuration(2);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
            QR Check-In/Out
          </h2>
          <p className="text-gray-600">
            Scan QR code to quickly check items in or out
          </p>
        </div>

        {/* Scan Button */}
        {!selectedItem && !result && (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-6">
              <QrCode className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-3">Ready to Scan</h3>
            <p className="text-gray-600 mb-6">
              Scan item's QR code to check it in or out
            </p>
            <button
              onClick={() => setShowScanner(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all text-lg"
            >
              Open QR Scanner
            </button>
          </div>
        )}

        {/* Selected Item Details */}
        {selectedItem && !result && (
          <div className="space-y-6">
            {/* Item Info Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-gray-900 mb-2">
                    {selectedItem.itemName || selectedItem.chemicalName}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Code:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedItem.itemCode || selectedItem.chemicalCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedItem.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Selector */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Action
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAction('check-out')}
                  disabled={selectedItem.status !== 'available'}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    action === 'check-out'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${selectedItem.status !== 'available' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-center">
                    <div className="text-lg text-gray-900">Check Out</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Take item for use
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setAction('check-in')}
                  disabled={selectedItem.status !== 'in-use'}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    action === 'check-in'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${selectedItem.status !== 'in-use' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-center">
                    <div className="text-lg text-gray-900">Check In</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Return item
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Check-out Form */}
            {action === 'check-out' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Purpose <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Chemistry Lab Experiment"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Expected Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                    min="1"
                    max="24"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="text-blue-900">Expected Return</div>
                      <div className="text-blue-700">
                        {new Date(Date.now() + duration * 60 * 60 * 1000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div className="text-sm">
                  <div className="text-gray-600">Processing as:</div>
                  <div className="text-gray-900">
                    {userInfo?.displayName || userInfo?.email || 'User'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={action === 'check-out' ? handleCheckOut : handleCheckIn}
                disabled={processing || (action === 'check-out' && !purpose.trim())}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : action === 'check-out' ? 'Check Out' : 'Check In'}
              </button>
            </div>
          </div>
        )}

        {/* Result Message */}
        {result && (
          <div className={`border-2 rounded-xl p-6 ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg mb-2 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? 'Success!' : 'Error'}
                </h3>
                <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </p>
                {result.expectedReturn && (
                  <p className="text-sm text-green-700 mt-2">
                    Expected return: {result.expectedReturn.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="mt-4 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Scan Another Item
            </button>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
