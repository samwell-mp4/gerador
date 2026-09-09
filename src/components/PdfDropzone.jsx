import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, RefreshCw } from 'lucide-react';

export default function PdfDropzone({ onFileSelected, onSampleLoad, isLoading, currentFileName }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        onFileSelected(file);
      } else {
        alert('Por favor, selecione apenas arquivos em formato PDF (.pdf).');
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        onFileSelected(file);
      } else {
        alert('Por favor, selecione apenas arquivos em formato PDF (.pdf).');
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-yellow-400 bg-yellow-400/5 scale-[1.01] shadow-2xl shadow-yellow-500/10'
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 mb-4 animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Extraindo dados...</h3>
            <p className="text-sm text-zinc-400 max-w-sm">
              Lendo estrutura do Cartão CNPJ e identificando os campos cadastrais automaticamente.
            </p>
          </div>
        ) : currentFileName ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-mono text-zinc-200 mb-2">
              <FileText className="w-3.5 h-3.5 text-yellow-400" />
              {currentFileName}
            </div>
            <p className="text-sm font-semibold text-emerald-400 mb-3">
              PDF carregado com sucesso
            </p>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Clique ou arraste outro PDF para substituir
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/80 flex items-center justify-center text-yellow-400 mb-5 shadow-xl group-hover:scale-105 transition-transform">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">
              Arraste seu Cartão CNPJ aqui
            </h3>
            <p className="text-zinc-400 text-sm mb-6">ou</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-yellow-400 hover:bg-yellow-300 text-black transition-all shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20 active:scale-95"
            >
              Selecionar PDF
            </button>
            <p className="text-xs text-zinc-500 mt-5">
              Aceita somente arquivos em formato PDF (.pdf) oficial da Receita Federal
            </p>
          </div>
        )}
      </div>

      {/* Botão para carregar dados de exemplo (Demo) */}
      {!isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSampleLoad();
            }}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-yellow-400 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 px-4 py-2 rounded-full transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Ou carregue dados de exemplo para testar agora
          </button>
        </div>
      )}
    </div>
  );
}
