import { useState } from 'react';
import { Play, RotateCcw, Settings, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Process {
  id: number;
  max: number[];
  allocation: number[];
  need: number[];
  finished: boolean;
}

export default function AlgoritmoBanquero() {
  // Configuración inicial
  const resourceTypes = ['A', 'B', 'C'];
  const initialAvailable = [10, 5, 7];
  const initialProcesses: Process[] = [
    { id: 0, max: [7, 5, 3], allocation: [0, 1, 0], need: [7, 4, 3], finished: false },
    { id: 1, max: [3, 2, 2], allocation: [2, 0, 0], need: [1, 2, 2], finished: false },
    { id: 2, max: [9, 0, 2], allocation: [3, 0, 2], need: [6, 0, 0], finished: false },
    { id: 3, max: [2, 2, 2], allocation: [2, 1, 1], need: [0, 1, 1], finished: false },
    { id: 4, max: [4, 3, 3], allocation: [0, 0, 2], need: [4, 3, 1], finished: false },
  ];

  // Estado del sistema
  const [available, setAvailable] = useState<number[]>(initialAvailable);
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [safeSequence, setSafeSequence] = useState<number[]>([]);
  const [isSafe, setIsSafe] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Estado de solicitud
  const [requestProcess, setRequestProcess] = useState(0);
  const [requestResources, setRequestResources] = useState<number[]>([0, 0, 0]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const calculateNeed = (max: number[], allocation: number[]): number[] => {
    return max.map((m, i) => m - allocation[i]);
  };

  const canFinish = (need: number[], work: number[]): boolean => {
    return need.every((n, i) => n <= work[i]);
  };

  // Algoritmo de seguridad
  const runSafetyAlgorithm = (testAvailable: number[], testProcesses: Process[]) => {
    const work = [...testAvailable];
    const finish = testProcesses.map(() => false);
    const sequence: number[] = [];
    
    addLog('🔍 Iniciando algoritmo de seguridad...');
    addLog(`📊 Recursos disponibles: [${work.join(', ')}]`);

    let found = true;
    while (found) {
      found = false;
      
      for (let i = 0; i < testProcesses.length; i++) {
        if (!finish[i] && canFinish(testProcesses[i].need, work)) {
          // Proceso puede terminar
          addLog(`✅ P${i} puede terminar: Need[${testProcesses[i].need.join(', ')}] ≤ Work[${work.join(', ')}]`);
          
          // Liberar recursos
          for (let j = 0; j < work.length; j++) {
            work[j] += testProcesses[i].allocation[j];
          }
          
          addLog(`   Recursos liberados. Work = [${work.join(', ')}]`);
          finish[i] = true;
          sequence.push(i);
          found = true;
          break;
        }
      }
    }

    const allFinished = finish.every(f => f);
    
    if (allFinished) {
      addLog(`✅ Estado SEGURO encontrado`);
      addLog(`🎯 Secuencia segura: ${sequence.map(p => `P${p}`).join(' → ')}`);
      setSafeSequence(sequence);
      setIsSafe(true);
      return true;
    } else {
      addLog(`❌ Estado INSEGURO: No todos los procesos pueden terminar`);
      const blocked = finish.map((f, i) => !f ? i : -1).filter(i => i !== -1);
      addLog(`   Procesos bloqueados: ${blocked.map(p => `P${p}`).join(', ')}`);
      setIsSafe(false);
      return false;
    }
  };

  const handleCheckSafety = () => {
    setLogs([]);
    setSafeSequence([]);
    setIsSafe(null);
    
    // Recalcular need por si acaso
    const updatedProcesses = processes.map(p => ({
      ...p,
      need: calculateNeed(p.max, p.allocation),
    }));
    
    setProcesses(updatedProcesses);
    runSafetyAlgorithm(available, updatedProcesses);
  };

  const handleRequestResources = () => {
    setLogs([]);
    setSafeSequence([]);
    setIsSafe(null);
    
    const process = processes[requestProcess];
    
    addLog(`📝 Proceso P${requestProcess} solicita recursos: [${requestResources.join(', ')}]`);
    
    // Verificar que la solicitud no exceda la necesidad
    const exceedsNeed = requestResources.some((r, i) => r > process.need[i]);
    if (exceedsNeed) {
      addLog(`❌ ERROR: La solicitud excede la necesidad máxima declarada`);
      addLog(`   Need: [${process.need.join(', ')}], Request: [${requestResources.join(', ')}]`);
      setIsSafe(false);
      return;
    }
    
    // Verificar que haya recursos disponibles
    const exceedsAvailable = requestResources.some((r, i) => r > available[i]);
    if (exceedsAvailable) {
      addLog(`❌ No hay suficientes recursos disponibles`);
      addLog(`   Available: [${available.join(', ')}], Request: [${requestResources.join(', ')}]`);
      addLog(`   El proceso debe ESPERAR`);
      setIsSafe(false);
      return;
    }
    
    // Simular asignación
    addLog(`✅ Verificaciones pasadas. Simulando asignación...`);
    const testAvailable = available.map((a, i) => a - requestResources[i]);
    const testProcesses = processes.map((p, idx) => {
      if (idx === requestProcess) {
        const newAllocation = p.allocation.map((a, i) => a + requestResources[i]);
        return {
          ...p,
          allocation: newAllocation,
          need: calculateNeed(p.max, newAllocation),
        };
      }
      return p;
    });
    
    addLog(`📊 Nuevo estado simulado:`);
    addLog(`   Available: [${testAvailable.join(', ')}]`);
    addLog(`   P${requestProcess} Allocation: [${testProcesses[requestProcess].allocation.join(', ')}]`);
    addLog(`   P${requestProcess} Need: [${testProcesses[requestProcess].need.join(', ')}]`);
    
    // Ejecutar algoritmo de seguridad
    const safe = runSafetyAlgorithm(testAvailable, testProcesses);
    
    if (safe) {
      addLog(`✅ Solicitud CONCEDIDA`);
      setAvailable(testAvailable);
      setProcesses(testProcesses);
    } else {
      addLog(`❌ Solicitud RECHAZADA (llevaría a estado inseguro)`);
      addLog(`   El proceso P${requestProcess} debe ESPERAR`);
    }
  };

  const handleReset = () => {
    setAvailable(initialAvailable);
    setProcesses(initialProcesses);
    setSafeSequence([]);
    setIsSafe(null);
    setLogs([]);
    setRequestProcess(0);
    setRequestResources([0, 0, 0]);
  };

  const updateProcessMax = (processId: number, resourceIdx: number, value: number) => {
    const updatedProcesses = processes.map((p, idx) => {
      if (idx === processId) {
        const newMax = [...p.max];
        newMax[resourceIdx] = Math.max(0, value);
        return {
          ...p,
          max: newMax,
          need: calculateNeed(newMax, p.allocation),
        };
      }
      return p;
    });
    setProcesses(updatedProcesses);
  };

  const updateProcessAllocation = (processId: number, resourceIdx: number, value: number) => {
    const updatedProcesses = processes.map((p, idx) => {
      if (idx === processId) {
        const newAllocation = [...p.allocation];
        newAllocation[resourceIdx] = Math.max(0, Math.min(value, p.max[resourceIdx]));
        return {
          ...p,
          allocation: newAllocation,
          need: calculateNeed(p.max, newAllocation),
        };
      }
      return p;
    });
    setProcesses(updatedProcesses);
    
    // Recalcular available
    const totalAllocated = resourceTypes.map((_, rIdx) => 
      updatedProcesses.reduce((sum, p) => sum + p.allocation[rIdx], 0)
    );
    const newAvailable = initialAvailable.map((total, i) => total - totalAllocated[i]);
    setAvailable(newAvailable);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Play className="size-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Demostración Interactiva</h2>
      </div>

      {/* Estado del Sistema */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Recursos Disponibles */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-bold text-white mb-4">Recursos Disponibles (Available)</h3>
          <div className="space-y-3">
            {resourceTypes.map((type, idx) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Recurso {type}:</span>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 rounded-full h-2 w-32">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(available[idx] / initialAvailable[idx]) * 100}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-blue-400 w-12 text-right">
                    {available[idx]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estado de Seguridad */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-bold text-white mb-4">Estado del Sistema</h3>
          {isSafe === null ? (
            <div className="text-gray-400 text-center py-8">
              <AlertTriangle className="size-12 mx-auto mb-3 opacity-50" />
              <p>Ejecuta el algoritmo para verificar seguridad</p>
            </div>
          ) : isSafe ? (
            <div className="text-green-400">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="size-8" />
                <span className="text-xl font-bold">Estado SEGURO</span>
              </div>
              <div className="bg-green-900/30 border border-green-700 rounded p-3">
                <p className="text-sm text-green-200 mb-2">Secuencia segura encontrada:</p>
                <div className="flex flex-wrap gap-2">
                  {safeSequence.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="bg-green-600 text-white px-3 py-1 rounded font-bold">
                        P{p}
                      </span>
                      {idx < safeSequence.length - 1 && (
                        <span className="text-green-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-400">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="size-8" />
                <span className="text-xl font-bold">Estado INSEGURO</span>
              </div>
              <div className="bg-red-900/30 border border-red-700 rounded p-3">
                <p className="text-sm text-red-200">
                  No existe una secuencia segura. El sistema podría entrar en deadlock.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Procesos */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6 overflow-x-auto">
        <h3 className="font-bold text-white mb-4">Estado de Procesos</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left text-gray-300 p-2">Proceso</th>
              <th className="text-center text-gray-300 p-2" colSpan={3}>Max</th>
              <th className="text-center text-gray-300 p-2" colSpan={3}>Allocation</th>
              <th className="text-center text-gray-300 p-2" colSpan={3}>Need</th>
            </tr>
            <tr className="border-b border-gray-600 text-xs text-gray-400">
              <th className="p-2"></th>
              {['A', 'B', 'C'].map(r => <th key={`max-${r}`} className="p-1">{r}</th>)}
              {['A', 'B', 'C'].map(r => <th key={`alloc-${r}`} className="p-1">{r}</th>)}
              {['A', 'B', 'C'].map(r => <th key={`need-${r}`} className="p-1">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id} className="border-b border-gray-600 hover:bg-gray-600/50">
                <td className="text-white font-bold p-2">P{process.id}</td>
                {process.max.map((val, idx) => (
                  <td key={`max-${idx}`} className="text-center p-1">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={val}
                      onChange={(e) => updateProcessMax(process.id, idx, Number(e.target.value))}
                      className="w-12 bg-gray-800 text-white text-center rounded px-1 py-0.5"
                    />
                  </td>
                ))}
                {process.allocation.map((val, idx) => (
                  <td key={`alloc-${idx}`} className="text-center p-1">
                    <input
                      type="number"
                      min="0"
                      max={process.max[idx]}
                      value={val}
                      onChange={(e) => updateProcessAllocation(process.id, idx, Number(e.target.value))}
                      className="w-12 bg-gray-800 text-orange-400 text-center rounded px-1 py-0.5"
                    />
                  </td>
                ))}
                {process.need.map((val, idx) => (
                  <td key={`need-${idx}`} className="text-center text-purple-400 p-1">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Solicitud de Recursos */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="size-5 text-blue-400" />
          <h3 className="font-bold text-white">Solicitar Recursos</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">Proceso:</label>
            <select
              value={requestProcess}
              onChange={(e) => setRequestProcess(Number(e.target.value))}
              className="w-full bg-gray-800 text-white rounded px-3 py-2"
            >
              {processes.map((p) => (
                <option key={p.id} value={p.id}>
                  Proceso P{p.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">Recursos a solicitar:</label>
            <div className="flex gap-2">
              {resourceTypes.map((type, idx) => (
                <div key={type} className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">{type}</label>
                  <input
                    type="number"
                    min="0"
                    max={processes[requestProcess].need[idx]}
                    value={requestResources[idx]}
                    onChange={(e) => {
                      const newRequest = [...requestResources];
                      newRequest[idx] = Number(e.target.value);
                      setRequestResources(newRequest);
                    }}
                    className="w-full bg-gray-800 text-white rounded px-2 py-1 text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleRequestResources}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Play className="size-4" />
            Solicitar Recursos
          </button>
          <button
            onClick={handleCheckSafety}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <CheckCircle className="size-4" />
            Verificar Seguridad
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="size-4" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Log de Eventos */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="font-bold text-white mb-3">Registro de Ejecución</h3>
        <div className="bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-xs text-gray-300">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              Ejecuta una operación para ver el registro
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
