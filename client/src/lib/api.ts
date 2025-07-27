import { apiRequest } from "./queryClient";
import type { 
  User, 
  InsertUser, 
  Student, 
  InsertStudent, 
  Mentor, 
  InsertMentor,
  Mentorship,
  InsertMentorship,
  VoiceMessage,
  InsertVoiceMessage 
} from "@shared/schema";

// User API functions
export const userApi = {
  async create(userData: InsertUser): Promise<User> {
    const response = await apiRequest("POST", "/api/users", userData);
    return response.json();
  },

  async get(id: string): Promise<User> {
    const response = await apiRequest("GET", `/api/users/${id}`);
    return response.json();
  }
};

// Student API functions
export const studentApi = {
  async create(studentData: InsertStudent): Promise<Student> {
    const response = await apiRequest("POST", "/api/students", studentData);
    return response.json();
  },

  async getByUserId(userId: string): Promise<Student> {
    const response = await apiRequest("GET", `/api/students/user/${userId}`);
    return response.json();
  },

  async update(id: string, updates: Partial<Student>): Promise<Student> {
    const response = await apiRequest("PUT", `/api/students/${id}`, updates);
    return response.json();
  }
};

// Mentor API functions
export const mentorApi = {
  async create(mentorData: InsertMentor): Promise<Mentor> {
    const response = await apiRequest("POST", "/api/mentors", mentorData);
    return response.json();
  },

  async getByUserId(userId: string): Promise<Mentor> {
    const response = await apiRequest("GET", `/api/mentors/user/${userId}`);
    return response.json();
  },

  async search(filters: {
    fieldOfExpertise?: string;
    languages?: string[];
    experience?: number;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    
    if (filters.fieldOfExpertise) {
      params.append('fieldOfExpertise', filters.fieldOfExpertise);
    }
    if (filters.experience) {
      params.append('experience', filters.experience.toString());
    }
    if (filters.languages) {
      filters.languages.forEach(lang => params.append('languages', lang));
    }

    const response = await apiRequest("GET", `/api/mentors/search?${params}`);
    return response.json();
  }
};

// Mentorship API functions
export const mentorshipApi = {
  async create(mentorshipData: InsertMentorship): Promise<Mentorship> {
    const response = await apiRequest("POST", "/api/mentorships", mentorshipData);
    return response.json();
  },

  async getByStudent(studentId: string): Promise<any[]> {
    const response = await apiRequest("GET", `/api/mentorships/student/${studentId}`);
    return response.json();
  },

  async getByMentor(mentorId: string): Promise<any[]> {
    const response = await apiRequest("GET", `/api/mentorships/mentor/${mentorId}`);
    return response.json();
  }
};

// Voice Message API functions
export const voiceMessageApi = {
  async create(messageData: InsertVoiceMessage): Promise<VoiceMessage> {
    const response = await apiRequest("POST", "/api/voice-messages", messageData);
    return response.json();
  },

  async getByMentorship(mentorshipId: string): Promise<any[]> {
    const response = await apiRequest("GET", `/api/voice-messages/mentorship/${mentorshipId}`);
    return response.json();
  },

  async upload(audioBlob: Blob): Promise<{ audioUrl: string; filename: string; size: number }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-message.webm');

    const response = await fetch('/api/voice-messages/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }

    return response.json();
  },

  async transcribe(audioUrl: string): Promise<{ transcription: string }> {
    const response = await apiRequest("POST", "/api/voice-messages/transcribe", { audioUrl });
    return response.json();
  }
};

// Utility function for session management
export const sessionUtils = {
  getCurrentUser(): any | null {
    const userData = localStorage.getItem('saathi_user');
    return userData ? JSON.parse(userData) : null;
  },

  setCurrentUser(user: any): void {
    localStorage.setItem('saathi_user', JSON.stringify(user));
  },

  clearCurrentUser(): void {
    localStorage.removeItem('saathi_user');
  }
};
