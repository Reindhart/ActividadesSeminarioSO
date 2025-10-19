import { BookOpen, Code, Play, Pause, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";

interface Thread {
  id: number;
  type: 'reader' | 'writer';
  state: 'waiting' | 'reading' | 'writing' | 'completed';
  priority?: number;
  timestamp?: number;
  version?: number;
  waitTime: number;
}

export default function LecturaEscritura() {
  // Estados para Demo 1: RWLock
  const [rwlockThreads, setRwlockThreads] = useState<Thread[]>([]);
  const [rwlockReaders, setRwlockReaders] = useState(0);
  const [rwlockWriters, setRwlockWriters] = useState(0);
  const [rwlockRunning, setRwlockRunning] = useState(false);
  const [rwlockSpeed, setRwlockSpeed] = useState(500);
  const [rwlockLogs, setRwlockLogs] = useState<string[]>([]);
  const rwlockLogRef = useRef<HTMLDivElement>(null);

  // Estados para Demo 2: Readers-Preference
  const [readersThreads, setReadersThreads] = useState<Thread[]>([]);
  const [readersActive, setReadersActive] = useState(0);
  const [readersRunning, setReadersRunning] = useState(false);
  const [readersSpeed, setReadersSpeed] = useState(500);
  const [readersLogs, setReadersLogs] = useState<string[]>([]);
  const readersLogRef = useRef<HTMLDivElement>(null);

  // Estados para Demo 3: Writers-Preference
  const [writersThreads, setWritersThreads] = useState<Thread[]>([]);
  const [writersWaiting, setWritersWaiting] = useState(0);
  const [writersRunning, setWritersRunning] = useState(false);
  const [writersSpeed, setWritersSpeed] = useState(500);
  const [writersLogs, setWritersLogs] = useState<string[]>([]);
  const writersLogRef = useRef<HTMLDivElement>(null);

  // Estados para Demo 4: Fair Policy
  const [fairThreads, setFairThreads] = useState<Thread[]>([]);
  const [fairQueue, setFairQueue] = useState<Thread[]>([]);
  const [fairRunning, setFairRunning] = useState(false);
  const [fairSpeed, setFairSpeed] = useState(500);
  const [fairLogs, setFairLogs] = useState<string[]>([]);
  const fairLogRef = useRef<HTMLDivElement>(null);

  // Estados para Demo 5: Copy-on-Write
  const [cowThreads, setCowThreads] = useState<Thread[]>([]);
  const [cowVersions, setCowVersions] = useState<number[]>([1]);
  const [cowCurrentVersion, setCowCurrentVersion] = useState(1);
  const [cowRunning, setCowRunning] = useState(false);
  const [cowSpeed, setCowSpeed] = useState(500);
  const [cowLogs, setCowLogs] = useState<string[]>([]);
  const cowLogRef = useRef<HTMLDivElement>(null);

  // Estados para Demo 6: RCU
  const [rcuThreads, setRcuThreads] = useState<Thread[]>([]);
  const [rcuGracePeriod, setRcuGracePeriod] = useState(false);
  const [rcuOldVersion, setRcuOldVersion] = useState<number | null>(null);
  const [rcuRunning, setRcuRunning] = useState(false);
  const [rcuSpeed, setRcuSpeed] = useState(500);
  const [rcuLogs, setRcuLogs] = useState<string[]>([]);
  const rcuLogRef = useRef<HTMLDivElement>(null);

  // Estados para Demo 7: MVCC
  const [mvccThreads, setMvccThreads] = useState<Thread[]>([]);
  const [mvccVersions, setMvccVersions] = useState<{ id: number; data: string; timestamp: number }[]>([
    { id: 1, data: "Data v1", timestamp: 0 }
  ]);
  const [mvccRunning, setMvccRunning] = useState(false);
  const [mvccSpeed, setMvccSpeed] = useState(500);
  const [mvccLogs, setMvccLogs] = useState<string[]>([]);
  const mvccLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    if (rwlockLogRef.current) {
      rwlockLogRef.current.scrollTop = rwlockLogRef.current.scrollHeight;
    }
  }, [rwlockLogs]);

  useEffect(() => {
    if (readersLogRef.current) {
      readersLogRef.current.scrollTop = readersLogRef.current.scrollHeight;
    }
  }, [readersLogs]);

  useEffect(() => {
    if (writersLogRef.current) {
      writersLogRef.current.scrollTop = writersLogRef.current.scrollHeight;
    }
  }, [writersLogs]);

  useEffect(() => {
    if (fairLogRef.current) {
      fairLogRef.current.scrollTop = fairLogRef.current.scrollHeight;
    }
  }, [fairLogs]);

  useEffect(() => {
    if (cowLogRef.current) {
      cowLogRef.current.scrollTop = cowLogRef.current.scrollHeight;
    }
  }, [cowLogs]);

  useEffect(() => {
    if (rcuLogRef.current) {
      rcuLogRef.current.scrollTop = rcuLogRef.current.scrollHeight;
    }
  }, [rcuLogs]);

  useEffect(() => {
    if (mvccLogRef.current) {
      mvccLogRef.current.scrollTop = mvccLogRef.current.scrollHeight;
    }
  }, [mvccLogs]);

  // Simulación Demo 1: RWLock
  useEffect(() => {
    if (!rwlockRunning) return;

    const interval = setInterval(() => {
      setRwlockThreads(prev => {
        const newThreads = [...prev];
        let readersCount = rwlockReaders;
        let writersCount = rwlockWriters;

        // Procesar threads en espera
        for (let i = 0; i < newThreads.length; i++) {
          const thread = newThreads[i];

          if (thread.state === 'waiting') {
            thread.waitTime++;

            if (thread.type === 'reader' && writersCount === 0) {
              thread.state = 'reading';
              readersCount++;
              setRwlockLogs(logs => [...logs, `🔵 Lector ${thread.id} inicia lectura (${readersCount} lectores activos)`]);
            } else if (thread.type === 'writer' && readersCount === 0 && writersCount === 0) {
              thread.state = 'writing';
              writersCount++;
              setRwlockLogs(logs => [...logs, `🔴 Escritor ${thread.id} inicia escritura (acceso exclusivo)`]);
            }
          } else if (thread.state === 'reading') {
            if (Math.random() < 0.3) {
              thread.state = 'completed';
              readersCount--;
              setRwlockLogs(logs => [...logs, `✅ Lector ${thread.id} completado (${readersCount} lectores activos)`]);
            }
          } else if (thread.state === 'writing') {
            if (Math.random() < 0.2) {
              thread.state = 'completed';
              writersCount--;
              setRwlockLogs(logs => [...logs, `✅ Escritor ${thread.id} completado`]);
            }
          }
        }

        setRwlockReaders(readersCount);
        setRwlockWriters(writersCount);

        return newThreads.filter(t => t.state !== 'completed');
      });
    }, rwlockSpeed);

    return () => clearInterval(interval);
  }, [rwlockRunning, rwlockSpeed, rwlockReaders, rwlockWriters]);

  // Simulación Demo 2: Readers-Preference
  useEffect(() => {
    if (!readersRunning) return;

    const interval = setInterval(() => {
      setReadersThreads(prev => {
        const newThreads = [...prev];
        let activeReaders = readersActive;

        for (let i = 0; i < newThreads.length; i++) {
          const thread = newThreads[i];

          if (thread.state === 'waiting') {
            thread.waitTime++;

            if (thread.type === 'reader' && (activeReaders > 0 || newThreads.every(t => t.type === 'reader' || t.state !== 'waiting'))) {
              thread.state = 'reading';
              activeReaders++;
              setReadersLogs(logs => [...logs, `📖 Lector ${thread.id} inicia (${activeReaders} concurrentes)`]);
            } else if (thread.type === 'writer' && activeReaders === 0 && !newThreads.some(t => t.type === 'reader' && t.state === 'reading')) {
              thread.state = 'writing';
              setReadersLogs(logs => [...logs, `✍️ Escritor ${thread.id} inicia (esperó ${thread.waitTime} ciclos)`]);
            } else if (thread.type === 'writer' && thread.waitTime > 5) {
              setReadersLogs(logs => [...logs, `⚠️ Escritor ${thread.id} STARVATION (${thread.waitTime} ciclos esperando)`]);
            }
          } else if (thread.state === 'reading') {
            if (Math.random() < 0.4) {
              thread.state = 'completed';
              activeReaders--;
              setReadersLogs(logs => [...logs, `✅ Lector ${thread.id} termina`]);
            }
          } else if (thread.state === 'writing') {
            if (Math.random() < 0.3) {
              thread.state = 'completed';
              setReadersLogs(logs => [...logs, `✅ Escritor ${thread.id} termina`]);
            }
          }
        }

        setReadersActive(activeReaders);
        return newThreads.filter(t => t.state !== 'completed');
      });
    }, readersSpeed);

    return () => clearInterval(interval);
  }, [readersRunning, readersSpeed, readersActive]);

  // Simulación Demo 3: Writers-Preference
  useEffect(() => {
    if (!writersRunning) return;

    const interval = setInterval(() => {
      setWritersThreads(prev => {
        const newThreads = [...prev];
        const waitingWritersCount = newThreads.filter(t => t.type === 'writer' && t.state === 'waiting').length;

        for (let i = 0; i < newThreads.length; i++) {
          const thread = newThreads[i];

          if (thread.state === 'waiting') {
            thread.waitTime++;

            const hasActiveWriters = newThreads.some(t => t.type === 'writer' && t.state === 'writing');
            const hasActiveReaders = newThreads.some(t => t.type === 'reader' && t.state === 'reading');

            if (thread.type === 'writer' && !hasActiveWriters && !hasActiveReaders) {
              thread.state = 'writing';
              setWritersLogs(logs => [...logs, `✍️ Escritor ${thread.id} inicia escritura`]);
            } else if (thread.type === 'reader' && waitingWritersCount === 0 && !hasActiveWriters) {
              thread.state = 'reading';
              setWritersLogs(logs => [...logs, `📖 Lector ${thread.id} inicia lectura`]);
            } else if (thread.type === 'reader' && waitingWritersCount > 0 && thread.waitTime > 4) {
              setWritersLogs(logs => [...logs, `⚠️ Lector ${thread.id} BLOQUEADO por ${waitingWritersCount} escritores (${thread.waitTime} ciclos)`]);
            }
          } else if (thread.state === 'reading') {
            if (Math.random() < 0.4) {
              thread.state = 'completed';
              setWritersLogs(logs => [...logs, `✅ Lector ${thread.id} completado`]);
            }
          } else if (thread.state === 'writing') {
            if (Math.random() < 0.3) {
              thread.state = 'completed';
              setWritersLogs(logs => [...logs, `✅ Escritor ${thread.id} completado`]);
            }
          }
        }

        setWritersWaiting(waitingWritersCount);
        return newThreads.filter(t => t.state !== 'completed');
      });
    }, writersSpeed);

    return () => clearInterval(interval);
  }, [writersRunning, writersSpeed]);

  // Simulación Demo 4: Fair Policy
  useEffect(() => {
    if (!fairRunning) return;

    const interval = setInterval(() => {
      setFairThreads(prev => {
        const newThreads = [...prev];
        const queue = [...fairQueue];

        // Agregar nuevos threads a la cola FIFO
        for (const thread of newThreads) {
          if (thread.state === 'waiting' && !queue.some(q => q.id === thread.id)) {
            queue.push(thread);
            setFairLogs(logs => [...logs, `📥 Thread ${thread.id} (${thread.type}) entra a cola FIFO (pos: ${queue.length})`]);
          }
        }

        // Procesar primer thread de la cola
        if (queue.length > 0) {
          const firstInQueue = queue[0];
          const threadIndex = newThreads.findIndex(t => t.id === firstInQueue.id);

          if (threadIndex !== -1) {
            const thread = newThreads[threadIndex];
            const hasActive = newThreads.some(t => t.state === 'reading' || t.state === 'writing');

            if (!hasActive) {
              thread.state = thread.type === 'reader' ? 'reading' : 'writing';
              queue.shift();
              setFairLogs(logs => [...logs, `▶️ ${thread.type === 'reader' ? 'Lector' : 'Escritor'} ${thread.id} obtiene acceso (FIFO)`]);
            }
          }
        }

        // Completar threads activos
        for (let i = 0; i < newThreads.length; i++) {
          const thread = newThreads[i];

          if ((thread.state === 'reading' || thread.state === 'writing') && Math.random() < 0.35) {
            thread.state = 'completed';
            setFairLogs(logs => [...logs, `✅ ${thread.type === 'reader' ? 'Lector' : 'Escritor'} ${thread.id} completado`]);
          }
        }

        setFairQueue(queue);
        return newThreads.filter(t => t.state !== 'completed');
      });
    }, fairSpeed);

    return () => clearInterval(interval);
  }, [fairRunning, fairSpeed, fairQueue]);

  // Simulación Demo 5: Copy-on-Write
  useEffect(() => {
    if (!cowRunning) return;

    const interval = setInterval(() => {
      setCowThreads(prev => {
        const newThreads = [...prev];

        for (let i = 0; i < newThreads.length; i++) {
          const thread = newThreads[i];

          if (thread.state === 'waiting') {
            if (thread.type === 'reader') {
              // Lectores acceden inmediatamente sin bloqueos
              thread.state = 'reading';
              thread.version = cowCurrentVersion;
              setCowLogs(logs => [...logs, `📖 Lector ${thread.id} accede a versión ${thread.version} (lock-free)`]);
            } else if (thread.type === 'writer') {
              const activeWriters = newThreads.filter(t => t.type === 'writer' && t.state === 'writing').length;

              if (activeWriters === 0) {
                thread.state = 'writing';
                const newVersion = cowCurrentVersion + 1;
                setCowVersions(prev => [...prev, newVersion]);
                setCowCurrentVersion(newVersion);
                setCowLogs(logs => [...logs, `✍️ Escritor ${thread.id} crea copia → versión ${newVersion}`]);
              }
            }
          } else if (thread.state === 'reading') {
            if (Math.random() < 0.4) {
              thread.state = 'completed';
              setCowLogs(logs => [...logs, `✅ Lector ${thread.id} termina (leyó v${thread.version})`]);
            }
          } else if (thread.state === 'writing') {
            if (Math.random() < 0.25) {
              thread.state = 'completed';
              setCowLogs(logs => [...logs, `✅ Escritor ${thread.id} completa escritura, puntero actualizado`]);
            }
          }
        }

        return newThreads.filter(t => t.state !== 'completed');
      });
    }, cowSpeed);

    return () => clearInterval(interval);
  }, [cowRunning, cowSpeed, cowCurrentVersion]);

  // Simulación Demo 6: RCU
  useEffect(() => {
    if (!rcuRunning) return;

    const interval = setInterval(() => {
      setRcuThreads(prev => {
        const newThreads = [...prev];

        for (let i = 0; i < newThreads.length; i++) {
          const thread = newThreads[i];

          if (thread.state === 'waiting') {
            if (thread.type === 'reader') {
              thread.state = 'reading';
              setRcuLogs(logs => [...logs, `📖 Lector ${thread.id} inicia (ultra-rápido, sin locks)`]);
            } else if (thread.type === 'writer' && !rcuGracePeriod) {
              thread.state = 'writing';
              setRcuOldVersion(1);
              setRcuGracePeriod(true);
              setRcuLogs(logs => [...logs, `✍️ Escritor ${thread.id} crea nueva versión, inicia grace period`]);
            }
          } else if (thread.state === 'reading') {
            if (Math.random() < 0.5) {
              thread.state = 'completed';
              setRcuLogs(logs => [...logs, `✅ Lector ${thread.id} termina`]);
            }
          } else if (thread.state === 'writing') {
            const activeReaders = newThreads.filter(t => t.state === 'reading').length;

            if (activeReaders === 0 && rcuGracePeriod) {
              thread.state = 'completed';
              setRcuGracePeriod(false);
              setRcuOldVersion(null);
              setRcuLogs(logs => [...logs, `✅ Escritor ${thread.id} completa, grace period terminado, memoria liberada`]);
            }
          }
        }

        return newThreads.filter(t => t.state !== 'completed');
      });
    }, rcuSpeed);

    return () => clearInterval(interval);
  }, [rcuRunning, rcuSpeed, rcuGracePeriod]);

  // Simulación Demo 7: MVCC
  useEffect(() => {
    if (!mvccRunning) return;

    const interval = setInterval(() => {
      setMvccThreads(prev => {
        const newThreads = [...prev];

        for (let i = 0; i < newThreads.length; i++) {
          const thread = newThreads[i];

          if (thread.state === 'waiting') {
            if (thread.type === 'reader') {
              thread.state = 'reading';
              thread.timestamp = Date.now();
              const snapshotVersion = mvccVersions[mvccVersions.length - 1];
              setMvccLogs(logs => [...logs, `📖 Lector ${thread.id} lee snapshot v${snapshotVersion.id} (ts: ${thread.timestamp})`]);
            } else if (thread.type === 'writer') {
              thread.state = 'writing';
              const newVersionId = mvccVersions.length + 1;
              const newVersion = {
                id: newVersionId,
                data: `Data v${newVersionId}`,
                timestamp: Date.now()
              };
              setMvccVersions(prev => [...prev, newVersion]);
              setMvccLogs(logs => [...logs, `✍️ Escritor ${thread.id} crea versión ${newVersionId}`]);
            }
          } else if (thread.state === 'reading') {
            if (Math.random() < 0.4) {
              thread.state = 'completed';
              setMvccLogs(logs => [...logs, `✅ Lector ${thread.id} completado (snapshot consistente)`]);
            }
          } else if (thread.state === 'writing') {
            if (Math.random() < 0.3) {
              thread.state = 'completed';
              setMvccLogs(logs => [...logs, `✅ Escritor ${thread.id} commit exitoso`]);
            }
          }
        }

        return newThreads.filter(t => t.state !== 'completed');
      });
    }, mvccSpeed);

    return () => clearInterval(interval);
  }, [mvccRunning, mvccSpeed, mvccVersions]);

  // Funciones de control para las demos
  const resetRwlock = () => {
    setRwlockThreads([]);
    setRwlockReaders(0);
    setRwlockWriters(0);
    setRwlockLogs([]);
    setRwlockRunning(false);
  };

  const addRwlockThread = (type: 'reader' | 'writer') => {
    const newThread: Thread = {
      id: Date.now(),
      type,
      state: 'waiting',
      waitTime: 0
    };
    setRwlockThreads(prev => [...prev, newThread]);
    setRwlockLogs(prev => [...prev, `➕ ${type === 'reader' ? 'Lector' : 'Escritor'} ${newThread.id} agregado`]);
  };

  const resetReaders = () => {
    setReadersThreads([]);
    setReadersActive(0);
    setReadersLogs([]);
    setReadersRunning(false);
  };

  const addReadersThread = (type: 'reader' | 'writer') => {
    const newThread: Thread = {
      id: Date.now(),
      type,
      state: 'waiting',
      waitTime: 0
    };
    setReadersThreads(prev => [...prev, newThread]);
    setReadersLogs(prev => [...prev, `➕ ${type === 'reader' ? 'Lector' : 'Escritor'} ${newThread.id} agregado`]);
  };

  const resetWriters = () => {
    setWritersThreads([]);
    setWritersWaiting(0);
    setWritersLogs([]);
    setWritersRunning(false);
  };

  const addWritersThread = (type: 'reader' | 'writer') => {
    const newThread: Thread = {
      id: Date.now(),
      type,
      state: 'waiting',
      waitTime: 0
    };
    setWritersThreads(prev => [...prev, newThread]);
    setWritersLogs(prev => [...prev, `➕ ${type === 'reader' ? 'Lector' : 'Escritor'} ${newThread.id} agregado`]);
  };

  const resetFair = () => {
    setFairThreads([]);
    setFairQueue([]);
    setFairLogs([]);
    setFairRunning(false);
  };

  const addFairThread = (type: 'reader' | 'writer') => {
    const newThread: Thread = {
      id: Date.now(),
      type,
      state: 'waiting',
      waitTime: 0,
      timestamp: Date.now()
    };
    setFairThreads(prev => [...prev, newThread]);
    setFairLogs(prev => [...prev, `➕ ${type === 'reader' ? 'Lector' : 'Escritor'} ${newThread.id} agregado`]);
  };

  const resetCow = () => {
    setCowThreads([]);
    setCowVersions([1]);
    setCowCurrentVersion(1);
    setCowLogs([]);
    setCowRunning(false);
  };

  const addCowThread = (type: 'reader' | 'writer') => {
    const newThread: Thread = {
      id: Date.now(),
      type,
      state: 'waiting',
      waitTime: 0
    };
    setCowThreads(prev => [...prev, newThread]);
    setCowLogs(prev => [...prev, `➕ ${type === 'reader' ? 'Lector' : 'Escritor'} ${newThread.id} agregado`]);
  };

  const resetRcu = () => {
    setRcuThreads([]);
    setRcuGracePeriod(false);
    setRcuOldVersion(null);
    setRcuLogs([]);
    setRcuRunning(false);
  };

  const addRcuThread = (type: 'reader' | 'writer') => {
    const newThread: Thread = {
      id: Date.now(),
      type,
      state: 'waiting',
      waitTime: 0
    };
    setRcuThreads(prev => [...prev, newThread]);
    setRcuLogs(prev => [...prev, `➕ ${type === 'reader' ? 'Lector' : 'Escritor'} ${newThread.id} agregado`]);
  };

  const resetMvcc = () => {
    setMvccThreads([]);
    setMvccVersions([{ id: 1, data: "Data v1", timestamp: 0 }]);
    setMvccLogs([]);
    setMvccRunning(false);
  };

  const addMvccThread = (type: 'reader' | 'writer') => {
    const newThread: Thread = {
      id: Date.now(),
      type,
      state: 'waiting',
      waitTime: 0
    };
    setMvccThreads(prev => [...prev, newThread]);
    setMvccLogs(prev => [...prev, `➕ ${type === 'reader' ? 'Lector' : 'Escritor'} ${newThread.id} agregado`]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="size-12 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">📖✍️ Problema de Lectura/Escritura</h1>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            El <span className="font-bold text-blue-400">Problema de Lectura/Escritura</span> (Readers-Writers) surge
            cuando múltiples procesos necesitan acceder a un recurso compartido, donde algunos solo leen y otros escriben.
            Los lectores pueden acceder concurrentemente, pero los escritores requieren acceso exclusivo para mantener
            la consistencia de los datos.
          </p>
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <p className="text-blue-200">
              <span className="font-bold">Desafío:</span> Maximizar la concurrencia de lectores sin sacrificar
              la integridad de los datos, evitando starvation de escritores y garantizando políticas de acceso justas.
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
              <Tabs defaultValue="rwlock" className="px-6 pb-6">
                <TabsList className="grid grid-cols-7 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="rwlock">🔐 RWLock</TabsTrigger>
                  <TabsTrigger value="readers-pref">📖 Readers-Pref</TabsTrigger>
                  <TabsTrigger value="writers-pref">✍️ Writers-Pref</TabsTrigger>
                  <TabsTrigger value="fair">⚖️ Fair Policy</TabsTrigger>
                  <TabsTrigger value="cow">📋 Copy-on-Write</TabsTrigger>
                  <TabsTrigger value="rcu">🔄 RCU</TabsTrigger>
                  <TabsTrigger value="mvcc">📚 MVCC</TabsTrigger>
                </TabsList>

                {/* Solución 1: Read-Write Locks (RWLock) */}
                <TabsContent value="rwlock" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-blue-400 mb-4">🔐 Read-Write Locks (RWLock)</h3>
                    <p className="text-gray-300 mb-4">
                      Permite múltiples lectores concurrentes pero escritores exclusivos. Es la solución básica
                      al problema de lectura/escritura.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura RWLock {
  readers: entero = 0
  writers: entero = 0
  mutex: Lock
  okToRead: ConditionVariable
  okToWrite: ConditionVariable
}

función RWLock.readLock() {
  mutex.lock()
  
  // Esperar si hay escritores activos
  mientras writers > 0:
    okToRead.wait(mutex)
  
  readers++
  mutex.unlock()
}

función RWLock.readUnlock() {
  mutex.lock()
  readers--
  
  // Notificar si no hay más lectores
  si readers == 0:
    okToWrite.signal()
  
  mutex.unlock()
}

función RWLock.writeLock() {
  mutex.lock()
  
  // Esperar si hay lectores o escritores activos
  mientras readers > 0 O writers > 0:
    okToWrite.wait(mutex)
  
  writers++
  mutex.unlock()
}

función RWLock.writeUnlock() {
  mutex.lock()
  writers--
  
  // Notificar a todos
  okToRead.broadcast()
  okToWrite.signal()
  
  mutex.unlock()
}

// Uso
función lector() {
  rwlock.readLock()
  // Leer datos
  leerDatos()
  rwlock.readUnlock()
}

función escritor() {
  rwlock.writeLock()
  // Escribir datos
  escribirDatos()
  rwlock.writeUnlock()
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded">
                      <p className="text-sm text-blue-200">
                        <span className="font-bold">Ventaja:</span> Maximiza concurrencia de lectores.
                        <span className="font-bold"> Desventaja:</span> Puede causar starvation de escritores.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 2: Readers-Preference */}
                <TabsContent value="readers-pref" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-green-400 mb-4">📖 Readers-Preference</h3>
                    <p className="text-gray-300 mb-4">
                      Prioriza lectores sobre escritores. Los nuevos lectores pueden entrar mientras hay otros
                      lectores activos, incluso si hay escritores esperando.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura ReadersPreference {
  readCount: entero = 0
  writeCount: entero = 0
  readerMutex: Lock
  resourceMutex: Lock
}

función leer() {
  // Primer lector bloquea recurso
  readerMutex.lock()
  readCount++
  
  si readCount == 1:
    resourceMutex.lock()  // Primer lector bloquea escritores
  
  readerMutex.unlock()
  
  // SECCIÓN CRÍTICA - LECTURA
  leerDatos()
  
  // Último lector libera recurso
  readerMutex.lock()
  readCount--
  
  si readCount == 0:
    resourceMutex.unlock()  // Último lector permite escritores
  
  readerMutex.unlock()
}

función escribir() {
  resourceMutex.lock()
  
  // SECCIÓN CRÍTICA - ESCRITURA
  escribirDatos()
  
  resourceMutex.unlock()
}

// Problema: Starvation de escritores
// Si lectores llegan continuamente, escritores nunca ejecutan

// Ejemplo de uso
Proceso Lector:
  mientras verdadero:
    leer()
    // Procesar datos leídos
    esperar(random(10, 100))

Proceso Escritor:
  mientras verdadero:
    escribir()
    // Generar nuevos datos
    esperar(random(100, 500))`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-green-900/30 border border-green-700/50 rounded">
                      <p className="text-sm text-green-200">
                        <span className="font-bold">Ventaja:</span> Máxima throughput de lectura, simple.
                        <span className="font-bold"> Desventaja:</span> Starvation severa de escritores.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 3: Writers-Preference */}
                <TabsContent value="writers-pref" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">✍️ Writers-Preference</h3>
                    <p className="text-gray-300 mb-4">
                      Prioriza escritores sobre lectores. Cuando un escritor está esperando, no se permiten
                      nuevos lectores hasta que el escritor complete.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura WritersPreference {
  readCount: entero = 0
  writeCount: entero = 0
  waitingWriters: entero = 0
  
  mutex1: Lock  // Protege contadores
  mutex2: Lock  // Controla entrada de lectores
  mutex3: Lock  // Recurso principal
  
  okToRead: ConditionVariable
  okToWrite: ConditionVariable
}

función leer() {
  mutex2.lock()  // Bloquea si hay escritores esperando
  mutex1.lock()
  
  readCount++
  si readCount == 1:
    mutex3.lock()
  
  mutex1.unlock()
  mutex2.unlock()
  
  // LECTURA
  leerDatos()
  
  mutex1.lock()
  readCount--
  
  si readCount == 0:
    mutex3.unlock()
  
  mutex1.unlock()
}

función escribir() {
  mutex1.lock()
  waitingWriters++
  
  si waitingWriters == 1:
    mutex2.lock()  // Bloquea nuevos lectores
  
  mutex1.unlock()
  
  mutex3.lock()  // Obtener recurso
  
  // ESCRITURA
  escribirDatos()
  
  mutex3.unlock()
  
  mutex1.lock()
  waitingWriters--
  
  si waitingWriters == 0:
    mutex2.unlock()  // Permitir lectores
  
  mutex1.unlock()
}

// Ventaja: Evita starvation de escritores
// Desventaja: Puede causar starvation de lectores

función monitoreoPrioridad() {
  imprimir("Escritores esperando:", waitingWriters)
  imprimir("Lectores activos:", readCount)
  
  si waitingWriters > 0:
    imprimir("⚠️ NUEVOS LECTORES BLOQUEADOS")
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded">
                      <p className="text-sm text-purple-200">
                        <span className="font-bold">Ventaja:</span> Garantiza progreso de escritores.
                        <span className="font-bold"> Desventaja:</span> Puede causar starvation de lectores.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 4: Fair Policy */}
                <TabsContent value="fair" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-yellow-400 mb-4">⚖️ Fair Policy</h3>
                    <p className="text-gray-300 mb-4">
                      Garantiza que ni lectores ni escritores sufran starvation mediante una cola FIFO.
                      Los procesos obtienen acceso en el orden en que llegan.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura FairRWLock {
  readCount: entero = 0
  writeCount: entero = 0
  
  turnstile: Semaphore(1)  // FIFO fairness
  resourceMutex: Lock
  readerMutex: Lock
}

función leer() {
  // Pasar por turnstile (orden FIFO)
  turnstile.wait()
  
  readerMutex.lock()
  readCount++
  
  si readCount == 1:
    resourceMutex.lock()
  
  readerMutex.unlock()
  turnstile.signal()  // Liberar turnstile rápidamente
  
  // LECTURA
  leerDatos()
  
  readerMutex.lock()
  readCount--
  
  si readCount == 0:
    resourceMutex.unlock()
  
  readerMutex.unlock()
}

función escribir() {
  // Pasar por turnstile (orden FIFO)
  turnstile.wait()
  resourceMutex.lock()
  turnstile.signal()
  
  // ESCRITURA
  escribirDatos()
  
  resourceMutex.unlock()
}

// Política justa con timestamps
estructura FairQueue {
  cola: ColaPrioridad[Solicitud]
  
  estructura Solicitud {
    tipo: LECTOR | ESCRITOR
    proceso: Proceso
    timestamp: tiempo
  }
}

función FairQueue.solicitar(tipo) {
  solicitud = Solicitud(tipo, proceso_actual, tiempo_actual)
  cola.insertar(solicitud)
  
  // Esperar turno
  mientras cola.primero() != solicitud:
    esperar()
  
  // Obtener acceso
  si solicitud.tipo == ESCRITOR:
    esperarLectoresActivos()
  
  ejecutarAcceso()
  cola.remover(solicitud)
  notificar_siguiente()
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded">
                      <p className="text-sm text-yellow-200">
                        <span className="font-bold">Ventaja:</span> No hay starvation, orden FIFO justo.
                        <span className="font-bold"> Desventaja:</span> Menos concurrencia que readers-preference.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 5: Copy-on-Write (CoW) */}
                <TabsContent value="cow" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">📋 Copy-on-Write (CoW)</h3>
                    <p className="text-gray-300 mb-4">
                      Los lectores acceden a datos sin bloqueos. Los escritores crean una copia, la modifican,
                      y luego actualizan el puntero atómicamente.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura CoWData {
  datos: puntero a Dato
  writeMutex: Lock
}

función leer() {
  // Lectura sin bloqueos - lock-free
  datosActuales = cargar_atomico(datos)
  
  // Leer de manera segura
  resultado = datosActuales.leer()
  
  retornar resultado
}

función escribir(nuevosValores) {
  writeMutex.lock()
  
  // 1. Obtener datos actuales
  datosViejos = cargar_atomico(datos)
  
  // 2. Crear copia completa
  datosNuevos = clonar(datosViejos)
  
  // 3. Modificar la copia
  datosNuevos.aplicarCambios(nuevosValores)
  
  // 4. Actualizar puntero atómicamente
  almacenar_atomico(datos, datosNuevos)
  
  // 5. Esperar que todos los lectores terminen con datos viejos
  // (usando contadores de referencias o grace period)
  esperarLectores(datosViejos)
  
  // 6. Liberar memoria antigua
  liberar(datosViejos)
  
  writeMutex.unlock()
}

// Implementación con contadores de referencias
estructura CoWConRefCount {
  datos: puntero a Dato
  refCount: AtomicInteger
}

función leerConRefCount() {
  loop:
    datosActuales = cargar_atomico(datos)
    refCount = datosActuales.refCount
    
    // Incrementar refcount atómicamente
    si compare_and_swap(datosActuales.refCount, refCount, refCount + 1):
      break
  
  // Leer datos
  resultado = datosActuales.leer()
  
  // Decrementar refcount
  decrementar_atomico(datosActuales.refCount)
  
  retornar resultado
}

función escribirConRefCount(nuevosValores) {
  writeMutex.lock()
  
  datosViejos = cargar_atomico(datos)
  datosNuevos = clonar(datosViejos)
  datosNuevos.refCount = 0
  datosNuevos.aplicarCambios(nuevosValores)
  
  almacenar_atomico(datos, datosNuevos)
  
  // Esperar a que refCount llegue a 0
  mientras datosViejos.refCount > 0:
    esperar_breve()
  
  liberar(datosViejos)
  writeMutex.unlock()
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-700/50 rounded">
                      <p className="text-sm text-cyan-200">
                        <span className="font-bold">Ventaja:</span> Lectores lock-free, máxima concurrencia.
                        <span className="font-bold"> Desventaja:</span> Overhead de memoria, escrituras costosas.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 6: RCU (Read-Copy-Update) */}
                <TabsContent value="rcu" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-pink-400 mb-4">🔄 RCU (Read-Copy-Update)</h3>
                    <p className="text-gray-300 mb-4">
                      Similar a CoW pero optimizado para el kernel de Linux. Usa "grace periods" para garantizar
                      que todos los lectores terminaron antes de liberar memoria.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura RCU {
  datos: puntero atómico a Dato
  gracePeriodQueue: Cola[Dato]
}

función rcu_read_lock() {
  // Deshabilitar preempción (en kernel)
  deshabilitar_preempcion()
  // No requiere mutex real - muy rápido
}

función rcu_read_unlock() {
  // Rehabilitar preempción
  habilitar_preempcion()
}

función rcu_dereference(puntero) {
  // Leer puntero con barreras de memoria
  retornar READ_ONCE(puntero)
}

// Lector RCU
función leer() {
  rcu_read_lock()
  
  datosActuales = rcu_dereference(datos)
  resultado = datosActuales.leer()
  
  rcu_read_unlock()
  
  retornar resultado
}

// Escritor RCU
función actualizar(nuevosValores) {
  // 1. Crear nueva versión
  datosNuevos = alocar(Dato)
  datosViejos = datos
  
  // 2. Copiar y modificar
  copiar(datosViejos, datosNuevos)
  datosNuevos.aplicarCambios(nuevosValores)
  
  // 3. Publicar nueva versión (atómico)
  rcu_assign_pointer(datos, datosNuevos)
  
  // 4. Esperar grace period
  synchronize_rcu()
  
  // 5. Liberar versión antigua
  liberar(datosViejos)
}

función synchronize_rcu() {
  // Esperar a que todos los CPUs pasen por quiescent state
  // (punto donde no hay lectores RCU activos)
  
  para cada cpu en sistema:
    mientras cpu.enSeccionRCU():
      esperar()
}

// Implementación de call_rcu (asíncrono)
función call_rcu(punteroViejo, callback) {
  // Encolar para liberación posterior
  gracePeriodQueue.agregar(punteroViejo, callback)
  
  // Ejecutar callbacks cuando grace period expire
  si grace_period_expirado():
    para cada elemento en gracePeriodQueue:
      elemento.callback()
      gracePeriodQueue.remover(elemento)
}

// Uso avanzado con call_rcu
función actualizarAsync(nuevosValores) {
  datosNuevos = crear_y_modificar(nuevosValores)
  datosViejos = datos
  
  rcu_assign_pointer(datos, datosNuevos)
  
  // Liberar asincrónicamente después de grace period
  call_rcu(datosViejos, liberar_memoria)
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-pink-900/30 border border-pink-700/50 rounded">
                      <p className="text-sm text-pink-200">
                        <span className="font-bold">Ventaja:</span> Lectores ultra-rápidos, escalable.
                        <span className="font-bold"> Desventaja:</span> Complejo, específico para kernels/sistemas.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 7: MVCC (Multi-Version Concurrency Control) */}
                <TabsContent value="mvcc" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-orange-400 mb-4">📚 MVCC (Multi-Version Concurrency Control)</h3>
                    <p className="text-gray-300 mb-4">
                      Mantiene múltiples versiones de los datos con timestamps. Cada transacción ve una snapshot
                      consistente. Usado en bases de datos (PostgreSQL, Oracle).
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura VersionedData {
  versiones: Lista[Version]
  currentVersion: AtomicInteger = 0
  mutex: Lock
}

estructura Version {
  datos: Dato
  timestamp: entero
  transaccionCreadora: entero
  transaccionBorradora: entero = INFINITO
  valida: booleano = verdadero
}

función iniciarTransaccion() {
  transaccion = nueva Transaccion()
  transaccion.timestamp = obtenerTimestampActual()
  transaccion.snapshot = currentVersion
  
  retornar transaccion
}

función leer(transaccion, clave) {
  // Buscar versión visible para esta transacción
  versionVisible = null
  
  para cada version en versiones:
    si version.timestamp <= transaccion.snapshot:
      si version.transaccionBorradora > transaccion.snapshot:
        versionVisible = version
        break
  
  retornar versionVisible.datos
}

función escribir(transaccion, clave, valor) {
  mutex.lock()
  
  // Crear nueva versión
  nuevaVersion = Version()
  nuevaVersion.datos = valor
  nuevaVersion.timestamp = incrementar_atomico(currentVersion)
  nuevaVersion.transaccionCreadora = transaccion.id
  
  // Añadir a lista de versiones
  versiones.agregar(nuevaVersion)
  
  mutex.unlock()
}

función commit(transaccion) {
  // Validar que no hay conflictos
  si tieneConflictos(transaccion):
    abort(transaccion)
    retornar FALLO
  
  // Hacer visibles todas las escrituras
  para cada escritura en transaccion.escrituras:
    escritura.version.valida = verdadero
  
  retornar EXITO
}

función abort(transaccion) {
  // Marcar versiones como inválidas
  para cada escritura en transaccion.escrituras:
    escritura.version.transaccionBorradora = transaccion.timestamp
    escritura.version.valida = falso
}

// Garbage Collection de versiones antiguas
función limpiarVersionesAntiguas() {
  timestampMinimo = obtenerTimestampTransaccionActiva()
  
  para cada version en versiones:
    si version.transaccionBorradora < timestampMinimo:
      // Ninguna transacción activa puede ver esta versión
      versiones.remover(version)
      liberar(version.datos)
}

// Implementación simplificada estilo PostgreSQL
estructura MVCCPostgreSQL {
  tuplas: Mapa[Clave, Lista[Tupla]]
}

estructura Tupla {
  datos: Dato
  xmin: TransactionId  // Transacción que creó
  xmax: TransactionId  // Transacción que borró (0 si activa)
  commandId: entero
}

función tuplaVisible(tupla, snapshot) {
  // Visible si:
  // 1. Creada por transacción commited antes del snapshot
  // 2. No borrada, o borrada después del snapshot
  
  si tupla.xmin > snapshot.xmax:
    retornar falso  // Creada después
  
  si tupla.xmin en snapshot.activasEnCurso:
    retornar falso  // Creada por transacción aún activa
  
  si tupla.xmax == 0:
    retornar verdadero  // No borrada
  
  si tupla.xmax > snapshot.xmax:
    retornar verdadero  // Borrada después
  
  si tupla.xmax en snapshot.activasEnCurso:
    retornar verdadero  // Borrada por transacción aún activa
  
  retornar falso  // Borrada antes del snapshot
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-orange-900/30 border border-orange-700/50 rounded">
                      <p className="text-sm text-orange-200">
                        <span className="font-bold">Ventaja:</span> Lectores no bloquean escritores, snapshots consistentes.
                        <span className="font-bold"> Desventaja:</span> Overhead de versiones, garbage collection complejo.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="demostracion" className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <AccordionTrigger className="text-xl font-bold text-white hover:no-underline px-6">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5" />
                <span>Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="rwlock" className="px-6 pb-6">
                <TabsList className="grid grid-cols-7 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="rwlock">🔐 RWLock</TabsTrigger>
                  <TabsTrigger value="readers-pref">📖 Readers-Pref</TabsTrigger>
                  <TabsTrigger value="writers-pref">✍️ Writers-Pref</TabsTrigger>
                  <TabsTrigger value="fair">⚖️ Fair</TabsTrigger>
                  <TabsTrigger value="cow">📋 CoW</TabsTrigger>
                  <TabsTrigger value="rcu">🔄 RCU</TabsTrigger>
                  <TabsTrigger value="mvcc">📚 MVCC</TabsTrigger>
                </TabsList>

                {/* Demo 1: RWLock */}
                <TabsContent value="rwlock" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">🔐 Read-Write Locks (RWLock)</h3>
                    
                    {/* Panel de Control */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setRwlockRunning(!rwlockRunning)}
                            className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-colors ${
                              rwlockRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {rwlockRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button
                            onClick={resetRwlock}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-semibold transition-colors"
                          >
                            <RotateCcw className="size-4" /> Reset
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => addRwlockThread('reader')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                          >
                            + Lector
                          </button>
                          <button
                            onClick={() => addRwlockThread('writer')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
                          >
                            + Escritor
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm text-gray-300 mb-2 block">
                          Velocidad: {rwlockSpeed}ms
                        </label>
                        <Slider
                          value={[rwlockSpeed]}
                          onValueChange={(value) => setRwlockSpeed(value[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-blue-300 mb-3">📊 Estado del Lock</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Lectores activos:</span>
                            <span className="font-bold text-blue-400">{rwlockReaders}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Escritores activos:</span>
                            <span className="font-bold text-purple-400">{rwlockWriters}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>En espera:</span>
                            <span className="font-bold text-yellow-400">
                              {rwlockThreads.filter(t => t.state === 'waiting').length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-green-300 mb-3">🧵 Threads Activos</h4>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {rwlockThreads.map(thread => (
                            <div
                              key={thread.id}
                              className={`flex items-center gap-2 text-sm p-2 rounded ${
                                thread.state === 'reading' ? 'bg-blue-900/50' :
                                thread.state === 'writing' ? 'bg-purple-900/50' :
                                'bg-gray-700/50'
                              }`}
                            >
                              <span className={thread.type === 'reader' ? 'text-blue-400' : 'text-purple-400'}>
                                {thread.type === 'reader' ? '📖' : '✍️'}
                              </span>
                              <span className="flex-1">
                                {thread.type} {thread.id.toString().slice(-4)}
                              </span>
                              <span className={`text-xs ${
                                thread.state === 'reading' ? 'text-blue-300' :
                                thread.state === 'writing' ? 'text-purple-300' :
                                'text-yellow-300'
                              }`}>
                                {thread.state}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-bold text-gray-300 mb-3">📋 Registro de Eventos</h4>
                      <div
                        ref={rwlockLogRef}
                        className="bg-black rounded p-3 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                      >
                        {rwlockLogs.map((log, i) => (
                          <div key={i} className="mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Readers-Preference */}
                <TabsContent value="readers-pref" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-green-400 mb-4">📖 Readers-Preference</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setReadersRunning(!readersRunning)}
                            className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-colors ${
                              readersRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {readersRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button
                            onClick={resetReaders}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-semibold transition-colors"
                          >
                            <RotateCcw className="size-4" /> Reset
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => addReadersThread('reader')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                          >
                            + Lector
                          </button>
                          <button
                            onClick={() => addReadersThread('writer')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
                          >
                            + Escritor
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm text-gray-300 mb-2 block">
                          Velocidad: {readersSpeed}ms
                        </label>
                        <Slider
                          value={[readersSpeed]}
                          onValueChange={(value) => setReadersSpeed(value[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-green-300 mb-3">📊 Estado</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Lectores concurrentes:</span>
                            <span className="font-bold text-green-400">{readersActive}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Escritores esperando:</span>
                            <span className="font-bold text-red-400">
                              {readersThreads.filter(t => t.type === 'writer' && t.state === 'waiting').length}
                            </span>
                          </div>
                        </div>
                        {readersThreads.some(t => t.type === 'writer' && t.waitTime > 5) && (
                          <div className="mt-3 p-2 bg-red-900/30 border border-red-700/50 rounded">
                            <p className="text-red-300 text-sm">⚠️ STARVATION DETECTADA</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-blue-300 mb-3">🧵 Threads</h4>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {readersThreads.map(thread => (
                            <div
                              key={thread.id}
                              className={`flex items-center gap-2 text-sm p-2 rounded ${
                                thread.state === 'reading' ? 'bg-blue-900/50' :
                                thread.state === 'writing' ? 'bg-purple-900/50' :
                                thread.waitTime > 5 ? 'bg-red-900/50' : 'bg-gray-700/50'
                              }`}
                            >
                              <span>{thread.type === 'reader' ? '📖' : '✍️'}</span>
                              <span className="flex-1">{thread.type} {thread.id.toString().slice(-4)}</span>
                              {thread.state === 'waiting' && (
                                <span className="text-xs text-yellow-300">⏳ {thread.waitTime}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-bold text-gray-300 mb-3">📋 Registro de Eventos</h4>
                      <div
                        ref={readersLogRef}
                        className="bg-black rounded p-3 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                      >
                        {readersLogs.map((log, i) => (
                          <div key={i} className="mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Writers-Preference */}
                <TabsContent value="writers-pref" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">✍️ Writers-Preference</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setWritersRunning(!writersRunning)}
                            className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-colors ${
                              writersRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {writersRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button
                            onClick={resetWriters}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-semibold transition-colors"
                          >
                            <RotateCcw className="size-4" /> Reset
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => addWritersThread('reader')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                          >
                            + Lector
                          </button>
                          <button
                            onClick={() => addWritersThread('writer')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
                          >
                            + Escritor
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm text-gray-300 mb-2 block">
                          Velocidad: {writersSpeed}ms
                        </label>
                        <Slider
                          value={[writersSpeed]}
                          onValueChange={(value) => setWritersSpeed(value[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-purple-300 mb-3">📊 Estado</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Escritores esperando:</span>
                            <span className="font-bold text-purple-400">{writersWaiting}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Lectores bloqueados:</span>
                            <span className="font-bold text-red-400">
                              {writersThreads.filter(t => t.type === 'reader' && t.state === 'waiting').length}
                            </span>
                          </div>
                        </div>
                        {writersWaiting > 0 && (
                          <div className="mt-3 p-2 bg-purple-900/30 border border-purple-700/50 rounded">
                            <p className="text-purple-300 text-sm">🔒 Nuevos lectores bloqueados</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-blue-300 mb-3">🧵 Threads</h4>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {writersThreads.map(thread => (
                            <div
                              key={thread.id}
                              className={`flex items-center gap-2 text-sm p-2 rounded ${
                                thread.state === 'reading' ? 'bg-blue-900/50' :
                                thread.state === 'writing' ? 'bg-purple-900/50' :
                                'bg-gray-700/50'
                              }`}
                            >
                              <span>{thread.type === 'reader' ? '📖' : '✍️'}</span>
                              <span className="flex-1">{thread.type} {thread.id.toString().slice(-4)}</span>
                              {thread.state === 'waiting' && thread.waitTime > 4 && (
                                <span className="text-xs text-red-300">⚠️ {thread.waitTime}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-bold text-gray-300 mb-3">📋 Registro de Eventos</h4>
                      <div
                        ref={writersLogRef}
                        className="bg-black rounded p-3 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                      >
                        {writersLogs.map((log, i) => (
                          <div key={i} className="mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Fair Policy */}
                <TabsContent value="fair" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">⚖️ Fair Policy (FIFO)</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setFairRunning(!fairRunning)}
                            className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-colors ${
                              fairRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {fairRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button
                            onClick={resetFair}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-semibold transition-colors"
                          >
                            <RotateCcw className="size-4" /> Reset
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => addFairThread('reader')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                          >
                            + Lector
                          </button>
                          <button
                            onClick={() => addFairThread('writer')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
                          >
                            + Escritor
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm text-gray-300 mb-2 block">
                          Velocidad: {fairSpeed}ms
                        </label>
                        <Slider
                          value={[fairSpeed]}
                          onValueChange={(value) => setFairSpeed(value[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-yellow-300 mb-3">📋 Cola FIFO</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {fairQueue.map((thread, index) => (
                            <div
                              key={thread.id}
                              className="flex items-center gap-2 text-sm p-2 rounded bg-gray-700"
                            >
                              <span className="text-yellow-400 font-bold">{index + 1}.</span>
                              <span>{thread.type === 'reader' ? '📖' : '✍️'}</span>
                              <span className="flex-1">{thread.type} {thread.id.toString().slice(-4)}</span>
                              {index === 0 && (
                                <span className="text-xs text-green-300 animate-pulse">▶️ Siguiente</span>
                              )}
                            </div>
                          ))}
                          {fairQueue.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">Cola vacía</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-green-300 mb-3">🧵 Threads Activos</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {fairThreads.filter(t => t.state !== 'waiting').map(thread => (
                            <div
                              key={thread.id}
                              className={`flex items-center gap-2 text-sm p-2 rounded ${
                                thread.state === 'reading' ? 'bg-blue-900/50' :
                                thread.state === 'writing' ? 'bg-purple-900/50' :
                                'bg-gray-700/50'
                              }`}
                            >
                              <span>{thread.type === 'reader' ? '📖' : '✍️'}</span>
                              <span className="flex-1">{thread.type} {thread.id.toString().slice(-4)}</span>
                              <span className="text-xs text-green-300">{thread.state}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-bold text-gray-300 mb-3">📋 Registro de Eventos</h4>
                      <div
                        ref={fairLogRef}
                        className="bg-black rounded p-3 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                      >
                        {fairLogs.map((log, i) => (
                          <div key={i} className="mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: Copy-on-Write */}
                <TabsContent value="cow" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">📋 Copy-on-Write (CoW)</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setCowRunning(!cowRunning)}
                            className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-colors ${
                              cowRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {cowRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button
                            onClick={resetCow}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-semibold transition-colors"
                          >
                            <RotateCcw className="size-4" /> Reset
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => addCowThread('reader')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                          >
                            + Lector
                          </button>
                          <button
                            onClick={() => addCowThread('writer')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
                          >
                            + Escritor
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm text-gray-300 mb-2 block">
                          Velocidad: {cowSpeed}ms
                        </label>
                        <Slider
                          value={[cowSpeed]}
                          onValueChange={(value) => setCowSpeed(value[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-cyan-300 mb-3">📦 Versiones</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Versión actual:</span>
                            <span className="font-bold text-cyan-400">v{cowCurrentVersion}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Total versiones:</span>
                            <span className="font-bold text-blue-400">{cowVersions.length}</span>
                          </div>
                          <div className="mt-3 p-2 bg-cyan-900/30 border border-cyan-700/50 rounded">
                            <p className="text-cyan-200 text-sm">🔓 Lectores lock-free</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {cowVersions.map(v => (
                            <span
                              key={v}
                              className={`px-2 py-1 rounded text-xs ${
                                v === cowCurrentVersion ? 'bg-cyan-600' : 'bg-gray-600'
                              }`}
                            >
                              v{v}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-blue-300 mb-3">🧵 Threads</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {cowThreads.map(thread => (
                            <div
                              key={thread.id}
                              className={`flex items-center gap-2 text-sm p-2 rounded ${
                                thread.state === 'reading' ? 'bg-blue-900/50' :
                                thread.state === 'writing' ? 'bg-purple-900/50' :
                                'bg-gray-700/50'
                              }`}
                            >
                              <span>{thread.type === 'reader' ? '📖' : '✍️'}</span>
                              <span className="flex-1">{thread.type} {thread.id.toString().slice(-4)}</span>
                              {thread.version && (
                                <span className="text-xs text-cyan-300">v{thread.version}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-bold text-gray-300 mb-3">📋 Registro de Eventos</h4>
                      <div
                        ref={cowLogRef}
                        className="bg-black rounded p-3 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                      >
                        {cowLogs.map((log, i) => (
                          <div key={i} className="mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 6: RCU */}
                <TabsContent value="rcu" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">🔄 RCU (Read-Copy-Update)</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setRcuRunning(!rcuRunning)}
                            className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-colors ${
                              rcuRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {rcuRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button
                            onClick={resetRcu}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-semibold transition-colors"
                          >
                            <RotateCcw className="size-4" /> Reset
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => addRcuThread('reader')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                          >
                            + Lector
                          </button>
                          <button
                            onClick={() => addRcuThread('writer')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
                          >
                            + Escritor
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm text-gray-300 mb-2 block">
                          Velocidad: {rcuSpeed}ms
                        </label>
                        <Slider
                          value={[rcuSpeed]}
                          onValueChange={(value) => setRcuSpeed(value[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-pink-300 mb-3">⏳ Grace Period</h4>
                        <div className="space-y-3">
                          <div className={`p-3 rounded ${
                            rcuGracePeriod ? 'bg-yellow-900/50 border border-yellow-700/50' : 'bg-green-900/50 border border-green-700/50'
                          }`}>
                            <p className="font-bold text-center">
                              {rcuGracePeriod ? '🟡 En Grace Period' : '🟢 Inactivo'}
                            </p>
                          </div>
                          {rcuOldVersion && (
                            <div className="p-2 bg-red-900/30 border border-red-700/50 rounded">
                              <p className="text-red-200 text-sm">
                                ♻️ Versión {rcuOldVersion} esperando liberación
                              </p>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span>Lectores activos:</span>
                            <span className="font-bold text-blue-400">
                              {rcuThreads.filter(t => t.state === 'reading').length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-blue-300 mb-3">🧵 Threads</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {rcuThreads.map(thread => (
                            <div
                              key={thread.id}
                              className={`flex items-center gap-2 text-sm p-2 rounded ${
                                thread.state === 'reading' ? 'bg-blue-900/50' :
                                thread.state === 'writing' ? 'bg-purple-900/50' :
                                'bg-gray-700/50'
                              }`}
                            >
                              <span>{thread.type === 'reader' ? '📖' : '✍️'}</span>
                              <span className="flex-1">{thread.type} {thread.id.toString().slice(-4)}</span>
                              <span className="text-xs text-green-300">{thread.state}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-bold text-gray-300 mb-3">📋 Registro de Eventos</h4>
                      <div
                        ref={rcuLogRef}
                        className="bg-black rounded p-3 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                      >
                        {rcuLogs.map((log, i) => (
                          <div key={i} className="mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 7: MVCC */}
                <TabsContent value="mvcc" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-orange-400 mb-4">📚 MVCC (Multi-Version Concurrency Control)</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setMvccRunning(!mvccRunning)}
                            className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-colors ${
                              mvccRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {mvccRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button
                            onClick={resetMvcc}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 font-semibold transition-colors"
                          >
                            <RotateCcw className="size-4" /> Reset
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => addMvccThread('reader')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                          >
                            + Lector
                          </button>
                          <button
                            onClick={() => addMvccThread('writer')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
                          >
                            + Escritor
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm text-gray-300 mb-2 block">
                          Velocidad: {mvccSpeed}ms
                        </label>
                        <Slider
                          value={[mvccSpeed]}
                          onValueChange={(value) => setMvccSpeed(value[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-orange-300 mb-3">📚 Timeline de Versiones</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {mvccVersions.map((version, index) => (
                            <div
                              key={version.id}
                              className={`p-2 rounded ${
                                index === mvccVersions.length - 1 ? 'bg-orange-900/50 border border-orange-700/50' : 'bg-gray-700'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-orange-400">v{version.id}</span>
                                <span className="text-xs text-gray-400">ts: {version.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-300">{version.data}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-bold text-blue-300 mb-3">🧵 Transacciones</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {mvccThreads.map(thread => (
                            <div
                              key={thread.id}
                              className={`flex items-center gap-2 text-sm p-2 rounded ${
                                thread.state === 'reading' ? 'bg-blue-900/50' :
                                thread.state === 'writing' ? 'bg-purple-900/50' :
                                'bg-gray-700/50'
                              }`}
                            >
                              <span>{thread.type === 'reader' ? '📖' : '✍️'}</span>
                              <span className="flex-1">{thread.type} {thread.id.toString().slice(-4)}</span>
                              <span className="text-xs text-green-300">{thread.state}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-bold text-gray-300 mb-3">📋 Registro de Eventos</h4>
                      <div
                        ref={mvccLogRef}
                        className="bg-black rounded p-3 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                      >
                        {mvccLogs.map((log, i) => (
                          <div key={i} className="mb-1">{log}</div>
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
