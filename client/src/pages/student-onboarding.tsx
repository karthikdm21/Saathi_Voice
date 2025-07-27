import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import VoiceRecorder from "@/components/voice-recorder";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function StudentOnboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    studyField: "",
    location: "",
    languages: [] as string[],
    goals: "",
    voiceIntroUrl: "",
    transcription: ""
  });

  const handleVoiceRecorded = async (audioUrl: string, transcription: string) => {
    setFormData(prev => ({
      ...prev,
      voiceIntroUrl: audioUrl,
      transcription
    }));
    
    // Extract name and other info from transcription
    const name = extractNameFromTranscription(transcription);
    if (name) {
      setFormData(prev => ({ ...prev, name }));
    }
  };

  const extractNameFromTranscription = (text: string): string => {
    // Simple name extraction - in real app, use NLP
    const nameMatch = text.match(/my name is (\w+)/i) || text.match(/I am (\w+)/i);
    return nameMatch ? nameMatch[1] : "";
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      // Create user
      const userData = {
        role: "student",
        name: formData.name,
        location: formData.location,
        languages: formData.languages
      };
      
      const user = await apiRequest("POST", "/api/users", userData);
      const userResult = await user.json();
      
      // Create student profile
      const studentData = {
        userId: userResult.id,
        age: parseInt(formData.age),
        studyField: formData.studyField,
        goals: formData.goals,
        voiceIntroUrl: formData.voiceIntroUrl,
        transcription: formData.transcription,
        preferredLanguages: formData.languages
      };
      
      const student = await apiRequest("POST", "/api/students", studentData);
      const studentResult = await student.json();
      
      // Store in localStorage for session
      localStorage.setItem('saathi_user', JSON.stringify({
        ...userResult,
        studentId: studentResult.id,
        role: 'student'
      }));
      
      toast({
        title: "Profile Created!",
        description: "Welcome to Saathi Voice. Let's find you a mentor."
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
          <h1 className="text-3xl font-bold text-white">👨‍🎓 Student Registration</h1>
          <p className="text-gray-400 mt-2">Tell us about yourself using your voice</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  stepNum === step ? 'bg-green-600' : stepNum < step ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6 text-center text-white">
                  Step 1: Introduce Yourself
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Voice Recording Option */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white text-center">🎤 Voice Introduction</h3>
                    <VoiceRecorder
                      onRecordingComplete={handleVoiceRecorded}
                      prompt="Tell us your name, age, what you're studying, and what kind of guidance you need"
                    />
                  </div>
                  
                  {/* Text Input Option */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white text-center">✍️ Written Introduction</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="text-intro" className="text-white">Write your introduction</Label>
                        <textarea
                          id="text-intro"
                          data-testid="textarea-introduction"
                          value={formData.transcription}
                          onChange={(e) => setFormData(prev => ({ ...prev, transcription: e.target.value }))}
                          placeholder="Tell us your name, age, what you're studying, and what kind of guidance you need..."
                          className="w-full h-32 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 resize-none"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="quick-name" className="text-white">Name</Label>
                          <Input
                            id="quick-name"
                            data-testid="input-quick-name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your name"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quick-age" className="text-white">Age</Label>
                          <Input
                            id="quick-age"
                            data-testid="input-quick-age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                            placeholder="Age"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {formData.transcription && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Your Introduction:</h3>
                    <p className="text-gray-200" data-testid="text-transcription">{formData.transcription}</p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6 text-center text-white">
                  Step 2: Personal Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      data-testid="input-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age" className="text-white">Age</Label>
                    <Input
                      id="age"
                      data-testid="input-age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Your age"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="study-field" className="text-white">Field of Study</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, studyField: value }))}>
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
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6 text-center text-white">
                  Step 3: Language Preferences
                </h2>
                
                <div>
                  <Label className="text-white mb-4 block">Select languages you're comfortable with:</Label>
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
                </div>
              </div>
            )}

            <Button
              data-testid="button-continue"
              onClick={handleNext}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl mt-6"
              disabled={step === 1 && !formData.voiceIntroUrl && !formData.transcription}
            >
              {step === 3 ? 'Create Profile' : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
