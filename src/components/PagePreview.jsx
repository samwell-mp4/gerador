import React, { useState } from 'react';
import { Download, RefreshCw, Monitor, Tablet, Smartphone, ExternalLink, Copy, Check, Eye } from 'lucide-react';

export default function PagePreview({ htmlContent, onReset, onEditAgain }) {
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [copied, setCopied] = useState(false);

  // Download direto do index.html com charset UTF-8
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Abrir em nova aba
  const handleOpenInNewTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Copiar código fonte
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const getViewportWidth = () => {
    if (viewport === 'mobile') return 'max-w-[375px]';
    if (viewport === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Barra de Ações Superior */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
        
        {/* Controles de Dispositivo */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 self-center md:self-auto">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewport === 'desktop'
                ? 'bg-zinc-800 text-yellow-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Desktop (100%)"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewport === 'tablet'
                ? 'bg-zinc-800 text-yellow-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewport === 'mobile'
                ? 'bg-zinc-800 text-yellow-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Botões Principais de Ação */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onEditAgain}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Gerar novamente / Editar
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar HTML'}
          </button>

          <button
            type="button"
            onClick={handleOpenInNewTab}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir em tela cheia
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#facc15] hover:bg-yellow-400 text-black transition-all shadow-lg shadow-yellow-400/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Baixar index.html
          </button>
        </div>

      </div>

      {/* Container do Iframe de Preview */}
      <div className="flex justify-center bg-zinc-950 p-2 sm:p-4 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden min-h-[680px]">
        <div className={`transition-all duration-300 w-full ${getViewportWidth()} flex flex-col`}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col flex-1 shadow-2xl">
            {/* Barra simulada do navegador */}
            <div className="h-9 bg-zinc-900/90 border-b border-zinc-800 px-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 truncate max-w-xs px-3 py-0.5 rounded-md bg-zinc-950/60 border border-zinc-800">
                index.html • Prévia Institucional
              </div>
              <div className="w-12"></div>
            </div>

            {/* Iframe */}
            <iframe
              title="Prévia da Página Institucional CNPJ"
              srcDoc={htmlContent}
              sandbox="allow-scripts allow-same-origin allow-popups"
              className="w-full h-[720px] bg-[#0a0a0a] border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
