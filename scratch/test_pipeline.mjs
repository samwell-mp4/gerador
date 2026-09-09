import { parseCnpjText, formatWhatsAppUrl, formatFacebookMetaTag, naturalizeCnaeDescription } from '../src/utils/cnpjExtractor.js';
import { generateInstitutionalHtml } from '../src/utils/htmlGenerator.js';
import { SAMPLE_COMPANY_DATA } from '../src/utils/sampleData.js';

console.log('=== TESTE 1: Formatação de WhatsApp ===');
const testPhones = [
  { input: '(71) 97603-7236', expected: 'https://wa.me/5571976037236' },
  { input: '5571976037236', expected: 'https://wa.me/5571976037236' },
  { input: '(11) 3456-7890', expected: 'https://wa.me/551134567890' },
  { input: '+55 11 98888-7777', expected: 'https://wa.me/5511988887777' },
];

for (const t of testPhones) {
  const result = formatWhatsAppUrl(t.input);
  console.log(`Phone: "${t.input}" => "${result}" | OK: ${result === t.expected}`);
  if (result !== t.expected) throw new Error(`Falha no WhatsApp: esperado ${t.expected}, obteve ${result}`);
}

console.log('\n=== TESTE 2: Meta Tag do Facebook ===');
const testMetas = [
  {
    input: 'abc123456',
    expected: '<meta name="facebook-domain-verification" content="abc123456" />'
  },
  {
    input: '<meta name="facebook-domain-verification" content="xyz987" />',
    expected: '<meta name="facebook-domain-verification" content="xyz987" />'
  },
  {
    input: '',
    expected: ''
  }
];

for (const m of testMetas) {
  const result = formatFacebookMetaTag(m.input);
  console.log(`Meta: "${m.input}" => "${result}" | OK: ${result === m.expected}`);
  if (result !== m.expected) throw new Error(`Falha na Meta Tag: esperado ${m.expected}, obteve ${result}`);
}

console.log('\n=== TESTE 3: Parser de Texto de Cartão CNPJ Real ===');
const mockPdfText = `
REPÚBLICA FEDERATIVA DO BRASIL
CADASTRO NACIONAL DA PESSOA JURÍDICA

NÚMERO DE INSCRIÇÃO
33.592.510/0001-54
MATRIZ
COMPROVANTE DE INSCRIÇÃO E DE SITUAÇÃO CADASTRAL
DATA DE ABERTURA
15/05/2019

NOME EMPRESARIAL
VALE DO SOL ENGENHARIA E CONSTRUCOES LTDA

TÍTULO DO ESTABELECIMENTO (NOME FANTASIA)
SOL ENGENHARIA

PORTE
EPP

CÓDIGO E DESCRIÇÃO DA ATIVIDADE ECONÔMICA PRINCIPAL
41.20-4-00 - Construção de edifícios

CÓDIGO E DESCRIÇÃO DAS ATIVIDADES ECONÔMICAS SECUNDÁRIAS
42.11-1-01 - Canteiros de obras e terraplenagem
43.99-1-01 - Administração de obras

CÓDIGO E DESCRIÇÃO DA NATUREZA JURÍDICA
206-2 - Sociedade Empresária Limitada

LOGRADOURO
RUA DAS PALMEIRAS
NÚMERO
450
COMPLEMENTO
SALA 302
CEP
40.000-000
BAIRRO/DISTRITO
CENTRO
MUNICÍPIO
SALVADOR
UF
BA

ENDEREÇO ELETRÔNICO
contato@solengenharia.com.br
TELEFONE
(71) 97603-7236

SITUAÇÃO CADASTRAL
ATIVA
DATA DA SITUAÇÃO CADASTRAL
15/05/2019
`;

const parsed = parseCnpjText(mockPdfText);
console.log('Dados extraídos:');
console.log('- CNPJ:', parsed.cnpj);
console.log('- Razão Social:', parsed.razaoSocial);
console.log('- Nome Fantasia:', parsed.nomeFantasia);
console.log('- Data Abertura:', parsed.dataAbertura);
console.log('- Porte:', parsed.porte);
console.log('- Situação:', parsed.situacaoCadastral);
console.log('- Natureza:', parsed.naturezaJuridica);
console.log('- Logradouro:', parsed.logradouro);
console.log('- Número:', parsed.numero);
console.log('- Complemento:', parsed.complemento);
console.log('- Bairro:', parsed.bairro);
console.log('- Cidade:', parsed.cidade);
console.log('- UF:', parsed.uf);
console.log('- CEP:', parsed.cep);
console.log('- Telefone:', parsed.telefone);
console.log('- E-mail:', parsed.email);
console.log('- CNAE Principal:', parsed.cnaePrincipal);
console.log('- CNAEs Secundários:', parsed.cnaesSecundarios);

if (parsed.cnpj !== '33.592.510/0001-54') throw new Error('CNPJ extraído incorreto');
if (parsed.razaoSocial !== 'VALE DO SOL ENGENHARIA E CONSTRUCOES LTDA') throw new Error('Razão Social incorreta');
if (parsed.nomeFantasia !== 'SOL ENGENHARIA') throw new Error('Nome Fantasia incorreto');
if (parsed.dataAbertura !== '15/05/2019') throw new Error('Data Abertura incorreta');
if (parsed.porte !== 'EPP') throw new Error('Porte incorreto');
if (parsed.cnaePrincipal.codigo !== '41.20-4-00') throw new Error('CNAE Principal código incorreto');
if (parsed.cnaesSecundarios.length !== 2) throw new Error(`Esperava 2 CNAEs secundários, obteve ${parsed.cnaesSecundarios.length}`);

console.log('\n=== TESTE 4: Geração de HTML com Meta Tag ===');
const generatedWithMeta = generateInstitutionalHtml({
  ...SAMPLE_COMPANY_DATA,
  facebookMeta: 'my_verification_code_123'
});

const firstLineWithMeta = generatedWithMeta.split('\n')[0];
console.log('Primeira linha com meta tag:', firstLineWithMeta);
if (!firstLineWithMeta.startsWith('<meta name="facebook-domain-verification" content="my_verification_code_123"')) {
  throw new Error('A meta tag do Facebook deve ser a PRIMEIRA linha do arquivo!');
}
const secondLineWithMeta = generatedWithMeta.split('\n')[1];
console.log('Segunda linha:', secondLineWithMeta);
if (secondLineWithMeta !== '<!DOCTYPE html>') {
  throw new Error('A segunda linha deve ser <!DOCTYPE html> quando há meta tag!');
}

console.log('\n=== TESTE 5: Geração de HTML sem Meta Tag ===');
const generatedWithoutMeta = generateInstitutionalHtml({
  ...SAMPLE_COMPANY_DATA,
  facebookMeta: ''
});

const firstLineWithoutMeta = generatedWithoutMeta.split('\n')[0];
console.log('Primeira linha sem meta tag:', firstLineWithoutMeta);
if (firstLineWithoutMeta !== '<!DOCTYPE html>') {
  throw new Error('A primeira linha deve ser <!DOCTYPE html> quando não há meta tag!');
}

console.log('\n=== TODOS OS TESTES PASSARAM COM SUCESSO! ===');
