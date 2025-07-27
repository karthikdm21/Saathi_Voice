import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Star, Briefcase, MapPin, Languages } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AudioPlayer from "@/components/audio-player";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MentorMatching() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filters, setFilters] = useState({
    fieldOfExpertise: "all",
    languages: "any", 
    experience: "any"
  });

  useEffect(() => {
    const userData = localStorage.getItem('saathi_user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const { data: mentors = [], refetch, isLoading } = useQuery({
    queryKey: ['/api/mentors/search', filters],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      if (filters.fieldOfExpertise && filters.fieldOfExpertise !== "all") {
        queryParams.append('fieldOfExpertise', filters.fieldOfExpertise);
      }
      if (filters.languages && filters.languages !== "any") {
        queryParams.append('languages', filters.languages);
      }
      if (filters.experience && filters.experience !== "any") {
        queryParams.append('experience', filters.experience);
      }
      return fetch(`/api/mentors/search?${queryParams.toString()}`)
        .then(res => res.json())
        .then(data => {
          console.log('Mentors data received:', data);
          return data;
        })
        .catch(error => {
          console.error('Error fetching mentors:', error);
          return [];
        });
    },
    enabled: !!currentUser,
  });

  const handleConnect = async (mentorId: string) => {
    try {
      const mentorshipData = {
        studentId: currentUser.studentId,
        mentorId: mentorId,
        status: 'active'
      };
      
      await apiRequest("POST", "/api/mentorships", mentorshipData);
      
      toast({
        title: "Connected!",
        description: "You've successfully connected with this mentor."
      });
      
      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect with mentor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 10);
    const hasHalfStar = (rating % 10) >= 5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-gray-400" />);
      }
    }
    return stars;
  };

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
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Find Your Perfect Mentor</h1>
          <p className="text-gray-400 mt-2">Connect with experienced mentors in your field</p>
        </div>

        {/* Search Filters */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Field</label>
                <Select onValueChange={(value) => setFilters(prev => ({ ...prev, fieldOfExpertise: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
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
                <label className="block text-sm font-medium mb-2 text-white">Language</label>
                <Select onValueChange={(value) => setFilters(prev => ({ ...prev, languages: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Hindi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Language</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Telugu">Telugu</SelectItem>
                    <SelectItem value="Marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Experience</label>
                <Select onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Experience</SelectItem>
                    <SelectItem value="1">1-3 years</SelectItem>
                    <SelectItem value="3">3-5 years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400">Loading mentors...</p>
            </div>
          ) : mentors?.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400">No mentors found</p>
              <p className="text-sm text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            mentors?.map((mentor: any) => {
              const initials = mentor.user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'M';
              const rating = mentor.rating / 10; // Convert from 0-100 to 0-10
              
              return (
                <Card 
                  key={mentor.id} 
                  className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-white">{initials}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white" data-testid={`text-mentor-name-${mentor.id}`}>
                        {mentor.user.name}
                      </h3>
                      <p className="text-gray-400 text-sm capitalize">{mentor.fieldOfExpertise} Expert</p>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        {renderStars(mentor.rating)}
                        <span className="text-xs text-gray-400 ml-1">({rating.toFixed(1)})</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-white">{mentor.experience}+ years experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Languages className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-white">
                          {mentor.user.languages?.join(', ') || 'Multiple languages'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-white">{mentor.user.location}</span>
                      </div>
                    </div>

                    {/* Voice Preview - Temporarily disabled */}
                    <div className="bg-gray-800 rounded-xl p-3 mb-4">
                      <p className="text-sm text-gray-400">🎤 Voice introduction available</p>
                      <p className="text-xs text-gray-500 mt-1">Audio preview coming soon</p>
                    </div>

                    <Button
                      data-testid={`button-connect-${mentor.id}`}
                      onClick={() => handleConnect(mentor.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl"
                    >
                      Connect with Mentor
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
