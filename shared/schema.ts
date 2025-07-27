import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(), // 'student' or 'mentor'
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  languages: json("languages").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  age: integer("age"),
  studyField: text("study_field"),
  goals: text("goals"),
  voiceIntroUrl: text("voice_intro_url"),
  transcription: text("transcription"),
  preferredLanguages: json("preferred_languages").$type<string[]>().default([]),
});

export const mentors = pgTable("mentors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  experience: integer("experience"),
  fieldOfExpertise: text("field_of_expertise"),
  voiceIntroUrl: text("voice_intro_url"),
  bio: text("bio"),
  availability: text("availability"),
  rating: integer("rating").default(0),
  totalReviews: integer("total_reviews").default(0),
});

export const mentorships = pgTable("mentorships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  mentorId: varchar("mentor_id").references(() => mentors.id).notNull(),
  status: text("status").default("active"), // 'active', 'completed', 'paused'
  createdAt: timestamp("created_at").defaultNow(),
});

export const voiceMessages = pgTable("voice_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorshipId: varchar("mentorship_id").references(() => mentorships.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  audioUrl: text("audio_url").notNull(),
  transcription: text("transcription"),
  duration: integer("duration"), // in seconds
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
});

export const insertMentorshipSchema = createInsertSchema(mentorships).omit({
  id: true,
  createdAt: true,
});

export const insertVoiceMessageSchema = createInsertSchema(voiceMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Mentor = typeof mentors.$inferSelect;
export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentorship = typeof mentorships.$inferSelect;
export type InsertMentorship = z.infer<typeof insertMentorshipSchema>;
export type VoiceMessage = typeof voiceMessages.$inferSelect;
export type InsertVoiceMessage = z.infer<typeof insertVoiceMessageSchema>;

// Extended types for API responses
export type StudentWithUser = Student & { user: User };
export type MentorWithUser = Mentor & { user: User };
export type MentorshipWithDetails = Mentorship & {
  student: StudentWithUser;
  mentor: MentorWithUser;
};
export type VoiceMessageWithSender = VoiceMessage & { sender: User };
