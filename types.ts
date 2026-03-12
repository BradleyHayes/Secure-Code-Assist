
export enum RiskType {
  CREDENTIAL = 'CREDENTIAL',
  API_SECRET = 'API_SECRET',
  COMPANY_NAME = 'COMPANY_NAME',
  PRIVATE_URL = 'PRIVATE_URL',
  PII = 'PII'
}

export interface TokenMapping {
  originalValue: string;
  token: string;
  type: RiskType;
  firstSeen: number;
}

export interface AIRecommendation {
  originalText: string;
  reason: string;
  type: RiskType;
}

export interface AIAdvisorResponse {
  report: string;
  recommendations: AIRecommendation[];
}

export interface Finding {
  id: string;
  type: RiskType;
  originalText: string;
  suggestedReplacement: string;
  lineNumber: number;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  originalContent: string;
  cleanedContent?: string;
  updatedContent?: string;
  status: 'pending' | 'analyzing' | 'cleaned' | 'restored' | 'error';
  findings: Finding[];
  lastActionAt?: number;
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  isOpen?: boolean;
}

export interface MLReport {
  summary: {
    totalFindings: number;
    riskScore: number;
    breakdown: Record<RiskType, number>;
  };
  findings: Finding[];
}
