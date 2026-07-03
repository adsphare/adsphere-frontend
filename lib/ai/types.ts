export interface CaseFile {
  dispute: any;
  escrow: any;

  buyer: any;
  seller: any;

  listing: any;

  conversation: any;

  messages: any[];

  evidence: any[];

  payments: any[];

  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
}

export interface AIRecommendation {
  summary: string;

  recommendation:
    | "release"
    | "refund"
    | "request_more_evidence";

  confidence: number;

  reasons: string[];

  missingEvidence: string[];

  fraudScore: number;
}




