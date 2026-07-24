import React, { useState, useRef } from 'react';
import { Upload, File, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';

interface FileUploadProps {
  onFileUploaded: (file: { name: string; type: string; base64: string; size: number }) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, disabled }) => {
  const { language } = useAppContext();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState<'idle' | 'reading' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorText(null);
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadState('error');
      setErrorText(language === 'uz' ? 'Fayl hajmi 10 MB dan oshmasligi lozim!' : 'Размер файла не должен превышать 10 МБ!');
      return;
    }

    const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!supportedTypes.includes(file.type)) {
      setUploadState('error');
      setErrorText(
        language === 'uz' 
          ? "Faqat PDF, PNG yoki JPG formatidagi rasmiy hujjatlar qo'llab-quvvatlanadi." 
          : "Поддерживаются только официальные документы в формате PDF, PNG или JPG."
      );
      return;
    }

    setUploadState('reading');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setUploadState('success');
      onFileUploaded({
        name: file.name,
        type: file.type,
        base64: base64String,
        size: file.size,
      });

      setTimeout(() => {
        setUploadState('idle');
        setFileName('');
      }, 3000);
    };

    reader.onerror = () => {
      setUploadState('error');
      setErrorText(language === 'uz' ? 'Faylni o\'qishda xatolik yuz berdi!' : 'Ошибка при чтении файла!');
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInputFile = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      id="file_upload_wrapper"
      className="space-y-2 select-none"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div
        id="file_dropzone_container"
        onClick={triggerInputFile}
        className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-[#c9a84c] bg-[#c9a84c]/5 shadow-inner'
            : disabled
            ? 'border-gray-800 bg-gray-950/20 opacity-40 cursor-not-allowed'
            : 'border-gray-800 bg-[#16213e]/20 hover:border-[#c9a84c]/40 hover:bg-[#16213e]/40'
        }`}
      >
        <input
          id="hidden_input_file"
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
          disabled={disabled}
        />

        {uploadState === 'idle' && (
          <div className="space-y-1.5 py-2">
            <Upload className="h-7 w-7 text-[#c9a84c] mx-auto animate-pulse" />
            <p className="text-xs font-semibold text-white col_white">
              {language === 'uz' ? 'Hujjat biriktirish (PDF, PNG, JPG)' : 'Прикрепить документ (PDF, PNG, JPG)'}
            </p>
            <p className="text-[10px] text-gray-500 max-w-xs desc_text_file">
              {language === 'uz' 
                ? "Da'vo hujjati, shartnoma yoki cheklarni sudrab joylang yoki bosing (Maks: 10MB)" 
                : "Перетащите или кликните, чтобы загрузить иск, договор или чеки (Макс. 10МБ)"}
            </p>
          </div>
        )}

        {uploadState === 'reading' && (
          <div className="space-y-1.5 py-2 animate-bounce">
            <File className="h-7 w-7 text-[#c9a84c] mx-auto" />
            <p className="text-xs font-semibold text-[#c9a84c]">
              {language === 'uz' ? "Fayl o'qilmoqda..." : "Чтение файла..."}
            </p>
            <p className="text-[10px] text-gray-500 max-w-xs truncate">{fileName}</p>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="space-y-1.5 py-2 text-green-400">
            <Check className="h-7 w-7 mx-auto bg-green-950/20 rounded-full p-1" />
            <p className="text-xs font-bold">{language === 'uz' ? "Muvaffaqiyatli yuklandi!" : "Успешно загружено!"}</p>
            <p className="text-[10px] text-gray-400 max-w-xs truncate">{fileName}</p>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="space-y-1.5 py-1 text-red-400">
            <AlertTriangle className="h-7 w-7 mx-auto bg-red-950/20 rounded-full p-1" />
            <p className="text-xs font-bold">{language === 'uz' ? "Xatolik yuz berdi" : "Произошла ошибка"}</p>
            <p className="text-[10px] text-gray-400 max-w-xs">{errorText}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1 text-[9px] text-gray-500">
        <span className="flex items-center space-x-1 font-mono hover_security">
          <ShieldCheck className="h-3 w-3 text-[#c9a84c]" />
          <span>
            {language === 'uz' ? "Fayllar maxfiy va shifrlangan saqlanadi" : "Файлы хранятся конфиденциально и зашифрованно"}
          </span>
        </span>
        <span className="hover:underline cursor-pointer" onClick={() => setErrorText(null)}>
          {language === 'uz' ? "Xabarni o'chirish" : "Сбросить ошибку"}
        </span>
      </div>
    </div>
  );
};
