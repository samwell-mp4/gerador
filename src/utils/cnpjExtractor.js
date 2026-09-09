/**
 * Extrator e normalizador de dados do Cartão CNPJ da Receita Federal.
 * Lê o PDF usando pdfjs-dist e extrai campos cadastrais reais sem inventar dados.
 */

// Limpa strings com caracteres nulos, asteriscos ou marcadores comuns de "não informado"
export function cleanValue(str) {
  if (!str) return '';
  let cleaned = str.trim();
  // Remove asteriscos repetidos tipo '*****'
  if (/^\*+$/.test(cleaned) || /^[-_.]+$/.test(cleaned)) return '';
  if (/^(não informad[oa]|a informada|sem informacao|sem informação)$/i.test(cleaned)) return '';
  return cleaned;
}

/**
 * Normaliza o telefone para o link do WhatsApp: https://wa.me/55DDDNÚMERO
 */
export function formatWhatsAppUrl(phone) {
  if (!phone) return '';
  // Remove todos os caracteres não numéricos
  let digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  
  // Se já começar com 55 e tiver 12 ou 13 dígitos (ex: 5571976037236)
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return `https://wa.me/${digits}`;
  }
  
  // Se tiver 10 ou 11 dígitos (DDD + número brasileiro padrão)
  if (digits.length === 10 || digits.length === 11) {
    return `https://wa.me/55${digits}`;
  }

  // Fallback caso venha com 8 ou 9 dígitos sem DDD ou formato diferente
  return `https://wa.me/${digits}`;
}

/**
 * Normaliza meta tag do Facebook:
 * Se o usuário inserir apenas o código 'abc123456', converte para:
 * <meta name="facebook-domain-verification" content="abc123456" />
 */
export function formatFacebookMetaTag(rawInput) {
  if (!rawInput) return '';
  const trimmed = rawInput.trim();
  if (!trimmed) return '';

  // Se já for uma tag <meta ... />
  const metaMatch = trimmed.match(/<meta\s+name=["']facebook-domain-verification["']\s+content=["']([^"']+)["']\s*\/?>/i);
  if (metaMatch) {
    return `<meta name="facebook-domain-verification" content="${metaMatch[1]}" />`;
  }

  // Se já for qualquer formato de tag meta content
  const contentMatch = trimmed.match(/content=["']([^"']+)["']/i);
  if (contentMatch) {
    return `<meta name="facebook-domain-verification" content="${contentMatch[1]}" />`;
  }

  // Se for apenas o código puro
  const code = trimmed.replace(/[^a-zA-Z0-9_-]/g, '');
  if (code) {
    return `<meta name="facebook-domain-verification" content="${code}" />`;
  }

  return '';
}

/**
 * Simplifica a descrição de CNAE para um formato mais natural no Hero
 * Ex: "62.01-5-01 - Desenvolvimento de programas de computador sob encomenda"
 * -> "Desenvolvimento de programas de computador"
 */
export function naturalizeCnaeDescription(desc) {
  if (!desc) return 'serviços especializados';
  let text = desc.trim();
  // Remove código inicial se houver
  text = text.replace(/^[\d\.\-\/]+\s*-\s*/, '');
  // Remove qualificadores burocráticos comuns
  text = text.replace(/\s+sob encomenda.*$/i, '');
  text = text.replace(/\s+não especificados anteriormente.*$/i, '');
  text = text.replace(/\s+exceto.*$/i, '');
  text = text.replace(/\s+e congêneres.*$/i, '');
  return text.toLowerCase();
}

/**
 * Extrai os dados do texto completo retornado pelas páginas do PDF
 */
export function parseCnpjText(fullText) {
  const result = {
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
    cnaePrincipal: {
      codigo: '',
      descricao: ''
    },
    cnaesSecundarios: [],
    facebookMeta: ''
  };

  // Normalização de quebras de linha e múltiplos espaços
  const text = fullText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ');

  // 1. CNPJ: Formato 00.000.000/0000-00
  const cnpjMatch = text.match(/\b(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})\b/);
  if (cnpjMatch) {
    result.cnpj = cnpjMatch[1];
  }

  // 2. Data de Abertura: Formato DD/MM/AAAA próximo a "DATA DE ABERTURA"
  const aberturaMatch = text.match(/(?:DATA DE ABERTURA|ABERTURA)[\s\S]{0,60}?(\d{2}\/\d{2}\/\d{4})/i);
  if (aberturaMatch) {
    result.dataAbertura = aberturaMatch[1];
  } else {
    // Procura qualquer primeira data no início do comprovante
    const anyDate = text.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
    if (anyDate) result.dataAbertura = anyDate[1];
  }

  // 3. Nome Empresarial (Razão Social)
  const razaoMatch = text.match(/NOME EMPRESARIAL[\s\n]+([^\n]+?)(?=\s*(?:T[IÍ]TULO DO ESTABELECIMENTO|NOME FANTASIA|PORTE|C[OÓ]DIGO))/i);
  if (razaoMatch) {
    result.razaoSocial = cleanValue(razaoMatch[1]);
  }

  // 4. Nome Fantasia
  const fantasiaMatch = text.match(/(?:T[IÍ]TULO DO ESTABELECIMENTO\s*\(NOME FANTASIA\)|NOME FANTASIA)[\s\n]+([^\n]+?)(?=\s*(?:PORTE|C[OÓ]DIGO|LINHA))/i);
  if (fantasiaMatch) {
    const rawFantasia = cleanValue(fantasiaMatch[1]);
    result.nomeFantasia = rawFantasia;
  }

  // 5. Porte
  const porteMatch = text.match(/PORTE[\s\n]+(ME|EPP|DEMAIS|MICROEMPRESA|EMPRESA DE PEQUENO PORTE|SEM ENQUADRAMENTO)/i);
  if (porteMatch) {
    result.porte = porteMatch[1].toUpperCase();
  }

  // 6. Situação Cadastral
  const sitMatch = text.match(/SITUA[CÇ][AÃ]O CADASTRAL[\s\n]+(ATIVA|BAIXADA|SUSPENSA|INAPTA|NULA)/i);
  if (sitMatch) {
    result.situacaoCadastral = sitMatch[1].toUpperCase();
  } else if (/SITUA[CÇ][AÃ]O CADASTRAL/i.test(text)) {
    const sitGeneric = text.match(/SITUA[CÇ][AÃ]O CADASTRAL[\s\n]+([A-Z]+)/i);
    if (sitGeneric) result.situacaoCadastral = sitGeneric[1];
  }

  // 7. Natureza Jurídica: Ex "206-2 - Sociedade Empresária Limitada" ou "213-5 - Empresário (Individual)"
  const natMatch = text.match(/(?:NATUREZA JUR[IÍ]DICA)[\s\n]+((\d{3}-\d|\d{4})[^\n]+?)(?=\s*(?:LOGRADOURO|ENDERE[CÇ]O|TELEFONE|DATA))/i);
  if (natMatch) {
    result.naturezaJuridica = cleanValue(natMatch[1]);
  }

  // 8. Endereço: Logradouro, Número, Complemento, Bairro, CEP, Município, UF
  const logrMatch = text.match(/LOGRADOURO[\s\n]+([^\n]+?)(?=\s*(?:N[UÚ]MERO|COMPLEMENTO|CEP|BAIRRO))/i);
  if (logrMatch) {
    result.logradouro = cleanValue(logrMatch[1]);
  }

  const numMatch = text.match(/N[UÚ]MERO[\s\n]+([^\n]+?)(?=\s*(?:COMPLEMENTO|CEP|BAIRRO|MUNIC[IÍ]PIO))/i);
  if (numMatch) {
    result.numero = cleanValue(numMatch[1]);
  }

  const compMatch = text.match(/COMPLEMENTO[\s\n]+([^\n]+?)(?=\s*(?:CEP|BAIRRO|MUNIC[IÍ]PIO|UF))/i);
  if (compMatch) {
    result.complemento = cleanValue(compMatch[1]);
  }

  const cepMatch = text.match(/CEP[\s\n]+(\d{2}\.?\d{3}-\d{3}|\d{5}-\d{3}|\d{8})/i) || text.match(/\b(\d{2}\.\d{3}-\d{3})\b/);
  if (cepMatch) {
    result.cep = cleanValue(cepMatch[1]);
  }

  const bairroMatch = text.match(/BAIRRO(?:\/DISTRITO)?[\s\n]+([^\n]+?)(?=\s*(?:MUNIC[IÍ]PIO|CIDADE|UF|TELEFONE|ENDERE[CÇ]O))/i);
  if (bairroMatch) {
    result.bairro = cleanValue(bairroMatch[1]);
  }

  const muniMatch = text.match(/MUNIC[IÍ]PIO[\s\n]+([^\n]+?)(?=\s*(?:UF|TELEFONE|ENDERE[CÇ]O))/i);
  if (muniMatch) {
    result.cidade = cleanValue(muniMatch[1]);
  }

  const ufMatch = text.match(/\bUF[\s\n]+([A-Z]{2})\b/i);
  if (ufMatch) {
    result.uf = ufMatch[1].toUpperCase();
  }

  // 9. Contato: Telefone e E-mail
  // Telefone padrão (XX) XXXX-XXXX ou (XX) 9XXXX-XXXX
  const telMatch = text.match(/(?:TELEFONE|FONE)[\s\n]+([^\n]+?)(?=\s*(?:ENDERE[CÇ]O ELETR[OÔ]NICO|E-MAIL|EMAIL|ENTE FEDERATIVO|SITUA[CÇ][AÃ]O))/i);
  if (telMatch) {
    const rawTel = cleanValue(telMatch[1]);
    const phoneCandidate = rawTel.match(/(?:\(?\d{2}\)?\s*)?(?:9\s*)?\d{4,5}[-\s]?\d{4}/);
    result.telefone = phoneCandidate ? phoneCandidate[0].trim() : rawTel;
  } else {
    const phoneGeneric = text.match(/(?:\(\d{2}\)\s*)?(?:9\d{4}|\d{4})[-.\s]?\d{4}/);
    if (phoneGeneric) {
      result.telefone = phoneGeneric[0].trim();
    }
  }

  // E-mail
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = text.match(/(?:ENDERE[CÇ]O ELETR[OÔ]NICO|E-MAIL|EMAIL)[\s\n]+([^\n]+?)(?=\s*(?:ENTE|TELEFONE|SITUA[CÇ][AÃ]O))/i);
  if (emailMatch) {
    const emailExtract = emailMatch[1].match(emailRegex);
    if (emailExtract) {
      result.email = emailExtract[1].toLowerCase();
    } else {
      result.email = cleanValue(emailMatch[1]);
    }
  } else {
    const anyEmail = text.match(emailRegex);
    if (anyEmail) result.email = anyEmail[1].toLowerCase();
  }

  // 10. CNAE Principal: Ex "62.01-5-01 - Desenvolvimento de programas de computador sob encomenda"
  // ou "6201-5/01 - Desenvolvimento de..."
  const cnaeRegex = /(\d{2}\.?\d{2}-\d-?\d{2}|\d{4}-\d\/\d{2})\s*-\s*([^\n]+)/;
  
  const cnaePrincipalSection = text.match(/C[OÓ]DIGO E DESCRI[CÇ][AÃ]O DA ATIVIDADE ECON[OÔ]MICA PRINCIPAL[\s\n]+([\s\S]+?)(?=\s*C[OÓ]DIGO E DESCRI[CÇ][AÃ]O DAS ATIVIDADES ECON[OÔ]MICAS SECUND[AÁ]RIAS)/i);
  if (cnaePrincipalSection) {
    const m = cnaePrincipalSection[1].match(cnaeRegex);
    if (m) {
      result.cnaePrincipal.codigo = m[1].trim();
      result.cnaePrincipal.descricao = cleanValue(m[2]);
    } else {
      // Caso não tenha traço
      const altCode = cnaePrincipalSection[1].match(/(\d{2}\.?\d{2}-\d-?\d{2}|\d{4}-\d\/\d{2})/);
      if (altCode) {
        result.cnaePrincipal.codigo = altCode[1];
        result.cnaePrincipal.descricao = cleanValue(cnaePrincipalSection[1].replace(altCode[1], ''));
      }
    }
  }

  // 11. CNAEs Secundários
  const cnaeSecSection = text.match(/C[OÓ]DIGO E DESCRI[CÇ][AÃ]O DAS ATIVIDADES ECON[OÔ]MICAS SECUND[AÁ]RIAS[\s\n]+([\s\S]+?)(?=\s*C[OÓ]DIGO E DESCRI[CÇ][AÃ]O DA NATUREZA JUR[IÍ]DICA)/i);
  if (cnaeSecSection) {
    const secContent = cnaeSecSection[1];
    if (!/não informada|a informada/i.test(secContent)) {
      const lines = secContent.split('\n');
      for (const line of lines) {
        const sm = line.match(cnaeRegex);
        if (sm) {
          result.cnaesSecundarios.push({
            id: 'cnae-' + Math.random().toString(36).substring(2, 9),
            codigo: sm[1].trim(),
            descricao: cleanValue(sm[2])
          });
        }
      }

      // Se a quebra de linha falhou, tentar com regex global
      if (result.cnaesSecundarios.length === 0) {
        const globalCnaeRegex = /(\d{2}\.?\d{2}-\d-?\d{2}|\d{4}-\d\/\d{2})\s*-\s*([^\n\r]+?)(?=(?:\d{2}\.?\d{2}-\d-?\d{2}|\d{4}-\d\/\d{2}|$))/g;
        let match;
        while ((match = globalCnaeRegex.exec(secContent)) !== null) {
          const desc = cleanValue(match[2]);
          if (desc) {
            result.cnaesSecundarios.push({
              id: 'cnae-' + Math.random().toString(36).substring(2, 9),
              codigo: match[1].trim(),
              descricao: desc
            });
          }
        }
      }
    }
  }

  return result;
}
