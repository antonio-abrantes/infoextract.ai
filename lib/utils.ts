import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractJsonArray(text: string): any[] {
  try {
    console.log("Text received for extraction:", text);
    
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      console.log("No array found in the text");
      throw new Error("No JSON array found in the response");
    }
    
    const jsonArray = JSON.parse(match[0]);
    
    if (!Array.isArray(jsonArray)) {
      console.log("The result is not an array:", jsonArray);
      throw new Error("The JSON found is not an array");
    }
    
    return jsonArray;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error processing JSON: ${error.message}`);
    }
    throw new Error(`Error processing JSON: ${String(error)}`);
  }
}

export const convertToCSV = (items: any[]) => {
  // Define os headers baseado nas propriedades dos itens
  const headers = ['name', 'price', 'description', 'codigo', 'category'];
  
  // Cria a linha de header
  let csv = headers.join(',') + '\n';
  
  // Adiciona os dados
  items.forEach(item => {
    const row = headers.map(header => {
      // Escapa aspas duplas e envolve o campo em aspas
      const field = item[header]?.toString() || '';
      return `"${field.replace(/"/g, '""')}"`;
    });
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

export const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Cria URL para download
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  // Anexa o link ao documento, clica nele e remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Libera a URL criada
  URL.revokeObjectURL(url);
};