'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Eye, 
  Brain, 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Target,
  Heart,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Transparency & Accountability",
    description: "Real-time monitoring of political activities, campaign spending, and government actions to ensure transparency in governance."
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced artificial intelligence analyzes political trends, sentiment, and verifies information to provide accurate insights."
  },
  {
    icon: Users,
    title: "Citizen Engagement",
    description: "Empowering citizens with tools to participate in democracy through informed voting, feedback, and community involvement."
  },
  {
    icon: BarChart3,
    title: "Data-Driven Governance",
    description: "Comprehensive analytics and visualizations help both citizens understand political landscapes and enable government officials to make informed policy decisions based on real-time public sentiment and data."
  },
  {
    icon: Eye,
    title: "Corruption Detection",
    description: "AI algorithms identify potential corruption patterns and irregularities in government processes and spending."
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Supporting Kenya's linguistic diversity with content available in English, Swahili, and major local languages."
  },
  {
    icon: TrendingUp,
    title: "Real-Time Policy Impact",
    description: "Both citizens and government institutions can track policy effectiveness through real-time data analytics, enabling better governance and informed public participation in policy discussions."
  }
];

const impactAreas = [
  {
    icon: CheckCircle,
    title: "Electoral Integrity",
    description: "Ensuring fair elections through real-time monitoring, fact-checking, and transparent vote tallying.",
    stats: "95% accuracy in election predictions"
  },
  {
    icon: AlertTriangle,
    title: "Crisis Prevention",
    description: "Early warning systems detect potential conflicts and tensions before they escalate.",
    stats: "24/7 monitoring coverage"
  },
  {
    icon: Zap,
    title: "Rapid Response",
    description: "Instant alerts and notifications keep citizens informed about critical political developments.",
    stats: "Real-time updates"
  },
  {
    icon: Target,
    title: "Policy Impact",
    description: "Track and analyze the real-world effects of government policies on communities.",
    stats: "47 counties covered"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">ELECT</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Empowering Kenya's Democracy Through Technology, Transparency, and Citizen Engagement
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>For the People</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>By the People</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>With the People</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
              ELECT is Kenya's premier digital democracy platform, designed to strengthen democratic institutions 
              through transparency, accountability, and empowerment of both citizens and government institutions. 
              We leverage cutting-edge artificial intelligence and real-time data analytics to create an informed 
              ecosystem where citizens can make meaningful contributions to the democratic process, while enabling 
              state institutions to make data-driven decisions for better governance and more effective political systems.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">Making government actions visible and accountable to all citizens</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Participation</h3>
                <p className="text-sm text-gray-600">Enabling meaningful citizen engagement in democratic processes</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Intelligence</h3>
                <p className="text-sm text-gray-600">AI-powered insights for informed decision-making</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ELECT Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines advanced technology with user-friendly interfaces to make democracy accessible to every Kenyan citizen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ELECT is making a measurable difference in Kenya's democratic landscape through innovative technology and citizen engagement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <area.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 mb-3 leading-relaxed">
                      {area.description}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        {area.stats}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why ELECT Matters
          </h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              In a world where misinformation spreads faster than truth, where political promises 
              often go unfulfilled, and where citizens feel disconnected from their leaders, 
              ELECT serves as a comprehensive bridge between the governed and those who govern.
            </p>
            <p>
              We believe that democracy thrives when both citizens and government institutions are informed, 
              engaged, and empowered with real-time data. By providing advanced analytics, fact-checking 
              capabilities, and transparent monitoring of political activities, we enable citizens to make 
              informed decisions while giving government officials the tools to understand public sentiment 
              and implement evidence-based policies.
            </p>
            <p>
              Our real-time data analytics platform helps government institutions track policy effectiveness, 
              understand citizen needs, and respond quickly to emerging issues. Meanwhile, citizens gain 
              unprecedented access to verified information, enabling meaningful participation in democratic processes.
            </p>
            <p className="font-semibold text-xl">
              Together, through shared data and transparent governance, we can build a more responsive, 
              accountable, and effective democracy for all Kenyans.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join the Movement
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Be part of Kenya's democratic transformation. Explore our features, stay informed, 
            and help build a better future for all Kenyans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              onClick={() => window.location.href = '/dashboard'}
            >
              Explore Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
