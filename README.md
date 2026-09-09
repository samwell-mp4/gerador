# Gerador de Página Institucional via Cartão CNPJ

Aplicativo web moderno, rápido e responsivo para gerar automaticamente uma página institucional completa (`index.html`) a partir do Cartão CNPJ da Receita Federal enviado via **Drag and Drop**.

---

## 🚀 Funcionalidades

1. **Drag and Drop de PDF**:
   - Arraste ou selecione o PDF oficial do Cartão CNPJ (Comprovante de Inscrição e de Situação Cadastral).
   - Processamento 100% no navegador via **PDF.js** (sem envio para servidores externos).

2. **Extração Automática e Precisa**:
   - Número de inscrição / CNPJ
   - Data de abertura
   - Razão Social / Nome empresarial
   - Nome fantasia
   - Porte da empresa (ME, EPP, etc.)
   - Situação cadastral
   - Natureza jurídica
   - Endereço completo (Logradouro, Número, Complemento, Bairro, Cidade, UF, CEP)
   - Telefone e E-mail
   - CNAE Principal e CNAEs Secundários múltiplos

3. **Formulário Editável**:
   - Permite conferir, corrigir ou complementar manualmente qualquer dado.
   - Campos de telefone e e-mail sempre editáveis.
   - Gerenciador dinâmico de CNAEs (adicionar, editar ou remover atividades secundárias).

4. **Meta Tag de Domínio do Facebook**:
   - Aceita o código puro (ex: `abc123456`) ou a tag completa `<meta name="facebook-domain-verification" content="..." />`.
   - Converte automaticamente e insere na **primeira linha do arquivo**, antes de `<!DOCTYPE html>`.

5. **Geração do index.html Institucional**:
   - Tailwind CSS CDN + Google Fonts Inter.
   - Design moderno escuro:
     - Background: `#0a0a0a`
     - Cards: `#111111`
     - Bordas: `#1f1f1f`
     - Border-radius: `16px`
     - Botão principal: `#facc15`
     - Botão WhatsApp: `#22c55e`
     - Texto principal: `#f4f4f5`
     - Texto secundário: `#a1a1aa`
   - Seções inclusas:
     - **Header**: Iniciais/monograma, Razão Social, CNPJ, Cidade/UF, Nome Fantasia, menu de navegação e botão de agendamento.
     - **Hero**: Headline reduzida da atividade principal, texto institucional baseado nos dados reais, botões de ação e card lateral de "Agendamento rápido".
     - **Sobre**: Informações institucionais detalhadas e cards de Razão Social, Nome Fantasia, Porte e Atividade Principal.
     - **Serviços**: Card dedicado para cada CNAE (Principal e Secundários) com link direto para o WhatsApp.
     - **Registro**: Quadro completo de conformidade cadastral do CNPJ.
     - **Contato**: Card de contato com telefone direto e botão "Solicite seu Horário".
     - **Footer**: `© [ANO] [RAZÃO SOCIAL] • CNPJ [CNPJ] • [CIDADE] - [NOME FANTASIA]`.
     - **WhatsApp**: Tratamento automático para o padrão brasileiro `https://wa.me/55DDDNÚMERO`.

6. **Prévia e Download**:
   - Visualização em tempo real em `iframe` com alternância responsiva (Desktop, Tablet, Mobile).
   - Botão para abrir em tela cheia e botão para copiar o código HTML.
   - Download direto do arquivo `index.html` com charset UTF-8.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite**
- **PDF.js (`pdfjs-dist`)**
- **Lucide React** (Ícones modernos)
- **Tailwind CSS**

---

## 💻 Como Executar

### 1. Clonar o repositório
```bash
git clone https://github.com/samwell-mp4/gerador.git
cd gerador
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar servidor de desenvolvimento
```bash
npm run dev
```
Acesse em seu navegador: [http://localhost:5173](http://localhost:5173)

### 4. Build de produção
```bash
npm run build
```
