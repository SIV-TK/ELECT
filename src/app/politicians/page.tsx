"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePoliticianStore } from "@/hooks/use-politician-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  MapPin, 
  Award, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  GraduationCap,
  Scale,
  Eye,
  ArrowUpRight,
  Crown,
  Building,
  Star
} from "lucide-react";
import Link from "next/link";
import { Politician } from "@/types";

// Modern Politician Card Component
function ModernPoliticianCard({ 
  politician, 
  index 
}: { 
  politician: Politician; 
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const levelColors = {
    'Presidential': 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
    'Gubernatorial': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    'Senatorial': 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    'WomenRep': 'bg-gradient-to-br from-pink-500 to-pink-600 text-white',
    'MP': 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
    'MCA': 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
  };

  const levelIcons = {
    'Presidential': <Crown className="w-4 h-4" />,
    'Gubernatorial': <Building className="w-4 h-4" />,
    'Senatorial': <Star className="w-4 h-4" />,
    'WomenRep': <Users className="w-4 h-4" />,
    'MP': <Scale className="w-4 h-4" />,
    'MCA': <MapPin className="w-4 h-4" />
  };

  const promisesKept = politician.trackRecord.promisesKept.length;
  const promisesBroken = politician.trackRecord.promisesBroken.length;
  const totalPromises = promisesKept + promisesBroken;
  const fulfillmentRate = totalPromises > 0 ? (promisesKept / totalPromises) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-60" />
        
        {/* Header */}
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-2xl font-bold text-purple-700 shadow-lg">
                {politician.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              {politician.legalOversight.hasAdverseFindings && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${levelColors[politician.level]}`}>
              {levelIcons[politician.level]}
              {politician.level}
            </div>
          </div>
          
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 mb-1">
              {politician.name}
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium mb-2">{politician.party}</p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {politician.county && `${politician.county} County`}
              {politician.constituency && ` • ${politician.constituency}`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Kept</span>
              </div>
              <div className="text-lg font-bold text-green-700">{promisesKept}</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-800">Broken</span>
              </div>
              <div className="text-lg font-bold text-red-700">{promisesBroken}</div>
            </div>
          </div>

          {/* Fulfillment Rate */}
          {totalPromises > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Promise Fulfillment</span>
                <span className="font-medium text-gray-900">{fulfillmentRate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${fulfillmentRate}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                />
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{politician.trackRecord.contributions.length} contributions</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              <span>{politician.academicLife.university ? 'University' : 'High School'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/politicians/${politician.id}`} className="flex-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs bg-white/80 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
              >
                <Eye className="w-3 h-3 mr-1" />
                View Profile
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-3 text-xs hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <TrendingUp className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>

        {/* Hover Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Filter Component
function FilterBar({ 
  searchTerm, 
  setSearchTerm, 
  selectedLevel, 
  setSelectedLevel,
  selectedCounty,
  setSelectedCounty,
  counties 
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedCounty: string;
  setSelectedCounty: (county: string) => void;
  counties: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
    >
      {/* Search */}
      <div className="relative md:col-span-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search politicians..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400"
        />
      </div>

      {/* Level Filter */}
      <select
        value={selectedLevel}
        onChange={(e) => setSelectedLevel(e.target.value)}
        className="px-3 py-2 border border-purple-200 rounded-md bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:outline-none text-sm"
      >
        <option value="">All Levels</option>
        <option value="Presidential">Presidential</option>
        <option value="Gubernatorial">Gubernatorial</option>
        <option value="Senatorial">Senatorial</option>
        <option value="WomenRep">Women Rep</option>
        <option value="MP">MP</option>
        <option value="MCA">MCA</option>
      </select>

      {/* County Filter */}
      <select
        value={selectedCounty}
        onChange={(e) => setSelectedCounty(e.target.value)}
        className="px-3 py-2 border border-purple-200 rounded-md bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:outline-none text-sm"
      >
        <option value="">All Counties</option>
        {counties.map(county => (
          <option key={county} value={county}>{county}</option>
        ))}
      </select>
    </motion.div>
  );
}

export default function PoliticiansPage() {
  const { politicians } = usePoliticianStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');

  // Extract unique counties
  const counties = Array.from(new Set(politicians.map(p => p.county).filter(Boolean) as string[])).sort();

  // Filter politicians
  const filteredPoliticians = politicians.filter(politician => {
    const matchesSearch = politician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         politician.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || politician.level === selectedLevel;
    const matchesCounty = !selectedCounty || politician.county === selectedCounty;
    
    return matchesSearch && matchesLevel && matchesCounty;
  });

  // Calculate stats
  const totalPoliticians = politicians.length;
  const withAdverseFindings = politicians.filter(p => p.legalOversight.hasAdverseFindings).length;
  const averageFulfillment = politicians.reduce((acc, p) => {
    const kept = p.trackRecord.promisesKept.length;
    const broken = p.trackRecord.promisesBroken.length;
    const total = kept + broken;
    return acc + (total > 0 ? (kept / total) * 100 : 0);
  }, 0) / politicians.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Political Leaders Directory
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Comprehensive profiles of Kenya's political leaders with track records and accountability metrics
              </p>
            </div>

            <Link href="/politicians/academic-life">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg">
                <GraduationCap className="mr-2 h-4 w-4" />
                Academic Profiles
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Politicians</p>
                      <p className="text-3xl font-bold text-blue-900">{totalPoliticians}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">Legal Issues</p>
                      <p className="text-3xl font-bold text-red-900">{withAdverseFindings}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Avg. Promise Rate</p>
                      <p className="text-3xl font-bold text-green-900">{averageFulfillment.toFixed(0)}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          counties={counties}
        />

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredPoliticians.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPoliticians}</span> politicians
          </p>
        </motion.div>

        {/* Politicians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPoliticians.map((politician, index) => (
            <ModernPoliticianCard
              key={politician.id}
              politician={politician}
              index={index}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredPoliticians.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No politicians found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
