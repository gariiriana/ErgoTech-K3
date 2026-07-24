export interface RespondentDemographics {
  name: string;
  empId: string;
  ageGroup: '<30' | '>=30';
  workDurationGroup: '<3' | '>=3';
  consented: boolean;
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

export interface AttitudeAnswer {
  statementId: number;
  score: number; // 1 to 4 (Likert)
}

export interface RespondentData {
  id?: string;
  demographics: RespondentDemographics;
  preTest?: {
    knowledgeAnswers: QuizAnswer[];
    knowledgeScore: number; // 0 - 20
    attitudeAnswers: AttitudeAnswer[];
    attitudeScore: number; // 10 - 40
    completedAt: string;
  };
  postTest?: {
    knowledgeAnswers: QuizAnswer[];
    knowledgeScore: number; // 0 - 20
    attitudeAnswers: AttitudeAnswer[];
    attitudeScore: number; // 10 - 40
    completedAt: string;
  };
  completedModules: string[];
  currentStep: 'demographics' | 'pretest' | 'modules' | 'posttest' | 'certificate';
  createdAt: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AttitudeStatement {
  id: number;
  text: string;
}
