import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertUserSchema, insertStudentSchema, insertMentorSchema, insertMentorshipSchema, insertVoiceMessageSchema } from "@shared/schema";

// Set up multer for file uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `voice-${uniqueSuffix}.webm`);
  }
});

const upload = multer({ 
  storage: audioStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Student routes
  app.post("/api/students", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: "Invalid student data" });
    }
  });

  app.get("/api/students/user/:userId", async (req, res) => {
    try {
      const student = await storage.getStudentByUserId(req.params.userId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const updates = req.body;
      const student = await storage.updateStudent(req.params.id, updates);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  // Mentor routes
  app.post("/api/mentors", async (req, res) => {
    try {
      const mentorData = insertMentorSchema.parse(req.body);
      const mentor = await storage.createMentor(mentorData);
      res.json(mentor);
    } catch (error) {
      res.status(400).json({ error: "Invalid mentor data" });
    }
  });

  app.get("/api/mentors/user/:userId", async (req, res) => {
    try {
      const mentor = await storage.getMentorByUserId(req.params.userId);
      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentor" });
    }
  });

  app.get("/api/mentors/search", async (req, res) => {
    try {
      const { fieldOfExpertise, languages, experience } = req.query;
      const filters: any = {};
      
      if (fieldOfExpertise) filters.fieldOfExpertise = fieldOfExpertise as string;
      if (experience) filters.experience = parseInt(experience as string);
      if (languages) {
        filters.languages = Array.isArray(languages) ? languages as string[] : [languages as string];
      }
      
      const mentors = await storage.searchMentors(filters);
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: "Failed to search mentors" });
    }
  });

  // Mentorship routes
  app.post("/api/mentorships", async (req, res) => {
    try {
      const mentorshipData = insertMentorshipSchema.parse(req.body);
      const mentorship = await storage.createMentorship(mentorshipData);
      res.json(mentorship);
    } catch (error) {
      res.status(400).json({ error: "Invalid mentorship data" });
    }
  });

  app.get("/api/mentorships/student/:studentId", async (req, res) => {
    try {
      const mentorships = await storage.getMentorshipsByStudent(req.params.studentId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentorships" });
    }
  });

  app.get("/api/mentorships/mentor/:mentorId", async (req, res) => {
    try {
      const mentorships = await storage.getMentorshipsByMentor(req.params.mentorId);
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentorships" });
    }
  });

  // Voice message routes
  app.post("/api/voice-messages/upload", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const audioUrl = `/uploads/audio/${req.file.filename}`;
      
      // Here you would typically send to Whisper API for transcription
      // For now, we'll return the audio URL
      res.json({ 
        audioUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload audio" });
    }
  });

  app.post("/api/voice-messages/transcribe", async (req, res) => {
    try {
      const { audioUrl } = req.body;
      
      // Here you would integrate with Hugging Face Whisper API
      // For now, we'll return a mock transcription
      const transcription = "This is a transcribed message from the audio file.";
      
      res.json({ transcription });
    } catch (error) {
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  app.post("/api/voice-messages", async (req, res) => {
    try {
      const messageData = insertVoiceMessageSchema.parse(req.body);
      const message = await storage.createVoiceMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid voice message data" });
    }
  });

  app.get("/api/voice-messages/mentorship/:mentorshipId", async (req, res) => {
    try {
      const messages = await storage.getVoiceMessagesByMentorship(req.params.mentorshipId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch voice messages" });
    }
  });

  // Serve uploaded audio files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
