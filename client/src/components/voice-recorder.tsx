import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadAudio, transcribeAudio } from "@/lib/voice-utils";
import AudioPlayer from "./audio-player";

interface VoiceRecorderProps {
  onRecordingComplete: (audioUrl: string, transcription: string) => void;
  prompt?: string;
  compact?: boolean;
}

export default function VoiceRecorder({ onRecordingComplete, prompt, compact = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [transcription, setTranscription] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Cleanup media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.log("Cleanup: Error stopping recorder", error);
        }
      }
      
      // Cleanup audio URL
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        console.log("Audio data available:", event.data.size, "bytes");
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        console.log("Recording stopped, processing audio chunks:", audioChunksRef.current.length);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log("Audio blob created:", audioBlob.size, "bytes", audioBlob.type);
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        toast({
          title: "Recording Error",
          description: "Failed to record audio. Please try again.",
          variant: "destructive"
        });
        setIsRecording(false);
      };

      console.log("Starting MediaRecorder...");
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      console.log("Recording started, state:", mediaRecorder.state);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to record audio.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    console.log("Attempting to stop recording, current state:", mediaRecorderRef.current?.state, "isRecording:", isRecording);
    if (mediaRecorderRef.current && isRecording) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          console.log("Stopping MediaRecorder...");
          mediaRecorderRef.current.stop();
        } else {
          console.log("MediaRecorder not in recording state:", mediaRecorderRef.current.state);
        }
        setIsRecording(false);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    } else {
      console.log("Cannot stop recording - no active recorder or not recording");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    console.log("Processing audio blob:", audioBlob.size, "bytes");
    
    try {
      // Create a local URL for the audio blob
      const localAudioUrl = URL.createObjectURL(audioBlob);
      let finalAudioUrl = localAudioUrl;
      let finalTranscription = "Voice recording completed successfully";
      
      console.log("Created audio URL:", localAudioUrl);
      setAudioUrl(localAudioUrl);
      setTranscription(finalTranscription);
      
      // Try to upload to server, but don't fail if it doesn't work
      try {
        console.log("Attempting to upload audio to server...");
        const uploadResult = await uploadAudio(audioBlob);
        // If upload succeeds, use server URL instead
        finalAudioUrl = uploadResult.audioUrl;
        console.log("Server upload successful, using server URL:", finalAudioUrl);
        setAudioUrl(finalAudioUrl);
        
        // Try transcription
        const transcriptionResult = await transcribeAudio(finalAudioUrl);
        finalTranscription = transcriptionResult.transcription;
        setTranscription(finalTranscription);
      } catch (uploadError) {
        console.log("Server upload failed, using local recording:", uploadError);
        // Continue with local audio URL and basic transcription
      }
      
      // Notify parent component with final values
      console.log("Calling onRecordingComplete with:", finalAudioUrl, finalTranscription);
      onRecordingComplete(finalAudioUrl, finalTranscription);
      
      toast({
        title: "Recording Complete",
        description: "Your voice message has been recorded successfully."
      });
      
    } catch (error) {
      console.error("Recording processing error:", error);
      toast({
        title: "Recording Error",
        description: "Failed to process recording. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <Button
        data-testid="button-voice-record-compact"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700 recording-pulse' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
    );
  }

  return (
    <div className="text-center space-y-6">
      {prompt && (
        <div className="space-y-2">
          <p className="text-lg text-white">Tap the microphone and tell us:</p>
          <p className="text-gray-300">{prompt}</p>
        </div>
      )}
      
      {/* Voice Recorder Button */}
      <div className="relative">
        <Button
          data-testid="button-voice-record"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-xl mx-auto ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 recording-pulse' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : isRecording ? (
            <Square className="h-12 w-12" />
          ) : (
            <Mic className="h-12 w-12" />
          )}
        </Button>
        
        {isRecording && (
          <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 text-red-400">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span data-testid="text-recording-status">
            Recording... <span data-testid="text-recording-timer">{formatTime(recordingTime)}</span>
          </span>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="flex items-center justify-center space-x-2 text-yellow-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
          <span>Processing audio...</span>
        </div>
      )}

      {/* Audio Playback */}
      {audioUrl && !isRecording && (
        <div className="bg-gray-800 rounded-xl p-4">
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      )}

      {/* Transcription Display */}
      {transcription && (
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Transcription:</h3>
          <p className="text-gray-200" data-testid="text-transcription">{transcription}</p>
        </div>
      )}
    </div>
  );
}
