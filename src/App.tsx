import { useState, useMemo } from 'react';
import { optimizeBatteryBank, optimizeTransmissionSchedule } from './algorithms';
import type { BatteryModule, TransmissionWindow } from './types';

const AVAILABLE_MODULES: BatteryModule[] = [
  { id: 'MOD-A', name: 'Alpha Cell', cost: 2, power: 3 },
  { id: 'MOD-B', name: 'Beta Core', cost: 3, power: 4 },
  { id: 'MOD-C', name: 'Gamma Pack', cost: 4, power: 5 },
  { id: 'MOD-D', name: 'Delta Array', cost: 5, power: 8 },
  { id: 'MOD-E', name: 'Epsilon Node', cost: 9, power: 10 },
];

// 🎲 NOVA: Função para gerar contratos totalmente aleatórios e caóticos
const generateRandomContracts = (): TransmissionWindow[] => {
  const clients = ['Siderúrgica Norte', 'Refinaria Vale', 'DataCenter Core', 'TechPark Sul', 'Automotiva Oeste', 'Complexo Químico', 'Mineração Central', 'Alumínio S.A.', 'Textil Leste', 'LogTech Hub'];
  const contracts: TransmissionWindow[] = [];

  for (let i = 0; i < 7; i++) {
    const start = Math.floor(Math.random() * 8) + 8; // Início entre 08h e 15h
    const duration = Math.floor(Math.random() * 4) + 3; // Duração de 3 a 6 horas
    const end = Math.min(start + duration, 22); // Não passa das 22h
    const value = Math.floor(Math.random() * 8) + 3; // Valor de 3k$ a 10k$

    contracts.push({
      id: `TR-0${i + 1}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      start,
      end,
      value
    });
  }
  return contracts;
};

function App() {
  const [budget, setBudget] = useState<number>(10);
  
  // 🗓️ NOVO: Agora a escala de contratos começa com propostas geradas dinamicamente
  const [contracts, setContracts] = useState<TransmissionWindow[]>(() => generateRandomContracts());

  // Setor 1: Processamento da Mochila (Baterias)
  const { maxPower, selectedModules } = useMemo(() => {
    return optimizeBatteryBank(budget, AVAILABLE_MODULES);
  }, [budget]);

  // Setor 2: Processamento do Escalonamento (Contratos passam a depender do estado)
  const { maxValue, selectedWindows } = useMemo(() => {
    return optimizeTransmissionSchedule(contracts);
  }, [contracts]);

  const handleRefreshContracts = () => {
    setContracts(generateRandomContracts());
  };

  const handleRestartAll = () => {
    setBudget(10);
    setContracts(generateRandomContracts());
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 flex flex-col items-center bg-slate-950 text-slate-100">
      
      {/* CABEÇALHO INDUSTRIAL */}
      <header className="w-full max-w-7xl flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            VOLT <span className="text-orange-500">&</span> VALOR
          </h1>
          <p className="text-slate-500 font-mono mt-1 text-xs md:text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block animate-pulse"></span>
            Painel de Controle Central da Subestação
          </p>
        </div>
        <button onClick={handleRestartAll} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-orange-500 border border-orange-500/30 rounded font-bold transition-all cursor-pointer text-xs uppercase font-mono">
          ↻ Reset Geral
        </button>
      </header>

      {/* LAYOUT EM GRID DUPLO */}
      <main className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SEÇÃO 1: BANCO DE BATERIAS (KNAPSACK) */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="text-orange-500">📥</span> Setor de Carga: Banco de Baterias
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Otimização via Paradigma Knapsack 0/1</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Geração Otimizada</span>
              <span className="text-3xl font-black text-orange-500 font-mono">{maxPower} MW</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-slate-950 border border-slate-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono text-slate-400">Orçamento Disponível:</span>
              <span className="text-xl font-black text-white font-mono">{budget} k$</span>
            </div>
            <input 
              type="range" min="1" max="20" value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="flex-grow flex flex-col gap-3">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Módulos Selecionados pela Matriz DP:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>
        </section>

        {/* SEÇÃO 2: JANELAS DE TRANSMISSÃO (WEIGHTED INTERVAL SCHEDULING) */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="text-orange-500">🗓️</span> Setor de Distribuição: Escala de Contratos
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Otimização via Weighted Interval Scheduling</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Faturamento Máximo</span>
              <span className="text-3xl font-black text-emerald-500 font-mono">{maxValue} k$</span>
            </div>
          </div>

          {/* ⚡ NOVO CONTROLE: Botão para disparar novas propostas aleatórias */}
          <div className="flex justify-between items-center bg-slate-950 border border-slate-800 p-4 rounded-lg">
            <span className="text-xs text-slate-400 font-mono">Simular alteração nas demandas de mercado:</span>
            <button 
              onClick={handleRefreshContracts}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded font-bold transition-all text-xs cursor-pointer tracking-wider font-mono uppercase"
            >
              ⚡ Coletar Novas Propostas
            </button>
          </div>

          {/* LINHA DO TEMPO VISUAL (TIMELINE) */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col gap-3 overflow-x-auto">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Mapa de Ocupação de Carga (08h às 22h)</h3>
            
            <div className="min-w-[500px] flex flex-col gap-2 relative pt-6">
              {/* Régua de Horários */}
              <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] font-mono text-slate-600 border-b border-slate-800 pb-1">
                <span>08:00</span><span>11:00</span><span>14:00</span><span>17:00</span><span>20:00</span><span>23:00</span>
              </div>

              {/* Renderização das Barras de Contratos */}
              {contracts.map(win => {
                const isSelected = selectedWindows.some(sw => sw.id === win.id);
                const startPercent = ((win.start - 8) / 14) * 100;
                const widthPercent = ((win.end - win.start) / 14) * 100;

                return (
                  <div key={win.id} className="w-full h-8 bg-slate-900/40 rounded border border-slate-800/60 relative group flex items-center">
                    <div 
                      className={`h-full rounded flex items-center justify-between px-3 text-xs font-mono transition-all duration-300 border ${
                        isSelected 
                          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-slate-800/40 border-slate-700/30 text-slate-500 opacity-40 group-hover:opacity-60'
                      }`}
                      style={{ marginLeft: `${startPercent}%`, width: `${widthPercent}%` }}
                    >
                      <span className="font-bold truncate">{win.client}</span>
                      <span className="font-black shrink-0">{win.value}k$</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <p className="text-xs font-mono text-slate-400">
              <span className="text-emerald-500">LOG DO PROGRAMA:</span> Vetor p(j) gerado por varredura linear de encerramento. Subproblemas de intervalos sobrepostos resolvidos em complexidade linear após ordenação de limites.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;