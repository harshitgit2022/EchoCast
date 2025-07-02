
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Video, Users, Clock, Play, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/lib/api";
import Dashboard from './Dashboard';
import RecordingStudio from './RecordingStudio';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'recording'>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await ApiService.login({
        username: email, // FastAPI uses 'username' field for email
        password: password
      });

      // Store the token
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('token_type', response.token_type);

      // Get user info
      const user = await ApiService.getCurrentUser();
      localStorage.setItem('user_email', user.email);

      setIsAuthenticated(true);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await ApiService.signup({
        email: email,
        password: password
      });

      toast({
        title: "Account Created!",
        description: "Please login with your new account.",
      });

      // Switch to login tab
      const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
      loginTab?.click();
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    if (currentView === 'recording') {
      return <RecordingStudio onBack={() => setCurrentView('dashboard')} />;
    }
    return <Dashboard onStartRecording={() => setCurrentView('recording')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white ml-3">EchoCast</h1>
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Professional podcast and video recording studio in your browser. 
            Create, record, and share high-quality content with ease.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Mic className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">Crystal Clear Audio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                High-quality audio recording with noise cancellation and automatic gain control.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Video className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">HD Video Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                Record video in up to 4K resolution with multiple camera angles and layouts.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Users className="w-8 h-8 text-pink-400 mb-2" />
              <CardTitle className="text-white">Multi-Guest Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                Invite up to 8 guests to join your recording session with individual tracks.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Welcome to EchoCast</CardTitle>
              <CardDescription className="text-center">
                Sign in to start your recording journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-purple-300 text-sm">Hours Recorded</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">5K+</div>
            <div className="text-purple-300 text-sm">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-purple-300 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4K</div>
            <div className="text-purple-300 text-sm">Max Quality</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
