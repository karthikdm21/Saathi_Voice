import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Home from "@/pages/home";
import StudentOnboarding from "@/pages/student-onboarding";
import MentorOnboarding from "@/pages/mentor-onboarding";
import Dashboard from "@/pages/dashboard";
import VoiceChat from "@/pages/voice-chat";
import MentorMatching from "@/pages/mentor-matching";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/student-onboarding" component={StudentOnboarding} />
      <Route path="/mentor-onboarding" component={MentorOnboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/voice-chat/:mentorshipId" component={VoiceChat} />
      <Route path="/mentor-matching" component={MentorMatching} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Simple session management
  useEffect(() => {
    const userData = localStorage.getItem('saathi_user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-black text-white">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
