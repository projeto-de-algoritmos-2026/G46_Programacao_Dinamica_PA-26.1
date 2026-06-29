import { useState, useMemo, useEffect } from 'react';
import { optimizeBatteryBank, optimizeTransmissionSchedule } from './algorithms';
import type { BatteryModule, TransmissionWindow } from './types';

const AVAILABLE_MODULES: BatteryModule[] = [
  { id: 'MOD-A', name: 'Alpha Cell', cost: 2, power: 3 },
  { id: 'MOD-B', name: 'Beta Core', cost: 3, power: 4 },
  { id: 'MOD-C', name: 'Gamma Pack', cost: 4, power: 5 },
  { id: 'MOD-D', name: 'Delta Array', cost: 5, power: 8 },
  { id: 'MOD-E', name: 'Epsilon Node', cost: 9, power: 10 },
];

const generateRandomContracts = (): TransmissionWindow[] => {
  const clients = ['Siderúrgica Norte', 'Refinaria Vale', 'DataCenter Core', 'TechPark Sul', 'Automotiva Oeste', 'Complexo Químico', 'Mineração Central', 'Alumínio S.A.', 'Textil Leste', 'LogTech Hub'];
  const contracts: TransmissionWindow[] = [];

  for (let i = 0; i < 7; i++) {
    const start = Math.floor(Math.random() * 8) + 8;
    const duration = Math.floor(Math.random() * 4) + 3;
    const end = Math.min(start + duration, 22);
    const value = Math.floor(Math.random() * 8) + 3;

    contracts.push({
      id: `TR-0${i + 1}`, client: clients[Math.floor(Math.random() * clients.length)], start, end, value
    });
  }
  return contracts;
};

function App() {
  const [budget, setBudget] = useState<number>(10);
  const [contracts, setContracts] = useState<TransmissionWindow[]>(() => generateRandomContracts());
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // Setor 1: Knapsack DP
  const { maxPower, selectedModules, dpTable } = useMemo(() => {
    return optimizeBatteryBank(budget, AVAILABLE_MODULES);
  }, [budget]);

  // Setor 2: Weighted Interval Scheduling DP
  const { maxValue, selectedWindows } = useMemo(() => {
    return optimizeTransmissionSchedule(contracts);
  }, [contracts]);

  // Adiciona logs quando as variáveis mudam
  useEffect(() => {
    addLog(`[KNAPSACK] Matriz DP recalculada. Orçamento atual: ${budget}k$. Geração máxima encontrada: ${maxPower}MW.`);
  }, [budget, maxPower]);

  useEffect(() => {
    addLog(`[WIS] Novas propostas recebidas. Vetor p(j) atualizado. Faturamento otimizado projetado: ${maxValue}k$.`);
  }, [contracts, maxValue]);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [msg, ...prev].slice(0, 4));
  };

  const handleRefreshContracts = () => {
    setContracts(generateRandomContracts());
  };

  const handleRestartAll = () => {
    setBudget(10);
    setContracts(generateRandomContracts());
    setSystemLogs(['[SISTEMA] Reinicialização completa dos parâmetros de otimização.']);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 flex flex-col items-center bg-slate-950 text-slate-100">
      
      {/* CABEÇALHO GLOBAL */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-800 pb-6 mb-8 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            VOLT <span className="text-orange-500">&</span> VALOR
          </h1>
          <p className="text-slate-500 font-mono mt-1 text-xs md:text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block animate-pulse"></span>
            Painel de Controle Central da Subestação
          </p>
        </div>
        
        {/* HUD DE EFICIÊNCIA GLOBAL */}
        <div className="flex gap-6 items-end">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Eficiência Energética</span>
            <span className="text-3xl font-black text-white font-mono">{maxPower} <span className="text-orange-500 text-xl">MW</span></span>
          </div>
          <div className="w-px h-10 bg-slate-800"></div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Projeção Financeira</span>
            <span className="text-3xl font-black text-white font-mono">{maxValue} <span className="text-emerald-500 text-xl">k$</span></span>
          </div>
          <button onClick={handleRestartAll} className="ml-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-orange-500 border border-orange-500/50 rounded font-bold transition-all cursor-pointer text-xs uppercase font-mono shadow-[0_0_15px_rgba(234,88,12,0.1)]">
            ↻ Reset
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SEÇÃO 1: BANCO DE BATERIAS (KNAPSACK) */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-4">
            <span className="text-orange-500">📥</span> Setor de Carga: Knapsack 0/1
          </h2>

          {/* O Visualizador da Matriz DP */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2 overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Matriz de Memoization (Subproblemas)</h3>
              <span className="text-[10px] font-mono bg-orange-950 text-orange-400 px-2 py-1 rounded">Célula Alvo: dp[n][W]</span>
            </div>
            
            <div className="flex flex-col gap-1 min-w-max">
              {dpTable.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((cell, w) => {
                    // Destaca a célula final que contém a resposta ótima para o orçamento atual
                    const isTarget = i === AVAILABLE_MODULES.length && w === budget;
                    return (
                      <div 
                        key={`${i}-${w}`} 
                        className={`w-6 h-6 flex items-center justify-center text-[9px] font-mono rounded transition-colors duration-300 ${
                          isTarget 
                            ? 'bg-orange-500 text-slate-950 font-black shadow-[0_0_10px_#ea580c] scale-110 z-10' 
                            : w <= budget 
                              ? 'bg-slate-800 text-slate-400' 
                              : 'bg-slate-900 text-slate-700'
                        }`}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-1 text-right">Eixo X: Orçamento (0 a {budget}k$) | Eixo Y: Módulos Avaliados</p>
          </div>

          <div className="flex flex-col gap-4 bg-slate-950 border border-slate-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono text-slate-400">Ajuste a Mochila (Orçamento):</span>
              <span className="text-xl font-black text-white font-mono">{budget} k$</span>
            </div>
            <input 
              type="range" min="1" max="20" value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
            {selectedModules.map(mod => (
              <div key={mod.id} className="bg-slate-950 border border-orange-500/30 p-3 rounded relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{mod.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{mod.id}</span>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-400">-{mod.cost}k$</div>
                    <div className="text-orange-400 font-bold">+{mod.power}MW</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 2: JANELAS DE TRANSMISSÃO (WIS) */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="text-emerald-500">🗓️</span> Setor de Distribuição: WIS
            </h2>
            <button 
              onClick={handleRefreshContracts}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/50 rounded transition-all text-[10px] cursor-pointer tracking-wider font-mono uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]"
            >
              ⚡ Simular Propostas
            </button>
          </div>

          {/* LINHA DO TEMPO VISUAL (TIMELINE) */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col gap-3 overflow-x-auto flex-grow">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Mapa de Ocupação de Carga (08h às 22h)</h3>
            
            <div className="min-w-[500px] flex flex-col gap-3 relative pt-6">
              <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] font-mono text-slate-600 border-b border-slate-800 pb-1">
                <span>08:00</span><span>11:00</span><span>14:00</span><span>17:00</span><span>20:00</span><span>23:00</span>
              </div>

              {contracts.map(win => {
                const isSelected = selectedWindows.some(sw => sw.id === win.id);
                const startPercent = ((win.start - 8) / 14) * 100;
                const widthPercent = ((win.end - win.start) / 14) * 100;

                return (
                  <div key={win.id} className="w-full h-10 bg-slate-900/40 rounded border border-slate-800/60 relative group flex items-center">
                    <div 
                      className={`h-full rounded flex items-center justify-between px-3 text-xs font-mono transition-all duration-500 border ${
                        isSelected 
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] z-10 scale-[1.02]' 
                          : 'bg-slate-800/40 border-slate-700/30 text-slate-500 opacity-40 group-hover:opacity-60'
                      }`}
                      style={{ marginLeft: `${startPercent}%`, width: `${widthPercent}%` }}
                    >
                      <span className="font-bold truncate">{win.client}</span>
                      <div className="flex flex-col text-right leading-tight">
                        <span className="text-[9px] uppercase opacity-70">Peso</span>
                        <span className="font-black shrink-0">{win.value}k$</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* TERMINAL UNIFICADO DE LOGS (Rodapé) */}
      <footer className="w-full max-w-7xl mt-8 bg-black border border-slate-800 p-4 rounded-lg shadow-inner">
        <h3 className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-2 border-b border-slate-900 pb-1">Terminal System_Logs // PD_Engine</h3>
        <div className="flex flex-col gap-1 font-mono text-xs opacity-80">
          {systemLogs.map((log, index) => (
            <div key={index} className={`${index === 0 ? 'text-orange-400' : 'text-slate-500'}`}>
              <span className="text-slate-700 mr-2">{'>'}</span> {log}
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
}

export default App;