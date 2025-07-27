# 🎙️ Saathi Voice – Voice-First Mentorship Platform for Rural Youth

**Saathi Voice** is a voice-first mentorship platform designed to empower rural youth in India. It eliminates barriers like digital illiteracy, language diversity, and poor internet access by using natural voice-based interactions to deliver mentorship. The platform functions on low-end phones, supports over 180 languages, and is built with an offline-first architecture to ensure accessibility in remote areas.

---

##  Project Vision

Saathi Voice aims to bridge the rural-urban digital divide by enabling culturally-aware, voice-based mentorship experiences. Students and mentors interact entirely through audio — from registration to sessions and feedback — making technology feel invisible and intuitive.

---

##  Core Idea

Rural learners often lack mentors, tech access, or typing ability. Saathi Voice solves this by:

* Using "voice as the primary interface" (no typing required)
* Supporting "real-time language translation" and "emotional understanding"
* Working "offline and on basic phones" using PWA and Twilio/USSD
* Providing "audio feedback", "progress tracking", and "peer motivation"

---

## 🛠️ Tech Stack (MVP)

### 🧩 Frontend

* HTML, CSS, JavaScript (PWA with black/white minimalist design)
* Voice-based navigation using buttons and basic inputs
* Service workers for offline capability

### 🧠 Backend

* Python (Flask or FastAPI)
* SQLite for offline-friendly database
* Hugging Face models (sentence-transformers for matching)

### 🔊 Voice AI

* Whisper (Hugging Face) – speech-to-text
* OpenVoice / ESPnet – voice output
* Twilio (simulated) – voice session mockups

---

## 📦 MVP Features (Phase 1)

| 🧩 Component                    | 🛠️ Feature                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| Entry Flow                  | Role selection: Student or Mentor                                 |
| Student Registration        | Voice or text input for name, goals, language, etc.               |
| Mentor Registration         | Voice or form-based input for expertise, experience, availability |
| Voice Input (Whisper)      | Voice-to-text registration support                                |
| Data Storage (SQLite)      | Save student & mentor profiles locally                            |
| AI Matching (Hugging Face)  | Match student goals to mentor topics using sentence embeddings    |
| Simulated Voice Interaction | Audio recording & playback for calls and feedback                 |
| PWA Frontend (HTML/CSS/JS)  | Minimalist black-and-white interface with offline-first support   |
| Accessibility               | Fully keyboard- and screen reader-accessible design               |
| Voice Demo                 | Microphone input test to check voice recognition                  |
| Reward Message (Optional)   | Simulated motivational voice clip                                 |

---




## 📜 License

This project is for educational/demo purposes and is open for reuse under MIT License.



 “Saathi Voice brings mentorship to every voice, no matter where it comes from.”

