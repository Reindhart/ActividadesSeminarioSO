import { BookOpen, Code, Lock, Play, Pause, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";

interface Task {
  id: number;
  status: 'pending' | 'executing' | 'blocked' | 'completed' | 'waiting';
  type?: string;
  duration?: number;
  startTime?: number;
}

interface Worker {
  id: number;
  status: 'idle' | 'working' | 'blocked' | 'waiting';
  task?: number;
  lockHeld?: boolean;
}

export default function BloqueosInnecesarios() {
  // Estados para Fine-grained Locking Demo
  const [fineThreads, setFineThreads] = useState<Worker[]>([
    { id: 1, status: 'idle', lockHeld: false },
    { id: 2, status: 'idle', lockHeld: false },
    { id: 3, status: 'idle', lockHeld: false },
    { id: 4, status: 'idle', lockHeld: false },
  ]);
  const [fineRunning, setFineRunning] = useState(false);
  const [fineTime, setFineTime] = useState(0);
  const [fineSpeed, setFineSpeed] = useState(500);
  const [fineLocks, setFineLocks] = useState<boolean[]>([false, false, false, false]);
  const [fineBlocked, setFineBlocked] = useState(0);
  const [fineLogs, setFineLogs] = useState<string[]>(['Simulación Fine-grained Locking iniciada. Locks independientes por sección.']);
  const fineLogRef = useRef<HTMLDivElement>(null);

  // Estados para Lock-free Demo
  const [lockfreeWorkers, setLockfreeWorkers] = useState<Worker[]>([
    { id: 1, status: 'idle' },
    { id: 2, status: 'idle' },
    { id: 3, status: 'idle' },
    { id: 4, status: 'idle' },
  ]);
  const [lockfreeRunning, setLockfreeRunning] = useState(false);
  const [lockfreeTime, setLockfreeTime] = useState(0);
  const [lockfreeSpeed, setLockfreeSpeed] = useState(500);
  const [lockfreeOps, setLockfreeOps] = useState(0);
  const [lockfreeRetries, setLockfreeRetries] = useState(0);
  const [lockfreeLogs, setLockfreeLogs] = useState<string[]>(['Simulación Lock-free iniciada. Operaciones sin bloqueos.']);
  const lockfreeLogRef = useRef<HTMLDivElement>(null);

  // Estados para Non-blocking I/O Demo
  const [ioWorkers, setIoWorkers] = useState<Worker[]>([
    { id: 1, status: 'idle' },
    { id: 2, status: 'idle' },
    { id: 3, status: 'idle' },
    { id: 4, status: 'idle' },
  ]);
  const [ioRunning, setIoRunning] = useState(false);
  const [ioTime, setIoTime] = useState(0);
  const [ioSpeed, setIoSpeed] = useState(500);
  const [ioPendingRequests, setIoPendingRequests] = useState<number[]>([]);
  const [ioCompleted, setIoCompleted] = useState(0);
  const [ioLogs, setIoLogs] = useState<string[]>(['Simulación Non-blocking I/O iniciada. Event loop procesando requests.']);
  const ioLogRef = useRef<HTMLDivElement>(null);

  // Estados para Thread Pools Demo
  const [poolWorkers, setPoolWorkers] = useState<Worker[]>([
    { id: 1, status: 'idle', task: undefined },
    { id: 2, status: 'idle', task: undefined },
    { id: 3, status: 'idle', task: undefined },
    { id: 4, status: 'idle', task: undefined },
  ]);
  const [poolRunning, setPoolRunning] = useState(false);
  const [poolTime, setPoolTime] = useState(0);
  const [poolSpeed, setPoolSpeed] = useState(500);
  const [poolQueue, setPoolQueue] = useState<Task[]>([]);
  const [poolCompleted, setPoolCompleted] = useState(0);
  const [poolLogs, setPoolLogs] = useState<string[]>(['Simulación Thread Pool iniciada. Pool de 4 workers.']);
  const poolLogRef = useRef<HTMLDivElement>(null);

  // Estados para Async/Await Demo
  const [asyncTasks, setAsyncTasks] = useState<Task[]>([]);
  const [asyncRunning, setAsyncRunning] = useState(false);
  const [asyncTime, setAsyncTime] = useState(0);
  const [asyncSpeed, setAsyncSpeed] = useState(500);
  const [asyncActive, setAsyncActive] = useState(0);
  const [asyncCompleted, setAsyncCompleted] = useState(0);
  const [asyncLogs, setAsyncLogs] = useState<string[]>(['Simulación Async/Await iniciada. Ejecución concurrente sin bloqueos.']);
  const asyncLogRef = useRef<HTMLDivElement>(null);

  // Estados para Reducir Scope Demo
  const [scopeThreads, setScopeThreads] = useState<Worker[]>([
    { id: 1, status: 'idle', lockHeld: false },
    { id: 2, status: 'idle', lockHeld: false },
    { id: 3, status: 'idle', lockHeld: false },
    { id: 4, status: 'idle', lockHeld: false },
  ]);
  const [scopeRunning, setScopeRunning] = useState(false);
  const [scopeTime, setScopeTime] = useState(0);
  const [scopeSpeed, setScopeSpeed] = useState(500);
  const [scopeLockTime, setScopeLockTime] = useState(0);
  const [scopeAvgLockTime, setScopeAvgLockTime] = useState(0);
  const [scopeLogs, setScopeLogs] = useState<string[]>(['Simulación Scope Reducido iniciada. Minimizando tiempo en sección crítica.']);
  const scopeLogRef = useRef<HTMLDivElement>(null);

  // Estados para Lazy Initialization Demo
  const [lazyWorkers, setLazyWorkers] = useState<Worker[]>([
    { id: 1, status: 'idle' },
    { id: 2, status: 'idle' },
    { id: 3, status: 'idle' },
    { id: 4, status: 'idle' },
  ]);
  const [lazyRunning, setLazyRunning] = useState(false);
  const [lazyTime, setLazyTime] = useState(0);
  const [lazySpeed, setLazySpeed] = useState(500);
  const [lazyInitialized, setLazyInitialized] = useState<boolean[]>([false, false, false, false]);
  const [lazyAccesses, setLazyAccesses] = useState(0);
  const [lazyLogs, setLazyLogs] = useState<string[]>(['Simulación Lazy Initialization iniciada. Recursos se inicializan solo cuando se necesitan.']);
  const lazyLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    if (fineLogRef.current) {
      fineLogRef.current.scrollTop = fineLogRef.current.scrollHeight;
    }
  }, [fineLogs]);

  useEffect(() => {
    if (lockfreeLogRef.current) {
      lockfreeLogRef.current.scrollTop = lockfreeLogRef.current.scrollHeight;
    }
  }, [lockfreeLogs]);

  useEffect(() => {
    if (ioLogRef.current) {
      ioLogRef.current.scrollTop = ioLogRef.current.scrollHeight;
    }
  }, [ioLogs]);

  useEffect(() => {
    if (poolLogRef.current) {
      poolLogRef.current.scrollTop = poolLogRef.current.scrollHeight;
    }
  }, [poolLogs]);

  useEffect(() => {
    if (asyncLogRef.current) {
      asyncLogRef.current.scrollTop = asyncLogRef.current.scrollHeight;
    }
  }, [asyncLogs]);

  useEffect(() => {
    if (scopeLogRef.current) {
      scopeLogRef.current.scrollTop = scopeLogRef.current.scrollHeight;
    }
  }, [scopeLogs]);

  useEffect(() => {
    if (lazyLogRef.current) {
      lazyLogRef.current.scrollTop = lazyLogRef.current.scrollHeight;
    }
  }, [lazyLogs]);

  // Simulación Fine-grained Locking
  useEffect(() => {
    if (!fineRunning) return;

    const interval = setInterval(() => {
      setFineTime(prev => prev + 1);

      const threadId = Math.floor(Math.random() * 4);
      const section = Math.floor(Math.random() * 4);

      setFineLocks(prev => {
        if (prev[section]) {
          setFineBlocked(prevBlocked => prevBlocked + 1);
          setFineLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Bloqueado esperando Sección ${section}`]);
          setFineThreads(prevThreads =>
            prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'blocked' as const } : t)
          );
          return prev;
        }

        const newLocks = [...prev];
        newLocks[section] = true;

        setFineLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock adquirido en Sección ${section}`]);
        setFineThreads(prevThreads =>
          prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'working' as const, lockHeld: true } : t)
        );

        setTimeout(() => {
          setFineLocks(prevLocks => {
            const releasedLocks = [...prevLocks];
            releasedLocks[section] = false;
            return releasedLocks;
          });

          setFineLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock liberado de Sección ${section}`]);
          setFineThreads(prevThreads =>
            prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const, lockHeld: false } : t)
          );
        }, fineSpeed / 2);

        return newLocks;
      });
    }, fineSpeed);

    return () => clearInterval(interval);
  }, [fineRunning, fineSpeed]);

  // Simulación Lock-free
  useEffect(() => {
    if (!lockfreeRunning) return;

    const interval = setInterval(() => {
      setLockfreeTime(prev => prev + 1);

      const workerId = Math.floor(Math.random() * 4);
      
      setLockfreeWorkers(prev =>
        prev.map((w, idx) => idx === workerId ? { ...w, status: 'working' as const } : w)
      );

      const casSuccess = Math.random() < 0.9;

      if (casSuccess) {
        setLockfreeOps(prev => prev + 1);
        setLockfreeLogs(prev => [...prev.slice(-9), `W${workerId + 1}: Operación CAS exitosa sin bloqueos`]);

        setTimeout(() => {
          setLockfreeWorkers(prev =>
            prev.map((w, idx) => idx === workerId ? { ...w, status: 'idle' as const } : w)
          );
        }, lockfreeSpeed / 3);
      } else {
        setLockfreeRetries(prev => prev + 1);
        setLockfreeLogs(prev => [...prev.slice(-9), `W${workerId + 1}: CAS falló, reintentando (sin bloqueo)`]);

        setTimeout(() => {
          setLockfreeOps(prev => prev + 1);
          setLockfreeLogs(prevLogs => [...prevLogs.slice(-9), `W${workerId + 1}: Operación exitosa tras reintento`]);
          
          setLockfreeWorkers(prev =>
            prev.map((w, idx) => idx === workerId ? { ...w, status: 'idle' as const } : w)
          );
        }, lockfreeSpeed / 2);
      }
    }, lockfreeSpeed);

    return () => clearInterval(interval);
  }, [lockfreeRunning, lockfreeSpeed]);

  // Simulación Non-blocking I/O
  useEffect(() => {
    if (!ioRunning) return;

    const interval = setInterval(() => {
      setIoTime(prev => prev + 1);

      if (Math.random() < 0.7) {
        const requestId = Date.now() + Math.random();
        setIoPendingRequests(prev => [...prev, requestId].slice(-8));
        setIoLogs(prev => [...prev.slice(-9), `📨 Nueva solicitud I/O recibida (ID: ${Math.floor(requestId % 1000)})`]);

        const workerId = Math.floor(Math.random() * 4);
        setIoWorkers(prev =>
          prev.map((w, idx) => idx === workerId ? { ...w, status: 'working' as const } : w)
        );

        setTimeout(() => {
          setIoPendingRequests(prev => prev.filter(id => id !== requestId));
          setIoCompleted(prev => prev + 1);
          setIoLogs(prevLogs => [...prevLogs.slice(-9), `✅ I/O completado por W${workerId + 1} (sin bloquear otros)`]);

          setIoWorkers(prev =>
            prev.map((w, idx) => idx === workerId ? { ...w, status: 'idle' as const } : w)
          );
        }, ioSpeed);
      }
    }, ioSpeed / 2);

    return () => clearInterval(interval);
  }, [ioRunning, ioSpeed]);

  // Simulación Thread Pool
  useEffect(() => {
    if (!poolRunning) return;

    const interval = setInterval(() => {
      setPoolTime(prev => prev + 1);

      if (Math.random() < 0.6 && poolQueue.length < 12) {
        const newTask: Task = {
          id: Date.now() + Math.random(),
          status: 'pending',
          type: ['compute', 'io', 'db'][Math.floor(Math.random() * 3)],
        };
        setPoolQueue(prev => [...prev, newTask]);
        setPoolLogs(prev => [...prev.slice(-9), `📋 Nueva tarea agregada a la cola (${newTask.type})`]);
      }

      const idleWorker = poolWorkers.findIndex(w => w.status === 'idle');
      if (idleWorker !== -1 && poolQueue.length > 0) {
        setPoolQueue(prev => {
          const [task, ...rest] = prev;
          
          setPoolWorkers(prevWorkers =>
            prevWorkers.map((w, idx) => 
              idx === idleWorker ? { ...w, status: 'working' as const, task: task.id } : w
            )
          );

          setPoolLogs(prevLogs => [...prevLogs.slice(-9), `⚙️ Worker ${idleWorker + 1} procesando tarea ${task.type}`]);

          setTimeout(() => {
            setPoolCompleted(prevCompleted => prevCompleted + 1);
            setPoolWorkers(prevWorkers =>
              prevWorkers.map((w, idx) => 
                idx === idleWorker ? { ...w, status: 'idle' as const, task: undefined } : w
              )
            );
            setPoolLogs(prevLogs => [...prevLogs.slice(-9), `✅ Worker ${idleWorker + 1} completó tarea`]);
          }, poolSpeed);

          return rest;
        });
      }
    }, poolSpeed / 2);

    return () => clearInterval(interval);
  }, [poolRunning, poolSpeed, poolWorkers, poolQueue.length]);

  // Simulación Async/Await
  useEffect(() => {
    if (!asyncRunning) return;

    const interval = setInterval(() => {
      setAsyncTime(prev => prev + 1);

      if (Math.random() < 0.7) {
        const taskId = Date.now() + Math.random();
        const duration = Math.floor(Math.random() * 3) + 1;

        const newTask: Task = {
          id: taskId,
          status: 'executing',
          duration,
          startTime: asyncTime,
        };

        setAsyncTasks(prev => [...prev.slice(-6), newTask]);
        setAsyncActive(prev => prev + 1);
        setAsyncLogs(prev => [...prev.slice(-9), `🚀 Async task iniciada (durará ${duration}s)`]);

        setTimeout(() => {
          setAsyncTasks(prev =>
            prev.map(t => t.id === taskId ? { ...t, status: 'completed' as const } : t)
          );
          setAsyncActive(prev => prev - 1);
          setAsyncCompleted(prev => prev + 1);
          setAsyncLogs(prevLogs => [...prevLogs.slice(-9), `✅ Async task completada sin bloquear otras`]);
        }, duration * asyncSpeed);
      }
    }, asyncSpeed / 2);

    return () => clearInterval(interval);
  }, [asyncRunning, asyncSpeed, asyncTime]);

  // Simulación Reducir Scope
  useEffect(() => {
    if (!scopeRunning) return;

    const interval = setInterval(() => {
      setScopeTime(prev => prev + 1);

      const threadId = Math.floor(Math.random() * 4);
      const lockDuration = Math.floor(Math.random() * 30) + 10;

      setScopeThreads(prev =>
        prev.map((t, idx) => idx === threadId ? { ...t, status: 'working' as const } : t)
      );

      setScopeLogs(prev => [...prev.slice(-9), `T${threadId + 1}: Preparando datos fuera de lock...`]);

      setTimeout(() => {
        setScopeThreads(prev =>
          prev.map((t, idx) => idx === threadId ? { ...t, lockHeld: true } : t)
        );
        setScopeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock adquirido (solo ${lockDuration}ms)`]);
        setScopeLockTime(prev => prev + lockDuration);

        setTimeout(() => {
          setScopeThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const, lockHeld: false } : t)
          );
          setScopeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock liberado rápidamente`]);
          
          setScopeAvgLockTime(scopeLockTime / (scopeTime || 1));
        }, lockDuration);
      }, scopeSpeed / 2);
    }, scopeSpeed);

    return () => clearInterval(interval);
  }, [scopeRunning, scopeSpeed, scopeLockTime, scopeTime]);

  // Simulación Lazy Initialization
  useEffect(() => {
    if (!lazyRunning) return;

    const interval = setInterval(() => {
      setLazyTime(prev => prev + 1);

      const workerId = Math.floor(Math.random() * 4);
      const resourceId = Math.floor(Math.random() * 4);

      setLazyAccesses(prev => prev + 1);

      if (!lazyInitialized[resourceId]) {
        setLazyWorkers(prev =>
          prev.map((w, idx) => idx === workerId ? { ...w, status: 'waiting' as const } : w)
        );
        setLazyLogs(prev => [...prev.slice(-9), `W${workerId + 1}: Inicializando Recurso ${resourceId} por primera vez...`]);

        setTimeout(() => {
          setLazyInitialized(prev => {
            const newInit = [...prev];
            newInit[resourceId] = true;
            return newInit;
          });

          setLazyWorkers(prev =>
            prev.map((w, idx) => idx === workerId ? { ...w, status: 'working' as const } : w)
          );
          setLazyLogs(prevLogs => [...prevLogs.slice(-9), `W${workerId + 1}: Recurso ${resourceId} inicializado y listo`]);

          setTimeout(() => {
            setLazyWorkers(prev =>
              prev.map((w, idx) => idx === workerId ? { ...w, status: 'idle' as const } : w)
            );
          }, lazySpeed / 3);
        }, lazySpeed);
      } else {
        setLazyWorkers(prev =>
          prev.map((w, idx) => idx === workerId ? { ...w, status: 'working' as const } : w)
        );
        setLazyLogs(prev => [...prev.slice(-9), `W${workerId + 1}: Usando Recurso ${resourceId} (ya inicializado)`]);

        setTimeout(() => {
          setLazyWorkers(prev =>
            prev.map((w, idx) => idx === workerId ? { ...w, status: 'idle' as const } : w)
          );
        }, lazySpeed / 3);
      }
    }, lazySpeed);

    return () => clearInterval(interval);
  }, [lazyRunning, lazySpeed, lazyInitialized]);

  // Funciones de control
  const resetFine = () => {
    setFineRunning(false);
    setFineTime(0);
    setFineThreads(prev => prev.map(t => ({ ...t, status: 'idle' as const, lockHeld: false })));
    setFineLocks([false, false, false, false]);
    setFineBlocked(0);
    setFineLogs(['Simulación Fine-grained Locking reiniciada.']);
  };

  const resetLockfree = () => {
    setLockfreeRunning(false);
    setLockfreeTime(0);
    setLockfreeWorkers(prev => prev.map(w => ({ ...w, status: 'idle' as const })));
    setLockfreeOps(0);
    setLockfreeRetries(0);
    setLockfreeLogs(['Simulación Lock-free reiniciada.']);
  };

  const resetIO = () => {
    setIoRunning(false);
    setIoTime(0);
    setIoWorkers(prev => prev.map(w => ({ ...w, status: 'idle' as const })));
    setIoPendingRequests([]);
    setIoCompleted(0);
    setIoLogs(['Simulación Non-blocking I/O reiniciada.']);
  };

  const resetPool = () => {
    setPoolRunning(false);
    setPoolTime(0);
    setPoolWorkers(prev => prev.map(w => ({ ...w, status: 'idle' as const, task: undefined })));
    setPoolQueue([]);
    setPoolCompleted(0);
    setPoolLogs(['Simulación Thread Pool reiniciada.']);
  };

  const resetAsync = () => {
    setAsyncRunning(false);
    setAsyncTime(0);
    setAsyncTasks([]);
    setAsyncActive(0);
    setAsyncCompleted(0);
    setAsyncLogs(['Simulación Async/Await reiniciada.']);
  };

  const resetScope = () => {
    setScopeRunning(false);
    setScopeTime(0);
    setScopeThreads(prev => prev.map(t => ({ ...t, status: 'idle' as const, lockHeld: false })));
    setScopeLockTime(0);
    setScopeAvgLockTime(0);
    setScopeLogs(['Simulación Scope Reducido reiniciada.']);
  };

  const resetLazy = () => {
    setLazyRunning(false);
    setLazyTime(0);
    setLazyWorkers(prev => prev.map(w => ({ ...w, status: 'idle' as const })));
    setLazyInitialized([false, false, false, false]);
    setLazyAccesses(0);
    setLazyLogs(['Simulación Lazy Initialization reiniciada.']);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Lock className="size-12 text-red-500" />
            <h1 className="text-4xl font-bold text-white">🚫 Bloqueos Innecesarios</h1>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            Los <span className="font-bold text-red-400">Bloqueos Innecesarios</span> son sincronizaciones que podrían
            evitarse o reducirse mediante técnicas más eficientes. Estos bloqueos reducen el paralelismo y degradan
            el rendimiento del sistema al forzar la serialización de operaciones que podrían ejecutarse concurrentemente.
          </p>
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
            <p className="text-red-200">
              <span className="font-bold">Problema:</span> Locks excesivos o de granularidad gruesa pueden reducir
              la concurrencia en un 80-90%. Las técnicas modernas permiten eliminar o minimizar bloqueos,
              mejorando significativamente el throughput y la latencia.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="multiple" defaultValue={["soluciones", "demostracion"]} className="space-y-4">
          <AccordionItem value="soluciones" className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <AccordionTrigger className="text-xl font-bold text-white hover:no-underline px-6">
              <div className="flex items-center gap-2">
                <Code className="size-5" />
                <span>Soluciones (Pseudocódigo)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="fine" className="px-6 pb-6">
                <TabsList className="grid grid-cols-7 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="fine">🔐 Fine-grained</TabsTrigger>
                  <TabsTrigger value="lockfree">🔓 Lock-free</TabsTrigger>
                  <TabsTrigger value="nonblocking">⚡ Non-blocking</TabsTrigger>
                  <TabsTrigger value="threadpool">👥 Thread Pool</TabsTrigger>
                  <TabsTrigger value="async">🔄 Async/Await</TabsTrigger>
                  <TabsTrigger value="scope">📏 Scope</TabsTrigger>
                  <TabsTrigger value="lazy">💤 Lazy Init</TabsTrigger>
                </TabsList>

                {/* Solución 1: Fine-grained Locking */}
                <TabsContent value="fine" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-blue-400 mb-4">🔐 Fine-grained Locking</h3>
                    <p className="text-gray-300 mb-4">
                      Usar locks específicos para cada sección independiente en lugar de un lock global,
                      aumentando el paralelismo.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: Lock Grueso (serializa TODO)
estructura SistemaGrueso {
  usuarios: Lista<Usuario>
  productos: Lista<Producto>
  pedidos: Lista<Pedido>
  lockGlobal: Lock  // ❌ Un solo lock para todo
}

función agregarUsuario(sistema: SistemaGrueso, usuario: Usuario) {
  sistema.lockGlobal.adquirir()  // Bloquea TODO
  
  sistema.usuarios.agregar(usuario)
  
  sistema.lockGlobal.liberar()
}

función agregarProducto(sistema: SistemaGrueso, producto: Producto) {
  sistema.lockGlobal.adquirir()  // Bloquea incluso usuarios y pedidos
  
  sistema.productos.agregar(producto)
  
  sistema.lockGlobal.liberar()
}
// Problema: Operaciones independientes se bloquean mutuamente

// Bien: Fine-grained Locking
estructura SistemaFino {
  usuarios: Lista<Usuario>
  lockUsuarios: Lock
  
  productos: Lista<Producto>
  lockProductos: Lock
  
  pedidos: Lista<Pedido>
  lockPedidos: Lock
}

función agregarUsuario(sistema: SistemaFino, usuario: Usuario) {
  sistema.lockUsuarios.adquirir()  // Solo lock de usuarios
  
  sistema.usuarios.agregar(usuario)
  
  sistema.lockUsuarios.liberar()
}

función agregarProducto(sistema: SistemaFino, producto: Producto) {
  sistema.lockProductos.adquirir()  // Lock independiente
  
  sistema.productos.agregar(producto)
  
  sistema.lockProductos.liberar()
  // Puede ejecutarse concurrentemente con agregarUsuario()
}

// Lista Enlazada con Hand-over-hand Locking
estructura NodoFino<T> {
  valor: T
  siguiente: NodoFino<T> | null
  lock: Lock
}

función buscar(lista: ListaFina<T>, valor: T) -> booleano {
  pred = null
  curr = lista.cabeza
  
  lista.lockCabeza.adquirir()
  si curr != null:
    curr.lock.adquirir()
  
  mientras curr != null:
    si curr.valor == valor:
      curr.lock.liberar()
      si pred != null:
        pred.lock.liberar()
      lista.lockCabeza.liberar()
      retornar verdadero
    
    // Hand-over-hand: adquirir siguiente antes de liberar actual
    siguiente = curr.siguiente
    si siguiente != null:
      siguiente.lock.adquirir()
    
    si pred != null:
      pred.lock.liberar()
    
    pred = curr
    curr = siguiente
  
  si pred != null:
    pred.lock.liberar()
  lista.lockCabeza.liberar()
  
  retornar falso
}

// Hash Table con Lock por Bucket
estructura HashMapFino<K, V> {
  buckets: Arreglo<Lista<Entry<K,V>>>
  locks: Arreglo<Lock>
  numBuckets: entero
}

función put(mapa: HashMapFino<K, V>, clave: K, valor: V) {
  hash = hash(clave)
  bucketIdx = hash % mapa.numBuckets
  
  // Solo lock del bucket específico
  mapa.locks[bucketIdx].adquirir()
  
  bucket = mapa.buckets[bucketIdx]
  para entry en bucket:
    si entry.clave == clave:
      entry.valor = valor
      mapa.locks[bucketIdx].liberar()
      retornar
  
  bucket.agregar(new Entry(clave, valor))
  mapa.locks[bucketIdx].liberar()
}

// Ventaja: Operaciones en diferentes buckets son concurrentes
// Mejora: Paralelismo proporcional al número de locks`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded">
                      <p className="text-sm text-blue-200">
                        <span className="font-bold">Ventaja:</span> Permite concurrencia en secciones independientes.
                        <span className="font-bold"> Desventaja:</span> Mayor complejidad, cuidado con deadlocks.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 2: Lock-free Algorithms */}
                <TabsContent value="lockfree" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-green-400 mb-4">🔓 Lock-free Algorithms</h3>
                    <p className="text-gray-300 mb-4">
                      Eliminar completamente los locks usando operaciones atómicas. Sin bloqueos = sin contención.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: Contador con Lock
estructura ContadorConLock {
  valor: entero
  lock: Lock
}

función incrementar(contador: ContadorConLock) {
  contador.lock.adquirir()  // ❌ Serializa accesos
  
  contador.valor++
  
  contador.lock.liberar()
}
// Problema: Threads esperan innecesariamente

// Bien: Contador Lock-free
estructura ContadorLockFree {
  valor: AtomicInteger
}

función incrementar(contador: ContadorLockFree) {
  // Sin locks, operación atómica
  incrementar_atomico(contador.valor)
}

// Stack Lock-free (Treiber Stack)
estructura NodoStack<T> {
  valor: T
  siguiente: AtomicReference<NodoStack<T>>
}

estructura StackLockFree<T> {
  cabeza: AtomicReference<NodoStack<T>>
}

función push(stack: StackLockFree<T>, valor: T) {
  nuevoNodo = new NodoStack(valor)
  
  loop:
    cabezaActual = cargar_atomico(stack.cabeza)
    nuevoNodo.siguiente = cabezaActual
    
    // Intenta actualizar cabeza atómicamente
    si compare_and_swap(stack.cabeza, cabezaActual, nuevoNodo):
      retornar  // Éxito sin bloqueos
    // Si falla, reintentar (sin esperar lock)
}

función pop(stack: StackLockFree<T>) -> T | null {
  loop:
    cabezaActual = cargar_atomico(stack.cabeza)
    
    si cabezaActual == null:
      retornar null
    
    siguiente = cabezaActual.siguiente
    
    si compare_and_swap(stack.cabeza, cabezaActual, siguiente):
      retornar cabezaActual.valor
    // Reintentar sin bloquear
}

// Queue Lock-free (Michael-Scott Queue)
estructura QueueLockFree<T> {
  cabeza: AtomicReference<Nodo<T>>
  cola: AtomicReference<Nodo<T>>
}

función enqueue(queue: QueueLockFree<T>, valor: T) {
  nuevoNodo = new Nodo(valor)
  nuevoNodo.siguiente = null
  
  loop:
    colaActual = cargar_atomico(queue.cola)
    siguienteActual = cargar_atomico(colaActual.siguiente)
    
    si colaActual == cargar_atomico(queue.cola):
      si siguienteActual == null:
        si compare_and_swap(colaActual.siguiente, null, nuevoNodo):
          compare_and_swap(queue.cola, colaActual, nuevoNodo)
          retornar
      sino:
        compare_and_swap(queue.cola, colaActual, siguienteActual)
}

función dequeue(queue: QueueLockFree<T>) -> T | null {
  loop:
    cabezaActual = cargar_atomico(queue.cabeza)
    colaActual = cargar_atomico(queue.cola)
    siguienteActual = cargar_atomico(cabezaActual.siguiente)
    
    si cabezaActual == cargar_atomico(queue.cabeza):
      si cabezaActual == colaActual:
        si siguienteActual == null:
          retornar null
        compare_and_swap(queue.cola, colaActual, siguienteActual)
      sino:
        valor = siguienteActual.valor
        si compare_and_swap(queue.cabeza, cabezaActual, siguienteActual):
          retornar valor
}

// Lista enlazada Lock-free (Harris Linked List)
función eliminar(lista: ListaLockFree<T>, valor: T) -> booleano {
  loop:
    (pred, curr) = buscar(lista, valor)
    
    si curr == null O curr.valor != valor:
      retornar falso
    
    // Marcar nodo para eliminación (bit marking)
    siguiente = cargar_atomico(curr.siguiente)
    si está_marcado(siguiente):
      continue
    
    // Intentar marcar
    si compare_and_swap(curr.siguiente, siguiente, marcar(siguiente)):
      // Intentar desenlazar físicamente
      compare_and_swap(pred.siguiente, curr, siguiente)
      retornar verdadero
}

// Ventajas:
// - Sin bloqueos = sin contención
// - Sin deadlocks
// - Progreso garantizado del sistema
// - Escalabilidad en múltiples cores

// Desventajas:
// - Complejidad de implementación
// - Problema ABA (requiere gestión de memoria especial)
// - Overhead de CAS en alta contención`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-green-900/30 border border-green-700/50 rounded">
                      <p className="text-sm text-green-200">
                        <span className="font-bold">Ventaja:</span> Elimina bloqueos completamente, máximo paralelismo.
                        <span className="font-bold"> Desventaja:</span> Complejidad, problema ABA, overhead de CAS.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 3: Non-blocking I/O */}
                <TabsContent value="nonblocking" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">⚡ Non-blocking I/O</h3>
                    <p className="text-gray-300 mb-4">
                      Evitar bloqueos en operaciones de I/O usando event loops y callbacks asíncronos.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: I/O Bloqueante
función servidorBloqueante() {
  socket = crearSocket()
  socket.bind(puerto)
  socket.listen()
  
  mientras verdadero:
    cliente = socket.accept()  // ❌ BLOQUEA hasta nueva conexión
    datos = cliente.read()     // ❌ BLOQUEA hasta recibir datos
    
    respuesta = procesarDatos(datos)
    
    cliente.write(respuesta)   // ❌ BLOQUEA hasta enviar
    cliente.close()
}
// Problema: Un thread bloqueado por cliente (escalabilidad limitada)

// Bien: Non-blocking I/O con Event Loop
estructura EventLoop {
  selectores: Selector
  handlers: Mapa<Socket, Handler>
}

función servidorNoBlockeante() {
  eventLoop = new EventLoop()
  serverSocket = crearSocket()
  serverSocket.setNonBlocking(verdadero)
  serverSocket.bind(puerto)
  serverSocket.listen()
  
  eventLoop.registrar(serverSocket, LEER, onNuevaConexion)
  
  // Event loop (sin bloqueos)
  mientras verdadero:
    eventos = eventLoop.selectores.select(timeout: 0)  // No bloquea
    
    para evento en eventos:
      handler = eventLoop.handlers[evento.socket]
      handler(evento)
}

función onNuevaConexion(evento: Evento) {
  cliente = evento.socket.accept()
  cliente.setNonBlocking(verdadero)
  
  // Registrar para futuras lecturas
  eventLoop.registrar(cliente, LEER, onDatosRecibidos)
}

función onDatosRecibidos(evento: Evento) {
  cliente = evento.socket
  
  intentar:
    datos = cliente.read()
    
    si datos == EOF:
      eventLoop.desregistrar(cliente)
      cliente.close()
      retornar
    
    // Procesar sin bloquear
    procesarAsync(datos, función(respuesta) {
      // Registrar para escritura cuando esté listo
      eventLoop.registrar(cliente, ESCRIBIR, onListoParaEscribir, respuesta)
    })
  
  capturar WouldBlock:
    // No hay datos aún, seguir esperando
    pasar

función onListoParaEscribir(evento: Evento, respuesta: bytes) {
  cliente = evento.socket
  
  intentar:
    bytesEscritos = cliente.write(respuesta)
    
    si bytesEscritos == longitud(respuesta):
      // Escritura completa
      eventLoop.desregistrar(cliente, ESCRIBIR)
      eventLoop.registrar(cliente, LEER, onDatosRecibidos)
    sino:
      // Escritura parcial, continuar después
      respuestaRestante = respuesta[bytesEscritos:]
      eventLoop.actualizar(cliente, ESCRIBIR, onListoParaEscribir, respuestaRestante)
  
  capturar WouldBlock:
    // Socket no listo, seguir esperando
    pasar

// Ejemplo Node.js style (callback-based)
función leerArchivoAsync(ruta: string, callback: (datos: bytes) -> void) {
  // Inicia operación I/O en background
  operacionIO = iniciarLecturaAsync(ruta)
  
  // Registra callback (sin bloquear)
  operacionIO.onCompleted(función(datos) {
    callback(datos)
  })
  
  // Retorna inmediatamente
}

// Cliente HTTP no bloqueante
función fetchMultiple(urls: Lista<string>) -> Lista<Respuesta> {
  respuestas = []
  pendientes = longitud(urls)
  
  para url en urls:
    httpClienteAsync.get(url, función(respuesta) {
      respuestas.agregar(respuesta)
      pendientes--
      
      si pendientes == 0:
        procesarTodasRespuestas(respuestas)
    })
  
  // Retorna sin esperar (event loop maneja callbacks)
}

// Reactor Pattern (epoll/kqueue)
estructura Reactor {
  epoll: EPollDescriptor
  handlers: Mapa<fd, Handler>
}

función ejecutar(reactor: Reactor) {
  mientras verdadero:
    eventos = reactor.epoll.wait(timeout: -1)
    
    para evento en eventos:
      fd = evento.fileDescriptor
      handler = reactor.handlers[fd]
      
      si evento.tipo == EPOLL_IN:
        handler.onLeer(fd)
      sino si evento.tipo == EPOLL_OUT:
        handler.onEscribir(fd)
      sino si evento.tipo == EPOLL_ERR:
        handler.onError(fd)
}

// Ventajas:
// - Un solo thread maneja miles de conexiones
// - Sin overhead de context switch
// - Escalabilidad (C10K problem resuelto)
// - Memoria constante por conexión

// Casos de uso:
// - Servidores web (nginx, Node.js)
// - Bases de datos (Redis, memcached)
// - Proxies de alta performance`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded">
                      <p className="text-sm text-purple-200">
                        <span className="font-bold">Ventaja:</span> Miles de conexiones con un solo thread.
                        <span className="font-bold"> Desventaja:</span> Callback hell, complejidad de debugging.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 4: Thread Pools */}
                <TabsContent value="threadpool" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-yellow-400 mb-4">👥 Thread Pools</h3>
                    <p className="text-gray-300 mb-4">
                      Reutilizar threads para evitar overhead de creación/destrucción constante.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: Crear Thread por Tarea
función procesarTareaMal(tarea: Tarea) {
  thread = new Thread(función() {  // ❌ Crea nuevo thread
    tarea.ejecutar()
  })
  thread.start()
  thread.join()  // ❌ Espera bloquea
}
// Overhead: ~1-2ms por creación thread, cientos de MB memoria

// Bien: Thread Pool
estructura ThreadPool {
  workers: Lista<Thread>
  colaTrabajos: Queue<Tarea>
  mutex: Lock
  condicion: ConditionVariable
  ejecutando: booleano
}

función crearThreadPool(numThreads: entero) -> ThreadPool {
  pool = new ThreadPool()
  pool.colaTrabajos = new Queue()
  pool.ejecutando = verdadero
  
  para i en 0 hasta numThreads:
    worker = new Thread(funcionWorker, pool)
    worker.start()
    pool.workers.agregar(worker)
  
  retornar pool
}

función funcionWorker(pool: ThreadPool) {
  mientras verdadero:
    pool.mutex.adquirir()
    
    // Esperar hasta que haya trabajo
    mientras pool.colaTrabajos.estaVacia() Y pool.ejecutando:
      pool.condicion.wait(pool.mutex)
    
    si no pool.ejecutando:
      pool.mutex.liberar()
      break
    
    tarea = pool.colaTrabajos.dequeue()
    pool.mutex.liberar()
    
    // Ejecutar sin lock
    tarea.ejecutar()
}

función submit(pool: ThreadPool, tarea: Tarea) {
  pool.mutex.adquirir()
  
  pool.colaTrabajos.enqueue(tarea)
  pool.condicion.signal()  // Despertar un worker
  
  pool.mutex.liberar()
}

función shutdown(pool: ThreadPool) {
  pool.mutex.adquirir()
  pool.ejecutando = falso
  pool.condicion.broadcast()  // Despertar todos
  pool.mutex.liberar()
  
  para worker en pool.workers:
    worker.join()
}

// Thread Pool con Futures
estructura Future<T> {
  valor: T | null
  completo: booleano
  mutex: Lock
  condicion: ConditionVariable
}

función submitConResultado(pool: ThreadPool, tarea: () -> T) -> Future<T> {
  future = new Future<T>()
  
  tareaWrapper = función() {
    resultado = tarea()
    
    future.mutex.adquirir()
    future.valor = resultado
    future.completo = verdadero
    future.condicion.broadcast()
    future.mutex.liberar()
  }
  
  submit(pool, tareaWrapper)
  retornar future
}

función get(future: Future<T>) -> T {
  future.mutex.adquirir()
  
  mientras no future.completo:
    future.condicion.wait(future.mutex)
  
  resultado = future.valor
  future.mutex.liberar()
  
  retornar resultado
}

// Work Stealing Thread Pool (Java ForkJoinPool style)
estructura WorkStealingPool {
  workers: Lista<Worker>
  colas: Lista<Deque<Tarea>>  // Una cola por worker
}

estructura Worker {
  id: entero
  cola: Deque<Tarea>
  pool: WorkStealingPool
}

función ejecutarWorker(worker: Worker) {
  mientras verdadero:
    // Intentar tarea de cola propia (extremo local)
    tarea = worker.cola.pollFirst()
    
    si tarea == null:
      // Intentar robar de otra cola (extremo remoto)
      tarea = intentarRobar(worker.pool, worker.id)
    
    si tarea != null:
      tarea.ejecutar()
    sino:
      dormir(1)  // No hay trabajo
}

función intentarRobar(pool: WorkStealingPool, idPropio: entero) -> Tarea | null {
  // Intentar robar de colas de otros workers
  para i en 0 hasta longitud(pool.colas):
    si i == idPropio:
      continue
    
    tarea = pool.colas[i].pollLast()  // Desde el otro extremo
    si tarea != null:
      retornar tarea
  
  retornar null
}

// Thread Pool con Prioridades
estructura ThreadPoolConPrioridades {
  workers: Lista<Thread>
  colaAlta: Queue<Tarea>
  colaMedia: Queue<Tarea>
  colaBaja: Queue<Tarea>
  mutex: Lock
  condicion: ConditionVariable
}

función obtenerSiguienteTarea(pool: ThreadPoolConPrioridades) -> Tarea | null {
  pool.mutex.adquirir()
  
  mientras todasColasVacias(pool):
    pool.condicion.wait(pool.mutex)
  
  tarea = null
  si no pool.colaAlta.estaVacia():
    tarea = pool.colaAlta.dequeue()
  sino si no pool.colaMedia.estaVacia():
    tarea = pool.colaMedia.dequeue()
  sino:
    tarea = pool.colaBaja.dequeue()
  
  pool.mutex.liberar()
  retornar tarea
}

// Ajuste dinámico de tamaño
función ajustarTamaño(pool: ThreadPool, carga: real) {
  si carga > 0.8 Y pool.numThreads < MAX_THREADS:
    // Alta carga: agregar workers
    agregarWorker(pool)
  sino si carga < 0.2 Y pool.numThreads > MIN_THREADS:
    // Baja carga: reducir workers
    removerWorker(pool)
}

// Ventajas:
// - Reutilización reduce overhead (100x más rápido)
// - Memoria fija (no crece con tareas)
// - Control de concurrencia (límite threads)

// Casos de uso:
// - Servidores (Tomcat, Apache)
// - Procesamiento paralelo
// - Tareas I/O bound`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded">
                      <p className="text-sm text-yellow-200">
                        <span className="font-bold">Ventaja:</span> Reutilización, control de recursos.
                        <span className="font-bold"> Desventaja:</span> Complejidad de tuning, posible starvation.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 5: Async/Await Patterns */}
                <TabsContent value="async" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">🔄 Async/Await Patterns</h3>
                    <p className="text-gray-300 mb-4">
                      Sintaxis síncrona para código asíncrono, evitando bloqueos con corutinas.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: Código Síncrono Bloqueante
función obtenerDatosUsuarioMal(userId: entero) -> Usuario {
  // Cada llamada BLOQUEA el thread
  usuario = db.query("SELECT * FROM users WHERE id = ?", userId)  // ❌ Bloquea ~50ms
  pedidos = db.query("SELECT * FROM orders WHERE user_id = ?", userId)  // ❌ Bloquea ~30ms
  perfil = http.get("https://api.com/profile/" + userId)  // ❌ Bloquea ~200ms
  
  retornar combinar(usuario, pedidos, perfil)
}
// Total: ~280ms bloqueado, thread inactivo

// Bien: Async/Await (No Bloqueante)
async función obtenerDatosUsuario(userId: entero) -> Usuario {
  // Lanza 3 operaciones concurrentemente
  tareaUsuario = db.queryAsync("SELECT * FROM users WHERE id = ?", userId)
  tareaPedidos = db.queryAsync("SELECT * FROM orders WHERE user_id = ?", userId)
  tareaPerfil = http.getAsync("https://api.com/profile/" + userId)
  
  // Espera sin bloquear (thread hace otro trabajo)
  usuario = await tareaUsuario     // Retorna cuando completa
  pedidos = await tareaPedidos
  perfil = await tareaPerfil
  
  retornar combinar(usuario, pedidos, perfil)
}
// Total: ~200ms (paralelo), thread NO bloqueado

// Implementación de Async/Await con Corutinas
estructura Corutina {
  estado: enum { CREADA, EJECUTANDO, SUSPENDIDA, COMPLETADA }
  pilaEjecucion: Pila
  punteroInstruccion: entero
  valorRetorno: any
}

función async_función(funcion: () -> T) -> Corutina {
  corutina = new Corutina()
  corutina.estado = CREADA
  corutina.pilaEjecucion = new Pila()
  
  retornar corutina
}

función await(corutina: Corutina, tarea: Tarea) -> T {
  si tarea.completa():
    retornar tarea.resultado()
  
  // Suspender corutina (sin bloquear thread)
  corutina.estado = SUSPENDIDA
  
  // Registrar callback para reanudar
  tarea.onCompleted(función(resultado) {
    corutina.valorRetorno = resultado
    corutina.estado = EJECUTANDO
    scheduler.encolar(corutina)  // Reanudar después
  })
  
  // Ceder control (thread ejecuta otra cosa)
  scheduler.yield()
}

// Scheduler de Corutinas
estructura Scheduler {
  colaListas: Queue<Corutina>
  ejecutando: Corutina | null
}

función ejecutar(scheduler: Scheduler) {
  mientras verdadero:
    si scheduler.colaListas.estaVacia():
      // No hay trabajo, dormir o hacer I/O
      epoll.wait()
      continue
    
    corutina = scheduler.colaListas.dequeue()
    scheduler.ejecutando = corutina
    
    // Ejecutar hasta siguiente await
    ejecutarCorutina(corutina)
    
    si corutina.estado == COMPLETADA:
      // Liberar recursos
      liberarCorutina(corutina)
    sino si corutina.estado == SUSPENDIDA:
      // Esperando I/O, ya encolada para reanudar
      continue
}

// Async con múltiples tareas concurrentes
async función procesarMultiple(items: Lista<Item>) -> Lista<Resultado> {
  tareas = []
  
  para item en items:
    tarea = procesarItemAsync(item)
    tareas.agregar(tarea)
  
  // Espera todas concurrentemente
  resultados = await all(tareas)
  
  retornar resultados
}

función all(tareas: Lista<Tarea<T>>) -> Tarea<Lista<T>> {
  pendientes = longitud(tareas)
  resultados = new Lista<T>(longitud(tareas))
  tareaCompuesta = new Tarea<Lista<T>>()
  
  para i, tarea en enumerar(tareas):
    tarea.onCompleted(función(resultado) {
      resultados[i] = resultado
      pendientes--
      
      si pendientes == 0:
        tareaCompuesta.completar(resultados)
    })
  
  retornar tareaCompuesta
}

// Async con timeout
async función conTimeout(tarea: Tarea<T>, timeout: entero) -> T {
  temporizador = crearTemporizador(timeout)
  
  resultado = await race([tarea, temporizador])
  
  si resultado == TIMEOUT:
    lanzar TimeoutError()
  
  retornar resultado
}

// Generador asíncrono
async función* leerArchivoPorLineas(archivo: string) {
  handle = await abrirAsync(archivo)
  
  mientras verdadero:
    linea = await handle.leerLineaAsync()
    
    si linea == EOF:
      break
    
    yield linea  // Retorna valor y suspende
  
  await handle.cerrarAsync()
}

// Uso de generador
async función procesarArchivo(ruta: string) {
  async para linea en leerArchivoPorLineas(ruta):
    await procesarLineaAsync(linea)
}

// Stream asíncrono con backpressure
estructura StreamAsync<T> {
  buffer: Queue<T>
  capacidad: entero
  productorSuspendido: booleano
  consumidorEsperando: Promise | null
}

async función escribir(stream: StreamAsync<T>, item: T) {
  mientras stream.buffer.tamaño() >= stream.capacidad:
    // Backpressure: esperar espacio
    await stream.espacioDisponible()
  
  stream.buffer.enqueue(item)
  
  si stream.consumidorEsperando != null:
    stream.consumidorEsperando.resolver(item)
}

async función leer(stream: StreamAsync<T>) -> T {
  si stream.buffer.estaVacia():
    // Esperar nuevo item
    item = await new Promise(función(resolve) {
      stream.consumidorEsperando = resolve
    })
    retornar item
  
  retornar stream.buffer.dequeue()
}

// Ventajas:
// - Sintaxis clara (parece código síncrono)
// - Alto concurrency (miles de corutinas/thread)
// - Sin bloqueos (cooperative multitasking)
// - Memoria eficiente

// Casos de uso:
// - I/O intensivo (servidores web, APIs)
// - Pipelines de datos
// - Interfaces de usuario responsivas`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-700/50 rounded">
                      <p className="text-sm text-cyan-200">
                        <span className="font-bold">Ventaja:</span> Sintaxis clara, alta concurrencia sin bloqueos.
                        <span className="font-bold"> Desventaja:</span> Debugging complejo, propagación de async.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 6: Reducir Scope Crítico */}
                <TabsContent value="scope" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-pink-400 mb-4">📏 Reducir Scope Crítico</h3>
                    <p className="text-gray-300 mb-4">
                      Minimizar el tiempo dentro de secciones críticas, moviendo trabajo fuera de los locks.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: Scope Crítico Extenso
estructura Cache {
  datos: Mapa<string, Valor>
  lock: Lock
}

función obtenerOMal(cache: Cache, clave: string) -> Valor {
  cache.lock.adquirir()  // ❌ Lock demasiado temprano
  
  // Trabajo que NO necesita lock (serializado innecesariamente)
  claveNormalizada = clave.toLower().trim()
  timestamp = obtenerTimestamp()
  
  si cache.datos.contiene(claveNormalizada):
    valor = cache.datos[claveNormalizada]
    
    // Cálculo pesado dentro del lock ❌
    si timestamp - valor.timestamp < TTL:
      valorDeserializado = deserializar(valor.datos)  // ❌ Lento
      valorProcesado = procesarValor(valorDeserializado)  // ❌ Muy lento
      
      cache.lock.liberar()
      retornar valorProcesado
  
  // Query DB dentro del lock ❌
  valorDB = db.query(claveNormalizada)  // ❌ 50ms bloqueado
  valorSerializado = serializar(valorDB)  // ❌ Lento
  
  cache.datos[claveNormalizada] = new CacheEntry(valorSerializado, timestamp)
  
  cache.lock.liberar()  // ❌ Lock mantenido ~55ms
  retornar valorDB
}
// Problema: Lock retenido durante I/O y procesamiento (contención alta)

// Bien: Scope Crítico Mínimo
función obtenerO(cache: Cache, clave: string) -> Valor {
  // Trabajo fuera del lock
  claveNormalizada = clave.toLower().trim()
  timestamp = obtenerTimestamp()
  
  // Lock solo para acceso al mapa
  cache.lock.adquirir()
  valorBruto = cache.datos[claveNormalizada]
  cache.lock.liberar()  // ✅ Liberado rápido (~1μs)
  
  si valorBruto != null:
    // Deserialización fuera del lock
    valorDeserializado = deserializar(valorBruto.datos)
    
    si timestamp - valorBruto.timestamp < TTL:
      // Procesamiento fuera del lock
      retornar procesarValor(valorDeserializado)
  
  // Query DB sin lock
  valorDB = db.query(claveNormalizada)  // Sin bloquear otros
  valorSerializado = serializar(valorDB)
  
  // Lock solo para actualizar mapa
  cache.lock.adquirir()
  cache.datos[claveNormalizada] = new CacheEntry(valorSerializado, timestamp)
  cache.lock.liberar()  // ✅ Liberado rápido (~1μs)
  
  retornar valorDB
}

// Lista enlazada: inserción ordenada
función insertarOrdenadoMal(lista: Lista, valor: entero) {
  lista.lock.adquirir()  // ❌ Lock todo el tiempo
  
  nodo = lista.cabeza
  
  // Búsqueda dentro del lock ❌
  mientras nodo != null Y nodo.valor < valor:
    nodo = nodo.siguiente
  
  // Creación del nodo dentro del lock ❌
  nuevoNodo = new Nodo(valor)
  
  // Inserción
  nuevoNodo.siguiente = nodo
  // ... enlazar
  
  lista.lock.liberar()
}

función insertarOrdenado(lista: Lista, valor: entero) {
  // Crear nodo ANTES del lock
  nuevoNodo = new Nodo(valor)
  
  lista.lock.adquirir()
  
  nodo = lista.cabeza
  
  // Búsqueda e inserción (mínimo necesario)
  mientras nodo != null Y nodo.valor < valor:
    nodo = nodo.siguiente
  
  nuevoNodo.siguiente = nodo
  // ... enlazar
  
  lista.lock.liberar()  // ✅ Scope reducido 50%
}

// Patrón: Copiar-Modificar-Actualizar
estructura ConfiguracionCompartida {
  datos: AtomicReference<Config>
}

función actualizarConfigMal(config: ConfiguracionCompartida, nuevos: Cambios) {
  lock.adquirir()  // ❌ Bloquea lectores
  
  configActual = config.datos.cargar()
  
  // Modificación lenta dentro del lock ❌
  para cambio en nuevos:
    aplicarCambio(configActual, cambio)
  
  validar(configActual)  // ❌ Lento
  
  config.datos.almacenar(configActual)
  
  lock.liberar()
}

función actualizarConfig(config: ConfiguracionCompartida, nuevos: Cambios) {
  // Cargar sin lock (lectores no bloqueados)
  configActual = config.datos.cargar()
  
  // Clonar y modificar SIN lock
  configNueva = clonar(configActual)
  para cambio en nuevos:
    aplicarCambio(configNueva, cambio)
  
  validar(configNueva)
  
  // Solo CAS atómico (sin lock)
  compare_and_swap(config.datos, configActual, configNueva)
  // ✅ Sin bloqueos, lectores siempre pueden leer
}

// Preparar trabajo antes del lock
función enviarMensajeMal(conexion: Conexion, mensaje: Mensaje) {
  conexion.lock.adquirir()  // ❌ Lock temprano
  
  // Serialización dentro del lock ❌
  bytes = mensaje.serializar()  // 5ms
  
  // Compresión dentro del lock ❌
  bytesComprimidos = comprimir(bytes)  // 10ms
  
  // Envío
  conexion.socket.enviar(bytesComprimidos)
  
  conexion.lock.liberar()  // ❌ Retenido 15ms
}

función enviarMensaje(conexion: Conexion, mensaje: Mensaje) {
  // Preparar TODO fuera del lock
  bytes = mensaje.serializar()
  bytesComprimidos = comprimir(bytes)
  
  // Lock solo para envío por socket
  conexion.lock.adquirir()
  conexion.socket.enviar(bytesComprimidos)
  conexion.lock.liberar()  // ✅ ~0.1ms
}

// Double-checked locking (evitar lock en caso común)
estructura Singleton {
  instancia: AtomicReference<Objeto>
  lock: Lock
}

función obtenerInstancia(singleton: Singleton) -> Objeto {
  // Primera verificación SIN lock (rápido)
  instancia = singleton.instancia.cargar()
  si instancia != null:
    retornar instancia
  
  // Caso raro: necesita inicialización
  singleton.lock.adquirir()
  
  // Segunda verificación CON lock
  instancia = singleton.instancia.cargar()
  si instancia != null:
    singleton.lock.liberar()
    retornar instancia
  
  // Crear instancia
  instancia = crearInstancia()
  singleton.instancia.almacenar(instancia)
  
  singleton.lock.liberar()
  retornar instancia
}

// Principios:
// 1. Lock lo más tarde posible
// 2. Liberar lo más temprano posible
// 3. Mover I/O fuera del lock
// 4. Mover cómputo pesado fuera del lock
// 5. Preparar datos antes del lock
// 6. Usar atomic operations para lecturas`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-pink-900/30 border border-pink-700/50 rounded">
                      <p className="text-sm text-pink-200">
                        <span className="font-bold">Ventaja:</span> Reduce contención drásticamente (10-100x mejora).
                        <span className="font-bold"> Desventaja:</span> Requiere análisis cuidadoso del código.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 7: Lazy Initialization */}
                <TabsContent value="lazy" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-orange-400 mb-4">💤 Lazy Initialization</h3>
                    <p className="text-gray-300 mb-4">
                      Inicializar recursos solo cuando se necesitan, evitando sincronización prematura.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: Inicialización Eager (al inicio)
estructura SistemaMal {
  cache: Cache
  conexionDB: BaseDatos
  servicioExterno: Cliente
  logger: Logger
  metricas: Metricas
  // ... 20 componentes más
}

función inicializarSistemaMal() -> SistemaMal {
  sistema = new SistemaMal()
  
  // Inicializa TODO al inicio (lento, puede no usarse)
  sistema.cache = new Cache(capacidad: 10000)  // ❌ 500ms
  sistema.conexionDB = conectarDB(config)      // ❌ 2s
  sistema.servicioExterno = new Cliente(url)   // ❌ 1s
  sistema.logger = new Logger(archivo)         // ❌ 200ms
  sistema.metricas = new Metricas(config)      // ❌ 300ms
  // ... más inicializaciones ❌
  
  // Startup: 5+ segundos, incluso si no se usa todo
  retornar sistema
}

// Bien: Lazy Initialization
estructura Sistema {
  cache: Cache | null
  cacheLock: Lock
  
  conexionDB: BaseDatos | null
  dbLock: Lock
  
  // ... otros componentes
}

función obtenerCache(sistema: Sistema) -> Cache {
  // Double-checked locking
  si sistema.cache != null:
    retornar sistema.cache
  
  sistema.cacheLock.adquirir()
  
  si sistema.cache != null:
    sistema.cacheLock.liberar()
    retornar sistema.cache
  
  // Inicializar solo cuando se necesita
  sistema.cache = new Cache(capacidad: 10000)
  
  sistema.cacheLock.liberar()
  retornar sistema.cache
}

función obtenerDB(sistema: Sistema) -> BaseDatos {
  si sistema.conexionDB != null:
    retornar sistema.conexionDB
  
  sistema.dbLock.adquirir()
  
  si sistema.conexionDB != null:
    sistema.dbLock.liberar()
    retornar sistema.conexionDB
  
  sistema.conexionDB = conectarDB(config)
  
  sistema.dbLock.liberar()
  retornar sistema.conexionDB
}
// Ventaja: Startup ~10ms, componentes se crean solo cuando se usan

// Lazy con std::call_once (C++ style)
estructura RecursoLazy<T> {
  recurso: T | null
  bandera: AtomicFlag
}

función obtener(lazy: RecursoLazy<T>, inicializador: () -> T) -> T {
  si lazy.recurso != null:
    retornar lazy.recurso
  
  si atomic_flag_test_and_set(lazy.bandera) == falso:
    // Primera llamada: inicializar
    lazy.recurso = inicializador()
  sino:
    // Otro thread está inicializando, esperar
    mientras lazy.recurso == null:
      cpu_relax()
  
  retornar lazy.recurso
}

// Lazy con holder idiom (thread-safe en Java)
estructura SinClienteLazy {
  estructura Holder {
    constante INSTANCIA = new SinClient()
  }
  
  función obtenerInstancia() -> SinClient {
    retornar Holder.INSTANCIA
    // Inicializado solo cuando Holder se carga (thread-safe)
  }
}

// Lazy para colecciones
estructura CacheLazy<K, V> {
  datos: Mapa<K, V>
  fabricas: Mapa<K, () -> V>
  lock: Lock
}

función obtener(cache: CacheLazy<K, V>, clave: K) -> V {
  // Verificación rápida
  cache.lock.adquirir()
  si cache.datos.contiene(clave):
    valor = cache.datos[clave]
    cache.lock.liberar()
    retornar valor
  cache.lock.liberar()
  
  // Crear valor (fuera del lock si es posible)
  fabrica = cache.fabricas[clave]
  valor = fabrica()
  
  // Almacenar
  cache.lock.adquirir()
  cache.datos[clave] = valor
  cache.lock.liberar()
  
  retornar valor
}

// Lazy con CompletableFuture (async)
estructura RecursoAsync<T> {
  promesa: AtomicReference<Future<T>>
}

async función obtenerAsync(recurso: RecursoAsync<T>, inicializador: async () -> T) -> T {
  future = recurso.promesa.cargar()
  
  si future != null:
    retornar await future
  
  // Iniciar inicialización
  nuevaPromesa = inicializador()
  
  si compare_and_swap(recurso.promesa, null, nuevaPromesa):
    // Este thread ganó, esperar resultado
    retornar await nuevaPromesa
  sino:
    // Otro thread ganó, usar su promesa
    retornar await recurso.promesa.cargar()
}

// Lazy con expiración (timed lazy)
estructura RecursoTimedLazy<T> {
  recurso: T | null
  timestampCreacion: entero
  ttl: entero
  lock: Lock
}

función obtener(lazy: RecursoTimedLazy<T>, fabrica: () -> T) -> T {
  ahora = obtenerTimestamp()
  
  lazy.lock.adquirir()
  
  si lazy.recurso != null Y (ahora - lazy.timestampCreacion < lazy.ttl):
    recurso = lazy.recurso
    lazy.lock.liberar()
    retornar recurso
  
  // Recrear si expiró
  lazy.recurso = fabrica()
  lazy.timestampCreacion = ahora
  
  recurso = lazy.recurso
  lazy.lock.liberar()
  
  retornar recurso
}

// Thread-local lazy (sin sincronización)
estructura ThreadLocalLazy<T> {
  threadLocals: Mapa<ThreadID, T>
  fabrica: () -> T
}

función obtenerLocal(lazy: ThreadLocalLazy<T>) -> T {
  tid = obtenerThreadID()
  
  // Sin lock: cada thread su propia copia
  si no lazy.threadLocals.contiene(tid):
    lazy.threadLocals[tid] = lazy.fabrica()
  
  retornar lazy.threadLocals[tid]
}

// Patrón: Lazy con precondiciones
estructura ConexionPoolLazy {
  pool: ConexionPool | null
  config: Config
  lock: Lock
}

función obtenerConexion(poolLazy: ConexionPoolLazy) -> Conexion {
  poolLazy.lock.adquirir()
  
  si poolLazy.pool == null:
    // Validar config antes de inicializar
    validarConfiguracion(poolLazy.config)
    
    // Inicializar pool
    poolLazy.pool = new ConexionPool(poolLazy.config)
    
    // Warm-up inicial
    para i en 0 hasta poolLazy.config.minConexiones:
      poolLazy.pool.agregarConexion()
  
  pool = poolLazy.pool
  poolLazy.lock.liberar()
  
  retornar pool.obtenerConexion()
}

// Ventajas:
// - Startup rápido (inicialización bajo demanda)
// - Menor uso de memoria (recursos no usados no se crean)
// - Evita trabajo innecesario
// - Reduce locks al inicio (menos contención)

// Casos de uso:
// - Singletons
// - Conexiones DB/Red
// - Cachés grandes
// - Recursos costosos
// - Plugins/Módulos opcionales`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-orange-900/30 border border-orange-700/50 rounded">
                      <p className="text-sm text-orange-200">
                        <span className="font-bold">Ventaja:</span> Startup rápido, recursos solo cuando se usan.
                        <span className="font-bold"> Desventaja:</span> Primera llamada más lenta, complejidad en thread-safety.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          {/* Demostraciones Interactivas */}
          <AccordionItem value="demostracion" className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <AccordionTrigger className="text-xl font-bold text-white hover:no-underline px-6">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5" />
                <span>Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="demo-fine" className="px-6 pb-6">
                <TabsList className="grid grid-cols-7 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="demo-fine">🔐 Fine-grained</TabsTrigger>
                  <TabsTrigger value="demo-lockfree">🔓 Lock-free</TabsTrigger>
                  <TabsTrigger value="demo-io">⚡ Non-blocking</TabsTrigger>
                  <TabsTrigger value="demo-pool">👥 Pool</TabsTrigger>
                  <TabsTrigger value="demo-async">🔄 Async</TabsTrigger>
                  <TabsTrigger value="demo-scope">📏 Scope</TabsTrigger>
                  <TabsTrigger value="demo-lazy">💤 Lazy</TabsTrigger>
                </TabsList>

                {/* Demo 1: Fine-grained Locking */}
                <TabsContent value="demo-fine" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-blue-400">Demo: Fine-grained Locking</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setFineRunning(!fineRunning)}
                          className={`px-4 py-2 rounded flex items-center gap-2 ${
                            fineRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {fineRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {fineRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={resetFine}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <span className="text-gray-400">Tiempo: {fineTime}s</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {fineSpeed}ms</label>
                      <Slider
                        value={[fineSpeed]}
                        onValueChange={([val]) => setFineSpeed(val)}
                        min={100}
                        max={1000}
                        step={50}
                        className="w-64"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Threads</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {fineThreads.map((thread) => (
                            <div
                              key={thread.id}
                              className={`p-3 rounded border-2 ${
                                thread.status === 'working'
                                  ? 'bg-blue-900/50 border-blue-500'
                                  : thread.status === 'blocked'
                                  ? 'bg-red-900/50 border-red-500 animate-pulse'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">T{thread.id}</div>
                                <div className="text-sm font-bold">
                                  {thread.status === 'idle' ? '💤' : thread.status === 'blocked' ? '🚫' : '⚙️'}
                                </div>
                                <div className="text-xs">
                                  {thread.lockHeld ? '🔒' : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Secciones (Locks Independientes)</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {fineLocks.map((locked, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded border-2 ${
                                locked ? 'bg-red-900/50 border-red-500' : 'bg-green-900/50 border-green-500'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">Sección {idx}</div>
                                <div className="text-2xl">{locked ? '🔒' : '🔓'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 p-2 bg-gray-800 rounded text-center">
                          <div className="text-xs text-gray-400">Threads Bloqueados</div>
                          <div className="text-lg font-bold text-red-400">{fineBlocked}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log de Eventos</h4>
                      <div
                        ref={fineLogRef}
                        className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-xs text-green-400"
                      >
                        {fineLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Lock-free Algorithms */}
                <TabsContent value="demo-lockfree" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-green-400">Demo: Lock-free Algorithms</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setLockfreeRunning(!lockfreeRunning)}
                          className={`px-4 py-2 rounded flex items-center gap-2 ${
                            lockfreeRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {lockfreeRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {lockfreeRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={resetLockfree}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <span className="text-gray-400">Tiempo: {lockfreeTime}s</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {lockfreeSpeed}ms</label>
                      <Slider
                        value={[lockfreeSpeed]}
                        onValueChange={([val]) => setLockfreeSpeed(val)}
                        min={100}
                        max={1000}
                        step={50}
                        className="w-64"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Workers</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {lockfreeWorkers.map((worker) => (
                            <div
                              key={worker.id}
                              className={`p-3 rounded border-2 ${
                                worker.status === 'working'
                                  ? 'bg-green-900/50 border-green-500'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">W{worker.id}</div>
                                <div className="text-2xl">{worker.status === 'working' ? '⚙️' : '💤'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Métricas</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Operaciones CAS</div>
                            <div className="text-lg font-bold text-green-400">{lockfreeOps}</div>
                          </div>
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Reintentos</div>
                            <div className="text-lg font-bold text-yellow-400">{lockfreeRetries}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Estado</h4>
                        <div className="p-4 bg-green-900/30 border border-green-700/50 rounded text-center">
                          <div className="text-4xl mb-2">🔓</div>
                          <div className="text-sm text-green-300">Sin Locks</div>
                          <div className="text-xs text-gray-400 mt-2">Operaciones atómicas CAS</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log de Eventos</h4>
                      <div
                        ref={lockfreeLogRef}
                        className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-xs text-green-400"
                      >
                        {lockfreeLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Non-blocking I/O */}
                <TabsContent value="demo-io" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-purple-400">Demo: Non-blocking I/O</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIoRunning(!ioRunning)}
                          className={`px-4 py-2 rounded flex items-center gap-2 ${
                            ioRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
                          }`}
                        >
                          {ioRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {ioRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={resetIO}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <span className="text-gray-400">Tiempo: {ioTime}s</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {ioSpeed}ms</label>
                      <Slider
                        value={[ioSpeed]}
                        onValueChange={([val]) => setIoSpeed(val)}
                        min={100}
                        max={1000}
                        step={50}
                        className="w-64"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Event Loop Workers</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {ioWorkers.map((worker) => (
                            <div
                              key={worker.id}
                              className={`p-3 rounded border-2 ${
                                worker.status === 'working'
                                  ? 'bg-purple-900/50 border-purple-500'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">W{worker.id}</div>
                                <div className="text-2xl">{worker.status === 'working' ? '📡' : '💤'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Requests Pendientes</h4>
                        <div className="p-4 bg-gray-800 rounded h-32 overflow-y-auto">
                          {ioPendingRequests.length === 0 ? (
                            <div className="text-center text-gray-500 text-xs">Sin requests pendientes</div>
                          ) : (
                            ioPendingRequests.map((req) => (
                              <div key={req} className="text-xs text-purple-400 mb-1">
                                📨 Request #{Math.floor(req % 1000)}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Estadísticas</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Pendientes</div>
                            <div className="text-lg font-bold text-purple-400">{ioPendingRequests.length}</div>
                          </div>
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Completados</div>
                            <div className="text-lg font-bold text-green-400">{ioCompleted}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log de Eventos</h4>
                      <div
                        ref={ioLogRef}
                        className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-xs text-purple-400"
                      >
                        {ioLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Thread Pool */}
                <TabsContent value="demo-pool" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-yellow-400">Demo: Thread Pool</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setPoolRunning(!poolRunning)}
                          className={`px-4 py-2 rounded flex items-center gap-2 ${
                            poolRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                          }`}
                        >
                          {poolRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {poolRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={resetPool}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <span className="text-gray-400">Tiempo: {poolTime}s</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {poolSpeed}ms</label>
                      <Slider
                        value={[poolSpeed]}
                        onValueChange={([val]) => setPoolSpeed(val)}
                        min={100}
                        max={1000}
                        step={50}
                        className="w-64"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Workers del Pool</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {poolWorkers.map((worker) => (
                            <div
                              key={worker.id}
                              className={`p-3 rounded border-2 ${
                                worker.status === 'working'
                                  ? 'bg-yellow-900/50 border-yellow-500'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">Worker {worker.id}</div>
                                <div className="text-xl">{worker.status === 'working' ? '⚙️' : '💤'}</div>
                                {worker.task && (
                                  <div className="text-xs text-yellow-400 mt-1">Task #{Math.floor(worker.task % 100)}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Cola de Tareas</h4>
                        <div className="p-4 bg-gray-800 rounded h-32 overflow-y-auto">
                          {poolQueue.length === 0 ? (
                            <div className="text-center text-gray-500 text-xs">Cola vacía</div>
                          ) : (
                            poolQueue.map((task) => (
                              <div key={task.id} className="text-xs text-yellow-400 mb-1">
                                📋 {task.type} Task
                              </div>
                            ))
                          )}
                        </div>
                        <div className="mt-2 text-center text-sm">
                          <span className="text-gray-400">Tareas en cola:</span>{' '}
                          <span className="font-bold text-yellow-400">{poolQueue.length}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Estadísticas</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Tareas Completadas</div>
                            <div className="text-lg font-bold text-green-400">{poolCompleted}</div>
                          </div>
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Workers Activos</div>
                            <div className="text-lg font-bold text-yellow-400">
                              {poolWorkers.filter((w) => w.status === 'working').length}/4
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log de Eventos</h4>
                      <div
                        ref={poolLogRef}
                        className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-xs text-yellow-400"
                      >
                        {poolLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: Async/Await */}
                <TabsContent value="demo-async" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-cyan-400">Demo: Async/Await Patterns</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setAsyncRunning(!asyncRunning)}
                          className={`px-4 py-2 rounded flex items-center gap-2 ${
                            asyncRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'
                          }`}
                        >
                          {asyncRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {asyncRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={resetAsync}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <span className="text-gray-400">Tiempo: {asyncTime}s</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {asyncSpeed}ms</label>
                      <Slider
                        value={[asyncSpeed]}
                        onValueChange={([val]) => setAsyncSpeed(val)}
                        min={100}
                        max={1000}
                        step={50}
                        className="w-64"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="col-span-2">
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Async Tasks en Ejecución</h4>
                        <div className="space-y-2">
                          {asyncTasks.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm p-8">
                              Sin tasks activas
                            </div>
                          ) : (
                            asyncTasks.map((task) => (
                              <div
                                key={task.id}
                                className={`p-3 rounded border-2 ${
                                  task.status === 'executing'
                                    ? 'bg-cyan-900/50 border-cyan-500'
                                    : 'bg-green-900/50 border-green-500'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-xs text-gray-400">Task #{Math.floor(task.id % 1000)}</span>
                                    <span className="ml-3 text-sm">
                                      {task.status === 'executing' ? '🔄 Ejecutando' : '✅ Completada'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Duración: {task.duration}s
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Métricas</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Tasks Activas</div>
                            <div className="text-lg font-bold text-cyan-400">{asyncActive}</div>
                          </div>
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Completadas</div>
                            <div className="text-lg font-bold text-green-400">{asyncCompleted}</div>
                          </div>
                          <div className="p-4 bg-cyan-900/30 border border-cyan-700/50 rounded text-center mt-4">
                            <div className="text-2xl mb-1">🔄</div>
                            <div className="text-xs text-cyan-300">Concurrencia sin bloqueos</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log de Eventos</h4>
                      <div
                        ref={asyncLogRef}
                        className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-xs text-cyan-400"
                      >
                        {asyncLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 6: Reducir Scope Crítico */}
                <TabsContent value="demo-scope" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-pink-400">Demo: Reducir Scope Crítico</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setScopeRunning(!scopeRunning)}
                          className={`px-4 py-2 rounded flex items-center gap-2 ${
                            scopeRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-pink-600 hover:bg-pink-700'
                          }`}
                        >
                          {scopeRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {scopeRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={resetScope}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <span className="text-gray-400">Tiempo: {scopeTime}s</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {scopeSpeed}ms</label>
                      <Slider
                        value={[scopeSpeed]}
                        onValueChange={([val]) => setScopeSpeed(val)}
                        min={100}
                        max={1000}
                        step={50}
                        className="w-64"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Threads</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {scopeThreads.map((thread) => (
                            <div
                              key={thread.id}
                              className={`p-3 rounded border-2 ${
                                thread.status === 'working'
                                  ? 'bg-pink-900/50 border-pink-500'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">T{thread.id}</div>
                                <div className="text-xl">{thread.status === 'working' ? '⚙️' : '💤'}</div>
                                {thread.lockHeld && <div className="text-lg mt-1">🔒</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Tiempo en Lock</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Total Acumulado</div>
                            <div className="text-lg font-bold text-pink-400">{scopeLockTime}ms</div>
                          </div>
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Promedio por Op</div>
                            <div className="text-lg font-bold text-yellow-400">
                              {scopeAvgLockTime.toFixed(1)}ms
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Estrategia</h4>
                        <div className="p-4 bg-pink-900/30 border border-pink-700/50 rounded">
                          <div className="text-center">
                            <div className="text-3xl mb-2">📏</div>
                            <div className="text-xs text-pink-300">Scope Mínimo</div>
                            <div className="text-xs text-gray-400 mt-2">
                              Preparar fuera, lock solo para actualizar
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log de Eventos</h4>
                      <div
                        ref={scopeLogRef}
                        className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-xs text-pink-400"
                      >
                        {scopeLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 7: Lazy Initialization */}
                <TabsContent value="demo-lazy" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-orange-400">Demo: Lazy Initialization</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setLazyRunning(!lazyRunning)}
                          className={`px-4 py-2 rounded flex items-center gap-2 ${
                            lazyRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
                          }`}
                        >
                          {lazyRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {lazyRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={resetLazy}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <span className="text-gray-400">Tiempo: {lazyTime}s</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {lazySpeed}ms</label>
                      <Slider
                        value={[lazySpeed]}
                        onValueChange={([val]) => setLazySpeed(val)}
                        min={100}
                        max={1000}
                        step={50}
                        className="w-64"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Workers</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {lazyWorkers.map((worker) => (
                            <div
                              key={worker.id}
                              className={`p-3 rounded border-2 ${
                                worker.status === 'working'
                                  ? 'bg-orange-900/50 border-orange-500'
                                  : worker.status === 'waiting'
                                  ? 'bg-yellow-900/50 border-yellow-500 animate-pulse'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">W{worker.id}</div>
                                <div className="text-xl">
                                  {worker.status === 'waiting'
                                    ? '⏳'
                                    : worker.status === 'working'
                                    ? '⚙️'
                                    : '💤'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Recursos</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {lazyInitialized.map((initialized, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded border-2 ${
                                initialized
                                  ? 'bg-green-900/50 border-green-500'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-xs text-gray-400">Recurso {idx}</div>
                                <div className="text-2xl">{initialized ? '✅' : '💤'}</div>
                                <div className="text-xs text-gray-400">
                                  {initialized ? 'Inicializado' : 'Lazy'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Estadísticas</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Total Accesos</div>
                            <div className="text-lg font-bold text-orange-400">{lazyAccesses}</div>
                          </div>
                          <div className="p-3 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Inicializados</div>
                            <div className="text-lg font-bold text-green-400">
                              {lazyInitialized.filter((init) => init).length}/4
                            </div>
                          </div>
                          <div className="p-4 bg-orange-900/30 border border-orange-700/50 rounded text-center">
                            <div className="text-2xl mb-1">💤</div>
                            <div className="text-xs text-orange-300">Init on-demand</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log de Eventos</h4>
                      <div
                        ref={lazyLogRef}
                        className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-xs text-orange-400"
                      >
                        {lazyLogs.map((log, idx) => (
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
