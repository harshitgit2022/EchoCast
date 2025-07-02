import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  PhoneOff,
  Settings,
  Users,
  Share2,
  Circle,
  Square,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Monitor,
  Maximize2,
  ArrowLeft,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecordingStudioProps {
  onBack: () => void;
}

const RecordingStudio = ({ onBack }: RecordingStudioProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [participants] = useState([
    { id: '1', name: 'You', isHost: true, micOn: true, cameraOn: true },
    { id: '2', name: 'Sarah Johnson', isHost: false, micOn: true, cameraOn: true },
    { id: '3', name: 'Mike Chen', isHost: false, micOn: false, cameraOn: true },
  ]);
  
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    toast({
      title: "Recording Started",
      description: "Your session is now being recorded",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    toast({
      title: "Recording Stopped",
      description: "Your recording has been saved successfully",
    });
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Recording Resumed" : "Recording Paused",
      description: isPaused ? "Recording has resumed" : "Recording is paused",
    });
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast({
      title: isMicOn ? "Microphone Off" : "Microphone On",
      description: isMicOn ? "Your microphone is now muted" : "Your microphone is now active",
    });
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    toast({
      title: isCameraOn ? "Camera Off" : "Camera On",
      description: isCameraOn ? "Your camera is now off" : "Your camera is now on",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-white font-semibold ml-2">Tech Talk Episode 16</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isRecording && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-mono font-semibold">
                    REC {formatTime(recordingTime)}
                  </span>
                </div>
              )}
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Users className="w-3 h-3 mr-1" />
                {participants.length} participants
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video Grid */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                  {participants.map((participant) => (
                    <div key={participant.id} className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
                      {participant.cameraOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <div className="text-4xl font-bold text-white">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <VideoOff className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Participant Info */}
                      <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
                          <span className="text-white text-sm font-medium">{participant.name}</span>
                          {participant.isHost && (
                            <Badge variant="secondary" className="text-xs bg-purple-600 text-white">
                              Host
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Mic Status */}
                      <div className="absolute bottom-3 right-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          participant.micOn ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {participant.micOn ? (
                            <Mic className="w-4 h-4 text-white" />
                          ) : (
                            <MicOff className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Fullscreen Button */}
                      <div className="absolute top-3 right-3">
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recording Controls */}
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording ? (
                    <Button 
                      onClick={handleStartRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                    >
                      <Circle className="w-5 h-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={handlePauseRecording}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white"
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </Button>
                      <Button 
                        onClick={handleStopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Audio/Video Controls */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-4">Controls</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Microphone</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMic}
                        className={`w-10 h-10 p-0 rounded-full ${
                          isMicOn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {isMicOn ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-white" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Camera</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleCamera}
                        className={`w-10 h-10 p-0 rounded-full ${
                          isCameraOn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {isCameraOn ? <Video className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-white" />}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Volume</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className="w-8 h-8 p-0"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                        </Button>
                      </div>
                      <Slider
                        defaultValue={[75]}
                        max={100}
                        step={1}
                        className="w-full"
                        disabled={isMuted}
                      />
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Session Info */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-4">Session Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white font-mono">{formatTime(recordingTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality</span>
                      <span className="text-white">1080p HD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Audio</span>
                      <span className="text-white">48kHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <Badge variant={isRecording ? 'destructive' : 'secondary'}>
                        {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Standby'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants List */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-4">Participants</h3>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-white text-sm">{participant.name}</span>
                          {participant.isHost && (
                            <Badge variant="secondary" className="text-xs bg-purple-600 text-white">
                              Host
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            participant.micOn ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {participant.micOn ? (
                              <Mic className="w-2 h-2 text-white" />
                            ) : (
                              <MicOff className="w-2 h-2 text-white" />
                            )}
                          </div>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            participant.cameraOn ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {participant.cameraOn ? (
                              <Video className="w-2 h-2 text-white" />
                            ) : (
                              <VideoOff className="w-2 h-2 text-white" />
                            )}
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
    </div>
  );
};

export default RecordingStudio;
