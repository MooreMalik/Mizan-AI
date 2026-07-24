import fs from 'fs';
import path from 'path';
import { User, ChatSession, AnalysisReport, LawReference } from '../types';

const DB_FOLDER = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_FOLDER)) {
  fs.mkdirSync(DB_FOLDER, { recursive: true });
}

const USERS_FILE = path.join(DB_FOLDER, 'users.json');
const SESSIONS_FILE = path.join(DB_FOLDER, 'sessions.json');
const REPORTS_FILE = path.join(DB_FOLDER, 'reports.json');

// Initialize empty stores if not present
function initFile(filepath: string, defaultValue: any) {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultValue, null, 2), 'utf-8');
  }
}

initFile(USERS_FILE, []);
initFile(SESSIONS_FILE, []);
initFile(REPORTS_FILE, []);

export class Storage {
  static getUsers(): User[] {
    try {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static saveUsers(users: User[]) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  }

  static getSessions(): ChatSession[] {
    try {
      const content = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static saveSessions(sessions: ChatSession[]) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  }

  static getReports(): AnalysisReport[] {
    try {
      const content = fs.readFileSync(REPORTS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static saveReports(reports: AnalysisReport[]) {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf-8');
  }
}
