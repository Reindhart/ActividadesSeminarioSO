import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Code, TrendingDown, BookOpen, Play, Pause, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Thread {
  id: number;
  priority: number;
  originalPriority: number;
  status: 'idle' | 'running' | 'waiting' | 'blocked' | 'completed';
  holdingMutex: boolean;
  progress: number;
}

export default function PriorityInversion() {
  // Estados para Priority Inheritance
  const [inheritanceRunning, setInheritanceRunning] = useState(false);
  const [inheritanceSpeed, setInheritanceSpeed] = useState(500);
  const [inheritanceThreads, setInheritanceThreads] = useState<Thread[]>([
    { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
  ]);
  const [inheritanceLogs, setInheritanceLogs] = useState<string[]>([]);
  const [, setInheritancePhase] = useState(0);

  // Estados para Priority Ceiling
  const [ceilingRunning, setCeilingRunning] = useState(false);
  const [ceilingSpeed, setCeilingSpeed] = useState(500);
  const [ceilingThreads, setCeilingThreads] = useState<Thread[]>([
    { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
  ]);
  const [ceilingLogs, setCeilingLogs] = useState<string[]>([]);
  const [, setCeilingPhase] = useState(0);
  const [mutexCeiling] = useState(10);

  // Estados para Disable Priority
  const [disableRunning, setDisableRunning] = useState(false);
  const [disableSpeed, setDisableSpeed] = useState(500);
  const [disableThreads, setDisableThreads] = useState<Thread[]>([
    { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
  ]);
  const [disableLogs, setDisableLogs] = useState<string[]>([]);
  const [, setDisablePhase] = useState(0);
  const [preemptionEnabled, setPreemptionEnabled] = useState(true);

  // Estados para Avoid Sharing
  const [avoidRunning, setAvoidRunning] = useState(false);
  const [avoidSpeed, setAvoidSpeed] = useState(500);
  const [avoidThreads, setAvoidThreads] = useState<Thread[]>([
    { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
    { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
  ]);
  const [avoidLogs, setAvoidLogs] = useState<string[]>([]);
  const [avoidMessages, setAvoidMessages] = useState<Array<{from: number, to: number, msg: string}>>([]);

  // Refs para auto-scroll
  const inheritanceLogRef = useRef<HTMLDivElement>(null);
  const ceilingLogRef = useRef<HTMLDivElement>(null);
  const disableLogRef = useRef<HTMLDivElement>(null);
  const avoidLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effects
  useEffect(() => {
    if (inheritanceLogRef.current) {
      inheritanceLogRef.current.scrollTop = inheritanceLogRef.current.scrollHeight;
    }
  }, [inheritanceLogs]);

  useEffect(() => {
    if (ceilingLogRef.current) {
      ceilingLogRef.current.scrollTop = ceilingLogRef.current.scrollHeight;
    }
  }, [ceilingLogs]);

  useEffect(() => {
    if (disableLogRef.current) {
      disableLogRef.current.scrollTop = disableLogRef.current.scrollHeight;
    }
  }, [disableLogs]);

  useEffect(() => {
    if (avoidLogRef.current) {
      avoidLogRef.current.scrollTop = avoidLogRef.current.scrollHeight;
    }
  }, [avoidLogs]);

  // Simulación Priority Inheritance
  useEffect(() => {
    if (!inheritanceRunning) return;

    const interval = setInterval(() => {
      setInheritancePhase(prev => {
        const next = prev + 1;

        if (next === 1) {
          setInheritanceLogs(l => [...l, "⏱️ T=0: T3 (baja prioridad=1) adquiere el mutex"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, status: 'running', holdingMutex: true, progress: 20 } : t
          ));
        } else if (next === 2) {
          setInheritanceLogs(l => [...l, "⏱️ T=1: T2 (media prioridad=5) comienza a ejecutar (sin necesitar mutex)"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'running', progress: 15 } : t
          ));
        } else if (next === 3) {
          setInheritanceLogs(l => [...l, "⏱️ T=2: T1 (alta prioridad=10) intenta adquirir mutex"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'waiting' } : t
          ));
        } else if (next === 4) {
          setInheritanceLogs(l => [...l, "🔼 HERENCIA: T3 hereda prioridad 10 de T1"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, priority: 10 } : t
          ));
        } else if (next === 5) {
          setInheritanceLogs(l => [...l, "⏱️ T=3: T3 (ahora prioridad=10) expulsa a T2 y continúa"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'blocked' } :
            t.id === 3 ? { ...t, progress: 50 } : t
          ));
        } else if (next === 6) {
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, progress: 80 } : t
          ));
        } else if (next === 7) {
          setInheritanceLogs(l => [...l, "✅ T3 completa su sección crítica y libera mutex"]);
          setInheritanceLogs(l => [...l, "🔽 T3 restaura prioridad original = 1"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, status: 'completed', holdingMutex: false, priority: 1, progress: 100 } : t
          ));
        } else if (next === 8) {
          setInheritanceLogs(l => [...l, "⏱️ T=4: T1 adquiere mutex y ejecuta"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'running', holdingMutex: true, progress: 40 } : t
          ));
        } else if (next === 9) {
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, progress: 100 } : t
          ));
        } else if (next === 10) {
          setInheritanceLogs(l => [...l, "✅ T1 completa su trabajo"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'completed', holdingMutex: false } : t
          ));
        } else if (next === 11) {
          setInheritanceLogs(l => [...l, "⏱️ T=5: T2 completa su ejecución"]);
          setInheritanceThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'completed', progress: 100 } : t
          ));
        } else if (next === 12) {
          setInheritanceLogs(l => [...l, "✅ Simulación completada - Priority Inheritance previno inversión de prioridad"]);
          setInheritanceRunning(false);
          return 0;
        }

        return next;
      });
    }, inheritanceSpeed);

    return () => clearInterval(interval);
  }, [inheritanceRunning, inheritanceSpeed]);

  // Simulación Priority Ceiling
  useEffect(() => {
    if (!ceilingRunning) return;

    const interval = setInterval(() => {
      setCeilingPhase(prev => {
        const next = prev + 1;

        if (next === 1) {
          setCeilingLogs(l => [...l, `⏱️ T=0: Mutex configurado con ceiling = ${mutexCeiling}`]);
          setCeilingLogs(l => [...l, "⏱️ T3 (baja prioridad=1) intenta adquirir mutex"]);
        } else if (next === 2) {
          setCeilingLogs(l => [...l, `🔝 T3 elevada INMEDIATAMENTE a ceiling = ${mutexCeiling}`]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, status: 'running', holdingMutex: true, priority: mutexCeiling, progress: 20 } : t
          ));
        } else if (next === 3) {
          setCeilingLogs(l => [...l, "⏱️ T=1: T2 (media prioridad=5) intenta ejecutar"]);
          setCeilingLogs(l => [...l, "❌ T2 bloqueada: T3 tiene prioridad mayor (ceiling=10)"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'blocked' } : t
          ));
        } else if (next === 4) {
          setCeilingLogs(l => [...l, "⏱️ T=2: T1 (alta prioridad=10) intenta adquirir mutex"]);
          setCeilingLogs(l => [...l, "⏳ T1 debe esperar: mutex ocupado por T3"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'waiting' } : t
          ));
        } else if (next === 5) {
          setCeilingLogs(l => [...l, "⏱️ T=3: T3 continúa ejecutando con prioridad máxima"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, progress: 50 } : t
          ));
        } else if (next === 6) {
          setCeilingThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, progress: 80 } : t
          ));
        } else if (next === 7) {
          setCeilingLogs(l => [...l, "✅ T3 completa sección crítica y libera mutex"]);
          setCeilingLogs(l => [...l, "🔽 T3 restaura prioridad original = 1"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, status: 'completed', holdingMutex: false, priority: 1, progress: 100 } : t
          ));
        } else if (next === 8) {
          setCeilingLogs(l => [...l, "⏱️ T=4: T1 adquiere mutex con ceiling=10"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'running', holdingMutex: true, progress: 40 } : t
          ));
        } else if (next === 9) {
          setCeilingThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, progress: 100 } : t
          ));
        } else if (next === 10) {
          setCeilingLogs(l => [...l, "✅ T1 completa su trabajo"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'completed', holdingMutex: false } : t
          ));
        } else if (next === 11) {
          setCeilingLogs(l => [...l, "⏱️ T=5: T2 puede ejecutar ahora"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'running', progress: 100 } : t
          ));
        } else if (next === 12) {
          setCeilingLogs(l => [...l, "✅ T2 completada"]);
          setCeilingThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'completed' } : t
          ));
        } else if (next === 13) {
          setCeilingLogs(l => [...l, "✅ Simulación completada - Priority Ceiling previno inversión"]);
          setCeilingRunning(false);
          return 0;
        }

        return next;
      });
    }, ceilingSpeed);

    return () => clearInterval(interval);
  }, [ceilingRunning, ceilingSpeed, mutexCeiling]);

  // Simulación Disable Priority
  useEffect(() => {
    if (!disableRunning) return;

    const interval = setInterval(() => {
      setDisablePhase(prev => {
        const next = prev + 1;

        if (next === 1) {
          setDisableLogs(l => [...l, "⏱️ T=0: T3 (baja prioridad=1) entra a sección crítica"]);
          setDisableLogs(l => [...l, "🚫 T3 DESACTIVA PREEMPTION"]);
          setPreemptionEnabled(false);
          setDisableThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, status: 'running', holdingMutex: true, progress: 20 } : t
          ));
        } else if (next === 2) {
          setDisableLogs(l => [...l, "⏱️ T=1: T2 (media) y T1 (alta) intentan ejecutar"]);
          setDisableLogs(l => [...l, "❌ Preemption desactivada: T3 NO puede ser interrumpida"]);
          setDisableThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'blocked' } :
            t.id === 2 ? { ...t, status: 'blocked' } : t
          ));
        } else if (next === 3) {
          setDisableLogs(l => [...l, "⏱️ T=2: T3 continúa ejecutando sin interrupciones"]);
          setDisableThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, progress: 50 } : t
          ));
        } else if (next === 4) {
          setDisableThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, progress: 80 } : t
          ));
        } else if (next === 5) {
          setDisableLogs(l => [...l, "✅ T3 completa sección crítica"]);
          setDisableLogs(l => [...l, "✅ T3 REACTIVA PREEMPTION"]);
          setPreemptionEnabled(true);
          setDisableThreads(threads => threads.map(t => 
            t.id === 3 ? { ...t, status: 'completed', holdingMutex: false, progress: 100 } : t
          ));
        } else if (next === 6) {
          setDisableLogs(l => [...l, "⏱️ T=3: T1 (alta prioridad) expulsa a T2 y ejecuta"]);
          setDisableThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'running', progress: 50 } : t
          ));
        } else if (next === 7) {
          setDisableThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, progress: 100 } : t
          ));
        } else if (next === 8) {
          setDisableLogs(l => [...l, "✅ T1 completada"]);
          setDisableThreads(threads => threads.map(t => 
            t.id === 1 ? { ...t, status: 'completed' } : t
          ));
        } else if (next === 9) {
          setDisableLogs(l => [...l, "⏱️ T=4: T2 ejecuta"]);
          setDisableThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'running', progress: 100 } : t
          ));
        } else if (next === 10) {
          setDisableLogs(l => [...l, "✅ T2 completada"]);
          setDisableThreads(threads => threads.map(t => 
            t.id === 2 ? { ...t, status: 'completed' } : t
          ));
        } else if (next === 11) {
          setDisableLogs(l => [...l, "✅ Simulación completada - Disable Preemption previno inversión"]);
          setDisableRunning(false);
          return 0;
        }

        return next;
      });
    }, disableSpeed);

    return () => clearInterval(interval);
  }, [disableRunning, disableSpeed]);

  // Simulación Avoid Sharing
  useEffect(() => {
    if (!avoidRunning) return;

    const interval = setInterval(() => {
      setAvoidLogs(l => {
        const newLogs = [...l];
        
        // Simular threads trabajando en sus propios datos (sin compartir)
        setAvoidThreads(threads => threads.map(t => {
          if (t.status === 'idle') {
            newLogs.push(`⏱️ T${t.id} (prioridad=${t.priority}) inicia con datos locales`);
            return { ...t, status: 'running', progress: 10 };
          } else if (t.status === 'running' && t.progress < 100) {
            return { ...t, progress: Math.min(100, t.progress + 15) };
          } else if (t.status === 'running' && t.progress >= 100) {
            newLogs.push(`✅ T${t.id} completada (sin bloqueos, sin inversión)`);
            return { ...t, status: 'completed' };
          }
          return t;
        }));

        // Agregar mensajes entre threads (message passing)
        if (l.length === 1) {
          setAvoidMessages([{ from: 1, to: 3, msg: 'DATA_REQUEST' }]);
          newLogs.push("📨 T1 envía mensaje a T3: DATA_REQUEST");
        } else if (l.length === 3) {
          setAvoidMessages(m => [...m, { from: 3, to: 1, msg: 'DATA_RESPONSE' }]);
          newLogs.push("📨 T3 responde a T1: DATA_RESPONSE");
        }

        const allCompleted = avoidThreads.every(t => t.status === 'completed');
        if (allCompleted && l.length > 5) {
          newLogs.push("✅ Simulación completada - Sin recursos compartidos = Sin inversión");
          setAvoidRunning(false);
        }

        return newLogs;
      });
    }, avoidSpeed);

    return () => clearInterval(interval);
  }, [avoidRunning, avoidSpeed, avoidThreads]);

  // Funciones de reset
  const resetInheritance = () => {
    setInheritanceRunning(false);
    setInheritancePhase(0);
    setInheritanceLogs([]);
    setInheritanceThreads([
      { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
    ]);
  };

  const resetCeiling = () => {
    setCeilingRunning(false);
    setCeilingPhase(0);
    setCeilingLogs([]);
    setCeilingThreads([
      { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
    ]);
  };

  const resetDisable = () => {
    setDisableRunning(false);
    setDisablePhase(0);
    setDisableLogs([]);
    setPreemptionEnabled(true);
    setDisableThreads([
      { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
    ]);
  };

  const resetAvoid = () => {
    setAvoidRunning(false);
    setAvoidLogs([]);
    setAvoidMessages([]);
    setAvoidThreads([
      { id: 1, priority: 10, originalPriority: 10, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 2, priority: 5, originalPriority: 5, status: 'idle', holdingMutex: false, progress: 0 },
      { id: 3, priority: 1, originalPriority: 1, status: 'idle', holdingMutex: false, progress: 0 },
    ]);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 border-b border-red-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="size-8 text-red-400" />
            <h1 className="text-4xl font-bold">Priority Inversion</h1>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            La <span className="text-red-400 font-semibold">inversión de prioridad</span> ocurre cuando una tarea de alta 
            prioridad se ve forzada a esperar por una tarea de baja prioridad que posee un recurso compartido. Esto puede 
            llevar a que tareas críticas pierdan sus deadlines.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
              <h3 className="font-bold text-red-300 mb-2">⚠️ Problema</h3>
              <p className="text-sm text-gray-300">
                Tarea de alta prioridad bloqueada indefinidamente por tarea de baja prioridad que tiene el lock,
                mientras tareas de media prioridad ejecutan libremente.
              </p>
            </div>
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
              <h3 className="font-bold text-purple-300 mb-2">✅ Soluciones</h3>
              <p className="text-sm text-gray-300">
                Priority inheritance, priority ceiling, desactivar prioridades temporalmente, o evitar 
                compartir recursos entre tareas de diferentes prioridades.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="multiple" defaultValue={["pseudocodigos", "demos"]} className="space-y-4">
          {/* Sección de Pseudocódigos */}
          <AccordionItem value="pseudocodigos" className="bg-gray-800 rounded-lg border border-gray-700">
            <AccordionTrigger className="text-xl font-bold px-6">
              <div className="flex items-center gap-2">
                <Code className="size-5" />
                <span>Pseudocódigos de las Soluciones</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="ps-inheritance" className="px-6 pb-6">
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-4 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="ps-inheritance">⬆️ Inheritance</TabsTrigger>
                    <TabsTrigger value="ps-ceiling">🔝 Ceiling</TabsTrigger>
                    <TabsTrigger value="ps-disable">🚫 Disable</TabsTrigger>
                    <TabsTrigger value="ps-avoid">🔒 Avoid</TabsTrigger>
                  </TabsList>
                </div>

                {/* Pseudocódigo 1: Priority Inheritance */}
                <TabsContent value="ps-inheritance" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-blue-700/50">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">⬆️ Priority Inheritance Protocol</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">1. Implementación Básica</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura PriorityInheritanceMutex {
  owner: Thread | null           // Dueño actual del mutex
  waitQueue: PriorityQueue<Thread>  // Cola de threads esperando
  locked: booleano = false
  originalPriority: entero | null   // Prioridad original del owner
}

función lock(thread: Thread) {
  si no locked:
    // Caso simple: mutex disponible
    locked = true
    owner = thread
    originalPriority = null
  sino:
    // Mutex ocupado: aplicar priority inheritance
    si thread.priority > owner.priority:
      // Thread con mayor prioridad está esperando
      si originalPriority == null:
        // Guardar prioridad original del owner (primera vez)
        originalPriority = owner.priority
      
      // HERENCIA: elevar prioridad del owner
      owner.priority = thread.priority
      logInheritance(owner, thread.priority)
    
    // Agregar thread a cola de espera
    waitQueue.enqueue(thread)
    thread.block()  // Bloquear thread
}

función unlock(thread: Thread) {
  si thread != owner:
    throw IllegalStateException("Thread no es dueño del mutex")
  
  // Restaurar prioridad original del owner
  si originalPriority != null:
    thread.priority = originalPriority
    originalPriority = null
    logRestore(thread)
  
  // Despertar siguiente thread en espera
  si no waitQueue.isEmpty():
    nextThread = waitQueue.dequeue()
    owner = nextThread
    nextThread.unblock()
  sino:
    locked = false
    owner = null
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">2. Herencia Transitiva (Cadenas)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Caso: Thread A espera por B, B espera por C
// Solución: C debe heredar prioridad de A (transitivamente)

estructura ChainedInheritanceMutex {
  owner: Thread | null
  waitQueue: PriorityQueue<Thread>
  originalPriority: entero | null
}

función lock(thread: Thread) {
  si no locked:
    locked = true
    owner = thread
    retornar
  
  // Agregar a cola de espera
  waitQueue.enqueue(thread)
  
  // Propagar prioridad a través de la cadena
  si thread.priority > owner.priority:
    propagatePriority(owner, thread.priority)
  
  thread.block()
}

función propagatePriority(thread: Thread, newPriority: entero) {
  si thread.priority >= newPriority:
    retornar  // Ya tiene prioridad suficiente
  
  // Guardar prioridad original (solo primera vez)
  si thread.inheritedPriority == null:
    thread.originalPriority = thread.priority
  
  // Elevar prioridad
  thread.priority = newPriority
  thread.inheritedPriority = newPriority
  logInheritance(thread, newPriority)
  
  // Si este thread está esperando otro mutex, propagar
  si thread.blockingMutex != null:
    mutexOwner = thread.blockingMutex.owner
    si mutexOwner != null:
      propagatePriority(mutexOwner, newPriority)  // RECURSIÓN
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">3. Manejo de Múltiples Mutexes</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura Thread {
  priority: entero
  originalPriority: entero
  ownedMutexes: Set<Mutex>       // Mutexes que posee
  blockingMutex: Mutex | null     // Mutex por el que está bloqueado
}

función unlock(mutex: Mutex, thread: Thread) {
  si thread != mutex.owner:
    throw IllegalStateException()
  
  // Remover de lista de mutexes poseídos
  thread.ownedMutexes.remove(mutex)
  
  // Calcular nueva prioridad efectiva
  nuevaPrioridad = thread.originalPriority
  
  // Buscar la mayor prioridad heredada de otros mutexes
  para cadaMutex en thread.ownedMutexes:
    para cadaWaiter en cadaMutex.waitQueue:
      si cadaWaiter.priority > nuevaPrioridad:
        nuevaPrioridad = cadaWaiter.priority
  
  // Actualizar prioridad del thread
  thread.priority = nuevaPrioridad
  
  // Liberar mutex y despertar siguiente
  si no mutex.waitQueue.isEmpty():
    nextThread = mutex.waitQueue.dequeue()
    mutex.owner = nextThread
    nextThread.ownedMutexes.add(mutex)
    nextThread.unblock()
  sino:
    mutex.locked = false
    mutex.owner = null
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">4. Ejemplo de Uso</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Configuración de threads
threadAlta = new Thread(id: 1, priority: 10)   // Alta prioridad
threadMedia = new Thread(id: 2, priority: 5)   // Media prioridad
threadBaja = new Thread(id: 3, priority: 1)    // Baja prioridad

mutex = new PriorityInheritanceMutex()

// Ejecución simulada
función simulacion() {
  // T3 (baja) adquiere el mutex
  mutex.lock(threadBaja)
  logState("T3 tiene mutex, prioridad = 1")
  
  // T2 (media) comienza a ejecutar (sin necesitar mutex)
  schedule(threadMedia)
  
  // T1 (alta) intenta adquirir mutex
  mutex.lock(threadAlta)
  // ¡INHERITANCE! T3 ahora tiene prioridad 10
  logState("T3 hereda prioridad 10 de T1")
  
  // T3 con prioridad 10 expulsa a T2 y termina
  schedule(threadBaja)  // Ahora con prioridad heredada
  mutex.unlock(threadBaja)
  logState("T3 libera mutex, prioridad restaurada a 1")
  
  // T1 despierta y obtiene mutex
  schedule(threadAlta)
  logState("T1 obtiene mutex y ejecuta")
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                          <span className="font-bold">Ventajas:</span> Previene inversión de prioridad sin conocimiento previo
                          de las prioridades. Dinámico y flexible.<br/>
                          <span className="font-bold">Desventajas:</span> Overhead en tiempo de ejecución, complejidad en 
                          cadenas de herencia, puede causar efectos dominó.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                          <span className="font-bold">Casos de Uso:</span> RTOS (FreeRTOS, VxWorks), sistemas embebidos,
                          control industrial, robótica, aviación, Mars Pathfinder (bug famoso).
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 2: Priority Ceiling */}
                <TabsContent value="ps-ceiling" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-green-700/50">
                    <h3 className="text-xl font-bold text-green-400 mb-4">🔝 Priority Ceiling Protocol</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">1. Implementación Básica</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura PriorityCeilingMutex {
  owner: Thread | null
  waitQueue: PriorityQueue<Thread>
  locked: booleano = false
  ceiling: entero                    // TECHO DE PRIORIDAD (fijo)
}

// El ceiling se establece al crear el mutex
función crearMutex(recursosCompartidos: Array<Thread>) -> PriorityCeilingMutex {
  // Ceiling = mayor prioridad de todos los threads que usarán el mutex
  maxPriority = 0
  para thread en recursosCompartidos:
    si thread.priority > maxPriority:
      maxPriority = thread.priority
  
  retornar new PriorityCeilingMutex(ceiling: maxPriority)
}

función lock(thread: Thread, mutex: PriorityCeilingMutex) {
  // Verificar si el thread puede adquirir el mutex
  si no mutex.locked:
    // Verificar que no haya deadlock potencial
    si thread.priority > systemCeiling():
      throw PriorityCeilingViolation()
    
    mutex.locked = true
    mutex.owner = thread
    
    // ELEVAR prioridad del thread al ceiling del mutex
    thread.originalPriority = thread.priority
    thread.priority = mutex.ceiling
    logCeilingApplied(thread, mutex.ceiling)
  sino:
    // Mutex ocupado: esperar
    mutex.waitQueue.enqueue(thread)
    thread.block()
}

función unlock(mutex: PriorityCeilingMutex) {
  thread = currentThread()
  si thread != mutex.owner:
    throw IllegalStateException()
  
  // RESTAURAR prioridad original
  thread.priority = thread.originalPriority
  logPriorityRestored(thread)
  
  // Liberar mutex
  si no mutex.waitQueue.isEmpty():
    nextThread = mutex.waitQueue.dequeue()
    mutex.owner = nextThread
    nextThread.originalPriority = nextThread.priority
    nextThread.priority = mutex.ceiling  // Elevar al ceiling
    nextThread.unblock()
  sino:
    mutex.locked = false
    mutex.owner = null
}

función systemCeiling() -> entero {
  // Ceiling del sistema = máximo ceiling de mutexes actualmente locked
  maxCeiling = 0
  para mutex en todosLosMutexes:
    si mutex.locked Y mutex.ceiling > maxCeiling:
      maxCeiling = mutex.ceiling
  retornar maxCeiling
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">2. Immediate Ceiling Priority Protocol (ICPP)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Variante: elevar prioridad INMEDIATAMENTE al hacer lock
// No esperar a que otro thread de mayor prioridad intente acceder

estructura ICPPMutex {
  ceiling: entero
  owner: Thread | null
  locked: booleano = false
}

función lock(thread: Thread, mutex: ICPPMutex) {
  // Verificar system ceiling para prevenir deadlock
  currentSystemCeiling = systemCeiling()
  
  si currentSystemCeiling > thread.priority:
    // No puede adquirir: hay un mutex con ceiling mayor locked
    throw CeilingViolation("System ceiling too high")
  
  // Esperar si está locked
  mientras mutex.locked:
    thread.waitFor(mutex)
  
  // Adquirir mutex
  mutex.locked = true
  mutex.owner = thread
  
  // INMEDIATAMENTE elevar a ceiling (antes de crítica)
  thread.originalPriority = thread.priority
  thread.priority = mutex.ceiling
  
  logICPP("Thread " + thread.id + " elevado a ceiling " + mutex.ceiling)
}

función unlock(mutex: ICPPMutex) {
  thread = currentThread()
  
  // Restaurar prioridad original
  thread.priority = thread.originalPriority
  
  // Liberar mutex
  mutex.locked = false
  mutex.owner = null
  
  // Despertar threads esperando
  notifyWaiters(mutex)
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">3. Original Ceiling Priority Protocol (OCPP)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Variante original: thread solo puede hacer lock si su prioridad
// es MAYOR que todos los ceilings de mutexes actualmente locked

estructura OCPPMutex {
  ceiling: entero
  owner: Thread | null
  locked: booleano = false
}

función canLock(thread: Thread, mutex: OCPPMutex) -> booleano {
  si mutex.locked Y mutex.owner == thread:
    retornar true  // Reentrant lock
  
  // Verificar contra system ceiling
  sysceiling = systemCeiling()
  
  // Thread debe tener prioridad > system ceiling
  retornar thread.priority > sysceiling
}

función lock(thread: Thread, mutex: OCPPMutex) {
  mientras true:
    si no mutex.locked:
      si canLock(thread, mutex):
        // Puede adquirir el mutex
        mutex.locked = true
        mutex.owner = thread
        
        // Elevar a ceiling del mutex
        thread.originalPriority = thread.priority
        thread.priority = max(thread.priority, mutex.ceiling)
        retornar
      sino:
        // No puede adquirir: prioridad insuficiente
        thread.block()
    sino:
      // Mutex ocupado: esperar
      thread.waitFor(mutex)
}

// Ejemplo de ceilings
función ejemploCeilings() {
  // Tres threads con prioridades 10, 5, 1
  T1 = new Thread(priority: 10)  // Alta
  T2 = new Thread(priority: 5)   // Media
  T3 = new Thread(priority: 1)   // Baja
  
  // Dos recursos compartidos
  // R1: usado por T1 y T3 -> ceiling = 10
  // R2: usado por T2 y T3 -> ceiling = 5
  R1 = new OCPPMutex(ceiling: 10)
  R2 = new OCPPMutex(ceiling: 5)
  
  // Si T3 tiene R2 (ceiling 5), T1 puede adquirir R1
  // porque priority(T1)=10 > systemCeiling(R2)=5
  
  // Si T3 tiene R1 (ceiling 10), T2 NO puede adquirir R2
  // porque priority(T2)=5 < systemCeiling(R1)=10
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">4. Comparación de Variantes</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`tabla ComparacionProtocolos:

| Aspecto              | ICPP                    | OCPP                    |
|---------------------|-------------------------|-------------------------|
| Cuándo eleva        | Inmediato al lock       | Solo si necesario       |
| Chequeo previo      | System ceiling simple   | Ceiling más estricto    |
| Bloqueos            | Menos frecuentes        | Más frecuentes          |
| Cambios prioridad   | Más frecuentes          | Menos frecuentes        |
| Complejidad         | Más simple              | Más compleja            |
| Overhead            | Moderado                | Menor                   |
| Deadlock prevention | Más agresiva            | Más conservadora        |

función elegirProtocolo(requisitos: Requisitos) -> Protocolo {
  si requisitos.latenciaCritica:
    retornar ICPP  // Menor jitter, más predecible
  sino si requisitos.eficienciaEnergia:
    retornar OCPP  // Menos cambios de prioridad
  sino:
    retornar ICPP  // Default: más simple y robusto
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                        <p className="text-sm text-green-200">
                          <span className="font-bold">Ventajas:</span> Previene deadlocks, acotamiento en tiempo de bloqueo,
                          análisis estático posible, predecible para hard real-time.<br/>
                          <span className="font-bold">Desventajas:</span> Requiere conocimiento a priori de prioridades,
                          puede elevar prioridad innecesariamente, menos flexible que inheritance.
                        </p>
                      </div>

                      <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                        <p className="text-sm text-green-200">
                          <span className="font-bold">Casos de Uso:</span> Sistemas hard real-time, aviación crítica (DO-178C),
                          sistemas médicos, automotriz (AUTOSAR), análisis WCET, certificación safety-critical.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 3: Disable Priority Scheduling */}
                <TabsContent value="ps-disable" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-purple-700/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">🚫 Disable Priority Scheduling</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">1. Desactivación de Interrupciones</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura DisableInterruptsMutex {
  locked: booleano = false
  owner: Thread | null
  savedInterruptState: booleano
}

función lock(mutex: DisableInterruptsMutex) {
  // Desactivar interrupciones (hardware)
  mutex.savedInterruptState = getInterruptState()
  disableInterrupts()  // CLI en x86, CPSID en ARM
  
  // Adquirir mutex (sin competencia ahora)
  mientras mutex.locked:
    spin()  // Busy-wait (no hay preemption)
  
  mutex.locked = true
  mutex.owner = currentThread()
  
  logDisabled("Interrupts disabled, mutex acquired")
}

función unlock(mutex: DisableInterruptsMutex) {
  si currentThread() != mutex.owner:
    throw IllegalStateException()
  
  // Liberar mutex
  mutex.locked = false
  mutex.owner = null
  
  // RESTAURAR interrupciones al estado previo
  si mutex.savedInterruptState:
    enableInterrupts()  // STI en x86, CPSIE en ARM
  
  logEnabled("Interrupts restored")
}

// Uso típico en sección crítica corta
función criticalSection() {
  disableInterruptsMutex.lock()
  intentar:
    // Sección crítica (MUY CORTA - pocos microsegundos)
    sharedData.update()
  finalmente:
    disableInterruptsMutex.unlock()
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">2. Desactivación de Preemption</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura NonPreemptiveMutex {
  locked: booleano = false
  owner: Thread | null
  savedPreemptionState: booleano
}

función lock(mutex: NonPreemptiveMutex) {
  // Desactivar preemption (scheduler no cambiará de thread)
  mutex.savedPreemptionState = isPreemptionEnabled()
  disablePreemption()
  
  // Adquirir mutex
  mientras mutex.locked:
    // Si está locked, tenemos problema (no deberíamos estar aquí)
    // porque preemption está desactivada
    panic("Deadlock: mutex locked with preemption disabled")
  
  mutex.locked = true
  mutex.owner = currentThread()
  
  logNonPreemptive("Preemption disabled, mutex acquired")
}

función unlock(mutex: NonPreemptiveMutex) {
  si currentThread() != mutex.owner:
    throw IllegalStateException()
  
  // Liberar mutex
  mutex.locked = false
  mutex.owner = null
  
  // Restaurar preemption
  si mutex.savedPreemptionState:
    enablePreemption()
    // Puede haber cambio de contexto aquí si hay thread de mayor prioridad listo
  
  logPreemptionEnabled("Preemption restored")
}

// API típica de kernel
función kernel_disable_preemption() {
  currentCPU().preemption_count++
}

función kernel_enable_preemption() {
  currentCPU().preemption_count--
  si currentCPU().preemption_count == 0:
    si need_resched():
      schedule()  // Cambiar a thread de mayor prioridad
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">3. Priority Boosting Temporal</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Alternativa: elevar temporalmente a prioridad máxima

estructura TemporaryBoostMutex {
  locked: booleano = false
  owner: Thread | null
  maxPriority: entero = 999  // Prioridad máxima del sistema
}

función lock(mutex: TemporaryBoostMutex) {
  thread = currentThread()
  
  // Guardar prioridad original
  originalPriority = thread.priority
  
  // BOOST: elevar a prioridad máxima
  thread.priority = mutex.maxPriority
  logBoost("Thread boosted to max priority")
  
  // Adquirir mutex (ahora con máxima prioridad)
  mientras mutex.locked:
    yield()  // Ceder CPU pero mantener alta prioridad
  
  mutex.locked = true
  mutex.owner = thread
  thread.savedPriority = originalPriority
}

función unlock(mutex: TemporaryBoostMutex) {
  thread = currentThread()
  si thread != mutex.owner:
    throw IllegalStateException()
  
  // Liberar mutex
  mutex.locked = false
  mutex.owner = null
  
  // Restaurar prioridad original
  thread.priority = thread.savedPriority
  logRestore("Priority restored")
  
  // Puede haber cambio de contexto si otro thread tiene mayor prioridad
  yield()
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">4. Non-Preemptive Critical Section</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Enfoque más simple: sección crítica no interrumpible

macro ENTER_CRITICAL_SECTION() {
  cli()  // Clear Interrupt Flag
  preempt_disable()
}

macro EXIT_CRITICAL_SECTION() {
  preempt_enable()
  sti()  // Set Interrupt Flag
}

// Uso en código
función actualizarRecursoCompartido() {
  ENTER_CRITICAL_SECTION()
  
  // Código crítico - NO SE PUEDE INTERRUMPIR
  recursoCompartido.valor++
  recursoCompartido.timestamp = getTime()
  recursoCompartido.checksum = calcularChecksum()
  
  EXIT_CRITICAL_SECTION()
}

// Variante con spinlock
estructura CriticalSection {
  spinlock: AtomicBoolean = false
}

función enter(cs: CriticalSection) {
  disablePreemption()
  
  // Spinlock para multicore
  mientras no cs.spinlock.compareAndSwap(false, true):
    spin()  // Busy-wait
}

función exit(cs: CriticalSection) {
  cs.spinlock.set(false)
  enablePreemption()
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                        <p className="text-sm text-purple-200">
                          <span className="font-bold">Ventajas:</span> Solución simple y efectiva, muy bajo overhead,
                          no hay inversión de prioridad posible, predecible.<br/>
                          <span className="font-bold">Desventajas:</span> Aumenta latencia de interrupciones, no escalable,
                          solo para secciones críticas MUY cortas (&lt; 100μs), problemas en multicore.
                        </p>
                      </div>

                      <div className="p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                        <p className="text-sm text-purple-200">
                          <span className="font-bold">Casos de Uso:</span> Kernels de OS (Linux, Windows), drivers de dispositivos,
                          secciones críticas de hardware, inicialización de sistema, manejo de errores críticos.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 4: Evitar Compartir Recursos */}
                <TabsContent value="ps-avoid" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-yellow-700/50">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">🔒 Evitar Compartir Recursos</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">1. Thread-Local Storage</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Cada thread tiene su propia copia de los datos

estructura ThreadLocalStorage<T> {
  storage: Map<ThreadID, T>
  mutex: Lock
  initializer: Function<T>
}

función get() -> T {
  threadId = currentThread().id
  
  si no storage.contains(threadId):
    mutex.lock()
    intentar:
      // Double-check locking
      si no storage.contains(threadId):
        valor = initializer()
        storage[threadId] = valor
    finalmente:
      mutex.unlock()
  
  retornar storage[threadId]  // Sin lock: cada thread su copia
}

función set(valor: T) {
  threadId = currentThread().id
  mutex.lock()
  intentar:
    storage[threadId] = valor
  finalmente:
    mutex.unlock()
}

// Ejemplo: buffer de logs por thread
threadLocalBuffer = new ThreadLocalStorage<LogBuffer>(
  initializer: función() {
    retornar new LogBuffer(size: 1024)
  }
)

función log(mensaje: String) {
  buffer = threadLocalBuffer.get()  // Sin contención
  buffer.append(mensaje)            // Sin locks
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">2. Message Passing (Actor Model)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Threads no comparten memoria: se comunican por mensajes

estructura Actor {
  id: ActorID
  mailbox: Queue<Message>  // Solo este actor accede su mailbox
  state: Estado            // Estado privado (no compartido)
}

función send(destino: ActorID, mensaje: Message) {
  actor = actors.get(destino)
  actor.mailbox.enqueue(mensaje)  // Queue thread-safe
}

función processMessages() {
  mientras running:
    mensaje = mailbox.dequeue()  // Bloquea si vacío
    
    // Procesar mensaje (sin locks: estado es privado)
    cuando mensaje.type:
      GET_DATA:
        resultado = state.getData()
        send(mensaje.sender, new Response(resultado))
      
      SET_DATA:
        state.setData(mensaje.data)  // Sin locks
        send(mensaje.sender, new Ack())
      
      COMPUTE:
        resultado = state.compute(mensaje.params)
        send(mensaje.sender, new Result(resultado))
}

// Ejemplo: sistema bancario con actors
estructura AccountActor extends Actor {
  balance: entero  // Estado privado
}

función transferencia(origen: ActorID, destino: ActorID, monto: entero) {
  // No hay locks: solo mensajes
  send(origen, new WithdrawMessage(monto, requestId: 1))
  
  // Esperar confirmación
  respuesta = waitForResponse(requestId: 1)
  
  si respuesta.success:
    send(destino, new DepositMessage(monto, requestId: 2))
    waitForResponse(requestId: 2)
  
  // Sin deadlocks: no hay locks compartidos
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">3. Inmutabilidad y Shared-Nothing</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Datos inmutables: pueden compartirse sin locks

estructura InmutableData {
  valores: Array<entero>  // Inmutable después de construcción
  timestamp: entero       // Inmutable
}

// Constructor: única vez que se modifica
función crear(valores: Array<entero>) -> InmutableData {
  copia = copiar(valores)
  retornar new InmutableData(copia, now())
}

// Lecturas sin locks (datos nunca cambian)
función leer(data: InmutableData, indice: entero) -> entero {
  retornar data.valores[indice]  // Sin lock: es inmutable
}

// "Modificación" = crear nueva instancia
función modificar(data: InmutableData, indice: entero, valor: entero) -> InmutableData {
  nuevosValores = copiar(data.valores)
  nuevosValores[indice] = valor
  retornar crear(nuevosValores)  // Nueva instancia
}

// Uso en sistema concurrente
estructura SharedState {
  data: Atomic<InmutableData>  // Referencia atómica
}

función actualizarEstado(state: SharedState, cambio: Cambio) {
  mientras true:
    actual = state.data.get()            // Leer sin lock
    nuevo = aplicarCambio(actual, cambio)  // Crear nuevo
    
    si state.data.compareAndSwap(actual, nuevo):
      break  // Éxito: publicado nuevo estado
    // Fallo: otro thread actualizó, reintentar
}

// Lectura siempre sin locks
función leerEstado(state: SharedState) -> InmutableData {
  retornar state.data.get()  // Atómico, sin locks
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">4. Particionamiento de Datos</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Dividir datos para que cada thread tenga su partición

estructura PartitionedData<T> {
  partitions: Array<Partition<T>>
  numPartitions: entero
}

estructura Partition<T> {
  data: Map<Key, T>
  mutex: Lock  // Lock solo para esta partición
}

función getPartition(key: Key) -> entero {
  retornar hash(key) % numPartitions
}

función get(key: Key) -> T {
  partitionId = getPartition(key)
  partition = partitions[partitionId]
  
  partition.mutex.lock()
  intentar:
    retornar partition.data.get(key)
  finalmente:
    partition.mutex.unlock()
}

función put(key: Key, valor: T) {
  partitionId = getPartition(key)
  partition = partitions[partitionId]
  
  partition.mutex.lock()
  intentar:
    partition.data.put(key, valor)
  finalmente:
    partition.mutex.unlock()
}

// Ventaja: threads accediendo diferentes particiones no compiten

// Ejemplo: cache particionada
función ejemploCache() {
  // 16 particiones para reducir contención
  cache = new PartitionedData<CacheEntry>(numPartitions: 16)
  
  // Thread 1 accede keys con hash 0-3
  // Thread 2 accede keys con hash 4-7
  // Thread 3 accede keys con hash 8-11
  // Thread 4 accede keys con hash 12-15
  
  // Contención solo si dos threads acceden misma partición
  // Probabilidad: 1/16 con buena función hash
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">5. Wait-Free Data Structures</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Estructuras sin locks usando operaciones atómicas

estructura WaitFreeQueue<T> {
  buffer: Array<AtomicReference<T>>
  head: AtomicInteger
  tail: AtomicInteger
  capacity: entero
}

función enqueue(item: T) -> booleano {
  mientras true:
    currentTail = tail.get()
    nextTail = (currentTail + 1) % capacity
    
    si nextTail == head.get():
      retornar false  // Cola llena
    
    // Intentar colocar item
    si buffer[currentTail].compareAndSwap(null, item):
      // Avanzar tail
      tail.compareAndSwap(currentTail, nextTail)
      retornar true
    
    // Otro thread tomó este slot, reintentar
}

función dequeue() -> T {
  mientras true:
    currentHead = head.get()
    
    si currentHead == tail.get():
      retornar null  // Cola vacía
    
    item = buffer[currentHead].get()
    si item != null:
      // Intentar tomar item
      si buffer[currentHead].compareAndSwap(item, null):
        // Avanzar head
        head.compareAndSwap(currentHead, (currentHead + 1) % capacity)
        retornar item
    
    // Reintentar
}

// Sin locks: múltiples producers y consumers sin bloqueo
// Wait-free: cada operación termina en tiempo acotado`}
                        </pre>
                      </div>

                      <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                        <p className="text-sm text-yellow-200">
                          <span className="font-bold">Ventajas:</span> Elimina completamente la inversión de prioridad,
                          alta escalabilidad, sin deadlocks, mejor rendimiento en multicore.<br/>
                          <span className="font-bold">Desventajas:</span> Mayor uso de memoria, complejidad de diseño,
                          no siempre es posible evitar compartir, overhead de sincronización alternativa.
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                        <p className="text-sm text-yellow-200">
                          <span className="font-bold">Casos de Uso:</span> Sistemas funcionales (Erlang/Elixir), microservicios,
                          bases de datos distribuidas (Cassandra, Riak), sistemas reactivos, event-driven architectures,
                          lock-free data structures (Java concurrent package).
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de Demostraciones */}
          <AccordionItem value="demos" className="bg-gray-800 rounded-lg border border-gray-700">
            <AccordionTrigger className="text-xl font-bold px-6">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5" />
                <span>Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="demo-inheritance" className="px-6 pb-6">
                <TabsList className="grid grid-cols-4 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="demo-inheritance">⬆️ Inheritance</TabsTrigger>
                  <TabsTrigger value="demo-ceiling">🔝 Ceiling</TabsTrigger>
                  <TabsTrigger value="demo-disable">🚫 Disable</TabsTrigger>
                  <TabsTrigger value="demo-avoid">🔒 Avoid</TabsTrigger>
                </TabsList>

                {/* Demo 1: Priority Inheritance */}
                <TabsContent value="demo-inheritance" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-blue-700/50">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">⬆️ Demostración: Priority Inheritance</h3>
                    
                    {/* Controles */}
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setInheritanceRunning(!inheritanceRunning)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        {inheritanceRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {inheritanceRunning ? 'Pausar' : 'Iniciar'}
                      </button>
                      <button
                        onClick={resetInheritance}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-400">Velocidad:</span>
                        <Slider
                          value={[inheritanceSpeed]}
                          onValueChange={([v]) => setInheritanceSpeed(v)}
                          min={200}
                          max={1500}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-xs text-gray-500">{inheritanceSpeed}ms</span>
                      </div>
                    </div>

                    {/* Visualización de Threads */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-blue-300 mb-3">Estado de los Threads</h4>
                      <div className="space-y-3">
                        {inheritanceThreads.map(thread => (
                          <div key={thread.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold ${
                                thread.status === 'running' ? 'text-green-400' :
                                thread.status === 'waiting' ? 'text-yellow-400' :
                                thread.status === 'blocked' ? 'text-red-400' :
                                thread.status === 'completed' ? 'text-blue-400' : 'text-gray-400'
                              }`}>
                                T{thread.id} - {thread.id === 1 ? 'Alta' : thread.id === 2 ? 'Media' : 'Baja'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${thread.priority !== thread.originalPriority ? 'text-yellow-300 font-bold' : 'text-gray-400'}`}>
                                  Prioridad: {thread.originalPriority} → {thread.priority}
                                  {thread.priority !== thread.originalPriority && ' (heredada)'}
                                </span>
                                {thread.holdingMutex && <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">🔒 Mutex</span>}
                                <span className="text-xs text-gray-500">
                                  {thread.status === 'running' ? '🟢 Ejecutando' :
                                   thread.status === 'waiting' ? '🟡 Esperando' :
                                   thread.status === 'blocked' ? '🔴 Bloqueado' :
                                   thread.status === 'completed' ? '✅ Completado' : '⚪ Inactivo'}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  thread.status === 'running' ? 'bg-green-500' :
                                  thread.status === 'completed' ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                                style={{ width: `${thread.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Log de Eventos */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-blue-300 mb-2">Log de Eventos</h4>
                      <div ref={inheritanceLogRef} className="h-48 overflow-y-auto font-mono text-xs space-y-1">
                        {inheritanceLogs.length === 0 ? (
                          <div className="text-gray-500 italic">Presiona "Iniciar" para comenzar la simulación...</div>
                        ) : (
                          inheritanceLogs.map((log, idx) => (
                            <div key={idx} className="text-gray-300">{log}</div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                      <p className="text-sm text-blue-200">
                        <span className="font-bold">Observa:</span> Cuando T1 (alta) intenta adquirir el mutex ocupado por T3 (baja),
                        T3 hereda la prioridad de T1 dinámicamente, permitiendo completar rápido y ceder el recurso.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Priority Ceiling */}
                <TabsContent value="demo-ceiling" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-green-700/50">
                    <h3 className="text-xl font-bold text-green-400 mb-4">🔝 Demostración: Priority Ceiling</h3>
                    
                    {/* Controles */}
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setCeilingRunning(!ceilingRunning)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        {ceilingRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {ceilingRunning ? 'Pausar' : 'Iniciar'}
                      </button>
                      <button
                        onClick={resetCeiling}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-400">Velocidad:</span>
                        <Slider
                          value={[ceilingSpeed]}
                          onValueChange={([v]) => setCeilingSpeed(v)}
                          min={200}
                          max={1500}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-xs text-gray-500">{ceilingSpeed}ms</span>
                      </div>
                      <div className="px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg">
                        <span className="text-sm text-green-300">Mutex Ceiling: <span className="font-bold">{mutexCeiling}</span></span>
                      </div>
                    </div>

                    {/* Visualización de Threads */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-green-300 mb-3">Estado de los Threads</h4>
                      <div className="space-y-3">
                        {ceilingThreads.map(thread => (
                          <div key={thread.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold ${
                                thread.status === 'running' ? 'text-green-400' :
                                thread.status === 'waiting' ? 'text-yellow-400' :
                                thread.status === 'blocked' ? 'text-red-400' :
                                thread.status === 'completed' ? 'text-blue-400' : 'text-gray-400'
                              }`}>
                                T{thread.id} - {thread.id === 1 ? 'Alta' : thread.id === 2 ? 'Media' : 'Baja'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${thread.priority !== thread.originalPriority ? 'text-yellow-300 font-bold' : 'text-gray-400'}`}>
                                  Prioridad: {thread.originalPriority} → {thread.priority}
                                  {thread.priority === mutexCeiling && thread.holdingMutex && ' (ceiling)'}
                                </span>
                                {thread.holdingMutex && <span className="text-xs bg-green-600 px-2 py-0.5 rounded">🔒 Mutex</span>}
                                <span className="text-xs text-gray-500">
                                  {thread.status === 'running' ? '🟢 Ejecutando' :
                                   thread.status === 'waiting' ? '🟡 Esperando' :
                                   thread.status === 'blocked' ? '🔴 Bloqueado' :
                                   thread.status === 'completed' ? '✅ Completado' : '⚪ Inactivo'}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  thread.status === 'running' ? 'bg-green-500' :
                                  thread.status === 'completed' ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                                style={{ width: `${thread.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Log de Eventos */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-green-300 mb-2">Log de Eventos</h4>
                      <div ref={ceilingLogRef} className="h-48 overflow-y-auto font-mono text-xs space-y-1">
                        {ceilingLogs.length === 0 ? (
                          <div className="text-gray-500 italic">Presiona "Iniciar" para comenzar la simulación...</div>
                        ) : (
                          ceilingLogs.map((log, idx) => (
                            <div key={idx} className="text-gray-300">{log}</div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                      <p className="text-sm text-green-200">
                        <span className="font-bold">Observa:</span> T3 es elevada inmediatamente al ceiling del mutex (10)
                        al adquirirlo, previniendo que T2 la interrumpa. Esto evita la inversión de prioridad de forma proactiva.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Disable Priority */}
                <TabsContent value="demo-disable" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-purple-700/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">🚫 Demostración: Disable Preemption</h3>
                    
                    {/* Controles */}
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setDisableRunning(!disableRunning)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        {disableRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {disableRunning ? 'Pausar' : 'Iniciar'}
                      </button>
                      <button
                        onClick={resetDisable}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-400">Velocidad:</span>
                        <Slider
                          value={[disableSpeed]}
                          onValueChange={([v]) => setDisableSpeed(v)}
                          min={200}
                          max={1500}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-xs text-gray-500">{disableSpeed}ms</span>
                      </div>
                      <div className={`px-4 py-2 border rounded-lg ${
                        preemptionEnabled 
                          ? 'bg-green-900/50 border-green-700 text-green-300' 
                          : 'bg-red-900/50 border-red-700 text-red-300'
                      }`}>
                        <span className="text-sm font-bold">
                          Preemption: {preemptionEnabled ? '✅ Activa' : '🚫 Desactivada'}
                        </span>
                      </div>
                    </div>

                    {/* Visualización de Threads */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-purple-300 mb-3">Estado de los Threads</h4>
                      <div className="space-y-3">
                        {disableThreads.map(thread => (
                          <div key={thread.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold ${
                                thread.status === 'running' ? 'text-green-400' :
                                thread.status === 'waiting' ? 'text-yellow-400' :
                                thread.status === 'blocked' ? 'text-red-400' :
                                thread.status === 'completed' ? 'text-blue-400' : 'text-gray-400'
                              }`}>
                                T{thread.id} - {thread.id === 1 ? 'Alta' : thread.id === 2 ? 'Media' : 'Baja'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  Prioridad: {thread.priority}
                                </span>
                                {thread.holdingMutex && <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">🔒 Sección Crítica</span>}
                                <span className="text-xs text-gray-500">
                                  {thread.status === 'running' ? '🟢 Ejecutando' :
                                   thread.status === 'waiting' ? '🟡 Esperando' :
                                   thread.status === 'blocked' ? '🔴 Bloqueado' :
                                   thread.status === 'completed' ? '✅ Completado' : '⚪ Inactivo'}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  thread.status === 'running' ? 'bg-green-500' :
                                  thread.status === 'completed' ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                                style={{ width: `${thread.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Log de Eventos */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-purple-300 mb-2">Log de Eventos</h4>
                      <div ref={disableLogRef} className="h-48 overflow-y-auto font-mono text-xs space-y-1">
                        {disableLogs.length === 0 ? (
                          <div className="text-gray-500 italic">Presiona "Iniciar" para comenzar la simulación...</div>
                        ) : (
                          disableLogs.map((log, idx) => (
                            <div key={idx} className="text-gray-300">{log}</div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                      <p className="text-sm text-purple-200">
                        <span className="font-bold">Observa:</span> Cuando T3 entra a su sección crítica, desactiva la preemption,
                        haciendo imposible que T1 o T2 la interrumpan. Esto elimina completamente la inversión de prioridad.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Avoid Sharing */}
                <TabsContent value="demo-avoid" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-yellow-700/50">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">🔒 Demostración: Evitar Compartir Recursos</h3>
                    
                    {/* Controles */}
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setAvoidRunning(!avoidRunning)}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        {avoidRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                        {avoidRunning ? 'Pausar' : 'Iniciar'}
                      </button>
                      <button
                        onClick={resetAvoid}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-400">Velocidad:</span>
                        <Slider
                          value={[avoidSpeed]}
                          onValueChange={([v]) => setAvoidSpeed(v)}
                          min={200}
                          max={1500}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-xs text-gray-500">{avoidSpeed}ms</span>
                      </div>
                    </div>

                    {/* Visualización de Threads */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-yellow-300 mb-3">Threads con Datos Locales (Thread-Local Storage)</h4>
                      <div className="space-y-3">
                        {avoidThreads.map(thread => (
                          <div key={thread.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold ${
                                thread.status === 'running' ? 'text-green-400' :
                                thread.status === 'completed' ? 'text-blue-400' : 'text-gray-400'
                              }`}>
                                T{thread.id} - Prioridad {thread.priority}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-yellow-600 px-2 py-0.5 rounded">📦 Datos Propios</span>
                                <span className="text-xs text-gray-500">
                                  {thread.status === 'running' ? '🟢 Ejecutando' :
                                   thread.status === 'completed' ? '✅ Completado' : '⚪ Inactivo'}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  thread.status === 'running' ? 'bg-green-500' :
                                  thread.status === 'completed' ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                                style={{ width: `${thread.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Message Passing Visualization */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-yellow-300 mb-3">Message Passing (Actor Model)</h4>
                      <div className="h-32 flex items-center justify-around relative">
                        {avoidThreads.map(thread => (
                          <div key={thread.id} className="flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg ${
                              thread.status === 'running' ? 'bg-green-600 border-green-400' :
                              thread.status === 'completed' ? 'bg-blue-600 border-blue-400' :
                              'bg-gray-700 border-gray-500'
                            }`}>
                              T{thread.id}
                            </div>
                            <span className="text-xs text-gray-400 mt-1">P:{thread.priority}</span>
                          </div>
                        ))}
                        {avoidMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className="absolute top-8 text-xs bg-yellow-600 px-2 py-1 rounded animate-pulse"
                            style={{
                              left: `${msg.from * 30 + 10}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            📨 {msg.msg}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Log de Eventos */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-yellow-300 mb-2">Log de Eventos</h4>
                      <div ref={avoidLogRef} className="h-48 overflow-y-auto font-mono text-xs space-y-1">
                        {avoidLogs.length === 0 ? (
                          <div className="text-gray-500 italic">Presiona "Iniciar" para comenzar la simulación...</div>
                        ) : (
                          avoidLogs.map((log, idx) => (
                            <div key={idx} className="text-gray-300">{log}</div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                      <p className="text-sm text-yellow-200">
                        <span className="font-bold">Observa:</span> Cada thread trabaja con sus propios datos locales,
                        sin necesidad de locks ni sincronización. La comunicación se hace por mensajes, eliminando
                        completamente la posibilidad de inversión de prioridad.
                      </p>
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