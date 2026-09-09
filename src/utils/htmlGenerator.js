import { formatWhatsAppUrl, formatFacebookMetaTag, naturalizeCnaeDescription } from './cnpjExtractor.js';

/**
 * Escapa strings para uso seguro em HTML
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Obtém as iniciais para o logo/badge da empresa
 */
function getInitials(name) {
  if (!name) return 'CNPJ';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Gera o arquivo index.html institucional completo
 */
export function generateInstitutionalHtml(data) {
  const currentYear = new Date().getFullYear();

  const razaoSocial = escapeHtml(data.razaoSocial || 'Empresa');
  const nomeFantasia = escapeHtml(data.nomeFantasia || data.razaoSocial || 'Empresa');
  const displayNome = escapeHtml(data.nomeFantasia ? `${data.nomeFantasia} (${data.razaoSocial})` : data.razaoSocial);
  const cnpj = escapeHtml(data.cnpj || 'Não informado');
  const dataAbertura = escapeHtml(data.dataAbertura || 'Não informada');
  const porte = escapeHtml(data.porte || 'Não informado');
  const situacao = escapeHtml(data.situacaoCadastral || 'ATIVA');
  const natureza = escapeHtml(data.naturezaJuridica || 'Não informada');
  
  const logradouro = escapeHtml(data.logradouro || '');
  const numero = escapeHtml(data.numero || '');
  const complemento = escapeHtml(data.complemento || '');
  const bairro = escapeHtml(data.bairro || '');
  const cidade = escapeHtml(data.cidade || '');
  const uf = escapeHtml(data.uf || '');
  const cep = escapeHtml(data.cep || '');

  const enderecoPartes = [
    logradouro && `${logradouro}${numero ? ', ' + numero : ''}`,
    complemento,
    bairro,
    (cidade || uf) && `${cidade}${uf ? ' - ' + uf : ''}`,
    cep && `CEP: ${cep}`
  ].filter(Boolean);
  const enderecoCompleto = enderecoPartes.join(', ') || 'Endereço não informado';

  const telefone = escapeHtml(data.telefone || '');
  const email = escapeHtml(data.email || '');

  const cnaePrincipalCodigo = escapeHtml(data.cnaePrincipal?.codigo || '');
  const cnaePrincipalDesc = escapeHtml(data.cnaePrincipal?.descricao || 'Serviços especializados');
  const naturalPrincipal = escapeHtml(naturalizeCnaeDescription(data.cnaePrincipal?.descricao));

  const whatsappUrl = formatWhatsAppUrl(data.telefone);
  const initials = getInitials(data.nomeFantasia || data.razaoSocial);

  // Meta Tag do Facebook formatada
  const fbMetaTag = formatFacebookMetaTag(data.facebookMeta);

  // Lista de todos os CNAEs para a seção de serviços
  const allServices = [];
  if (cnaePrincipalCodigo || cnaePrincipalDesc) {
    allServices.push({
      tipo: 'CNAE PRINCIPAL',
      codigo: cnaePrincipalCodigo,
      descricao: cnaePrincipalDesc,
      isPrincipal: true
    });
  }

  if (Array.isArray(data.cnaesSecundarios)) {
    data.cnaesSecundarios.forEach((sec) => {
      if (sec.codigo || sec.descricao) {
        allServices.push({
          tipo: 'CNAE SECUNDÁRIO',
          codigo: escapeHtml(sec.codigo),
          descricao: escapeHtml(sec.descricao),
          isPrincipal: false
        });
      }
    });
  }

  // Cards de Serviços em HTML
  const servicesCardsHtml = allServices.map((srv) => {
    return `
      <div class="service-card group">
        <div class="flex items-center justify-between mb-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
            srv.isPrincipal
              ? 'bg-amber-400/10 text-[#facc15] border border-amber-400/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }">
            ${srv.tipo}
          </span>
          <span class="font-mono text-xs text-zinc-500">${srv.codigo}</span>
        </div>
        <h3 class="text-lg font-semibold text-[#f4f4f5] group-hover:text-[#facc15] transition-colors mb-3 leading-snug">
          ${srv.descricao}
        </h3>
        <p class="text-sm text-[#a1a1aa] mb-6 flex-grow">
          Atendimento dedicado e execução qualificada para demandas relacionadas a este segmento de atuação.
        </p>
        <a href="${whatsappUrl || '#contato'}" ${whatsappUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[12px] text-sm font-medium bg-zinc-900 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-200">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.53 1.951.815 2.791.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm3.397 8.243c-.145.407-.841.777-1.164.825-.323.048-.737.073-2.148-.484-1.701-.672-2.784-2.404-2.868-2.518-.084-.114-.687-.915-.687-1.745 0-.83.435-1.238.589-1.393.155-.155.337-.193.45-.193.113 0 .226.002.324.007.104.006.242-.039.379.29.145.348.497 1.21.541 1.3.044.09.073.194.013.312-.059.119-.09.193-.178.297-.089.104-.187.232-.267.312-.089.089-.182.186-.078.365.104.179.462.763.992 1.236.682.608 1.258.796 1.437.885.179.089.283.074.388-.044.105-.119.45-.523.57-.702.12-.179.24-.149.404-.089.164.06 1.042.492 1.22.581.179.089.298.134.343.208.044.075.044.436-.101.843z"/></svg>
          Agendar pelo WhatsApp
        </a>
      </div>
    `;
  }).join('\n');

  // Parágrafo do Sobre
  const sobreTexto = `Fundada em ${dataAbertura}, a empresa ${razaoSocial}${
    data.nomeFantasia ? ' — ' + nomeFantasia : ''
  } atua no segmento de ${cnaePrincipalDesc}, com sede em ${cidade || 'município sede'} - ${uf || 'Brasil'}.`;

  // Montagem da primeira linha com a meta tag, exatamente como solicitado
  let docPrefix = '';
  if (fbMetaTag) {
    docPrefix = `${fbMetaTag}\n<!DOCTYPE html>`;
  } else {
    docPrefix = '<!DOCTYPE html>';
  }

  return `${docPrefix}
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nomeFantasia} | ${razaoSocial} - Institucional</title>
  <meta name="description" content="Página institucional oficial de ${nomeFantasia}. Conheça nossas atividades em ${naturalPrincipal}, endereço, dados cadastrais e canais de atendimento direto.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brandDark: '#0a0a0a',
            brandCard: '#111111',
            brandBorder: '#1f1f1f',
            brandYellow: '#facc15',
            brandGreen: '#22c55e',
            brandText: '#f4f4f5',
            brandMuted: '#a1a1aa'
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif']
          }
        }
      }
    }
  </script>

  <!-- Google Fonts Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    body {
      background-color: #0a0a0a;
      color: #f4f4f5;
      font-family: 'Inter', sans-serif;
    }
    .custom-card {
      background-color: #111111;
      border: 1px solid #1f1f1f;
      border-radius: 16px;
    }
    .service-card {
      background-color: #111111;
      border: 1px solid #1f1f1f;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
    }
    .service-card:hover {
      border-color: #333333;
      transform: translateY(-2px);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-amber-400 selection:text-black">

  <!-- HEADER -->
  <header class="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f1f1f]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- Marca / Iniciais / Informações -->
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-[14px] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-amber-500/10">
          ${initials}
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-[#f4f4f5] text-base leading-tight tracking-tight">${nomeFantasia}</span>
          <span class="text-xs text-[#a1a1aa] leading-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md" title="${razaoSocial}">${razaoSocial}</span>
          <div class="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
            <span>CNPJ: ${cnpj}</span>
            ${cidade ? `<span class="text-zinc-700">•</span><span>${cidade}/${uf}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Menu de Navegação -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-[#a1a1aa]">
        <a href="#sobre" class="hover:text-[#f4f4f5] transition-colors">Sobre</a>
        <a href="#servicos" class="hover:text-[#f4f4f5] transition-colors">Serviços</a>
        <a href="#registro" class="hover:text-[#f4f4f5] transition-colors">Registro</a>
        <a href="#contato" class="hover:text-[#f4f4f5] transition-colors">Contato</a>
      </nav>

      <!-- Botão Header -->
      <div class="flex items-center gap-3">
        <a href="${whatsappUrl || '#contato'}" ${whatsappUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center justify-center px-5 py-2.5 rounded-[12px] text-sm font-semibold bg-[#facc15] hover:bg-yellow-400 text-black transition-all shadow-md shadow-yellow-400/10">
          Agendar
        </a>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="py-16 md:py-24 border-b border-[#1f1f1f] relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Texto Principal Hero -->
        <div class="lg:col-span-7 flex flex-col items-start">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-[#a1a1aa] mb-6">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Empresa devidamente cadastrada na Receita Federal
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f4f4f5] tracking-tight leading-[1.15] mb-6">
            Qualidade e confiança em <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-amber-200">${naturalPrincipal}</span>
          </h1>

          <p class="text-base sm:text-lg text-[#a1a1aa] mb-8 max-w-2xl leading-relaxed">
            ${sobreTexto}
          </p>

          <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <a href="${whatsappUrl || '#contato'}" ${whatsappUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] text-base font-semibold bg-[#22c55e] hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.53 1.951.815 2.791.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm3.397 8.243c-.145.407-.841.777-1.164.825-.323.048-.737.073-2.148-.484-1.701-.672-2.784-2.404-2.868-2.518-.084-.114-.687-.915-.687-1.745 0-.83.435-1.238.589-1.393.155-.155.337-.193.45-.193.113 0 .226.002.324.007.104.006.242-.039.379.29.145.348.497 1.21.541 1.3.044.09.073.194.013.312-.059.119-.09.193-.178.297-.089.104-.187.232-.267.312-.089.089-.182.186-.078.365.104.179.462.763.992 1.236.682.608 1.258.796 1.437.885.179.089.283.074.388-.044.105-.119.45-.523.57-.702.12-.179.24-.149.404-.089.164.06 1.042.492 1.22.581.179.089.298.134.343.208.044.075.044.436-.101.843z"/></svg>
              Falar no WhatsApp
            </a>

            <a href="#servicos" class="inline-flex items-center justify-center px-6 py-3.5 rounded-[16px] text-base font-medium bg-zinc-900 hover:bg-zinc-800 text-[#f4f4f5] border border-zinc-700 transition-colors w-full sm:w-auto">
              Conhecer serviços
            </a>
          </div>
        </div>

        <!-- Card Lateral Hero -->
        <div class="lg:col-span-5">
          <div class="custom-card p-6 sm:p-8 shadow-2xl relative overflow-hidden border-zinc-800/80">
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-[#1f1f1f]">
              <span class="text-xs uppercase tracking-wider font-semibold text-[#facc15]">Atendimento</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ${situacao}
              </span>
            </div>

            <h2 class="text-2xl font-bold text-[#f4f4f5] mb-2">Agendamento rápido</h2>
            <p class="text-sm text-[#a1a1aa] mb-6">
              Entre em contato direto pelo telefone ou WhatsApp para consultar disponibilidade, orçamentos e prazos.
            </p>

            <div class="bg-black/60 rounded-[12px] p-4 border border-zinc-800/60 mb-6">
              <span class="text-xs text-zinc-500 block mb-1">Central de Atendimento</span>
              <div class="text-xl sm:text-2xl font-bold text-[#f4f4f5] font-mono tracking-tight">
                ${telefone || 'Telefone disponível sob consulta'}
              </div>
            </div>

            <a href="${whatsappUrl || '#contato'}" ${whatsappUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-[14px] text-base font-semibold bg-[#facc15] hover:bg-yellow-400 text-black transition-all shadow-md">
              Solicitar atendimento
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- SEÇÃO SOBRE -->
  <section id="sobre" class="py-16 md:py-20 border-b border-[#1f1f1f]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="max-w-3xl mb-12">
        <span class="text-xs font-bold uppercase tracking-wider text-[#facc15] block mb-2">Sobre a Empresa</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-[#f4f4f5] tracking-tight">Informações institucionais</h2>
        <p class="mt-4 text-base sm:text-lg text-[#a1a1aa] leading-relaxed">
          ${sobreTexto}
        </p>
      </div>

      <!-- Grid com os 4 cards requeridos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="custom-card p-5 flex flex-col justify-between">
          <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Razão Social</span>
          <span class="text-base font-semibold text-[#f4f4f5] leading-snug">${razaoSocial}</span>
        </div>

        <div class="custom-card p-5 flex flex-col justify-between">
          <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Nome Fantasia</span>
          <span class="text-base font-semibold text-[#f4f4f5] leading-snug">${nomeFantasia || razaoSocial}</span>
        </div>

        <div class="custom-card p-5 flex flex-col justify-between">
          <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Porte Empresarial</span>
          <span class="text-base font-semibold text-[#facc15] leading-snug">${porte}</span>
        </div>

        <div class="custom-card p-5 flex flex-col justify-between">
          <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Atividade Principal</span>
          <span class="text-sm font-medium text-zinc-300 leading-snug line-clamp-3" title="${cnaePrincipalDesc}">
            ${cnaePrincipalDesc}
          </span>
        </div>

      </div>

    </div>
  </section>

  <!-- SEÇÃO SERVIÇOS / CNAES -->
  <section id="servicos" class="py-16 md:py-20 border-b border-[#1f1f1f]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-[#facc15] block mb-2">Atividades & Serviços</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-[#f4f4f5] tracking-tight">CNAEs e Especialidades</h2>
          <p class="mt-2 text-sm sm:text-base text-[#a1a1aa]">
            Segmentos econômicos registrados e aptos para execução técnica e comercial.
          </p>
        </div>
        <div class="text-xs text-zinc-500 font-mono">
          Total de ${allServices.length} atividade(s) cadastrada(s)
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${servicesCardsHtml || '<div class="col-span-full py-12 text-center text-zinc-500">Nenhum serviço ou CNAE listado.</div>'}
      </div>

    </div>
  </section>

  <!-- SEÇÃO REGISTRO -->
  <section id="registro" class="py-16 md:py-20 border-b border-[#1f1f1f]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="max-w-3xl mb-12">
        <span class="text-xs font-bold uppercase tracking-wider text-[#facc15] block mb-2">Transparência & Conformidade</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-[#f4f4f5] tracking-tight">Quadro Cadastral do CNPJ</h2>
        <p class="mt-2 text-sm sm:text-base text-[#a1a1aa]">
          Dados oficiais obtidos do Comprovante de Inscrição e de Situação Cadastral da Receita Federal do Brasil.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">Razão Social</span>
          <span class="text-sm font-semibold text-[#f4f4f5]">${razaoSocial}</span>
        </div>

        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">Nome Fantasia</span>
          <span class="text-sm font-semibold text-[#f4f4f5]">${nomeFantasia || 'Não informado'}</span>
        </div>

        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">CNPJ</span>
          <span class="text-sm font-bold font-mono text-[#facc15]">${cnpj}</span>
        </div>

        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">Situação Cadastral</span>
          <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            ${situacao}
          </span>
        </div>

        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">Natureza Jurídica</span>
          <span class="text-sm text-zinc-300">${natureza}</span>
        </div>

        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">Data de Abertura</span>
          <span class="text-sm font-mono text-zinc-300">${dataAbertura}</span>
        </div>

        <div class="custom-card p-5 md:col-span-2">
          <span class="text-xs text-zinc-500 block mb-1">Endereço Completo</span>
          <span class="text-sm text-zinc-300">${enderecoCompleto}</span>
        </div>

        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">CEP</span>
          <span class="text-sm font-mono text-zinc-300">${cep || 'Não informado'}</span>
        </div>

        <div class="custom-card p-5">
          <span class="text-xs text-zinc-500 block mb-1">Telefone</span>
          <span class="text-sm font-mono text-zinc-300">${telefone || 'Não informado'}</span>
        </div>

        <div class="custom-card p-5 md:col-span-2">
          <span class="text-xs text-zinc-500 block mb-1">E-mail</span>
          <span class="text-sm text-zinc-300">${email ? `<a href="mailto:${email}" class="hover:underline text-amber-300">${email}</a>` : 'Não informado'}</span>
        </div>

      </div>

    </div>
  </section>

  <!-- SEÇÃO CONTATO -->
  <section id="contato" class="py-16 md:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="custom-card p-8 sm:p-12 lg:p-16 border-zinc-800/80 relative overflow-hidden bg-gradient-to-br from-[#111] via-[#141414] to-black">
        <div class="max-w-3xl">
          <span class="text-xs font-bold uppercase tracking-wider text-[#facc15] block mb-3">Fale Conosco</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-[#f4f4f5] tracking-tight mb-4">
            Fale com a ${nomeFantasia}
          </h2>
          <p class="text-base sm:text-lg text-[#a1a1aa] mb-8 leading-relaxed">
            Estamos à disposição para atendê-lo com agilidade e transparência. Escolha a forma de contato mais conveniente ou inicie uma conversa imediata pelo WhatsApp.
          </p>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            ${
              telefone
                ? `
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-[#facc15]">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <span class="text-xs text-zinc-500 block">Ligue diretamente</span>
                  <a href="tel:${telefone.replace(/\D/g, '')}" class="text-lg font-bold font-mono text-[#f4f4f5] hover:text-[#facc15] transition-colors">
                    ${telefone}
                  </a>
                </div>
              </div>
            `
                : ''
            }

            ${
              email
                ? `
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <span class="text-xs text-zinc-500 block">Envie uma mensagem</span>
                  <a href="mailto:${email}" class="text-base font-semibold text-[#f4f4f5] hover:text-[#facc15] transition-colors">
                    ${email}
                  </a>
                </div>
              </div>
            `
                : ''
            }
          </div>

          <div>
            <a href="${whatsappUrl || '#'}" ${whatsappUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] text-base font-bold bg-[#22c55e] hover:bg-emerald-600 text-white transition-all shadow-xl shadow-emerald-600/25">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.53 1.951.815 2.791.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm3.397 8.243c-.145.407-.841.777-1.164.825-.323.048-.737.073-2.148-.484-1.701-.672-2.784-2.404-2.868-2.518-.084-.114-.687-.915-.687-1.745 0-.83.435-1.238.589-1.393.155-.155.337-.193.45-.193.113 0 .226.002.324.007.104.006.242-.039.379.29.145.348.497 1.21.541 1.3.044.09.073.194.013.312-.059.119-.09.193-.178.297-.089.104-.187.232-.267.312-.089.089-.182.186-.078.365.104.179.462.763.992 1.236.682.608 1.258.796 1.437.885.179.089.283.074.388-.044.105-.119.45-.523.57-.702.12-.179.24-.149.404-.089.164.06 1.042.492 1.22.581.179.089.298.134.343.208.044.075.044.436-.101.843z"/></svg>
              Solicite seu Horário
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- FOOTER -->
  <footer class="mt-auto border-t border-[#1f1f1f] bg-[#0a0a0a] py-8 text-center text-xs sm:text-sm text-[#a1a1aa]">
    <div class="max-w-7xl mx-auto px-4">
      <p class="tracking-wide">
        &copy; ${currentYear} ${razaoSocial} &bull; CNPJ ${cnpj} &bull; ${cidade || 'Brasil'} - ${nomeFantasia}
      </p>
    </div>
  </footer>

</body>
</html>`;
}
