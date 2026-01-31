export interface InterviewTranscript {
  timestamp: string;
  speaker: string; // "Interviewer" or "Candidate"
  text: string;
}

export interface AIRating {
  category: string;
  rating: 'Strong' | 'Good' | 'Average' | 'Poor';
  description: string;
  iconType: 'clarity' | 'professionalism' | 'empathy' | 'confidence' | 'handling' | 'refusal' | 'emergency';
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  role: string;
  date: string;
  thumbnail: string;
  durationLabel: string; // e.g., "10 sec" or "1 min"
  avatar: string;
  summary: string;
  transcript: InterviewTranscript[];
  aiReport: {
    behavioralProfile: AIRating[];
    scenarioPerformance: AIRating[];
    personalityFit: string;
    scores: {
      communication: number;
      problemSolving: number;
      empathy: number;
      professionalism: number;
      matchScore: number;
    };
  };
}