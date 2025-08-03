'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, AlertTriangle, Settings, BarChart3, Database, Server } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastUpdate: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    systemHealth: 'healthy',
    lastUpdate: new Date().toISOString()
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading admin stats
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1247,
        activeUsers: 89,
        systemHealth: 'healthy',
        lastUpdate: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const adminCards = [
    {
      title: 'User Management',
      icon: Users,
      value: `${stats.totalUsers} total`,
      subtitle: `${stats.activeUsers} active`,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/users'
    },
    {
      title: 'System Health',
      icon: Server,
      value: stats.systemHealth,
      subtitle: 'All systems operational',
      color: stats.systemHealth === 'healthy' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
      href: '/admin/health'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      value: '98.7%',
      subtitle: 'Uptime this month',
      color: 'from-purple-500 to-purple-600',
      href: '/admin/analytics'
    },
    {
      title: 'Database',
      icon: Database,
      value: '2.4GB',
      subtitle: 'Storage used',
      color: 'from-orange-500 to-orange-600',
      href: '/admin/database'
    },
    {
      title: 'Security',
      icon: Shield,
      value: 'Secured',
      subtitle: 'No threats detected',
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/security'
    },
    {
      title: 'System Settings',
      icon: Settings,
      value: 'Configure',
      subtitle: 'Manage system settings',
      color: 'from-gray-500 to-gray-600',
      href: '/admin/settings'
    }
  ];

  if (loading) {
    return (
      <AuthGuard requiredRole="admin" requiredPermissions={['admin']}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin" requiredPermissions={['admin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-600">
              Manage and monitor the ELECT platform
            </p>
          </motion.div>

          {/* System Status Banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-8 p-4 rounded-lg ${
              stats.systemHealth === 'healthy' 
                ? 'bg-green-100 border border-green-200' 
                : 'bg-red-100 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {stats.systemHealth === 'healthy' ? (
                <Activity className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <h3 className={`font-semibold ${
                  stats.systemHealth === 'healthy' ? 'text-green-800' : 'text-red-800'
                }`}>
                  System Status: {stats.systemHealth.charAt(0).toUpperCase() + stats.systemHealth.slice(1)}
                </h3>
                <p className={`text-sm ${
                  stats.systemHealth === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  Last updated: {new Date(stats.lastUpdate).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Admin Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => {
                  // Handle navigation to admin sections
                  console.log(`Navigate to ${card.href}`);
                }}
              >
                <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} text-white`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <p className="text-sm text-gray-500">{card.subtitle}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <h3 className="font-semibold text-blue-900">System Backup</h3>
                <p className="text-sm text-blue-600">Create system backup</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <h3 className="font-semibold text-green-900">Clear Cache</h3>
                <p className="text-sm text-green-600">Clear application cache</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <h3 className="font-semibold text-purple-900">Generate Report</h3>
                <p className="text-sm text-purple-600">Create system report</p>
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            <p>ELECT Platform Admin Dashboard • Last login: {new Date().toLocaleString()}</p>
            <p className="mt-1">
              <span className="text-green-600">●</span> All systems operational
            </p>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
