export interface User {
  id: string;
  email: string;
  fullName: string;
  tariff: 'FREE' | 'PLUS' | 'PRO' | 'MAX';
  role?: 'client' | 'mediator';
  createdAt: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  isReportLink?: boolean;
  reportId?: string;
  attachments?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  messages: ChatMessage[];
  status: 'active' | 'analyzing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  path: string;
  uploadedAt: string;
}

export interface LawReference {
  id: string;
  code: string; // e.g. "FK 228-modda"
  title: string; // e.g. "Mulkni boshqa shaxsning qonunsiz egaligidan talab qilib olish"
  content: string; // The text of the law
  category: 'Property' | 'Contract' | 'Family' | 'Procedure' | 'Tax' | 'Mediation' | 'Other';
}

export interface ApproxRange {
  min: string;
  max: string;
  currency: string; // e.g. "so'm"
}

export interface AlternativeSolution {
  tavsiya: string;
  sabab: string;
  qadamlar: string[];
  taxminiy_tejash: string;
}

export interface AnalysisReport {
  id: string;
  userId: string;
  caseId: string;
  sud_mavzusi: string;
  holat_tavsifi: string;
  qonuniy_asoslar: string[]; // matched articles
  sud_jarayoni: string;
  taxminiy_muddat: ApproxRange;
  taxminiy_xarajat: ApproxRange;
  yutish_ehtimoli: number; // 0-100
  yutish_sabablari: string[];
  utkazish_sabablari: string[];
  alternativ_yechim: AlternativeSolution;
  mediator_xulosasi?: string;
  createdAt: string;
}

export interface LibraryDocument {
  id: string;
  name: string;
  fileSize: number;
  mimeType: string;
  chunkCount: number;
  uploadedAt: string;
}

export interface VectorChunk {
  id: string;
  docId: string;
  docName: string;
  text: string;
  embedding: number[];
}

