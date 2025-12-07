import { Beaker, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Send } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-600/10 rounded-full blur-3xl" />
      
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 sm:p-2.5 rounded-xl shadow-lg">
                <Beaker className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-xl sm:text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Labventory
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-5 sm:mb-6 leading-relaxed max-w-sm mx-auto sm:mx-0">
              Smart inventory tracking for smarter labs. Empowering educational institutions worldwide with cutting-edge lab management solutions.
            </p>
            <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 transition-all duration-300 active:scale-90 sm:hover:scale-110 border border-gray-700 hover:border-transparent"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Column */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Product
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#" },
                { label: "Demo", href: "#demo" },
                { label: "Integrations", href: "#" },
                { label: "Changelog", href: "#" },
                { label: "API Docs", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block active:scale-95"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Company
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Press Kit", href: "#" },
                { label: "Partners", href: "#" },
                { label: "Security", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block active:scale-95"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Get in Touch
            </h3>
            <ul className="space-y-4 sm:space-y-5">
              <li className="flex items-start gap-3 text-gray-400 group justify-center sm:justify-start">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400" />
                <a
                  href="mailto:support@labventory.io"
                  className="hover:text-white transition-colors text-sm sm:text-base break-all"
                >
                  support@labventory.io
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 group justify-center sm:justify-start">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-400" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors text-sm sm:text-base"
                >
                  +1 (234) 567-8900
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 justify-center sm:justify-start">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-400" />
                <span className="text-sm sm:text-base">
                  123 Innovation Drive<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section - Mobile Optimized */}
      <div className="border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <div className="text-center md:text-left">
              <h4 className="text-lg sm:text-xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stay Updated
              </h4>
              <p className="text-sm sm:text-base text-gray-400">
                Get the latest features, tips, and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 lg:w-72 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-600 text-white placeholder-gray-500 transition-colors"
              />
              <button className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl active:scale-95 sm:hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Mobile Optimized */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2 text-center">
              <span>© 2025 Labventory.</span>
              <span>All rights reserved.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookie Policy", href: "#" }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-white transition-colors active:scale-95"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}