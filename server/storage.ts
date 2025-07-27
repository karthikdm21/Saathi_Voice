import { 
  type User, 
  type InsertUser, 
  type Student, 
  type InsertStudent, 
  type Mentor, 
  type InsertMentor, 
  type Mentorship, 
  type InsertMentorship, 
  type VoiceMessage, 
  type InsertVoiceMessage,
  type StudentWithUser,
  type MentorWithUser,
  type MentorshipWithDetails,
  type VoiceMessageWithSender 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student operations
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByUserId(userId: string): Promise<Student | undefined>;
  getStudentWithUser(id: string): Promise<StudentWithUser | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined>;
  
  // Mentor operations
  getMentor(id: string): Promise<Mentor | undefined>;
  getMentorByUserId(userId: string): Promise<Mentor | undefined>;
  getMentorWithUser(id: string): Promise<MentorWithUser | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  updateMentor(id: string, updates: Partial<Mentor>): Promise<Mentor | undefined>;
  searchMentors(filters: { fieldOfExpertise?: string; languages?: string[]; experience?: number }): Promise<MentorWithUser[]>;
  
  // Mentorship operations
  getMentorship(id: string): Promise<Mentorship | undefined>;
  getMentorshipWithDetails(id: string): Promise<MentorshipWithDetails | undefined>;
  createMentorship(mentorship: InsertMentorship): Promise<Mentorship>;
  getMentorshipsByStudent(studentId: string): Promise<MentorshipWithDetails[]>;
  getMentorshipsByMentor(mentorId: string): Promise<MentorshipWithDetails[]>;
  
  // Voice message operations
  getVoiceMessage(id: string): Promise<VoiceMessage | undefined>;
  createVoiceMessage(message: InsertVoiceMessage): Promise<VoiceMessage>;
  getVoiceMessagesByMentorship(mentorshipId: string): Promise<VoiceMessageWithSender[]>;
  updateVoiceMessage(id: string, updates: Partial<VoiceMessage>): Promise<VoiceMessage | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private students: Map<string, Student>;
  private mentors: Map<string, Mentor>;
  private mentorships: Map<string, Mentorship>;
  private voiceMessages: Map<string, VoiceMessage>;

  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.mentors = new Map();
    this.mentorships = new Map();
    this.voiceMessages = new Map();
    
    // Add sample mentors for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample mentor users
    const sampleMentorUsers = [
      {
        id: "mentor-1",
        role: "mentor",
        name: "Priya Sharma",
        email: "priya@example.com",
        location: "Mumbai, Maharashtra",
        languages: ["English", "Hindi", "Marathi"],
        createdAt: new Date()
      },
      {
        id: "mentor-2", 
        role: "mentor",
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        location: "Bangalore, Karnataka",
        languages: ["English", "Hindi", "Tamil"],
        createdAt: new Date()
      },
      {
        id: "mentor-3",
        role: "mentor", 
        name: "Anita Patel",
        email: "anita@example.com",
        location: "Delhi, India",
        languages: ["English", "Hindi", "Bengali"],
        createdAt: new Date()
      }
    ];

    // Sample mentor profiles
    const sampleMentors = [
      {
        id: "mentor-profile-1",
        userId: "mentor-1",
        experience: 5,
        fieldOfExpertise: "technology",
        bio: "Software engineer with 5 years experience in web development. I help students learn programming and prepare for tech careers.",
        voiceIntroUrl: "/sample-voice.mp3",
        availability: "weekends",
        rating: 45,
        totalReviews: 12
      },
      {
        id: "mentor-profile-2",
        userId: "mentor-2", 
        experience: 8,
        fieldOfExpertise: "business",
        bio: "Business consultant helping rural entrepreneurs start and grow their businesses. Expert in digital marketing.",
        voiceIntroUrl: "/sample-voice2.mp3",
        availability: "evenings",
        rating: 48,
        totalReviews: 20
      },
      {
        id: "mentor-profile-3",
        userId: "mentor-3",
        experience: 3,
        fieldOfExpertise: "education", 
        bio: "Teacher and educational counselor. I help students with career guidance and academic planning.",
        voiceIntroUrl: "/sample-voice3.mp3",
        availability: "flexible",
        rating: 42,
        totalReviews: 8
      }
    ];

    // Add to storage
    sampleMentorUsers.forEach(user => this.users.set(user.id, user as User));
    sampleMentors.forEach(mentor => this.mentors.set(mentor.id, mentor as Mentor));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Student operations
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByUserId(userId: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(student => student.userId === userId);
  }

  async getStudentWithUser(id: string): Promise<StudentWithUser | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const user = this.users.get(student.userId);
    if (!user) return undefined;
    
    return { ...student, user };
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent = { ...student, ...updates };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  // Mentor operations
  async getMentor(id: string): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }

  async getMentorByUserId(userId: string): Promise<Mentor | undefined> {
    return Array.from(this.mentors.values()).find(mentor => mentor.userId === userId);
  }

  async getMentorWithUser(id: string): Promise<MentorWithUser | undefined> {
    const mentor = this.mentors.get(id);
    if (!mentor) return undefined;
    
    const user = this.users.get(mentor.userId);
    if (!user) return undefined;
    
    return { ...mentor, user };
  }

  async createMentor(insertMentor: InsertMentor): Promise<Mentor> {
    const id = randomUUID();
    const mentor: Mentor = { ...insertMentor, id };
    this.mentors.set(id, mentor);
    return mentor;
  }

  async updateMentor(id: string, updates: Partial<Mentor>): Promise<Mentor | undefined> {
    const mentor = this.mentors.get(id);
    if (!mentor) return undefined;
    
    const updatedMentor = { ...mentor, ...updates };
    this.mentors.set(id, updatedMentor);
    return updatedMentor;
  }

  async searchMentors(filters: { fieldOfExpertise?: string; languages?: string[]; experience?: number }): Promise<MentorWithUser[]> {
    const mentorsWithUsers: MentorWithUser[] = [];
    
    for (const mentor of this.mentors.values()) {
      const user = this.users.get(mentor.userId);
      if (!user) continue;
      
      // Apply filters - skip filter if "all" or "any" is selected
      if (filters.fieldOfExpertise && filters.fieldOfExpertise !== "all" && mentor.fieldOfExpertise !== filters.fieldOfExpertise) continue;
      if (filters.experience && filters.experience !== "any" && (mentor.experience || 0) < filters.experience) continue;
      if (filters.languages && filters.languages.length > 0 && !filters.languages.includes("any")) {
        const hasCommonLanguage = filters.languages.some(lang => 
          user.languages?.includes(lang)
        );
        if (!hasCommonLanguage) continue;
      }
      
      mentorsWithUsers.push({ ...mentor, user });
    }
    
    return mentorsWithUsers;
  }

  // Mentorship operations
  async getMentorship(id: string): Promise<Mentorship | undefined> {
    return this.mentorships.get(id);
  }

  async getMentorshipWithDetails(id: string): Promise<MentorshipWithDetails | undefined> {
    const mentorship = this.mentorships.get(id);
    if (!mentorship) return undefined;
    
    const student = await this.getStudentWithUser(mentorship.studentId);
    const mentor = await this.getMentorWithUser(mentorship.mentorId);
    
    if (!student || !mentor) return undefined;
    
    return { ...mentorship, student, mentor };
  }

  async createMentorship(insertMentorship: InsertMentorship): Promise<Mentorship> {
    const id = randomUUID();
    const mentorship: Mentorship = { 
      ...insertMentorship, 
      id,
      createdAt: new Date()
    };
    this.mentorships.set(id, mentorship);
    return mentorship;
  }

  async getMentorshipsByStudent(studentId: string): Promise<MentorshipWithDetails[]> {
    const mentorships: MentorshipWithDetails[] = [];
    
    for (const mentorship of this.mentorships.values()) {
      if (mentorship.studentId === studentId) {
        const details = await this.getMentorshipWithDetails(mentorship.id);
        if (details) mentorships.push(details);
      }
    }
    
    return mentorships;
  }

  async getMentorshipsByMentor(mentorId: string): Promise<MentorshipWithDetails[]> {
    const mentorships: MentorshipWithDetails[] = [];
    
    for (const mentorship of this.mentorships.values()) {
      if (mentorship.mentorId === mentorId) {
        const details = await this.getMentorshipWithDetails(mentorship.id);
        if (details) mentorships.push(details);
      }
    }
    
    return mentorships;
  }

  // Voice message operations
  async getVoiceMessage(id: string): Promise<VoiceMessage | undefined> {
    return this.voiceMessages.get(id);
  }

  async createVoiceMessage(insertMessage: InsertVoiceMessage): Promise<VoiceMessage> {
    const id = randomUUID();
    const message: VoiceMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.voiceMessages.set(id, message);
    return message;
  }

  async getVoiceMessagesByMentorship(mentorshipId: string): Promise<VoiceMessageWithSender[]> {
    const messages: VoiceMessageWithSender[] = [];
    
    for (const message of this.voiceMessages.values()) {
      if (message.mentorshipId === mentorshipId) {
        const sender = this.users.get(message.senderId);
        if (sender) {
          messages.push({ ...message, sender });
        }
      }
    }
    
    return messages.sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async updateVoiceMessage(id: string, updates: Partial<VoiceMessage>): Promise<VoiceMessage | undefined> {
    const message = this.voiceMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...updates };
    this.voiceMessages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();
