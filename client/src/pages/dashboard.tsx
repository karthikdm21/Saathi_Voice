import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AudioPlayer from "@/components/audio-player";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('saathi_user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  const { data: mentorships = [] } = useQuery({
    queryKey: ['/api/mentorships', currentUser?.role, currentUser?.studentId || currentUser?.mentorId],
    enabled: !!currentUser,
  });

  if (!currentUser) return null;

  const initials = currentUser.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-black">
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
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white" data-testid="text-user-initials">{initials}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">
            Welcome back, <span data-testid="text-user-name">{currentUser.name}</span>! 👋
          </h2>
          <p className="text-gray-400">Ready to connect and learn today?</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Voice Messages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Voice Message */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Send Voice Message</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    data-testid="button-record-message"
                    className="w-16 h-16 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center"
                  >
                    🎤
                  </Button>
                  <div className="flex-1">
                    <p className="text-gray-300">Tap to record a voice message</p>
                    <p className="text-sm text-gray-500">Share your thoughts, ask questions, or provide guidance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Voice Messages */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Recent Messages</h3>
                <div className="space-y-4">
                  {mentorships?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No messages yet</p>
                      <p className="text-sm text-gray-500">Start by connecting with a mentor or student</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Sample message card */}
                      <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-xl">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">PM</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">Sample Mentor</h4>
                            <span className="text-sm text-gray-400">2 hours ago</span>
                          </div>
                          <AudioPlayer audioUrl="/sample-audio.mp3" />
                          <p className="text-sm text-gray-400 mt-2">Voice message about career guidance...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{currentUser.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{currentUser.role}</p>
                  <p className="text-gray-500 text-xs mt-1">{currentUser.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Find Mentors/Students */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {currentUser.role === 'student' ? 'Find Mentors' : 'View Students'}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Field of Interest</label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Technology" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Preferred Language</label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Hindi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    data-testid="button-search"
                    onClick={() => setLocation('/mentor-matching')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
                  >
                    {currentUser.role === 'student' ? 'Search Mentors' : 'View Students'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Connections */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {currentUser.role === 'student' ? 'Your Mentors' : 'Your Students'}
                </h3>
                <div className="space-y-3">
                  {mentorships?.length === 0 ? (
                    <p className="text-gray-400 text-sm">No connections yet</p>
                  ) : (
                    <div className="space-y-3">
                      {/* Sample connection */}
                      <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">PM</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-white">Sample Connection</h4>
                          <p className="text-xs text-gray-400">Technology Expert</p>
                        </div>
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
