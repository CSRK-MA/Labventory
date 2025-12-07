import { Star, Quote, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Head of Science Department",
    institution: "Riverside High School",
    content: "Labventory has transformed how we manage our chemistry lab. The chemical tracking feature with expiry alerts has improved our safety compliance tremendously. It's become indispensable for our daily operations.",
    rating: 5,
    avatar: "SM",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Prof. James Chen",
    role: "Lab Coordinator",
    institution: "State University",
    content: "The QR code system is brilliant. Students can now check out equipment themselves, and we have complete accountability. Setup took less than a day and the support team was exceptional!",
    rating: 5,
    avatar: "JC",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Maria Rodriguez",
    role: "IT Manager",
    institution: "Technical College",
    content: "Managing 500+ computers and peripherals across 5 labs was a nightmare. Labventory made it effortless. The maintenance tracker alone saves us hours weekly and has reduced downtime significantly.",
    rating: 5,
    avatar: "MR",
    gradient: "from-orange-500 to-red-500"
  },
  {
    name: "Dr. Aisha Patel",
    role: "Research Director",
    institution: "Medical Research Institute",
    content: "For our research lab, equipment booking and usage analytics are game-changers. We can now optimize resource allocation based on actual data. The ROI has been remarkable.",
    rating: 5,
    avatar: "AP",
    gradient: "from-green-500 to-emerald-500"
  }
];

const stats = [
  { value: "500+", label: "Active Institutions", icon: TrendingUp },
  { value: "50K+", label: "Assets Managed", icon: Star },
  { value: "2M+", label: "Transactions Logged", icon: Quote },
  { value: "4.9★", label: "Average Rating", icon: Star }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-300/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-300/20 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full mb-4 sm:mb-6 border border-yellow-200">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current flex-shrink-0" />
            <span className="text-xs sm:text-sm">Customer Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 px-4">
            Loved by Educators
            <span className="block mt-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
            See what lab professionals and educators say about transforming their operations with Labventory.
          </p>
        </div>

        {/* Testimonials Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl active:scale-95 sm:hover:scale-[1.02] transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-5">
                <Quote className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 text-gray-900" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 sm:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 relative z-10 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${testimonial.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg text-base sm:text-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                  {testimonial.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base sm:text-lg text-gray-900 truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 truncate">
                    {testimonial.role}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                    {testimonial.institution}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-white shadow-2xl">
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">Join Our Growing Community</h3>
            <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Thousands of institutions worldwide trust Labventory to manage their lab operations
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}