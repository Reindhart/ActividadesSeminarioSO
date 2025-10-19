import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Code, Play, Pause, RotateCcw, TrendingDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface LogEntry {
  id: number;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: number;
}

export default function ThunderingHerd() {
  // Estados para Demo 1: Despertar Selectivo
  const [selectiveRunning, setSelectiveRunning] = useState(false);
  const [selectiveSpeed, setSelectiveSpeed] = useState(1000);
  const [selectiveWaitQueue, setSelectiveWaitQueue] = useState<number[]>([]);
  const [selectiveWorkQueue, setSelectiveWorkQueue] = useState(5);
  const [selectiveWorking, setSelectiveWorking] = useState<number | null>(null);
  const [selectiveLog, setSelectiveLog] = useState<LogEntry[]>([]);
  
  // Estados para Demo 2: Epoll/Kqueue
  const [epollRunning, setEpollRunning] = useState(false);
  const [epollSpeed, setEpollSpeed] = useState(1000);
  const [epollMode, setEpollMode] = useState<"normal" | "exclusive">("normal");
  const [epollWaitingThreads, setEpollWaitingThreads] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [epollAwakenedThreads, setEpollAwakenedThreads] = useState<number[]>([]);
  const [epollEvents, setEpollEvents] = useState(0);
  const [epollLog, setEpollLog] = useState<LogEntry[]>([]);
  
  // Estados para Demo 3: Work Stealing
  const [wsRunning, setWsRunning] = useState(false);
  const [wsSpeed, setWsSpeed] = useState(1000);
  const [wsQueues, setWsQueues] = useState<number[][]>([[3, 2, 1], [5, 4], [], [8, 7, 6]]);
  const [wsActiveThreads, setWsActiveThreads] = useState<number[]>([]);
  const [wsStealingFrom, setWsStealingFrom] = useState<{from: number, to: number} | null>(null);
  const [wsLog, setWsLog] = useState<LogEntry[]>([]);
  
  // Estados para Demo 4: Semáforos con Contadores
  const [semRunning, setSemRunning] = useState(false);
  const [semSpeed, setSemSpeed] = useState(1000);
  const [semCounter, setSemCounter] = useState(3);
  const [semMaxCounter] = useState(3);
  const [semWaitingThreads, setSemWaitingThreads] = useState<number[]>([4, 5, 6, 7, 8]);
  const [semActiveThreads, setSemActiveThreads] = useState<number[]>([1, 2, 3]);
  const [semLog, setSemLog] = useState<LogEntry[]>([]);
  
  // Estados para Demo 5: Connection Pooling
  const [poolRunning, setPoolRunning] = useState(false);
  const [poolSpeed, setPoolSpeed] = useState(1000);
  const [poolConnections, setPoolConnections] = useState<Array<{ id: number; inUse: boolean; thread: number | null; health: number }>>([
    { id: 1, inUse: false, thread: null, health: 100 },
    { id: 2, inUse: false, thread: null, health: 100 },
    { id: 3, inUse: false, thread: null, health: 100 },
    { id: 4, inUse: false, thread: null, health: 100 },
    { id: 5, inUse: false, thread: null, health: 100 },
  ]);
  const [poolWaitingThreads, setPoolWaitingThreads] = useState<number[]>([]);
  const [poolRequests, setPoolRequests] = useState(0);
  const [poolLog, setPoolLog] = useState<LogEntry[]>([]);

  // Refs para auto-scroll de logs
  const selectiveLogRef = useRef<HTMLDivElement>(null);
  const epollLogRef = useRef<HTMLDivElement>(null);
  const wsLogRef = useRef<HTMLDivElement>(null);
  const semLogRef = useRef<HTMLDivElement>(null);
  const poolLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    if (selectiveLogRef.current) {
      selectiveLogRef.current.scrollTop = selectiveLogRef.current.scrollHeight;
    }
  }, [selectiveLog]);

  useEffect(() => {
    if (epollLogRef.current) {
      epollLogRef.current.scrollTop = epollLogRef.current.scrollHeight;
    }
  }, [epollLog]);

  useEffect(() => {
    if (wsLogRef.current) {
      wsLogRef.current.scrollTop = wsLogRef.current.scrollHeight;
    }
  }, [wsLog]);

  useEffect(() => {
    if (semLogRef.current) {
      semLogRef.current.scrollTop = semLogRef.current.scrollHeight;
    }
  }, [semLog]);

  useEffect(() => {
    if (poolLogRef.current) {
      poolLogRef.current.scrollTop = poolLogRef.current.scrollHeight;
    }
  }, [poolLog]);

  // Simulación Demo 1: Despertar Selectivo
  useEffect(() => {
    if (!selectiveRunning) return;

    const interval = setInterval(() => {
      setSelectiveLog(prev => {
        const newLog = [...prev];
        
        // Fase 1: Generar nuevo trabajo
        if (Math.random() > 0.3) {
          setSelectiveWorkQueue(wq => {
            const newWork = wq + 1;
            newLog.push({
              id: Date.now(),
              message: `📦 Nuevo trabajo en cola (total: ${newWork})`,
              type: "info",
              timestamp: Date.now()
            });
            return newWork;
          });
        }

        // Fase 2: Si hay trabajo y threads esperando, despertar selectivamente UNO
        if (selectiveWorkQueue > 0 && selectiveWaitQueue.length > 0 && !selectiveWorking) {
          setSelectiveWaitQueue(wq => {
            if (wq.length === 0) return wq;
            const awakened = wq[0];
            const remaining = wq.slice(1);
            
            setSelectiveWorking(awakened);
            
            newLog.push({
              id: Date.now() + 1,
              message: `🎯 Despertar selectivo: Thread ${awakened} (${wq.length - 1} siguen dormidos)`,
              type: "success",
              timestamp: Date.now()
            });
            
            return remaining;
          });
        }

        // Fase 3: Thread trabaja y termina
        if (selectiveWorking !== null && Math.random() > 0.4) {
          setSelectiveWorkQueue(wq => Math.max(0, wq - 1));
          
          newLog.push({
            id: Date.now() + 2,
            message: `✅ Thread ${selectiveWorking} completó trabajo`,
            type: "success",
            timestamp: Date.now()
          });
          
          const finishedThread = selectiveWorking;
          setSelectiveWorking(null);
          
          // Thread vuelve a la cola de espera
          setSelectiveWaitQueue(wq => [...wq, finishedThread]);
        }

        // Fase 4: Agregar threads aleatorios a la cola de espera
        if (selectiveWaitQueue.length < 8 && Math.random() > 0.7) {
          const newThread = Math.floor(Math.random() * 100) + 1;
          setSelectiveWaitQueue(wq => [...wq, newThread]);
          newLog.push({
            id: Date.now() + 3,
            message: `😴 Thread ${newThread} se añadió a la cola de espera`,
            type: "info",
            timestamp: Date.now()
          });
        }

        return newLog.slice(-15);
      });
    }, selectiveSpeed);

    return () => clearInterval(interval);
  }, [selectiveRunning, selectiveSpeed, selectiveWorkQueue, selectiveWaitQueue, selectiveWorking]);

  // Simulación Demo 2: Epoll/Kqueue
  useEffect(() => {
    if (!epollRunning) return;

    const interval = setInterval(() => {
      setEpollLog(prev => {
        const newLog = [...prev];
        
        // Generar nuevo evento de conexión
        setEpollEvents(e => e + 1);
        const eventNum = epollEvents + 1;
        
        newLog.push({
          id: Date.now(),
          message: `🔔 Evento ${eventNum}: Nueva conexión entrante`,
          type: "info",
          timestamp: Date.now()
        });

        if (epollMode === "normal") {
          // THUNDERING HERD: Despertar TODOS los threads
          const allThreads = [...epollWaitingThreads];
          setEpollAwakenedThreads(allThreads);
          
          newLog.push({
            id: Date.now() + 1,
            message: `⚠️ Modo NORMAL: Despertados ${allThreads.length} threads`,
            type: "warning",
            timestamp: Date.now()
          });
          
          // Solo uno puede aceptar
          setTimeout(() => {
            if (allThreads.length > 0) {
              const winner = allThreads[0];
              newLog.push({
                id: Date.now() + 2,
                message: `✅ Thread ${winner} aceptó conexión`,
                type: "success",
                timestamp: Date.now()
              });
              
              // Los demás vuelven a dormir (desperdicio)
              const losers = allThreads.slice(1);
              if (losers.length > 0) {
                newLog.push({
                  id: Date.now() + 3,
                  message: `💤 ${losers.length} threads volvieron a dormir (context switches desperdiciados)`,
                  type: "error",
                  timestamp: Date.now()
                });
              }
              
              setEpollAwakenedThreads([]);
              setEpollLog(newLog.slice(-15));
            }
          }, 500);
        } else {
          // EPOLLEXCLUSIVE: Despertar solo UNO
          if (epollWaitingThreads.length > 0) {
            const selectedThread = epollWaitingThreads[0];
            setEpollAwakenedThreads([selectedThread]);
            
            newLog.push({
              id: Date.now() + 1,
              message: `🎯 Modo EXCLUSIVE: Solo Thread ${selectedThread} despertado`,
              type: "success",
              timestamp: Date.now()
            });
            
            setTimeout(() => {
              newLog.push({
                id: Date.now() + 2,
                message: `✅ Thread ${selectedThread} procesó conexión eficientemente`,
                type: "success",
                timestamp: Date.now()
              });
              
              setEpollAwakenedThreads([]);
              setEpollLog(newLog.slice(-15));
            }, 500);
          }
        }

        return newLog.slice(-15);
      });
    }, epollSpeed);

    return () => clearInterval(interval);
  }, [epollRunning, epollSpeed, epollMode, epollWaitingThreads, epollEvents]);

  // Simulación Demo 3: Work Stealing
  useEffect(() => {
    if (!wsRunning) return;

    const interval = setInterval(() => {
      setWsLog(prev => {
        const newLog = [...prev];
        
        // Buscar threads con trabajo y sin trabajo
        const busyThreads: number[] = [];
        const idleThreads: number[] = [];
        
        wsQueues.forEach((queue, idx) => {
          if (queue.length > 0) {
            busyThreads.push(idx);
          } else {
            idleThreads.push(idx);
          }
        });

        // Si hay threads idle y threads con trabajo, robar
        if (idleThreads.length > 0 && busyThreads.length > 0) {
          const thief = idleThreads[0];
          const victim = busyThreads[Math.floor(Math.random() * busyThreads.length)];
          
          setWsQueues(queues => {
            const newQueues = queues.map(q => [...q]);
            
            if (newQueues[victim].length > 0) {
              // Robar tarea más antigua (del principio)
              const stolenTask = newQueues[victim].shift()!;
              newQueues[thief].push(stolenTask);
              
              setWsStealingFrom({ from: victim, to: thief });
              
              newLog.push({
                id: Date.now(),
                message: `🔄 Thread ${thief} robó tarea ${stolenTask} de Thread ${victim}`,
                type: "info",
                timestamp: Date.now()
              });
              
              setTimeout(() => setWsStealingFrom(null), 500);
            }
            
            return newQueues;
          });
        }

        // Procesar tareas de threads activos
        setWsQueues(queues => {
          const newQueues = queues.map((queue, idx) => {
            if (queue.length > 0 && Math.random() > 0.4) {
              const task = queue[queue.length - 1]; // LIFO local
              const newQueue = queue.slice(0, -1);
              
              setWsActiveThreads(active => {
                if (!active.includes(idx)) {
                  return [...active, idx];
                }
                return active;
              });
              
              newLog.push({
                id: Date.now() + idx,
                message: `⚙️ Thread ${idx} procesando tarea ${task}`,
                type: "success",
                timestamp: Date.now()
              });
              
              setTimeout(() => {
                setWsActiveThreads(active => active.filter(t => t !== idx));
              }, 300);
              
              return newQueue;
            }
            return queue;
          });
          
          return newQueues;
        });

        // Agregar nuevas tareas aleatoriamente
        if (Math.random() > 0.6) {
          const targetThread = Math.floor(Math.random() * wsQueues.length);
          const newTask = Math.floor(Math.random() * 100) + 10;
          
          setWsQueues(queues => {
            const newQueues = queues.map((q, idx) => 
              idx === targetThread ? [...q, newTask] : q
            );
            return newQueues;
          });
          
          newLog.push({
            id: Date.now() + 100,
            message: `📦 Nueva tarea ${newTask} asignada a Thread ${targetThread}`,
            type: "info",
            timestamp: Date.now()
          });
        }

        return newLog.slice(-15);
      });
    }, wsSpeed);

    return () => clearInterval(interval);
  }, [wsRunning, wsSpeed, wsQueues]);

  // Simulación Demo 4: Semáforos con Contadores
  useEffect(() => {
    if (!semRunning) return;

    const interval = setInterval(() => {
      setSemLog(prev => {
        const newLog = [...prev];
        
        // Fase 1: Si hay counter disponible y threads esperando, permitir acceso
        if (semCounter > 0 && semWaitingThreads.length > 0) {
          setSemWaitingThreads(waiting => {
            if (waiting.length === 0) return waiting;
            
            const thread = waiting[0];
            const remaining = waiting.slice(1);
            
            setSemCounter(c => c - 1);
            setSemActiveThreads(active => [...active, thread]);
            
            newLog.push({
              id: Date.now(),
              message: `🔢 wait(): Thread ${thread} adquirió semáforo (contador: ${semCounter - 1})`,
              type: "success",
              timestamp: Date.now()
            });
            
            return remaining;
          });
        }

        // Fase 2: Threads activos terminan y liberan
        if (semActiveThreads.length > 0 && Math.random() > 0.5) {
          const threadToRelease = semActiveThreads[Math.floor(Math.random() * semActiveThreads.length)];
          
          setSemActiveThreads(active => active.filter(t => t !== threadToRelease));
          setSemCounter(c => Math.min(c + 1, semMaxCounter));
          
          newLog.push({
            id: Date.now() + 1,
            message: `🔓 signal(): Thread ${threadToRelease} liberó semáforo (contador: ${semCounter + 1})`,
            type: "info",
            timestamp: Date.now()
          });
        }

        // Fase 3: Nuevos threads intentan acceder
        if (Math.random() > 0.6) {
          const newThread = Math.floor(Math.random() * 100) + 10;
          
          if (semCounter > 0) {
            setSemCounter(c => c - 1);
            setSemActiveThreads(active => [...active, newThread]);
            
            newLog.push({
              id: Date.now() + 2,
              message: `✅ Thread ${newThread} accedió inmediatamente (contador: ${semCounter - 1})`,
              type: "success",
              timestamp: Date.now()
            });
          } else {
            setSemWaitingThreads(waiting => [...waiting, newThread]);
            
            newLog.push({
              id: Date.now() + 2,
              message: `⏳ Thread ${newThread} bloqueado - esperando recurso`,
              type: "warning",
              timestamp: Date.now()
            });
          }
        }

        return newLog.slice(-15);
      });
    }, semSpeed);

    return () => clearInterval(interval);
  }, [semRunning, semSpeed, semCounter, semWaitingThreads, semActiveThreads, semMaxCounter]);

  // Simulación Demo 5: Connection Pooling
  useEffect(() => {
    if (!poolRunning) return;

    const interval = setInterval(() => {
      setPoolLog(prev => {
        const newLog = [...prev];
        
        // Fase 1: Nueva petición de conexión
        if (Math.random() > 0.3) {
          setPoolRequests(r => r + 1);
          const threadId = Math.floor(Math.random() * 100) + 1;
          
          // Buscar conexión disponible
          const availableConn = poolConnections.find(c => !c.inUse);
          
          if (availableConn) {
            // Conexión disponible - asignar inmediatamente
            setPoolConnections(conns => 
              conns.map(c => 
                c.id === availableConn.id 
                  ? { ...c, inUse: true, thread: threadId }
                  : c
              )
            );
            
            newLog.push({
              id: Date.now(),
              message: `🏊 Thread ${threadId} adquirió Conexión ${availableConn.id} del pool`,
              type: "success",
              timestamp: Date.now()
            });
          } else {
            // Pool exhausted - thread debe esperar
            setPoolWaitingThreads(waiting => {
              if (!waiting.includes(threadId)) {
                newLog.push({
                  id: Date.now(),
                  message: `⏳ Thread ${threadId} esperando - pool exhausted`,
                  type: "warning",
                  timestamp: Date.now()
                });
                return [...waiting, threadId];
              }
              return waiting;
            });
          }
        }

        // Fase 2: Liberar conexiones
        if (Math.random() > 0.4) {
          const usedConns = poolConnections.filter(c => c.inUse);
          
          if (usedConns.length > 0) {
            const connToRelease = usedConns[Math.floor(Math.random() * usedConns.length)];
            
            setPoolConnections(conns => 
              conns.map(c => 
                c.id === connToRelease.id 
                  ? { ...c, inUse: false, thread: null, health: Math.max(80, c.health - 5) }
                  : c
              )
            );
            
            newLog.push({
              id: Date.now() + 1,
              message: `🔄 Thread ${connToRelease.thread} liberó Conexión ${connToRelease.id}`,
              type: "info",
              timestamp: Date.now()
            });
            
            // Si hay threads esperando, asignar inmediatamente
            if (poolWaitingThreads.length > 0) {
              const waitingThread = poolWaitingThreads[0];
              
              setPoolWaitingThreads(w => w.slice(1));
              setPoolConnections(conns => 
                conns.map(c => 
                  c.id === connToRelease.id 
                    ? { ...c, inUse: true, thread: waitingThread }
                    : c
                )
              );
              
              newLog.push({
                id: Date.now() + 2,
                message: `✅ Thread ${waitingThread} (esperando) adquirió Conexión ${connToRelease.id}`,
                type: "success",
                timestamp: Date.now()
              });
            }
          }
        }

        // Fase 3: Mantenimiento del pool (regenerar health)
        if (Math.random() > 0.8) {
          setPoolConnections(conns => 
            conns.map(c => 
              !c.inUse && c.health < 100
                ? { ...c, health: Math.min(100, c.health + 10) }
                : c
            )
          );
        }

        return newLog.slice(-15);
      });
    }, poolSpeed);

    return () => clearInterval(interval);
  }, [poolRunning, poolSpeed, poolConnections, poolWaitingThreads]);

  // Funciones de reset
  const resetSelective = () => {
    setSelectiveRunning(false);
    setSelectiveWaitQueue([1, 2, 3, 4, 5]);
    setSelectiveWorkQueue(5);
    setSelectiveWorking(null);
    setSelectiveLog([{ id: Date.now(), message: "🎯 Despertar Selectivo reiniciado", type: "info", timestamp: Date.now() }]);
  };

  const resetEpoll = () => {
    setEpollRunning(false);
    setEpollWaitingThreads([1, 2, 3, 4, 5, 6]);
    setEpollAwakenedThreads([]);
    setEpollEvents(0);
    setEpollLog([{ id: Date.now(), message: "⚡ Epoll/Kqueue reiniciado", type: "info", timestamp: Date.now() }]);
  };

  const resetWorkStealing = () => {
    setWsRunning(false);
    setWsQueues([[3, 2, 1], [5, 4], [], [8, 7, 6]]);
    setWsActiveThreads([]);
    setWsStealingFrom(null);
    setWsLog([{ id: Date.now(), message: "🔄 Work Stealing reiniciado", type: "info", timestamp: Date.now() }]);
  };

  const resetSemaphore = () => {
    setSemRunning(false);
    setSemCounter(3);
    setSemWaitingThreads([4, 5, 6, 7, 8]);
    setSemActiveThreads([1, 2, 3]);
    setSemLog([{ id: Date.now(), message: "🔢 Semáforos reiniciado", type: "info", timestamp: Date.now() }]);
  };

  const resetPool = () => {
    setPoolRunning(false);
    setPoolConnections([
      { id: 1, inUse: false, thread: null, health: 100 },
      { id: 2, inUse: false, thread: null, health: 100 },
      { id: 3, inUse: false, thread: null, health: 100 },
      { id: 4, inUse: false, thread: null, health: 100 },
      { id: 5, inUse: false, thread: null, health: 100 },
    ]);
    setPoolWaitingThreads([]);
    setPoolRequests(0);
    setPoolLog([{ id: Date.now(), message: "🏊 Connection Pool reiniciado", type: "info", timestamp: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-8 text-amber-400" />
          <h1 className="text-4xl font-bold">Thundering Herd — Pseudocódigos</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed">
          Colección de pseudocódigos para las técnicas principales que previenen el problema del 
          "rebaño atronador" (thundering herd): despertar selectivo, epoll/kqueue exclusivo, 
          work stealing, semáforos con contadores y connection pooling.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="multiple" defaultValue={["pseudocodigos", "demos"]} className="space-y-4">
          <AccordionItem value="pseudocodigos" className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <Code className="size-6 text-blue-400" />
                <span className="text-2xl font-semibold">Pseudocódigos de Soluciones</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Tabs defaultValue="selective" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="selective" className="data-[state=active]:bg-blue-600">
                    Despertar Selectivo
                  </TabsTrigger>
                  <TabsTrigger value="epoll" className="data-[state=active]:bg-blue-600">
                    Epoll/Kqueue
                  </TabsTrigger>
                  <TabsTrigger value="workstealing" className="data-[state=active]:bg-blue-600">
                    Work Stealing
                  </TabsTrigger>
                  <TabsTrigger value="semaphore" className="data-[state=active]:bg-blue-600">
                    Semáforos
                  </TabsTrigger>
                  <TabsTrigger value="pooling" className="data-[state=active]:bg-blue-600">
                    Connection Pooling
                  </TabsTrigger>
                </TabsList>

                {/* Despertar Selectivo */}
                <TabsContent value="selective" className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 p-6 rounded-lg border border-blue-700/50">
                    <h3 className="text-2xl font-bold text-blue-300 mb-3">
                      🎯 Solución 1: Despertar Selectivo
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      En lugar de despertar todos los threads en espera, el sistema despierta solo uno o un 
                      número controlado de threads. Esto evita la competencia masiva por recursos y reduce 
                      el overhead del sistema.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Despierta solo los threads necesarios</li>
                        <li>• Reduce contención y context switches</li>
                        <li>• Mejora eficiencia del sistema</li>
                        <li>• Evita desperdicios de CPU</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Despertar Selectivo
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Estructura de cola de espera
estructura WaitQueue {
    cola: Lista<Thread>
    mutex: Mutex
    wakeup_count: entero
}

// Thread esperando por un evento
función wait_selective(queue: WaitQueue) {
    queue.mutex.lock()
    
    // Añadir thread actual a la cola
    queue.cola.append(thread_actual)
    
    // Liberar mutex y dormir
    thread_actual.dormir()
    queue.mutex.unlock()
    
    // Al despertar, verificar si somos el elegido
    si thread_actual.wakeup_received entonces
        return EXITO
    sino
        // Volver a dormir si no fuimos seleccionados
        return wait_selective(queue)
}

// Despertar solo un thread
función wakeup_single(queue: WaitQueue) {
    queue.mutex.lock()
    
    si queue.cola.no_vacia() entonces
        // Seleccionar el primer thread
        thread = queue.cola.pop_front()
        
        // Marcar thread para despertar
        thread.wakeup_received = verdadero
        
        // Despertar solo este thread
        thread.despertar()
        
        queue.wakeup_count++
    fin si
    
    queue.mutex.unlock()
}

// Despertar N threads (selectivo múltiple)
función wakeup_n_threads(queue: WaitQueue, n: entero) {
    queue.mutex.lock()
    
    despertados = 0
    mientras despertados < n Y queue.cola.no_vacia() hacer
        thread = queue.cola.pop_front()
        thread.wakeup_received = verdadero
        thread.despertar()
        despertados++
    fin mientras
    
    queue.wakeup_count += despertados
    queue.mutex.unlock()
    
    return despertados
}

// Patrón productor-consumidor con despertar selectivo
función producer_consumer_selective() {
    cola_trabajo: Cola<Trabajo>
    wait_queue: WaitQueue
    workers: entero = 4
    
    // Productor
    función producer() {
        mientras verdadero hacer
            trabajo = generar_trabajo()
            cola_trabajo.push(trabajo)
            
            // Despertar solo UN worker
            wakeup_single(wait_queue)
        fin mientras
    }
    
    // Worker (consumidor)
    función worker() {
        mientras verdadero hacer
            si cola_trabajo.vacia() entonces
                // Esperar selectivamente
                wait_selective(wait_queue)
            sino
                trabajo = cola_trabajo.pop()
                procesar(trabajo)
            fin si
        fin mientras
    }
    
    // Iniciar threads
    crear_thread(producer)
    para i = 1 hasta workers hacer
        crear_thread(worker)
    fin para
}

// Ejemplo: Servidor con despertar selectivo
función servidor_selective() {
    socket_listener: Socket
    wait_queue: WaitQueue
    
    mientras verdadero hacer
        // Aceptar nueva conexión
        client = socket_listener.accept()
        
        // Despertar SOLO un thread worker
        wakeup_single(wait_queue)
        
        // El worker despertado procesará el cliente
    fin mientras
}

// Métricas de eficiencia
función medir_eficiencia() {
    inicio = tiempo_actual()
    threads_despertados = 0
    threads_productivos = 0
    
    // Procesar trabajos
    mientras hay_trabajos() hacer
        wakeup_single(wait_queue)
        threads_despertados++
        
        si thread_proceso_trabajo() entonces
            threads_productivos++
        fin si
    fin mientras
    
    tiempo_total = tiempo_actual() - inicio
    eficiencia = threads_productivos / threads_despertados
    
    imprimir("Eficiencia: " + (eficiencia * 100) + "%")
    imprimir("Context switches evitados: " + 
             (threads_totales - threads_despertados))
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Epoll/Kqueue con EPOLLEXCLUSIVE */}
                <TabsContent value="epoll" className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 p-6 rounded-lg border border-purple-700/50">
                    <h3 className="text-2xl font-bold text-purple-300 mb-3">
                      ⚡ Solución 2: Epoll/Kqueue con EPOLLEXCLUSIVE
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Utiliza mecanismos de I/O multiplexing del kernel con el flag EPOLLEXCLUSIVE para 
                      despertar solo un thread cuando hay un evento disponible. Común en servidores de alto 
                      rendimiento (Linux epoll, BSD kqueue).
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Despertar exclusivo en epoll_wait</li>
                        <li>• Soportado por el kernel (Linux 4.5+)</li>
                        <li>• Ideal para servidores multi-threaded</li>
                        <li>• Reduce thundering herd en accept()</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Epoll/Kqueue Exclusivo
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Flags de epoll
constante EPOLLIN = 0x001
constante EPOLLET = 0x80000000  // Edge-triggered
constante EPOLLEXCLUSIVE = 1 << 28  // Despertar solo un thread

// Estructura de eventos
estructura epoll_event {
    events: entero
    data: puntero
}

// Crear epoll con EPOLLEXCLUSIVE
función crear_servidor_epoll(puerto: entero) {
    // Crear descriptor epoll
    epfd = epoll_create1(0)
    
    // Crear socket listener
    listen_fd = socket(AF_INET, SOCK_STREAM, 0)
    bind(listen_fd, puerto)
    listen(listen_fd, 128)
    
    // Configurar evento con EPOLLEXCLUSIVE
    evento: epoll_event
    evento.events = EPOLLIN | EPOLLEXCLUSIVE
    evento.data = listen_fd
    
    // Registrar socket en epoll
    epoll_ctl(epfd, EPOLL_CTL_ADD, listen_fd, &evento)
    
    return epfd, listen_fd
}

// Worker thread con epoll exclusivo
función worker_epoll(epfd: entero, listen_fd: entero) {
    eventos: arreglo[64] de epoll_event
    
    mientras verdadero hacer
        // Esperar eventos (SOLO un thread será despertado)
        nfds = epoll_wait(epfd, eventos, 64, -1)
        
        para i = 0 hasta nfds - 1 hacer
            si eventos[i].data == listen_fd entonces
                // Aceptar conexión
                client_fd = accept(listen_fd, NULL, NULL)
                
                si client_fd >= 0 entonces
                    // Procesar cliente
                    manejar_cliente(client_fd)
                    close(client_fd)
                fin si
            fin si
        fin para
    fin mientras
}

// Servidor multi-threaded con EPOLLEXCLUSIVE
función servidor_multithreaded(puerto: entero, num_workers: entero) {
    epfd, listen_fd = crear_servidor_epoll(puerto)
    
    // Crear threads workers
    threads: arreglo[num_workers] de Thread
    
    para i = 0 hasta num_workers - 1 hacer
        threads[i] = crear_thread(worker_epoll, epfd, listen_fd)
    fin para
    
    // Esperar threads
    para cada thread en threads hacer
        thread.join()
    fin para
}

// Comparación: epoll normal vs EPOLLEXCLUSIVE
función comparar_epoll() {
    // SIN EPOLLEXCLUSIVE (thundering herd)
    función epoll_normal(epfd: entero) {
        evento: epoll_event
        evento.events = EPOLLIN  // Sin flag exclusivo
        epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &evento)
        
        // Al llegar un evento:
        // - TODOS los threads son despertados
        // - Solo UNO puede accept()
        // - Los demás vuelven a dormir (desperdicio)
    }
    
    // CON EPOLLEXCLUSIVE (eficiente)
    función epoll_exclusivo(epfd: entero) {
        evento: epoll_event
        evento.events = EPOLLIN | EPOLLEXCLUSIVE
        epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &evento)
        
        // Al llegar un evento:
        // - SOLO UN thread es despertado
        // - Ese thread hace accept()
        // - Sin context switches innecesarios
    }
}

// Kqueue equivalente (BSD/macOS)
función worker_kqueue(kq: entero, listen_fd: entero) {
    eventos: arreglo[64] de kevent
    
    // Configurar evento con EV_DISPATCH (similar a EPOLLEXCLUSIVE)
    cambio: kevent
    cambio.ident = listen_fd
    cambio.filter = EVFILT_READ
    cambio.flags = EV_ADD | EV_DISPATCH  // Despertar solo un thread
    
    kevent(kq, &cambio, 1, NULL, 0, NULL)
    
    mientras verdadero hacer
        // Esperar eventos
        nev = kevent(kq, NULL, 0, eventos, 64, NULL)
        
        para i = 0 hasta nev - 1 hacer
            si eventos[i].ident == listen_fd entonces
                client_fd = accept(listen_fd, NULL, NULL)
                
                si client_fd >= 0 entonces
                    manejar_cliente(client_fd)
                    close(client_fd)
                fin si
                
                // Re-armar evento (EV_DISPATCH lo desactiva)
                kevent(kq, &cambio, 1, NULL, 0, NULL)
            fin si
        fin para
    fin mientras
}

// Servidor híbrido: epoll + thread pool
función servidor_hibrido(puerto: entero) {
    epfd, listen_fd = crear_servidor_epoll(puerto)
    pool: ThreadPool = crear_pool(8)
    
    // Thread aceptador (único)
    función acceptor() {
        eventos: arreglo[64] de epoll_event
        
        mientras verdadero hacer
            nfds = epoll_wait(epfd, eventos, 64, -1)
            
            para i = 0 hasta nfds - 1 hacer
                client_fd = accept(listen_fd, NULL, NULL)
                
                // Delegar procesamiento al pool
                pool.submit(lambda: manejar_cliente(client_fd))
            fin para
        fin mientras
    }
    
    crear_thread(acceptor)
    pool.wait_all()
}

// Métricas de rendimiento
función medir_rendimiento_epoll() {
    conexiones = 10000
    threads_despertados_normal = conexiones * num_workers
    threads_despertados_exclusivo = conexiones
    
    mejora = ((threads_despertados_normal - threads_despertados_exclusivo) /
              threads_despertados_normal) * 100
    
    imprimir("Reducción de wakeups: " + mejora + "%")
    imprimir("Context switches evitados: " + 
             (threads_despertados_normal - threads_despertados_exclusivo))
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Work Stealing */}
                <TabsContent value="workstealing" className="space-y-4">
                  <div className="bg-gradient-to-br from-green-900/30 to-slate-800/30 p-6 rounded-lg border border-green-700/50">
                    <h3 className="text-2xl font-bold text-green-300 mb-3">
                      🔄 Solución 3: Work Stealing
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Cada thread tiene su propia cola de trabajo. Cuando un thread se queda sin trabajo, 
                      "roba" tareas de las colas de otros threads ocupados. Evita despertar todos los threads 
                      simultáneamente y balancea la carga automáticamente.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Cada thread tiene cola local</li>
                        <li>• Robo desde colas de otros threads</li>
                        <li>• Balanceo de carga automático</li>
                        <li>• Usado en ForkJoinPool de Java</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Work Stealing
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Deque thread-safe (doble cola)
estructura WorkStealingDeque<T> {
    elementos: arreglo circular de T
    top: entero atómico    // Extremo para push/pop local
    bottom: entero atómico // Extremo para steal
    mutex: Mutex
}

// Operaciones en el deque
función push(deque: WorkStealingDeque, tarea: T) {
    // Push en el bottom (extremo local)
    b = deque.bottom.load()
    deque.elementos[b % tamaño] = tarea
    deque.bottom.store(b + 1)
}

función pop(deque: WorkStealingDeque) -> T {
    // Pop desde el bottom (LIFO local - mejor localidad de caché)
    b = deque.bottom.load() - 1
    deque.bottom.store(b)
    
    t = deque.top.load()
    
    si b < t entonces
        // Deque vacío
        deque.bottom.store(t)
        return NULL
    fin si
    
    tarea = deque.elementos[b % tamaño]
    
    si b > t entonces
        // Más de un elemento, operación exitosa
        return tarea
    fin si
    
    // Competencia con steal, usar CAS
    deque.bottom.store(t + 1)
    
    si compare_and_swap(deque.top, t, t + 1) entonces
        return tarea
    sino
        return NULL  // Perdimos la carrera
    fin si
}

función steal(deque: WorkStealingDeque) -> T {
    // Robar desde el top (FIFO - tareas más antiguas)
    mientras verdadero hacer
        t = deque.top.load()
        b = deque.bottom.load()
        
        si t >= b entonces
            return NULL  // Deque vacío
        fin si
        
        tarea = deque.elementos[t % tamaño]
        
        si compare_and_swap(deque.top, t, t + 1) entonces
            return tarea  // Robo exitoso
        fin si
        // CAS falló, reintentar
    fin mientras
}

// Thread pool con work stealing
estructura WorkStealingPool {
    threads: arreglo de Thread
    deques: arreglo de WorkStealingDeque
    num_threads: entero
    activo: booleano atómico
}

función crear_pool(num_threads: entero) -> WorkStealingPool {
    pool: WorkStealingPool
    pool.num_threads = num_threads
    pool.activo = verdadero
    
    // Crear deque para cada thread
    pool.deques = nuevo arreglo[num_threads] de WorkStealingDeque
    
    // Iniciar threads workers
    para i = 0 hasta num_threads - 1 hacer
        pool.threads[i] = crear_thread(worker, pool, i)
    fin para
    
    return pool
}

// Worker con work stealing
función worker(pool: WorkStealingPool, id: entero) {
    mi_deque = pool.deques[id]
    intentos_robo = 0
    max_intentos = pool.num_threads * 2
    
    mientras pool.activo hacer
        // 1. Intentar tomar tarea de mi cola local
        tarea = pop(mi_deque)
        
        si tarea != NULL entonces
            ejecutar(tarea)
            intentos_robo = 0  // Resetear contador
            continuar
        fin si
        
        // 2. Intentar robar de otros threads
        tarea = intentar_robar(pool, id)
        
        si tarea != NULL entonces
            ejecutar(tarea)
            intentos_robo = 0
            continuar
        fin si
        
        // 3. No hay trabajo, estrategia de espera
        intentos_robo++
        
        si intentos_robo < max_intentos entonces
            // Spin breve (busy-wait)
            spin_wait(10)
        sino
            // Dormir para ahorrar CPU
            thread_sleep(1ms)
        fin si
    fin mientras
}

// Estrategia de robo: víctima aleatoria
función intentar_robar(pool: WorkStealingPool, mi_id: entero) -> Tarea {
    num_threads = pool.num_threads
    inicio = random(num_threads)
    
    // Intentar robar de cada thread (orden aleatorio)
    para i = 0 hasta num_threads - 1 hacer
        victima = (inicio + i) % num_threads
        
        si victima == mi_id entonces
            continuar  // No robar de mi mismo
        fin si
        
        tarea = steal(pool.deques[victima])
        
        si tarea != NULL entonces
            return tarea  // Robo exitoso
        fin si
    fin para
    
    return NULL  // No se encontró trabajo
}

// Submit tarea al pool
función submit(pool: WorkStealingPool, tarea: Tarea) {
    // Seleccionar thread con menos carga (heurística)
    thread_id = seleccionar_thread_menos_cargado(pool)
    
    // Push a su deque
    push(pool.deques[thread_id], tarea)
}

// Ejemplo: procesamiento paralelo con work stealing
función procesar_arbol_paralelo(nodo: Nodo, pool: WorkStealingPool) {
    si nodo es hoja entonces
        procesar(nodo)
        return
    fin si
    
    // Dividir trabajo recursivamente
    para cada hijo en nodo.hijos hacer
        tarea = lambda: procesar_arbol_paralelo(hijo, pool)
        submit(pool, tarea)
    fin para
}

// ForkJoin pattern (divide and conquer)
función fork_join_sort(arr: arreglo, inicio: entero, fin: entero) {
    si fin - inicio <= UMBRAL entonces
        // Caso base: ordenar secuencialmente
        insertion_sort(arr, inicio, fin)
        return
    fin si
    
    // Dividir
    medio = (inicio + fin) / 2
    
    // Fork: crear subtareas
    tarea_izq = crear_tarea(fork_join_sort, arr, inicio, medio)
    tarea_der = crear_tarea(fork_join_sort, arr, medio, fin)
    
    // Push a mi deque local
    mi_id = thread_actual_id()
    push(pool.deques[mi_id], tarea_izq)
    push(pool.deques[mi_id], tarea_der)
    
    // Procesar una subtarea localmente (ayudar)
    fork_join_sort(arr, inicio, medio)
    
    // Join: esperar resultado de la otra subtarea
    mientras tarea_der no completada hacer
        // Intentar robar y ejecutar trabajo mientras esperamos
        tarea = intentar_robar(pool, mi_id)
        si tarea != NULL entonces
            ejecutar(tarea)
        fin si
    fin mientras
    
    // Merge resultados
    merge(arr, inicio, medio, fin)
}

// Métricas de eficiencia
función medir_work_stealing() {
    tareas_totales = 1000
    tareas_locales = 0
    tareas_robadas = 0
    
    // Contadores por thread
    para cada thread hacer
        tareas_locales += thread.stats.local_pops
        tareas_robadas += thread.stats.steals
    fin para
    
    ratio_robo = (tareas_robadas / tareas_totales) * 100
    
    imprimir("Tareas locales: " + tareas_locales)
    imprimir("Tareas robadas: " + tareas_robadas)
    imprimir("Ratio de robo: " + ratio_robo + "%")
    imprimir("Balanceo de carga: " + evaluar_balance())
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Semáforos con Contadores */}
                <TabsContent value="semaphore" className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-900/30 to-slate-800/30 p-6 rounded-lg border border-orange-700/50">
                    <h3 className="text-2xl font-bold text-orange-300 mb-3">
                      🔢 Solución 4: Semáforos con Contadores
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Usa semáforos contadores para controlar exactamente cuántos threads pueden acceder 
                      simultáneamente a un recurso. El contador limita los despertares al número exacto de 
                      recursos disponibles, evitando despertares masivos innecesarios.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Contador de recursos disponibles</li>
                        <li>• Despierta solo N threads (N recursos)</li>
                        <li>• Control fino de concurrencia</li>
                        <li>• Evita sobre-suscripción</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Semáforos con Contadores
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Semáforo contador básico
estructura Semaphore {
    contador: entero atómico
    wait_queue: Cola<Thread>
    mutex: Mutex
}

función crear_semaforo(valor_inicial: entero) -> Semaphore {
    sem: Semaphore
    sem.contador = valor_inicial
    sem.wait_queue = nueva_cola()
    return sem
}

// Wait (P operation / down)
función wait(sem: Semaphore) {
    sem.mutex.lock()
    
    mientras sem.contador <= 0 hacer
        // No hay recursos, esperar
        thread_actual = obtener_thread_actual()
        sem.wait_queue.enqueue(thread_actual)
        
        // Liberar mutex y dormir
        sem.mutex.unlock()
        thread_actual.dormir()
        sem.mutex.lock()
    fin mientras
    
    // Hay recursos disponibles
    sem.contador--
    sem.mutex.unlock()
}

// Signal (V operation / up)
función signal(sem: Semaphore) {
    sem.mutex.lock()
    
    sem.contador++
    
    // Despertar UN thread esperando (si hay)
    si no sem.wait_queue.vacia() entonces
        thread = sem.wait_queue.dequeue()
        thread.despertar()
    fin si
    
    sem.mutex.unlock()
}

// Signal múltiple (despertar N threads)
función signal_n(sem: Semaphore, n: entero) {
    sem.mutex.lock()
    
    sem.contador += n
    despertados = 0
    
    // Despertar exactamente N threads (o todos los que esperan)
    mientras despertados < n Y no sem.wait_queue.vacia() hacer
        thread = sem.wait_queue.dequeue()
        thread.despertar()
        despertados++
    fin mientras
    
    sem.mutex.unlock()
}

// Pool de conexiones con semáforo
función connection_pool_semaforo(max_conexiones: entero) {
    semaforo: Semaphore = crear_semaforo(max_conexiones)
    conexiones: arreglo[max_conexiones] de Connection
    
    // Inicializar pool
    para i = 0 hasta max_conexiones - 1 hacer
        conexiones[i] = crear_conexion()
    fin para
    
    // Adquirir conexión
    función acquire() -> Connection {
        wait(semaforo)  // Esperar si no hay conexiones
        
        // Buscar conexión disponible
        para cada conn en conexiones hacer
            si conn.disponible entonces
                conn.disponible = falso
                return conn
            fin si
        fin para
    }
    
    // Liberar conexión
    función release(conn: Connection) {
        conn.disponible = verdadero
        signal(semaforo)  // Despertar UN thread esperando
    }
}

// Semáforo con prioridad (evita starvation)
estructura PrioritySemaphore {
    contador: entero atómico
    colas: arreglo de Cola<Thread>  // Una cola por prioridad
    num_prioridades: entero
    mutex: Mutex
}

función wait_priority(sem: PrioritySemaphore, prioridad: entero) {
    sem.mutex.lock()
    
    mientras sem.contador <= 0 hacer
        thread_actual = obtener_thread_actual()
        // Encolar en cola de prioridad correspondiente
        sem.colas[prioridad].enqueue(thread_actual)
        
        sem.mutex.unlock()
        thread_actual.dormir()
        sem.mutex.lock()
    fin mientras
    
    sem.contador--
    sem.mutex.unlock()
}

función signal_priority(sem: PrioritySemaphore) {
    sem.mutex.lock()
    
    sem.contador++
    
    // Despertar thread de mayor prioridad
    para prioridad = sem.num_prioridades - 1 hasta 0 hacer
        si no sem.colas[prioridad].vacia() entonces
            thread = sem.colas[prioridad].dequeue()
            thread.despertar()
            break
        fin si
    fin para
    
    sem.mutex.unlock()
}

// Barrera con semáforos (sincronización de fase)
estructura Barrier {
    num_threads: entero
    contador: entero atómico
    semaforo: Semaphore
    mutex: Mutex
}

función wait_barrier(barrier: Barrier) {
    barrier.mutex.lock()
    barrier.contador++
    
    si barrier.contador == barrier.num_threads entonces
        // Último thread, liberar todos
        barrier.contador = 0
        barrier.mutex.unlock()
        
        // Despertar TODOS los threads (todos los recursos listos)
        signal_n(barrier.semaforo, barrier.num_threads - 1)
    sino
        // No soy el último, esperar
        barrier.mutex.unlock()
        wait(barrier.semaforo)
    fin si
}

// Rate limiter con semáforo (token bucket)
función rate_limiter(tokens_por_segundo: entero) {
    semaforo: Semaphore = crear_semaforo(tokens_por_segundo)
    
    // Thread que regenera tokens
    función regenerador() {
        mientras verdadero hacer
            dormir(1 segundo)
            signal_n(semaforo, tokens_por_segundo)
        fin mientras
    }
    
    crear_thread(regenerador)
    
    // Consumir token
    función acquire_token() {
        wait(semaforo)
        // Token adquirido, proceder con operación
    }
    
    return acquire_token
}

// Thread pool con semáforo (limitar workers activos)
función thread_pool_semaforo(max_workers: entero) {
    semaforo_workers: Semaphore = crear_semaforo(max_workers)
    cola_trabajos: Cola<Trabajo> sincronizada
    
    función worker() {
        mientras verdadero hacer
            trabajo = cola_trabajos.dequeue()
            
            // Adquirir slot de worker
            wait(semaforo_workers)
            
            ejecutar(trabajo)
            
            // Liberar slot (despertar siguiente worker)
            signal(semaforo_workers)
        fin mientras
    }
    
    // Crear pool de threads
    para i = 1 hasta max_workers * 2 hacer
        crear_thread(worker)
    fin para
}

// Productor-Consumidor con semáforos duales
función producer_consumer_semaphores(buffer_size: entero) {
    buffer: arreglo circular[buffer_size]
    sem_vacios: Semaphore = crear_semaforo(buffer_size)  // Espacios vacíos
    sem_llenos: Semaphore = crear_semaforo(0)            // Items disponibles
    mutex: Mutex
    
    función producer() {
        mientras verdadero hacer
            item = producir()
            
            wait(sem_vacios)    // Esperar espacio disponible
            mutex.lock()
            buffer.push(item)
            mutex.unlock()
            signal(sem_llenos)  // Señalar item disponible
        fin mientras
    }
    
    función consumer() {
        mientras verdadero hacer
            wait(sem_llenos)    // Esperar item disponible
            mutex.lock()
            item = buffer.pop()
            mutex.unlock()
            signal(sem_vacios)  // Señalar espacio disponible
            
            consumir(item)
        fin mientras
    }
}

// Métricas de uso
función medir_semaforos() {
    max_recursos = 10
    threads_totales = 50
    threads_bloqueados = 0
    
    para cada thread hacer
        si thread.estado == ESPERANDO entonces
            threads_bloqueados++
        fin si
    fin para
    
    utilizacion = ((threads_totales - threads_bloqueados) / max_recursos) * 100
    eficiencia = min(utilizacion, 100)
    
    imprimir("Recursos máximos: " + max_recursos)
    imprimir("Threads activos: " + (threads_totales - threads_bloqueados))
    imprimir("Threads bloqueados: " + threads_bloqueados)
    imprimir("Eficiencia: " + eficiencia + "%")
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Connection Pooling */}
                <TabsContent value="pooling" className="space-y-4">
                  <div className="bg-gradient-to-br from-cyan-900/30 to-slate-800/30 p-6 rounded-lg border border-cyan-700/50">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-3">
                      🏊 Solución 5: Connection Pooling
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Mantiene un pool de conexiones pre-establecidas y reutilizables. En lugar de crear 
                      conexiones bajo demanda (causando thundering herd), los threads toman conexiones 
                      existentes del pool. Común en bases de datos y servicios de red.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Reutilización de conexiones</li>
                        <li>• Evita creación masiva simultánea</li>
                        <li>• Gestión de timeouts y validación</li>
                        <li>• Control de tamaño máximo</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Connection Pooling
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Estructura de conexión
estructura Connection {
    id: entero
    socket: Socket
    en_uso: booleano atómico
    ultimo_uso: Timestamp
    creada: Timestamp
    validaciones_fallidas: entero
}

// Pool de conexiones
estructura ConnectionPool {
    conexiones: Lista<Connection>
    min_size: entero
    max_size: entero
    current_size: entero atómico
    semaforo: Semaphore
    mutex: Mutex
    timeout_ms: entero
    max_lifetime_ms: entero
}

// Crear pool
función crear_pool(host: cadena, puerto: entero, 
                   min: entero, max: entero) -> ConnectionPool {
    pool: ConnectionPool
    pool.min_size = min
    pool.max_size = max
    pool.current_size = 0
    pool.timeout_ms = 30000  // 30 segundos
    pool.max_lifetime_ms = 1800000  // 30 minutos
    pool.semaforo = crear_semaforo(max)
    
    // Crear conexiones iniciales (min_size)
    para i = 1 hasta min hacer
        conn = crear_conexion(host, puerto)
        pool.conexiones.append(conn)
        pool.current_size++
    fin para
    
    // Iniciar thread de mantenimiento
    crear_thread(mantener_pool, pool)
    
    return pool
}

// Adquirir conexión del pool
función acquire(pool: ConnectionPool, timeout_ms: entero) -> Connection {
    inicio = timestamp_actual()
    
    mientras verdadero hacer
        pool.mutex.lock()
        
        // 1. Buscar conexión disponible y válida
        para cada conn en pool.conexiones hacer
            si no conn.en_uso entonces
                si validar_conexion(conn) entonces
                    conn.en_uso = verdadero
                    conn.ultimo_uso = timestamp_actual()
                    pool.mutex.unlock()
                    return conn
                sino
                    // Conexión inválida, remover
                    pool.conexiones.remove(conn)
                    pool.current_size--
                    cerrar(conn)
                fin si
            fin si
        fin para
        
        // 2. No hay conexiones disponibles
        si pool.current_size < pool.max_size entonces
            // Crear nueva conexión
            conn = crear_nueva_conexion(pool)
            si conn != NULL entonces
                conn.en_uso = verdadero
                conn.ultimo_uso = timestamp_actual()
                pool.conexiones.append(conn)
                pool.current_size++
                pool.mutex.unlock()
                return conn
            fin si
        fin si
        
        pool.mutex.unlock()
        
        // 3. Pool lleno, esperar
        tiempo_transcurrido = timestamp_actual() - inicio
        
        si tiempo_transcurrido >= timeout_ms entonces
            lanzar TimeoutException("Pool exhausted")
        fin si
        
        // Esperar con semáforo (despertar selectivo)
        wait_timeout(pool.semaforo, timeout_ms - tiempo_transcurrido)
    fin mientras
}

// Liberar conexión al pool
función release(pool: ConnectionPool, conn: Connection) {
    pool.mutex.lock()
    
    si conn.en_uso entonces
        conn.en_uso = falso
        conn.ultimo_uso = timestamp_actual()
        
        // Verificar si debe ser descartada
        si debe_descartar(conn, pool) entonces
            pool.conexiones.remove(conn)
            pool.current_size--
            cerrar(conn)
        fin si
    fin si
    
    pool.mutex.unlock()
    
    // Señalar que hay conexión disponible
    signal(pool.semaforo)
}

// Validar conexión
función validar_conexion(conn: Connection) -> booleano {
    // 1. Verificar timeout de vida
    edad = timestamp_actual() - conn.creada
    si edad > pool.max_lifetime_ms entonces
        return falso
    fin si
    
    // 2. Ping rápido (opcional)
    si no ping(conn.socket) entonces
        conn.validaciones_fallidas++
        si conn.validaciones_fallidas >= 3 entonces
            return falso
        fin si
    sino
        conn.validaciones_fallidas = 0
    fin si
    
    return verdadero
}

// Thread de mantenimiento
función mantener_pool(pool: ConnectionPool) {
    mientras verdadero hacer
        dormir(60000)  // Cada minuto
        
        pool.mutex.lock()
        
        // 1. Remover conexiones expiradas
        para cada conn en pool.conexiones hacer
            si no conn.en_uso entonces
                si debe_descartar(conn, pool) entonces
                    pool.conexiones.remove(conn)
                    pool.current_size--
                    cerrar(conn)
                fin si
            fin si
        fin para
        
        // 2. Mantener mínimo de conexiones
        mientras pool.current_size < pool.min_size hacer
            conn = crear_nueva_conexion(pool)
            si conn != NULL entonces
                pool.conexiones.append(conn)
                pool.current_size++
            fin si
        fin mientras
        
        pool.mutex.unlock()
    fin mientras
}

// Verificar si descartar conexión
función debe_descartar(conn: Connection, pool: ConnectionPool) -> booleano {
    // Excede tiempo de vida
    edad = timestamp_actual() - conn.creada
    si edad > pool.max_lifetime_ms entonces
        return verdadero
    fin si
    
    // Idle timeout (30 min sin uso)
    idle_time = timestamp_actual() - conn.ultimo_uso
    si idle_time > 1800000 entonces
        return verdadero
    fin si
    
    // Muchas validaciones fallidas
    si conn.validaciones_fallidas >= 3 entonces
        return verdadero
    fin si
    
    return falso
}

// Pool con particionamiento (sharding)
estructura ShardedConnectionPool {
    shards: arreglo de ConnectionPool
    num_shards: entero
}

función crear_sharded_pool(num_shards: entero, 
                           size_por_shard: entero) -> ShardedConnectionPool {
    pool: ShardedConnectionPool
    pool.num_shards = num_shards
    
    para i = 0 hasta num_shards - 1 hacer
        pool.shards[i] = crear_pool(host, puerto, 
                                     size_por_shard / 2, 
                                     size_por_shard)
    fin para
    
    return pool
}

función acquire_sharded(pool: ShardedConnectionPool) -> Connection {
    // Seleccionar shard basado en thread ID (menos contención)
    shard_id = thread_id() % pool.num_shards
    return acquire(pool.shards[shard_id], 30000)
}

// Ejemplo: Base de datos con pooling
función ejemplo_database_pool() {
    pool = crear_pool("localhost", 5432, min=5, max=20)
    
    función worker_thread() {
        mientras verdadero hacer
            trabajo = obtener_trabajo()
            
            // Adquirir conexión (espera si no hay disponibles)
            conn = acquire(pool, timeout_ms=5000)
            
            intentar {
                resultado = conn.query(trabajo.sql)
                procesar(resultado)
            } capturar error {
                manejar_error(error)
            } finalmente {
                // SIEMPRE liberar conexión
                release(pool, conn)
            }
        fin mientras
    }
    
    // Crear threads workers
    para i = 1 hasta 100 hacer
        crear_thread(worker_thread)
    fin para
}

// Pool elástico (escala automáticamente)
función pool_elastico() {
    pool: ConnectionPool
    metricas: Metricas
    
    función ajustar_tamaño() {
        mientras verdadero hacer
            dormir(10000)  // Cada 10 segundos
            
            carga = metricas.wait_time_promedio
            
            si carga > 100ms Y pool.current_size < pool.max_size entonces
                // Alta carga, expandir
                agregar_conexiones(pool, 2)
            fin si
            
            si carga < 10ms Y pool.current_size > pool.min_size entonces
                // Baja carga, contraer
                remover_conexiones_idle(pool, 2)
            fin si
        fin mientras
    }
    
    crear_thread(ajustar_tamaño)
}

// Métricas de pool
función medir_pool(pool: ConnectionPool) {
    pool.mutex.lock()
    
    total = pool.current_size
    en_uso = 0
    disponibles = 0
    
    para cada conn en pool.conexiones hacer
        si conn.en_uso entonces
            en_uso++
        sino
            disponibles++
        fin si
    fin para
    
    pool.mutex.unlock()
    
    utilizacion = (en_uso / total) * 100
    
    imprimir("Conexiones totales: " + total)
    imprimir("Conexiones en uso: " + en_uso)
    imprimir("Conexiones disponibles: " + disponibles)
    imprimir("Utilización: " + utilizacion + "%")
    imprimir("Capacidad restante: " + (pool.max_size - total))
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion de Demostraciones */}
          <AccordionItem value="demos" className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <TrendingDown className="size-6 text-emerald-400" />
                <span className="text-2xl font-semibold">Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Tabs defaultValue="demo-selective" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="demo-selective" className="data-[state=active]:bg-emerald-600">
                    Demo Selectivo
                  </TabsTrigger>
                  <TabsTrigger value="demo-epoll" className="data-[state=active]:bg-emerald-600">
                    Demo Epoll
                  </TabsTrigger>
                  <TabsTrigger value="demo-ws" className="data-[state=active]:bg-emerald-600">
                    Demo WS
                  </TabsTrigger>
                  <TabsTrigger value="demo-sem" className="data-[state=active]:bg-emerald-600">
                    Demo Semáforos
                  </TabsTrigger>
                  <TabsTrigger value="demo-pool" className="data-[state=active]:bg-emerald-600">
                    Demo Pool
                  </TabsTrigger>
                </TabsList>

                {/* Demo 1: Despertar Selectivo */}
                <TabsContent value="demo-selective" className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/50 p-6 rounded-lg border border-blue-700/30">
                    <h3 className="text-xl font-bold text-blue-300 mb-4">
                      🎯 Demostración: Despertar Selectivo
                    </h3>
                    
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setSelectiveRunning(!selectiveRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          selectiveRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {selectiveRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {selectiveRunning ? "Pausar" : "Iniciar"}
                      </button>
                      <button
                        onClick={resetSelective}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-700 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[selectiveSpeed]}
                          onValueChange={(v) => setSelectiveSpeed(v[0])}
                          min={200}
                          max={2000}
                          step={100}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-400 w-16">{selectiveSpeed}ms</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {/* Cola de Espera */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-blue-300 mb-2">
                          😴 Cola de Espera ({selectiveWaitQueue.length})
                        </h4>
                        <div className="space-y-1">
                          {selectiveWaitQueue.map((thread, idx) => (
                            <div
                              key={idx}
                              className="bg-blue-900/30 px-2 py-1 rounded text-sm border border-blue-700/50"
                            >
                              Thread {thread}
                            </div>
                          ))}
                          {selectiveWaitQueue.length === 0 && (
                            <div className="text-gray-500 text-xs italic">Vacía</div>
                          )}
                        </div>
                      </div>

                      {/* Cola de Trabajo */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-amber-300 mb-2">
                          📦 Trabajos Pendientes
                        </h4>
                        <div className="text-4xl font-bold text-center text-amber-400 py-4">
                          {selectiveWorkQueue}
                        </div>
                      </div>

                      {/* Thread Activo */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-emerald-300 mb-2">
                          ⚙️ Thread Trabajando
                        </h4>
                        <div className="text-center py-4">
                          {selectiveWorking !== null ? (
                            <div className="bg-emerald-900/30 px-3 py-2 rounded border border-emerald-700/50 inline-block">
                              <div className="text-2xl font-bold text-emerald-400">
                                Thread {selectiveWorking}
                              </div>
                              <div className="text-xs text-emerald-300 mt-1">Procesando...</div>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm italic">Idle</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Log de Eventos</h4>
                      <div
                        ref={selectiveLogRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {selectiveLog.map((entry) => (
                          <div
                            key={entry.id}
                            className={`${
                              entry.type === "success"
                                ? "text-emerald-400"
                                : entry.type === "warning"
                                ? "text-amber-400"
                                : entry.type === "error"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {entry.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Epoll/Kqueue */}
                <TabsContent value="demo-epoll" className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 p-6 rounded-lg border border-purple-700/30">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">
                      ⚡ Demostración: Epoll/Kqueue EPOLLEXCLUSIVE
                    </h3>
                    
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setEpollRunning(!epollRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          epollRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {epollRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {epollRunning ? "Pausar" : "Iniciar"}
                      </button>
                      <button
                        onClick={resetEpoll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-700 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <button
                        onClick={() => setEpollMode(epollMode === "normal" ? "exclusive" : "normal")}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          epollMode === "exclusive"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-amber-600 hover:bg-amber-700"
                        }`}
                      >
                        Modo: {epollMode === "exclusive" ? "EXCLUSIVE ✅" : "NORMAL ⚠️"}
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[epollSpeed]}
                          onValueChange={(v) => setEpollSpeed(v[0])}
                          min={200}
                          max={2000}
                          step={100}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-400 w-16">{epollSpeed}ms</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Threads Esperando */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-purple-300 mb-3">
                          😴 Threads en epoll_wait() ({epollWaitingThreads.length})
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {epollWaitingThreads.map((thread) => {
                            const isAwakened = epollAwakenedThreads.includes(thread);
                            return (
                              <div
                                key={thread}
                                className={`px-3 py-2 rounded text-center font-semibold transition-all ${
                                  isAwakened
                                    ? "bg-emerald-600 border-emerald-400 scale-110"
                                    : "bg-purple-900/30 border-purple-700/50"
                                } border`}
                              >
                                T{thread}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Eventos */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-purple-300 mb-3">
                          🔔 Eventos Procesados
                        </h4>
                        <div className="text-5xl font-bold text-center text-purple-400 py-4">
                          {epollEvents}
                        </div>
                        <div className="text-center text-sm text-gray-400">
                          {epollMode === "normal" 
                            ? "⚠️ Thundering Herd Activo"
                            : "✅ Despertar Exclusivo"}
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Log de Eventos</h4>
                      <div
                        ref={epollLogRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {epollLog.map((entry) => (
                          <div
                            key={entry.id}
                            className={`${
                              entry.type === "success"
                                ? "text-emerald-400"
                                : entry.type === "warning"
                                ? "text-amber-400"
                                : entry.type === "error"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {entry.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Work Stealing */}
                <TabsContent value="demo-ws" className="space-y-4">
                  <div className="bg-gradient-to-br from-green-900/20 to-slate-900/50 p-6 rounded-lg border border-green-700/30">
                    <h3 className="text-xl font-bold text-green-300 mb-4">
                      🔄 Demostración: Work Stealing
                    </h3>
                    
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setWsRunning(!wsRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          wsRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {wsRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {wsRunning ? "Pausar" : "Iniciar"}
                      </button>
                      <button
                        onClick={resetWorkStealing}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-700 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[wsSpeed]}
                          onValueChange={(v) => setWsSpeed(v[0])}
                          min={200}
                          max={2000}
                          step={100}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-400 w-16">{wsSpeed}ms</span>
                      </div>
                    </div>

                    {/* Colas de Work Stealing */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {wsQueues.map((queue, threadIdx) => (
                        <div
                          key={threadIdx}
                          className={`bg-slate-800/50 p-4 rounded-lg border transition-all ${
                            wsActiveThreads.includes(threadIdx)
                              ? "border-emerald-500 bg-emerald-900/20"
                              : wsStealingFrom?.to === threadIdx
                              ? "border-blue-500 bg-blue-900/20"
                              : wsStealingFrom?.from === threadIdx
                              ? "border-amber-500 bg-amber-900/20"
                              : "border-slate-600"
                          }`}
                        >
                          <h4 className="text-sm font-semibold text-green-300 mb-2">
                            Thread {threadIdx} ({queue.length})
                          </h4>
                          <div className="space-y-1">
                            {queue.slice().reverse().map((task, idx) => (
                              <div
                                key={idx}
                                className="bg-green-900/30 px-2 py-1 rounded text-sm border border-green-700/50 text-center"
                              >
                                T{task}
                              </div>
                            ))}
                            {queue.length === 0 && (
                              <div className="text-gray-500 text-xs italic text-center py-2">
                                {wsActiveThreads.includes(threadIdx) ? "Robando..." : "Vacía"}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Leyenda */}
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600 mb-4">
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                          <span>Procesando</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span>Robando a...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-amber-500 rounded"></div>
                          <span>Siendo robado</span>
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Log de Eventos</h4>
                      <div
                        ref={wsLogRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {wsLog.map((entry) => (
                          <div
                            key={entry.id}
                            className={`${
                              entry.type === "success"
                                ? "text-emerald-400"
                                : entry.type === "warning"
                                ? "text-amber-400"
                                : entry.type === "error"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {entry.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Semáforos */}
                <TabsContent value="demo-sem" className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-900/20 to-slate-900/50 p-6 rounded-lg border border-orange-700/30">
                    <h3 className="text-xl font-bold text-orange-300 mb-4">
                      🔢 Demostración: Semáforos con Contadores
                    </h3>
                    
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setSemRunning(!semRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          semRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {semRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {semRunning ? "Pausar" : "Iniciar"}
                      </button>
                      <button
                        onClick={resetSemaphore}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-700 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[semSpeed]}
                          onValueChange={(v) => setSemSpeed(v[0])}
                          min={200}
                          max={2000}
                          step={100}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-400 w-16">{semSpeed}ms</span>
                      </div>
                    </div>

                    {/* Contador del Semáforo */}
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600 mb-4">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3 text-center">
                        Contador del Semáforo
                      </h4>
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-6xl font-bold text-orange-400">
                          {semCounter}
                        </div>
                        <div className="text-2xl text-gray-400">/</div>
                        <div className="text-4xl text-gray-500">
                          {semMaxCounter}
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-400 mt-2">
                        Recursos disponibles
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Threads Esperando */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-amber-300 mb-3">
                          ⏳ Threads Esperando ({semWaitingThreads.length})
                        </h4>
                        <div className="space-y-1">
                          {semWaitingThreads.map((thread, idx) => (
                            <div
                              key={idx}
                              className="bg-amber-900/30 px-3 py-2 rounded border border-amber-700/50 text-center"
                            >
                              Thread {thread}
                            </div>
                          ))}
                          {semWaitingThreads.length === 0 && (
                            <div className="text-gray-500 text-xs italic text-center">
                              No hay threads esperando
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Threads Activos */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-emerald-300 mb-3">
                          ⚙️ Threads Activos ({semActiveThreads.length}/{semMaxCounter})
                        </h4>
                        <div className="space-y-1">
                          {semActiveThreads.map((thread, idx) => (
                            <div
                              key={idx}
                              className="bg-emerald-900/30 px-3 py-2 rounded border border-emerald-700/50 text-center"
                            >
                              Thread {thread}
                            </div>
                          ))}
                          {semActiveThreads.length === 0 && (
                            <div className="text-gray-500 text-xs italic text-center">
                              No hay threads activos
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Log de Eventos</h4>
                      <div
                        ref={semLogRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {semLog.map((entry) => (
                          <div
                            key={entry.id}
                            className={`${
                              entry.type === "success"
                                ? "text-emerald-400"
                                : entry.type === "warning"
                                ? "text-amber-400"
                                : entry.type === "error"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {entry.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: Connection Pooling */}
                <TabsContent value="demo-pool" className="space-y-4">
                  <div className="bg-gradient-to-br from-cyan-900/20 to-slate-900/50 p-6 rounded-lg border border-cyan-700/30">
                    <h3 className="text-xl font-bold text-cyan-300 mb-4">
                      🏊 Demostración: Connection Pooling
                    </h3>
                    
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setPoolRunning(!poolRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          poolRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {poolRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {poolRunning ? "Pausar" : "Iniciar"}
                      </button>
                      <button
                        onClick={resetPool}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-700 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[poolSpeed]}
                          onValueChange={(v) => setPoolSpeed(v[0])}
                          min={200}
                          max={2000}
                          step={100}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-400 w-16">{poolSpeed}ms</span>
                      </div>
                    </div>

                    {/* Pool de Conexiones */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600 mb-4">
                      <h4 className="text-sm font-semibold text-cyan-300 mb-3">
                        🏊 Connection Pool (5 conexiones)
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {poolConnections.map((conn) => (
                          <div
                            key={conn.id}
                            className={`p-3 rounded-lg border transition-all ${
                              conn.inUse
                                ? "bg-emerald-900/30 border-emerald-600"
                                : "bg-cyan-900/30 border-cyan-700"
                            }`}
                          >
                            <div className="text-center font-semibold mb-1">
                              Conn {conn.id}
                            </div>
                            <div className="text-xs text-center text-gray-400 mb-2">
                              {conn.inUse ? `Thread ${conn.thread}` : "Disponible"}
                            </div>
                            {/* Barra de salud */}
                            <div className="bg-slate-900 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  conn.health > 80
                                    ? "bg-emerald-500"
                                    : conn.health > 50
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${conn.health}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-center text-gray-500 mt-1">
                              {conn.health}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Threads Esperando */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-amber-300 mb-3">
                          ⏳ Threads Esperando ({poolWaitingThreads.length})
                        </h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {poolWaitingThreads.map((thread, idx) => (
                            <div
                              key={idx}
                              className="bg-amber-900/30 px-3 py-1 rounded border border-amber-700/50 text-center text-sm"
                            >
                              Thread {thread}
                            </div>
                          ))}
                          {poolWaitingThreads.length === 0 && (
                            <div className="text-gray-500 text-xs italic text-center py-4">
                              No hay threads esperando
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Estadísticas */}
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-semibold text-cyan-300 mb-3">
                          📊 Estadísticas
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Peticiones:</span>
                            <span className="font-semibold text-cyan-400">{poolRequests}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Conexiones en uso:</span>
                            <span className="font-semibold text-emerald-400">
                              {poolConnections.filter(c => c.inUse).length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Disponibles:</span>
                            <span className="font-semibold text-cyan-400">
                              {poolConnections.filter(c => !c.inUse).length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Utilización:</span>
                            <span className="font-semibold text-amber-400">
                              {Math.round((poolConnections.filter(c => c.inUse).length / poolConnections.length) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Log de Eventos</h4>
                      <div
                        ref={poolLogRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {poolLog.map((entry) => (
                          <div
                            key={entry.id}
                            className={`${
                              entry.type === "success"
                                ? "text-emerald-400"
                                : entry.type === "warning"
                                ? "text-amber-400"
                                : entry.type === "error"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {entry.message}
                          </div>
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