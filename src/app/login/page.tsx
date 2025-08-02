"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
  Facebook,
  Twitter,
  Apple,
  Smartphone,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password confirmation is required."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address."),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuthStore();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      login({ fullName: user.displayName || user.email?.split('@')[0] || 'User' });
      toast({ 
        title: "Welcome back!", 
        description: "Successfully logged into your account.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      }
      
      toast({ 
        title: "Login Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignup(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: values.fullName });
      
      login({ fullName: values.fullName });
      toast({ 
        title: "Account Created Successfully!", 
        description: "Welcome to Sauti Ya Watu. Let's get started!",
      });
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      toast({ 
        title: "Signup Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetPassword(values: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({ 
        title: "Reset Email Sent", 
        description: "Check your email for password reset instructions.",
      });
      setShowResetForm(false);
      resetForm.reset();
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      toast({ 
        title: "Reset Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithProvider(providerName: string) {
    setIsLoading(true);
    try {
      let provider;
      
      switch (providerName) {
        case 'google':
          provider = new GoogleAuthProvider();
          provider.addScope('email');
          provider.addScope('profile');
          break;
        case 'github':
          provider = new GithubAuthProvider();
          provider.addScope('user:email');
          break;
        case 'facebook':
          provider = new FacebookAuthProvider();
          provider.addScope('email');
          break;
        case 'twitter':
          provider = new TwitterAuthProvider();
          break;
        default:
          throw new Error('Unsupported provider');
      }
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      login({ 
        fullName: user.displayName || user.email?.split('@')[0] || 'User' 
      });
      
      toast({ 
        title: "Welcome!", 
        description: `Successfully signed in with ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}.`,
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = `Failed to sign in with ${providerName}.`;
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      }
      
      toast({ 
        title: "Sign-in Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
              Welcome to Sauti Ya Watu
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {showResetForm 
                ? "Enter your email to reset your password"
                : "Your political intelligence platform - Sign in to continue"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {showResetForm ? (
              /* Password Reset Form */
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input 
                                type="email" 
                                placeholder="Enter your email address"
                                className="pl-10 h-12"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => setShowResetForm(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Reset Email'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <>
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                      onClick={() => signInWithProvider('google')}
                      disabled={isLoading}
                    >
                      <Chrome className="w-5 h-5 mr-3 text-blue-600" />
                      Continue with Google
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => signInWithProvider('github')}
                      disabled={isLoading}
                    >
                      <Github className="w-5 h-5 mr-3" />
                      Continue with GitHub
                    </Button>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        onClick={() => signInWithProvider('facebook')}
                        disabled={isLoading}
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                        onClick={() => signInWithProvider('twitter')}
                        disabled={isLoading}
                      >
                        <Twitter className="w-5 h-5 text-blue-500" />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <Separator className="my-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">or continue with email</span>
                  </div>
                </div>

                {/* Email/Password Forms */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100">
                    <TabsTrigger 
                      value="login" 
                      className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <LogIn className="h-4 w-4" /> 
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <UserPlus className="h-4 w-4" /> 
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="pl-10 h-12"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10 h-12"
                                    {...field} 
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                            onClick={() => setShowResetForm(true)}
                          >
                            Forgot your password?
                          </button>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold transition-all duration-200" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              <LogIn className="w-4 h-4 mr-2" />
                              Sign In
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                        <FormField
                          control={signupForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    placeholder="Enter your full name"
                                    className="pl-10 h-12"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="pl-10 h-12"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password (8+ characters)"
                                    className="pl-10 pr-10 h-12"
                                    {...field} 
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="pl-10 pr-10 h-12"
                                    {...field} 
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold transition-all duration-200" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Create Account
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Secure authentication powered by Firebase</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              256-bit SSL encryption
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              SOC 2 compliant
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}