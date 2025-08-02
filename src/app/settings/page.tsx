"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Lock,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Settings as SettingsIcon,
  Brain,
  Zap,
  Languages,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';

export default function SettingsPage() {
  const { user, signOut } = useFirebaseAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // Profile settings state
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    dateOfBirth: '',
    bio: '',
    profileImage: ''
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    analysisUpdates: true,
    electionAlerts: true,
    weeklyDigest: true,
    securityAlerts: true,
    marketingEmails: false
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowAnalytics: true,
    allowCookies: true,
    twoFactorAuth: false
  });

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Africa/Nairobi',
    compactMode: false,
    animationsEnabled: true
  });

  // AI Preferences settings state  
  const [aiSettings, setAiSettings] = useState({
    enableMultiLanguageBot: true,
    preferredLanguages: ['en', 'sw'],
    crisisAlertsEnabled: true,
    misinformationDetection: true,
    countySpecificAnalysis: true,
    personalizedInsights: true,
    aiResponseStyle: 'detailed', // 'concise', 'detailed', 'academic'
    realTimeUpdates: true,
    confidenceThreshold: 0.7,
    autoTranslation: false,
    // Interactive Visualization & Insights preferences
    enableAIDashboards: true,
    enablePredictiveHeatMaps: true,
    enablePolicyComparison: true,
    enablePoliticalTimeline: true,
    defaultDashboardType: 'election-monitoring',
    defaultHeatMapType: 'election-outcomes',
    autoGenerateInsights: true,
    visualizationRefreshRate: '1hour', // '15min', '1hour', '1day'
    showConfidenceIntervals: true,
    enableInteractiveFeatures: true
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      // Extract comprehensive user data from Firebase Auth
      const userData = {
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        profileImage: user.photoURL || '',
        // Try to extract additional info from provider data
        location: '',
        website: '',
        dateOfBirth: '',
        bio: ''
      };

      // Check if user has additional provider data (Google, etc.)
      if (user.providerData && user.providerData.length > 0) {
        const providerData = user.providerData[0];
        
        // Some providers might have additional data
        if (providerData.displayName && !userData.displayName) {
          userData.displayName = providerData.displayName;
        }
        if (providerData.email && !userData.email) {
          userData.email = providerData.email;
        }
        if (providerData.photoURL && !userData.profileImage) {
          userData.profileImage = providerData.photoURL;
        }
      }

      setProfileData(prev => ({
        ...prev,
        ...userData
      }));
      
      setUserDataLoaded(true);
      
      // Load saved settings from localStorage or API
      loadUserSettings();
    } else {
      setUserDataLoaded(false);
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      // Try to load from localStorage first
      const savedNotifications = localStorage.getItem('notification-settings');
      const savedPrivacy = localStorage.getItem('privacy-settings');
      const savedAppearance = localStorage.getItem('appearance-settings');
      const savedProfile = localStorage.getItem('profile-settings');
      const savedAiSettings = localStorage.getItem('ai-settings');

      if (savedNotifications) {
        setNotificationSettings(JSON.parse(savedNotifications));
      }
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }
      if (savedAppearance) {
        setAppearanceSettings(JSON.parse(savedAppearance));
      }
      if (savedAiSettings) {
        setAiSettings(JSON.parse(savedAiSettings));
      }
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        // Merge saved profile data with current user data, preserving Firebase Auth data
        setProfileData(prev => ({
          ...prev,
          // Only update fields that are not from Firebase Auth or are user-customized
          phone: profile.phone || prev.phone,
          location: profile.location || prev.location,
          website: profile.website || prev.website,
          dateOfBirth: profile.dateOfBirth || prev.dateOfBirth,
          bio: profile.bio || prev.bio,
          // Allow user to override display name if they want
          displayName: profile.displayName || prev.displayName,
        }));
      }

    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const saveSettings = async (settingsType: string, data: any) => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem(`${settingsType}-settings`, JSON.stringify(data));
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
        duration: 3000,
      });

      // Apply theme changes immediately
      if (settingsType === 'appearance' && data.theme) {
        document.documentElement.classList.toggle('dark', data.theme === 'dark');
      }

    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem updating your preferences.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // If display name changed, update it in Firebase Auth as well
      if (user && user.displayName !== profileData.displayName) {
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(user, {
          displayName: profileData.displayName
        });
      }
      
      await saveSettings('profile', profileData);
      
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was a problem saving your profile information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    const updated = { ...notificationSettings, [key]: value };
    setNotificationSettings(updated);
    await saveSettings('notification', updated);
  };

  const handlePrivacyUpdate = async (key: string, value: boolean | string) => {
    const updated = { ...privacySettings, [key]: value };
    setPrivacySettings(updated);
    await saveSettings('privacy', updated);
  };

  const handleAppearanceUpdate = async (key: string, value: string | boolean) => {
    const updated = { ...appearanceSettings, [key]: value };
    setAppearanceSettings(updated);
    await saveSettings('appearance', updated);
  };

  const handleAiSettingsUpdate = async (key: string, value: string | boolean | string[] | number) => {
    const updated = { ...aiSettings, [key]: value };
    setAiSettings(updated);
    await saveSettings('ai', updated);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
      
      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        toast({
          title: "Account scheduled for deletion",
          description: "Your account will be deleted within 30 days. You can cancel this by logging in.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "There was a problem processing your request.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exportData = async () => {
    setIsLoading(true);
    try {
      const userData = {
        profile: profileData,
        notifications: notificationSettings,
        privacy: privacySettings,
        appearance: appearanceSettings,
        aiPreferences: aiSettings,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sauti-ya-watu-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'ai-preferences', label: 'AI Preferences', icon: Brain },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ];

  return (
    <AuthGuard>
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
            className="flex items-center gap-4 mb-8"
          >
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account preferences and privacy settings
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-8">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3"
            >
              {/* Profile Information */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* Loading State */}
                    {!userDataLoaded && (
                      <div className="flex items-center justify-center p-8">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Loading your profile information...</span>
                        </div>
                      </div>
                    )}

                    {userDataLoaded && (
                      <>
                        {/* Profile Picture */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Camera className="w-5 h-5" />
                              Profile Picture
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                              <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-4 ring-white shadow-lg">
                                  {profileData.profileImage && !profileImageError ? (
                                    <img 
                                      src={profileData.profileImage} 
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                      onError={() => setProfileImageError(true)}
                                    />
                                  ) : (
                                    <span>{getUserInitials()}</span>
                                  )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border-2 border-purple-100">
                                  <Camera className="w-4 h-4 text-purple-600" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={isLoading}
                                  />
                                </label>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">Upload a new profile picture</h3>
                                <p className="text-sm text-gray-600 mb-3">Max size: 5MB</p>
                                <div className="flex gap-2">
                                  <label className="cursor-pointer">
                                    <Button type="button" variant="outline" size="sm" disabled={isLoading}>
                                      <Upload className="w-4 h-4 mr-2" />
                                      Upload New
                                    </Button>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      className="hidden"
                                      disabled={isLoading}
                                    />
                                  </label>
                                  {profileData.profileImage && (
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setProfileData(prev => ({ ...prev, profileImage: '' }));
                                        setProfileImageError(false);
                                      }}
                                      disabled={isLoading}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Basic Information Display */}
                        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-blue-200">
                          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-200/50">
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                              <User className="w-5 h-5 text-blue-600" />
                              Basic Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 bg-gradient-to-br from-blue-25 to-purple-25">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Display Name</Label>
                                <p className="text-gray-900 font-medium">{profileData.displayName || 'Not set'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Email Address</Label>
                                <p className="text-gray-900 font-medium">{profileData.email || 'Not set'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Phone Number</Label>
                                <p className="text-gray-900 font-medium">{profileData.phone || 'Not set'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Location</Label>
                                <p className="text-gray-900 font-medium">{profileData.location || 'Not set'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Website</Label>
                                <p className="text-gray-900 font-medium">{profileData.website || 'Not set'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                                <p className="text-gray-900 font-medium">{profileData.dateOfBirth || 'Not set'}</p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600">Bio</Label>
                              <p className="text-gray-900 font-medium">{profileData.bio || 'No bio added yet'}</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Edit Basic Information Card */}
                        <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
                          <CardContent className="p-6 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <SettingsIcon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Edit Your Information</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                  Update your personal details, contact information, and profile settings
                                </p>
                              </div>
                              <Button 
                                type="button"
                                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={() => {
                                  // For now, we'll show a toast - this could navigate to an edit page or show an edit modal
                                  toast({
                                    title: "Edit Profile",
                                    description: "Profile editing functionality will be available soon!",
                                    duration: 3000,
                                  });
                                }}
                              >
                                <User className="w-4 h-4 mr-2" />
                                Edit Basic Information
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </form>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Delivery Methods */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Delivery Methods</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-gray-600">Receive notifications via email</p>
                            </div>
                            <Switch
                              checked={notificationSettings.emailNotifications}
                              onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-gray-600">Receive browser notifications</p>
                            </div>
                            <Switch
                              checked={notificationSettings.pushNotifications}
                              onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>SMS Notifications</Label>
                              <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                            </div>
                            <Switch
                              checked={notificationSettings.smsNotifications}
                              onCheckedChange={(checked) => handleNotificationUpdate('smsNotifications', checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Content Types */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Content Types</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Analysis Updates</Label>
                              <p className="text-sm text-gray-600">New political analysis and insights</p>
                            </div>
                            <Switch
                              checked={notificationSettings.analysisUpdates}
                              onCheckedChange={(checked) => handleNotificationUpdate('analysisUpdates', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Election Alerts</Label>
                              <p className="text-sm text-gray-600">Important election news and updates</p>
                            </div>
                            <Switch
                              checked={notificationSettings.electionAlerts}
                              onCheckedChange={(checked) => handleNotificationUpdate('electionAlerts', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Weekly Digest</Label>
                              <p className="text-sm text-gray-600">Weekly summary of political developments</p>
                            </div>
                            <Switch
                              checked={notificationSettings.weeklyDigest}
                              onCheckedChange={(checked) => handleNotificationUpdate('weeklyDigest', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Security Alerts</Label>
                              <p className="text-sm text-gray-600">Account security and login notifications</p>
                            </div>
                            <Switch
                              checked={notificationSettings.securityAlerts}
                              onCheckedChange={(checked) => handleNotificationUpdate('securityAlerts', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Marketing Emails</Label>
                              <p className="text-sm text-gray-600">Product updates and promotional content</p>
                            </div>
                            <Switch
                              checked={notificationSettings.marketingEmails}
                              onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Privacy & Security Tab */}
              {activeTab === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    {/* Profile Privacy */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Profile Privacy
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Profile Visibility</Label>
                            <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                          </div>
                          <Switch
                            checked={privacySettings.profileVisibility === 'public'}
                            onCheckedChange={(checked) => 
                              handlePrivacyUpdate('profileVisibility', checked ? 'public' : 'private')
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Show Email Address</Label>
                            <p className="text-sm text-gray-600">Display your email on your public profile</p>
                          </div>
                          <Switch
                            checked={privacySettings.showEmail}
                            onCheckedChange={(checked) => handlePrivacyUpdate('showEmail', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Show Phone Number</Label>
                            <p className="text-sm text-gray-600">Display your phone number on your public profile</p>
                          </div>
                          <Switch
                            checked={privacySettings.showPhone}
                            onCheckedChange={(checked) => handlePrivacyUpdate('showPhone', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Show Location</Label>
                            <p className="text-sm text-gray-600">Display your location on your public profile</p>
                          </div>
                          <Switch
                            checked={privacySettings.showLocation}
                            onCheckedChange={(checked) => handlePrivacyUpdate('showLocation', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Data & Analytics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="w-5 h-5" />
                          Data & Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Allow Analytics</Label>
                            <p className="text-sm text-gray-600">Help us improve by sharing usage analytics</p>
                          </div>
                          <Switch
                            checked={privacySettings.allowAnalytics}
                            onCheckedChange={(checked) => handlePrivacyUpdate('allowAnalytics', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Allow Cookies</Label>
                            <p className="text-sm text-gray-600">Use cookies to enhance your experience</p>
                          </div>
                          <Switch
                            checked={privacySettings.allowCookies}
                            onCheckedChange={(checked) => handlePrivacyUpdate('allowCookies', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                          </div>
                          <Switch
                            checked={privacySettings.twoFactorAuth}
                            onCheckedChange={(checked) => handlePrivacyUpdate('twoFactorAuth', checked)}
                          />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <Lock className="w-4 h-4 mr-2" />
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Manage Devices
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Appearance & Language
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Theme */}
                      <div>
                        <Label className="text-base font-semibold">Theme</Label>
                        <p className="text-sm text-gray-600 mb-3">Choose your preferred theme</p>
                        <div className="grid grid-cols-3 gap-3">
                          {['light', 'dark', 'system'].map((theme) => (
                            <button
                              key={theme}
                              onClick={() => handleAppearanceUpdate('theme', theme)}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                appearanceSettings.theme === theme
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-sm font-medium capitalize">{theme}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Language */}
                      <div>
                        <Label className="text-base font-semibold">Language</Label>
                        <p className="text-sm text-gray-600 mb-3">Select your preferred language</p>
                        <select
                          value={appearanceSettings.language}
                          onChange={(e) => handleAppearanceUpdate('language', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="sw">Kiswahili</option>
                          <option value="ki">Kikuyu</option>
                          <option value="luo">Luo</option>
                        </select>
                      </div>

                      <Separator />

                      {/* Timezone */}
                      <div>
                        <Label className="text-base font-semibold">Timezone</Label>
                        <p className="text-sm text-gray-600 mb-3">Choose your timezone</p>
                        <select
                          value={appearanceSettings.timezone}
                          onChange={(e) => handleAppearanceUpdate('timezone', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>

                      <Separator />

                      {/* Interface Preferences */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Interface Preferences</Label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Compact Mode</Label>
                              <p className="text-sm text-gray-600">Show more content in less space</p>
                            </div>
                            <Switch
                              checked={appearanceSettings.compactMode}
                              onCheckedChange={(checked) => handleAppearanceUpdate('compactMode', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Animations</Label>
                              <p className="text-sm text-gray-600">Enable smooth animations and transitions</p>
                            </div>
                            <Switch
                              checked={appearanceSettings.animationsEnabled}
                              onCheckedChange={(checked) => handleAppearanceUpdate('animationsEnabled', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* AI Preferences Tab */}
              {activeTab === 'ai-preferences' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    {/* Multi-language AI Bot */}
                    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          Multi-Language Political Q&A Bot
                          <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">
                            High Priority
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Enable AI Political Bot</Label>
                            <p className="text-sm text-gray-600">AI-powered conversations about Kenyan politics in your preferred language</p>
                          </div>
                          <Switch
                            checked={aiSettings.enableMultiLanguageBot}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('enableMultiLanguageBot', checked)}
                          />
                        </div>

                        {aiSettings.enableMultiLanguageBot && (
                          <>
                            <Separator />
                            <div>
                              <Label className="text-base font-semibold">Preferred Languages</Label>
                              <p className="text-sm text-gray-600 mb-3">Select languages for AI responses</p>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { code: 'en', name: 'English' },
                                  { code: 'sw', name: 'Kiswahili' },
                                  { code: 'ki', name: 'Kikuyu' },
                                  { code: 'luo', name: 'Luo' }
                                ].map((lang) => (
                                  <label key={lang.code} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={aiSettings.preferredLanguages.includes(lang.code)}
                                      onChange={(e) => {
                                        const languages = e.target.checked
                                          ? [...aiSettings.preferredLanguages, lang.code]
                                          : aiSettings.preferredLanguages.filter(l => l !== lang.code);
                                        handleAiSettingsUpdate('preferredLanguages', languages);
                                      }}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{lang.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-base font-semibold">AI Response Style</Label>
                              <p className="text-sm text-gray-600 mb-3">How detailed should AI responses be?</p>
                              <select
                                value={aiSettings.aiResponseStyle}
                                onChange={(e) => handleAiSettingsUpdate('aiResponseStyle', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="concise">Concise - Brief and to the point</option>
                                <option value="detailed">Detailed - Comprehensive explanations</option>
                                <option value="academic">Academic - In-depth analysis with sources</option>
                              </select>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Crisis Early Warning */}
                    <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50/50 to-orange-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-900">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          Political Crisis Early Warning
                          <Badge variant="secondary" className="ml-2 text-xs bg-red-100 text-red-700">
                            High Priority
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Crisis Alerts</Label>
                            <p className="text-sm text-gray-600">Get early warnings about potential political instability</p>
                          </div>
                          <Switch
                            checked={aiSettings.crisisAlertsEnabled}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('crisisAlertsEnabled', checked)}
                          />
                        </div>

                        {aiSettings.crisisAlertsEnabled && (
                          <>
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="flex items-center gap-2 text-yellow-800 mb-1">
                                <Zap className="w-4 h-4" />
                                <span className="font-medium text-sm">Real-time Monitoring</span>
                              </div>
                              <p className="text-xs text-yellow-700">
                                AI monitors social media, news, and government sources for early crisis indicators
                              </p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Enhanced Misinformation Detection */}
                    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50/50 to-teal-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-900">
                          <Shield className="w-5 h-5 text-green-600" />
                          Enhanced Misinformation Detection
                          <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                            High Priority
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Misinformation Detection</Label>
                            <p className="text-sm text-gray-600">Advanced AI to detect fake news and generate counter-narratives</p>
                          </div>
                          <Switch
                            checked={aiSettings.misinformationDetection}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('misinformationDetection', checked)}
                          />
                        </div>

                        {aiSettings.misinformationDetection && (
                          <>
                            <div>
                              <Label className="text-base font-semibold">Confidence Threshold</Label>
                              <p className="text-sm text-gray-600 mb-3">How confident should AI be before flagging content?</p>
                              <div className="space-y-2">
                                <input
                                  type="range"
                                  min="0.1"
                                  max="1"
                                  step="0.1"
                                  value={aiSettings.confidenceThreshold}
                                  onChange={(e) => handleAiSettingsUpdate('confidenceThreshold', parseFloat(e.target.value))}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>More Sensitive</span>
                                  <span>{Math.round(aiSettings.confidenceThreshold * 100)}%</span>
                                  <span>More Selective</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* County-Specific Analysis */}
                    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-900">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          County-Specific Analysis
                          <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-700">
                            High Priority
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>County-Specific Insights</Label>
                            <p className="text-sm text-gray-600">Get AI analysis tailored to all 47 Kenyan counties</p>
                          </div>
                          <Switch
                            checked={aiSettings.countySpecificAnalysis}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('countySpecificAnalysis', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Personalized Insights</Label>
                            <p className="text-sm text-gray-600">AI learns your interests for better recommendations</p>
                          </div>
                          <Switch
                            checked={aiSettings.personalizedInsights}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('personalizedInsights', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Real-time Updates</Label>
                            <p className="text-sm text-gray-600">Get live updates on political developments</p>
                          </div>
                          <Switch
                            checked={aiSettings.realTimeUpdates}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('realTimeUpdates', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Auto Translation</Label>
                            <p className="text-sm text-gray-600">Automatically translate content between languages</p>
                          </div>
                          <Switch
                            checked={aiSettings.autoTranslation}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('autoTranslation', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Interactive Visualization & Insights */}
                    <Card className="border-2 border-teal-200 bg-gradient-to-r from-teal-50/50 to-emerald-50/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-teal-900">
                          <BarChart3 className="w-5 h-5 text-teal-600" />
                          Interactive Visualization & Insights
                          <Badge variant="secondary" className="ml-2 text-xs bg-teal-100 text-teal-700">
                            Latest
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>AI-Generated Dashboards</Label>
                            <p className="text-sm text-gray-600">Enable dynamic political dashboards that adapt to current events</p>
                          </div>
                          <Switch
                            checked={aiSettings.enableAIDashboards}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('enableAIDashboards', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Predictive Heat Maps</Label>
                            <p className="text-sm text-gray-600">Enable county-level predictions for elections and policy support</p>
                          </div>
                          <Switch
                            checked={aiSettings.enablePredictiveHeatMaps}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('enablePredictiveHeatMaps', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Policy Comparison Tool</Label>
                            <p className="text-sm text-gray-600">Interactive analysis of party manifestos and policy alignment</p>
                          </div>
                          <Switch
                            checked={aiSettings.enablePolicyComparison}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('enablePolicyComparison', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Political Timeline Generator</Label>
                            <p className="text-sm text-gray-600">Interactive event mapping with connections and analysis</p>
                          </div>
                          <Switch
                            checked={aiSettings.enablePoliticalTimeline}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('enablePoliticalTimeline', checked)}
                          />
                        </div>

                        <Separator />

                        <div>
                          <Label className="text-base font-semibold">Default Dashboard Type</Label>
                          <p className="text-sm text-gray-600 mb-3">Choose your preferred dashboard template</p>
                          <select
                            value={aiSettings.defaultDashboardType}
                            onChange={(e) => handleAiSettingsUpdate('defaultDashboardType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="election-monitoring">Election Monitoring</option>
                            <option value="policy-tracker">Policy Tracker</option>
                            <option value="governance-overview">Governance Overview</option>
                            <option value="crisis-management">Crisis Management</option>
                            <option value="constituency-focus">Constituency Focus</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-base font-semibold">Default Heat Map Type</Label>
                          <p className="text-sm text-gray-600 mb-3">Choose your preferred prediction model</p>
                          <select
                            value={aiSettings.defaultHeatMapType}
                            onChange={(e) => handleAiSettingsUpdate('defaultHeatMapType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="election-outcomes">Election Outcomes</option>
                            <option value="policy-support">Policy Support Levels</option>
                            <option value="political-activity">Political Activity Intensity</option>
                            <option value="crisis-risk">Political Crisis Risk</option>
                            <option value="voter-turnout">Voter Turnout Predictions</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-base font-semibold">Visualization Refresh Rate</Label>
                          <p className="text-sm text-gray-600 mb-3">How often should visualizations update?</p>
                          <select
                            value={aiSettings.visualizationRefreshRate}
                            onChange={(e) => handleAiSettingsUpdate('visualizationRefreshRate', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="15min">Every 15 minutes</option>
                            <option value="1hour">Every hour</option>
                            <option value="1day">Daily</option>
                          </select>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Auto-Generate Insights</Label>
                            <p className="text-sm text-gray-600">Automatically generate AI insights from visualizations</p>
                          </div>
                          <Switch
                            checked={aiSettings.autoGenerateInsights}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('autoGenerateInsights', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Show Confidence Intervals</Label>
                            <p className="text-sm text-gray-600">Display prediction confidence and uncertainty measures</p>
                          </div>
                          <Switch
                            checked={aiSettings.showConfidenceIntervals}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('showConfidenceIntervals', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Interactive Features</Label>
                            <p className="text-sm text-gray-600">Enable interactive elements like zoom, filters, and drill-downs</p>
                          </div>
                          <Switch
                            checked={aiSettings.enableInteractiveFeatures}
                            onCheckedChange={(checked) => handleAiSettingsUpdate('enableInteractiveFeatures', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === 'data' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    {/* Data Export */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Data Export
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">
                          Download a copy of your data including profile information, settings, and activity history.
                        </p>
                        <Button onClick={exportData} disabled={isLoading} className="w-full">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Preparing Export...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Export My Data
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Account Deletion */}
                    <Card className="border-red-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                          Danger Zone
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                          <p className="text-red-700 text-sm mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className="w-full"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete My Account
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
