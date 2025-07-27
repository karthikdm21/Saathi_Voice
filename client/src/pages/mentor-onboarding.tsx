import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import VoiceRecorder from "@/components/voice-recorder";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function MentorOnboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    fieldOfExpertise: "",
    bio: "",
    location: "",
    languages: [] as string[],
    voiceIntroUrl: "",
    availability: "weekends"
  });

  const handleVoiceRecorded = async (audioUrl: string, transcription: string) => {
    setFormData(prev => ({
      ...prev,
      voiceIntroUrl: audioUrl,
      bio: transcription // Set bio from voice transcription
    }));
  };

  const handleSubmit = async () => {
    try {
      // Create user
      const userData = {
        role: "mentor",
        name: formData.name,
        location: formData.location,
        languages: formData.languages
      };
      
      const user = await apiRequest("POST", "/api/users", userData);
      const userResult = await user.json();
      
      // Create mentor profile
      const mentorData = {
        userId: userResult.id,
        experience: parseInt(formData.experience),
        fieldOfExpertise: formData.fieldOfExpertise,
        bio: formData.bio,
        voiceIntroUrl: formData.voiceIntroUrl,
        availability: formData.availability,
        rating: 50, // Default rating out of 10 (5.0)
        totalReviews: 0
      };
      
      const mentor = await apiRequest("POST", "/api/mentors", mentorData);
      const mentorResult = await mentor.json();
      
      // Store in localStorage for session
      localStorage.setItem('saathi_user', JSON.stringify({
        ...userResult,
        mentorId: mentorResult.id,
        role: 'mentor'
      }));
      
      toast({
        title: "Profile Created!",
        description: "Welcome to Saathi Voice. You can now help students."
      });
      
      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <Button
            data-testid="button-back"
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="absolute top-0 left-0 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">👨‍🏫 Mentor Registration</h1>
          <p className="text-gray-400 mt-2">Share your expertise to help others</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience" className="text-white">Experience (Years)</Label>
                  <Input
                    id="experience"
                    data-testid="input-experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Years of experience"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="field" className="text-white">Field of Expertise</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fieldOfExpertise: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="arts">Arts & Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    data-testid="input-location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-white">About You</Label>
                  <Textarea
                    id="bio"
                    data-testid="textarea-bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell students about your background and how you can help them"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Introduction Options */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Introduce Yourself</h2>
              <p className="text-gray-400 mb-6">Tell students about yourself and how you can help them - choose voice or text</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voice Recording Option */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white text-center">🎤 Voice Introduction</h3>
                  <VoiceRecorder
                    onRecordingComplete={handleVoiceRecorded}
                    prompt="Introduce yourself and explain how you can help students"
                  />
                </div>
                
                {/* Text Input Option */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white text-center">✍️ Written Introduction</h3>
                  <div>
                    <Label htmlFor="text-bio" className="text-white">Write your introduction</Label>
                    <textarea
                      id="text-bio"
                      data-testid="textarea-text-bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Introduce yourself and explain how you can help students with your expertise..."
                      className="w-full h-32 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Languages You Speak</h2>
              <div className="grid grid-cols-2 gap-3">
                {['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi'].map((lang) => (
                  <label key={lang} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                      checked={formData.languages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            languages: [...prev.languages, lang] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            languages: prev.languages.filter(l => l !== lang) 
                          }));
                        }
                      }}
                    />
                    <span className="text-white">{lang}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            data-testid="button-create-profile"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl"
            disabled={!formData.name || !formData.fieldOfExpertise || formData.languages.length === 0 || (!formData.voiceIntroUrl && !formData.bio)}
          >
            Create Mentor Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
