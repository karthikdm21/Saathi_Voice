import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mic } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AudioPlayer from "@/components/audio-player";
import VoiceRecorder from "@/components/voice-recorder";

export default function VoiceChat() {
  const [, setLocation] = useLocation();
  const { mentorshipId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('saathi_user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const { data: mentorship } = useQuery({
    queryKey: ['/api/mentorships', mentorshipId],
    enabled: !!mentorshipId,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/voice-messages/mentorship', mentorshipId],
    enabled: !!mentorshipId,
  });

  const otherUser = currentUser?.role === 'student' 
    ? mentorship?.mentor?.user 
    : mentorship?.student?.user;

  const otherUserInitials = otherUser?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Navigation Header */}
      <nav className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 
              className="text-2xl font-bold text-white cursor-pointer hover:text-green-400 transition-colors"
              onClick={() => {
                localStorage.removeItem('saathi_user');
                setLocation('/');
              }}
              data-testid="button-home-logo"
            >
              🎙️ Saathi Voice
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              data-testid="button-back"
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Chat Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-4 max-w-6xl mx-auto">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">{otherUserInitials}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-white" data-testid="text-other-user-name">
              {otherUser?.name || 'Loading...'}
            </h2>
            <p className="text-sm text-gray-400">
              {currentUser?.role === 'student' ? 'Your Mentor' : 'Your Student'} • Online
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No messages yet</p>
            <p className="text-sm text-gray-500">Start the conversation with a voice message</p>
          </div>
        ) : (
          messages?.map((message: any) => {
            const isCurrentUser = message.senderId === currentUser?.id;
            return (
              <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-sm rounded-2xl p-4 ${
                  isCurrentUser 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-white'
                }`}>
                  <AudioPlayer 
                    audioUrl={message.audioUrl} 
                    variant={isCurrentUser ? 'sent' : 'received'}
                  />
                  {message.transcription && (
                    <p className="text-sm mt-2 opacity-90">{message.transcription}</p>
                  )}
                  <span className={`text-xs mt-2 block ${
                    isCurrentUser ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Voice Input */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            📎
          </Button>
          <div className="flex-1 flex items-center space-x-3">
            <VoiceRecorder
              onRecordingComplete={(audioUrl, transcription) => {
                // TODO: Send message to API
                console.log('Voice message recorded:', { audioUrl, transcription });
              }}
              compact={true}
            />
            <span className="text-gray-400">Hold to record voice message</span>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            😊
          </Button>
        </div>
      </div>
    </div>
  );
}
