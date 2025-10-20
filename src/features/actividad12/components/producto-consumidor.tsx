import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface BufferItem {
  id: number;
  value: number;
  producedBy: number;
}

export default function ProductoConsumidor() {
  // Configuración
  const [bufferSize, setBufferSize] = useState(5);
  const [numProducers, setNumProducers] = useState(2);
  const [numConsumers, setNumConsumers] = useState(2);
  const [productionSpeed, setProductionSpeed] = useState(1000);
  const [consumptionSpeed, setConsumptionSpeed] = useState(1200);

  // Estado del sistema
  const [buffer, setBuffer] = useState<BufferItem[]>([]);
  const [semEmpty, setSemEmpty] = useState(bufferSize);
  const [semFull, setSemFull] = useState(0);
  const [semMutex, setSemMutex] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [statistics, setStatistics] = useState({
    produced: 0,
    consumed: 0,
    totalProduced: 0,
    totalConsumed: 0,
  });

  // Estado visual
  const [producerStates, setProducerStates] = useState<string[]>([]);
  const [consumerStates, setConsumerStates] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const isFirstRender = useRef(true);

  // IDs para items
  const nextItemId = useRef(1);
  const nextProducedValue = useRef(1);

  // Control de simulación
  const producerTimers = useRef<number[]>([]);
  const consumerTimers = useRef<number[]>([]);

  // Auto-scroll de logs solo si el usuario está al fondo
  useEffect(() => {
    // Evitar hacer scroll automático en el primer render de montaje
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Solo auto-scroll si el usuario está en el fondo y hay logs
    if (!isUserScrolling && logsEndRef.current && logs.length > 0) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isUserScrolling]);

  // Detectar si el usuario está en el fondo del contenedor de logs
  const handleLogsScroll = () => {
    if (!logsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10; // Margen de 10px
    
    setIsUserScrolling(!isAtBottom);
  };

  // Inicializar estados de productores/consumidores
  useEffect(() => {
    setProducerStates(Array(numProducers).fill('idle'));
    setConsumerStates(Array(numConsumers).fill('idle'));
  }, [numProducers, numConsumers]);

  // Ajustar semáforos cuando cambia el tamaño del buffer
  useEffect(() => {
    if (!isRunning) {
      // Calcular cuántos espacios vacíos hay realmente
      const actualEmpty = bufferSize - buffer.length;
      setSemEmpty(actualEmpty);
      setSemFull(buffer.length);
    }
  }, [bufferSize, isRunning, buffer.length]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-49), `[${timestamp}] ${message}`]);
  };

  const updateProducerState = (id: number, state: string) => {
    setProducerStates(prev => {
      const newStates = [...prev];
      newStates[id] = state;
      return newStates;
    });
  };

  const updateConsumerState = (id: number, state: string) => {
    setConsumerStates(prev => {
      const newStates = [...prev];
      newStates[id] = state;
      return newStates;
    });
  };

  const producer = async (id: number) => {
    if (!isRunning) return;

    updateProducerState(id, 'waiting_empty');
    addLog(`🔵 Productor ${id + 1}: Esperando espacio vacío (empty=${semEmpty})`);

    // Simular wait en el tiempo
    await new Promise(resolve => setTimeout(resolve, 200));

    // wait(empty)
    if (semEmpty <= 0) {
      addLog(`🔵 Productor ${id + 1}: Buffer lleno, bloqueado`);
      updateProducerState(id, 'blocked');
      return;
    }

    setSemEmpty(prev => prev - 1);
    updateProducerState(id, 'waiting_mutex');
    addLog(`🔵 Productor ${id + 1}: Decrementó empty a ${semEmpty - 1}, esperando mutex`);

    await new Promise(resolve => setTimeout(resolve, 200));

    // wait(mutex)
    if (semMutex <= 0) {
      addLog(`🔵 Productor ${id + 1}: Esperando acceso exclusivo al buffer`);
      updateProducerState(id, 'blocked');
      // En simulación, reintentamos más tarde
      setSemEmpty(prev => prev + 1);
      return;
    }

    setSemMutex(0);
    updateProducerState(id, 'producing');
    
    // Producir item
    const item: BufferItem = {
      id: nextItemId.current++,
      value: nextProducedValue.current++,
      producedBy: id,
    };

    await new Promise(resolve => setTimeout(resolve, 300));

    setBuffer(prev => [...prev, item]);
    addLog(`🔵 Productor ${id + 1}: Produjo item #${item.value} y lo agregó al buffer`);

    setStatistics(prev => ({
      ...prev,
      produced: prev.produced + 1,
      totalProduced: prev.totalProduced + 1,
    }));

    // signal(mutex)
    setSemMutex(1);
    addLog(`🔵 Productor ${id + 1}: Liberó mutex`);

    await new Promise(resolve => setTimeout(resolve, 100));

    // signal(full)
    setSemFull(prev => prev + 1);
    addLog(`🔵 Productor ${id + 1}: Incrementó full a ${semFull + 1}`);

    updateProducerState(id, 'idle');
  };

  const consumer = async (id: number) => {
    if (!isRunning) return;

    updateConsumerState(id, 'waiting_full');
    addLog(`🟢 Consumidor ${id + 1}: Esperando item disponible (full=${semFull})`);

    await new Promise(resolve => setTimeout(resolve, 200));

    // wait(full)
    if (semFull <= 0) {
      addLog(`🟢 Consumidor ${id + 1}: Buffer vacío, bloqueado`);
      updateConsumerState(id, 'blocked');
      return;
    }

    setSemFull(prev => prev - 1);
    updateConsumerState(id, 'waiting_mutex');
    addLog(`🟢 Consumidor ${id + 1}: Decrementó full a ${semFull - 1}, esperando mutex`);

    await new Promise(resolve => setTimeout(resolve, 200));

    // wait(mutex)
    if (semMutex <= 0) {
      addLog(`🟢 Consumidor ${id + 1}: Esperando acceso exclusivo al buffer`);
      updateConsumerState(id, 'blocked');
      setSemFull(prev => prev + 1);
      return;
    }

    setSemMutex(0);
    updateConsumerState(id, 'consuming');

    // Consumir item
    await new Promise(resolve => setTimeout(resolve, 300));

    setBuffer(prev => {
      if (prev.length === 0) return prev;
      const [item, ...rest] = prev;
      addLog(`🟢 Consumidor ${id + 1}: Consumió item #${item.value} (del Productor ${item.producedBy + 1})`);
      
      setStatistics(prevStats => ({
        ...prevStats,
        consumed: prevStats.consumed + 1,
        totalConsumed: prevStats.totalConsumed + 1,
      }));

      return rest;
    });

    // signal(mutex)
    setSemMutex(1);
    addLog(`🟢 Consumidor ${id + 1}: Liberó mutex`);

    await new Promise(resolve => setTimeout(resolve, 100));

    // signal(empty)
    setSemEmpty(prev => prev + 1);
    addLog(`🟢 Consumidor ${id + 1}: Incrementó empty a ${semEmpty + 1}`);

    updateConsumerState(id, 'idle');
  };

  // Ciclo de producción
  useEffect(() => {
    if (!isRunning) return;

    producerTimers.current = [];
    for (let i = 0; i < numProducers; i++) {
      const timer = setInterval(() => {
        producer(i);
      }, productionSpeed);
      producerTimers.current.push(timer);
    }

    return () => {
      producerTimers.current.forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, numProducers, productionSpeed, semEmpty, semMutex]);

  // Ciclo de consumo
  useEffect(() => {
    if (!isRunning) return;

    consumerTimers.current = [];
    for (let i = 0; i < numConsumers; i++) {
      const timer = setInterval(() => {
        consumer(i);
      }, consumptionSpeed);
      consumerTimers.current.push(timer);
    }

    return () => {
      consumerTimers.current.forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, numConsumers, consumptionSpeed, semFull, semMutex]);

  const handleStart = () => {
    setIsRunning(true);
    addLog('▶️ Simulación iniciada');
  };

  const handlePause = () => {
    setIsRunning(false);
    addLog('⏸️ Simulación pausada');
  };

  const handleReset = () => {
    setIsRunning(false);
    setBuffer([]);
    setSemEmpty(bufferSize);
    setSemFull(0);
    setSemMutex(1);
    setStatistics({ produced: 0, consumed: 0, totalProduced: 0, totalConsumed: 0 });
    setProducerStates(Array(numProducers).fill('idle'));
    setConsumerStates(Array(numConsumers).fill('idle'));
    setLogs([]);
    setIsUserScrolling(false);
    nextItemId.current = 1;
    nextProducedValue.current = 1;
    addLog('🔄 Sistema reiniciado');
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'idle': return 'bg-gray-400';
      case 'waiting_empty':
      case 'waiting_full':
      case 'waiting_mutex': return 'bg-yellow-500';
      case 'blocked': return 'bg-red-500';
      case 'producing':
      case 'consuming': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStateText = (state: string) => {
    const stateMap: Record<string, string> = {
      'idle': 'Inactivo',
      'waiting_empty': 'Esperando espacio',
      'waiting_full': 'Esperando item',
      'waiting_mutex': 'Esperando mutex',
      'blocked': 'Bloqueado',
      'producing': 'Produciendo',
      'consuming': 'Consumiendo',
    };
    return stateMap[state] || state;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Play className="size-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Demostración Interactiva</h2>
      </div>

      {/* Controles */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Panel de Configuración */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="size-5 text-purple-400" />
            <h3 className="font-bold text-white">Configuración</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Tamaño del Buffer: {bufferSize}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={bufferSize}
                onChange={(e) => !isRunning && setBufferSize(Number(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Productores: {numProducers}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={numProducers}
                onChange={(e) => !isRunning && setNumProducers(Number(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Consumidores: {numConsumers}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={numConsumers}
                onChange={(e) => !isRunning && setNumConsumers(Number(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Velocidad de Producción: {productionSpeed}ms
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={productionSpeed}
                onChange={(e) => setProductionSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Velocidad de Consumo: {consumptionSpeed}ms
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={consumptionSpeed}
                onChange={(e) => setConsumptionSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Estado de Semáforos */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-bold text-white mb-4">Estado de Semáforos</h3>
          <div className="space-y-3">
            <div className="bg-gray-600 rounded p-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">empty (espacios vacíos)</span>
                <span className="text-2xl font-bold text-blue-400">{semEmpty}</span>
              </div>
              <div className="mt-2 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(semEmpty / bufferSize) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-600 rounded p-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">full (items disponibles)</span>
                <span className="text-2xl font-bold text-green-400">{semFull}</span>
              </div>
              <div className="mt-2 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(semFull / bufferSize) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-600 rounded p-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">mutex (exclusión mutua)</span>
                <span className={`text-2xl font-bold ${semMutex === 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {semMutex === 1 ? '🔓' : '🔒'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Control */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Play className="size-4" />
          Iniciar
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Pause className="size-4" />
          Pausar
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="size-4" />
          Reiniciar
        </button>
      </div>

      {/* Visualización del Buffer */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-white mb-3">Buffer ({buffer.length}/{bufferSize})</h3>
        <div className="flex gap-2 flex-wrap min-h-[80px] items-center">
          {Array.from({ length: bufferSize }).map((_, idx) => (
            <div
              key={idx}
              className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 transition-all ${
                idx < buffer.length
                  ? 'bg-purple-600 border-purple-400 text-white font-bold'
                  : 'bg-gray-800 border-gray-600 text-gray-500'
              }`}
            >
              {idx < buffer.length ? `#${buffer[idx].value}` : '—'}
            </div>
          ))}
        </div>
      </div>

      {/* Estado de Productores y Consumidores */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-bold text-white mb-3">Productores</h3>
          <div className="space-y-2">
            {producerStates.map((state, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`size-3 rounded-full ${getStateColor(state)}`} />
                <span className="text-gray-300">Productor {idx + 1}:</span>
                <span className="text-white font-medium">{getStateText(state)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-bold text-white mb-3">Consumidores</h3>
          <div className="space-y-2">
            {consumerStates.map((state, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`size-3 rounded-full ${getStateColor(state)}`} />
                <span className="text-gray-300">Consumidor {idx + 1}:</span>
                <span className="text-white font-medium">{getStateText(state)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
          <div className="text-blue-400 text-sm mb-1">Items en Buffer</div>
          <div className="text-2xl font-bold text-white">{buffer.length}</div>
        </div>
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
          <div className="text-green-400 text-sm mb-1">Total Producido</div>
          <div className="text-2xl font-bold text-white">{statistics.totalProduced}</div>
        </div>
        <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3">
          <div className="text-orange-400 text-sm mb-1">Total Consumido</div>
          <div className="text-2xl font-bold text-white">{statistics.totalConsumed}</div>
        </div>
        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-3">
          <div className="text-purple-400 text-sm mb-1">En Tránsito</div>
          <div className="text-2xl font-bold text-white">
            {statistics.totalProduced - statistics.totalConsumed}
          </div>
        </div>
      </div>

      {/* Log de Eventos */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="font-bold text-white mb-3">Registro de Eventos</h3>
        <div 
          ref={logsContainerRef}
          onScroll={handleLogsScroll}
          className="bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-xs text-gray-300"
        >
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              Presiona "Iniciar" para comenzar la simulación
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="mb-1">
                {log}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}