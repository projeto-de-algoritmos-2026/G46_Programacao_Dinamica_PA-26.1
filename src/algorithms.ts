import type { BatteryModule } from './types';

// ==========================================
// ALGORITMO 1: 0/1 Knapsack (O Problema da Mochila)
// Objetivo: Maximizar a energia (power) sem exceder o orçamento (capacity)
// ==========================================
export const optimizeBatteryBank = (capacity: number, modules: BatteryModule[]) => {
  const n = modules.length;
  
  // Cria a tabela de Memoization DP [itens][capacidade] preenchida com 0
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  // Preenche a tabela iterativamente
  for (let i = 1; i <= n; i++) {
    const currentModule = modules[i - 1];
    for (let w = 1; w <= capacity; w++) {
      if (currentModule.cost <= w) {
        // A equação de Bellman: escolhemos o máximo entre INCLUIR ou NÃO INCLUIR o item
        dp[i][w] = Math.max(
          dp[i - 1][w], 
          dp[i - 1][w - currentModule.cost] + currentModule.power
        );
      } else {
        // Se o item é mais pesado que a capacidade atual, não podemos incluí-lo
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtracking (Rastreamento reverso) para descobrir QUAIS baterias foram escolhidas
  const selectedModules: BatteryModule[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    // Se o valor mudou em relação à linha de cima, significa que o item 'i' foi incluído!
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedModules.push(modules[i - 1]);
      w -= modules[i - 1].cost;
    }
  }

  return {
    maxPower: dp[n][capacity],
    selectedModules,
    dpTable: dp // Exportamos a tabela para poder exibi-la visualmente no painel!
  };
};

// ==========================================
// ALGORITMO 2: Weighted Interval Scheduling
// Objetivo: Maximizar o faturamento dos contratos sem sobreposição de horários
// ==========================================
export const optimizeTransmissionSchedule = (windows: TransmissionWindow[]) => {
  if (windows.length === 0) return { maxValue: 0, selectedWindows: [] };

  // 1. Ordenar os intervalos pelo horário de término (Regra fundamental do WIS)
  const sorted = [...windows].sort((a, b) => a.end - b.end);
  const n = sorted.length;

  // 2. Calcular o vetor p(j)
  // p[j] guarda o índice do último intervalo que termina antes do intervalo j começar
  const p = Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (sorted[j].end <= sorted[i].start) {
        p[i] = j;
        break;
      }
    }
  }

  // 3. Preencher a tabela OPT de Programação Dinâmica
  const opt = Array(n + 1).fill(0);
  opt[0] = 0; // Caso base

  for (let j = 1; j <= n; j++) {
    const currentVal = sorted[j - 1].value;
    const prevCompatibleIndex = p[j - 1];
    const valWithCurrent = currentVal + (prevCompatibleIndex !== -1 ? opt[prevCompatibleIndex + 1] : 0);
    const valWithoutCurrent = opt[j - 1];

    // Equação de recorrência: escolhe o maior valor entre aceitar ou rejeitar o contrato j
    opt[j] = Math.max(valWithCurrent, valWithoutCurrent);
  }

  // 4. Backtracking para recuperar quais janelas foram selecionadas
  const selectedWindows: TransmissionWindow[] = [];
  let j = n;
  while (j > 0) {
    const currentVal = sorted[j - 1].value;
    const prevCompatibleIndex = p[j - 1];
    const valWithCurrent = currentVal + (prevCompatibleIndex !== -1 ? opt[prevCompatibleIndex + 1] : 0);

    if (valWithCurrent >= opt[j - 1]) {
      selectedWindows.push(sorted[j - 1]);
      j = prevCompatibleIndex + 1; // Salta para o próximo intervalo compatível anterior
    } else {
      j--;
    }
  }

  return {
    maxValue: opt[n],
    selectedWindows: selectedWindows.reverse()
  };
};