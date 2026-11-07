export type ReviewStatus = 'new' | 'learning' | 'needs-review' | 'mastered';

export interface FlashcardDeck {
  id: string;
  title: string;
  topic: string;
  description: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  keywords: string[];
  difficulty: 'intro' | 'medium' | 'advanced';
  reviewStatus: ReviewStatus;
  createdAt: string;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}

export interface ReviewRecord {
  id: string;
  cardId: string;
  status: ReviewStatus;
  reviewedAt: string;
  confidence: number;
  notes?: string;
}

export interface ReviewSchedule {
  cardId: string;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string;
  reviewCount: number;
  lastReviewedAt?: string;
}
