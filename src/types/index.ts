export interface QuizQuestion {
  id: number;
  question?: string;
  text?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
export type Question = QuizQuestion;

export interface AttitudeQuestion {
  id: number;
  statement?: string;
  text?: string;
}
export type AttitudeStatement = AttitudeQuestion;

export interface RespondentDemographics {
  name: string;
  empId: string;
  gender: 'Laki-laki' | 'Perempuan';
  age: number; // exact age input e.g. 25
  ageGroup: '<30' | '>=30';
  workDuration: number; // exact work duration in years e.g. 2
  workDurationGroup: '<3' | '>=3';
  consented: boolean;
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface AttitudeAnswer {
  questionId: number;
  selectedScore: number; // 1 to 4 (Likert scale)
}

export interface TestResult {
  knowledgeAnswers: QuizAnswer[];
  knowledgeScore: number; // 0 to 20
  attitudeAnswers: AttitudeAnswer[];
  attitudeScore: number; // 10 to 40
  completedAt: string;
}

export interface RespondentData {
  id?: string;
  demographics: RespondentDemographics;
  preTest?: TestResult;
  postTest?: TestResult;
  completedModules: string[];
  currentStep: 'demographics' | 'pretest' | 'modules' | 'posttest' | 'certificate' | 'admin';
  createdAt: string;
}
