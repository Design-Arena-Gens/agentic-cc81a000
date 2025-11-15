export type LessonPackage = {
  lessonPlan: {
    title: string;
    gradeLevel: string;
    subject: string;
    topic: string;
    duration: string;
    overview: string[];
    learningObjectives: string[];
    standards: string[];
    segments: Array<{
      label: string;
      purpose: string;
      steps: string[];
      timing: string;
    }>;
    differentiation: Array<{
      audience: string;
      adaptations: string[];
    }>;
    materials: string[];
    homework: string;
    assessment: string;
  };
  quiz: {
    title: string;
    format: string;
    questions: Array<{
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }>;
  };
  studentNotes: {
    summary: string;
    vocabulary: Array<{ term: string; definition: string }>;
    studyTips: string[];
    realWorldConnections: string[];
  };
  feedbackReport: {
    teacherSummary: string;
    strengths: string[];
    nextSteps: string[];
    parentNote: string;
  };
  teachingAids?: Array<{
    title: string;
    prompt: string;
    usage: string;
  }>;
  metadata: {
    generatedAt: string;
    model: string;
    tone: string;
  };
};

