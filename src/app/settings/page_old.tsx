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
  Settings as SettingsIcon
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

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
        profileImage: user.photoURL || ''
      }));
      
      // Load saved settings from localStorage or API
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      // Try to load from localStorage first
      const savedNotifications = localStorage.getItem('notification-settings');
      const savedPrivacy = localStorage.getItem('privacy-settings');
      const savedAppearance = localStorage.getItem('appearance-settings');
      const savedProfile = localStorage.getItem('profile-settings');

      if (savedNotifications) {
        setNotificationSettings(JSON.parse(savedNotifications));
      }
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }
      if (savedAppearance) {
        setAppearanceSettings(JSON.parse(savedAppearance));
      }
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setProfileData(prev => ({ ...prev, ...profile }));
      }

      // You can also make an API call here to get settings from the server
      // const response = await fetch('/api/user/settings');
      // const data = await response.json();
      // if (data.success) { ... }
      
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const saveSettings = async (settingsType: string, data: any) => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem(`${settingsType}-settings`, JSON.stringify(data));
      
      // You can also save to your API here
      // const response = await fetch('/api/user/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: settingsType, data })
      // });

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
    await saveSettings('profile', profileData);
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
      
      // Here you would upload to your storage service (Firebase Storage, AWS S3, etc.)
      // const uploadResponse = await uploadImageToStorage(file);
      // setProfileData(prev => ({ ...prev, profileImage: uploadResponse.url }));
      
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
        // Here you would call your delete account API
        // await fetch('/api/user/delete', { method: 'DELETE' });
        
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
  const [imageError, setImageError] = useState(false);

  // Profile settings state
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    dateOfBirth: ''
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
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
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
    shareUsageStats: false,
    twoFactorAuth: false
  });

  // Theme settings state
  const [theme, setTheme] = useState({
    colorScheme: 'system',
    fontSize: 'medium',
    language: 'en',
    timezone: 'Africa/Nairobi'
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

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

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // TODO: Implement profile update logic
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1000);
  };

  const handleExportData = () => {
    // TODO: Implement data export logic
    const dataBlob = new Blob([JSON.stringify({ profile, notifications, privacy }, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sauti-ya-watu-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
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

        <div className="relative container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div className="flex items-center gap-4 mb-6 lg:mb-0">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                  Account Settings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your account preferences and privacy settings
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-8">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
                        {user?.photoURL && !imageError ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || 'User'}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <span className="font-bold">{getUserInitials()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {user?.displayName || user?.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="p-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                            activeTab === tab.id
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                          {user?.photoURL && !imageError ? (
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName || 'User'}
                              className="w-full h-full object-cover"
                              onError={() => setImageError(true)}
                            />
                          ) : (
                            <span>{getUserInitials()}</span>
                          )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Profile Picture</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Upload a new profile picture or remove the current one
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profile.displayName}
                          onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="Enter your display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          disabled
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed directly</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+254 xxx xxx xxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, County"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profile.website}
                          onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://your-website.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500">{profile.bio.length}/500 characters</p>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-600" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, smsNotifications: checked }))
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Content Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Analysis Updates</Label>
                          <p className="text-sm text-gray-600">New AI analysis and insights</p>
                        </div>
                        <Switch
                          checked={notifications.analysisUpdates}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, analysisUpdates: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Election Alerts</Label>
                          <p className="text-sm text-gray-600">Important election news and updates</p>
                        </div>
                        <Switch
                          checked={notifications.electionAlerts}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, electionAlerts: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Weekly Digest</Label>
                          <p className="text-sm text-gray-600">Weekly summary of political insights</p>
                        </div>
                        <Switch
                          checked={notifications.weeklyDigest}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, weeklyDigest: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Security Alerts</Label>
                          <p className="text-sm text-gray-600">Account security and login notifications</p>
                        </div>
                        <Switch
                          checked={notifications.securityAlerts}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, securityAlerts: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Marketing Emails</Label>
                          <p className="text-sm text-gray-600">Product updates and promotional content</p>
                        </div>
                        <Switch
                          checked={notifications.marketingEmails}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Privacy & Security Tab */}
              {activeTab === 'privacy' && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Profile Visibility</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="public"
                            name="visibility"
                            value="public"
                            checked={privacy.profileVisibility === 'public'}
                            onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                            className="w-4 h-4 text-purple-600"
                          />
                          <Label htmlFor="public">Public</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="private"
                            name="visibility"
                            value="private"
                            checked={privacy.profileVisibility === 'private'}
                            onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                            className="w-4 h-4 text-purple-600"
                          />
                          <Label htmlFor="private">Private</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Contact Information</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Email Address</Label>
                          <p className="text-sm text-gray-600">Make your email visible to other users</p>
                        </div>
                        <Switch
                          checked={privacy.showEmail}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, showEmail: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Show Phone Number</Label>
                          <p className="text-sm text-gray-600">Make your phone number visible to other users</p>
                        </div>
                        <Switch
                          checked={privacy.showPhone}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, showPhone: checked }))
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Enable 2FA</Label>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {privacy.twoFactorAuth && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              <Lock className="w-3 h-3 mr-1" />
                              Enabled
                            </Badge>
                          )}
                          <Switch
                            checked={privacy.twoFactorAuth}
                            onCheckedChange={(checked) => 
                              setPrivacy(prev => ({ ...prev, twoFactorAuth: checked }))
                            }
                          />
                        </div>
                      </div>

                      {privacy.twoFactorAuth && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">2FA is Active</span>
                          </div>
                          <p className="text-sm text-green-700">
                            Your account is protected with two-factor authentication. 
                            You'll need your authenticator app to sign in.
                          </p>
                          <Button variant="outline" size="sm" className="mt-3 text-green-600 border-green-300">
                            Manage 2FA Settings
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-600" />
                      Appearance & Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Color Scheme</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {['light', 'dark', 'system'].map((scheme) => (
                            <button
                              key={scheme}
                              onClick={() => setTheme(prev => ({ ...prev, colorScheme: scheme }))}
                              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                theme.colorScheme === scheme
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="capitalize font-medium">{scheme}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {['small', 'medium', 'large'].map((size) => (
                            <button
                              key={size}
                              onClick={() => setTheme(prev => ({ ...prev, fontSize: size }))}
                              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                theme.fontSize === size
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="capitalize font-medium">{size}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select
                          id="language"
                          value={theme.language}
                          onChange={(e) => setTheme(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="en">English</option>
                          <option value="sw">Kiswahili</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select
                          id="timezone"
                          value={theme.timezone}
                          onChange={(e) => setTheme(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="Europe/London">Greenwich Mean Time</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === 'data' && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-600" />
                      Data & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Allow Data Collection</Label>
                          <p className="text-sm text-gray-600">Help improve our services with usage analytics</p>
                        </div>
                        <Switch
                          checked={privacy.allowDataCollection}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, allowDataCollection: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Share Usage Statistics</Label>
                          <p className="text-sm text-gray-600">Share anonymous usage data for research</p>
                        </div>
                        <Switch
                          checked={privacy.shareUsageStats}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, shareUsageStats: checked }))
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Data Management</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export My Data
                        </Button>
                        
                        <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                          <Trash2 className="w-4 h-4" />
                          Request Data Deletion
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-red-600">Danger Zone</h3>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-800">Delete Account</span>
                        </div>
                        <p className="text-sm text-red-700 mb-3">
                          Once you delete your account, there is no going back. 
                          Please be certain. This action cannot be undone.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={handleDeleteAccount}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        >
                          Delete My Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
