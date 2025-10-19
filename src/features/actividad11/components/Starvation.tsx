import { AlertTriangle, BookOpen, Code, Play, RotateCcw, Pause, Plus, Minus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";

interface Process {
  id: number;
  priority: number;
  effectivePriority: number;
  arrivalTime: number;
  tickets: number;
  level: number;
  bypassCount: number;
  virtualTime: number;
  weight: number;
  executionTime: number;
  waitTime: number;
  color: string;
  status: 'waiting' | 'executing' | 'completed';
}

export default function Starvation() {
  // Estados para Aging Demo
  const [agingProcesses, setAgingProcesses] = useState<Process[]>([
    { id: 1, priority: 10, effectivePriority: 10, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-blue-500', status: 'waiting' },
    { id: 2, priority: 50, effectivePriority: 50, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-green-500', status: 'waiting' },
    { id: 3, priority: 80, effectivePriority: 80, arrivalTime: 0, tickets: 2, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-purple-500', status: 'waiting' },
  ]);
  const [agingRunning, setAgingRunning] = useState(false);
  const [agingTime, setAgingTime] = useState(0);
  const [agingSpeed, setAgingSpeed] = useState([500]);
  const [agingLogs, setAgingLogs] = useState<string[]>(['Sistema iniciado. Esperando...']);
  const agingLogRef = useRef<HTMLDivElement>(null);

  // Estados para Fair Scheduling Demo
  const [fairProcesses, setFairProcesses] = useState<Process[]>([
    { id: 1, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-cyan-500', status: 'waiting' },
    { id: 2, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 512, executionTime: 0, waitTime: 0, color: 'bg-pink-500', status: 'waiting' },
  ]);
  const [fairRunning, setFairRunning] = useState(false);
  const [fairTime, setFairTime] = useState(0);
  const [fairSpeed, setFairSpeed] = useState([500]);
  const [fairLogs, setFairLogs] = useState<string[]>(['Sistema Fair Scheduler iniciado.']);
  const fairLogRef = useRef<HTMLDivElement>(null);

  // Estados para Bounded Waiting Demo
  const [boundedProcesses, setBoundedProcesses] = useState<Process[]>([
    { id: 1, priority: 10, effectivePriority: 10, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-red-500', status: 'waiting' },
    { id: 2, priority: 50, effectivePriority: 50, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-yellow-500', status: 'waiting' },
    { id: 3, priority: 80, effectivePriority: 80, arrivalTime: 0, tickets: 2, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-indigo-500', status: 'waiting' },
  ]);
  const [boundedRunning, setBoundedRunning] = useState(false);
  const [boundedTime, setBoundedTime] = useState(0);
  const [boundedSpeed, setBoundedSpeed] = useState([500]);
  const [boundedLogs, setBoundedLogs] = useState<string[]>(['Sistema Bounded Waiting iniciado (MAX_BYPASS=3).']);
  const boundedLogRef = useRef<HTMLDivElement>(null);

  // Estados para Multilevel FIFO Demo
  const [fifoProcesses, setFifoProcesses] = useState<Process[]>([
    { id: 1, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-orange-500', status: 'waiting' },
    { id: 2, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-teal-500', status: 'waiting' },
  ]);
  const [fifoRunning, setFifoRunning] = useState(false);
  const [fifoTime, setFifoTime] = useState(0);
  const [fifoSpeed, setFifoSpeed] = useState([500]);
  const [fifoLogs, setFifoLogs] = useState<string[]>(['Sistema Multilevel FIFO iniciado (4 niveles).']);
  const fifoLogRef = useRef<HTMLDivElement>(null);

  // Estados para Lottery Scheduling Demo
  const [lotteryProcesses, setLotteryProcesses] = useState<Process[]>([
    { id: 1, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-lime-500', status: 'waiting' },
    { id: 2, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-rose-500', status: 'waiting' },
    { id: 3, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 2, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-amber-500', status: 'waiting' },
  ]);
  const [lotteryRunning, setLotteryRunning] = useState(false);
  const [lotteryTime, setLotteryTime] = useState(0);
  const [lotterySpeed, setLotterySpeed] = useState([500]);
  const [lotteryLogs, setLotteryLogs] = useState<string[]>(['Sistema Lottery Scheduling iniciado.']);
  const lotteryLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    if (agingLogRef.current) agingLogRef.current.scrollTop = agingLogRef.current.scrollHeight;
  }, [agingLogs]);

  useEffect(() => {
    if (fairLogRef.current) fairLogRef.current.scrollTop = fairLogRef.current.scrollHeight;
  }, [fairLogs]);

  useEffect(() => {
    if (boundedLogRef.current) boundedLogRef.current.scrollTop = boundedLogRef.current.scrollHeight;
  }, [boundedLogs]);

  useEffect(() => {
    if (fifoLogRef.current) fifoLogRef.current.scrollTop = fifoLogRef.current.scrollHeight;
  }, [fifoLogs]);

  useEffect(() => {
    if (lotteryLogRef.current) lotteryLogRef.current.scrollTop = lotteryLogRef.current.scrollHeight;
  }, [lotteryLogs]);

  // Simulación Aging
  useEffect(() => {
    if (!agingRunning) return;

    const interval = setInterval(() => {
      setAgingTime(prev => prev + agingSpeed[0]);
      
      setAgingProcesses(prev => {
        const updated = prev.map(p => {
          if (p.status === 'completed') return p;
          
          const waitTime = p.status === 'waiting' ? p.waitTime + agingSpeed[0] : p.waitTime;
          const agingFactor = Math.floor(waitTime / 100); // Cada 100ms reduce prioridad
          const effectivePriority = Math.max(0, p.priority - agingFactor);
          
          return { ...p, waitTime, effectivePriority };
        });

        // Seleccionar proceso con menor prioridad efectiva (más urgente)
        const waiting = updated.filter(p => p.status === 'waiting');
        if (waiting.length > 0) {
          const selected = waiting.reduce((min, p) => 
            p.effectivePriority < min.effectivePriority ? p : min
          );

          setAgingLogs(prev => [...prev, 
            `[${agingTime}ms] Aging aplicado. Seleccionado P${selected.id} (prioridad efectiva: ${selected.effectivePriority.toFixed(1)})`
          ]);

          return updated.map(p => ({
            ...p,
            status: p.id === selected.id ? 'executing' : (p.status === 'completed' ? 'completed' : 'waiting'),
            executionTime: p.id === selected.id ? p.executionTime + agingSpeed[0] : p.executionTime,
          })) as Process[];
        }

        return updated;
      });
    }, agingSpeed[0]);

    return () => clearInterval(interval);
  }, [agingRunning, agingSpeed, agingTime]);

  // Simulación Lottery Scheduling
  useEffect(() => {
    if (!lotteryRunning) return;

    const interval = setInterval(() => {
      setLotteryTime(prev => prev + lotterySpeed[0]);
      
      setLotteryProcesses(prev => {
        const waiting = prev.filter(p => p.status !== 'completed');
        if (waiting.length === 0) return prev;

        // Calcular total de tickets
        const totalTickets = waiting.reduce((sum, p) => sum + p.tickets, 0);
        
        // Sorteo aleatorio
        const winningTicket = Math.floor(Math.random() * totalTickets) + 1;
        
        // Encontrar ganador
        let accumulated = 0;
        let winner = waiting[0];
        
        for (const proc of waiting) {
          accumulated += proc.tickets;
          if (winningTicket <= accumulated) {
            winner = proc;
            break;
          }
        }

        setLotteryLogs(prevLogs => [...prevLogs, 
          `🎲 Sorteo: Ticket #${winningTicket}/${totalTickets} → P${winner.id} GANA (${winner.tickets} tickets, ${(winner.tickets/totalTickets*100).toFixed(1)}%)`
        ]);

        // Compensación por starvation (aging en tickets)
        return prev.map(p => {
          const newWaitTime = p.id === winner.id ? 0 : p.waitTime + lotterySpeed[0];
          const bonusTickets = newWaitTime > 2000 ? 1 : 0; // Bonus si espera más de 2s
          
          if (bonusTickets > 0) {
            setLotteryLogs(prevLogs => [...prevLogs, 
              `⭐ P${p.id} recibe +1 ticket por espera prolongada (total: ${p.tickets + bonusTickets})`
            ]);
          }

          return {
            ...p,
            status: p.id === winner.id ? 'executing' : p.status,
            executionTime: p.id === winner.id ? p.executionTime + lotterySpeed[0] : p.executionTime,
            waitTime: newWaitTime,
            tickets: p.id === winner.id ? p.tickets : p.tickets + bonusTickets,
          };
        });
      });

      // Resetear estados después de mostrar ganador
      setTimeout(() => {
        setLotteryProcesses(prev => prev.map(p => ({ ...p, status: p.status === 'completed' ? 'completed' : 'waiting' })));
      }, lotterySpeed[0] / 2);
    }, lotterySpeed[0]);

    return () => clearInterval(interval);
  }, [lotteryRunning, lotterySpeed]);

  // Simulación Fair Scheduling (CFS)
  useEffect(() => {
    if (!fairRunning) return;

    const interval = setInterval(() => {
      setFairTime(prev => prev + fairSpeed[0]);

      setFairProcesses(prev => {
        const waiting = prev.filter(p => p.status !== 'completed');
        if (waiting.length === 0) return prev;

        // Seleccionar proceso con menor virtualTime (Red-Black Tree mínimo)
        const selected = waiting.reduce((min, p) => p.virtualTime < min.virtualTime ? p : min);

        // Calcular CPU share
        const totalWeight = waiting.reduce((sum, p) => sum + p.weight, 0);
        const cpuShare = selected.weight / totalWeight;
        const quantum = Math.max(fairSpeed[0], cpuShare * 100); // Quantum proporcional

        setFairLogs(prevLogs => [...prevLogs,
          `⏰ P${selected.id} ejecuta (vTime: ${selected.virtualTime.toFixed(1)}, CPU: ${(cpuShare*100).toFixed(1)}%, quantum: ${quantum.toFixed(0)}ms)`
        ]);

        return prev.map(p => {
          const isSelected = p.id === selected.id;
          const vTimeIncrement = isSelected ? (fairSpeed[0] * 1024 / p.weight) : 0; // PESO_NORMAL=1024

          return {
            ...p,
            status: isSelected ? 'executing' : p.status,
            virtualTime: p.virtualTime + vTimeIncrement,
            executionTime: isSelected ? p.executionTime + fairSpeed[0] : p.executionTime,
            waitTime: isSelected ? 0 : p.waitTime + fairSpeed[0],
          };
        });
      });

      setTimeout(() => {
        setFairProcesses(prev => prev.map(p => ({ ...p, status: p.status === 'completed' ? 'completed' : 'waiting' })));
      }, fairSpeed[0] / 2);
    }, fairSpeed[0]);

    return () => clearInterval(interval);
  }, [fairRunning, fairSpeed]);

  // Simulación Bounded Waiting
  useEffect(() => {
    if (!boundedRunning) return;

    const interval = setInterval(() => {
      setBoundedTime(prev => prev + boundedSpeed[0]);

      setBoundedProcesses(prev => {
        const waiting = prev.filter(p => p.status !== 'completed');
        if (waiting.length === 0) return prev;

        // Verificar si hay algún proceso con bypassCount >= 3 (FORZAR)
        const starved = waiting.find(p => p.bypassCount >= 3);
        const selected = starved || waiting.reduce((max, p) => p.priority > max.priority ? p : max);

        if (starved) {
          setBoundedLogs(prevLogs => [...prevLogs,
            `⚠️ P${selected.id} FORZADO a ejecutar (bypass: ${selected.bypassCount}/3, prioridad: ${selected.priority})`
          ]);
        } else {
          setBoundedLogs(prevLogs => [...prevLogs,
            `▶️ P${selected.id} ejecuta (prioridad: ${selected.priority})`
          ]);
        }

        return prev.map(p => {
          const isSelected = p.id === selected.id;
          
          return {
            ...p,
            status: isSelected ? 'executing' : p.status,
            bypassCount: isSelected ? 0 : p.bypassCount + 1, // Resetear si ejecuta, incrementar si no
            executionTime: isSelected ? p.executionTime + boundedSpeed[0] : p.executionTime,
            waitTime: isSelected ? 0 : p.waitTime + boundedSpeed[0],
          };
        });
      });

      setTimeout(() => {
        setBoundedProcesses(prev => prev.map(p => ({ ...p, status: p.status === 'completed' ? 'completed' : 'waiting' })));
      }, boundedSpeed[0] / 2);
    }, boundedSpeed[0]);

    return () => clearInterval(interval);
  }, [boundedRunning, boundedSpeed]);

  // Simulación Multilevel FIFO
  useEffect(() => {
    if (!fifoRunning) return;

    const interval = setInterval(() => {
      setFifoTime(prev => prev + fifoSpeed[0]);

      setFifoProcesses(prev => {
        const waiting = prev.filter(p => p.status !== 'completed');
        if (waiting.length === 0) return prev;

        // Seleccionar del nivel más alto con procesos
        let selected = null;
        for (let level = 0; level <= 3; level++) {
          const procsInLevel = waiting.filter(p => p.level === level);
          if (procsInLevel.length > 0) {
            selected = procsInLevel[0]; // FIFO dentro del nivel
            break;
          }
        }

        if (!selected) return prev;

        const quantum = 10 * Math.pow(2, selected.level);

        setFifoLogs(prevLogs => [...prevLogs,
          `📋 P${selected.id} ejecuta en nivel ${selected.level} (quantum: ${quantum}ms)`
        ]);

        return prev.map(p => {
          const isSelected = p.id === selected.id;
          const newWaitTime = isSelected ? 0 : p.waitTime + fifoSpeed[0];
          const newExecutionTime = isSelected ? p.executionTime + fifoSpeed[0] : p.executionTime;

          // Promoción: si espera > 50ms y no está en nivel 0
          let newLevel = p.level;
          if (!isSelected && newWaitTime > 50 && p.level > 0) {
            newLevel = p.level - 1;
            setFifoLogs(prevLogs => [...prevLogs,
              `⬆️ P${p.id} PROMOCIONADO nivel ${p.level} → ${newLevel} (espera: ${newWaitTime}ms)`
            ]);
          }

          // Degradación: si usa quantum completo y no está en nivel 3
          if (isSelected && p.level < 3) {
            newLevel = p.level + 1;
            setFifoLogs(prevLogs => [...prevLogs,
              `⬇️ P${p.id} DEGRADADO nivel ${p.level} → ${newLevel}`
            ]);
          }

          return {
            ...p,
            status: isSelected ? 'executing' : p.status,
            level: newLevel,
            executionTime: newExecutionTime,
            waitTime: newWaitTime,
          };
        });
      });

      setTimeout(() => {
        setFifoProcesses(prev => prev.map(p => ({ ...p, status: p.status === 'completed' ? 'completed' : 'waiting' })));
      }, fifoSpeed[0] / 2);
    }, fifoSpeed[0]);

    return () => clearInterval(interval);
  }, [fifoRunning, fifoSpeed]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl">🍽️</div>
            <div>
              <h1 className="text-4xl font-bold text-white">Starvation</h1>
              <p className="text-gray-400 text-sm mt-1">Inanición / Hambruna</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white text-gray-900 rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="size-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Descripción del Problema</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            La <strong className="text-orange-600">inanición</strong> (starvation) ocurre cuando un proceso o thread espera 
            indefinidamente para acceder a un recurso porque otros procesos con mayor prioridad lo acaparan continuamente. 
            A diferencia del deadlock, el sistema sigue funcionando, pero algunos procesos nunca obtienen los recursos necesarios.
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mt-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2">Causas Comunes de Starvation</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Situaciones típicas que provocan inanición:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li><strong>1. Algoritmos de scheduling injustos:</strong> Procesos de baja prioridad nunca ejecutan</li>
                  <li><strong>2. Políticas LIFO:</strong> Los nuevos procesos se atienden primero</li>
                  <li><strong>3. Asignación preferencial:</strong> Ciertos procesos siempre obtienen los recursos</li>
                  <li><strong>4. Prioridades estáticas:</strong> Sin mecanismo para aumentar prioridad con el tiempo</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>💡 Ejemplo Clásico:</strong> En el problema de los Filósofos Cenando, un filósofo que nunca logra 
              tomar ambos tenedores sufre starvation, mientras los demás siguen comiendo y liberando recursos.
            </p>
          </div>
        </div>
        <Accordion type="multiple" defaultValue={["soluciones", "demostracion"]} className="space-y-4">
          <AccordionItem value="soluciones" className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <AccordionTrigger className="text-xl font-bold text-white hover:no-underline px-6">
              <div className="flex items-center gap-2">
                <Code className="size-5" />
                <span>Soluciones (Pseudocódigo)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="aging" className="w-full">
                <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-gray-900 p-2">
                  <TabsTrigger value="aging">⏰ Aging</TabsTrigger>
                  <TabsTrigger value="fair">⚖️ Fair Scheduling</TabsTrigger>
                  <TabsTrigger value="bounded">🔢 Bounded Waiting</TabsTrigger>
                  <TabsTrigger value="fifo">📋 FIFO con Prioridad</TabsTrigger>
                  <TabsTrigger value="lottery">🎰 Lottery Scheduling</TabsTrigger>
                </TabsList>                <TabsContent value="aging" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">⏰ Aging (Envejecimiento)</h3>
                    <p className="text-gray-300">
                      Aumenta gradualmente la prioridad de los procesos que esperan mucho tiempo. Garantiza que 
                      eventualmente todos los procesos sean atendidos.
                    </p>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm"><code>{`CONSTANTES:
    AGING_INTERVAL = 100
    AGING_FACTOR = 1

ESTRUCTURA Proceso:
    id: entero
    prioridad_base: entero
    prioridad_efectiva: entero
    tiempo_llegada: timestamp
FIN ESTRUCTURA

FUNCIÓN scheduler_con_aging():
    MIENTRAS sistema_activo:
        tiempo_actual = obtener_tiempo()
        
        PARA CADA proceso EN cola_listos:
            tiempo_espera = tiempo_actual - proceso.tiempo_llegada
            incrementos = tiempo_espera / AGING_INTERVAL
            proceso.prioridad_efectiva = proceso.prioridad_base - incrementos * AGING_FACTOR
            
            SI proceso.prioridad_efectiva < 0:
                proceso.prioridad_efectiva = 0
            FIN SI
        FIN PARA
        
        proceso_siguiente = MIN_PRIORIDAD(cola_listos)
        ejecutar(proceso_siguiente)
    FIN MIENTRAS
FIN FUNCIÓN`}</code></pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="fair" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">⚖️ Fair Scheduling (CFS)</h3>
                    <p className="text-gray-300">
                      Reparte el tiempo de CPU equitativamente. Cada proceso mantiene un "tiempo virtual" que representa 
                      cuánto ha ejecutado. Siempre se elige el proceso con menor tiempo virtual.
                    </p>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm"><code>{`CONSTANTES:
    MIN_GRANULARITY = 1
    PESO_NORMAL = 1024

ESTRUCTURA Proceso:
    id: entero
    tiempo_virtual: real
    peso: entero
FIN ESTRUCTURA

GLOBAL arbol_procesos: ArbolRB<Proceso>

FUNCIÓN calcular_tiempo_virtual(tiempo_real, peso):
    RETORNAR tiempo_real * (PESO_NORMAL / peso)
FIN FUNCIÓN

FUNCIÓN fair_scheduler():
    MIENTRAS sistema_activo:
        proceso = arbol_procesos.minimo()
        SI proceso == NULL: CONTINUAR
        
        total_peso = SUMA(p.peso PARA p EN arbol_procesos)
        proporcion = proceso.peso / total_peso
        quantum = MAX(proporcion * PERIODO, MIN_GRANULARITY)
        
        tiempo_ejecutado = ejecutar_por(proceso, quantum)
        incremento_virtual = calcular_tiempo_virtual(tiempo_ejecutado, proceso.peso)
        proceso.tiempo_virtual += incremento_virtual
        
        arbol_procesos.remover(proceso)
        arbol_procesos.insertar(proceso)
    FIN MIENTRAS
FIN FUNCIÓN`}</code></pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bounded" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">🔢 Bounded Waiting (Espera Acotada)</h3>
                    <p className="text-gray-300">
                      Establece un límite máximo de veces que un proceso puede ser omitido. Después de N omisiones,
                      el proceso debe ser atendido obligatoriamente.
                    </p>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm"><code>{`CONSTANTES:
    MAX_BYPASS = 3

ESTRUCTURA Proceso:
    id: entero
    bypass_count: entero
    timestamp_llegada: timestamp
FIN ESTRUCTURA

FUNCIÓN asignar_recurso_con_bounded_waiting():
    proceso_seleccionado = NULL
    
    PARA CADA proceso EN cola_espera:
        SI proceso.bypass_count >= MAX_BYPASS:
            proceso_seleccionado = proceso
            ROMPER
        FIN SI
    FIN PARA
    
    SI proceso_seleccionado == NULL:
        proceso_seleccionado = SELECCIONAR_POR_PRIORIDAD(cola_espera)
    FIN SI
    
    PARA CADA p EN cola_espera:
        SI p != proceso_seleccionado:
            p.bypass_count++
        SINO:
            p.bypass_count = 0
        FIN SI
    FIN PARA
    
    asignar_recurso_a(proceso_seleccionado)
    remover_de_cola(proceso_seleccionado)
FIN FUNCIÓN`}</code></pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="fifo" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">📋 FIFO con Prioridad (Multilevel Feedback Queue)</h3>
                    <p className="text-gray-300">
                      Múltiples colas FIFO con diferentes prioridades. Los procesos pueden ser promovidos o demotados 
                      entre niveles según su comportamiento y tiempo de espera.
                    </p>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm"><code>{`CONSTANTES:
    NUM_NIVELES = 4
    QUANTUM_BASE = 10
    PROMOTE_THRESHOLD = 50

GLOBAL colas[NUM_NIVELES]: ColaProcesos

FUNCIÓN multilevel_scheduler():
    MIENTRAS sistema_activo:
        proceso = NULL
        
        PARA nivel DESDE 0 HASTA NUM_NIVELES-1:
            SI NO colas[nivel].esta_vacia():
                proceso = colas[nivel].desencolar()
                ROMPER
            FIN SI
        FIN PARA
        
        SI proceso == NULL: CONTINUAR
        
        quantum = QUANTUM_BASE * (2 ** proceso.nivel)
        tiempo_espera = tiempo_actual() - proceso.tiempo_llegada
        
        SI tiempo_espera > PROMOTE_THRESHOLD Y proceso.nivel > 0:
            proceso.nivel--
        FIN SI
        
        tiempo_usado = ejecutar_por(proceso, quantum)
        
        SI tiempo_usado >= quantum Y proceso.nivel < NUM_NIVELES-1:
            proceso.nivel++
        FIN SI
        
        colas[proceso.nivel].encolar(proceso)
    FIN MIENTRAS
FIN FUNCIÓN`}</code></pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="lottery" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">🎰 Lottery Scheduling</h3>
                    <p className="text-gray-300">
                      Sorteo aleatorio de tickets. Cada proceso tiene tickets, y el ganador del sorteo obtiene CPU. 
                      Todos los procesos tienen probabilidad mayor que 0 de ser elegidos, evitando starvation.
                    </p>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm"><code>{`ESTRUCTURA Proceso:
    id: entero
    tickets: entero

FUNCIÓN lottery_scheduler():
    MIENTRAS sistema_activo:
        total_tickets = 0
        
        PARA CADA proceso EN procesos_listos:
            total_tickets += proceso.tickets
        FIN PARA
        
        SI total_tickets == 0: CONTINUAR
        
        ticket_ganador = RANDOM(1, total_tickets)
        suma_acumulada = 0
        
        PARA CADA proceso EN procesos_listos:
            suma_acumulada += proceso.tickets
            
            SI ticket_ganador <= suma_acumulada:
                ejecutar(proceso)
                ROMPER
            FIN SI
        FIN PARA
    FIN MIENTRAS
FIN FUNCIÓN

FUNCIÓN compensar_starvation():
    PARA CADA proceso EN procesos_listos:
        SI proceso.tiempo_espera > UMBRAL:
            proceso.tickets += BONUS_TICKETS
        FIN SI
    FIN PARA
FIN FUNCIÓN`}</code></pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="demostracion" className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <AccordionTrigger className="text-xl font-bold text-white hover:no-underline px-6">
              <div className="flex items-center gap-2">
                <Play className="size-5" />
                <span>Demostración Interactiva</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="demo-aging" className="w-full">
                <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-gray-900 p-2">
                  <TabsTrigger value="demo-aging">⏰ Aging</TabsTrigger>
                  <TabsTrigger value="demo-fair">⚖️ Fair</TabsTrigger>
                  <TabsTrigger value="demo-bounded">🔢 Bounded</TabsTrigger>
                  <TabsTrigger value="demo-fifo">📋 FIFO</TabsTrigger>
                  <TabsTrigger value="demo-lottery">🎰 Lottery</TabsTrigger>
                </TabsList>

                {/* Demo 1: Aging */}
                <TabsContent value="demo-aging" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Aging (Envejecimiento)</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setAgingRunning(!agingRunning)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {agingRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {agingRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={() => {
                            setAgingRunning(false);
                            setAgingTime(0);
                            setAgingProcesses([
                              { id: 1, priority: 10, effectivePriority: 10, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-blue-500', status: 'waiting' },
                              { id: 2, priority: 50, effectivePriority: 50, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-green-500', status: 'waiting' },
                              { id: 3, priority: 80, effectivePriority: 80, arrivalTime: 0, tickets: 2, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-purple-500', status: 'waiting' },
                            ]);
                            setAgingLogs(['Sistema reiniciado.']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={agingSpeed}
                            onValueChange={setAgingSpeed}
                            min={100}
                            max={1000}
                            step={100}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{agingSpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">Tiempo: {agingTime}ms</div>
                      </div>
                    </div>

                    {/* Visualización de Procesos */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Estados de Procesos</h4>
                      <div className="space-y-3">
                        {agingProcesses.map(proc => (
                          <div key={proc.id} className="bg-gray-800 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded ${proc.color}`}></div>
                                <span className="font-bold">Proceso {proc.id}</span>
                                {proc.status === 'executing' && <span className="text-xs bg-green-600 px-2 py-1 rounded">EJECUTANDO</span>}
                                {proc.status === 'waiting' && <span className="text-xs bg-yellow-600 px-2 py-1 rounded">ESPERANDO</span>}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Prioridad Base:</span>
                                <span className="ml-2 text-white font-mono">{proc.priority}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Prioridad Efectiva:</span>
                                <span className="ml-2 text-green-400 font-mono font-bold">{proc.effectivePriority.toFixed(1)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Tiempo Espera:</span>
                                <span className="ml-2 text-orange-400 font-mono">{proc.waitTime}ms</span>
                              </div>
                            </div>
                            {/* Barra de prioridad */}
                            <div className="mt-3">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${proc.color}`}
                                  style={{ width: `${Math.max(0, 100 - proc.effectivePriority)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Registro de Eventos</h4>
                      <div 
                        ref={agingLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {agingLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Fair Scheduling */}
                <TabsContent value="demo-fair" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Fair Scheduling (CFS) ⚖️</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setFairRunning(!fairRunning)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {fairRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {fairRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={() => {
                            setFairRunning(false);
                            setFairTime(0);
                            setFairProcesses([
                              { id: 1, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-cyan-500', status: 'waiting' },
                              { id: 2, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 512, executionTime: 0, waitTime: 0, color: 'bg-pink-500', status: 'waiting' },
                            ]);
                            setFairLogs(['Sistema Fair Scheduler reiniciado.']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <button
                          onClick={() => {
                            const weights = [2048, 1024, 512, 256];
                            const newProc: Process = {
                              id: fairProcesses.length + 1,
                              priority: 0,
                              effectivePriority: 0,
                              arrivalTime: fairTime,
                              tickets: 0,
                              level: 0,
                              bypassCount: 0,
                              virtualTime: 0,
                              weight: weights[fairProcesses.length % weights.length],
                              executionTime: 0,
                              waitTime: 0,
                              color: `bg-${['violet', 'emerald', 'fuchsia', 'amber'][fairProcesses.length % 4]}-500`,
                              status: 'waiting' as const,
                            };
                            setFairProcesses([...fairProcesses, newProc]);
                            setFairLogs(prev => [...prev, `P${newProc.id} añadido con peso ${newProc.weight}`]);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          <Plus className="size-4" />
                          Añadir Proceso
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={fairSpeed}
                            onValueChange={setFairSpeed}
                            min={100}
                            max={1000}
                            step={100}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{fairSpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">Tiempo: {fairTime}ms</div>
                      </div>
                    </div>

                    {/* Visualización de Procesos */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Tiempo Virtual (Red-Black Tree) 🌳</h4>
                      <div className="space-y-3">
                        {fairProcesses
                          .slice()
                          .sort((a, b) => a.virtualTime - b.virtualTime)
                          .map((proc, index) => {
                            const totalWeight = fairProcesses.reduce((sum, p) => sum + p.weight, 0);
                            const cpuShare = (proc.weight / totalWeight * 100).toFixed(1);
                            
                            return (
                              <div key={proc.id} className="bg-gray-800 rounded p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded ${proc.color}`}></div>
                                    {index === 0 && <span className="text-xs bg-green-600 px-2 py-1 rounded">⬅️ MÍNIMO</span>}
                                    <span className="font-bold">Proceso {proc.id}</span>
                                    {proc.status === 'executing' && <span className="text-xs bg-blue-600 px-2 py-1 rounded">EJECUTANDO</span>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setFairProcesses(fairProcesses.map(p =>
                                          p.id === proc.id ? { ...p, weight: Math.max(256, p.weight / 2) } : p
                                        ));
                                      }}
                                      className="p-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                                    >
                                      <Minus className="size-3" />
                                    </button>
                                    <span className="text-xs text-gray-400">Peso: {proc.weight}</span>
                                    <button
                                      onClick={() => {
                                        setFairProcesses(fairProcesses.map(p =>
                                          p.id === proc.id ? { ...p, weight: Math.min(4096, p.weight * 2) } : p
                                        ));
                                      }}
                                      className="p-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                                    >
                                      <Plus className="size-3" />
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                                  <div>
                                    <span className="text-gray-400">Tiempo Virtual:</span>
                                    <span className="ml-2 text-cyan-400 font-mono font-bold">{proc.virtualTime.toFixed(1)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">CPU Share:</span>
                                    <span className="ml-2 text-green-400 font-mono">{cpuShare}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Ejecutado:</span>
                                    <span className="ml-2 text-white font-mono">{proc.executionTime}ms</span>
                                  </div>
                                </div>
                                {/* Barra de tiempo virtual */}
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${proc.color}`}
                                    style={{ width: `${Math.min(100, (proc.virtualTime / 10) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Eventos del Scheduler</h4>
                      <div 
                        ref={fairLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {fairLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Bounded Waiting */}
                <TabsContent value="demo-bounded" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Bounded Waiting 🔢</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setBoundedRunning(!boundedRunning)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {boundedRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {boundedRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={() => {
                            setBoundedRunning(false);
                            setBoundedTime(0);
                            setBoundedProcesses([
                              { id: 1, priority: 10, effectivePriority: 10, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-red-500', status: 'waiting' },
                              { id: 2, priority: 50, effectivePriority: 50, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-yellow-500', status: 'waiting' },
                              { id: 3, priority: 80, effectivePriority: 80, arrivalTime: 0, tickets: 2, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-indigo-500', status: 'waiting' },
                            ]);
                            setBoundedLogs(['Sistema Bounded Waiting reiniciado (MAX_BYPASS=3).']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={boundedSpeed}
                            onValueChange={setBoundedSpeed}
                            min={100}
                            max={1000}
                            step={100}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{boundedSpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">Ciclos: {Math.floor(boundedTime / (boundedSpeed[0] || 500))}</div>
                      </div>
                    </div>

                    {/* Visualización de Procesos */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Bypass Counter (MAX = 3) �</h4>
                      <div className="space-y-3">
                        {boundedProcesses.map(proc => (
                          <div key={proc.id} className="bg-gray-800 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded ${proc.color}`}></div>
                                <span className="font-bold">Proceso {proc.id}</span>
                                {proc.status === 'executing' && <span className="text-xs bg-green-600 px-2 py-1 rounded">✅ EJECUTANDO</span>}
                                {proc.bypassCount >= 3 && <span className="text-xs bg-red-600 px-2 py-1 rounded animate-pulse">⚠️ FORZAR</span>}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-400">Prioridad:</span>
                                <span className="ml-2 text-white font-mono">{proc.priority}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Bypass Count:</span>
                                <span className={`ml-2 font-mono font-bold ${proc.bypassCount >= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                                  {proc.bypassCount}/3
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">Ejecutado:</span>
                                <span className="ml-2 text-green-400 font-mono">{proc.executionTime}ms</span>
                              </div>
                            </div>
                            {/* Barra de bypass visual */}
                            <div className="flex gap-1">
                              {[0, 1, 2].map(i => (
                                <div 
                                  key={i}
                                  className={`flex-1 h-3 rounded ${
                                    i < proc.bypassCount 
                                      ? (proc.bypassCount >= 3 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500')
                                      : 'bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Registro de Asignación de Recursos</h4>
                      <div 
                        ref={boundedLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {boundedLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Multilevel FIFO */}
                <TabsContent value="demo-fifo" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Multilevel FIFO con Prioridad 📋</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setFifoRunning(!fifoRunning)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {fifoRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {fifoRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={() => {
                            setFifoRunning(false);
                            setFifoTime(0);
                            setFifoProcesses([
                              { id: 1, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-orange-500', status: 'waiting' },
                              { id: 2, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-teal-500', status: 'waiting' },
                            ]);
                            setFifoLogs(['Sistema Multilevel FIFO reiniciado (4 niveles).']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <button
                          onClick={() => {
                            const newProc: Process = {
                              id: fifoProcesses.length + 1,
                              priority: 0,
                              effectivePriority: 0,
                              arrivalTime: fifoTime,
                              tickets: 0,
                              level: 0,
                              bypassCount: 0,
                              virtualTime: 0,
                              weight: 1024,
                              executionTime: 0,
                              waitTime: 0,
                              color: `bg-${['sky', 'rose', 'lime', 'purple'][fifoProcesses.length % 4]}-500`,
                              status: 'waiting' as const,
                            };
                            setFifoProcesses([...fifoProcesses, newProc]);
                            setFifoLogs(prev => [...prev, `P${newProc.id} añadido en nivel 0`]);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          <Plus className="size-4" />
                          Añadir Proceso
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={fifoSpeed}
                            onValueChange={setFifoSpeed}
                            min={100}
                            max={1000}
                            step={100}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{fifoSpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">Tiempo: {fifoTime}ms</div>
                      </div>
                    </div>

                    {/* Visualización de Colas por Nivel */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Colas por Nivel de Prioridad 🎚️</h4>
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {[0, 1, 2, 3].map(level => {
                          const procsInLevel = fifoProcesses.filter(p => p.level === level);
                          const quantum = 10 * Math.pow(2, level);
                          
                          return (
                            <div key={level} className={`border-2 rounded-lg p-3 ${
                              level === 0 ? 'border-green-500' :
                              level === 1 ? 'border-blue-500' :
                              level === 2 ? 'border-yellow-500' :
                              'border-red-500'
                            }`}>
                              <div className="text-center mb-2">
                                <div className="text-xs text-gray-400">Nivel {level}</div>
                                <div className="text-lg font-bold">Q={quantum}ms</div>
                                <div className="text-xs text-gray-400">{procsInLevel.length} procesos</div>
                              </div>
                              <div className="space-y-1">
                                {procsInLevel.map(p => (
                                  <div key={p.id} className={`${p.color} rounded px-2 py-1 text-xs text-center font-bold`}>
                                    P{p.id}
                                    {p.status === 'executing' && ' ▶'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detalles de procesos */}
                      <div className="space-y-2 mt-4">
                        {fifoProcesses.map(proc => (
                          <div key={proc.id} className="bg-gray-800 rounded p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded ${proc.color}`}></div>
                              <span className="font-bold">P{proc.id}</span>
                              {proc.status === 'executing' && <span className="text-xs bg-green-600 px-2 py-1 rounded">▶ EJECUTANDO</span>}
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div>
                                <span className="text-gray-400">Nivel:</span>
                                <span className="ml-2 text-white font-mono font-bold">{proc.level}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Espera:</span>
                                <span className="ml-2 text-yellow-400 font-mono">{proc.waitTime}ms</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Ejecutado:</span>
                                <span className="ml-2 text-green-400 font-mono">{proc.executionTime}ms</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Eventos de Promoción/Degradación</h4>
                      <div 
                        ref={fifoLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {fifoLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="demo-lottery" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Lottery Scheduling 🎰</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setLotteryRunning(!lotteryRunning)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {lotteryRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {lotteryRunning ? 'Pausar' : 'Iniciar Sorteo'}
                        </button>
                        <button
                          onClick={() => {
                            setLotteryRunning(false);
                            setLotteryTime(0);
                            setLotteryProcesses([
                              { id: 1, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 10, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-lime-500', status: 'waiting' },
                              { id: 2, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 5, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-rose-500', status: 'waiting' },
                              { id: 3, priority: 0, effectivePriority: 0, arrivalTime: 0, tickets: 2, level: 0, bypassCount: 0, virtualTime: 0, weight: 1024, executionTime: 0, waitTime: 0, color: 'bg-amber-500', status: 'waiting' },
                            ]);
                            setLotteryLogs(['Sistema Lottery reiniciado. Total: 17 tickets']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <button
                          onClick={() => {
                            const newProc: Process = {
                              id: lotteryProcesses.length + 1,
                              priority: 0,
                              effectivePriority: 0,
                              arrivalTime: lotteryTime,
                              tickets: 3,
                              level: 0,
                              bypassCount: 0,
                              virtualTime: 0,
                              weight: 1024,
                              executionTime: 0,
                              waitTime: 0,
                              color: `bg-${['violet', 'fuchsia', 'sky', 'emerald'][lotteryProcesses.length % 4]}-500`,
                              status: 'waiting' as const,
                            };
                            setLotteryProcesses([...lotteryProcesses, newProc]);
                            setLotteryLogs(prev => [...prev, `Proceso ${newProc.id} añadido con 3 tickets`]);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          <Plus className="size-4" />
                          Añadir Proceso
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={lotterySpeed}
                            onValueChange={setLotterySpeed}
                            min={100}
                            max={1000}
                            step={100}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{lotterySpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">
                          Sorteos: {Math.floor(lotteryTime / (lotterySpeed[0] || 500))}
                        </div>
                      </div>
                    </div>

                    {/* Visualización de Tickets */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Distribución de Tickets 🎫</h4>
                      <div className="space-y-3">
                        {lotteryProcesses.map(proc => {
                          const totalTickets = lotteryProcesses.reduce((sum, p) => sum + p.tickets, 0);
                          const probability = (proc.tickets / totalTickets * 100).toFixed(1);
                          
                          return (
                            <div key={proc.id} className="bg-gray-800 rounded p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded ${proc.color}`}></div>
                                  <span className="font-bold">Proceso {proc.id}</span>
                                  {proc.status === 'executing' && <span className="text-xs bg-green-600 px-2 py-1 rounded">🎉 GANADOR</span>}
                                </div>
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => {
                                      setLotteryProcesses(lotteryProcesses.map(p =>
                                        p.id === proc.id ? { ...p, tickets: Math.max(1, p.tickets - 1) } : p
                                      ));
                                    }}
                                    className="p-1 bg-red-600 hover:bg-red-700 rounded"
                                  >
                                    <Minus className="size-3" />
                                  </button>
                                  <span className="font-mono text-lg font-bold text-yellow-400">{proc.tickets} 🎫</span>
                                  <button
                                    onClick={() => {
                                      setLotteryProcesses(lotteryProcesses.map(p =>
                                        p.id === proc.id ? { ...p, tickets: p.tickets + 1 } : p
                                      ));
                                    }}
                                    className="p-1 bg-green-600 hover:bg-green-700 rounded"
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm text-gray-400">Probabilidad:</span>
                                <span className="text-cyan-400 font-mono font-bold">{probability}%</span>
                                <span className="text-sm text-gray-400 ml-auto">Ejecutado: {proc.executionTime}ms</span>
                              </div>
                              {/* Barra de probabilidad */}
                              <div className="w-full bg-gray-700 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full ${proc.color} transition-all duration-300`}
                                  style={{ width: `${probability}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 text-center text-sm text-gray-400">
                        Total de tickets en circulación: <span className="text-white font-bold">
                          {lotteryProcesses.reduce((sum, p) => sum + p.tickets, 0)}
                        </span>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Historial de Sorteos 🎲</h4>
                      <div 
                        ref={lotteryLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {lotteryLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
