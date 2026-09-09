import React, { useState } from 'react';
import PdfDropzone from './components/PdfDropzone';
import CompanyForm from './components/CompanyForm';
import PagePreview from './components/PagePreview';
import { extractTextFromPdf } from './utils/pdfReader';
import { parseCnpjText } from './utils/cnpjExtractor';
import { generateInstitutionalHtml } from './utils/htmlGenerator';
import { SAMPLE_COMPANY_DATA } from './utils/sampleData';
import { Sparkles, FileCode, CheckCircle2, ArrowLeft } from 'lucide-react';

const INITIAL_FORM_DATA = {
  cnpj: '',
  dataAbertura: '',
  razaoSocial: '',
  nomeFantasia: '',
  porte: '',
  situacaoCadastral: '',
  naturezaJuridica: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
  telefone: '',
  email: '',
  facebookMeta: '',
  cnaePrincipal: {
    codigo: '',
    descricao: ''
  },
  cnaesSecundarios: []
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [fileName, setFileName] = useState('');
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [activeStep, setActiveStep] = useState('upload'); // 'upload', 'form', 'preview'

  // Leitura e extração do PDF do Cartão CNPJ
  const handleFileSelected = async (file) => {
    setIsLoadingPdf(true);
    setFileName(file.name);
    try {
      const { data } = await extractTextFromPdf(file);
      setFormData(prev => ({
        ...prev,
        ...data,
        cnaePrincipal: data.cnaePrincipal?.codigo || data.cnaePrincipal?.descricao ? data.cnaePrincipal : prev.cnaePrincipal,
        cnaesSecundarios: Array.isArray(data.cnaesSecundarios) && data.cnaesSecundarios.length > 0 ? data.cnaesSecundarios : prev.cnaesSecundarios
      }));
      setActiveStep('form');
    } catch (err) {
      console.error('Erro ao ler PDF:', err);
      alert('Não foi possível extrair o texto deste arquivo PDF. Verifique se é um Cartão CNPJ válido ou preencha os dados manualmente.');
      setActiveStep('form');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  // Extração de texto colado diretamente
  const handleTextPasted = (text) => {
    setIsLoadingPdf(true);
    try {
      const data = parseCnpjText(text);
      setFileName('Texto Colado');
      setFormData(prev => ({
        ...prev,
        ...data,
        cnaePrincipal: data.cnaePrincipal?.codigo || data.cnaePrincipal?.descricao ? data.cnaePrincipal : prev.cnaePrincipal,
        cnaesSecundarios: Array.isArray(data.cnaesSecundarios) && data.cnaesSecundarios.length > 0 ? data.cnaesSecundarios : prev.cnaesSecundarios
      }));
      setActiveStep('form');
    } catch (err) {
      console.error('Erro ao processar texto:', err);
      alert('Não foi possível extrair os dados do texto. Verifique o formato.');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  // Carregar dados de exemplo (Demo imediato)
  const handleSampleLoad = () => {
    setFileName('cartao-cnpj-demonstracao.pdf');
    setFormData(SAMPLE_COMPANY_DATA);
    setActiveStep('form');
  };

  // Gerar HTML da página institucional
  const handleGenerate = () => {
    const html = generateInstitutionalHtml(formData);
    setGeneratedHtml(html);
    setActiveStep('preview');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f5] flex flex-col selection:bg-yellow-400 selection:text-black">
      
      {/* Barra de Topo do Sistema */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#facc15] to-amber-600 flex items-center justify-center font-black text-black shadow-lg shadow-yellow-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-zinc-100 block leading-tight">
                Gerador de Página CNPJ
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                Cartão CNPJ &rarr; index.html institucional
              </span>
            </div>
          </div>

          {/* Navegação de Etapas */}
          <div className="hidden sm:flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeStep === 'upload' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-bold' : 'text-zinc-500'
            }`}>
              1. Enviar PDF
            </span>
            <span className="text-zinc-700">&rarr;</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeStep === 'form' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-bold' : 'text-zinc-500'
            }`}>
              2. Dados & CNAEs
            </span>
            <span className="text-zinc-700">&rarr;</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeStep === 'preview' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-bold' : 'text-zinc-500'
            }`}>
              3. Prévia & Download
            </span>
          </div>

          {activeStep !== 'upload' && (
            <button
              type="button"
              onClick={() => {
                if (activeStep === 'preview') setActiveStep('form');
                else setActiveStep('upload');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Título e Subtítulo */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight mb-3">
            Gerador de Página CNPJ
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Envie o Cartão CNPJ e gere sua página institucional automaticamente.
          </p>
        </div>

        {/* ETAPA 1: Drag & Drop */}
        {activeStep === 'upload' && (
          <div className="py-6 space-y-8 animate-fade-in">
            <PdfDropzone
              isLoading={isLoadingPdf}
              currentFileName={fileName}
              onFileSelected={handleFileSelected}
              onSampleLoad={handleSampleLoad}
              onTextPasted={handleTextPasted}
            />

            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-zinc-900">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center font-bold text-sm mb-3">1</span>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">Upload Local</h4>
                <p className="text-xs text-zinc-500">O PDF é lido 100% no seu navegador com total privacidade.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">2</span>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">Extração Precisa</h4>
                <p className="text-xs text-zinc-500">Mapeamento de Razão Social, CNPJ, CNAEs e endereço completo.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <span className="w-8 h-8 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">3</span>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">HTML Pronto</h4>
                <p className="text-xs text-zinc-500">Download direto de index.html com Tailwind e tema escuro.</p>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 2: Formulário Editável */}
        {activeStep === 'form' && (
          <div className="space-y-8 animate-fade-in">
            {/* Banner de status do upload */}
            <div className="max-w-5xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-200 block truncate max-w-sm sm:max-w-md">
                    {fileName || 'Dados carregados'}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Dados extraídos com sucesso. Revise e complemente os campos abaixo.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep('upload')}
                className="text-xs text-zinc-400 hover:text-yellow-400 transition-colors self-end sm:self-center"
              >
                Trocar arquivo PDF
              </button>
            </div>

            {/* Formulário */}
            <CompanyForm
              data={formData}
              onChange={setFormData}
              onGenerate={handleGenerate}
            />
          </div>
        )}

        {/* ETAPA 3: Prévia e Download */}
        {activeStep === 'preview' && generatedHtml && (
          <div className="animate-fade-in">
            <PagePreview
              htmlContent={generatedHtml}
              onReset={() => setActiveStep('upload')}
              onEditAgain={() => setActiveStep('form')}
            />
          </div>
        )}

      </main>

      {/* Rodapé do Sistema */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        Gerador de Página Institucional a partir de Cartão CNPJ &bull; Processamento 100% no navegador
      </footer>

    </div>
  );
}
