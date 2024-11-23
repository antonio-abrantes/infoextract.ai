type PromptType = "menu" | "menu_v2" | "product" | "nfe";

interface Prompt {
  text: string;
  description: string;
}

export const PROMPTS: Record<PromptType, Prompt> = {
  menu: {
    text: "Analise esta imagem de um menu, ou cardápio ou parte dele, e retorne um JSON com a seguinte estrutura para cada item do menu: { name: string, price: string, description: string }. Inclua todos os itens que você conseguir identificar no menu. IMPORTANTE: Retorne APENAS o array JSON, sem nenhum texto adicional antes ou depois. E NÃO REPITA ITENS JÁ IDENTIFICADOS.",
    description: "Full menu analysis",
  },
  menu_v2: {
    text: "Analise esta imagem de um menu e retorne um JSON ARRAY com objetos com a seguinte estrutura para cada item do menu: { name: string, price: string, description: string }. Inclua todos os itens que você conseguir identificar no menu. Retone SOMENTE a string do JSON dos dados, NENHUMA informação ou texto a mais. ATENÇÃO: Não inclua dados que não estejam na imagem, caso algum produto não tenha alguma dado, prencha a propriedade com uma string vazia.",
    description: "Full menu analysis - v2",
  },
  product: {
    text: "Analise esta imagem de um produto e retorne um JSON ARRAY com APENAS UM objeto com a seguinte estrutura: { codigo: string, name: string, category: string, price: string, description: string }. Faça uma descrição detalhada do produto e seus ingredientes. Retone SOMENTE a string do JSON dos dados, NENHUMA informação ou texto a mais. ATENÇÃO: Não inclua dados que não estejam na imagem, caso algum produto não tenha alguma dado, prencha a propriedade com uma string vazia. Neste caso, vai ter apenas um obejto, mas mesmo assim, retorne UM ARRAY com um objeto.",
    description: "Specific product analysis",
  },
  nfe: {
    text: "Analise esta imagem de uma nota fiscal e retorne um JSON com a seguinte estrutura para cada item do menu: { codigo: string, referencia: string, quantidade: string, valor: string }. Inclua todos os itens que você conseguir identificar na nota fiscal. IMPORTANTE: Retorne APENAS o array JSON, sem nenhum texto adicional antes ou depois.",
    description: "NFE analysis",
  },
};

export type { PromptType };
