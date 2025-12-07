// Wayamba University of Sri Lanka - Labventory Landing Page
import { Beaker, ChevronRight, Shield, Zap } from "lucide-react";

interface WayambaLandingProps {
  onGetStarted: () => void;
}

export function WayambaLanding({ onGetStarted }: WayambaLandingProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-2 sm:p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Beaker className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl text-gray-900">
                  Wayamba University of Sri Lanka
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Laboratory Inventory Management System
                </p>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={onGetStarted}
              className="px-5 sm:px-6 py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <br></br><br></br><br></br>
      <main className="flex-1 w-full pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-20">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-900 mb-6">
              Welcome to Labventory
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              Modern laboratory inventory management system for efficient tracking of equipment, chemicals, and assets.
            </p>
            <button
              onClick={onGetStarted}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 text-base font-medium"
            >
              Access Dashboard
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow h-full">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2 font-semibold text-center">Real-Time Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">
                Monitor inventory status with instant updates across all labs
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow h-full">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Beaker className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2 font-semibold text-center">QR Code System</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">
                Quick check-in/out using QR code scanning technology
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow h-full">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2 font-semibold text-center">Secure Access</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">
                Role-based permissions for administrators, teachers, and staff
              </p>
            </div>
          </div>

          <br></br><br></br>

          {/* University Info */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 lg:p-12 text-white text-center mb-16">
            <h3 className="text-2xl lg:text-3xl mb-4 font-bold">
              For Wayamba University Labs
            </h3>
            <p className="text-base lg:text-lg text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
              Designed specifically for the laboratory management needs of Wayamba University of Sri Lanka, supporting multiple departments and facilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                Science Faculty
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                Engineering Labs
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                Research Centers
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { WayambaLanding as Hero };
