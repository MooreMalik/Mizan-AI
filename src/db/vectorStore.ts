import fs from 'fs';
import path from 'path';
import * as pdfParser from 'pdf-parse';
const pdf = (pdfParser as any).default || pdfParser;
import { LibraryDocument, VectorChunk } from '../types';
import { GoogleGenAI } from '@google/genai';

const DB_FOLDER = path.join(process.cwd(), 'data');
const DOCUMENTS_FILE = path.join(DB_FOLDER, 'kb_documents.json');
const CHUNKS_FILE = path.join(DB_FOLDER, 'kb_chunks.json');
const DATASETS_FOLDER = path.join(DB_FOLDER, 'datasets');

function initFile(filepath: string, defaultValue: any) {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultValue, null, 2), 'utf-8');
  }
}

initFile(DOCUMENTS_FILE, []);
initFile(CHUNKS_FILE, []);

export class VectorStore {
  static isGeminiDisabled = false;

  static async syncDatasetsDirectory(ai: GoogleGenAI | null): Promise<void> {
    try {
      if (!fs.existsSync(DATASETS_FOLDER)) {
        fs.mkdirSync(DATASETS_FOLDER, { recursive: true });
      }

      const existingDocs = this.getDocuments();

      const files = fs.readdirSync(DATASETS_FOLDER);
      if (files.length === 0) {
        console.log("📂 Server datasets papkasi bo'sh. Namuna huquqiy hujjatlar yaratilmoqda...");
        
        const sampleAliment = `O'ZBEKISTON RESPUBLIKASI OILA KODEKSI - ALIMENT MAJBURIYATLARI
96-modda. Ota-onaning balog'atga yetmagan bolalariga ta'minot berish (aliment to'lash) majburiyati.
99-modda. Ota-onadan bolalariga undiriladigan aliment miqdori.
Voyaga yetmagan bolalariga aliment to'lash haqida ota-ona o'rtasida kelishuv bo'lmaganda, ularning ta'minoti uchun aliment suddan ota-onaning oylik ish haqi va/yoki boshqa daromadining:
- 1 ta bola uchun - to'rtdan bir qismi (25%) miqdorida;
- 2 ta bola uchun - uchdan bir qismi (33.3%) miqdorida;
- 3 ta va undan ortiq bola uchun - yarmi (50%) miqdorida undiriladi.
Ushbu to'lovlarning miqdori taraflarning moddiy yoki oilaviy ahvoli va boshqa e'tiborga loyiq holatlarni hisobga olgan holda sud tomonidan kamaytirilishi yoki ko'paytirilishi mumkin.
Har bir bola uchun undiriladigan aliment miqdori qonun hujjatlari bilan belgilangan eng kam mehnatga haq to'lash miqdorining 26.5 foizidan kam bo'lmasligi kerak. Daromad yashirilgan taqdirda sud o'rtacha oylik ish haqidan kelib chiqib hisoblaydi.`;

        const sampleLabor = `O'ZBEKISTON RESPUBLIKASI MEHNAT KODEKSI - MEHNAT SHARTNOMASINI BEKOR QILISH
155-modda. Mehnat shartnomasini bekor qilish asoslari.
157-modda. Xodimning tashabbusi bilan mehnat shartnomasini bekor qilish (O'z ariza bilan).
Xodim mehnat shartnomasini ikki hafta (14 kun) oldin ish beruvchini yozma ravishda ogohlantirib, bekor qilishga haqlidir. Ogohlantirish muddati tugagandan so'ng xodim ishni to'xtatishga haqli, ish beruvchi esa mehnat daftarchasini berishi va hisob-kitob qilishi shart.
161-modda. Ish beruvchining tashabbusi bilan mehnat shartnomasini bekor qilish.
Ish beruvchi tashabbusi bilan shartnomani bekor qilishda kasbiy muvofiqlik, shtat qisqarishi yoki xodimning aybli harakatlari asos bo'ladi. Shtat qisqarganda ish beruvchi xodimni kamida 2 oy oldin yozma xabardor qilishi va kamida o'rtacha oylik ish haqi miqdorida ishdan bo'shatish nafaqasi (severance pay) to'lashi shart.`;

        const sampleCivil = `O'ZBEKISTON RESPUBLIKASI FUQAROLIK KODEKSI - MULK HUQUQI VA NIZOLAR
164-modda. Mulk huquqi tushunchasi va mazmuni.
Mulk huquqi shaxsning o'ziga qarashli mol-mulkka o'z xohishi bilan vasiylik qilish, undan foydalanish va uni tasarruf etish huquqini anglatadi.
223-modda. Er-xotinning birgalikdagi umumiy mulki.
Er va xotinning nikoh davomida orttirgan mol-mulki, agar qonun yoki nikoh shartnomasida boshqacha tartib nazarda tutilgan bo'lmasa, ularning birgalikdagi umumiy mulki hisoblanadi. Er-xotin bu mulkka teng huquqlarga ega. Mulk kimning nomiga rasmiylashtirilganidan qat'i nazar, ajrim paytida teng 50/50 ulushlarda bo'linadi. Agar nikoh shartnomasi (pre-nup) imzolangan bo'lsa, mulk nizosi shu shartnoma shartlariga ko'ra hal qilinadi.`;

        fs.writeFileSync(path.join(DATASETS_FOLDER, 'oila_kodeksi_aliment.txt'), sampleAliment, 'utf-8');
        fs.writeFileSync(path.join(DATASETS_FOLDER, 'mehnat_shartnomasi_ogohlantirish.txt'), sampleLabor, 'utf-8');
        fs.writeFileSync(path.join(DATASETS_FOLDER, 'mulk_huquqi_er_xotin.txt'), sampleCivil, 'utf-8');
      }

      const currentFiles = fs.readdirSync(DATASETS_FOLDER);
      for (const filename of currentFiles) {
        const ext = path.extname(filename).toLowerCase();
        if (ext !== '.pdf' && ext !== '.txt') continue;

        const alreadyIndexed = existingDocs.some(d => d.name === filename);
        if (!alreadyIndexed) {
          console.log(`⚡ Yangi server hujjati aniqlandi va indekslanmoqda: ${filename}`);
          const filePath = path.join(DATASETS_FOLDER, filename);
          const buffer = fs.readFileSync(filePath);
          const mimeType = ext === '.pdf' ? 'application/pdf' : 'text/plain';

          try {
            await this.addDocument(filename, buffer, mimeType, ai);
            console.log(`✅ "${filename}" muvaffaqiyatli vektor storega qo'shildi.`);
          } catch (err: any) {
            console.error(`❌ "${filename}" faylini avtomatik indekslashda xatolik:`, err.message);
          }
        }
      }
    } catch (err) {
      console.error("General datasets directory scan failed:", err);
    }
  }

  static getDocuments(): LibraryDocument[] {
    try {
      const content = fs.readFileSync(DOCUMENTS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static saveDocuments(docs: LibraryDocument[]) {
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(docs, null, 2), 'utf-8');
  }

  static getChunks(): VectorChunk[] {
    try {
      const content = fs.readFileSync(CHUNKS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static saveChunks(chunks: VectorChunk[]) {
    fs.writeFileSync(CHUNKS_FILE, JSON.stringify(chunks, null, 2), 'utf-8');
  }

  static splitIntoChunks(text: string, chunkSize: number = 800, overlap: number = 150): string[] {
    const result: string[] = [];
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= chunkSize) {
      return [cleanText];
    }
    
    let start = 0;
    while (start < cleanText.length) {
      let end = start + chunkSize;
      if (end > cleanText.length) {
        end = cleanText.length;
      } else {
        const lastSpace = cleanText.lastIndexOf(' ', end);
        if (lastSpace > start + chunkSize / 2) {
          end = lastSpace;
        }
      }
      
      const chunk = cleanText.substring(start, end).trim();
      if (chunk.length > 5) {
        result.push(chunk);
      }
      
      start = end - overlap;
      if (start >= cleanText.length || end === cleanText.length) {
        break;
      }
    }
    
    return result;
  }

  static async addDocument(
    name: string,
    buffer: Buffer,
    mimeType: string,
    ai: GoogleGenAI | null
  ): Promise<LibraryDocument> {
    let extractedText = '';

    if (mimeType === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) {
      try {
        const data = await pdf(buffer);
        extractedText = data.text || '';
      } catch (err: any) {
        throw new Error(`PDF faylini o'qishda xatolik: ${err.message}`);
      }
    } else {
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      throw new Error('Fayl ichidagi matn bo\'sh yoki uni o\'qib bo\'lmadi.');
    }
    const chunkTexts = this.splitIntoChunks(extractedText);
    const docId = 'doc_' + Math.random().toString(36).substr(2, 9);

    const activeChunks: VectorChunk[] = [];
    for (let i = 0; i < chunkTexts.length; i++) {
      const textChunk = chunkTexts[i];
      let embedding: number[] = [];

      if (ai && !VectorStore.isGeminiDisabled) {
        try {
          // Generate 768-dim embeddings using gemini-embedding-2-preview
          const response = await ai.models.embedContent({
            model: 'gemini-embedding-2-preview',
            contents: textChunk,
          });
          
          const resAny = response as any;
          if (resAny?.embedding?.values) {
            embedding = resAny.embedding.values;
          } else if (resAny?.embeddings?.[0]?.values) {
            embedding = resAny.embeddings[0].values;
          } else {
            embedding = new Array(768).fill(0);
          }
        } catch (err: any) {
          const errMsg = (err.message || JSON.stringify(err) || "").toLowerCase();
          const isApiKeyError = errMsg.includes("api key") || errMsg.includes("api_key") || errMsg.includes("invalid key") || errMsg.includes("key not found") || errMsg.includes("invalid_argument");
          
          if (isApiKeyError) {
            VectorStore.isGeminiDisabled = true;
            console.warn(`⚠️ Gemini API Key is invalid or not found. Disabling Gemini and switching to fast offline local simulation fallback.`);
          } else {
            console.warn(`⚠️ Embedding generation failed for chunk ${i}:`, err.message || err);
          }
          embedding = this.simulateEmbedding(textChunk);
        }
      } else {
        embedding = this.simulateEmbedding(textChunk);
      }

      activeChunks.push({
        id: `chunk_${docId}_${i}`,
        docId,
        docName: name,
        text: textChunk,
        embedding,
      });
    }

    const newDoc: LibraryDocument = {
      id: docId,
      name,
      fileSize: buffer.length,
      mimeType,
      chunkCount: activeChunks.length,
      uploadedAt: new Date().toISOString(),
    };

    const docs = this.getDocuments();
    docs.push(newDoc);
    this.saveDocuments(docs);

    const currentChunks = this.getChunks();
    this.saveChunks([...currentChunks, ...activeChunks]);

    return newDoc;
  }

  static async query(
    queryText: string,
    ai: GoogleGenAI | null,
    limit: number = 4
  ): Promise<Array<{ chunk: VectorChunk; score: number }>> {
    const allChunks = this.getChunks();
    if (allChunks.length === 0) {
      return [];
    }

    let queryEmbedding: number[] = [];
    if (ai && !VectorStore.isGeminiDisabled) {
      try {
        const response = await ai.models.embedContent({
          model: 'gemini-embedding-2-preview',
          contents: queryText,
        });
        const resAny = response as any;
        if (resAny?.embedding?.values) {
          queryEmbedding = resAny.embedding.values;
        } else if (resAny?.embeddings?.[0]?.values) {
          queryEmbedding = resAny.embeddings[0].values;
        } else {
          queryEmbedding = this.simulateEmbedding(queryText);
        }
      } catch (err: any) {
        const errMsg = (err.message || JSON.stringify(err) || "").toLowerCase();
        const isApiKeyError = errMsg.includes("api key") || errMsg.includes("api_key") || errMsg.includes("invalid key") || errMsg.includes("key not found") || errMsg.includes("invalid_argument");
        
        if (isApiKeyError) {
          VectorStore.isGeminiDisabled = true;
          console.warn("⚠️ Gemini API Key is invalid or not found during query. Disabling Gemini embedding calls and switching to offline local simulation.");
        } else {
          console.warn('⚠️ Query embedding generation failed. Using simulation fallback. Error:', err.message || err);
        }
        queryEmbedding = this.simulateEmbedding(queryText);
      }
    } else {
      queryEmbedding = this.simulateEmbedding(queryText);
    }
    const matches = allChunks.map(chunk => {
      const score = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      return { chunk, score };
    });
    matches.sort((a, b) => b.score - a.score);

    return matches.slice(0, limit);
  }

  static deleteDocument(docId: string): boolean {
    const docs = this.getDocuments();
    const filteredDocs = docs.filter(d => d.id !== docId);
    if (docs.length === filteredDocs.length) {
      return false;
    }
    this.saveDocuments(filteredDocs);

    const chunks = this.getChunks();
    const filteredChunks = chunks.filter(c => c.docId !== docId);
    this.saveChunks(filteredChunks);

    return true;
  }

  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) {
      return 0;
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private static simulateEmbedding(text: string): number[] {
    const dims = 768;
    const vec = new Array(dims).fill(0);
    const cleanText = text.toLowerCase();
    
    for (let i = 0; i < cleanText.length; i++) {
      const charCode = cleanText.charCodeAt(i);
      const index = (charCode * (i + 1)) % dims;
      vec[index] += 1;
    }
    const mag = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (mag > 0) {
      for (let i = 0; i < dims; i++) {
        vec[i] /= mag;
      }
    }
    return vec;
  }
}
