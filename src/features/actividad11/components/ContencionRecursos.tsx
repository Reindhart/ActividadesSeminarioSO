import { BookOpen, Code, Zap, Play, Pause, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";

interface Operation {
  id: number;
  type: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'read' | 'write' | 'increment' | 'update' | 'insert' | 'batch';
  threadId: number;
  status: 'pending' | 'executing' | 'success' | 'retry' | 'conflict';
  value?: number;
  attempts?: number;
  timestamp?: number;
}

interface Thread {
  id: number;
  status: 'idle' | 'working' | 'waiting' | 'success' | 'retry';
  partition?: number;
  localValue?: number;
  version?: number;
  batchSize?: number;
}

export default function ContencionRecursos() {
  // Estados para Lock-free Demo
  const [lockfreeOps, setLockfreeOps] = useState<Operation[]>([]);
  const [lockfreeRunning, setLockfreeRunning] = useState(false);
  const [lockfreeTime, setLockfreeTime] = useState(0);
  const [lockfreeSpeed, setLockfreeSpeed] = useState(500);
  const [lockfreeStack, setLockfreeStack] = useState<number[]>([]);
  const [lockfreeLogs, setLockfreeLogs] = useState<string[]>(['Simulación Lock-free iniciada. Usando operaciones CAS.']);
  const lockfreeLogRef = useRef<HTMLDivElement>(null);

  // Estados para Particionamiento Demo
  const [partThreads, setPartThreads] = useState<Thread[]>([
    { id: 1, status: 'idle', partition: 0 },
    { id: 2, status: 'idle', partition: 1 },
    { id: 3, status: 'idle', partition: 2 },
    { id: 4, status: 'idle', partition: 3 },
  ]);
  const [partRunning, setPartRunning] = useState(false);
  const [partTime, setPartTime] = useState(0);
  const [partSpeed, setPartSpeed] = useState(500);
  const [partData, setPartData] = useState<Map<number, number[]>>(new Map([
    [0, []], [1, []], [2, []], [3, []]
  ]));
  const [partLogs, setPartLogs] = useState<string[]>(['Simulación de Particionamiento iniciada. 4 particiones independientes.']);
  const partLogRef = useRef<HTMLDivElement>(null);

  // Estados para Lock Striping Demo
  const [stripeThreads, setStripeThreads] = useState<Thread[]>([
    { id: 1, status: 'idle', partition: 0 },
    { id: 2, status: 'idle', partition: 1 },
    { id: 3, status: 'idle', partition: 2 },
    { id: 4, status: 'idle', partition: 0 },
  ]);
  const [stripeRunning, setStripeRunning] = useState(false);
  const [stripeTime, setStripeTime] = useState(0);
  const [stripeSpeed, setStripeSpeed] = useState(500);
  const [stripeLocks, setStripeLocks] = useState<boolean[]>([false, false, false, false]);
  const [stripeLogs, setStripeLogs] = useState<string[]>(['Simulación Lock Striping iniciada. 4 stripes con locks independientes.']);
  const stripeLogRef = useRef<HTMLDivElement>(null);

  // Estados para Thread-local Demo
  const [tlsThreads, setTlsThreads] = useState<Thread[]>([
    { id: 1, status: 'idle', localValue: 0 },
    { id: 2, status: 'idle', localValue: 0 },
    { id: 3, status: 'idle', localValue: 0 },
    { id: 4, status: 'idle', localValue: 0 },
  ]);
  const [tlsRunning, setTlsRunning] = useState(false);
  const [tlsTime, setTlsTime] = useState(0);
  const [tlsSpeed, setTlsSpeed] = useState(500);
  const [tlsGlobalValue, setTlsGlobalValue] = useState(0);
  const [tlsLogs, setTlsLogs] = useState<string[]>(['Simulación Thread-local iniciada. Cada thread tiene su contador local.']);
  const tlsLogRef = useRef<HTMLDivElement>(null);

  // Estados para Optimistic Demo
  const [optThreads, setOptThreads] = useState<Thread[]>([
    { id: 1, status: 'idle', version: 0 },
    { id: 2, status: 'idle', version: 0 },
    { id: 3, status: 'idle', version: 0 },
    { id: 4, status: 'idle', version: 0 },
  ]);
  const [optRunning, setOptRunning] = useState(false);
  const [optTime, setOptTime] = useState(0);
  const [optSpeed, setOptSpeed] = useState(500);
  const [optValue, setOptValue] = useState(100);
  const [optVersion, setOptVersion] = useState(0);
  const [optConflicts, setOptConflicts] = useState(0);
  const [optLogs, setOptLogs] = useState<string[]>(['Simulación OCC iniciada. Validación optimista con versionado.']);
  const optLogRef = useRef<HTMLDivElement>(null);

  // Estados para Batching Demo
  const [batchThreads, setBatchThreads] = useState<Thread[]>([
    { id: 1, status: 'idle', batchSize: 0 },
    { id: 2, status: 'idle', batchSize: 0 },
    { id: 3, status: 'idle', batchSize: 0 },
    { id: 4, status: 'idle', batchSize: 0 },
  ]);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchTime, setBatchTime] = useState(0);
  const [batchSpeed, setBatchSpeed] = useState(500);
  const [batchQueue, setBatchQueue] = useState<number[]>([]);
  const [batchProcessed, setBatchProcessed] = useState(0);
  const [batchLogs, setBatchLogs] = useState<string[]>(['Simulación Batching iniciada. Agrupa operaciones en lotes.']);
  const batchLogRef = useRef<HTMLDivElement>(null);

  // Estados para Granularidad Demo
  const [granThreads, setGranThreads] = useState<Thread[]>([
    { id: 1, status: 'idle', partition: 0 },
    { id: 2, status: 'idle', partition: 1 },
    { id: 3, status: 'idle', partition: 2 },
    { id: 4, status: 'idle', partition: 3 },
  ]);
  const [granRunning, setGranRunning] = useState(false);
  const [granTime, setGranTime] = useState(0);
  const [granSpeed, setGranSpeed] = useState(500);
  const [granLocks, setGranLocks] = useState<boolean[]>([false, false, false, false]);
  const [granAccessMode, setGranAccessMode] = useState<('read' | 'write')[]>(['read', 'read', 'read', 'read']);
  const [granLogs, setGranLogs] = useState<string[]>(['Simulación Fine-grained Locks iniciada. Locks por nodo.']);
  const granLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    if (lockfreeLogRef.current) {
      lockfreeLogRef.current.scrollTop = lockfreeLogRef.current.scrollHeight;
    }
  }, [lockfreeLogs]);

  useEffect(() => {
    if (partLogRef.current) {
      partLogRef.current.scrollTop = partLogRef.current.scrollHeight;
    }
  }, [partLogs]);

  useEffect(() => {
    if (stripeLogRef.current) {
      stripeLogRef.current.scrollTop = stripeLogRef.current.scrollHeight;
    }
  }, [stripeLogs]);

  useEffect(() => {
    if (tlsLogRef.current) {
      tlsLogRef.current.scrollTop = tlsLogRef.current.scrollHeight;
    }
  }, [tlsLogs]);

  useEffect(() => {
    if (optLogRef.current) {
      optLogRef.current.scrollTop = optLogRef.current.scrollHeight;
    }
  }, [optLogs]);

  useEffect(() => {
    if (batchLogRef.current) {
      batchLogRef.current.scrollTop = batchLogRef.current.scrollHeight;
    }
  }, [batchLogs]);

  useEffect(() => {
    if (granLogRef.current) {
      granLogRef.current.scrollTop = granLogRef.current.scrollHeight;
    }
  }, [granLogs]);

  // Simulación Lock-free
  useEffect(() => {
    if (!lockfreeRunning) return;

    const interval = setInterval(() => {
      setLockfreeTime(prev => prev + 1);

      // Generar nueva operación aleatoria
      if (Math.random() < 0.7) {
        const threadId = Math.floor(Math.random() * 4) + 1;
        const opType = Math.random() < 0.5 ? 'push' : 'pop';
        const value = opType === 'push' ? Math.floor(Math.random() * 100) : undefined;

        const newOp: Operation = {
          id: Date.now() + Math.random(),
          type: opType,
          threadId,
          status: 'pending',
          value,
          attempts: 0,
        };

        setLockfreeOps(prev => [...prev.slice(-6), newOp]);

        // Simular CAS con posibles reintentos
        const casSuccess = Math.random() < 0.85;

        if (casSuccess) {
          setTimeout(() => {
            setLockfreeOps(prev => 
              prev.map(op => op.id === newOp.id ? { ...op, status: 'success' as const } : op)
            );

            if (opType === 'push' && value !== undefined) {
              setLockfreeStack(prev => [...prev, value].slice(-8));
              setLockfreeLogs(prev => [...prev.slice(-9), `T${threadId}: PUSH(${value}) exitoso - CAS success`]);
            } else if (opType === 'pop') {
              setLockfreeStack(prev => {
                if (prev.length > 0) {
                  const popped = prev[prev.length - 1];
                  setLockfreeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId}: POP() = ${popped} - CAS success`]);
                  return prev.slice(0, -1);
                }
                setLockfreeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId}: POP() = null (stack vacío)`]);
                return prev;
              });
            }
          }, lockfreeSpeed / 2);
        } else {
          // CAS falló, reintentar
          setTimeout(() => {
            setLockfreeOps(prev =>
              prev.map(op => op.id === newOp.id ? { ...op, status: 'retry' as const, attempts: (op.attempts || 0) + 1 } : op)
            );
            setLockfreeLogs(prev => [...prev.slice(-9), `T${threadId}: CAS falló, reintentando ${opType.toUpperCase()}...`]);

            // Segundo intento (exitoso)
            setTimeout(() => {
              setLockfreeOps(prev =>
                prev.map(op => op.id === newOp.id ? { ...op, status: 'success' as const } : op)
              );

              if (opType === 'push' && value !== undefined) {
                setLockfreeStack(prev => [...prev, value].slice(-8));
                setLockfreeLogs(prev => [...prev.slice(-9), `T${threadId}: PUSH(${value}) exitoso tras reintento`]);
              } else if (opType === 'pop') {
                setLockfreeStack(prev => {
                  if (prev.length > 0) {
                    const popped = prev[prev.length - 1];
                    setLockfreeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId}: POP() = ${popped} tras reintento`]);
                    return prev.slice(0, -1);
                  }
                  return prev;
                });
              }
            }, lockfreeSpeed / 2);
          }, lockfreeSpeed / 3);
        }
      }
    }, lockfreeSpeed);

    return () => clearInterval(interval);
  }, [lockfreeRunning, lockfreeSpeed]);

  // Simulación Particionamiento
  useEffect(() => {
    if (!partRunning) return;

    const interval = setInterval(() => {
      setPartTime(prev => prev + 1);

      const threadId = Math.floor(Math.random() * 4);
      const partition = partThreads[threadId].partition!;
      const value = Math.floor(Math.random() * 100);

      setPartThreads(prev =>
        prev.map((t, idx) => idx === threadId ? { ...t, status: 'working' as const } : t)
      );

      setPartLogs(prev => [...prev.slice(-9), `T${threadId + 1}: Escribiendo ${value} en Partición ${partition}`]);

      setTimeout(() => {
        setPartData(prev => {
          const newData = new Map(prev);
          const partData = newData.get(partition) || [];
          newData.set(partition, [...partData, value].slice(-5));
          return newData;
        });

        setPartThreads(prev =>
          prev.map((t, idx) => idx === threadId ? { ...t, status: 'success' as const } : t)
        );

        setPartLogs(prev => [...prev.slice(-9), `T${threadId + 1}: Escritura exitosa (sin contención)`]);

        setTimeout(() => {
          setPartThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const } : t)
          );
        }, partSpeed / 3);
      }, partSpeed / 2);
    }, partSpeed);

    return () => clearInterval(interval);
  }, [partRunning, partSpeed, partThreads]);

  // Simulación Lock Striping
  useEffect(() => {
    if (!stripeRunning) return;

    const interval = setInterval(() => {
      setStripeTime(prev => prev + 1);

      const threadId = Math.floor(Math.random() * 4);
      const stripe = stripeThreads[threadId].partition!;

      // Verificar si el stripe está bloqueado
      setStripeLocks(prev => {
        if (prev[stripe]) {
          setStripeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Esperando lock del Stripe ${stripe}...`]);
          setStripeThreads(prevThreads =>
            prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'waiting' as const } : t)
          );
          return prev;
        }

        // Adquirir lock
        const newLocks = [...prev];
        newLocks[stripe] = true;
        
        setStripeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock adquirido en Stripe ${stripe}`]);
        setStripeThreads(prevThreads =>
          prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'working' as const } : t)
        );

        // Liberar lock después de trabajar
        setTimeout(() => {
          setStripeLocks(prevLocks => {
            const releasedLocks = [...prevLocks];
            releasedLocks[stripe] = false;
            return releasedLocks;
          });

          setStripeLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock liberado del Stripe ${stripe}`]);
          setStripeThreads(prevThreads =>
            prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'success' as const } : t)
          );

          setTimeout(() => {
            setStripeThreads(prevThreads =>
              prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const } : t)
            );
          }, stripeSpeed / 3);
        }, stripeSpeed / 2);

        return newLocks;
      });
    }, stripeSpeed);

    return () => clearInterval(interval);
  }, [stripeRunning, stripeSpeed, stripeThreads]);

  // Simulación Thread-local Storage
  useEffect(() => {
    if (!tlsRunning) return;

    const interval = setInterval(() => {
      setTlsTime(prev => prev + 1);

      const threadId = Math.floor(Math.random() * 4);
      
      setTlsThreads(prev =>
        prev.map((t, idx) => {
          if (idx === threadId) {
            const newValue = (t.localValue || 0) + 1;
            setTlsLogs(prevLogs => [...prevLogs.slice(-9), `T${idx + 1}: Incremento local ${t.localValue} → ${newValue} (sin contención)`]);
            return { ...t, status: 'working' as const, localValue: newValue };
          }
          return t;
        })
      );

      setTimeout(() => {
        setTlsThreads(prev =>
          prev.map((t, idx) => idx === threadId ? { ...t, status: 'success' as const } : t)
        );

        setTimeout(() => {
          setTlsThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const } : t)
          );
        }, tlsSpeed / 3);
      }, tlsSpeed / 2);
    }, tlsSpeed);

    return () => clearInterval(interval);
  }, [tlsRunning, tlsSpeed]);

  // Actualizar valor global agregando locales
  useEffect(() => {
    if (tlsRunning && tlsTime % 3 === 0) {
      const total = tlsThreads.reduce((sum, t) => sum + (t.localValue || 0), 0);
      setTlsGlobalValue(total);
    }
  }, [tlsTime, tlsRunning, tlsThreads]);

  // Simulación Optimistic Concurrency Control
  useEffect(() => {
    if (!optRunning) return;

    const interval = setInterval(() => {
      setOptTime(prev => prev + 1);

      const threadId = Math.floor(Math.random() * 4);
      const delta = Math.floor(Math.random() * 10) + 1;

      // Leer valor y versión
      const readVersion = optVersion;
      
      setOptThreads(prev =>
        prev.map((t, idx) => idx === threadId ? { ...t, status: 'working' as const, version: readVersion } : t)
      );

      setOptLogs(prev => [...prev.slice(-9), `T${threadId + 1}: Leyó valor=${optValue} (v${readVersion}), calculando +${delta}...`]);

      setTimeout(() => {
        // Intentar commit (validar versión)
        const currentVersion = optVersion;
        
        if (readVersion === currentVersion) {
          // Validación exitosa
          setOptValue(prev => prev + delta);
          setOptVersion(prev => prev + 1);
          
          setOptThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'success' as const } : t)
          );

          setOptLogs(prev => [...prev.slice(-9), `T${threadId + 1}: Commit exitoso! ${optValue} → ${optValue + delta} (v${currentVersion + 1})`]);
        } else {
          // Conflicto detectado
          setOptConflicts(prev => prev + 1);
          
          setOptThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'retry' as const } : t)
          );

          setOptLogs(prev => [...prev.slice(-9), `T${threadId + 1}: ⚠️ CONFLICTO! Versión cambió (v${readVersion}→v${currentVersion}), reintentando...`]);
        }

        setTimeout(() => {
          setOptThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const } : t)
          );
        }, optSpeed / 3);
      }, optSpeed / 2);
    }, optSpeed);

    return () => clearInterval(interval);
  }, [optRunning, optSpeed, optVersion, optValue]);

  // Simulación Batching
  useEffect(() => {
    if (!batchRunning) return;

    const interval = setInterval(() => {
      setBatchTime(prev => prev + 1);

      // Threads agregan a sus buffers locales
      const threadId = Math.floor(Math.random() * 4);
      const value = Math.floor(Math.random() * 100);

      setBatchThreads(prev =>
        prev.map((t, idx) => {
          if (idx === threadId) {
            const newSize = (t.batchSize || 0) + 1;
            return { ...t, status: 'working' as const, batchSize: newSize };
          }
          return t;
        })
      );

      setBatchQueue(prev => [...prev, value]);
      setBatchLogs(prev => [...prev.slice(-9), `T${threadId + 1}: Agregó ${value} al buffer local (tamaño: ${(batchThreads[threadId].batchSize || 0) + 1})`]);

      // Si algún buffer alcanza el tamaño de lote, procesar
      if ((batchThreads[threadId].batchSize || 0) >= 2) {
        setTimeout(() => {
          setBatchQueue(prev => {
            const batch = prev.slice(-5);
            setBatchLogs(prevLogs => [...prevLogs.slice(-9), `📦 Procesando LOTE de ${batch.length} operaciones: [${batch.join(', ')}]`]);
            setBatchProcessed(prevProcessed => prevProcessed + batch.length);
            return [];
          });

          setBatchThreads(prev =>
            prev.map(t => ({ ...t, batchSize: 0, status: 'success' as const }))
          );

          setTimeout(() => {
            setBatchThreads(prev =>
              prev.map(t => ({ ...t, status: 'idle' as const }))
            );
          }, batchSpeed / 3);
        }, batchSpeed / 2);
      } else {
        setTimeout(() => {
          setBatchThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const } : t)
          );
        }, batchSpeed / 3);
      }
    }, batchSpeed);

    return () => clearInterval(interval);
  }, [batchRunning, batchSpeed, batchThreads]);

  // Simulación Fine-grained Locks
  useEffect(() => {
    if (!granRunning) return;

    const interval = setInterval(() => {
      setGranTime(prev => prev + 1);

      const threadId = Math.floor(Math.random() * 4);
      const node = granThreads[threadId].partition!;
      const accessType = Math.random() < 0.7 ? 'read' : 'write';

      if (accessType === 'read') {
        // Múltiples readers pueden acceder
        setGranAccessMode(prev => {
          const newMode = [...prev];
          newMode[node] = 'read';
          return newMode;
        });

        setGranThreads(prev =>
          prev.map((t, idx) => idx === threadId ? { ...t, status: 'working' as const } : t)
        );

        setGranLogs(prev => [...prev.slice(-9), `T${threadId + 1}: Leyendo Nodo ${node} (lectura concurrente permitida)`]);

        setTimeout(() => {
          setGranThreads(prev =>
            prev.map((t, idx) => idx === threadId ? { ...t, status: 'success' as const } : t)
          );

          setTimeout(() => {
            setGranThreads(prev =>
              prev.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const } : t)
            );
          }, granSpeed / 3);
        }, granSpeed / 2);
      } else {
        // Escritura requiere lock exclusivo
        setGranLocks(prev => {
          if (prev[node]) {
            setGranLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Esperando lock exclusivo del Nodo ${node}...`]);
            setGranThreads(prevThreads =>
              prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'waiting' as const } : t)
            );
            return prev;
          }

          const newLocks = [...prev];
          newLocks[node] = true;

          setGranAccessMode(prevMode => {
            const newMode = [...prevMode];
            newMode[node] = 'write';
            return newMode;
          });

          setGranLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock exclusivo adquirido en Nodo ${node} (escritura)`]);
          setGranThreads(prevThreads =>
            prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'working' as const } : t)
          );

          setTimeout(() => {
            setGranLocks(prevLocks => {
              const releasedLocks = [...prevLocks];
              releasedLocks[node] = false;
              return releasedLocks;
            });

            setGranLogs(prevLogs => [...prevLogs.slice(-9), `T${threadId + 1}: Lock liberado del Nodo ${node}`]);
            setGranThreads(prevThreads =>
              prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'success' as const } : t)
            );

            setTimeout(() => {
              setGranThreads(prevThreads =>
                prevThreads.map((t, idx) => idx === threadId ? { ...t, status: 'idle' as const } : t)
              );
            }, granSpeed / 3);
          }, granSpeed / 2);

          return newLocks;
        });
      }
    }, granSpeed);

    return () => clearInterval(interval);
  }, [granRunning, granSpeed, granThreads]);

  // Funciones de control
  const resetLockfree = () => {
    setLockfreeRunning(false);
    setLockfreeTime(0);
    setLockfreeOps([]);
    setLockfreeStack([]);
    setLockfreeLogs(['Simulación Lock-free reiniciada.']);
  };

  const resetPartitioning = () => {
    setPartRunning(false);
    setPartTime(0);
    setPartThreads(prev => prev.map(t => ({ ...t, status: 'idle' as const })));
    setPartData(new Map([[0, []], [1, []], [2, []], [3, []]]));
    setPartLogs(['Simulación de Particionamiento reiniciada.']);
  };

  const resetStriping = () => {
    setStripeRunning(false);
    setStripeTime(0);
    setStripeThreads(prev => prev.map(t => ({ ...t, status: 'idle' as const })));
    setStripeLocks([false, false, false, false]);
    setStripeLogs(['Simulación Lock Striping reiniciada.']);
  };

  const resetTLS = () => {
    setTlsRunning(false);
    setTlsTime(0);
    setTlsThreads([
      { id: 1, status: 'idle', localValue: 0 },
      { id: 2, status: 'idle', localValue: 0 },
      { id: 3, status: 'idle', localValue: 0 },
      { id: 4, status: 'idle', localValue: 0 },
    ]);
    setTlsGlobalValue(0);
    setTlsLogs(['Simulación Thread-local reiniciada.']);
  };

  const resetOptimistic = () => {
    setOptRunning(false);
    setOptTime(0);
    setOptThreads(prev => prev.map(t => ({ ...t, status: 'idle' as const, version: 0 })));
    setOptValue(100);
    setOptVersion(0);
    setOptConflicts(0);
    setOptLogs(['Simulación OCC reiniciada.']);
  };

  const resetBatching = () => {
    setBatchRunning(false);
    setBatchTime(0);
    setBatchThreads([
      { id: 1, status: 'idle', batchSize: 0 },
      { id: 2, status: 'idle', batchSize: 0 },
      { id: 3, status: 'idle', batchSize: 0 },
      { id: 4, status: 'idle', batchSize: 0 },
    ]);
    setBatchQueue([]);
    setBatchProcessed(0);
    setBatchLogs(['Simulación Batching reiniciada.']);
  };

  const resetGranularity = () => {
    setGranRunning(false);
    setGranTime(0);
    setGranThreads(prev => prev.map(t => ({ ...t, status: 'idle' as const })));
    setGranLocks([false, false, false, false]);
    setGranAccessMode(['read', 'read', 'read', 'read']);
    setGranLogs(['Simulación Fine-grained Locks reiniciada.']);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Zap className="size-12 text-orange-500" />
            <h1 className="text-4xl font-bold text-white">⚡ Contención de Recursos</h1>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            La <span className="font-bold text-orange-400">Contención de Recursos</span> ocurre cuando múltiples
            threads o procesos compiten por el mismo recurso compartido, causando degradación del rendimiento
            debido a la espera y sincronización excesiva. Este problema es crítico en sistemas de alta concurrencia.
          </p>
          <div className="mt-4 p-4 bg-orange-900/30 border border-orange-700/50 rounded-lg">
            <p className="text-orange-200">
              <span className="font-bold">Impacto:</span> La contención puede causar hasta un 90% de degradación
              del rendimiento en sistemas con muchos cores, convirtiendo locks en cuellos de botella críticos.
              Las soluciones se enfocan en reducir o eliminar la necesidad de sincronización tradicional.
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
              <Tabs defaultValue="lockfree" className="px-6 pb-6">
                <TabsList className="grid grid-cols-7 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="lockfree">🔓 Lock-free</TabsTrigger>
                  <TabsTrigger value="partitioning">🧩 Particionamiento</TabsTrigger>
                  <TabsTrigger value="striping">🎨 Striping</TabsTrigger>
                  <TabsTrigger value="threadlocal">🧵 Thread-local</TabsTrigger>
                  <TabsTrigger value="optimistic">✨ Optimistic</TabsTrigger>
                  <TabsTrigger value="batching">📦 Batching</TabsTrigger>
                  <TabsTrigger value="granularity">🔬 Granularidad</TabsTrigger>
                </TabsList>

                {/* Solución 1: Lock-free Data Structures */}
                <TabsContent value="lockfree" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-blue-400 mb-4">🔓 Lock-free Data Structures</h3>
                    <p className="text-gray-300 mb-4">
                      Estructuras de datos que garantizan progreso del sistema sin usar locks, mediante
                      operaciones atómicas como CAS (Compare-And-Swap).
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Lock-free Stack (Treiber Stack)
estructura Node<T> {
  valor: T
  siguiente: AtomicReference<Node<T>>
}

estructura LockFreeStack<T> {
  cabeza: AtomicReference<Node<T>> = null
}

función push(stack: LockFreeStack<T>, valor: T) {
  nuevoNodo = new Node(valor)
  
  loop:
    cabezaActual = cargar_atomico(stack.cabeza)
    nuevoNodo.siguiente = cabezaActual
    
    // Intenta actualizar cabeza atómicamente
    si compare_and_swap(stack.cabeza, cabezaActual, nuevoNodo):
      retornar  // Éxito
    // Si falla, otro thread modificó la cabeza, reintentar
}

función pop(stack: LockFreeStack<T>): T | null {
  loop:
    cabezaActual = cargar_atomico(stack.cabeza)
    
    si cabezaActual == null:
      retornar null
    
    siguiente = cabezaActual.siguiente
    
    // Intenta mover cabeza al siguiente nodo
    si compare_and_swap(stack.cabeza, cabezaActual, siguiente):
      retornar cabezaActual.valor
    // Reintentar si falló
}

// Lock-free Queue (Michael-Scott Queue)
estructura LockFreeQueue<T> {
  cabeza: AtomicReference<Node<T>>
  cola: AtomicReference<Node<T>>
}

función inicializarQueue() -> LockFreeQueue<T> {
  nodoSentinel = new Node(null)
  queue = new LockFreeQueue()
  queue.cabeza = nodoSentinel
  queue.cola = nodoSentinel
  retornar queue
}

función enqueue(queue: LockFreeQueue<T>, valor: T) {
  nuevoNodo = new Node(valor)
  nuevoNodo.siguiente = null
  
  loop:
    colaActual = cargar_atomico(queue.cola)
    siguienteActual = cargar_atomico(colaActual.siguiente)
    
    si colaActual == cargar_atomico(queue.cola):
      si siguienteActual == null:
        // Intenta enlazar nuevo nodo
        si compare_and_swap(colaActual.siguiente, null, nuevoNodo):
          // Intenta mover cola
          compare_and_swap(queue.cola, colaActual, nuevoNodo)
          retornar
      sino:
        // Ayudar a otro thread
        compare_and_swap(queue.cola, colaActual, siguienteActual)
}

función dequeue(queue: LockFreeQueue<T>): T | null {
  loop:
    cabezaActual = cargar_atomico(queue.cabeza)
    colaActual = cargar_atomico(queue.cola)
    siguienteActual = cargar_atomico(cabezaActual.siguiente)
    
    si cabezaActual == cargar_atomico(queue.cabeza):
      si cabezaActual == colaActual:
        si siguienteActual == null:
          retornar null  // Queue vacía
        // Ayudar a mover cola
        compare_and_swap(queue.cola, colaActual, siguienteActual)
      sino:
        valor = siguienteActual.valor
        si compare_and_swap(queue.cabeza, cabezaActual, siguienteActual):
          retornar valor
}

// Lock-free Counter
estructura LockFreeCounter {
  valor: AtomicInteger = 0
}

función incrementar(counter: LockFreeCounter, delta: entero = 1): entero {
  loop:
    valorActual = cargar_atomico(counter.valor)
    nuevoValor = valorActual + delta
    
    si compare_and_swap(counter.valor, valorActual, nuevoValor):
      retornar nuevoValor
}

// Ventajas: Sin bloqueos, escalabilidad, tolerancia a fallos
// Desventajas: Complejidad, ABA problem, overhead de CAS`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded">
                      <p className="text-sm text-blue-200">
                        <span className="font-bold">Ventaja:</span> Sin deadlocks ni bloqueos, excelente escalabilidad.
                        <span className="font-bold"> Desventaja:</span> Complejidad de implementación, problema ABA.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 2: Particionamiento de Recursos */}
                <TabsContent value="partitioning" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-green-400 mb-4">🧩 Particionamiento de Recursos</h3>
                    <p className="text-gray-300 mb-4">
                      Divide un recurso compartido en múltiples particiones independientes, reduciendo
                      la contención al permitir acceso concurrente a diferentes particiones.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Hash Table Particionada
estructura Particion<K, V> {
  datos: Mapa<K, V>
  lock: Lock
}

estructura HashTableParticionada<K, V> {
  particiones: Arreglo<Particion<K, V>>
  numParticiones: entero
}

función crear(numParticiones: entero) -> HashTableParticionada<K, V> {
  tabla = new HashTableParticionada()
  tabla.numParticiones = numParticiones
  tabla.particiones = new Arreglo<Particion>(numParticiones)
  
  para i en 0..numParticiones-1:
    tabla.particiones[i] = new Particion()
    tabla.particiones[i].datos = new Mapa()
    tabla.particiones[i].lock = new Lock()
  
  retornar tabla
}

función obtenerParticion(tabla: HashTableParticionada<K, V>, clave: K) -> entero {
  hashCode = hash(clave)
  retornar hashCode % tabla.numParticiones
}

función insertar(tabla: HashTableParticionada<K, V>, clave: K, valor: V) {
  indiceParticion = obtenerParticion(tabla, clave)
  particion = tabla.particiones[indiceParticion]
  
  particion.lock.adquirir()
  particion.datos[clave] = valor
  particion.lock.liberar()
}

función obtener(tabla: HashTableParticionada<K, V>, clave: K) -> V | null {
  indiceParticion = obtenerParticion(tabla, clave)
  particion = tabla.particiones[indiceParticion]
  
  particion.lock.adquirir()
  valor = particion.datos.obtener(clave)
  particion.lock.liberar()
  
  retornar valor
}

función eliminar(tabla: HashTableParticionada<K, V>, clave: K) {
  indiceParticion = obtenerParticion(tabla, clave)
  particion = tabla.particiones[indiceParticion]
  
  particion.lock.adquirir()
  particion.datos.eliminar(clave)
  particion.lock.liberar()
}

// Contador Particionado (para reducir contención)
estructura ContadorParticionado {
  contadores: Arreglo<AtomicInteger>
  numParticiones: entero
}

función incrementar(contador: ContadorParticionado) {
  threadId = obtenerThreadId()
  particion = threadId % contador.numParticiones
  
  incrementar_atomico(contador.contadores[particion])
}

función obtenerTotal(contador: ContadorParticionado) -> entero {
  suma = 0
  para i en 0..contador.numParticiones-1:
    suma += cargar_atomico(contador.contadores[i])
  retornar suma
}

// Ejemplo de uso con base de datos
estructura BaseDatosParticionada {
  shards: Arreglo<Shard>
  numShards: entero
}

función routearConsulta(db: BaseDatosParticionada, userId: entero) -> Shard {
  shardId = userId % db.numShards
  retornar db.shards[shardId]
}

// Beneficio: Reducción de contención proporcional al número de particiones
// Costo: Operaciones globales más complejas (ej: contar total)`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-green-900/30 border border-green-700/50 rounded">
                      <p className="text-sm text-green-200">
                        <span className="font-bold">Ventaja:</span> Escalabilidad lineal, fácil de implementar.
                        <span className="font-bold"> Desventaja:</span> Operaciones globales costosas, posible desbalance.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 3: Lock Striping */}
                <TabsContent value="striping" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">🎨 Lock Striping</h3>
                    <p className="text-gray-300 mb-4">
                      Técnica que usa múltiples locks para proteger diferentes secciones de una estructura de datos,
                      similar al particionamiento pero con locks explícitos por segmento.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// ConcurrentHashMap estilo Java
estructura Segment<K, V> {
  tabla: Arreglo<Entry<K, V>>
  lock: ReentrantLock
  tamaño: AtomicInteger
}

estructura Entry<K, V> {
  clave: K
  valor: V
  hash: entero
  siguiente: Entry<K, V> | null
}

estructura StripedHashMap<K, V> {
  segmentos: Arreglo<Segment<K, V>>
  numSegmentos: entero
  mascara: entero  // numSegmentos - 1
}

función crear(concurrencyLevel: entero) -> StripedHashMap<K, V> {
  // Redondear a potencia de 2
  numSegmentos = siguientePotenciaDe2(concurrencyLevel)
  
  mapa = new StripedHashMap()
  mapa.numSegmentos = numSegmentos
  mapa.mascara = numSegmentos - 1
  mapa.segmentos = new Arreglo<Segment>(numSegmentos)
  
  para i en 0..numSegmentos-1:
    mapa.segmentos[i] = new Segment()
    mapa.segmentos[i].lock = new ReentrantLock()
    mapa.segmentos[i].tabla = new Arreglo<Entry>(16)
    mapa.segmentos[i].tamaño = new AtomicInteger(0)
  
  retornar mapa
}

función obtenerSegmento(mapa: StripedHashMap<K, V>, hash: entero) -> Segment<K, V> {
  // Usar bits altos del hash para mejor distribución
  indice = (hash >>> 16) & mapa.mascara
  retornar mapa.segmentos[indice]
}

función put(mapa: StripedHashMap<K, V>, clave: K, valor: V): V | null {
  hash = hash(clave)
  segmento = obtenerSegmento(mapa, hash)
  
  segmento.lock.adquirir()
  intentar:
    // Buscar en la cadena
    indiceTabla = hash & (segmento.tabla.longitud - 1)
    entrada = segmento.tabla[indiceTabla]
    
    mientras entrada != null:
      si entrada.hash == hash Y entrada.clave == clave:
        valorViejo = entrada.valor
        entrada.valor = valor
        retornar valorViejo
      entrada = entrada.siguiente
    
    // Insertar nueva entrada
    nuevaEntrada = new Entry(clave, valor, hash)
    nuevaEntrada.siguiente = segmento.tabla[indiceTabla]
    segmento.tabla[indiceTabla] = nuevaEntrada
    
    incrementar_atomico(segmento.tamaño)
    
    retornar null
  finalmente:
    segmento.lock.liberar()
}

función get(mapa: StripedHashMap<K, V>, clave: K): V | null {
  hash = hash(clave)
  segmento = obtenerSegmento(mapa, hash)
  
  // Lectura optimista sin lock
  indiceTabla = hash & (segmento.tabla.longitud - 1)
  entrada = segmento.tabla[indiceTabla]
  
  mientras entrada != null:
    si entrada.hash == hash Y entrada.clave == clave:
      retornar entrada.valor
    entrada = entrada.siguiente
  
  retornar null
}

función size(mapa: StripedHashMap<K, V>) -> entero {
  tamaño = 0
  
  // Adquirir todos los locks para garantizar consistencia
  para segmento en mapa.segmentos:
    segmento.lock.adquirir()
  
  intentar:
    para segmento en mapa.segmentos:
      tamaño += cargar_atomico(segmento.tamaño)
    retornar tamaño
  finalmente:
    para segmento en mapa.segmentos:
      segmento.lock.liberar()
}

// Lock Striping en Array
estructura StripedArray<T> {
  datos: Arreglo<T>
  locks: Arreglo<Lock>
  numLocks: entero
}

función obtenerLock(array: StripedArray<T>, indice: entero) -> Lock {
  lockIndice = indice % array.numLocks
  retornar array.locks[lockIndice]
}

función set(array: StripedArray<T>, indice: entero, valor: T) {
  lock = obtenerLock(array, indice)
  
  lock.adquirir()
  array.datos[indice] = valor
  lock.liberar()
}

// Ventaja: Concurrencia proporcional al número de stripes
// Nota: Java's ConcurrentHashMap usa esta técnica (16 segmentos por defecto)`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded">
                      <p className="text-sm text-purple-200">
                        <span className="font-bold">Ventaja:</span> Balance entre simplicidad y concurrencia.
                        <span className="font-bold"> Desventaja:</span> Operaciones que cruzan segmentos son costosas.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 4: Thread-local Storage */}
                <TabsContent value="threadlocal" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-yellow-400 mb-4">🧵 Thread-local Storage</h3>
                    <p className="text-gray-300 mb-4">
                      Cada thread mantiene su propia copia de los datos, eliminando completamente la contención
                      para lecturas y escrituras locales.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Thread-local Storage Básico
estructura ThreadLocalStorage<T> {
  valores: Mapa<ThreadId, T>
  lock: Lock
  valorInicial: función() -> T
}

función obtener(tls: ThreadLocalStorage<T>) -> T {
  threadId = obtenerThreadId()
  
  tls.lock.adquirir()
  si no tls.valores.contiene(threadId):
    tls.valores[threadId] = tls.valorInicial()
  valor = tls.valores[threadId]
  tls.lock.liberar()
  
  retornar valor
}

función establecer(tls: ThreadLocalStorage<T>, valor: T) {
  threadId = obtenerThreadId()
  
  tls.lock.adquirir()
  tls.valores[threadId] = valor
  tls.lock.liberar()
}

// Contador con Thread-local (sin contención)
estructura ThreadLocalCounter {
  contadores: ThreadLocalStorage<AtomicInteger>
}

función incrementar(counter: ThreadLocalCounter) {
  localCounter = counter.contadores.obtener()
  incrementar_atomico(localCounter)
}

función obtenerTotal(counter: ThreadLocalCounter) -> entero {
  suma = 0
  para valor en counter.contadores.valores.valores():
    suma += cargar_atomico(valor)
  retornar suma
}

// Pool de Objetos Thread-local
estructura ThreadLocalPool<T> {
  pools: ThreadLocalStorage<Cola<T>>
  fabricaObjetos: función() -> T
}

función obtenerObjeto(pool: ThreadLocalPool<T>) -> T {
  colaLocal = pool.pools.obtener()
  
  si no colaLocal.vacia():
    retornar colaLocal.desencolar()
  sino:
    retornar pool.fabricaObjetos()
}

función devolverObjeto(pool: ThreadLocalPool<T>, objeto: T) {
  colaLocal = pool.pools.obtener()
  colaLocal.encolar(objeto)
}

// Ejemplo: Generador de IDs Thread-local
estructura ThreadLocalIdGenerator {
  contadores: ThreadLocalStorage<entero>
  offsetPorThread: entero
}

función crear(numThreads: entero) -> ThreadLocalIdGenerator {
  gen = new ThreadLocalIdGenerator()
  gen.offsetPorThread = 1000000  // Espacio por thread
  gen.contadores = new ThreadLocalStorage(() => 0)
  retornar gen
}

función siguienteId(gen: ThreadLocalIdGenerator) -> entero {
  threadId = obtenerThreadId()
  contador = gen.contadores.obtener()
  nuevoContador = contador + 1
  gen.contadores.establecer(nuevoContador)
  
  retornar (threadId * gen.offsetPorThread) + nuevoContador
}

// Agregación Thread-local (reduce escrituras globales)
estructura ThreadLocalAggregator<T> {
  valoresLocales: ThreadLocalStorage<T>
  funcionCombinar: función(T, T) -> T
  valorNeutro: T
}

función agregar(agg: ThreadLocalAggregator<T>, valor: T) {
  localVal = agg.valoresLocales.obtener()
  nuevoVal = agg.funcionCombinar(localVal, valor)
  agg.valoresLocales.establecer(nuevoVal)
}

función obtenerResultado(agg: ThreadLocalAggregator<T>) -> T {
  resultado = agg.valorNeutro
  
  para valorLocal en agg.valoresLocales.valores.valores():
    resultado = agg.funcionCombinar(resultado, valorLocal)
  
  retornar resultado
}

// Uso: Buffer de escritura Thread-local
estructura ThreadLocalWriteBuffer<T> {
  buffers: ThreadLocalStorage<Lista<T>>
  tamaño_lote: entero
  procesarLote: función(Lista<T>)
}

función escribir(buffer: ThreadLocalWriteBuffer<T>, item: T) {
  bufferLocal = buffer.buffers.obtener()
  bufferLocal.agregar(item)
  
  si bufferLocal.tamaño() >= buffer.tamaño_lote:
    buffer.procesarLote(bufferLocal)
    bufferLocal.limpiar()
}

// Ventajas: Cero contención, excelente rendimiento
// Desventajas: Uso de memoria (copia por thread), agregación costosa`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded">
                      <p className="text-sm text-yellow-200">
                        <span className="font-bold">Ventaja:</span> Cero contención, rendimiento máximo.
                        <span className="font-bold"> Desventaja:</span> Mayor uso de memoria, agregación compleja.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 5: Optimistic Concurrency Control */}
                <TabsContent value="optimistic" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">✨ Optimistic Concurrency Control</h3>
                    <p className="text-gray-300 mb-4">
                      Asume que los conflictos son raros y permite operaciones concurrentes sin locks,
                      validando al final y reintentando si hubo conflicto.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Control de Concurrencia Optimista con Versionado
estructura VersionedData<T> {
  datos: T
  version: AtomicInteger
}

función leerOptimista<T>(datos: VersionedData<T>) -> (T, entero) {
  loop:
    version = cargar_atomico(datos.version)
    valor = datos.datos  // Lectura sin lock
    versionDespues = cargar_atomico(datos.version)
    
    // Verificar que no hubo escritura durante la lectura
    si version == versionDespues Y (version % 2) == 0:
      retornar (valor, version)
    // Reintentar si hubo escritura
}

función escribirOptimista<T>(datos: VersionedData<T>, nuevoValor: T) {
  loop:
    versionActual = cargar_atomico(datos.version)
    
    // Marcar como "en escritura" (versión impar)
    si compare_and_swap(datos.version, versionActual, versionActual + 1):
      datos.datos = nuevoValor
      
      // Completar escritura (versión par)
      almacenar_atomico(datos.version, versionActual + 2)
      retornar
    // Reintentar si otro thread tomó el lock
}

// Transacciones Optimistas (estilo STM - Software Transactional Memory)
estructura Transaccion {
  lecturas: Mapa<Variable, entero>  // Variable -> versión leída
  escrituras: Mapa<Variable, Valor>
  estado: ACTIVA | COMMITED | ABORTADA
}

función iniciarTransaccion() -> Transaccion {
  tx = new Transaccion()
  tx.lecturas = new Mapa()
  tx.escrituras = new Mapa()
  tx.estado = ACTIVA
  retornar tx
}

función leer<T>(tx: Transaccion, variable: VersionedData<T>) -> T {
  // Verificar si ya escribimos esta variable
  si tx.escrituras.contiene(variable):
    retornar tx.escrituras[variable]
  
  // Leer valor y registrar versión
  (valor, version) = leerOptimista(variable)
  tx.lecturas[variable] = version
  
  retornar valor
}

función escribir<T>(tx: Transaccion, variable: VersionedData<T>, valor: T) {
  tx.escrituras[variable] = valor
}

función commit(tx: Transaccion) -> booleano {
  // Fase 1: Validación
  para (variable, versionLeida) en tx.lecturas:
    versionActual = cargar_atomico(variable.version)
    
    si versionActual != versionLeida:
      tx.estado = ABORTADA
      retornar falso  // Conflicto detectado
  
  // Fase 2: Aplicar escrituras
  para (variable, valor) en tx.escrituras:
    escribirOptimista(variable, valor)
  
  tx.estado = COMMITED
  retornar verdadero
}

función ejecutarConReintentos<T>(operacion: función() -> T, maxReintentos: entero) -> T {
  para intento en 1..maxReintentos:
    tx = iniciarTransaccion()
    
    resultado = operacion()  // Ejecutar en contexto de tx
    
    si commit(tx):
      retornar resultado
    
    // Backoff exponencial antes de reintentar
    esperar(random(0, 2^intento))
  
  lanzar_error("Demasiados reintentos")
}

// OCC para Base de Datos
estructura RegistroDB {
  datos: Mapa<Clave, Valor>
  version: entero
  bloqueado: booleano
}

función leerRegistro(db: BaseDatos, clave: Clave) -> (Valor, entero) {
  registro = db.registros[clave]
  retornar (registro.datos, registro.version)
}

función actualizarRegistro(db: BaseDatos, clave: Clave, 
                           nuevoValor: Valor, versionEsperada: entero) -> booleano {
  registro = db.registros[clave]
  
  // Intentar adquirir lock
  si compare_and_swap(registro.bloqueado, falso, verdadero):
    si registro.version == versionEsperada:
      registro.datos = nuevoValor
      registro.version++
      registro.bloqueado = falso
      retornar verdadero
    sino:
      registro.bloqueado = falso
      retornar falso  // Versión cambiada, abortar
  
  retornar falso  // No se pudo adquirir lock
}

// Ejemplo: Transferencia bancaria optimista
función transferir(cuentaOrigen: Cuenta, cuentaDestino: Cuenta, monto: decimal) {
  loop:
    // Leer valores actuales
    (saldoOrigen, versionOrigen) = leerOptimista(cuentaOrigen.saldo)
    (saldoDestino, versionDestino) = leerOptimista(cuentaDestino.saldo)
    
    si saldoOrigen < monto:
      lanzar_error("Fondos insuficientes")
    
    // Calcular nuevos saldos
    nuevoSaldoOrigen = saldoOrigen - monto
    nuevoSaldoDestino = saldoDestino + monto
    
    // Intentar actualizar (validación implícita)
    si actualizarRegistro(cuentaOrigen, nuevoSaldoOrigen, versionOrigen):
      si actualizarRegistro(cuentaDestino, nuevoSaldoDestino, versionDestino):
        retornar  // Éxito
      sino:
        // Revertir primera actualización
        actualizarRegistro(cuentaOrigen, saldoOrigen, versionOrigen + 1)
    // Reintentar transacción completa
}

// Ventaja: Excelente para baja contención
// Desventaja: Reintentos costosos en alta contención`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-700/50 rounded">
                      <p className="text-sm text-cyan-200">
                        <span className="font-bold">Ventaja:</span> Sin locks en lectura, ideal para baja contención.
                        <span className="font-bold"> Desventaja:</span> Reintentos frecuentes en alta contención.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 6: Batching */}
                <TabsContent value="batching" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-pink-400 mb-4">📦 Batching</h3>
                    <p className="text-gray-300 mb-4">
                      Agrupa múltiples operaciones individuales en lotes, reduciendo la frecuencia de sincronización
                      y amortizando el costo de los locks.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Batching de Operaciones
estructura OperationBatcher<T> {
  cola: ColaThreadSafe<Operacion<T>>
  tamañoLote: entero
  procesarLote: función(Lista<Operacion<T>>)
  threadProcesador: Thread
}

estructura Operacion<T> {
  tipo: INSERTAR | ACTUALIZAR | ELIMINAR
  datos: T
  callback: función(Resultado)
}

función crear(tamañoLote: entero) -> OperationBatcher<T> {
  batcher = new OperationBatcher()
  batcher.cola = new ColaThreadSafe()
  batcher.tamañoLote = tamañoLote
  
  // Iniciar thread procesador
  batcher.threadProcesador = iniciarThread(() => {
    procesarContinuamente(batcher)
  })
  
  retornar batcher
}

función procesarContinuamente(batcher: OperationBatcher<T>) {
  mientras verdadero:
    lote = new Lista<Operacion<T>>()
    
    // Esperar primera operación (bloqueante)
    primeraOp = batcher.cola.desencolar()
    lote.agregar(primeraOp)
    
    // Recolectar operaciones adicionales (no bloqueante)
    mientras lote.tamaño() < batcher.tamañoLote:
      op = batcher.cola.intentarDesencolar(timeout: 10ms)
      si op == null:
        break
      lote.agregar(op)
    
    // Procesar lote completo
    batcher.procesarLote(lote)
}

función agregar(batcher: OperationBatcher<T>, op: Operacion<T>) {
  batcher.cola.encolar(op)
}

// Batching de Escrituras a Base de Datos
estructura DatabaseBatchWriter<T> {
  buffer: Lista<T>
  lock: Lock
  tamañoLote: entero
  timeoutMs: entero
  ultimoFlush: Timestamp
}

función insertar(writer: DatabaseBatchWriter<T>, item: T) {
  writer.lock.adquirir()
  
  writer.buffer.agregar(item)
  ahoraMs = obtenerTiempoMs()
  
  debeFlush = (writer.buffer.tamaño() >= writer.tamañoLote) O
              (ahoraMs - writer.ultimoFlush >= writer.timeoutMs)
  
  si debeFlush:
    flush(writer)
  
  writer.lock.liberar()
}

función flush(writer: DatabaseBatchWriter<T>) {
  si writer.buffer.vacio():
    retornar
  
  // Hacer copia del buffer
  itemsParaProcesar = copiar(writer.buffer)
  writer.buffer.limpiar()
  writer.ultimoFlush = obtenerTiempoMs()
  
  // Procesar fuera del lock
  writer.lock.liberar()
  
  // Escritura en lote a la base de datos
  ejecutarBatchInsert(itemsParaProcesar)
  
  writer.lock.adquirir()
}

// Log Batching (combinar múltiples logs)
estructura LogBatcher {
  bufferLocal: ThreadLocalStorage<Lista<LogEntry>>
  bufferGlobal: ColaThreadSafe<LogEntry>
  tamañoLoteLocal: entero
  threadWriter: Thread
}

función log(batcher: LogBatcher, mensaje: string, nivel: LogLevel) {
  bufferLocal = batcher.bufferLocal.obtener()
  
  entrada = new LogEntry(mensaje, nivel, obtenerTimestamp())
  bufferLocal.agregar(entrada)
  
  si bufferLocal.tamaño() >= batcher.tamañoLoteLocal:
    flushLocal(batcher, bufferLocal)
}

función flushLocal(batcher: LogBatcher, bufferLocal: Lista<LogEntry>) {
  para entrada en bufferLocal:
    batcher.bufferGlobal.encolar(entrada)
  
  bufferLocal.limpiar()
}

función procesadorGlobal(batcher: LogBatcher) {
  mientras verdadero:
    lote = new Lista<LogEntry>()
    
    // Recolectar hasta 1000 entradas o 100ms timeout
    timeout = 100  // ms
    inicioMs = obtenerTiempoMs()
    
    mientras lote.tamaño() < 1000 Y 
          (obtenerTiempoMs() - inicioMs) < timeout:
      entrada = batcher.bufferGlobal.intentarDesencolar(10ms)
      si entrada != null:
        lote.agregar(entrada)
    
    si lote.tamaño() > 0:
      escribirLogsADisco(lote)
}

// Batching con Coalescing (combinar operaciones duplicadas)
estructura CoalescingBatcher<K, V> {
  pendientes: MapaConcurrente<K, V>
  lock: Lock
  threadProcesador: Thread
}

función actualizar(batcher: CoalescingBatcher<K, V>, clave: K, valor: V) {
  // Última escritura gana (coalescing)
  batcher.pendientes.put(clave, valor)
}

función procesarPeriodicamente(batcher: CoalescingBatcher<K, V>) {
  mientras verdadero:
    esperar(100ms)  // Intervalo de batching
    
    batcher.lock.adquirir()
    
    // Tomar snapshot de pendientes
    snapshot = copiar(batcher.pendientes)
    batcher.pendientes.limpiar()
    
    batcher.lock.liberar()
    
    // Procesar fuera del lock
    para (clave, valor) en snapshot:
      aplicarActualizacion(clave, valor)
}

// Request Batching para RPCs
estructura RPCBatcher<Req, Resp> {
  solicitudesPendientes: Lista<(Req, Promise<Resp>)>
  lock: Lock
  tamañoLote: entero
}

función enviarSolicitud(batcher: RPCBatcher<Req, Resp>, req: Req) -> Promise<Resp> {
  promesa = new Promise<Resp>()
  
  batcher.lock.adquirir()
  batcher.solicitudesPendientes.agregar((req, promesa))
  
  si batcher.solicitudesPendientes.tamaño() >= batcher.tamañoLote:
    procesarLote(batcher)
  
  batcher.lock.liberar()
  
  retornar promesa
}

función procesarLote(batcher: RPCBatcher<Req, Resp>) {
  lote = copiar(batcher.solicitudesPendientes)
  batcher.solicitudesPendientes.limpiar()
  
  // Enviar todas las solicitudes en un solo RPC
  solicitudes = extraerSolicitudes(lote)
  respuestas = enviarBatchRPC(solicitudes)
  
  // Resolver promesas
  para i en 0..lote.tamaño()-1:
    lote[i].promesa.resolver(respuestas[i])
}

// Ventaja: Amortiza costo de locks, reduce overhead de I/O
// Trade-off: Latencia vs throughput`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-pink-900/30 border border-pink-700/50 rounded">
                      <p className="text-sm text-pink-200">
                        <span className="font-bold">Ventaja:</span> Amortiza costos de sincronización, mayor throughput.
                        <span className="font-bold"> Desventaja:</span> Mayor latencia, complejidad en manejo de errores.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 7: Reducir Granularidad de Locks */}
                <TabsContent value="granularity" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-orange-400 mb-4">🔬 Reducir Granularidad de Locks</h3>
                    <p className="text-gray-300 mb-4">
                      Usar locks más finos que protejan solo las secciones críticas mínimas necesarias,
                      permitiendo mayor concurrencia.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`// Mal: Lock Grueso (protege todo el objeto)
estructura ListaConLockGrueso<T> {
  datos: Arreglo<T>
  tamaño: entero
  lock: Lock  // Un solo lock para todo
}

función agregar(lista: ListaConLockGrueso<T>, item: T) {
  lista.lock.adquirir()
  
  lista.datos[lista.tamaño] = item
  lista.tamaño++
  
  lista.lock.liberar()
}

función obtener(lista: ListaConLockGrueso<T>, indice: entero) -> T {
  lista.lock.adquirir()
  
  item = lista.datos[indice]
  
  lista.lock.liberar()
  
  retornar item
}
// Problema: Lectores bloquean a otros lectores

// Mejor: Lock Fino (read-write lock)
estructura ListaConRWLock<T> {
  datos: Arreglo<T>
  tamaño: AtomicInteger
  rwlock: ReadWriteLock
}

función agregar(lista: ListaConRWLock<T>, item: T) {
  lista.rwlock.writeLock().adquirir()
  
  indice = cargar_atomico(lista.tamaño)
  lista.datos[indice] = item
  incrementar_atomico(lista.tamaño)
  
  lista.rwlock.writeLock().liberar()
}

función obtener(lista: ListaConRWLock<T>, indice: entero) -> T {
  lista.rwlock.readLock().adquirir()
  
  item = lista.datos[indice]
  
  lista.rwlock.readLock().liberar()
  
  retornar item
}
// Ventaja: Múltiples lectores concurrentes

// Óptimo: Lock por Nodo (linked list)
estructura Nodo<T> {
  valor: T
  siguiente: Nodo<T> | null
  lock: Lock
}

estructura ListaEnlazadaFinaGrain<T> {
  cabeza: Nodo<T>
  lockCabeza: Lock
}

función buscar(lista: ListaEnlazadaFinaGrain<T>, valorBuscado: T) -> Nodo<T> | null {
  lista.lockCabeza.adquirir()
  nodo = lista.cabeza
  
  si nodo != null:
    nodo.lock.adquirir()
  
  lista.lockCabeza.liberar()
  
  mientras nodo != null:
    si nodo.valor == valorBuscado:
      nodo.lock.liberar()
      retornar nodo
    
    // Hand-over-hand locking
    siguiente = nodo.siguiente
    si siguiente != null:
      siguiente.lock.adquirir()
    
    nodo.lock.liberar()
    nodo = siguiente
  
  retornar null
}

función insertar(lista: ListaEnlazadaFinaGrain<T>, valor: T) {
  nuevoNodo = new Nodo(valor)
  nuevoNodo.lock = new Lock()
  
  lista.lockCabeza.adquirir()
  
  pred = null
  curr = lista.cabeza
  
  si curr != null:
    curr.lock.adquirir()
  
  // Buscar posición de inserción
  mientras curr != null Y curr.valor < valor:
    si pred != null:
      pred.lock.liberar()
    
    pred = curr
    curr = curr.siguiente
    
    si curr != null:
      curr.lock.adquirir()
  
  // Insertar
  nuevoNodo.siguiente = curr
  
  si pred == null:
    lista.cabeza = nuevoNodo
    lista.lockCabeza.liberar()
  sino:
    pred.siguiente = nuevoNodo
    pred.lock.liberar()
    lista.lockCabeza.liberar()
  
  si curr != null:
    curr.lock.liberar()
}

// Lock Splitting (separar locks para diferentes propiedades)
estructura CuentaBancaria {
  saldo: decimal
  lockSaldo: Lock
  
  transacciones: Lista<Transaccion>
  lockTransacciones: Lock
  
  metadatos: Mapa<string, string>
  lockMetadatos: Lock
}

función depositar(cuenta: CuentaBancaria, monto: decimal) {
  // Solo lock de saldo necesario
  cuenta.lockSaldo.adquirir()
  cuenta.saldo += monto
  cuenta.lockSaldo.liberar()
  
  // Lock separado para transacciones
  cuenta.lockTransacciones.adquirir()
  cuenta.transacciones.agregar(new Transaccion(DEPOSITO, monto))
  cuenta.lockTransacciones.liberar()
}

función obtenerMetadato(cuenta: CuentaBancaria, clave: string) -> string {
  // No interfiere con operaciones de saldo
  cuenta.lockMetadatos.adquirir()
  valor = cuenta.metadatos[clave]
  cuenta.lockMetadatos.liberar()
  
  retornar valor
}

// Lock Ordering (para evitar deadlock con locks finos)
función transferir(cuentaA: CuentaBancaria, cuentaB: CuentaBancaria, monto: decimal) {
  // Adquirir locks en orden consistente (por ID)
  primera = cuentaA.id < cuentaB.id ? cuentaA : cuentaB
  segunda = cuentaA.id < cuentaB.id ? cuentaB : cuentaA
  
  primera.lockSaldo.adquirir()
  segunda.lockSaldo.adquirir()
  
  si cuentaA.saldo >= monto:
    cuentaA.saldo -= monto
    cuentaB.saldo += monto
  
  segunda.lockSaldo.liberar()
  primera.lockSaldo.liberar()
}

// Ejemplo: HashMap con Lock por Bucket
estructura HashMapFinoGrain<K, V> {
  buckets: Arreglo<Lista<Entry<K,V>>>
  locks: Arreglo<Lock>
}

función put(mapa: HashMapFinoGrain<K, V>, clave: K, valor: V) {
  hash = hash(clave)
  bucketIndice = hash % mapa.buckets.longitud
  
  // Solo lock del bucket específico
  mapa.locks[bucketIndice].adquirir()
  
  bucket = mapa.buckets[bucketIndice]
  para entry en bucket:
    si entry.clave == clave:
      entry.valor = valor
      mapa.locks[bucketIndice].liberar()
      retornar
  
  bucket.agregar(new Entry(clave, valor))
  
  mapa.locks[bucketIndice].liberar()
}

// Principios:
// 1. Lock solo lo mínimo necesario
// 2. Mantener locks el menor tiempo posible
// 3. Evitar operaciones costosas dentro de locks
// 4. Usar locks de lectura/escritura cuando sea apropiado
// 5. Considerar lock-free para casos críticos`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-orange-900/30 border border-orange-700/50 rounded">
                      <p className="text-sm text-orange-200">
                        <span className="font-bold">Ventaja:</span> Mayor concurrencia, mejor escalabilidad.
                        <span className="font-bold"> Desventaja:</span> Mayor complejidad, riesgo de deadlocks.
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
              <Tabs defaultValue="lockfree-demo" className="px-6 pb-6">
                <TabsList className="grid grid-cols-7 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="lockfree-demo">🔓 Lock-free</TabsTrigger>
                  <TabsTrigger value="part-demo">🧩 Particiones</TabsTrigger>
                  <TabsTrigger value="stripe-demo">🎨 Striping</TabsTrigger>
                  <TabsTrigger value="tls-demo">🧵 TLS</TabsTrigger>
                  <TabsTrigger value="opt-demo">✨ Optimistic</TabsTrigger>
                  <TabsTrigger value="batch-demo">📦 Batching</TabsTrigger>
                  <TabsTrigger value="gran-demo">🔬 Fine-grained</TabsTrigger>
                </TabsList>

                {/* Demo 1: Lock-free */}
                <TabsContent value="lockfree-demo" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">🔓 Demostración: Lock-free Data Structures</h3>
                    <p className="text-gray-300 mb-6">
                      Visualización de operaciones lock-free usando CAS (Compare-And-Swap). 
                      Observa cómo las operaciones se reintentan cuando fallan.
                    </p>

                    {/* Controles */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLockfreeRunning(!lockfreeRunning)}
                            className={`px-4 py-2 rounded font-semibold flex items-center gap-2 ${
                              lockfreeRunning
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {lockfreeRunning ? (
                              <>
                                <Pause className="size-4" /> Pausar
                              </>
                            ) : (
                              <>
                                <Play className="size-4" /> Iniciar
                              </>
                            )}
                          </button>
                          <button
                            onClick={resetLockfree}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center gap-2"
                          >
                            <RotateCcw className="size-4" /> Reiniciar
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Tiempo: <span className="text-blue-400 font-mono">{lockfreeTime}s</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 block mb-2">
                          Velocidad: <span className="text-blue-400">{lockfreeSpeed}ms</span>
                        </label>
                        <Slider
                          value={[lockfreeSpeed]}
                          onValueChange={(v) => setLockfreeSpeed(v[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Stack */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-3">Stack Lock-free</h4>
                        <div className="space-y-2">
                          {lockfreeStack.length === 0 ? (
                            <div className="text-gray-500 text-sm text-center py-4">Stack vacío</div>
                          ) : (
                            lockfreeStack.slice().reverse().map((val, idx) => (
                              <div
                                key={idx}
                                className="bg-blue-600/20 border border-blue-500 rounded px-3 py-2 text-center font-mono text-blue-300"
                              >
                                {val}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Operaciones */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-3">Operaciones Recientes</h4>
                        <div className="space-y-2">
                          {lockfreeOps.map((op) => (
                            <div
                              key={op.id}
                              className={`rounded px-3 py-2 text-sm ${
                                op.status === 'success'
                                  ? 'bg-green-600/20 border border-green-500 text-green-300'
                                  : op.status === 'retry'
                                  ? 'bg-yellow-600/20 border border-yellow-500 text-yellow-300'
                                  : 'bg-gray-700 border border-gray-600 text-gray-300'
                              }`}
                            >
                              T{op.threadId}: {op.type.toUpperCase()}
                              {op.value !== undefined && `(${op.value})`}
                              {op.status === 'retry' && ` [Reintento ${op.attempts}]`}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-black rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">📋 Registro de Eventos</h4>
                      <div
                        ref={lockfreeLogRef}
                        className="font-mono text-xs text-green-400 space-y-1 max-h-40 overflow-y-auto"
                      >
                        {lockfreeLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Particionamiento */}
                <TabsContent value="part-demo" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-green-400 mb-4">🧩 Demostración: Particionamiento de Recursos</h3>
                    <p className="text-gray-300 mb-6">
                      Visualización de datos particionados. Cada thread accede a su partición sin contención.
                    </p>

                    {/* Controles */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPartRunning(!partRunning)}
                            className={`px-4 py-2 rounded font-semibold flex items-center gap-2 ${
                              partRunning
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {partRunning ? (
                              <>
                                <Pause className="size-4" /> Pausar
                              </>
                            ) : (
                              <>
                                <Play className="size-4" /> Iniciar
                              </>
                            )}
                          </button>
                          <button
                            onClick={resetPartitioning}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center gap-2"
                          >
                            <RotateCcw className="size-4" /> Reiniciar
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Tiempo: <span className="text-green-400 font-mono">{partTime}s</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 block mb-2">
                          Velocidad: <span className="text-green-400">{partSpeed}ms</span>
                        </label>
                        <Slider
                          value={[partSpeed]}
                          onValueChange={(v) => setPartSpeed(v[0])}
                          min={100}
                          max={1000}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[0, 1, 2, 3].map((partId) => (
                        <div key={partId} className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-green-400 mb-2">
                            Partición {partId}
                          </h4>
                          <div className="text-xs text-gray-400 mb-2">
                            Thread {partId + 1}
                          </div>
                          <div className="space-y-1">
                            {(partData.get(partId) || []).map((val, idx) => (
                              <div
                                key={idx}
                                className="bg-green-600/20 border border-green-500 rounded px-2 py-1 text-center font-mono text-green-300 text-sm"
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Threads */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-green-400 mb-3">Estado de Threads</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {partThreads.map((thread) => (
                          <div
                            key={thread.id}
                            className={`rounded px-3 py-2 text-center text-sm font-semibold ${
                              thread.status === 'working'
                                ? 'bg-yellow-600/30 border border-yellow-500 text-yellow-300'
                                : thread.status === 'success'
                                ? 'bg-green-600/30 border border-green-500 text-green-300'
                                : 'bg-gray-700 border border-gray-600 text-gray-400'
                            }`}
                          >
                            T{thread.id} → P{thread.partition}
                            <div className="text-xs mt-1">{thread.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-black rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-400 mb-2">📋 Registro de Eventos</h4>
                      <div
                        ref={partLogRef}
                        className="font-mono text-xs text-green-400 space-y-1 max-h-40 overflow-y-auto"
                      >
                        {partLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Lock Striping */}
                <TabsContent value="stripe-demo" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">🎨 Demostración: Lock Striping</h3>
                    <p className="text-gray-300 mb-6">
                      Visualización de locks por stripe. Threads pueden trabajar en diferentes stripes simultáneamente.
                    </p>

                    {/* Controles */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setStripeRunning(!stripeRunning)}
                            className={`px-4 py-2 rounded font-semibold flex items-center gap-2 ${
                              stripeRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {stripeRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button onClick={resetStriping} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center gap-2">
                            <RotateCcw className="size-4" /> Reiniciar
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Tiempo: <span className="text-purple-400 font-mono">{stripeTime}s</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">
                          Velocidad: <span className="text-purple-400">{stripeSpeed}ms</span>
                        </label>
                        <Slider value={[stripeSpeed]} onValueChange={(v) => setStripeSpeed(v[0])} min={100} max={1000} step={50} />
                      </div>
                    </div>

                    {/* Stripes */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[0, 1, 2, 3].map((stripe) => (
                        <div key={stripe} className={`rounded-lg p-4 border-2 ${
                          stripeLocks[stripe] ? 'bg-red-600/20 border-red-500' : 'bg-gray-800/50 border-gray-600'
                        }`}>
                          <h4 className="text-sm font-semibold text-purple-400 mb-2">Stripe {stripe}</h4>
                          <div className="text-center py-6">
                            {stripeLocks[stripe] ? (
                              <div className="text-red-400 font-bold text-2xl">🔒 LOCKED</div>
                            ) : (
                              <div className="text-green-400 font-bold text-2xl">🔓 FREE</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Threads */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-purple-400 mb-3">Estado de Threads</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {stripeThreads.map((thread) => (
                          <div key={thread.id} className={`rounded px-3 py-2 text-center text-sm font-semibold ${
                            thread.status === 'waiting' ? 'bg-yellow-600/30 border border-yellow-500 text-yellow-300 animate-pulse' :
                            thread.status === 'working' ? 'bg-purple-600/30 border border-purple-500 text-purple-300' :
                            thread.status === 'success' ? 'bg-green-600/30 border border-green-500 text-green-300' :
                            'bg-gray-700 border border-gray-600 text-gray-400'
                          }`}>
                            T{thread.id} → S{thread.partition}
                            <div className="text-xs mt-1">{thread.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-black rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">📋 Registro de Eventos</h4>
                      <div ref={stripeLogRef} className="font-mono text-xs text-green-400 space-y-1 max-h-40 overflow-y-auto">
                        {stripeLogs.map((log, idx) => <div key={idx}>{log}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Thread-local Storage */}
                <TabsContent value="tls-demo" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">🧵 Demostración: Thread-local Storage</h3>
                    <p className="text-gray-300 mb-6">
                      Cada thread mantiene su propio contador local. No hay contención entre threads.
                    </p>

                    {/* Controles */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <button onClick={() => setTlsRunning(!tlsRunning)} className={`px-4 py-2 rounded font-semibold flex items-center gap-2 ${
                            tlsRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          }`}>
                            {tlsRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button onClick={resetTLS} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center gap-2">
                            <RotateCcw className="size-4" /> Reiniciar
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Tiempo: <span className="text-yellow-400 font-mono">{tlsTime}s</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">
                          Velocidad: <span className="text-yellow-400">{tlsSpeed}ms</span>
                        </label>
                        <Slider value={[tlsSpeed]} onValueChange={(v) => setTlsSpeed(v[0])} min={100} max={1000} step={50} />
                      </div>
                    </div>

                    {/* Thread-local Counters */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {tlsThreads.map((thread) => (
                        <div key={thread.id} className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-yellow-400 mb-2">Thread {thread.id}</h4>
                          <div className={`text-center py-6 rounded ${
                            thread.status === 'working' ? 'bg-yellow-600/20 animate-pulse' : 'bg-gray-700/50'
                          }`}>
                            <div className="text-3xl font-bold text-yellow-300">{thread.localValue || 0}</div>
                            <div className="text-xs text-gray-400 mt-2">{thread.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Global Sum */}
                    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700 rounded-lg p-6 text-center mb-6">
                      <h4 className="text-sm font-semibold text-yellow-400 mb-2">Valor Global (Suma de Locales)</h4>
                      <div className="text-5xl font-bold text-yellow-300">{tlsGlobalValue}</div>
                      <p className="text-sm text-gray-400 mt-2">Sin contención en incrementos individuales</p>
                    </div>

                    {/* Logs */}
                    <div className="bg-black rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-yellow-400 mb-2">📋 Registro de Eventos</h4>
                      <div ref={tlsLogRef} className="font-mono text-xs text-green-400 space-y-1 max-h-40 overflow-y-auto">
                        {tlsLogs.map((log, idx) => <div key={idx}>{log}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: Optimistic Concurrency Control */}
                <TabsContent value="opt-demo" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">✨ Demostración: Optimistic Concurrency Control</h3>
                    <p className="text-gray-300 mb-6">
                      Visualización de transacciones optimistas con versionado. Detecta conflictos al commit.
                    </p>

                    {/* Controles */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <button onClick={() => setOptRunning(!optRunning)} className={`px-4 py-2 rounded font-semibold flex items-center gap-2 ${
                            optRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          }`}>
                            {optRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button onClick={resetOptimistic} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center gap-2">
                            <RotateCcw className="size-4" /> Reiniciar
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Tiempo: <span className="text-cyan-400 font-mono">{optTime}s</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">
                          Velocidad: <span className="text-cyan-400">{optSpeed}ms</span>
                        </label>
                        <Slider value={[optSpeed]} onValueChange={(v) => setOptSpeed(v[0])} min={100} max={1000} step={50} />
                      </div>
                    </div>

                    {/* Shared Value */}
                    <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700 rounded-lg p-6 mb-6">
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Valor Compartido</h4>
                          <div className="text-4xl font-bold text-cyan-300">{optValue}</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Versión Actual</h4>
                          <div className="text-4xl font-bold text-cyan-300">v{optVersion}</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-red-400 mb-2">Conflictos</h4>
                          <div className="text-4xl font-bold text-red-300">{optConflicts}</div>
                        </div>
                      </div>
                    </div>

                    {/* Threads */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3">Estado de Threads</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {optThreads.map((thread) => (
                          <div key={thread.id} className={`rounded px-3 py-2 text-center text-sm font-semibold ${
                            thread.status === 'retry' ? 'bg-red-600/30 border border-red-500 text-red-300 animate-pulse' :
                            thread.status === 'working' ? 'bg-cyan-600/30 border border-cyan-500 text-cyan-300' :
                            thread.status === 'success' ? 'bg-green-600/30 border border-green-500 text-green-300' :
                            'bg-gray-700 border border-gray-600 text-gray-400'
                          }`}>
                            T{thread.id}
                            <div className="text-xs mt-1">{thread.status}</div>
                            {thread.version !== undefined && <div className="text-xs">v{thread.version}</div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-black rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">📋 Registro de Eventos</h4>
                      <div ref={optLogRef} className="font-mono text-xs text-green-400 space-y-1 max-h-40 overflow-y-auto">
                        {optLogs.map((log, idx) => <div key={idx}>{log}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 6: Batching */}
                <TabsContent value="batch-demo" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">📦 Demostración: Batching</h3>
                    <p className="text-gray-300 mb-6">
                      Operaciones se agrupan en lotes antes de procesarse, reduciendo overhead de sincronización.
                    </p>

                    {/* Controles */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <button onClick={() => setBatchRunning(!batchRunning)} className={`px-4 py-2 rounded font-semibold flex items-center gap-2 ${
                            batchRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          }`}>
                            {batchRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button onClick={resetBatching} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center gap-2">
                            <RotateCcw className="size-4" /> Reiniciar
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Tiempo: <span className="text-pink-400 font-mono">{batchTime}s</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">
                          Velocidad: <span className="text-pink-400">{batchSpeed}ms</span>
                        </label>
                        <Slider value={[batchSpeed]} onValueChange={(v) => setBatchSpeed(v[0])} min={100} max={1000} step={50} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-pink-900/30 border border-pink-700 rounded-lg p-4 text-center">
                        <h4 className="text-sm font-semibold text-pink-400 mb-2">Cola de Operaciones</h4>
                        <div className="text-4xl font-bold text-pink-300">{batchQueue.length}</div>
                      </div>
                      <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                        <h4 className="text-sm font-semibold text-green-400 mb-2">Operaciones Procesadas</h4>
                        <div className="text-4xl font-bold text-green-300">{batchProcessed}</div>
                      </div>
                    </div>

                    {/* Batch Queue */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-pink-400 mb-3">Cola de Lote Actual</h4>
                      <div className="flex gap-2 flex-wrap min-h-[60px]">
                        {batchQueue.length === 0 ? (
                          <div className="text-gray-500 text-sm">Cola vacía</div>
                        ) : (
                          batchQueue.map((val, idx) => (
                            <div key={idx} className="bg-pink-600/20 border border-pink-500 rounded px-3 py-1 font-mono text-pink-300">
                              {val}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Threads */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-pink-400 mb-3">Buffer Local por Thread</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {batchThreads.map((thread) => (
                          <div key={thread.id} className={`rounded px-3 py-2 text-center text-sm font-semibold ${
                            thread.status === 'working' ? 'bg-pink-600/30 border border-pink-500 text-pink-300' :
                            thread.status === 'success' ? 'bg-green-600/30 border border-green-500 text-green-300' :
                            'bg-gray-700 border border-gray-600 text-gray-400'
                          }`}>
                            T{thread.id}
                            <div className="text-xs mt-1">Buffer: {thread.batchSize || 0}</div>
                            <div className="text-xs">{thread.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-black rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-pink-400 mb-2">📋 Registro de Eventos</h4>
                      <div ref={batchLogRef} className="font-mono text-xs text-green-400 space-y-1 max-h-40 overflow-y-auto">
                        {batchLogs.map((log, idx) => <div key={idx}>{log}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 7: Fine-grained Locks */}
                <TabsContent value="gran-demo" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-orange-400 mb-4">🔬 Demostración: Fine-grained Locks</h3>
                    <p className="text-gray-300 mb-6">
                      Locks por nodo permiten acceso concurrente a diferentes nodos. Lecturas concurrentes, escrituras exclusivas.
                    </p>

                    {/* Controles */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <button onClick={() => setGranRunning(!granRunning)} className={`px-4 py-2 rounded font-semibold flex items-center gap-2 ${
                            granRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          }`}>
                            {granRunning ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}
                          </button>
                          <button onClick={resetGranularity} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center gap-2">
                            <RotateCcw className="size-4" /> Reiniciar
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Tiempo: <span className="text-orange-400 font-mono">{granTime}s</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">
                          Velocidad: <span className="text-orange-400">{granSpeed}ms</span>
                        </label>
                        <Slider value={[granSpeed]} onValueChange={(v) => setGranSpeed(v[0])} min={100} max={1000} step={50} />
                      </div>
                    </div>

                    {/* Nodes */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[0, 1, 2, 3].map((node) => (
                        <div key={node} className={`rounded-lg p-4 border-2 ${
                          granLocks[node] ? 'bg-red-600/20 border-red-500' :
                          granAccessMode[node] === 'read' ? 'bg-blue-600/20 border-blue-500' :
                          'bg-gray-800/50 border-gray-600'
                        }`}>
                          <h4 className="text-sm font-semibold text-orange-400 mb-2">Nodo {node}</h4>
                          <div className="text-center py-6">
                            {granLocks[node] ? (
                              <>
                                <div className="text-red-400 font-bold text-xl">🔒 WRITE LOCK</div>
                                <div className="text-xs text-red-300 mt-2">Exclusivo</div>
                              </>
                            ) : granAccessMode[node] === 'read' ? (
                              <>
                                <div className="text-blue-400 font-bold text-xl">📖 READING</div>
                                <div className="text-xs text-blue-300 mt-2">Concurrente</div>
                              </>
                            ) : (
                              <>
                                <div className="text-green-400 font-bold text-xl">🔓 FREE</div>
                                <div className="text-xs text-green-300 mt-2">Disponible</div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Threads */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-orange-400 mb-3">Estado de Threads</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {granThreads.map((thread) => (
                          <div key={thread.id} className={`rounded px-3 py-2 text-center text-sm font-semibold ${
                            thread.status === 'waiting' ? 'bg-yellow-600/30 border border-yellow-500 text-yellow-300 animate-pulse' :
                            thread.status === 'working' ? 'bg-orange-600/30 border border-orange-500 text-orange-300' :
                            thread.status === 'success' ? 'bg-green-600/30 border border-green-500 text-green-300' :
                            'bg-gray-700 border border-gray-600 text-gray-400'
                          }`}>
                            T{thread.id} → N{thread.partition}
                            <div className="text-xs mt-1">{thread.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-black rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-orange-400 mb-2">📋 Registro de Eventos</h4>
                      <div ref={granLogRef} className="font-mono text-xs text-green-400 space-y-1 max-h-40 overflow-y-auto">
                        {granLogs.map((log, idx) => <div key={idx}>{log}</div>)}
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