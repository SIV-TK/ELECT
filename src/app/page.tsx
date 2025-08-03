"use client";
import { Fragment, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart3, 
  Brain, 
  Shield, 
  Vote, 
  Eye, 
  Users, 
  TrendingUp, 
  Zap, 
  Globe, 
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze political sentiment across Kenya's 47 counties in real-time.",
      gradient: "from-purple-500 to-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Fact Verification",
      description: "Automated fact-checking system that verifies political claims using trusted data sources.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Media Bias Detection",
      description: "Identify and analyze bias in news articles and political content with unprecedented accuracy.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <Vote className="w-8 h-8" />,
      title: "Election Simulation",
      description: "Real-time voting simulations with predictive modeling for electoral outcomes.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Data Visualization",
      description: "Interactive charts and maps showing political trends and citizen engagement metrics.",
      gradient: "from-pink-500 to-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Civic Education",
      description: "Comprehensive educational resources about Kenya's constitution and democratic processes.",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const stats = [
    { value: "1.2M+", label: "Active Citizens" },
    { value: "892K+", label: "AI Analyses" },
    { value: "47", label: "Counties Covered" },
    { value: "99.2%", label: "Accuracy Rate" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-x-hidden">
      {/* Modern Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Sauti Ya Watu
                </div>
                <div className="text-xs text-gray-500 -mt-1">Voice of the People</div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'Analytics', 'About', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Launch App
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {['Features', 'Analytics', 'About', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link href="/login">
                    <button className="block w-full text-left text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 py-2">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg text-center">
                      Launch App
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-8"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  <span className="hidden sm:inline">Powered by Advanced AI • Live Data</span>
                  <span className="sm:hidden">AI Powered • Live</span>
                </span>
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                  <span className="hidden sm:inline">The Future of</span>
                  <span className="sm:hidden">Kenya's</span>
                </span>
                <br />
                <span className="text-gray-900">
                  <span className="hidden sm:inline">Democracy is Here</span>
                  <span className="sm:hidden">Democracy</span>
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
              >
                <span className="hidden sm:inline">
                  Harness the power of AI to analyze political sentiment, verify facts, and engage with Kenya's democratic process like never before.
                </span>
                <span className="sm:hidden">
                  AI-powered political analysis and fact-checking for Kenya's democracy.
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
              >
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 justify-center"
                  >
                    <Brain className="w-5 h-5" />
                    Start AI Analysis
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
          <div className="container relative mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Powerful AI Features
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionary technology that transforms how citizens engage with democracy
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)"
                  }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>
          </div>

          <div className="container relative mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Democracy?
              </h2>
              <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
                Join thousands of Kenyan citizens already using AI to make informed political decisions. 
                Start your journey towards a more transparent democracy today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 justify-center"
                  >
                    <Zap className="w-5 h-5" />
                    Start Free Analysis
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/sentiment-analysis">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center gap-2 justify-center"
                  >
                    <Eye className="w-5 h-5" />
                    Explore Features
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">Sauti Ya Watu</div>
                  <div className="text-sm text-gray-400">Voice of the People</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering Kenyan democracy through advanced AI technology, 
                real-time analysis, and transparent civic engagement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/sentiment-analysis" className="hover:text-white transition-colors duration-200">Sentiment Analysis</Link></li>
                <li><Link href="/fact-check" className="hover:text-white transition-colors duration-200">Fact Checking</Link></li>
                <li><Link href="/media-bias" className="hover:text-white transition-colors duration-200">Bias Detection</Link></li>
                <li><Link href="/demo-voting" className="hover:text-white transition-colors duration-200">Election Simulation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/voter-education" className="hover:text-white transition-colors duration-200">Civic Education</Link></li>
                <li><Link href="/constitution" className="hover:text-white transition-colors duration-200">Constitution Guide</Link></li>

                <li><Link href="/corruption-risk" className="hover:text-white transition-colors duration-200">Transparency Tools</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Sauti Ya Watu. All rights reserved. Built for the people of Kenya.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
              <Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
