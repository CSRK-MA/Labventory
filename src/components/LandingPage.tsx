import { Beaker, Zap, QrCode, Lock, ChevronRight } from "lucide-react";

interface WayambaLandingProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: WayambaLandingProps) {
  return (
    <div className="min-h-screen bg-white">

              {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-md">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Wayamba University of Sri Lanka
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">Lab Inventory System</p>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={onGetStarted}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Login
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-blue-600 text-sm font-semibold">Welcome to WUSL Labs</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Lab Inventory
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Management System
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Streamline your laboratory operations with our modern inventory management system. Track equipment, manage chemicals, and optimize your lab workflow with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg font-semibold flex items-center gap-2"
            >
              Access Dashboard
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-sm text-gray-600">Equipment Items</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Laboratory Rooms</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">System Access</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 sm:p-12 text-white text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            For Wayamba University Laboratories
          </h3>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Specifically designed for the laboratory management needs of all departments at Wayamba University. Streamline your inventory, improve equipment tracking, and enhance collaboration across all facilities.
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
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              © {new Date().getFullYear()} Wayamba University of Sri Lanka
            </p>
            <p className="text-xs text-gray-500">
              Labventory Management System • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}