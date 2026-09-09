import * as pdfjsLib from 'pdfjs-dist';
import { parseCnpjText } from './cnpjExtractor.js';

// Configura o worker do PDF.js de forma resiliente
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
}

/**
 * Lê um arquivo PDF (File ou ArrayBuffer) e extrai todo o texto em ordem de leitura
 */
export async function extractTextFromPdf(fileOrBuffer) {
  let arrayBuffer;
  if (fileOrBuffer instanceof Blob) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    arrayBuffer = fileOrBuffer;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pageTexts = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Organiza os itens de texto com base nas coordenadas ou fluxo contínuo
    // Agrupamos itens na mesma linha (y aproximado) para manter a integridade das frases
    const items = textContent.items.map(item => ({
      str: item.str,
      x: item.transform ? item.transform[4] : 0,
      y: item.transform ? item.transform[5] : 0,
    }));

    // Ordenar de cima para baixo (y decrescente) e esquerda para a direita (x crescente)
    items.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 3) {
        return b.y - a.y; // topo para baixo
      }
      return a.x - b.x; // esquerda para direita
    });

    // Agrupa por linhas
    const lines = [];
    let currentLine = [];
    let currentY = null;

    for (const item of items) {
      if (currentY === null || Math.abs(item.y - currentY) > 3) {
        if (currentLine.length > 0) {
          lines.push(currentLine.join(' '));
        }
        currentLine = [item.str];
        currentY = item.y;
      } else {
        currentLine.push(item.str);
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }

    pageTexts.push(lines.join('\n'));
  }

  const fullText = pageTexts.join('\n\n');
  return {
    rawText: fullText,
    data: parseCnpjText(fullText)
  };
}
