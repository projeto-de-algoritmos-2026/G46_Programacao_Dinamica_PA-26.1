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