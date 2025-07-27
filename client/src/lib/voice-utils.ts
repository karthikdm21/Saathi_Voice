import { apiRequest } from "./queryClient";

export interface UploadResult {
  audioUrl: string;
  filename: string;
  size: number;
}

export interface TranscriptionResult {
  transcription: string;
}

export async function uploadAudio(audioBlob: Blob): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-recording.webm');

  const response = await fetch('/api/voice-messages/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload audio');
  }

  return await response.json();
}

export async function transcribeAudio(audioUrl: string): Promise<TranscriptionResult> {
  const response = await apiRequest('POST', '/api/voice-messages/transcribe', {
    audioUrl
  });

  return await response.json();
}

// Web Audio API utilities for voice processing
export class VoiceProcessor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async createAnalyser(stream: MediaStream): Promise<AnalyserNode> {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    
    source.connect(this.analyser);
    
    return this.analyser;
  }

  getVolumeLevel(): number {
    if (!this.analyser) return 0;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    
    return sum / bufferLength;
  }

  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

// Voice activity detection utilities
export function detectVoiceActivity(audioData: Float32Array, threshold: number = 0.01): boolean {
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += Math.abs(audioData[i]);
  }
  const average = sum / audioData.length;
  return average > threshold;
}

// Audio format conversion utilities
export function convertWebMToWav(webmBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(webmBlob);
    
    audio.onloadeddata = () => {
      // This is a simplified conversion - in a real app you'd use a proper audio library
      // For now, we'll just return the original blob
      resolve(webmBlob);
      URL.revokeObjectURL(url);
    };
    
    audio.onerror = () => {
      reject(new Error('Failed to load audio'));
      URL.revokeObjectURL(url);
    };
    
    audio.src = url;
  });
}
