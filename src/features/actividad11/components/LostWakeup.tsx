import { BookOpen, Code, Play, Pause, RotateCcw, TrendingDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";

interface LogEntry {
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export default function LostWakeup() {
  // Estado para Demo 1: Condition Variables
  const [cvRunning, setCvRunning] = useState(false);
  const [cvSpeed, setCvSpeed] = useState(800);
  const [cvPhase, setCvPhase] = useState(0);
  const [cvCondition, setCvCondition] = useState(false);
  const [cvWaiterState, setCvWaiterState] = useState<"checking" | "waiting" | "processing" | "done">("checking");
  const [cvSignalerState, setCvSignalerState] = useState<"idle" | "preparing" | "signaling" | "done">("idle");
  const [cvLogs, setCvLogs] = useState<LogEntry[]>([]);

  // Estado para Demo 2: Semáforos
  const [semRunning, setSemRunning] = useState(false);
  const [semSpeed, setSemSpeed] = useState(800);
  const [semPhase, setSemPhase] = useState(0);
  const [semCounter, setSemCounter] = useState(0);
  const [semWaiterState, setSemWaiterState] = useState<"waiting" | "acquired" | "processing" | "done">("waiting");
  const [semSignalerState, setSemSignalerState] = useState<"idle" | "posting" | "done">("idle");
  const [semLogs, setSemLogs] = useState<LogEntry[]>([]);

  // Estado para Demo 3: State Tracking
  const [stateRunning, setStateRunning] = useState(false);
  const [stateSpeed, setStateSpeed] = useState(800);
  const [statePhase, setStatePhase] = useState(0);
  const [stateEventOccurred, setStateEventOccurred] = useState(false);
  const [stateData, setStateData] = useState(0);
  const [stateWaiterState, setStateWaiterState] = useState<"checking" | "waiting" | "processing" | "done">("checking");
  const [stateSignalerState, setStateSignalerState] = useState<"idle" | "marking" | "done">("idle");
  const [stateLogs, setStateLogs] = useState<LogEntry[]>([]);

  // Estado para Demo 4: Broadcast
  const [broadcastRunning, setBroadcastRunning] = useState(false);
  const [broadcastSpeed, setBroadcastSpeed] = useState(800);
  const [broadcastPhase, setBroadcastPhase] = useState(0);
  const [broadcastCondition, setBroadcastCondition] = useState(false);
  const [broadcastWaiters, setBroadcastWaiters] = useState([
    { id: 1, state: "waiting" as "waiting" | "awakened" | "done" },
    { id: 2, state: "waiting" as "waiting" | "awakened" | "done" },
    { id: 3, state: "waiting" as "waiting" | "awakened" | "done" },
  ]);
  const [broadcastSignalerState, setBroadcastSignalerState] = useState<"idle" | "broadcasting" | "done">("idle");
  const [broadcastLogs, setBroadcastLogs] = useState<LogEntry[]>([]);

  // Estado para Demo 5: Timeout
  const [timeoutRunning, setTimeoutRunning] = useState(false);
  const [timeoutSpeed, setTimeoutSpeed] = useState(800);
  const [timeoutPhase, setTimeoutPhase] = useState(0);
  const [timeoutCondition, setTimeoutCondition] = useState(false);
  const [timeoutWaiterState, setTimeoutWaiterState] = useState<"waiting" | "timeout" | "success" | "done">("waiting");
  const [timeoutCounter, setTimeoutCounter] = useState(5);
  const [timeoutSignalArrives, setTimeoutSignalArrives] = useState(false);
  const [timeoutLogs, setTimeoutLogs] = useState<LogEntry[]>([]);

  // Refs para auto-scroll
  const cvLogsRef = useRef<HTMLDivElement>(null);
  const semLogsRef = useRef<HTMLDivElement>(null);
  const stateLogsRef = useRef<HTMLDivElement>(null);
  const broadcastLogsRef = useRef<HTMLDivElement>(null);
  const timeoutLogsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effects
  useEffect(() => {
    if (cvLogsRef.current) {
      cvLogsRef.current.scrollTop = cvLogsRef.current.scrollHeight;
    }
  }, [cvLogs]);

  useEffect(() => {
    if (semLogsRef.current) {
      semLogsRef.current.scrollTop = semLogsRef.current.scrollHeight;
    }
  }, [semLogs]);

  useEffect(() => {
    if (stateLogsRef.current) {
      stateLogsRef.current.scrollTop = stateLogsRef.current.scrollHeight;
    }
  }, [stateLogs]);

  useEffect(() => {
    if (broadcastLogsRef.current) {
      broadcastLogsRef.current.scrollTop = broadcastLogsRef.current.scrollHeight;
    }
  }, [broadcastLogs]);

  useEffect(() => {
    if (timeoutLogsRef.current) {
      timeoutLogsRef.current.scrollTop = timeoutLogsRef.current.scrollHeight;
    }
  }, [timeoutLogs]);

  // Simulación Demo 1: Condition Variables
  useEffect(() => {
    if (!cvRunning) return;

    const timer = setTimeout(() => {
      setCvPhase((prev) => {
        const next = prev + 1;

        if (next === 1) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Iniciando...", type: "info" }]);
          setCvWaiterState("checking");
        } else if (next === 2) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Adquiriendo mutex...", type: "info" }]);
        } else if (next === 3) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Verificando condición (false)", type: "warning" }]);
        } else if (next === 4) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Esperando en CV (libera mutex)...", type: "info" }]);
          setCvWaiterState("waiting");
        } else if (next === 5) {
          setCvLogs((l) => [...l, { message: "Thread Signaler: Iniciando...", type: "success" }]);
          setCvSignalerState("preparing");
        } else if (next === 6) {
          setCvLogs((l) => [...l, { message: "Thread Signaler: Adquiriendo mutex...", type: "success" }]);
        } else if (next === 7) {
          setCvCondition(true);
          setCvLogs((l) => [...l, { message: "Thread Signaler: Condición = true", type: "success" }]);
        } else if (next === 8) {
          setCvLogs((l) => [...l, { message: "Thread Signaler: pthread_cond_signal()", type: "success" }]);
          setCvSignalerState("signaling");
        } else if (next === 9) {
          setCvLogs((l) => [...l, { message: "Thread Signaler: Liberando mutex", type: "success" }]);
          setCvSignalerState("done");
        } else if (next === 10) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Despertando, re-adquiriendo mutex...", type: "info" }]);
        } else if (next === 11) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Re-verificando condición (true) ✓", type: "success" }]);
          setCvWaiterState("processing");
        } else if (next === 12) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Procesando datos...", type: "success" }]);
        } else if (next === 13) {
          setCvLogs((l) => [...l, { message: "Thread Waiter: Liberando mutex", type: "success" }]);
        } else if (next === 14) {
          setCvLogs((l) => [...l, { message: "✅ Sincronización completa - No lost wakeup!", type: "success" }]);
          setCvWaiterState("done");
          setCvRunning(false);
          return next;
        }

        return next;
      });
    }, cvSpeed);

    return () => clearTimeout(timer);
  }, [cvRunning, cvPhase, cvSpeed]);

  // Simulación Demo 2: Semáforos
  useEffect(() => {
    if (!semRunning) return;

    const timer = setTimeout(() => {
      setSemPhase((prev) => {
        const next = prev + 1;

        if (next === 1) {
          setSemLogs((l) => [...l, { message: "Thread Waiter: Iniciando...", type: "info" }]);
        } else if (next === 2) {
          setSemLogs((l) => [...l, { message: "Thread Waiter: sem_wait() - bloqueando (contador=0)", type: "warning" }]);
          setSemWaiterState("waiting");
        } else if (next === 3) {
          setSemLogs((l) => [...l, { message: "Thread Signaler: Iniciando...", type: "success" }]);
          setSemSignalerState("posting");
        } else if (next === 4) {
          setSemCounter(1);
          setSemLogs((l) => [...l, { message: "Thread Signaler: sem_post() - contador: 0→1", type: "success" }]);
        } else if (next === 5) {
          setSemLogs((l) => [...l, { message: "Thread Signaler: Señal enviada ✓", type: "success" }]);
          setSemSignalerState("done");
        } else if (next === 6) {
          setSemCounter(0);
          setSemLogs((l) => [...l, { message: "Thread Waiter: Despertando, sem_wait() éxito - contador: 1→0", type: "info" }]);
          setSemWaiterState("acquired");
        } else if (next === 7) {
          setSemLogs((l) => [...l, { message: "Thread Waiter: Procesando datos...", type: "success" }]);
          setSemWaiterState("processing");
        } else if (next === 8) {
          setSemLogs((l) => [...l, { message: "✅ Semáforo preservó señal - No lost wakeup!", type: "success" }]);
          setSemWaiterState("done");
          setSemRunning(false);
          return next;
        }

        return next;
      });
    }, semSpeed);

    return () => clearTimeout(timer);
  }, [semRunning, semPhase, semSpeed]);

  // Simulación Demo 3: State Tracking
  useEffect(() => {
    if (!stateRunning) return;

    const timer = setTimeout(() => {
      setStatePhase((prev) => {
        const next = prev + 1;

        if (next === 1) {
          setStateLogs((l) => [...l, { message: "Thread Signaler: Iniciando primero...", type: "success" }]);
          setStateSignalerState("marking");
        } else if (next === 2) {
          setStateLogs((l) => [...l, { message: "Thread Signaler: Adquiriendo mutex...", type: "success" }]);
        } else if (next === 3) {
          setStateEventOccurred(true);
          setStateData(42);
          setStateLogs((l) => [...l, { message: "Thread Signaler: event_occurred = true, data = 42", type: "success" }]);
        } else if (next === 4) {
          setStateLogs((l) => [...l, { message: "Thread Signaler: Señalizando...", type: "success" }]);
        } else if (next === 5) {
          setStateLogs((l) => [...l, { message: "Thread Signaler: Liberando mutex", type: "success" }]);
          setStateSignalerState("done");
        } else if (next === 6) {
          setStateLogs((l) => [...l, { message: "Thread Waiter: Iniciando (después de signaler)...", type: "info" }]);
          setStateWaiterState("checking");
        } else if (next === 7) {
          setStateLogs((l) => [...l, { message: "Thread Waiter: Adquiriendo mutex...", type: "info" }]);
        } else if (next === 8) {
          setStateLogs((l) => [...l, { message: "Thread Waiter: Verificando event_occurred (true) ✓", type: "success" }]);
        } else if (next === 9) {
          setStateLogs((l) => [...l, { message: "Thread Waiter: Estado persistió - NO espera!", type: "success" }]);
          setStateWaiterState("processing");
        } else if (next === 10) {
          setStateLogs((l) => [...l, { message: `Thread Waiter: Procesando data=${stateData}`, type: "success" }]);
        } else if (next === 11) {
          setStateLogs((l) => [...l, { message: "Thread Waiter: Liberando mutex", type: "success" }]);
        } else if (next === 12) {
          setStateLogs((l) => [...l, { message: "✅ Estado rastreado - Señal no se perdió!", type: "success" }]);
          setStateWaiterState("done");
          setStateRunning(false);
          return next;
        }

        return next;
      });
    }, stateSpeed);

    return () => clearTimeout(timer);
  }, [stateRunning, statePhase, stateSpeed, stateData]);

  // Simulación Demo 4: Broadcast
  useEffect(() => {
    if (!broadcastRunning) return;

    const timer = setTimeout(() => {
      setBroadcastPhase((prev) => {
        const next = prev + 1;

        if (next === 1) {
          setBroadcastLogs((l) => [...l, { message: "3 Threads Waiters iniciando...", type: "info" }]);
        } else if (next === 2) {
          setBroadcastLogs((l) => [...l, { message: "Thread 1: Esperando en CV...", type: "info" }]);
        } else if (next === 3) {
          setBroadcastLogs((l) => [...l, { message: "Thread 2: Esperando en CV...", type: "info" }]);
        } else if (next === 4) {
          setBroadcastLogs((l) => [...l, { message: "Thread 3: Esperando en CV...", type: "info" }]);
        } else if (next === 5) {
          setBroadcastLogs((l) => [...l, { message: "Thread Signaler: Iniciando...", type: "success" }]);
          setBroadcastSignalerState("broadcasting");
        } else if (next === 6) {
          setBroadcastCondition(true);
          setBroadcastLogs((l) => [...l, { message: "Thread Signaler: Condición = true", type: "success" }]);
        } else if (next === 7) {
          setBroadcastLogs((l) => [...l, { message: "Thread Signaler: pthread_cond_broadcast() 📢", type: "success" }]);
        } else if (next === 8) {
          setBroadcastWaiters((w) => w.map((waiter, i) => i === 0 ? { ...waiter, state: "awakened" } : waiter));
          setBroadcastLogs((l) => [...l, { message: "Thread 1: Despertando... ✓", type: "success" }]);
        } else if (next === 9) {
          setBroadcastWaiters((w) => w.map((waiter, i) => i === 1 ? { ...waiter, state: "awakened" } : waiter));
          setBroadcastLogs((l) => [...l, { message: "Thread 2: Despertando... ✓", type: "success" }]);
        } else if (next === 10) {
          setBroadcastWaiters((w) => w.map((waiter, i) => i === 2 ? { ...waiter, state: "awakened" } : waiter));
          setBroadcastLogs((l) => [...l, { message: "Thread 3: Despertando... ✓", type: "success" }]);
        } else if (next === 11) {
          setBroadcastSignalerState("done");
          setBroadcastLogs((l) => [...l, { message: "Thread Signaler: Broadcast completado", type: "success" }]);
        } else if (next === 12) {
          setBroadcastWaiters((w) => w.map((waiter, i) => i === 0 ? { ...waiter, state: "done" } : waiter));
          setBroadcastLogs((l) => [...l, { message: "Thread 1: Procesamiento completo", type: "success" }]);
        } else if (next === 13) {
          setBroadcastWaiters((w) => w.map((waiter, i) => i === 1 ? { ...waiter, state: "done" } : waiter));
          setBroadcastLogs((l) => [...l, { message: "Thread 2: Procesamiento completo", type: "success" }]);
        } else if (next === 14) {
          setBroadcastWaiters((w) => w.map((waiter, i) => i === 2 ? { ...waiter, state: "done" } : waiter));
          setBroadcastLogs((l) => [...l, { message: "Thread 3: Procesamiento completo", type: "success" }]);
        } else if (next === 15) {
          setBroadcastLogs((l) => [...l, { message: "✅ Broadcast despertó TODOS los threads!", type: "success" }]);
          setBroadcastRunning(false);
          return next;
        }

        return next;
      });
    }, broadcastSpeed);

    return () => clearTimeout(timer);
  }, [broadcastRunning, broadcastPhase, broadcastSpeed]);

  // Simulación Demo 5: Timeout
  useEffect(() => {
    if (!timeoutRunning) return;

    const timer = setTimeout(() => {
      setTimeoutPhase((prev) => {
        const next = prev + 1;

        if (next === 1) {
          setTimeoutLogs((l) => [...l, { message: "Thread Waiter: Iniciando con timeout de 5s...", type: "info" }]);
          setTimeoutWaiterState("waiting");
          setTimeoutCounter(5);
        } else if (next >= 2 && next <= 6) {
          const remaining = 6 - next;
          setTimeoutCounter(remaining);
          setTimeoutLogs((l) => [...l, { message: `Thread Waiter: Esperando... (${remaining}s restantes)`, type: "warning" }]);
        } else if (next === 7) {
          if (timeoutSignalArrives) {
            setTimeoutCondition(true);
            setTimeoutLogs((l) => [...l, { message: "Thread Signaler: Señal enviada a tiempo! ✓", type: "success" }]);
            setTimeoutWaiterState("success");
          } else {
            setTimeoutLogs((l) => [...l, { message: "⏱️ TIMEOUT! Condición no cumplida en 5 segundos", type: "error" }]);
            setTimeoutWaiterState("timeout");
          }
        } else if (next === 8) {
          if (timeoutSignalArrives) {
            setTimeoutLogs((l) => [...l, { message: "Thread Waiter: Procesando datos...", type: "success" }]);
          } else {
            setTimeoutLogs((l) => [...l, { message: "Thread Waiter: Recovery - continuando sin dato", type: "warning" }]);
          }
        } else if (next === 9) {
          if (timeoutSignalArrives) {
            setTimeoutLogs((l) => [...l, { message: "✅ Datos recibidos antes del timeout!", type: "success" }]);
          } else {
            setTimeoutLogs((l) => [...l, { message: "❌ Timeout detectó problema - evitó deadlock!", type: "warning" }]);
          }
          setTimeoutWaiterState("done");
          setTimeoutRunning(false);
          return next;
        }

        return next;
      });
    }, timeoutSpeed);

    return () => clearTimeout(timer);
  }, [timeoutRunning, timeoutPhase, timeoutSpeed, timeoutSignalArrives]);

  // Reset functions
  const resetCv = () => {
    setCvRunning(false);
    setCvPhase(0);
    setCvCondition(false);
    setCvWaiterState("checking");
    setCvSignalerState("idle");
    setCvLogs([]);
  };

  const resetSem = () => {
    setSemRunning(false);
    setSemPhase(0);
    setSemCounter(0);
    setSemWaiterState("waiting");
    setSemSignalerState("idle");
    setSemLogs([]);
  };

  const resetState = () => {
    setStateRunning(false);
    setStatePhase(0);
    setStateEventOccurred(false);
    setStateData(0);
    setStateWaiterState("checking");
    setStateSignalerState("idle");
    setStateLogs([]);
  };

  const resetBroadcast = () => {
    setBroadcastRunning(false);
    setBroadcastPhase(0);
    setBroadcastCondition(false);
    setBroadcastWaiters([
      { id: 1, state: "waiting" },
      { id: 2, state: "waiting" },
      { id: 3, state: "waiting" },
    ]);
    setBroadcastSignalerState("idle");
    setBroadcastLogs([]);
  };

  const resetTimeout = () => {
    setTimeoutRunning(false);
    setTimeoutPhase(0);
    setTimeoutCondition(false);
    setTimeoutWaiterState("waiting");
    setTimeoutCounter(5);
    setTimeoutSignalArrives(false);
    setTimeoutLogs([]);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-b border-pink-700/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-600 rounded-lg">
              <BookOpen className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Lost Wakeup Problem
              </h1>
              <p className="text-gray-300 mt-2">
                Problema donde un thread pierde una señal de wake-up porque llegó antes de que el thread estuviera esperando
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-pink-700/30">
            <h2 className="text-xl font-semibold text-pink-300 mb-3">
              ¿Qué es Lost Wakeup?
            </h2>
            <p className="text-gray-300 mb-4">
              El problema de Lost Wakeup ocurre cuando un thread señaliza (wakeup) a otro thread antes de que este último 
              comience a esperar. La señal se "pierde" porque no hay nadie esperándola, y el thread que eventualmente 
              espera puede bloquearse indefinidamente.
            </p>
            <div className="bg-pink-900/20 p-4 rounded border border-pink-600/30">
              <h3 className="font-semibold text-pink-300 mb-2">Escenario Problemático:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                <li>Thread A verifica condición (falsa), decide esperar</li>
                <li>Thread B cambia condición, envía señal (pero A aún no está esperando)</li>
                <li>Thread A comienza a esperar (señal ya se perdió)</li>
                <li>Thread A queda bloqueado indefinidamente</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* ACCORDION DE PSEUDOCÓDIGOS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="single" defaultValue="pseudocodes" collapsible className="space-y-4">
          <AccordionItem value="pseudocodes" className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <Code className="size-6 text-pink-400" />
                <span className="text-2xl font-semibold text-white">Pseudocódigos de Soluciones</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Tabs defaultValue="cv" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="cv" className="data-[state=active]:bg-pink-600">
                    Condition Variables
                  </TabsTrigger>
                  <TabsTrigger value="semaphore" className="data-[state=active]:bg-pink-600">
                    Semáforos
                  </TabsTrigger>
                  <TabsTrigger value="state" className="data-[state=active]:bg-pink-600">
                    State Tracking
                  </TabsTrigger>
                  <TabsTrigger value="broadcast" className="data-[state=active]:bg-pink-600">
                    Broadcast
                  </TabsTrigger>
                  <TabsTrigger value="timeout" className="data-[state=active]:bg-pink-600">
                    Timeout
                  </TabsTrigger>
                </TabsList>

                {/* Solución 1: Condition Variables Correctamente */}
                <TabsContent value="cv" className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-slate-800/20 p-6 rounded-lg border border-blue-700/50">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                      <span className="text-3xl">🔒</span>
                      Solución 1: Condition Variables Correctamente
                    </h3>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 mb-4">
                        Uso correcto de condition variables con mutex para garantizar atomicidad entre 
                        verificación de condición y espera. La clave es mantener el mutex durante toda 
                        la operación crítica.
                      </p>
                    </div>

                    {/* Conceptos Clave */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-600/30 mb-6">
                      <h4 className="font-semibold text-blue-300 mb-3">Conceptos Clave:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Mutex + Condition Variable:</strong> Siempre usados juntos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Atomicidad:</strong> wait() libera mutex atómicamente al esperar</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>While Loop:</strong> Re-verificar condición después de despertar</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Signal bajo Lock:</strong> Señalizar con mutex adquirido</span>
                        </li>
                      </ul>
                    </div>

                    {/* Estructuras de Datos */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-3">Estructuras de Datos:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-green-400 overflow-x-auto">
{`struct SharedState {
    pthread_mutex_t mutex;        // Mutex para proteger estado
    pthread_cond_t  cond_var;     // Condition variable
    bool            condition;     // Condición que esperamos
    int             data;          // Datos compartidos
    bool            ready;         // Estado de preparación
};

// Inicialización
void init_shared_state(SharedState* state) {
    pthread_mutex_init(&state->mutex, NULL);
    pthread_cond_init(&state->cond_var, NULL);
    state->condition = false;
    state->data = 0;
    state->ready = false;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Función Waiter */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-3">Thread Waiter (Consumer):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-cyan-400 overflow-x-auto">
{`void* waiter_thread(void* arg) {
    SharedState* state = (SharedState*)arg;
    
    // 1. Adquirir mutex ANTES de verificar condición
    pthread_mutex_lock(&state->mutex);
    
    // 2. Esperar mientras condición no se cumpla (WHILE, no IF)
    while (!state->condition) {
        // wait() hace 3 cosas ATÓMICAMENTE:
        // a) Libera el mutex
        // b) Pone thread en cola de espera
        // c) Al despertar, re-adquiere el mutex
        pthread_cond_wait(&state->cond_var, &state->mutex);
        
        // Al despertar, tenemos el mutex nuevamente
        // Re-verificamos condición por spurious wakeups
    }
    
    // 3. Condición es verdadera, procesamos datos
    printf("Condición cumplida, data = %d\\n", state->data);
    
    // 4. Modificar estado si necesario
    state->ready = true;
    
    // 5. Liberar mutex
    pthread_mutex_unlock(&state->mutex);
    
    return NULL;
}

// Ejemplo con timeout
int waiter_with_timeout(SharedState* state, int seconds) {
    struct timespec timeout;
    clock_gettime(CLOCK_REALTIME, &timeout);
    timeout.tv_sec += seconds;
    
    pthread_mutex_lock(&state->mutex);
    
    int result = 0;
    while (!state->condition && result == 0) {
        result = pthread_cond_timedwait(
            &state->cond_var,
            &state->mutex,
            &timeout
        );
    }
    
    if (result == ETIMEDOUT) {
        printf("Timeout esperando condición\\n");
        pthread_mutex_unlock(&state->mutex);
        return -1;
    }
    
    // Condición cumplida
    printf("Data recibida: %d\\n", state->data);
    pthread_mutex_unlock(&state->mutex);
    return 0;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Función Signaler */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-3">Thread Signaler (Producer):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-yellow-400 overflow-x-auto">
{`void* signaler_thread(void* arg) {
    SharedState* state = (SharedState*)arg;
    
    // Simular trabajo
    sleep(1);
    
    // 1. Adquirir mutex ANTES de modificar estado
    pthread_mutex_lock(&state->mutex);
    
    // 2. Modificar condición y datos
    state->data = 42;
    state->condition = true;
    
    printf("Condición establecida, señalizando...\\n");
    
    // 3. Señalizar (con mutex adquirido)
    // pthread_cond_signal():  Despierta 1 thread
    // pthread_cond_broadcast(): Despierta TODOS los threads
    pthread_cond_signal(&state->cond_var);
    
    // 4. Liberar mutex
    pthread_mutex_unlock(&state->mutex);
    
    // Nota: El waiter despertará DESPUÉS de que liberemos el mutex
    // Si intentara despertar antes, tendría que esperar el mutex
    
    return NULL;
}

// Versión con múltiples waiters
void signal_all_waiters(SharedState* state, int new_data) {
    pthread_mutex_lock(&state->mutex);
    
    state->data = new_data;
    state->condition = true;
    
    // Broadcast despierta TODOS los threads esperando
    pthread_cond_broadcast(&state->cond_var);
    
    pthread_mutex_unlock(&state->mutex);
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Programa Principal */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-3">Programa Principal:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-purple-400 overflow-x-auto">
{`int main() {
    SharedState state;
    pthread_t waiter, signaler;
    
    // Inicializar
    init_shared_state(&state);
    
    // Crear threads en cualquier orden
    // (El orden NO importa con condition variables correctas)
    pthread_create(&waiter, NULL, waiter_thread, &state);
    pthread_create(&signaler, NULL, signaler_thread, &state);
    
    // Esperar ambos threads
    pthread_join(waiter, NULL);
    pthread_join(signaler, NULL);
    
    // Cleanup
    pthread_mutex_destroy(&state.mutex);
    pthread_cond_destroy(&state.cond_var);
    
    return 0;
}

// Ejemplo con múltiples waiters
int main_multiple_waiters() {
    SharedState state;
    pthread_t waiters[3], signaler;
    
    init_shared_state(&state);
    
    // Crear múltiples waiters
    for (int i = 0; i < 3; i++) {
        pthread_create(&waiters[i], NULL, waiter_thread, &state);
    }
    
    // Crear signaler
    pthread_create(&signaler, NULL, signaler_thread, &state);
    
    // Join todos
    for (int i = 0; i < 3; i++) {
        pthread_join(waiters[i], NULL);
    }
    pthread_join(signaler, NULL);
    
    pthread_mutex_destroy(&state.mutex);
    pthread_cond_destroy(&state.cond_var);
    
    return 0;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Patrones Incorrectos */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-red-300 mb-3">❌ Patrones Incorrectos (Causan Lost Wakeup):</h4>
                      <div className="bg-red-950/30 p-4 rounded-lg border border-red-600/30">
                        <pre className="text-sm text-red-400 overflow-x-auto">
{`// ERROR 1: Verificar sin mutex
void bad_waiter_1() {
    // ❌ Race condition entre check y wait
    if (!condition) {
        pthread_mutex_lock(&mutex);
        pthread_cond_wait(&cond_var, &mutex);  // Puede perder signal
        pthread_mutex_unlock(&mutex);
    }
}

// ERROR 2: Usar IF en lugar de WHILE
void bad_waiter_2() {
    pthread_mutex_lock(&mutex);
    if (!condition) {  // ❌ Debería ser WHILE
        pthread_cond_wait(&cond_var, &mutex);
        // No re-verifica después de spurious wakeup
    }
    pthread_mutex_unlock(&mutex);
}

// ERROR 3: No mantener mutex al señalizar
void bad_signaler() {
    condition = true;  // ❌ Modificar sin mutex
    pthread_cond_signal(&cond_var);  // ❌ Signal sin mutex
}

// ERROR 4: Liberar mutex antes de wait
void bad_waiter_3() {
    pthread_mutex_lock(&mutex);
    if (!condition) {
        pthread_mutex_unlock(&mutex);  // ❌ Libera antes de wait
        pthread_cond_wait(&cond_var, &mutex);  // Race condition
    }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Patrón Correcto */}
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-600/30">
                      <h4 className="font-semibold text-green-300 mb-3">✅ Patrón Correcto Completo:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg">
                        <pre className="text-sm text-green-400 overflow-x-auto">
{`// WAITER: Patrón correcto
pthread_mutex_lock(&mutex);
while (!condition) {              // WHILE, no IF
    pthread_cond_wait(&cv, &mutex);  // Atomic unlock + wait
}
// Hacer trabajo con condición cumplida
pthread_mutex_unlock(&mutex);

// SIGNALER: Patrón correcto
pthread_mutex_lock(&mutex);
condition = true;                 // Modificar bajo lock
pthread_cond_signal(&cv);         // Signal bajo lock
pthread_mutex_unlock(&mutex);

// Propiedades garantizadas:
// 1. No lost wakeups (signal nunca se pierde)
// 2. No spurious wakeups ignorados (while loop)
// 3. No race conditions (todo bajo mutex)
// 4. Ordenamiento correcto (mutex garantiza happens-before)`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 2: Semáforos en lugar de Signals */}
                <TabsContent value="semaphore" className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/20 to-slate-800/20 p-6 rounded-lg border border-purple-700/50">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <span className="text-3xl">🚦</span>
                      Solución 2: Semáforos en lugar de Signals
                    </h3>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 mb-4">
                        Los semáforos tienen un contador interno que "recuerda" signals previos, evitando 
                        el problema de lost wakeup. Si se señaliza antes de esperar, el contador se incrementa 
                        y el wait posterior será inmediato.
                      </p>
                    </div>

                    {/* Conceptos Clave */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-600/30 mb-6">
                      <h4 className="font-semibold text-purple-300 mb-3">Conceptos Clave:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Contador Persistente:</strong> Semáforo mantiene cuenta de signals</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>sem_post():</strong> Incrementa contador (signal)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>sem_wait():</strong> Decrementa contador o bloquea si es 0</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>No Lost Signals:</strong> Signals previos se preservan</span>
                        </li>
                      </ul>
                    </div>

                    {/* Estructuras de Datos */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Estructuras de Datos:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-green-400 overflow-x-auto">
{`#include <semaphore.h>
#include <pthread.h>

struct SemaphoreState {
    sem_t       semaphore;     // Semáforo para sincronización
    pthread_mutex_t mutex;     // Mutex para proteger datos
    int         data;          // Datos compartidos
    bool        ready;         // Estado adicional
};

// Inicialización
void init_semaphore_state(SemaphoreState* state) {
    // Inicializar semáforo en 0 (bloqueado inicialmente)
    // Parámetros: sem, pshared, initial_value
    sem_init(&state->semaphore, 0, 0);
    
    pthread_mutex_init(&state->mutex, NULL);
    state->data = 0;
    state->ready = false;
}

// Cleanup
void destroy_semaphore_state(SemaphoreState* state) {
    sem_destroy(&state->semaphore);
    pthread_mutex_destroy(&state->mutex);
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Patrón Básico */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Patrón Básico (Sincronización Simple):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-cyan-400 overflow-x-auto">
{`void* waiter_thread(void* arg) {
    SemaphoreState* state = (SemaphoreState*)arg;
    
    printf("Waiter: Esperando señal...\\n");
    
    // Esperar señal (bloquea si contador es 0)
    // Si contador > 0, decrementa y continúa inmediatamente
    sem_wait(&state->semaphore);
    
    printf("Waiter: Señal recibida!\\n");
    
    // Leer datos (proteger con mutex si hay modificaciones)
    pthread_mutex_lock(&state->mutex);
    printf("Waiter: Data = %d\\n", state->data);
    pthread_mutex_unlock(&state->mutex);
    
    return NULL;
}

void* signaler_thread(void* arg) {
    SemaphoreState* state = (SemaphoreState*)arg;
    
    sleep(1);  // Simular trabajo
    
    // Preparar datos (proteger con mutex)
    pthread_mutex_lock(&state->mutex);
    state->data = 42;
    state->ready = true;
    pthread_mutex_unlock(&state->mutex);
    
    printf("Signaler: Enviando señal...\\n");
    
    // Incrementar contador del semáforo
    // Si hay waiters, despierta uno
    // Si no hay waiters, incrementa contador (no se pierde!)
    sem_post(&state->semaphore);
    
    printf("Signaler: Señal enviada\\n");
    
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Semáforo Counting */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Semáforo Counting (Múltiples Recursos):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-yellow-400 overflow-x-auto">
{`struct ResourcePool {
    sem_t available_resources;  // Contador de recursos disponibles
    pthread_mutex_t mutex;
    int resource_ids[10];       // Pool de recursos
    int count;
};

void init_resource_pool(ResourcePool* pool, int initial_count) {
    // Inicializar con N recursos disponibles
    sem_init(&pool->available_resources, 0, initial_count);
    pthread_mutex_init(&pool->mutex, NULL);
    pool->count = initial_count;
    
    for (int i = 0; i < initial_count; i++) {
        pool->resource_ids[i] = i;
    }
}

// Adquirir recurso
int acquire_resource(ResourcePool* pool) {
    // Esperar hasta que haya recurso disponible
    // Decrementa contador atómicamente
    sem_wait(&pool->available_resources);
    
    // Obtener recurso del pool
    pthread_mutex_lock(&pool->mutex);
    int resource_id = pool->resource_ids[--pool->count];
    pthread_mutex_unlock(&pool->mutex);
    
    printf("Thread %ld: Adquirió recurso %d\\n", 
           pthread_self(), resource_id);
    
    return resource_id;
}

// Liberar recurso
void release_resource(ResourcePool* pool, int resource_id) {
    // Devolver recurso al pool
    pthread_mutex_lock(&pool->mutex);
    pool->resource_ids[pool->count++] = resource_id;
    pthread_mutex_unlock(&pool->mutex);
    
    printf("Thread %ld: Liberó recurso %d\\n", 
           pthread_self(), resource_id);
    
    // Incrementar contador (señalizar disponibilidad)
    sem_post(&pool->available_resources);
}

void* worker_thread(void* arg) {
    ResourcePool* pool = (ResourcePool*)arg;
    
    // Adquirir recurso (puede esperar si no hay disponibles)
    int resource = acquire_resource(pool);
    
    // Usar recurso
    sleep(2);
    printf("Thread %ld: Usando recurso %d\\n", 
           pthread_self(), resource);
    
    // Liberar recurso
    release_resource(pool, resource);
    
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Patrón Producer-Consumer */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Producer-Consumer con Semáforos:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-orange-400 overflow-x-auto">
{`#define BUFFER_SIZE 10

struct BoundedBuffer {
    sem_t empty_slots;   // Contador de espacios vacíos
    sem_t full_slots;    // Contador de items disponibles
    pthread_mutex_t mutex;
    int buffer[BUFFER_SIZE];
    int in;              // Índice de inserción
    int out;             // Índice de extracción
};

void init_bounded_buffer(BoundedBuffer* bb) {
    sem_init(&bb->empty_slots, 0, BUFFER_SIZE);  // Inicialmente todos vacíos
    sem_init(&bb->full_slots, 0, 0);              // Inicialmente ninguno lleno
    pthread_mutex_init(&bb->mutex, NULL);
    bb->in = 0;
    bb->out = 0;
}

void produce(BoundedBuffer* bb, int item) {
    // Esperar por espacio vacío
    // Si buffer lleno, bloquea aquí
    sem_wait(&bb->empty_slots);
    
    // Insertar item (proteger con mutex)
    pthread_mutex_lock(&bb->mutex);
    bb->buffer[bb->in] = item;
    bb->in = (bb->in + 1) % BUFFER_SIZE;
    printf("Produced: %d\\n", item);
    pthread_mutex_unlock(&bb->mutex);
    
    // Señalizar que hay nuevo item disponible
    sem_post(&bb->full_slots);
}

int consume(BoundedBuffer* bb) {
    // Esperar por item disponible
    // Si buffer vacío, bloquea aquí
    sem_wait(&bb->full_slots);
    
    // Extraer item (proteger con mutex)
    pthread_mutex_lock(&bb->mutex);
    int item = bb->buffer[bb->out];
    bb->out = (bb->out + 1) % BUFFER_SIZE;
    printf("Consumed: %d\\n", item);
    pthread_mutex_unlock(&bb->mutex);
    
    // Señalizar que hay nuevo espacio vacío
    sem_post(&bb->empty_slots);
    
    return item;
}

void* producer(void* arg) {
    BoundedBuffer* bb = (BoundedBuffer*)arg;
    for (int i = 0; i < 20; i++) {
        produce(bb, i);
        usleep(100000);  // 100ms
    }
    return NULL;
}

void* consumer(void* arg) {
    BoundedBuffer* bb = (BoundedBuffer*)arg;
    for (int i = 0; i < 20; i++) {
        int item = consume(bb);
        usleep(150000);  // 150ms
    }
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Semáforo con Timeout */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Semáforo con Timeout:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-pink-400 overflow-x-auto">
{`#include <time.h>
#include <errno.h>

int wait_with_timeout(sem_t* sem, int timeout_seconds) {
    struct timespec ts;
    
    // Calcular tiempo absoluto de timeout
    clock_gettime(CLOCK_REALTIME, &ts);
    ts.tv_sec += timeout_seconds;
    
    // Esperar con timeout
    int result = sem_timedwait(sem, &ts);
    
    if (result == -1) {
        if (errno == ETIMEDOUT) {
            printf("Timeout: No se recibió señal en %d segundos\\n", 
                   timeout_seconds);
            return -1;
        } else {
            perror("sem_timedwait");
            return -1;
        }
    }
    
    printf("Señal recibida dentro del timeout\\n");
    return 0;
}

void* waiter_with_timeout_thread(void* arg) {
    sem_t* sem = (sem_t*)arg;
    
    printf("Esperando señal (timeout 5s)...\\n");
    
    if (wait_with_timeout(sem, 5) == 0) {
        printf("Procesando después de recibir señal\\n");
    } else {
        printf("Procediendo sin señal (timeout)\\n");
    }
    
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Ventajas y Desventajas */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-900/20 p-4 rounded-lg border border-green-600/30">
                        <h4 className="font-semibold text-green-300 mb-3">✅ Ventajas:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• No lost wakeups (contador persiste)</li>
                          <li>• Más simple que condition variables</li>
                          <li>• No necesita loop de verificación</li>
                          <li>• Ideal para producer-consumer</li>
                          <li>• Soporte para counting semaphore</li>
                        </ul>
                      </div>
                      <div className="bg-red-900/20 p-4 rounded-lg border border-red-600/30">
                        <h4 className="font-semibold text-red-300 mb-3">❌ Limitaciones:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• No puede esperar múltiples condiciones</li>
                          <li>• No hay broadcast nativo</li>
                          <li>• Menos flexible que CV</li>
                          <li>• Difícil debugging del contador</li>
                          <li>• No es reentrant en algunos sistemas</li>
                        </ul>
                      </div>
                    </div>

                    {/* Comparación */}
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600/30">
                      <h4 className="font-semibold text-blue-300 mb-3">Comparación: Semáforo vs Condition Variable</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-blue-600/50">
                              <th className="text-left p-2 text-blue-300">Característica</th>
                              <th className="text-left p-2 text-blue-300">Semáforo</th>
                              <th className="text-left p-2 text-blue-300">Condition Variable</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            <tr className="border-b border-slate-700">
                              <td className="p-2">Lost Wakeup</td>
                              <td className="p-2 text-green-400">✓ Evita (contador)</td>
                              <td className="p-2 text-yellow-400">Requiere mutex</td>
                            </tr>
                            <tr className="border-b border-slate-700">
                              <td className="p-2">Complejidad</td>
                              <td className="p-2 text-green-400">Simple</td>
                              <td className="p-2 text-yellow-400">Media (requiere mutex)</td>
                            </tr>
                            <tr className="border-b border-slate-700">
                              <td className="p-2">Broadcast</td>
                              <td className="p-2 text-red-400">No nativo</td>
                              <td className="p-2 text-green-400">✓ Soportado</td>
                            </tr>
                            <tr className="border-b border-slate-700">
                              <td className="p-2">Múltiples Condiciones</td>
                              <td className="p-2 text-red-400">Difícil</td>
                              <td className="p-2 text-green-400">✓ Fácil</td>
                            </tr>
                            <tr>
                              <td className="p-2">Uso Típico</td>
                              <td className="p-2">Producer-Consumer</td>
                              <td className="p-2">Sincronización compleja</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 3: State Tracking */}
                <TabsContent value="state" className="space-y-4">
                  <div className="bg-gradient-to-br from-green-900/20 to-slate-800/20 p-6 rounded-lg border border-green-700/50">
                    <h3 className="text-2xl font-bold text-green-300 mb-4 flex items-center gap-2">
                      <span className="text-3xl">📊</span>
                      Solución 3: State Tracking (Seguimiento de Estado)
                    </h3>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 mb-4">
                        Mantener un estado explícito que persiste entre señalización y espera. El waiter 
                        verifica el estado antes de esperar, evitando esperas innecesarias si la condición 
                        ya se cumplió.
                      </p>
                    </div>

                    {/* Conceptos Clave */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-green-600/30 mb-6">
                      <h4 className="font-semibold text-green-300 mb-3">Conceptos Clave:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Estado Persistente:</strong> Flag booleano o contador que persiste</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Check Before Wait:</strong> Verificar estado antes de esperar</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Protección Atómica:</strong> Mutex protege estado y signal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Event History:</strong> Rastrea si evento ya ocurrió</span>
                        </li>
                      </ul>
                    </div>

                    {/* Patrón Básico */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-3">Patrón Básico (Flag Booleano):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-green-400 overflow-x-auto">
{`struct StateTracking {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    bool            event_occurred;  // ¡Clave! Persiste el estado
    int             data;
};

void init_state_tracking(StateTracking* st) {
    pthread_mutex_init(&st->mutex, NULL);
    pthread_cond_init(&st->cond_var, NULL);
    st->event_occurred = false;
    st->data = 0;
}

// WAITER: Verifica estado antes de esperar
void* waiter_thread(void* arg) {
    StateTracking* st = (StateTracking*)arg;
    
    pthread_mutex_lock(&st->mutex);
    
    // Verificar estado - si ya ocurrió, no esperamos
    while (!st->event_occurred) {
        printf("Waiter: Evento no ocurrido, esperando...\\n");
        pthread_cond_wait(&st->cond_var, &st->mutex);
    }
    
    // Evento ya ocurrió (o acabamos de recibirlo)
    printf("Waiter: Evento detectado! Data = %d\\n", st->data);
    
    // Opcional: Resetear para permitir re-uso
    st->event_occurred = false;
    
    pthread_mutex_unlock(&st->mutex);
    return NULL;
}

// SIGNALER: Establece estado y señaliza
void* signaler_thread(void* arg) {
    StateTracking* st = (StateTracking*)arg;
    
    sleep(1);
    
    pthread_mutex_lock(&st->mutex);
    
    // Establecer estado ANTES de señalizar
    st->data = 42;
    st->event_occurred = true;  // Marca que evento ocurrió
    
    printf("Signaler: Evento marcado, señalizando...\\n");
    
    pthread_cond_signal(&st->cond_var);
    
    pthread_mutex_unlock(&st->mutex);
    return NULL;
}

// Si waiter llega tarde, ve event_occurred=true y no espera
// Si waiter llega temprano, espera pero estado está protegido`}
                        </pre>
                      </div>
                    </div>

                    {/* Contador de Eventos */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-3">Tracking con Contador (Múltiples Eventos):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-cyan-400 overflow-x-auto">
{`struct EventCounter {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    int             event_count;     // Cuenta cuántos eventos ocurrieron
    int             processed_count; // Cuántos procesamos
};

void init_event_counter(EventCounter* ec) {
    pthread_mutex_init(&ec->mutex, NULL);
    pthread_cond_init(&ec->cond_var, NULL);
    ec->event_count = 0;
    ec->processed_count = 0;
}

// Producer: Incrementa contador
void signal_event(EventCounter* ec, int value) {
    pthread_mutex_lock(&ec->mutex);
    
    ec->event_count++;
    printf("Event #%d signaled\\n", ec->event_count);
    
    pthread_cond_signal(&ec->cond_var);
    
    pthread_mutex_unlock(&ec->mutex);
}

// Consumer: Procesa eventos pendientes
void* event_processor(void* arg) {
    EventCounter* ec = (EventCounter*)arg;
    
    pthread_mutex_lock(&ec->mutex);
    
    while (ec->processed_count < 10) {  // Procesar 10 eventos
        // Esperar mientras no haya eventos nuevos
        while (ec->event_count == ec->processed_count) {
            printf("Processor: Esperando eventos...\\n");
            pthread_cond_wait(&ec->cond_var, &ec->mutex);
        }
        
        // Procesar eventos pendientes
        while (ec->processed_count < ec->event_count) {
            ec->processed_count++;
            printf("Processor: Procesado evento #%d\\n", 
                   ec->processed_count);
        }
    }
    
    pthread_mutex_unlock(&ec->mutex);
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Estado Complejo */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-3">Estado Complejo (Máquina de Estados):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-yellow-400 overflow-x-auto">
{`enum TaskState {
    IDLE,
    PENDING,
    RUNNING,
    COMPLETED,
    FAILED
};

struct Task {
    pthread_mutex_t mutex;
    pthread_cond_t  state_changed;
    TaskState       state;
    int             result;
    char            error_msg[256];
};

void init_task(Task* task) {
    pthread_mutex_init(&task->mutex, NULL);
    pthread_cond_init(&task->state_changed, NULL);
    task->state = IDLE;
    task->result = 0;
    task->error_msg[0] = '\\0';
}

// Worker: Ejecuta tarea y actualiza estado
void* worker_thread(void* arg) {
    Task* task = (Task*)arg;
    
    pthread_mutex_lock(&task->mutex);
    task->state = RUNNING;
    pthread_cond_broadcast(&task->state_changed);
    pthread_mutex_unlock(&task->mutex);
    
    printf("Worker: Ejecutando tarea...\\n");
    sleep(2);  // Simular trabajo
    
    // Completar con éxito o error
    pthread_mutex_lock(&task->mutex);
    if (rand() % 2) {
        task->state = COMPLETED;
        task->result = 42;
    } else {
        task->state = FAILED;
        strcpy(task->error_msg, "Error simulado");
    }
    pthread_cond_broadcast(&task->state_changed);
    pthread_mutex_unlock(&task->mutex);
    
    return NULL;
}

// Waiter: Espera estado específico
TaskState wait_for_completion(Task* task) {
    pthread_mutex_lock(&task->mutex);
    
    // Esperar hasta que tarea complete (éxito o error)
    while (task->state != COMPLETED && task->state != FAILED) {
        printf("Waiting for task completion...\\n");
        pthread_cond_wait(&task->state_changed, &task->mutex);
    }
    
    TaskState final_state = task->state;
    
    if (final_state == COMPLETED) {
        printf("Task completed successfully: %d\\n", task->result);
    } else {
        printf("Task failed: %s\\n", task->error_msg);
    }
    
    pthread_mutex_unlock(&task->mutex);
    return final_state;
}

// Enviar tarea
void submit_task(Task* task) {
    pthread_mutex_lock(&task->mutex);
    task->state = PENDING;
    pthread_cond_broadcast(&task->state_changed);
    pthread_mutex_unlock(&task->mutex);
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Queue con Estado */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-3">Message Queue con State Tracking:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-purple-400 overflow-x-auto">
{`#define MAX_MESSAGES 100

struct Message {
    int id;
    int value;
    time_t timestamp;
};

struct MessageQueue {
    pthread_mutex_t mutex;
    pthread_cond_t  not_empty;
    pthread_cond_t  not_full;
    
    Message messages[MAX_MESSAGES];
    int     count;          // Estado: cuántos mensajes
    int     head;
    int     tail;
    bool    shutdown;       // Estado: shutdown solicitado
};

void init_message_queue(MessageQueue* mq) {
    pthread_mutex_init(&mq->mutex, NULL);
    pthread_cond_init(&mq->not_empty, NULL);
    pthread_cond_init(&mq->not_full, NULL);
    mq->count = 0;
    mq->head = 0;
    mq->tail = 0;
    mq->shutdown = false;
}

// Producer
void enqueue_message(MessageQueue* mq, Message msg) {
    pthread_mutex_lock(&mq->mutex);
    
    // Esperar si cola llena (verificar estado)
    while (mq->count == MAX_MESSAGES && !mq->shutdown) {
        pthread_cond_wait(&mq->not_full, &mq->mutex);
    }
    
    if (mq->shutdown) {
        pthread_mutex_unlock(&mq->mutex);
        return;
    }
    
    // Agregar mensaje
    mq->messages[mq->tail] = msg;
    mq->tail = (mq->tail + 1) % MAX_MESSAGES;
    mq->count++;
    
    // Señalizar que hay nuevo mensaje
    pthread_cond_signal(&mq->not_empty);
    
    pthread_mutex_unlock(&mq->mutex);
}

// Consumer
bool dequeue_message(MessageQueue* mq, Message* msg) {
    pthread_mutex_lock(&mq->mutex);
    
    // Esperar mientras vacía (verificar estado)
    while (mq->count == 0 && !mq->shutdown) {
        pthread_cond_wait(&mq->not_empty, &mq->mutex);
    }
    
    // Si shutdown y vacía, terminar
    if (mq->shutdown && mq->count == 0) {
        pthread_mutex_unlock(&mq->mutex);
        return false;
    }
    
    // Extraer mensaje
    *msg = mq->messages[mq->head];
    mq->head = (mq->head + 1) % MAX_MESSAGES;
    mq->count--;
    
    // Señalizar que hay espacio
    pthread_cond_signal(&mq->not_full);
    
    pthread_mutex_unlock(&mq->mutex);
    return true;
}

// Shutdown graceful
void shutdown_queue(MessageQueue* mq) {
    pthread_mutex_lock(&mq->mutex);
    mq->shutdown = true;
    
    // Despertar todos los waiters
    pthread_cond_broadcast(&mq->not_empty);
    pthread_cond_broadcast(&mq->not_full);
    
    pthread_mutex_unlock(&mq->mutex);
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Estado con Generaciones */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-3">Generation Counter (Detectar Cambios):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-orange-400 overflow-x-auto">
{`struct GenerationState {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    unsigned long   generation;  // Incrementa en cada cambio
    int             value;
};

void init_generation_state(GenerationState* gs) {
    pthread_mutex_init(&gs->mutex, NULL);
    pthread_cond_init(&gs->cond_var, NULL);
    gs->generation = 0;
    gs->value = 0;
}

// Actualizar valor e incrementar generación
void update_value(GenerationState* gs, int new_value) {
    pthread_mutex_lock(&gs->mutex);
    
    gs->value = new_value;
    gs->generation++;  // Nueva generación
    
    printf("Updated to generation %lu, value=%d\\n", 
           gs->generation, gs->value);
    
    pthread_cond_broadcast(&gs->cond_var);
    
    pthread_mutex_unlock(&gs->mutex);
}

// Esperar cambio específico desde generación conocida
int wait_for_change(GenerationState* gs, unsigned long last_gen) {
    pthread_mutex_lock(&gs->mutex);
    
    // Esperar hasta que generación cambie
    while (gs->generation == last_gen) {
        printf("Waiting for generation change from %lu...\\n", last_gen);
        pthread_cond_wait(&gs->cond_var, &gs->mutex);
    }
    
    int current_value = gs->value;
    unsigned long current_gen = gs->generation;
    
    printf("Detected change: gen %lu -> %lu, value=%d\\n", 
           last_gen, current_gen, current_value);
    
    pthread_mutex_unlock(&gs->mutex);
    return current_value;
}

// Observer que procesa todos los cambios
void* observer_thread(void* arg) {
    GenerationState* gs = (GenerationState*)arg;
    unsigned long my_generation = 0;
    
    for (int i = 0; i < 5; i++) {
        int value = wait_for_change(gs, my_generation);
        
        pthread_mutex_lock(&gs->mutex);
        my_generation = gs->generation;
        pthread_mutex_unlock(&gs->mutex);
        
        printf("Observer processed value %d\\n", value);
    }
    
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Ventajas */}
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-600/30 mb-6">
                      <h4 className="font-semibold text-green-300 mb-3">✅ Ventajas del State Tracking:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• <strong>No Lost Signals:</strong> Estado persiste independientemente del timing</li>
                        <li>• <strong>Debugging Fácil:</strong> Estado visible inspecciona fácilmente</li>
                        <li>• <strong>Flexible:</strong> Puede rastrear estados complejos (FSM, counters, flags)</li>
                        <li>• <strong>Historial:</strong> Generation counters permiten detectar cambios perdidos</li>
                        <li>• <strong>Graceful Shutdown:</strong> Flag de shutdown permite terminación limpia</li>
                        <li>• <strong>Múltiples Condiciones:</strong> Diferentes estados para diferentes eventos</li>
                      </ul>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600/30">
                      <h4 className="font-semibold text-blue-300 mb-3">📋 Best Practices:</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">1.</span>
                          <span><strong>Siempre proteger estado con mutex</strong> - Evita race conditions</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">2.</span>
                          <span><strong>Usar WHILE loop para verificar</strong> - Maneja spurious wakeups</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">3.</span>
                          <span><strong>Broadcast para múltiples waiters</strong> - Todos ven el cambio de estado</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">4.</span>
                          <span><strong>Documentar transiciones de estado</strong> - FSM diagrams ayudan</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">5.</span>
                          <span><strong>Generation counters para secuencias</strong> - Detecta eventos perdidos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 4: Broadcast en lugar de Signal */}
                <TabsContent value="broadcast" className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-900/20 to-slate-800/20 p-6 rounded-lg border border-orange-700/50">
                    <h3 className="text-2xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                      <span className="text-3xl">📢</span>
                      Solución 4: Broadcast en lugar de Signal
                    </h3>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 mb-4">
                        Usar broadcast (pthread_cond_broadcast) en lugar de signal garantiza que todos los 
                        threads esperando sean notificados. Esto es especialmente útil cuando múltiples threads 
                        pueden estar esperando la misma condición o cuando no sabemos cuántos waiters hay.
                      </p>
                    </div>

                    {/* Conceptos Clave */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-orange-600/30 mb-6">
                      <h4 className="font-semibold text-orange-300 mb-3">Conceptos Clave:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>pthread_cond_broadcast():</strong> Despierta TODOS los threads esperando</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>pthread_cond_signal():</strong> Despierta solo UN thread (puede ser el incorrecto)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Thundering Herd:</strong> Trade-off - broadcast puede causar despertar innecesario</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Safety over Performance:</strong> Broadcast es más seguro pero menos eficiente</span>
                        </li>
                      </ul>
                    </div>

                    {/* Comparación Signal vs Broadcast */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Signal vs Broadcast:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-600/30">
                          <h5 className="font-semibold text-yellow-300 mb-2">pthread_cond_signal()</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li>• Despierta 1 thread aleatorio</li>
                            <li>• Más eficiente (menos context switches)</li>
                            <li>• Puede despertar thread incorrecto</li>
                            <li>• Riesgo de lost wakeup si hay múltiples condiciones</li>
                            <li>• Uso: 1 waiter o condición única</li>
                          </ul>
                        </div>
                        <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-600/30">
                          <h5 className="font-semibold text-orange-300 mb-2">pthread_cond_broadcast()</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li>• Despierta TODOS los threads</li>
                            <li>• Menos eficiente (más wakeups)</li>
                            <li>• Garantiza que ninguno se pierda</li>
                            <li>• Seguro con múltiples condiciones</li>
                            <li>• Uso: Múltiples waiters o condiciones</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Caso de Uso 1: Múltiples Waiters Diferentes Condiciones */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Caso 1: Múltiples Condiciones (Broadcast necesario):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-cyan-400 overflow-x-auto">
{`struct MultiConditionState {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    int             value;
    bool            threshold_reached;  // Condición 1
    bool            data_ready;         // Condición 2
    bool            shutdown;           // Condición 3
};

// Waiter 1: Espera threshold
void* threshold_waiter(void* arg) {
    MultiConditionState* state = (MultiConditionState*)arg;
    
    pthread_mutex_lock(&state->mutex);
    
    while (!state->threshold_reached && !state->shutdown) {
        pthread_cond_wait(&state->cond_var, &state->mutex);
    }
    
    if (state->shutdown) {
        printf("Threshold waiter: Shutdown\\n");
    } else {
        printf("Threshold waiter: Threshold reached (value=%d)\\n", 
               state->value);
    }
    
    pthread_mutex_unlock(&state->mutex);
    return NULL;
}

// Waiter 2: Espera data ready
void* data_waiter(void* arg) {
    MultiConditionState* state = (MultiConditionState*)arg;
    
    pthread_mutex_lock(&state->mutex);
    
    while (!state->data_ready && !state->shutdown) {
        pthread_cond_wait(&state->cond_var, &state->mutex);
    }
    
    if (state->shutdown) {
        printf("Data waiter: Shutdown\\n");
    } else {
        printf("Data waiter: Data ready (value=%d)\\n", 
               state->value);
    }
    
    pthread_mutex_unlock(&state->mutex);
    return NULL;
}

// Signaler: DEBE usar broadcast
void signal_threshold(MultiConditionState* state, int new_value) {
    pthread_mutex_lock(&state->mutex);
    
    state->value = new_value;
    state->threshold_reached = (new_value > 100);
    
    // ❌ signal() puede despertar data_waiter (thread incorrecto!)
    // ✅ broadcast() despierta ambos, cada uno verifica su condición
    pthread_cond_broadcast(&state->cond_var);
    
    pthread_mutex_unlock(&state->mutex);
}

void signal_data_ready(MultiConditionState* state, int data) {
    pthread_mutex_lock(&state->mutex);
    
    state->value = data;
    state->data_ready = true;
    
    // broadcast() garantiza que data_waiter recibe señal
    pthread_cond_broadcast(&state->cond_var);
    
    pthread_mutex_unlock(&state->mutex);
}

void signal_shutdown(MultiConditionState* state) {
    pthread_mutex_lock(&state->mutex);
    state->shutdown = true;
    
    // broadcast() para despertar TODOS los waiters
    pthread_cond_broadcast(&state->cond_var);
    
    pthread_mutex_unlock(&state->mutex);
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Caso de Uso 2: Barrier Pattern */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Caso 2: Barrier Pattern (Broadcast esencial):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-green-400 overflow-x-auto">
{`struct Barrier {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    int             count;          // Threads esperando
    int             threshold;      // Total threads necesarios
    int             generation;     // Para reutilizar barrier
};

void init_barrier(Barrier* barrier, int num_threads) {
    pthread_mutex_init(&barrier->mutex, NULL);
    pthread_cond_init(&barrier->cond_var, NULL);
    barrier->count = 0;
    barrier->threshold = num_threads;
    barrier->generation = 0;
}

// Todos los threads esperan hasta que todos lleguen
void barrier_wait(Barrier* barrier) {
    pthread_mutex_lock(&barrier->mutex);
    
    int my_generation = barrier->generation;
    barrier->count++;
    
    if (barrier->count == barrier->threshold) {
        // Último thread: despertar a TODOS
        barrier->count = 0;
        barrier->generation++;
        
        printf("Barrier: Todos llegaron, liberando...\\n");
        
        // ❌ signal() solo despertaría 1 thread!
        // ✅ broadcast() despierta a TODOS
        pthread_cond_broadcast(&barrier->cond_var);
    } else {
        // Esperar hasta que todos lleguen
        while (my_generation == barrier->generation) {
            pthread_cond_wait(&barrier->cond_var, &barrier->mutex);
        }
    }
    
    pthread_mutex_unlock(&barrier->mutex);
}

void* worker_with_barrier(void* arg) {
    Barrier* barrier = (Barrier*)arg;
    int tid = (int)(long)pthread_self();
    
    printf("Thread %d: Fase 1\\n", tid);
    sleep(rand() % 3);
    
    printf("Thread %d: Llegó al barrier\\n", tid);
    barrier_wait(barrier);
    
    printf("Thread %d: Fase 2 (después del barrier)\\n", tid);
    
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Caso de Uso 3: Read-Write Lock */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Caso 3: Read-Write Lock (Broadcast selectivo):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-yellow-400 overflow-x-auto">
{`struct RWLock {
    pthread_mutex_t mutex;
    pthread_cond_t  read_cond;
    pthread_cond_t  write_cond;
    int             readers;        // Número de readers activos
    int             writers;        // Número de writers activos (0 o 1)
    int             waiting_writers;
};

void init_rwlock(RWLock* rwl) {
    pthread_mutex_init(&rwl->mutex, NULL);
    pthread_cond_init(&rwl->read_cond, NULL);
    pthread_cond_init(&rwl->write_cond, NULL);
    rwl->readers = 0;
    rwl->writers = 0;
    rwl->waiting_writers = 0;
}

void read_lock(RWLock* rwl) {
    pthread_mutex_lock(&rwl->mutex);
    
    // Esperar mientras hay writer activo
    while (rwl->writers > 0 || rwl->waiting_writers > 0) {
        pthread_cond_wait(&rwl->read_cond, &rwl->mutex);
    }
    
    rwl->readers++;
    
    pthread_mutex_unlock(&rwl->mutex);
}

void read_unlock(RWLock* rwl) {
    pthread_mutex_lock(&rwl->mutex);
    
    rwl->readers--;
    
    // Si último reader, despertar writers esperando
    if (rwl->readers == 0) {
        // signal() suficiente - solo 1 writer puede proceder
        pthread_cond_signal(&rwl->write_cond);
    }
    
    pthread_mutex_unlock(&rwl->mutex);
}

void write_lock(RWLock* rwl) {
    pthread_mutex_lock(&rwl->mutex);
    
    rwl->waiting_writers++;
    
    // Esperar mientras hay readers o writers activos
    while (rwl->readers > 0 || rwl->writers > 0) {
        pthread_cond_wait(&rwl->write_cond, &rwl->mutex);
    }
    
    rwl->waiting_writers--;
    rwl->writers = 1;
    
    pthread_mutex_unlock(&rwl->mutex);
}

void write_unlock(RWLock* rwl) {
    pthread_mutex_lock(&rwl->mutex);
    
    rwl->writers = 0;
    
    if (rwl->waiting_writers > 0) {
        // Despertar próximo writer
        pthread_cond_signal(&rwl->write_cond);
    } else {
        // ✅ Despertar TODOS los readers esperando
        // broadcast() permite múltiples readers concurrentes
        pthread_cond_broadcast(&rwl->read_cond);
    }
    
    pthread_mutex_unlock(&rwl->mutex);
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Patrón Phase Change */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Caso 4: Phase Change (Global State Change):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-purple-400 overflow-x-auto">
{`enum Phase {
    INITIALIZING,
    RUNNING,
    PAUSED,
    TERMINATING
};

struct Application {
    pthread_mutex_t mutex;
    pthread_cond_t  phase_changed;
    Phase           current_phase;
    int             active_workers;
};

void init_application(Application* app) {
    pthread_mutex_init(&app->mutex, NULL);
    pthread_cond_init(&app->phase_changed, NULL);
    app->current_phase = INITIALIZING;
    app->active_workers = 0;
}

// Cambiar fase global
void change_phase(Application* app, Phase new_phase) {
    pthread_mutex_lock(&app->mutex);
    
    Phase old_phase = app->current_phase;
    app->current_phase = new_phase;
    
    printf("Phase change: %d -> %d\\n", old_phase, new_phase);
    
    // ✅ Broadcast: TODOS los workers deben reaccionar al cambio
    pthread_cond_broadcast(&app->phase_changed);
    
    pthread_mutex_unlock(&app->mutex);
}

void* worker(void* arg) {
    Application* app = (Application*)arg;
    
    pthread_mutex_lock(&app->mutex);
    
    // Esperar fase RUNNING
    while (app->current_phase == INITIALIZING) {
        pthread_cond_wait(&app->phase_changed, &app->mutex);
    }
    
    app->active_workers++;
    pthread_mutex_unlock(&app->mutex);
    
    // Loop principal
    while (true) {
        pthread_mutex_lock(&app->mutex);
        
        Phase phase = app->current_phase;
        
        if (phase == TERMINATING) {
            app->active_workers--;
            pthread_mutex_unlock(&app->mutex);
            break;
        }
        
        if (phase == PAUSED) {
            // Esperar hasta que no esté pausado
            while (app->current_phase == PAUSED) {
                pthread_cond_wait(&app->phase_changed, &app->mutex);
            }
        }
        
        pthread_mutex_unlock(&app->mutex);
        
        // Hacer trabajo
        printf("Worker: Procesando...\\n");
        usleep(500000);
    }
    
    printf("Worker: Terminado\\n");
    return NULL;
}

// Shutdown graceful
void shutdown_application(Application* app) {
    change_phase(app, TERMINATING);
    
    // Esperar que todos los workers terminen
    pthread_mutex_lock(&app->mutex);
    while (app->active_workers > 0) {
        pthread_cond_wait(&app->phase_changed, &app->mutex);
    }
    pthread_mutex_unlock(&app->mutex);
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Optimización: Broadcast Condicional */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Optimización: Broadcast Condicional:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-pink-400 overflow-x-auto">
{`struct SmartQueue {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    int             queue[100];
    int             count;
    int             waiting_consumers;
};

void smart_enqueue(SmartQueue* sq, int item) {
    pthread_mutex_lock(&sq->mutex);
    
    bool was_empty = (sq->count == 0);
    
    sq->queue[sq->count++] = item;
    
    // Optimización inteligente:
    if (sq->waiting_consumers == 0) {
        // Sin waiters, no señalizar
    } else if (sq->waiting_consumers == 1) {
        // Solo 1 waiter, signal suficiente
        pthread_cond_signal(&sq->cond_var);
    } else if (was_empty) {
        // Múltiples waiters Y cola estaba vacía
        // Broadcast para que todos tengan oportunidad
        pthread_cond_broadcast(&sq->cond_var);
    } else {
        // Ya había items, signal para 1 waiter
        pthread_cond_signal(&sq->cond_var);
    }
    
    pthread_mutex_unlock(&sq->mutex);
}

int smart_dequeue(SmartQueue* sq) {
    pthread_mutex_lock(&sq->mutex);
    
    sq->waiting_consumers++;
    
    while (sq->count == 0) {
        pthread_cond_wait(&sq->cond_var, &sq->mutex);
    }
    
    sq->waiting_consumers--;
    
    int item = sq->queue[0];
    for (int i = 0; i < sq->count - 1; i++) {
        sq->queue[i] = sq->queue[i + 1];
    }
    sq->count--;
    
    pthread_mutex_unlock(&sq->mutex);
    return item;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Cuándo Usar Cada Uno */}
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600/30">
                      <h4 className="font-semibold text-blue-300 mb-3">🎯 Guía de Decisión:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-green-300 mb-2">Usar signal() cuando:</h5>
                          <ul className="space-y-1 text-gray-300">
                            <li>✓ Solo 1 thread puede proceder</li>
                            <li>✓ Condición única y clara</li>
                            <li>✓ Performance es crítica</li>
                            <li>✓ Producer-Consumer simple</li>
                            <li>✓ FIFO ordering importante</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-orange-300 mb-2">Usar broadcast() cuando:</h5>
                          <ul className="space-y-1 text-gray-300">
                            <li>✓ Múltiples threads deben proceder</li>
                            <li>✓ Múltiples condiciones en mismo CV</li>
                            <li>✓ State change global</li>
                            <li>✓ Barrier o sync point</li>
                            <li>✓ Shutdown/cleanup</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 5: Timeout en Esperas */}
                <TabsContent value="timeout" className="space-y-4">
                  <div className="bg-gradient-to-br from-red-900/20 to-slate-800/20 p-6 rounded-lg border border-red-700/50">
                    <h3 className="text-2xl font-bold text-red-300 mb-4 flex items-center gap-2">
                      <span className="text-3xl">⏱️</span>
                      Solución 5: Timeout en Esperas
                    </h3>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 mb-4">
                        Usar timeouts en operaciones de espera previene deadlocks y permite detección temprana 
                        de problemas. Si un wakeup se pierde, el timeout permite al thread recuperarse en lugar 
                        de bloquearse indefinidamente.
                      </p>
                    </div>

                    {/* Conceptos Clave */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-red-600/30 mb-6">
                      <h4 className="font-semibold text-red-300 mb-3">Conceptos Clave:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>pthread_cond_timedwait():</strong> Wait con deadline absoluto</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>sem_timedwait():</strong> Semaphore wait con timeout</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>ETIMEDOUT:</strong> Error code cuando expira timeout</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Absolute Time:</strong> Timeouts usan tiempo absoluto, no relativo</span>
                        </li>
                      </ul>
                    </div>

                    {/* Timeout Básico con CV */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-red-300 mb-3">Timeout Básico con Condition Variables:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-cyan-400 overflow-x-auto">
{`#include <time.h>
#include <errno.h>

struct TimeoutState {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    bool            condition_met;
    int             data;
};

// Función helper: Calcular timeout absoluto
void set_timeout(struct timespec* ts, int seconds) {
    // Obtener tiempo actual
    clock_gettime(CLOCK_REALTIME, ts);
    
    // Agregar offset
    ts->tv_sec += seconds;
}

// Alternativa con milisegundos
void set_timeout_ms(struct timespec* ts, int milliseconds) {
    clock_gettime(CLOCK_REALTIME, ts);
    
    ts->tv_sec += milliseconds / 1000;
    ts->tv_nsec += (milliseconds % 1000) * 1000000;
    
    // Normalizar si nsec >= 1 segundo
    if (ts->tv_nsec >= 1000000000) {
        ts->tv_sec++;
        ts->tv_nsec -= 1000000000;
    }
}

// Wait con timeout
int wait_with_timeout(TimeoutState* state, int timeout_seconds) {
    struct timespec timeout;
    set_timeout(&timeout, timeout_seconds);
    
    pthread_mutex_lock(&state->mutex);
    
    int result = 0;
    
    while (!state->condition_met && result == 0) {
        // timedwait retorna 0 si despierta por signal
        // retorna ETIMEDOUT si expira timeout
        result = pthread_cond_timedwait(
            &state->cond_var,
            &state->mutex,
            &timeout
        );
    }
    
    if (result == ETIMEDOUT) {
        printf("Timeout: Condición no cumplida en %d segundos\\n", 
               timeout_seconds);
        pthread_mutex_unlock(&state->mutex);
        return -1;
    }
    
    // Condición cumplida
    printf("Condición cumplida: data=%d\\n", state->data);
    
    pthread_mutex_unlock(&state->mutex);
    return 0;
}

// Ejemplo con retry logic
int wait_with_retry(TimeoutState* state, int retries, int timeout_sec) {
    for (int i = 0; i < retries; i++) {
        printf("Intento %d/%d\\n", i + 1, retries);
        
        if (wait_with_timeout(state, timeout_sec) == 0) {
            return 0;  // Éxito
        }
        
        printf("Timeout, reintentando...\\n");
    }
    
    printf("Error: Fallaron todos los intentos\\n");
    return -1;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Timeout con Semáforos */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-red-300 mb-3">Timeout con Semáforos:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-green-400 overflow-x-auto">
{`#include <semaphore.h>

struct SemaphoreTimeout {
    sem_t sem;
    int   resource_available;
};

// Adquirir recurso con timeout
int acquire_with_timeout(SemaphoreTimeout* st, int timeout_sec) {
    struct timespec ts;
    set_timeout(&ts, timeout_sec);
    
    int result = sem_timedwait(&st->sem, &ts);
    
    if (result == -1) {
        if (errno == ETIMEDOUT) {
            printf("Timeout: Recurso no disponible\\n");
            return -1;
        } else if (errno == EINTR) {
            printf("Interrupted: Reintentando...\\n");
            return acquire_with_timeout(st, timeout_sec);
        } else {
            perror("sem_timedwait");
            return -1;
        }
    }
    
    printf("Recurso adquirido\\n");
    return 0;
}

// Patrón try-acquire
bool try_acquire(SemaphoreTimeout* st) {
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    // Timeout inmediato (solo verificar disponibilidad)
    
    return (sem_timedwait(&st->sem, &ts) == 0);
}

// Pool de recursos con timeout
#define POOL_SIZE 5

struct ResourcePool {
    sem_t available[POOL_SIZE];
    int   resource_data[POOL_SIZE];
};

int acquire_any_resource(ResourcePool* pool, int timeout_sec) {
    struct timespec deadline;
    set_timeout(&deadline, timeout_sec);
    
    // Intentar adquirir cualquier recurso
    while (true) {
        for (int i = 0; i < POOL_SIZE; i++) {
            struct timespec now;
            clock_gettime(CLOCK_REALTIME, &now);
            
            // Verificar si excedimos deadline
            if (now.tv_sec > deadline.tv_sec ||
                (now.tv_sec == deadline.tv_sec && 
                 now.tv_nsec >= deadline.tv_nsec)) {
                printf("Timeout: Ningún recurso disponible\\n");
                return -1;
            }
            
            // Try-acquire (timeout corto)
            struct timespec short_timeout = now;
            short_timeout.tv_nsec += 10000000;  // 10ms
            if (short_timeout.tv_nsec >= 1000000000) {
                short_timeout.tv_sec++;
                short_timeout.tv_nsec -= 1000000000;
            }
            
            if (sem_timedwait(&pool->available[i], &short_timeout) == 0) {
                printf("Adquirido recurso %d\\n", i);
                return i;
            }
        }
        
        usleep(1000);  // 1ms entre rondas
    }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Request-Response con Timeout */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-red-300 mb-3">Request-Response con Timeout:</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-yellow-400 overflow-x-auto">
{`struct Request {
    int             id;
    void*           data;
    pthread_mutex_t mutex;
    pthread_cond_t  response_ready;
    bool            completed;
    void*           response;
    int             error_code;
};

void init_request(Request* req, int id, void* data) {
    req->id = id;
    req->data = data;
    pthread_mutex_init(&req->mutex, NULL);
    pthread_cond_init(&req->response_ready, NULL);
    req->completed = false;
    req->response = NULL;
    req->error_code = 0;
}

// Cliente: Envía request y espera response con timeout
void* send_request_with_timeout(Request* req, int timeout_sec) {
    struct timespec deadline;
    set_timeout(&deadline, timeout_sec);
    
    // Enviar request (simulated)
    printf("Request %d: Enviando...\\n", req->id);
    
    pthread_mutex_lock(&req->mutex);
    
    int result = 0;
    
    // Esperar respuesta
    while (!req->completed && result == 0) {
        result = pthread_cond_timedwait(
            &req->response_ready,
            &req->mutex,
            &deadline
        );
    }
    
    if (result == ETIMEDOUT) {
        printf("Request %d: TIMEOUT\\n", req->id);
        req->error_code = ETIMEDOUT;
        pthread_mutex_unlock(&req->mutex);
        return NULL;
    }
    
    void* response = req->response;
    int error = req->error_code;
    
    pthread_mutex_unlock(&req->mutex);
    
    if (error) {
        printf("Request %d: Error %d\\n", req->id, error);
        return NULL;
    }
    
    printf("Request %d: Response recibida\\n", req->id);
    return response;
}

// Servidor: Procesa request y envía response
void complete_request(Request* req, void* response, int error_code) {
    pthread_mutex_lock(&req->mutex);
    
    req->response = response;
    req->error_code = error_code;
    req->completed = true;
    
    pthread_cond_signal(&req->response_ready);
    
    pthread_mutex_unlock(&req->mutex);
}

// Patrón con múltiples requests paralelos
struct MultiRequest {
    Request requests[10];
    int     num_requests;
    pthread_mutex_t mutex;
    pthread_cond_t  any_completed;
    int     completed_count;
};

// Esperar primera respuesta (race)
int wait_for_first_response(MultiRequest* mr, int timeout_sec) {
    struct timespec deadline;
    set_timeout(&deadline, timeout_sec);
    
    pthread_mutex_lock(&mr->mutex);
    
    int result = 0;
    
    while (mr->completed_count == 0 && result == 0) {
        result = pthread_cond_timedwait(
            &mr->any_completed,
            &mr->mutex,
            &deadline
        );
    }
    
    if (result == ETIMEDOUT) {
        printf("Timeout: Ninguna request completó\\n");
        pthread_mutex_unlock(&mr->mutex);
        return -1;
    }
    
    // Buscar primera completada
    for (int i = 0; i < mr->num_requests; i++) {
        if (mr->requests[i].completed) {
            pthread_mutex_unlock(&mr->mutex);
            return i;
        }
    }
    
    pthread_mutex_unlock(&mr->mutex);
    return -1;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Heartbeat Pattern */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-red-300 mb-3">Heartbeat Pattern (Watchdog):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-purple-400 overflow-x-auto">
{`struct Heartbeat {
    pthread_mutex_t mutex;
    pthread_cond_t  pulse;
    time_t          last_heartbeat;
    bool            alive;
};

void init_heartbeat(Heartbeat* hb) {
    pthread_mutex_init(&hb->mutex, NULL);
    pthread_cond_init(&hb->pulse, NULL);
    hb->last_heartbeat = time(NULL);
    hb->alive = true;
}

// Worker envía heartbeats periódicos
void* worker_with_heartbeat(void* arg) {
    Heartbeat* hb = (Heartbeat*)arg;
    
    while (true) {
        pthread_mutex_lock(&hb->mutex);
        
        if (!hb->alive) {
            pthread_mutex_unlock(&hb->mutex);
            break;
        }
        
        // Actualizar heartbeat
        hb->last_heartbeat = time(NULL);
        pthread_cond_signal(&hb->pulse);
        
        pthread_mutex_unlock(&hb->mutex);
        
        // Hacer trabajo
        sleep(1);
    }
    
    return NULL;
}

// Watchdog verifica heartbeats con timeout
void* watchdog(void* arg) {
    Heartbeat* hb = (Heartbeat*)arg;
    const int TIMEOUT_SEC = 5;
    
    while (true) {
        struct timespec deadline;
        set_timeout(&deadline, TIMEOUT_SEC);
        
        pthread_mutex_lock(&hb->mutex);
        
        time_t last = hb->last_heartbeat;
        
        int result = pthread_cond_timedwait(
            &hb->pulse,
            &hb->mutex,
            &deadline
        );
        
        if (result == ETIMEDOUT) {
            time_t now = time(NULL);
            time_t elapsed = now - last;
            
            printf("WATCHDOG: No heartbeat en %ld segundos!\\n", elapsed);
            
            if (elapsed > TIMEOUT_SEC * 2) {
                printf("WATCHDOG: Worker muerto, iniciando recovery\\n");
                hb->alive = false;
                pthread_mutex_unlock(&hb->mutex);
                break;
            }
        }
        
        pthread_mutex_unlock(&hb->mutex);
    }
    
    return NULL;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Adaptive Timeout */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-red-300 mb-3">Adaptive Timeout (Exponential Backoff):</h4>
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-600">
                        <pre className="text-sm text-orange-400 overflow-x-auto">
{`struct AdaptiveTimeout {
    pthread_mutex_t mutex;
    pthread_cond_t  cond_var;
    bool            ready;
    int             current_timeout;
    int             min_timeout;
    int             max_timeout;
};

void init_adaptive_timeout(AdaptiveTimeout* at) {
    pthread_mutex_init(&at->mutex, NULL);
    pthread_cond_init(&at->cond_var, NULL);
    at->ready = false;
    at->current_timeout = 1;     // Start: 1 segundo
    at->min_timeout = 1;
    at->max_timeout = 32;        // Max: 32 segundos
}

int wait_adaptive(AdaptiveTimeout* at) {
    pthread_mutex_lock(&at->mutex);
    
    int attempts = 0;
    
    while (!at->ready) {
        struct timespec deadline;
        set_timeout(&deadline, at->current_timeout);
        
        printf("Attempt %d: Waiting %d seconds...\\n", 
               ++attempts, at->current_timeout);
        
        int result = pthread_cond_timedwait(
            &at->cond_var,
            &at->mutex,
            &deadline
        );
        
        if (result == ETIMEDOUT) {
            // Exponential backoff
            at->current_timeout *= 2;
            if (at->current_timeout > at->max_timeout) {
                at->current_timeout = at->max_timeout;
            }
            
            printf("Timeout, backoff to %d seconds\\n", 
                   at->current_timeout);
        }
    }
    
    // Éxito - reset timeout
    at->current_timeout = at->min_timeout;
    
    pthread_mutex_unlock(&at->mutex);
    return 0;
}

// Jitter para evitar thundering herd
int wait_adaptive_with_jitter(AdaptiveTimeout* at) {
    pthread_mutex_lock(&at->mutex);
    
    while (!at->ready) {
        // Base timeout + random jitter
        int base = at->current_timeout;
        int jitter = rand() % (base / 2);  // 0-50% jitter
        int timeout = base + jitter;
        
        struct timespec deadline;
        set_timeout(&deadline, timeout);
        
        int result = pthread_cond_timedwait(
            &at->cond_var,
            &at->mutex,
            &deadline
        );
        
        if (result == ETIMEDOUT) {
            at->current_timeout = 
                (at->current_timeout * 3) / 2;  // 1.5x backoff
            if (at->current_timeout > at->max_timeout) {
                at->current_timeout = at->max_timeout;
            }
        }
    }
    
    at->current_timeout = at->min_timeout;
    pthread_mutex_unlock(&at->mutex);
    return 0;
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Ventajas y Consideraciones */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-900/20 p-4 rounded-lg border border-green-600/30">
                        <h4 className="font-semibold text-green-300 mb-3">✅ Ventajas de Timeouts:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Previene deadlocks indefinidos</li>
                          <li>• Permite detección de problemas</li>
                          <li>• Facilita recovery automático</li>
                          <li>• Debugging más fácil</li>
                          <li>• SLA/QoS enforcement</li>
                          <li>• Graceful degradation</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-600/30">
                        <h4 className="font-semibold text-yellow-300 mb-3">⚠️ Consideraciones:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Elegir timeout apropiado</li>
                          <li>• Timeouts muy cortos → false positives</li>
                          <li>• Timeouts muy largos → detección lenta</li>
                          <li>• Overhead de clock_gettime()</li>
                          <li>• Necesita lógica de retry/recovery</li>
                          <li>• Adaptive timeouts para variabilidad</li>
                        </ul>
                      </div>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600/30">
                      <h4 className="font-semibold text-blue-300 mb-3">📋 Best Practices para Timeouts:</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">1.</span>
                          <span><strong>Usar timeouts absolutos</strong> - clock_gettime(CLOCK_REALTIME) antes del loop</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">2.</span>
                          <span><strong>Manejar ETIMEDOUT explícitamente</strong> - Distinguir de otros errores</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">3.</span>
                          <span><strong>Logging de timeouts</strong> - Ayuda diagnóstico de problemas</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">4.</span>
                          <span><strong>Retry logic con backoff</strong> - Evita busy-wait excesivo</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">5.</span>
                          <span><strong>Configurar timeouts</strong> - No hardcodear, usar config o env vars</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">6.</span>
                          <span><strong>Métricas de timeout</strong> - Track tasa de timeouts para tuning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ACCORDION DE DEMOSTRACIONES INTERACTIVAS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="single" defaultValue="demos" collapsible className="space-y-4">
          <AccordionItem value="demos" className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <TrendingDown className="size-6 text-pink-400" />
                <span className="text-2xl font-semibold text-white">Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Tabs defaultValue="demo-cv" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="demo-cv" className="data-[state=active]:bg-pink-600">
                    Condition Var
                  </TabsTrigger>
                  <TabsTrigger value="demo-sem" className="data-[state=active]:bg-pink-600">
                    Semáforo
                  </TabsTrigger>
                  <TabsTrigger value="demo-state" className="data-[state=active]:bg-pink-600">
                    State Track
                  </TabsTrigger>
                  <TabsTrigger value="demo-broadcast" className="data-[state=active]:bg-pink-600">
                    Broadcast
                  </TabsTrigger>
                  <TabsTrigger value="demo-timeout" className="data-[state=active]:bg-pink-600">
                    Timeout
                  </TabsTrigger>
                </TabsList>

                {/* Demo 1: Condition Variables */}
                <TabsContent value="demo-cv" className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-slate-800/20 p-6 rounded-lg border border-blue-700/50">
                    <h3 className="text-xl font-bold text-blue-300 mb-4">
                      Demo: Condition Variables (Mutex + CV)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setCvRunning(!cvRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          cvRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {cvRunning ? (
                          <>
                            <Pause className="size-4" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="size-4" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetCv}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {cvSpeed}ms
                        </label>
                        <Slider
                          value={[cvSpeed]}
                          onValueChange={([value]) => setCvSpeed(value)}
                          min={300}
                          max={1500}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Thread Waiter */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/50">
                        <h4 className="font-bold text-blue-300 mb-3">Thread Waiter</h4>
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg border-2 ${
                            cvWaiterState === "checking" ? "border-yellow-500 bg-yellow-900/30" :
                            cvWaiterState === "waiting" ? "border-orange-500 bg-orange-900/30" :
                            cvWaiterState === "processing" ? "border-green-500 bg-green-900/30" :
                            "border-gray-500 bg-gray-900/30"
                          }`}>
                            <div className="text-sm font-semibold mb-1">Estado:</div>
                            <div className="text-lg">
                              {cvWaiterState === "checking" && "🔍 Verificando"}
                              {cvWaiterState === "waiting" && "⏸️ Esperando"}
                              {cvWaiterState === "processing" && "⚙️ Procesando"}
                              {cvWaiterState === "done" && "✅ Completado"}
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <div className="text-xs text-gray-400 mb-1">Mutex:</div>
                            <div className={`text-sm font-mono ${
                              cvWaiterState === "waiting" ? "text-red-400" : "text-green-400"
                            }`}>
                              {cvWaiterState === "waiting" ? "Released" : "Locked"}
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <div className="text-xs text-gray-400 mb-1">Condición:</div>
                            <div className={`text-sm font-mono ${
                              cvCondition ? "text-green-400" : "text-red-400"
                            }`}>
                              {cvCondition ? "true ✓" : "false ✗"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thread Signaler */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                        <h4 className="font-bold text-green-300 mb-3">Thread Signaler</h4>
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg border-2 ${
                            cvSignalerState === "idle" ? "border-gray-500 bg-gray-900/30" :
                            cvSignalerState === "preparing" ? "border-yellow-500 bg-yellow-900/30" :
                            cvSignalerState === "signaling" ? "border-green-500 bg-green-900/30" :
                            "border-blue-500 bg-blue-900/30"
                          }`}>
                            <div className="text-sm font-semibold mb-1">Estado:</div>
                            <div className="text-lg">
                              {cvSignalerState === "idle" && "💤 Inactivo"}
                              {cvSignalerState === "preparing" && "🔧 Preparando"}
                              {cvSignalerState === "signaling" && "📡 Señalizando"}
                              {cvSignalerState === "done" && "✅ Completado"}
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <div className="text-xs text-gray-400 mb-1">Acción:</div>
                            <div className="text-sm">
                              {cvSignalerState === "preparing" && "Adquiriendo mutex..."}
                              {cvSignalerState === "signaling" && "pthread_cond_signal()"}
                              {cvSignalerState === "done" && "Mutex liberado"}
                              {cvSignalerState === "idle" && "Esperando..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={cvLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {cvLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              log.type === "error"
                                ? "bg-red-900/30 text-red-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/30 text-yellow-300"
                                : log.type === "success"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-blue-900/30 text-blue-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Semáforos */}
                <TabsContent value="demo-sem" className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/20 to-slate-800/20 p-6 rounded-lg border border-purple-700/50">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">
                      Demo: Semáforos (Contador Persistente)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setSemRunning(!semRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          semRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {semRunning ? (
                          <>
                            <Pause className="size-4" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="size-4" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetSem}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {semSpeed}ms
                        </label>
                        <Slider
                          value={[semSpeed]}
                          onValueChange={([value]) => setSemSpeed(value)}
                          min={300}
                          max={1500}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Semáforo */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/50">
                        <h4 className="font-bold text-purple-300 mb-3">Semáforo</h4>
                        <div className="space-y-3">
                          <div className="bg-purple-900/30 p-4 rounded-lg border-2 border-purple-500">
                            <div className="text-center">
                              <div className="text-sm text-gray-300 mb-2">Contador</div>
                              <div className={`text-5xl font-bold ${
                                semCounter === 0 ? "text-red-400" : "text-green-400"
                              }`}>
                                {semCounter}
                              </div>
                              <div className="text-xs text-gray-400 mt-2">
                                {semCounter === 0 ? "Bloqueado" : "Disponible"}
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <div className="text-xs text-gray-400 mb-1">Persistencia:</div>
                            <div className="text-sm text-green-400">
                              ✓ Contador preserva señales
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Estados de Threads */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/50">
                        <h4 className="font-bold text-blue-300 mb-3">Estados</h4>
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg border-2 ${
                            semWaiterState === "waiting" ? "border-orange-500 bg-orange-900/30" :
                            semWaiterState === "acquired" ? "border-blue-500 bg-blue-900/30" :
                            semWaiterState === "processing" ? "border-green-500 bg-green-900/30" :
                            "border-gray-500 bg-gray-900/30"
                          }`}>
                            <div className="text-sm font-semibold mb-1">Waiter:</div>
                            <div className="text-lg">
                              {semWaiterState === "waiting" && "⏸️ sem_wait()"}
                              {semWaiterState === "acquired" && "🔓 Adquirido"}
                              {semWaiterState === "processing" && "⚙️ Procesando"}
                              {semWaiterState === "done" && "✅ Completado"}
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg border-2 ${
                            semSignalerState === "idle" ? "border-gray-500 bg-gray-900/30" :
                            semSignalerState === "posting" ? "border-green-500 bg-green-900/30" :
                            "border-blue-500 bg-blue-900/30"
                          }`}>
                            <div className="text-sm font-semibold mb-1">Signaler:</div>
                            <div className="text-lg">
                              {semSignalerState === "idle" && "💤 Inactivo"}
                              {semSignalerState === "posting" && "📡 sem_post()"}
                              {semSignalerState === "done" && "✅ Completado"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={semLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {semLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              log.type === "error"
                                ? "bg-red-900/30 text-red-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/30 text-yellow-300"
                                : log.type === "success"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-blue-900/30 text-blue-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: State Tracking */}
                <TabsContent value="demo-state" className="space-y-4">
                  <div className="bg-gradient-to-br from-green-900/20 to-slate-800/20 p-6 rounded-lg border border-green-700/50">
                    <h3 className="text-xl font-bold text-green-300 mb-4">
                      Demo: State Tracking (Estado Persistente)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setStateRunning(!stateRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          stateRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {stateRunning ? (
                          <>
                            <Pause className="size-4" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="size-4" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetState}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {stateSpeed}ms
                        </label>
                        <Slider
                          value={[stateSpeed]}
                          onValueChange={([value]) => setStateSpeed(value)}
                          min={300}
                          max={1500}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Estado Compartido */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                        <h4 className="font-bold text-green-300 mb-3">Estado Compartido</h4>
                        <div className="space-y-3">
                          <div className={`p-4 rounded-lg border-2 ${
                            stateEventOccurred ? "border-green-500 bg-green-900/30" : "border-red-500 bg-red-900/30"
                          }`}>
                            <div className="text-sm font-semibold mb-2">event_occurred:</div>
                            <div className={`text-3xl font-bold ${
                              stateEventOccurred ? "text-green-400" : "text-red-400"
                            }`}>
                              {stateEventOccurred ? "true ✓" : "false ✗"}
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <div className="text-xs text-gray-400 mb-1">Data:</div>
                            <div className="text-2xl font-mono text-blue-400">{stateData}</div>
                          </div>
                          <div className="bg-blue-900/30 p-2 rounded border border-blue-600/50">
                            <div className="text-xs text-blue-300">
                              💾 Estado persiste independientemente del timing
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-yellow-500/50">
                        <h4 className="font-bold text-yellow-300 mb-3">Timeline (Signaler primero)</h4>
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg border-2 ${
                            stateSignalerState === "marking" || stateSignalerState === "done"
                              ? "border-green-500 bg-green-900/30"
                              : "border-gray-500 bg-gray-900/30"
                          }`}>
                            <div className="text-sm font-semibold mb-1">1️⃣ Signaler:</div>
                            <div className="text-sm">
                              {stateSignalerState === "idle" && "Esperando..."}
                              {stateSignalerState === "marking" && "Marcando estado ✓"}
                              {stateSignalerState === "done" && "Completado ✓"}
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg border-2 ${
                            stateWaiterState === "checking" || stateWaiterState === "processing" || stateWaiterState === "done"
                              ? "border-blue-500 bg-blue-900/30"
                              : "border-gray-500 bg-gray-900/30"
                          }`}>
                            <div className="text-sm font-semibold mb-1">2️⃣ Waiter:</div>
                            <div className="text-sm">
                              {stateWaiterState === "checking" && "Verificando estado..."}
                              {stateWaiterState === "waiting" && "Esperando..."}
                              {stateWaiterState === "processing" && "Estado ya true - sin espera!"}
                              {stateWaiterState === "done" && "Completado ✓"}
                            </div>
                          </div>
                          {stateWaiterState === "processing" && (
                            <div className="bg-green-900/30 p-2 rounded border border-green-600/50">
                              <div className="text-xs text-green-300">
                                ✅ Waiter ve evento ya ocurrido - no espera!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={stateLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {stateLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              log.type === "error"
                                ? "bg-red-900/30 text-red-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/30 text-yellow-300"
                                : log.type === "success"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-blue-900/30 text-blue-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Broadcast */}
                <TabsContent value="demo-broadcast" className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-900/20 to-slate-800/20 p-6 rounded-lg border border-orange-700/50">
                    <h3 className="text-xl font-bold text-orange-300 mb-4">
                      Demo: Broadcast (Múltiples Waiters)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setBroadcastRunning(!broadcastRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          broadcastRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {broadcastRunning ? (
                          <>
                            <Pause className="size-4" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="size-4" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetBroadcast}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {broadcastSpeed}ms
                        </label>
                        <Slider
                          value={[broadcastSpeed]}
                          onValueChange={([value]) => setBroadcastSpeed(value)}
                          min={300}
                          max={1500}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="mb-6">
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-orange-500/50 mb-4">
                        <h4 className="font-bold text-orange-300 mb-3">3 Threads Esperando</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {broadcastWaiters.map((waiter) => (
                            <div
                              key={waiter.id}
                              className={`p-4 rounded-lg border-2 ${
                                waiter.state === "waiting" ? "border-yellow-500 bg-yellow-900/30" :
                                waiter.state === "awakened" ? "border-green-500 bg-green-900/30" :
                                "border-blue-500 bg-blue-900/30"
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-sm font-semibold mb-2">Thread {waiter.id}</div>
                                <div className="text-3xl mb-2">
                                  {waiter.state === "waiting" && "⏸️"}
                                  {waiter.state === "awakened" && "👁️"}
                                  {waiter.state === "done" && "✅"}
                                </div>
                                <div className="text-xs">
                                  {waiter.state === "waiting" && "Esperando..."}
                                  {waiter.state === "awakened" && "Despertado!"}
                                  {waiter.state === "done" && "Completado"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                          <h4 className="font-bold text-green-300 mb-3">Signaler</h4>
                          <div className={`p-4 rounded-lg border-2 ${
                            broadcastSignalerState === "idle" ? "border-gray-500 bg-gray-900/30" :
                            broadcastSignalerState === "broadcasting" ? "border-green-500 bg-green-900/30" :
                            "border-blue-500 bg-blue-900/30"
                          }`}>
                            <div className="text-center">
                              <div className="text-3xl mb-2">
                                {broadcastSignalerState === "idle" && "💤"}
                                {broadcastSignalerState === "broadcasting" && "📢"}
                                {broadcastSignalerState === "done" && "✅"}
                              </div>
                              <div className="text-sm">
                                {broadcastSignalerState === "idle" && "Inactivo"}
                                {broadcastSignalerState === "broadcasting" && "Broadcasting..."}
                                {broadcastSignalerState === "done" && "Completado"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/50">
                          <h4 className="font-bold text-purple-300 mb-3">Condición</h4>
                          <div className={`p-4 rounded-lg border-2 ${
                            broadcastCondition ? "border-green-500 bg-green-900/30" : "border-red-500 bg-red-900/30"
                          }`}>
                            <div className="text-center">
                              <div className={`text-4xl font-bold ${
                                broadcastCondition ? "text-green-400" : "text-red-400"
                              }`}>
                                {broadcastCondition ? "true" : "false"}
                              </div>
                              <div className="text-xs text-gray-400 mt-2">
                                {broadcastCondition ? "Condición cumplida" : "Esperando condición"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={broadcastLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {broadcastLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              log.type === "error"
                                ? "bg-red-900/30 text-red-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/30 text-yellow-300"
                                : log.type === "success"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-blue-900/30 text-blue-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: Timeout */}
                <TabsContent value="demo-timeout" className="space-y-4">
                  <div className="bg-gradient-to-br from-red-900/20 to-slate-800/20 p-6 rounded-lg border border-red-700/50">
                    <h3 className="text-xl font-bold text-red-300 mb-4">
                      Demo: Timeout (Prevención de Deadlock)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setTimeoutRunning(!timeoutRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          timeoutRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {timeoutRunning ? (
                          <>
                            <Pause className="size-4" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="size-4" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetTimeout}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {timeoutSpeed}ms
                        </label>
                        <Slider
                          value={[timeoutSpeed]}
                          onValueChange={([value]) => setTimeoutSpeed(value)}
                          min={300}
                          max={1500}
                          step={100}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="signal-arrives"
                          checked={timeoutSignalArrives}
                          onChange={(e) => setTimeoutSignalArrives(e.target.checked)}
                          className="w-4 h-4"
                          disabled={timeoutRunning}
                        />
                        <label htmlFor="signal-arrives" className="text-sm text-gray-300">
                          Señal llega a tiempo
                        </label>
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Timeout Counter */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/50">
                        <h4 className="font-bold text-red-300 mb-3">Contador de Timeout</h4>
                        <div className="space-y-3">
                          <div className={`p-6 rounded-lg border-2 ${
                            timeoutCounter > 2 ? "border-green-500 bg-green-900/30" :
                            timeoutCounter > 0 ? "border-yellow-500 bg-yellow-900/30" :
                            "border-red-500 bg-red-900/30"
                          }`}>
                            <div className="text-center">
                              <div className="text-sm text-gray-300 mb-2">Tiempo Restante</div>
                              <div className={`text-6xl font-bold ${
                                timeoutCounter > 2 ? "text-green-400" :
                                timeoutCounter > 0 ? "text-yellow-400" :
                                "text-red-400"
                              }`}>
                                {timeoutCounter}s
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <div className="text-xs text-gray-400 mb-1">Configuración:</div>
                            <div className="text-sm">Timeout: 5 segundos</div>
                          </div>
                        </div>
                      </div>

                      {/* Estado */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/50">
                        <h4 className="font-bold text-blue-300 mb-3">Estado del Waiter</h4>
                        <div className="space-y-3">
                          <div className={`p-4 rounded-lg border-2 ${
                            timeoutWaiterState === "waiting" ? "border-yellow-500 bg-yellow-900/30" :
                            timeoutWaiterState === "timeout" ? "border-red-500 bg-red-900/30" :
                            timeoutWaiterState === "success" ? "border-green-500 bg-green-900/30" :
                            "border-blue-500 bg-blue-900/30"
                          }`}>
                            <div className="text-center">
                              <div className="text-4xl mb-2">
                                {timeoutWaiterState === "waiting" && "⏳"}
                                {timeoutWaiterState === "timeout" && "⏱️"}
                                {timeoutWaiterState === "success" && "✅"}
                                {timeoutWaiterState === "done" && "🏁"}
                              </div>
                              <div className="text-lg font-semibold">
                                {timeoutWaiterState === "waiting" && "Esperando..."}
                                {timeoutWaiterState === "timeout" && "TIMEOUT!"}
                                {timeoutWaiterState === "success" && "Éxito"}
                                {timeoutWaiterState === "done" && "Finalizado"}
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <div className="text-xs text-gray-400 mb-1">Condición:</div>
                            <div className={`text-sm font-mono ${
                              timeoutCondition ? "text-green-400" : "text-red-400"
                            }`}>
                              {timeoutCondition ? "true ✓" : "false ✗"}
                            </div>
                          </div>
                          {timeoutWaiterState === "timeout" && (
                            <div className="bg-red-900/30 p-2 rounded border border-red-600/50">
                              <div className="text-xs text-red-300">
                                ⚠️ Timeout evitó deadlock indefinido
                              </div>
                            </div>
                          )}
                          {timeoutWaiterState === "success" && (
                            <div className="bg-green-900/30 p-2 rounded border border-green-600/50">
                              <div className="text-xs text-green-300">
                                ✅ Señal recibida dentro del timeout
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={timeoutLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {timeoutLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              log.type === "error"
                                ? "bg-red-900/30 text-red-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/30 text-yellow-300"
                                : log.type === "success"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-blue-900/30 text-blue-300"
                            }`}
                          >
                            {log.message}
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