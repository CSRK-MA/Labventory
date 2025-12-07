import { Monitor, Smartphone, Check, Zap, BarChart3, Shield } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const highlights = [
  {
    icon: Monitor,
    title: "Desktop Dashboard",
    description: "Full-featured admin panel for comprehensive lab management and oversight"
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Scan QR codes and manage equipment on-the-go from any device"
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Instant updates across all devices and locations in milliseconds"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into usage patterns and resource optimization"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with role-based access control"
  },
  {
    icon: Check,
    title: "Easy Setup",
    description: "Get started in minutes with our guided onboarding process"
  }
];

export function DemoPreview() {
  return (
    <section id="demo" className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-200/30 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full mb-4 sm:mb-6 border border-green-200">
            <span className="text-xs sm:text-sm">Live Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 px-4">
            Intuitive Interface,
            <span className="block mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Powerful Results
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
            Experience a user-friendly dashboard designed to make inventory management effortless for everyone on your team.
          </p>
        </div>

        {/* Main Dashboard Preview - Mobile Optimized */}
        <div className="relative mb-12 sm:mb-16 md:mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl blur-3xl opacity-20 transform scale-95" />
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-700">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-sm" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-sm" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-sm" />
              </div>
              <div className="flex-1 bg-gray-700/50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 ml-2 sm:ml-4 flex items-center gap-2 overflow-hidden">
                <div className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0">●</div>
                <span className="truncate">app.labventory.io/dashboard</span>
              </div>
            </div>

            {/* Dashboard Mock */}
            <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761264889291-52edcd3979b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2NDU3MDM4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dashboard Interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg active:scale-95 sm:hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">{highlight.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section - Mobile Optimized */}
        <div className="text-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-blue-100">
          <h3 className="text-2xl sm:text-3xl text-gray-900 mb-3 sm:mb-4">See It in Action</h3>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Schedule a personalized demo and discover how Labventory can transform your lab management workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl active:scale-95 sm:hover:scale-105 transition-all duration-300">
              Request a Demo
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:text-purple-600 active:scale-95 sm:hover:shadow-lg transition-all duration-300">
              Try Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}