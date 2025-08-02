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

          <div className="container relative mx-auto px-4 py-20 text-center">
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
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 mb-8"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Powered by Advanced AI • Live Data</span>
                <Zap className="w-4 h-4 text-purple-600" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                  The Future of
                </span>
                <br />
                <span className="text-gray-900">Democracy is Here</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Harness the power of AI to analyze political sentiment, verify facts, and engage with Kenya's democratic process like never before.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
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
                <li><Link href="/politicians" className="hover:text-white transition-colors duration-200">Politicians Database</Link></li>
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
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "AI-Powered Insights",
                  description: "Get deep insights into political sentiment and trends through advanced AI analysis.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Community Driven",
                  description: "Join a vibrant community of citizens working together for a more transparent democracy.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="p-4 sm:p-6 rounded-xl bg-card hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-background/90">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">How Sauti Ya Watu Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  step: "1",
                  title: "Create Account",
                  description: "Sign up using your national ID and biometric verification for a secure, unique account."
                },
                {
                  step: "2",
                  title: "Verify Identity",
                  description: "Complete our AI-powered verification process to ensure the integrity of your participation."
                },
                {
                  step: "3",
                  title: "Engage & Contribute",
                  description: "Participate in polls, share insights, and contribute to community-driven political discourse."
                },
                {
                  step: "4",
                  title: "Make Impact",
                  description: "Your verified voice helps shape policies and ensures transparent democratic processes."
                }
              ].map((step, index) => (
                <div key={index} className="relative p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl font-bold text-primary/20 absolute top-0 left-0">{step.step}</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 mt-6 sm:mt-8">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background/90 to-background relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  value: "1M+",
                  label: "Active Citizens",
                  description: "Engaged Kenyans using our platform"
                },
                {
                  value: "47",
                  label: "Counties Covered",
                  description: "Nationwide representation"
                },
                {
                  value: "99.9%",
                  label: "Accuracy Rate",
                  description: "In AI-powered verifications"
                },
                {
                  value: "24/7",
                  label: "Availability",
                  description: "Round-the-clock democratic engagement"
                }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base font-semibold mb-1">{stat.label}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-background/90">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">Trusted by Leaders & Citizens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  quote: "Sauti Ya Watu has revolutionized how we engage with our constituents. The AI-powered insights are invaluable.",
                  author: "Hon. Sarah Kimani",
                  role: "Member of Parliament"
                },
                {
                  quote: "Finally, a platform that gives citizens a real voice in the democratic process. The verification system ensures credibility.",
                  author: "Dr. John Odhiambo",
                  role: "Political Analyst"
                },
                {
                  quote: "The transparency and real-time insights have made our electoral process more efficient and trustworthy.",
                  author: "Mary Wanjiku",
                  role: "County Election Officer"
                }
              ].map((testimonial, index) => (
                <div key={index} className="p-4 sm:p-6 rounded-xl bg-card">
                  <div className="mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-base sm:text-lg mb-3 sm:mb-4 text-muted-foreground">{testimonial.quote}</p>
                  <div className="text-sm sm:text-base font-semibold">{testimonial.author}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background/90 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Make Your Voice Heard?</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4 sm:px-0">
              Join thousands of Kenyans who are already using Sauti Ya Watu to participate in shaping the future of our democracy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <a href="/signup" className="transform rounded-lg bg-primary px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium text-white transition-all hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-center">
                Create Free Account
              </a>
              <a href="/demo-voting" className="transform rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium text-primary transition-all hover:scale-105 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-center">
                Try Demo
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-xl font-bold">Sauti Ya Watu</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering democracy through technology and transparency.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com/sautiyawatu" className="text-muted-foreground hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/sautiyawatu" className="text-muted-foreground hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://github.com/ElECT-AI/peoples" className="text-muted-foreground hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/politicians" className="text-sm text-muted-foreground hover:text-primary">Politicians</a></li>
                <li><a href="/live-tally" className="text-sm text-muted-foreground hover:text-primary">Live Tally</a></li>
                <li><a href="/sentiment-analysis" className="text-sm text-muted-foreground hover:text-primary">Sentiment Analysis</a></li>
                <li><a href="/verification-gallery" className="text-sm text-muted-foreground hover:text-primary">Verification Gallery</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/docs/api" className="text-sm text-muted-foreground hover:text-primary">API Documentation</a></li>
                <li><a href="/docs/guides" className="text-sm text-muted-foreground hover:text-primary">Integration Guides</a></li>
                <li><a href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="/press" className="text-sm text-muted-foreground hover:text-primary">Press Kit</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                <li><a href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a></li>
                <li><a href="/security" className="text-sm text-muted-foreground hover:text-primary">Security</a></li>
                <li><a href="/accessibility" className="text-sm text-muted-foreground hover:text-primary">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-primary/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                © 2025 Sauti Ya Watu. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">Contact</a>
                <a href="/help" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">Help Center</a>
                <select className="text-xs sm:text-sm bg-transparent border-none text-muted-foreground hover:text-primary cursor-pointer">
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
