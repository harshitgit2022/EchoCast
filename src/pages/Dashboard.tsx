
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Mic, 
  Video, 
  Users, 
  Clock, 
  Play, 
  Download, 
  Share2, 
  Calendar,
  Zap,
  LogOut,
  Settings,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onStartRecording: () => void;
}

const Dashboard = ({ onStartRecording }: DashboardProps) => {
  const [sessionName, setSessionName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const { toast } = useToast();

  // Mock data for past sessions
  const pastSessions = [
    {
      id: '1',
      name: 'Tech Talk Episode 15',
      date: '2024-01-20',
      duration: '45:32',
      participants: 3,
      status: 'completed',
      size: '2.1 GB'
    },
    {
      id: '2',
      name: 'Marketing Strategy Discussion',
      date: '2024-01-18',
      duration: '1:12:15',
      participants: 2,
      status: 'completed',
      size: '3.8 GB'
    },
    {
      id: '3',
      name: 'Product Demo Session',
      date: '2024-01-15',
      duration: '28:45',
      participants: 5,
      status: 'processing',
      size: '1.5 GB'
    }
  ];

  const handleCreateSession = () => {
    if (!sessionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a session name",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Session Created!",
      description: `"${sessionName}" is ready for recording`,
    });
    
    onStartRecording();
  };

  const handleJoinSession = () => {
    if (!sessionId.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a session ID",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Joining Session",
      description: `Connecting to session ${sessionId}...`,
    });
    
    onStartRecording();
  };

  const copySessionLink = (id: string) => {
    navigator.clipboard.writeText(`https://echocast.app/join/${id}`);
    toast({
      title: "Link Copied!",
      description: "Session link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 ml-3">EchoCast</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Ready to create your next masterpiece?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create/Join Session */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-purple-600" />
                  Start Recording
                </CardTitle>
                <CardDescription>
                  Create a new session or join an existing one
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="session-name">Create New Session</Label>
                    <Input
                      id="session-name"
                      placeholder="Enter session name"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="mt-1"
                    />
                    <Button 
                      onClick={handleCreateSession}
                      className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="session-id">Join Existing Session</Label>
                    <Input
                      id="session-id"
                      placeholder="Enter session ID"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      className="mt-1"
                    />
                    <Button 
                      onClick={handleJoinSession}
                      variant="outline" 
                      className="w-full mt-3"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-500">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">48h</div>
                    <div className="text-sm text-gray-500">Recorded</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Sessions
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <CardDescription>
                  Manage and access your recorded sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <Video className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{session.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {session.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {session.duration}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {session.participants}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={session.status === 'completed' ? 'secondary' : 'default'}
                          className={session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {session.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {session.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => copySessionLink(session.id)}>
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
