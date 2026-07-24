import { User, ChatSession, AnalysisReport } from '../types';

const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('mizan_token');
  const lang = localStorage.getItem('mizan_lang') || 'uz';
  return {
    'Content-Type': 'application/json',
    'X-App-Language': lang,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  } as HeadersInit;
}

export const api = {
  async register(payload: any): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi!');
    }
    return res.json();
  },

  async login(payload: any): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login yoki parol xato!');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Sessiya topilmadi');
    }
    return res.json();
  },

  async updateTariff(tariff: 'PLUS' | 'PRO' | 'MAX'): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/tariff`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ tariff }),
    });
    if (!res.ok) {
      throw new Error('Tarifni o\'zgartirishda xatolik yuz berdi');
    }
    return res.json();
  },
  async getSessions(userId: string): Promise<ChatSession[]> {
    const res = await fetch(`${API_BASE}/chat/sessions?userId=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Seanslarni yuklashda xatolik');
    return res.json();
  },

  async createSession(userId: string, title?: string): Promise<ChatSession> {
    const res = await fetch(`${API_BASE}/chat/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, title }),
    });
    if (!res.ok) throw new Error('Yangi seans yaratib bo\'lmadi');
    return res.json();
  },

  async getSession(id: string): Promise<ChatSession> {
    const res = await fetch(`${API_BASE}/chat/sessions/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Seans ma\'lumotlarini yuklab bo\'lmadi');
    return res.json();
  },

  async sendMessage(sessionId: string, content: string, attachments: string[] = []): Promise<ChatSession> {
    const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}/message`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, attachments }),
    });
    if (!res.ok) throw new Error('Xabarni yuborib bo\'lmadi');
    return res.json();
  },

  async uploadFile(sessionId: string, filename: string, fileType: string, size: number, base64: string): Promise<any> {
    const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}/upload`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filename, fileType, size, base64 }),
    });
    if (!res.ok) throw new Error('Fayl yuklashda xatolik yuz berdi');
    return res.json();
  },

  async generateReport(sessionId: string): Promise<AnalysisReport> {
    const res = await fetch(`${API_BASE}/report/sessions/${sessionId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Hisobotni shakllantirishda xatolik yuz berdi');
    return res.json();
  },

  async getReport(id: string): Promise<AnalysisReport> {
    const res = await fetch(`${API_BASE}/report/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Hisobotni yuklab bo\'lmadi');
    return res.json();
  },

  async getAllReports(): Promise<AnalysisReport[]> {
    const res = await fetch(`${API_BASE}/mediator/reports`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Barcha hisobotlarni yuklashda xatolik yuz berdi');
    return res.json();
  },

  async updateMediatorReview(reportId: string, mediator_xulosasi: string): Promise<AnalysisReport> {
    const res = await fetch(`${API_BASE}/mediator/reports/${reportId}/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mediator_xulosasi }),
    });
    if (!res.ok) throw new Error('Mediator xulosasini saqlashda xatolik yuz berdi');
    return res.json();
  },

  async getKbDocuments(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/kb/documents`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Hujjatlar kutubxonasini yuklab bo\'lmadi');
    return res.json();
  },

  async uploadKbDocument(filename: string, fileType: string, base64: string): Promise<any> {
    const res = await fetch(`${API_BASE}/kb/upload`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filename, fileType, base64 }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Hujjatni kutubxonaga yuklab bo\'lmadi');
    }
    return res.json();
  },

  async deleteKbDocument(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/kb/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Hujjatni kutubxonadan o\'chirib bo\'lmadi');
    return res.json();
  }
};

