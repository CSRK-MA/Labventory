import { Beaker } from "lucide-react";

interface HeaderProps {
  onGetStarted?: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  return (
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
  );
}