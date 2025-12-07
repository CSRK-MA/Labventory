import { useState, useEffect, useRef } from "react";
import { Package, Calendar, User, Search, QrCode, Camera, LogIn, LogOut, X, Clock } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import {
  addCheckInOut,
  subscribeToEquipment,
  subscribeToChemicals,
  updateEquipment,
  updateChemical,
  CheckInOut as CheckInOutType,
  Equipment,
  Chemical
} from "../../services/firebaseService";
import { auth } from "../../firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";

export function CheckInOut() {
  const [checkInOutHistory, setCheckInOutHistory] = useState<CheckInOutType[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const [showItemQRModal, setShowItemQRModal] = useState(false);
  const [selectedItemForQR, setSelectedItemForQR] = useState<Equipment | Chemical | null>(null);
  const [scannerMode, setScannerMode] = useState<"checkout" | "checkin">("checkout");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "equipment" | "chemical">("all");
  const [filterAction, setFilterAction] = useState<"all" | "check-in" | "check-out">("all");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>("");

  const [formData, setFormData] = useState({
    itemType: "equipment" as "equipment" | "chemical",
    itemId: "",
    itemName: "",
    quantity: 1,
    purpose: "",
    userName: auth.currentUser?.displayName || auth.currentUser?.email || "Unknown User",
    userEmail: auth.currentUser?.email || ""
  });

  // Real-time subscriptions to all data
  useEffect(() => {
    // Subscribe to check-in/out history (real-time)
    const unsubHistory = onSnapshot(
      query(collection(db, 'checkInOut'), orderBy('timestamp', 'desc'), limit(50)),
      (snapshot) => {
        const history: CheckInOutType[] = [];
        snapshot.forEach((doc) => {
          history.push({ id: doc.id, ...doc.data() } as CheckInOutType);
        });
        setCheckInOutHistory(history);
      },
      (error) => {
        console.error('Error subscribing to check-in/out history:', error);
      }
    );

    // Subscribe to equipment (real-time)
    const unsubEquipment = subscribeToEquipment((equipmentData) => {
      setEquipment(equipmentData);
    });

    // Subscribe to chemicals (real-time)
    const unsubChemicals = subscribeToChemicals((chemicalData) => {
      setChemicals(chemicalData);
    });

    return () => {
      unsubHistory();
      unsubEquipment();
      unsubChemicals();
    };
  }, []);

  // QR Code Scanner Setup
  const startQRScanner = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanQRCode();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopQRScanner = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple QR detection simulation (in production, use jsQR library)
      // For demo: we'll use a simpler approach
      try {
        // In real implementation, use: const code = jsQR(imageData.data, imageData.width, imageData.height);
        // For now, we'll simulate scanning
      } catch (error) {
        console.error("QR scan error:", error);
      }
    }

    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const handleQRScan = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      const { id, name, type } = parsedData;

      // Auto-fill form with scanned data
      setFormData({
        ...formData,
        itemType: type || "equipment",
        itemId: id,
        itemName: name
      });

      stopQRScanner();
      setShowQRScannerModal(false);
      
      if (scannerMode === "checkout") {
        setShowCheckOutModal(true);
      } else {
        setShowCheckInModal(true);
      }
      
      toast.success(`Scanned: ${name}`);
    } catch (error) {
      toast.error("Invalid QR code");
    }
  };

  // Manual QR code input for testing
  const handleManualQRInput = () => {
    if (scannedData) {
      handleQRScan(scannedData);
      setScannedData("");
    }
  };

  const handleCheckOut = async () => {
    if (!formData.itemId || !formData.itemName || formData.quantity <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const result = await addCheckInOut({
      itemId: formData.itemId,
      itemName: formData.itemName,
      itemType: formData.itemType,
      userName: formData.userName,
      userEmail: formData.userEmail,
      action: "check-out",
      quantity: formData.quantity,
      purpose: formData.purpose,
      timestamp: new Date()
    });

    if (result.success) {
      if (formData.itemType === "equipment") {
        const item = equipment.find(e => e.id === formData.itemId);
        if (item) {
          await updateEquipment(formData.itemId, {
            status: "In Use",
            quantity: Math.max(0, (item.quantity || 0) - formData.quantity)
          });
        }
      } else {
        const item = chemicals.find(c => c.id === formData.itemId);
        if (item) {
          await updateChemical(formData.itemId, {
            quantity: Math.max(0, item.quantity - formData.quantity)
          });
        }
      }

      toast.success("✅ Item checked out successfully!");
      setShowCheckOutModal(false);
      resetForm();
    } else {
      toast.error("Failed to check out item");
    }
  };

  const handleCheckIn = async () => {
    if (!formData.itemId || !formData.itemName || formData.quantity <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const result = await addCheckInOut({
      itemId: formData.itemId,
      itemName: formData.itemName,
      itemType: formData.itemType,
      userName: formData.userName,
      userEmail: formData.userEmail,
      action: "check-in",
      quantity: formData.quantity,
      purpose: formData.purpose,
      timestamp: new Date()
    });

    if (result.success) {
      if (formData.itemType === "equipment") {
        const item = equipment.find(e => e.id === formData.itemId);
        if (item) {
          await updateEquipment(formData.itemId, {
            status: "Available",
            quantity: (item.quantity || 0) + formData.quantity
          });
        }
      } else {
        const item = chemicals.find(c => c.id === formData.itemId);
        if (item) {
          await updateChemical(formData.itemId, {
            quantity: item.quantity + formData.quantity
          });
        }
      }

      toast.success("✅ Item checked in successfully!");
      setShowCheckInModal(false);
      resetForm();
    } else {
      toast.error("Failed to check in item");
    }
  };

  const resetForm = () => {
    setFormData({
      itemType: "equipment",
      itemId: "",
      itemName: "",
      quantity: 1,
      purpose: "",
      userName: auth.currentUser?.displayName || auth.currentUser?.email || "Unknown User",
      userEmail: auth.currentUser?.email || ""
    });
  };

  const formatDate = (date: Date | any) => {
    try {
      let d: Date;
      if (typeof date === 'object' && 'toDate' in date) {
        d = date.toDate();
      } else if (date instanceof Date) {
        d = date;
      } else {
        d = new Date(date);
      }
      return d.toLocaleString();
    } catch {
      return "N/A";
    }
  };

  const filteredHistory = checkInOutHistory.filter(record => {
    const matchesSearch = record.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || record.itemType === filterType;
    const matchesAction = filterAction === "all" || record.action === filterAction;
    return matchesSearch && matchesType && matchesAction;
  });

  const todayCheckOuts = checkInOutHistory.filter(r => {
    const today = new Date().toDateString();
    const recordDate = new Date(r.timestamp).toDateString();
    return recordDate === today && r.action === "check-out";
  }).length;

  const todayCheckIns = checkInOutHistory.filter(r => {
    const today = new Date().toDateString();
    const recordDate = new Date(r.timestamp).toDateString();
    return recordDate === today && r.action === "check-in";
  }).length;

  const activeCheckouts = checkInOutHistory.filter(r => r.action === "check-out").length - 
                          checkInOutHistory.filter(r => r.action === "check-in").length;

  const openItemQR = (item: Equipment | Chemical, type: "equipment" | "chemical") => {
    setSelectedItemForQR(item);
    setShowItemQRModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl text-gray-900">🔄 Real-Time Check-In/Out</h1>
          <p className="text-gray-600 mt-1">Scan QR codes to track equipment instantly</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl mb-2">📤 Check Out</h2>
              <p className="text-blue-100">Scan QR or select manually</p>
            </div>
            <LogOut className="w-12 h-12 opacity-80" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setScannerMode("checkout");
                setShowQRScannerModal(true);
                startQRScanner();
              }}
              className="flex flex-col items-center gap-2 p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm">Scan QR</span>
            </button>
            <button 
              onClick={() => setShowCheckOutModal(true)}
              className="flex flex-col items-center gap-2 p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <Package className="w-6 h-6" />
              <span className="text-sm">Manual</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl mb-2">📥 Check In</h2>
              <p className="text-green-100">Return items to inventory</p>
            </div>
            <LogIn className="w-12 h-12 opacity-80" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setScannerMode("checkin");
                setShowQRScannerModal(true);
                startQRScanner();
              }}
              className="flex flex-col items-center gap-2 p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm">Scan QR</span>
            </button>
            <button 
              onClick={() => setShowCheckInModal(true)}
              className="flex flex-col items-center gap-2 p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <Package className="w-6 h-6" />
              <span className="text-sm">Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse-slow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Live Records</span>
          </div>
          <div className="text-3xl text-gray-900">{checkInOutHistory.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <LogOut className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Today's Check-Outs</span>
          </div>
          <div className="text-3xl text-gray-900">{todayCheckOuts}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <LogIn className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Today's Check-Ins</span>
          </div>
          <div className="text-3xl text-gray-900">{todayCheckIns}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Currently Out</span>
          </div>
          <div className="text-3xl text-gray-900">{activeCheckouts}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search by item or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="equipment">Equipment</option>
              <option value="chemical">Chemical</option>
            </select>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value as any)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <option value="all">All Actions</option>
              <option value="check-out">Check-Out</option>
              <option value="check-in">Check-In</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real-Time History Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-gray-900">📊 Live Activity Feed</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Time</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Action</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Type</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Item</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Qty</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No activity yet. Start scanning!</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.slice(0, 20).map((record, index) => (
                  <tr 
                    key={record.id} 
                    className="hover:bg-gray-50 transition-colors"
                    style={{ animation: index < 3 ? `fadeIn 0.5s ease-in` : 'none' }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(record.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        record.action === "check-out"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {record.action === "check-out" ? <LogOut className="w-3 h-3" /> : <LogIn className="w-3 h-3" />}
                        {record.action === "check-out" ? "Out" : "In"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {record.itemType}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.itemName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.purpose || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* QR Scanner Modal */}
      {showQRScannerModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">📷 Scan QR Code</h3>
              <button onClick={() => { stopQRScanner(); setShowQRScannerModal(false); }}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-4 border-blue-500 rounded-lg animate-pulse"></div>
                </div>
                {isScanning && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Scanning...
                  </div>
                )}
              </div>

              {/* Manual Input for Testing */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">📝 For testing: Paste QR data manually</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scannedData}
                    onChange={(e) => setScannedData(e.target.value)}
                    placeholder='Example: {"id":"eq-001","name":"Microscope","type":"equipment"}'
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleManualQRInput}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Process
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => { stopQRScanner(); setShowQRScannerModal(false); }}
              className="w-full mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Check-Out Modal */}
      {showCheckOutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">📤 Check Out Item</h3>
              <button onClick={() => { setShowCheckOutModal(false); resetForm(); }}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Type *</label>
                <select
                  value={formData.itemType}
                  onChange={(e) => setFormData({ ...formData, itemType: e.target.value as any, itemId: "", itemName: "" })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="equipment">🔬 Equipment</option>
                  <option value="chemical">🧪 Chemical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Item *</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => {
                    const selectedItem = formData.itemType === "equipment"
                      ? equipment.find(eq => eq.id === e.target.value)
                      : chemicals.find(ch => ch.id === e.target.value);
                    setFormData({
                      ...formData,
                      itemId: e.target.value,
                      itemName: selectedItem?.name || ""
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Choose an item...</option>
                  {formData.itemType === "equipment"
                    ? equipment.filter(eq => eq.status === "Available").map(eq => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name} (Available: {eq.quantity})
                        </option>
                      ))
                    : chemicals.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          {ch.name} ({ch.quantity} {ch.unit})
                        </option>
                      ))
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                  rows={3}
                  placeholder="What will you use this for?"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCheckOutModal(false); resetForm(); }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckOut}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-gray-900">📥 Check In Item</h3>
              <button onClick={() => { setShowCheckInModal(false); resetForm(); }}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Type *</label>
                <select
                  value={formData.itemType}
                  onChange={(e) => setFormData({ ...formData, itemType: e.target.value as any, itemId: "", itemName: "" })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600"
                >
                  <option value="equipment">🔬 Equipment</option>
                  <option value="chemical">🧪 Chemical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Item *</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => {
                    const selectedItem = formData.itemType === "equipment"
                      ? equipment.find(eq => eq.id === e.target.value)
                      : chemicals.find(ch => ch.id === e.target.value);
                    setFormData({
                      ...formData,
                      itemId: e.target.value,
                      itemName: selectedItem?.name || ""
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Choose an item...</option>
                  {formData.itemType === "equipment"
                    ? equipment.map(eq => (
                        <option key={eq.id} value={eq.id}>{eq.name}</option>
                      ))
                    : chemicals.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.name}</option>
                      ))
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600"
                  rows={3}
                  placeholder="Any notes or comments..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCheckInModal(false); resetForm(); }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckIn}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg"
              >
                Check In
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}