import { FlaskConical, Cpu, Microscope, GraduationCap, ArrowRight } from "lucide-react";

const useCases = [
  {
    icon: FlaskConical,
    title: "Science Labs",
    description: "Comprehensive management for chemistry, biology, and physics labs with specialized chemical tracking.",
    features: [
      "Chemical inventory & expiry tracking",
      "Safety compliance monitoring",
      "Glassware & equipment management",
      "Reagent usage analytics"
    ],
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    icon: Cpu,
    title: "Engineering Labs",
    description: "Track tools, machinery, and electronic components across workshops and engineering departments.",
    features: [
      "Tool checkout & returns",
      "Equipment status monitoring",
      "Parts & components inventory",
      "Maintenance scheduling"
    ],
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    icon: Microscope,
    title: "Research Facilities",
    description: "Advanced tracking for research equipment, specimens, and collaborative resource management.",
    features: [
      "Equipment booking & scheduling",
      "Sample & specimen tracking",
      "Calibration management",
      "Usage analytics & reports"
    ],
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50"
  },
  {
    icon: GraduationCap,
    title: "IT & Computer Labs",
    description: "Monitor computers, peripherals, software licenses, and technology infrastructure.",
    features: [
      "Hardware asset tracking",
      "Software license management",
      "Repair & maintenance history",
      "Asset tagging & identification"
    ],
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50"
  }
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full mb-4 sm:mb-6 border border-purple-200">
            <span className="text-xs sm:text-sm">Versatile Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 px-4">
            Built for Every
            <span className="block mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Type of Lab
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
            From science classrooms to advanced research facilities, Labventory adapts perfectly to your unique needs.
          </p>
        </div>

        {/* Use Cases Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${useCase.bgGradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl active:scale-95 sm:hover:scale-[1.02] transition-all duration-500 border border-white/50 overflow-hidden`}
              >
                {/* Hover Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${useCase.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl sm:text-3xl text-gray-900 mb-3 sm:mb-4">
                    {useCase.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed">
                    {useCase.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                    {useCase.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${useCase.color} shadow-sm mt-2 flex-shrink-0`} />
                        <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <button className="group/btn flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:gap-3 transition-all active:scale-95">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}