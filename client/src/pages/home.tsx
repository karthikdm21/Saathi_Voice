import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleRoleSelection = (role: 'student' | 'mentor') => {
    if (role === 'student') {
      setLocation('/student-onboarding');
    } else {
      setLocation('/mentor-onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">🎙️ Saathi Voice</h1>
          <p className="text-xl text-gray-300">Voice-First Mentorship Platform</p>
          <p className="text-lg text-gray-400 mt-2">Connecting Rural Youth with Mentors</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6 text-white">Who are you?</h2>
          
          <Button
            data-testid="button-select-student"
            onClick={() => handleRoleSelection('student')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg h-auto"
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-3xl">👨‍🎓</span>
              <span className="text-xl">Student</span>
            </div>
            <p className="text-sm mt-2 opacity-90">Looking for guidance and mentorship</p>
          </Button>

          <Button
            data-testid="button-select-mentor"
            onClick={() => handleRoleSelection('mentor')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg h-auto"
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-3xl">👨‍🏫</span>
              <span className="text-xl">Mentor</span>
            </div>
            <p className="text-sm mt-2 opacity-90">Ready to guide and support others</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
