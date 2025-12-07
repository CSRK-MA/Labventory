// src/components/qr/QRScanner.jsx
// QR Code Scanner with camera and manual entry fallback

import { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getEquipmentById } from '../../services/firebaseHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebase';

export function QRScanner({ onScanSuccess, onClose }) {
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'manual'
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScanner = useRef(null);

  // Initialize QR Scanner
  useEffect(() => {
    if (scanMode === 'camera' && !scanning) {
      initializeScanner();
    }

    return () => {
      cleanupScanner();
    };
  }, [scanMode]);

  const initializeScanner = async () => {
    try {
      setScanning(true);
      setError(null);

      html5QrcodeScanner.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true
        },
        false
      );

      html5QrcodeScanner.current.render(
        onScanSuccess_internal,
        onScanFailure
      );
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError('Failed to initialize camera. Please check permissions.');
      setScanning(false);
    }
  };

  const cleanupScanner = () => {
    if (html5QrcodeScanner.current) {
      try {
        html5QrcodeScanner.current.clear();
      } catch (err) {
        console.error('Cleanup error:', err);
      }
    }
  };

  const onScanSuccess_internal = async (decodedText, decodedResult) => {
    console.log('QR Code scanned:', decodedText);
    setScanning(false);
    cleanupScanner();
    
    await processQRCode(decodedText);
  };

  const onScanFailure = (error) => {
    // Silent - scanning continues
  };

  // Process QR code data
  const processQRCode = async (qrData) => {
    setLoading(true);
    setError(null);

    try {
      // Try to parse as JSON
      let parsedData;
      try {
        parsedData = JSON.parse(qrData);
      } catch {
        // If not JSON, treat as item code
        parsedData = { code: qrData };
      }

      console.log('Parsed QR data:', parsedData);

      // Fetch item details from database
      let itemData = null;

      if (parsedData.id) {
        // If we have an ID, fetch directly
        const collectionName = parsedData.type === 'chemical' 
          ? COLLECTIONS.CHEMICALS 
          : COLLECTIONS.EQUIPMENT;
        
        const docRef = doc(db, collectionName, parsedData.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          itemData = {
            id: docSnap.id,
            type: parsedData.type,
            ...docSnap.data()
          };
        }
      } else if (parsedData.code) {
        // Search by code
        itemData = await searchByCode(parsedData.code);
      }

      if (itemData) {
        setResult({
          success: true,
          data: itemData,
          scannedAt: new Date()
        });

        // Call parent callback
        if (onScanSuccess) {
          onScanSuccess(itemData);
        }
      } else {
        setError('Item not found in database');
        setResult({
          success: false,
          message: 'Item not found'
        });
      }
    } catch (err) {
      console.error('QR processing error:', err);
      setError(err.message);
      setResult({
        success: false,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Search for item by code
  const searchByCode = async (code) => {
    // This is a simplified version - in production, use proper indexed queries
    try {
      const collections = [COLLECTIONS.EQUIPMENT, COLLECTIONS.CHEMICALS];
      
      for (const collectionName of collections) {
        const snapshot = await getDocs(
          query(
            collection(db, collectionName),
            where('itemCode', '==', code)
          )
        );

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          return {
            id: doc.id,
            type: collectionName === COLLECTIONS.CHEMICALS ? 'chemical' : 'equipment',
            ...doc.data()
          };
        }

        // Try chemical code if equipment code didn't match
        const chemSnapshot = await getDocs(
          query(
            collection(db, collectionName),
            where('chemicalCode', '==', code)
          )
        );

        if (!chemSnapshot.empty) {
          const doc = chemSnapshot.docs[0];
          return {
            id: doc.id,
            type: 'chemical',
            ...doc.data()
          };
        }
      }

      return null;
    } catch (err) {
      console.error('Search error:', err);
      return null;
    }
  };

  // Manual code entry
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    await processQRCode(manualCode);
  };

  // Reset scanner
  const handleReset = () => {
    setResult(null);
    setError(null);
    setManualCode('');
    if (scanMode === 'camera') {
      setScanning(false);
      setTimeout(() => initializeScanner(), 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl text-gray-900">QR Code Scanner</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => {
                cleanupScanner();
                setScanMode('camera');
                setResult(null);
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                scanMode === 'camera'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Camera className="w-5 h-5" />
              Camera Scan
            </button>
            <button
              onClick={() => {
                cleanupScanner();
                setScanMode('manual');
                setScanning(false);
                setResult(null);
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                scanMode === 'manual'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Keyboard className="w-5 h-5" />
              Manual Entry
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Camera Mode */}
          {scanMode === 'camera' && !result && (
            <div>
              <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
              <p className="text-sm text-gray-600 text-center mt-4">
                Position QR code within the frame to scan
              </p>
            </div>
          )}

          {/* Manual Entry Mode */}
          {scanMode === 'manual' && !result && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Enter Item Code or QR Data
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g., EQ-001 or paste QR data"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!manualCode.trim() || loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Look Up Item'}
              </button>
            </form>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Fetching item details...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={handleReset}
                    className="text-sm text-red-600 hover:text-red-700 underline mt-2"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && result.success && result.data && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-800">Item Found!</span>
                </div>
              </div>

              <ItemDetails item={result.data} />

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Item Details Component
function ItemDetails({ item }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div>
        <div className="text-sm text-gray-600">Name</div>
        <div className="text-lg text-gray-900">
          {item.itemName || item.chemicalName}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600">Code</div>
          <div className="text-gray-900">
            {item.itemCode || item.chemicalCode}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600">Status</div>
          <div>
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              item.status === 'available' ? 'bg-green-100 text-green-800' :
              item.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
              item.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.status}
            </span>
          </div>
        </div>
      </div>

      {item.category && (
        <div>
          <div className="text-sm text-gray-600">Category</div>
          <div className="text-gray-900">{item.category}</div>
        </div>
      )}

      {item.location && (
        <div>
          <div className="text-sm text-gray-600">Location</div>
          <div className="text-gray-900">{item.location}</div>
        </div>
      )}

      {item.description && (
        <div>
          <div className="text-sm text-gray-600">Description</div>
          <div className="text-gray-700 text-sm">{item.description}</div>
        </div>
      )}
    </div>
  );
}
