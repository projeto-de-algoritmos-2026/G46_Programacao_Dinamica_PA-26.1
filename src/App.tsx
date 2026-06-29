import { useState, useMemo } from 'react';
import { optimizeBatteryBank } from './algorithms';
import type { BatteryModule } from './types';

// O "Mercado" de Baterias disponíveis para compra
const AVAILABLE_MODULES: BatteryModule[] = [
  { id: 'MOD-A', name: 'Alpha Cell', cost: 2, power: 3 },
  { id: 'MOD-B', name: 'Beta Core', cost: 3, power: 4 },
  { id: 'MOD-C', name: 'Gamma Pack', cost: 4, power: 5 },
  { id: 'MOD-D', name: 'Delta Array', cost: 5, power: 8 },
  { id: 'MOD-E', name: 'Epsilon Node', cost: 9, power: 10 },
];

function App() {
  // Orçamento máximo disponível (Capacidade da Mochila)
  const [budget, setBudget] = useState<number>(10);

  // Calcula a otimização toda vez que o orçamento mudar, usando a Programação Dinâmica
  const { maxPower, selectedModules } = useMemo(() => {
    return optimizeBatteryBank(budget, AVAILABLE_MODULES);
  }, [budget]);

  return (
    <div className="min-h-screen p-6 lg:p-8 flex flex-col items-center">
      
      {/* CABEÇALHO */}
      <header className="w-full max-w-6xl flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            VOLT <span className="text-orange-500">&</span> VALOR
          </h1>
          <p className="text-slate-500 font-mono mt-1 text-xs md:text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block animate-pulse"></span>
            Painel de Otimização de Subestação
          </p>
        </div>
      </header>

      {/* PAINEL PRINCIPAL */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: Mercado e Controles */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Controle de Orçamento (A Mochila) */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold font-mono text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-orange-500">_</span> Orçamento Base
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-mono text-sm">Capacidade de Investimento</span>
                <span className="text-3xl font-black text-white">{budget} <span className="text-lg text-slate-500">k$</span></span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-xs text-slate-600 font-mono">
                Ajuste o limite de custo para forçar o recálculo da Matriz DP.
              </p>
            </div>
          </section>

          {/* Mercado de Módulos */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex-grow">
            <h2 className="text-xl font-bold font-mono text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-orange-500">_</span> Catálogo de Módulos
            </h2>
            <div className="flex flex-col gap-3">
              {AVAILABLE_MODULES.map(mod => (
                <div key={mod.id} className="flex justify-between items-center bg-slate-950 border border-slate-800 p-3 rounded-lg">
                  <div>
                    <h3 className="text-slate-200 font-bold">{mod.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">{mod.id}</span>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Custo</span>
                      <span className="text-slate-300 font-mono">{mod.cost}k$</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-orange-500/70 uppercase font-bold">Geração</span>
                      <span className="text-orange-500 font-black font-mono">{mod.power} MW</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* COLUNA DIREITA: Resultado da Otimização */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <section className="bg-slate-900 border-2 border-orange-500/20 rounded-xl p-6 shadow-[0_0_30px_rgba(234,88,12,0.05)] h-full flex flex-col">
            
            <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-bold font-mono text-white uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span className="text-orange-500">⚡</span> Setup Otimizado
                </h2>
                <p className="text-xs text-slate-500 font-mono">Resolvido via Knapsack (DP)</p>
              </div>
              
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">
                  Geração Máxima
                </span>
                <span className="text-5xl font-black font-mono text-orange-500 drop-shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                  {maxPower} <span className="text-2xl">MW</span>
                </span>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-4">Módulos Alocados na Matriz</h3>
              
              {selectedModules.length === 0 ? (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg">
                  <span className="text-slate-600 font-mono text-sm">Orçamento insuficiente para alocação.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedModules.map(mod => (
                    <div key={mod.id} className="bg-slate-950 border border-orange-500/30 p-4 rounded-lg relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                      <h4 className="text-white font-bold ml-2">{mod.name}</h4>
                      <div className="flex justify-between mt-3 ml-2">
                        <span className="text-sm font-mono text-slate-400">-{mod.cost}k$ Orçamento</span>
                        <span className="text-sm font-mono font-bold text-orange-400">+{mod.power} MW</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 bg-slate-950 p-4 rounded border border-slate-800">
              <p className="text-xs font-mono text-slate-400">
                <span className="text-emerald-500">LOG DO SISTEMA:</span> Algoritmo de Otimização Dinâmica concluído. Equação de Bellman processada com sucesso. Itens rastreados da tabela de Memoization via Backtracking.
              </p>
            </div>

          </section>
        </div>

      </main>
    </div>
  );
}

export default App;