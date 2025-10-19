import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Code, BookOpen, Play, Pause, RotateCcw, TrendingDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Interfaces
interface MemoryOp {
  id: number;
  thread: number;
  type: 'READ' | 'WRITE' | 'FENCE' | 'LOCK' | 'UNLOCK';
  variable: string;
  value?: number;
  timestamp: number;
}

export default function MemoryConsistency() {
  // Estados para Demo 1: Memory Fences
  const [fencesRunning, setFencesRunning] = useState(false);
  const [fencesSpeed, setFencesSpeed] = useState(1000);
  const [fencesSharedData, setFencesSharedData] = useState({ x: 0, y: 0, flag: 0 });
  const [fencesT1Values, setFencesT1Values] = useState({ r1: 0, r2: 0 });
  const [fencesT2Values, setFencesT2Values] = useState({ r3: 0, r4: 0 });
  const [fencesLog, setFencesLog] = useState<string[]>(["🚧 Sistema de Memory Fences inicializado"]);
  const [, setFencesPhase] = useState(0);

  // Estados para Demo 2: Volatile Variables
  const [volatileRunning, setVolatileRunning] = useState(false);
  const [volatileSpeed, setVolatileSpeed] = useState(1000);
  const [volatileFlag, setVolatileFlag] = useState(0);
  const [volatileData, setVolatileData] = useState(0);
  const [volatileReaderSaw, setVolatileReaderSaw] = useState<number | null>(null);
  const [volatileLog, setVolatileLog] = useState<string[]>(["💫 Sistema Volatile inicializado"]);
  const [, setVolatilePhase] = useState(0);

  // Estados para Demo 3: Acquire/Release
  const [acqrelRunning, setAcqrelRunning] = useState(false);
  const [acqrelSpeed, setAcqrelSpeed] = useState(1000);
  const [acqrelBuffer, setAcqrelBuffer] = useState<number[]>([0, 0, 0, 0]);
  const [acqrelHead, setAcqrelHead] = useState(0);
  const [acqrelTail, setAcqrelTail] = useState(0);
  const [acqrelLog, setAcqrelLog] = useState<string[]>(["🔄 Ring Buffer con Acquire/Release inicializado"]);
  const [, setAcqrelPhase] = useState(0);

  // Estados para Demo 4: Sequential Consistency
  const [seqRunning, setSeqRunning] = useState(false);
  const [seqSpeed, setSeqSpeed] = useState(1000);
  const [seqX, setSeqX] = useState(0);
  const [seqY, setSeqY] = useState(0);
  const [seqT1R, setSeqT1R] = useState<number | null>(null);
  const [seqT2R, setSeqT2R] = useState<number | null>(null);
  const [seqLog, setSeqLog] = useState<string[]>(["📊 Sistema Sequential Consistency inicializado"]);
  const [, setSeqPhase] = useState(0);

  // Estados para Demo 5: Happens-Before
  const [hbRunning, setHbRunning] = useState(false);
  const [hbSpeed, setHbSpeed] = useState(1000);
  const [hbEvents, setHbEvents] = useState<MemoryOp[]>([]);
  const [hbRelations, setHbRelations] = useState<[number, number][]>([]);
  const [hbLog, setHbLog] = useState<string[]>(["🔗 Sistema Happens-Before inicializado"]);
  const [, setHbPhase] = useState(0);

  // Estados para Demo 6: Atomic Operations
  const [atomicRunning, setAtomicRunning] = useState(false);
  const [atomicSpeed, setAtomicSpeed] = useState(1000);
  const [atomicCounter, setAtomicCounter] = useState(0);
  const [atomicT1Attempts, setAtomicT1Attempts] = useState(0);
  const [atomicT2Attempts, setAtomicT2Attempts] = useState(0);
  const [atomicLog, setAtomicLog] = useState<string[]>(["⚛️ Contador Atómico inicializado"]);
  const [, setAtomicPhase] = useState(0);

  // Refs para logs
  const fencesLogRef = useRef<HTMLDivElement>(null);
  const volatileLogRef = useRef<HTMLDivElement>(null);
  const acqrelLogRef = useRef<HTMLDivElement>(null);
  const seqLogRef = useRef<HTMLDivElement>(null);
  const hbLogRef = useRef<HTMLDivElement>(null);
  const atomicLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (fencesLogRef.current) {
      fencesLogRef.current.scrollTop = fencesLogRef.current.scrollHeight;
    }
  }, [fencesLog]);

  useEffect(() => {
    if (volatileLogRef.current) {
      volatileLogRef.current.scrollTop = volatileLogRef.current.scrollHeight;
    }
  }, [volatileLog]);

  useEffect(() => {
    if (acqrelLogRef.current) {
      acqrelLogRef.current.scrollTop = acqrelLogRef.current.scrollHeight;
    }
  }, [acqrelLog]);

  useEffect(() => {
    if (seqLogRef.current) {
      seqLogRef.current.scrollTop = seqLogRef.current.scrollHeight;
    }
  }, [seqLog]);

  useEffect(() => {
    if (hbLogRef.current) {
      hbLogRef.current.scrollTop = hbLogRef.current.scrollHeight;
    }
  }, [hbLog]);

  useEffect(() => {
    if (atomicLogRef.current) {
      atomicLogRef.current.scrollTop = atomicLogRef.current.scrollHeight;
    }
  }, [atomicLog]);

  // Simulación Demo 1: Memory Fences
  useEffect(() => {
    if (!fencesRunning) return;

    const interval = setInterval(() => {
      setFencesPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setFencesLog(prev => [...prev, "🔵 Thread 1: x = 1"]);
          setFencesSharedData(prev => ({ ...prev, x: 1 }));
        } else if (newPhase === 2) {
          setFencesLog(prev => [...prev, "🔵 Thread 1: fence_release()"]);
        } else if (newPhase === 3) {
          setFencesLog(prev => [...prev, "🔵 Thread 1: flag = 1"]);
          setFencesSharedData(prev => ({ ...prev, flag: 1 }));
        } else if (newPhase === 4) {
          setFencesLog(prev => [...prev, "🔴 Thread 2: r1 = flag (lee 1)"]);
          setFencesT2Values({ r3: 1, r4: 0 });
        } else if (newPhase === 5) {
          setFencesLog(prev => [...prev, "🔴 Thread 2: fence_acquire()"]);
        } else if (newPhase === 6) {
          setFencesLog(prev => [...prev, "🔴 Thread 2: r2 = x (lee 1)"]);
          setFencesT2Values({ r3: 1, r4: 1 });
        } else if (newPhase === 7) {
          setFencesLog(prev => [
            ...prev,
            "✅ Gracias a las fences, Thread 2 ve x=1",
            "Sin fences, podría ver x=0 (reordenamiento)"
          ]);
          setFencesRunning(false);
        }

        return newPhase;
      });
    }, fencesSpeed);

    return () => clearInterval(interval);
  }, [fencesRunning, fencesSpeed]);

  // Simulación Demo 2: Volatile Variables
  useEffect(() => {
    if (!volatileRunning) return;

    const interval = setInterval(() => {
      setVolatilePhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setVolatileLog(prev => [...prev, "🔵 Writer: data = 42"]);
          setVolatileData(42);
        } else if (newPhase === 2) {
          setVolatileLog(prev => [...prev, "🔵 Writer: volatile flag = 1 (release)"]);
          setVolatileFlag(1);
        } else if (newPhase === 3) {
          setVolatileLog(prev => [...prev, "🔴 Reader: lee volatile flag (acquire)"]);
        } else if (newPhase === 4) {
          setVolatileLog(prev => [...prev, "🔴 Reader: flag == 1, procede a leer data"]);
        } else if (newPhase === 5) {
          setVolatileLog(prev => [...prev, `🔴 Reader: data = ${volatileData}`]);
          setVolatileReaderSaw(42);
        } else if (newPhase === 6) {
          setVolatileLog(prev => [
            ...prev,
            "✅ Volatile garantiza que Reader ve data=42",
            "Sin volatile, podría ver data=0 (cached)"
          ]);
          setVolatileRunning(false);
        }

        return newPhase;
      });
    }, volatileSpeed);

    return () => clearInterval(interval);
  }, [volatileRunning, volatileSpeed, volatileData]);

  // Simulación Demo 3: Acquire/Release
  useEffect(() => {
    if (!acqrelRunning) return;

    const interval = setInterval(() => {
      setAcqrelPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setAcqrelLog(prev => [...prev, "🔵 Producer: produce(100)"]);
          const newTail = (acqrelTail + 1) % 4;
          setAcqrelBuffer(prev => {
            const newBuf = [...prev];
            newBuf[acqrelTail] = 100;
            return newBuf;
          });
          setAcqrelTail(newTail);
        } else if (newPhase === 2) {
          setAcqrelLog(prev => [...prev, "🔵 Producer: tail.store(1, release)"]);
        } else if (newPhase === 3) {
          setAcqrelLog(prev => [...prev, "🔴 Consumer: head.load(acquire)"]);
        } else if (newPhase === 4) {
          setAcqrelLog(prev => [...prev, `🔴 Consumer: consume() → ${acqrelBuffer[acqrelHead]}`]);
          const newHead = (acqrelHead + 1) % 4;
          setAcqrelHead(newHead);
        } else if (newPhase === 5) {
          setAcqrelLog(prev => [...prev, "🔵 Producer: produce(200)"]);
          const newTail = (acqrelTail + 1) % 4;
          setAcqrelBuffer(prev => {
            const newBuf = [...prev];
            newBuf[acqrelTail] = 200;
            return newBuf;
          });
          setAcqrelTail(newTail);
        } else if (newPhase === 6) {
          setAcqrelLog(prev => [...prev, "🔴 Consumer: consume() → 200"]);
          const newHead = (acqrelHead + 1) % 4;
          setAcqrelHead(newHead);
        } else if (newPhase === 7) {
          setAcqrelLog(prev => [
            ...prev,
            "✅ Acquire/Release garantiza orden sin fences completas"
          ]);
          setAcqrelRunning(false);
        }

        return newPhase;
      });
    }, acqrelSpeed);

    return () => clearInterval(interval);
  }, [acqrelRunning, acqrelSpeed, acqrelTail, acqrelHead, acqrelBuffer]);

  // Simulación Demo 4: Sequential Consistency
  useEffect(() => {
    if (!seqRunning) return;

    const interval = setInterval(() => {
      setSeqPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setSeqLog(prev => [...prev, "🔵 Thread 1: x = 1"]);
          setSeqX(1);
        } else if (newPhase === 2) {
          setSeqLog(prev => [...prev, "🔴 Thread 2: y = 1"]);
          setSeqY(1);
        } else if (newPhase === 3) {
          setSeqLog(prev => [...prev, "🔵 Thread 1: r1 = y"]);
          setSeqT1R(seqY);
        } else if (newPhase === 4) {
          setSeqLog(prev => [...prev, "🔴 Thread 2: r2 = x"]);
          setSeqT2R(seqX);
        } else if (newPhase === 5) {
          setSeqLog(prev => [
            ...prev,
            `📊 Resultados: r1=${seqT1R}, r2=${seqT2R}`,
          ]);
        } else if (newPhase === 6) {
          if (seqT1R === 0 && seqT2R === 0) {
            setSeqLog(prev => [
              ...prev,
              "❌ r1=0 y r2=0 IMPOSIBLE en Sequential Consistency",
              "Debe existir un orden total que respete program order"
            ]);
          } else {
            setSeqLog(prev => [
              ...prev,
              "✅ Resultado válido en Sequential Consistency"
            ]);
          }
          setSeqRunning(false);
        }

        return newPhase;
      });
    }, seqSpeed);

    return () => clearInterval(interval);
  }, [seqRunning, seqSpeed, seqX, seqY, seqT1R, seqT2R]);

  // Simulación Demo 5: Happens-Before
  useEffect(() => {
    if (!hbRunning) return;

    const interval = setInterval(() => {
      setHbPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          const event: MemoryOp = {
            id: 1,
            thread: 1,
            type: 'WRITE',
            variable: 'x',
            value: 1,
            timestamp: Date.now()
          };
          setHbEvents([event]);
          setHbLog(prev => [...prev, "🔵 T1: W(x, 1) [E1]"]);
        } else if (newPhase === 2) {
          setHbRelations([[1, 2]]);
          setHbLog(prev => [...prev, "→ Program order: E1 -> E2"]);
        } else if (newPhase === 3) {
          const event: MemoryOp = {
            id: 2,
            thread: 1,
            type: 'WRITE',
            variable: 'flag',
            value: 1,
            timestamp: Date.now()
          };
          setHbEvents(prev => [...prev, event]);
          setHbLog(prev => [...prev, "🔵 T1: W(flag, 1) [E2] (release)"]);
        } else if (newPhase === 4) {
          const event: MemoryOp = {
            id: 3,
            thread: 2,
            type: 'READ',
            variable: 'flag',
            value: 1,
            timestamp: Date.now()
          };
          setHbEvents(prev => [...prev, event]);
          setHbLog(prev => [...prev, "🔴 T2: R(flag) = 1 [E3] (acquire)"]);
          setHbRelations(prev => [...prev, [2, 3]]);
        } else if (newPhase === 5) {
          setHbLog(prev => [...prev, "→ Synchronizes-with: E2 -> E3"]);
        } else if (newPhase === 6) {
          const event: MemoryOp = {
            id: 4,
            thread: 2,
            type: 'READ',
            variable: 'x',
            value: 1,
            timestamp: Date.now()
          };
          setHbEvents(prev => [...prev, event]);
          setHbLog(prev => [...prev, "🔴 T2: R(x) = 1 [E4]"]);
          setHbRelations(prev => [...prev, [3, 4]]);
        } else if (newPhase === 7) {
          setHbLog(prev => [
            ...prev,
            "→ Program order: E3 -> E4",
            "🔗 Happens-before: E1 -> E2 -> E3 -> E4",
            "✅ E4 ve el write de E1 (guaranteed)"
          ]);
          setHbRunning(false);
        }

        return newPhase;
      });
    }, hbSpeed);

    return () => clearInterval(interval);
  }, [hbRunning, hbSpeed]);

  // Simulación Demo 6: Atomic Operations
  useEffect(() => {
    if (!atomicRunning) return;

    const interval = setInterval(() => {
      setAtomicPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setAtomicLog(prev => [...prev, "🔵 Thread 1: CAS(0 → 1)"]);
          setAtomicT1Attempts(1);
          setAtomicCounter(1);
        } else if (newPhase === 2) {
          setAtomicLog(prev => [...prev, "✅ Thread 1: CAS exitoso, counter = 1"]);
        } else if (newPhase === 3) {
          setAtomicLog(prev => [...prev, "🔴 Thread 2: CAS(0 → 1)"]);
          setAtomicT2Attempts(1);
        } else if (newPhase === 4) {
          setAtomicLog(prev => [...prev, "❌ Thread 2: CAS falló (counter ya es 1)"]);
        } else if (newPhase === 5) {
          setAtomicLog(prev => [...prev, "🔴 Thread 2: reintenta CAS(1 → 2)"]);
          setAtomicT2Attempts(2);
          setAtomicCounter(2);
        } else if (newPhase === 6) {
          setAtomicLog(prev => [...prev, "✅ Thread 2: CAS exitoso, counter = 2"]);
        } else if (newPhase === 7) {
          setAtomicLog(prev => [
            ...prev,
            "🔵 Thread 1: CAS(1 → 2)",
            "❌ Thread 1: CAS falló (counter ya es 2)"
          ]);
          setAtomicT1Attempts(2);
        } else if (newPhase === 8) {
          setAtomicLog(prev => [
            ...prev,
            "✅ CAS garantiza atomicidad de read-modify-write",
            `Final counter: ${atomicCounter}`
          ]);
          setAtomicRunning(false);
        }

        return newPhase;
      });
    }, atomicSpeed);

    return () => clearInterval(interval);
  }, [atomicRunning, atomicSpeed, atomicCounter]);

  // Reset functions
  const resetFences = () => {
    setFencesRunning(false);
    setFencesPhase(0);
    setFencesSharedData({ x: 0, y: 0, flag: 0 });
    setFencesT1Values({ r1: 0, r2: 0 });
    setFencesT2Values({ r3: 0, r4: 0 });
    setFencesLog(["🚧 Sistema reinicializado"]);
  };

  const resetVolatile = () => {
    setVolatileRunning(false);
    setVolatilePhase(0);
    setVolatileFlag(0);
    setVolatileData(0);
    setVolatileReaderSaw(null);
    setVolatileLog(["💫 Sistema reinicializado"]);
  };

  const resetAcqrel = () => {
    setAcqrelRunning(false);
    setAcqrelPhase(0);
    setAcqrelBuffer([0, 0, 0, 0]);
    setAcqrelHead(0);
    setAcqrelTail(0);
    setAcqrelLog(["🔄 Ring Buffer reinicializado"]);
  };

  const resetSeq = () => {
    setSeqRunning(false);
    setSeqPhase(0);
    setSeqX(0);
    setSeqY(0);
    setSeqT1R(null);
    setSeqT2R(null);
    setSeqLog(["📊 Sistema reinicializado"]);
  };

  const resetHb = () => {
    setHbRunning(false);
    setHbPhase(0);
    setHbEvents([]);
    setHbRelations([]);
    setHbLog(["🔗 Sistema reinicializado"]);
  };

  const resetAtomic = () => {
    setAtomicRunning(false);
    setAtomicPhase(0);
    setAtomicCounter(0);
    setAtomicT1Attempts(0);
    setAtomicT2Attempts(0);
    setAtomicLog(["⚛️ Contador reinicializado"]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-8 text-amber-400" />
          <h1 className="text-4xl font-bold">Memory Consistency — Pseudocódigos</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed">
          Colección de pseudocódigos para las técnicas principales que garantizan consistencia de memoria
          en programación concurrente: barreras, variables volátiles, adquisición/liberación, consistencia
          secuencial, relaciones happens-before y operaciones atómicas.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="multiple" defaultValue={["pseudocodigos", "demos"]} className="space-y-4">
          <AccordionItem value="pseudocodigos" className="bg-gray-800 rounded-lg border border-gray-700">
            <AccordionTrigger className="text-xl font-bold px-6">
              <div className="flex items-center gap-2">
                <Code className="size-5" />
                <span>Pseudocódigos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="fences" className="px-6 pb-6">
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-6 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="fences">Memory Barriers / Fences</TabsTrigger>
                    <TabsTrigger value="volatile">Volatile Variables</TabsTrigger>
                    <TabsTrigger value="acqrel">Acquire / Release</TabsTrigger>
                    <TabsTrigger value="seq">Sequential Consistency</TabsTrigger>
                    <TabsTrigger value="happens">Happens-Before</TabsTrigger>
                    <TabsTrigger value="atomic">Atomic Operations</TabsTrigger>
                  </TabsList>
                </div>

                {/* Fences */}
                <TabsContent value="fences" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-sky-700/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4">Memory Barriers / Fences</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-sky-300 mb-2">Concepto</h4>
                        <p className="text-sm text-gray-300">Una fence es una instrucción que impone un orden entre operaciones de memoria; evita reordenamientos por el compilador o la CPU. Hay fences de lectura, escritura y completas.</p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-sky-300 mb-2">Pseudocódigo — abstracción de fences</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Definición abstracta de barreras
func fence_acquire() {
  // Garantiza que las lecturas posteriores no se muevan antes de esta instrucción
  CPU.memoryFenceAcquire()
}

func fence_release() {
  // Garantiza que las escrituras previas sean visibles antes de las escrituras posteriores
  CPU.memoryFenceRelease()
}

func fence_full() {
  // Barrera completa: no reordenar ni lecturas ni escrituras a través de la barrera
  CPU.memoryFenceFull()
}

// Uso típico: implementación de un spinlock simple
estructura SpinLock { locked: Atomic<int> }

func lock(l: SpinLock) {
  while (!l.locked.compareAndSwap(0, 1)) {
    // busy-wait
  }
  // A partir de aquí, las lecturas/escrituras posteriores deben ver el estado protegido
  fence_acquire()  // Asegura que lecturas posteriores no se muevan antes del lock
}

func unlock(l: SpinLock) {
  // Asegurar que todas las escrituras dentro del lock sean visibles antes de liberar
  fence_release()
  l.locked.store(0)
}

// Nota: dependiendo de la plataforma, fence_acquire/fence_release pueden mapear a
// LDAR/STLR (ARM) o a instrucciones de compilador como atomic_thread_fence(memory_order_acquire)
`}
                        </pre>
                      </div>

                      <div className="bg-sky-900/20 p-3 rounded">
                        <p className="text-sm text-sky-100">
                          Ventajas: control fino del orden de memoria; esencial en implementaciones lock-free.
                          Desventajas: propenso a errores si se usan incorrectamente; diferencias entre arquitecturas.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Volatile */}
                <TabsContent value="volatile" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-emerald-700/50">
                    <h3 className="text-xl font-bold text-emerald-400 mb-4">Volatile Variables</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-emerald-300 mb-2">Concepto</h4>
                        <p className="text-sm text-gray-300">Una variable marcada como volatile garantiza que las lecturas y escrituras se hagan directamente en memoria (no caché de CPU o registros), y a menudo impone restricciones de reordenamiento por el compilador. Semánticas concretas dependen del lenguaje.</p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-emerald-300 mb-2">Pseudocódigo — Java/C# style</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Java: volatile garantiza visibilidad y prohibits certain reorderings
volatile int flag = 0

// Thread 1
func writer() {
  data = 42
  // publicar dato antes de señalar flag
  flag = 1  // write to volatile: flush stores
}

// Thread 2
func reader() {
  while (flag == 0) {}
  // una vez que flag==1, reader debe ver data==42
  assert(data == 42)
}

// Puntos importantes:
// - Escribiendo a una volatile crea un 'release' en muchas plataformas de alto nivel.
// - Leer una volatile actúa como 'acquire'.
// - No sustituye completamente a locks para operaciones compuestas (ej: read-modify-write).
`}
                        </pre>
                      </div>

                      <div className="bg-emerald-900/20 p-3 rounded">
                        <p className="text-sm text-emerald-100">
                          Ventajas: sencillo para señalización y flags. Desventajas: no protege operaciones compuestas ni sustituye a primitivas atómicas.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Acquire/Release */}
                <TabsContent value="acqrel" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-violet-700/50">
                    <h3 className="text-xl font-bold text-violet-400 mb-4">Acquire / Release Semantics</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-violet-300 mb-2">Concepto</h4>
                        <p className="text-sm text-gray-300">Acquire (lectura) y Release (escritura) son órdenes de memoria usadas con operaciones atómicas para garantizar visibilidad sin necesidad de fences completas.</p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-violet-300 mb-2">Pseudocódigo — Prod/Cons seguro con acquire/release</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Buffer circular simple: producer/consumer con acquire/release
estructura RingBuffer {
  data: Array<T>
  head: Atomic<int>
  tail: Atomic<int>
}

func produce(buffer: RingBuffer, value: T) {
  while (true) {
    tail = buffer.tail.load()  // load_relaxed
    next = (tail + 1) % buffer.data.length
    if (next == buffer.head.load()) {
      // full
      continue
    }
    buffer.data[tail] = value
    // publicar el dato y luego actualizar tail con release
    buffer.tail.store(next, memory_order_release)
    return
  }
}

func consume(buffer: RingBuffer) -> T {
  while (true) {
    head = buffer.head.load(memory_order_acquire)
    if (head == buffer.tail.load(memory_order_relaxed)) {
      // empty
      continue
    }
    value = buffer.data[head]
    buffer.head.store((head + 1) % buffer.data.length, memory_order_release)
    return value
  }
}

// Explicación:
// - producer hace store_release en tail después de escribir data.
// - consumer hace load_acquire en head/tail para asegurar que vean el dato escrito.
`}
                        </pre>
                      </div>

                      <div className="bg-violet-900/20 p-3 rounded">
                        <p className="text-sm text-violet-100">
                          Ventajas: eficiente para patrones prod/cons lock-free; menor overhead que fences completas. Desventajas: requiere disciplina y comprensión de memory orders.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Sequential Consistency */}
                <TabsContent value="seq" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-rose-700/50">
                    <h3 className="text-xl font-bold text-rose-400 mb-4">Sequential Consistency</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-rose-300 mb-2">Concepto</h4>
                        <p className="text-sm text-gray-300">Un modelo es secuencialmente consistente si existe un orden total de operaciones de todos los threads que respeta el orden programado dentro de cada thread y produce el mismo comportamiento observado por cada thread.</p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-rose-300 mb-2">Pseudocódigo — comprobador de SC (modelo simplificado)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Modelo de verificación simple por interleavings
lista ops_thread1 = [W(x,1), R(y)]
lista ops_thread2 = [W(y,1), R(x)]

// Generar todas las interleavings que respetan orden dentro de cada thread
func generate_interleavings(t1, t2) -> lista<lista<op>> {
  if t1.empty() return [t2]
  if t2.empty() return [t1]
  res = []
  // tomar op de t1
  for rest in generate_interleavings(t1.tail(), t2):
    res.add([t1.head()] + rest)
  // tomar op de t2
  for rest in generate_interleavings(t1, t2.tail()):
    res.add([t2.head()] + rest)
  return res
}

func check_SC(opsLists) {
  interleavings = generate_interleavings(ops_thread1, ops_thread2)
  for each inter in interleavings:
    state = {}
    for op in inter:
      apply(op, state)
    collect final observations
  // Si todas las observaciones son consistentes con algún interleaving, modelo es SC
}

// Ejemplo: si observamos R(x)==0 y R(y)==0 para ambos, en SC esto es imposible
`}
                        </pre>
                      </div>

                      <div className="bg-rose-900/20 p-3 rounded">
                        <p className="text-sm text-rose-100">
                          Ventajas: modelo intuitivo y sencillo para razonar. Desventajas: demasiado restrictivo; costo de implementar en hardware moderno.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Happens-before */}
                <TabsContent value="happens" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-indigo-700/50">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Happens-Before Relationships</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-indigo-300 mb-2">Concepto</h4>
                        <p className="text-sm text-gray-300">La relación happens-before describe cuándo un efecto (escritura) es observable por otra operación (lectura). Construida por orden intra-thread, sincronización y otras reglas.</p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-indigo-300 mb-2">Pseudocódigo — construir grafo happens-before</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Eventos: cada lectura/escritura es un nodo
estructura Event { id, threadId, type: { READ, WRITE }, varName, value }

// Reglas para aristas HB:
// 1. Program order: dentro de un mismo thread, op_i -> op_{i+1}
// 2. Synchronization: unlock -> lock, write_release -> read_acquire, volatile write -> volatile read
// 3. Transitive closure

func build_happens_before(events) -> Graph {
  G = new Graph()
  // añadir aristas de program order
  for each thread in events.groupBy(threadId):
    for i in 0..thread.events.length-2:
      G.addEdge(thread.events[i], thread.events[i+1])

  // añadir aristas por sincronización (ejemplo: release->acquire)
  for each e in events:
    if e.type == WRITE and isRelease(e):
      for each r in events:
        if r.type == READ and isAcquire(r) and r.varName == e.varName and r.value == e.value:
          G.addEdge(e, r)

  // cerrar transitivamente
  G.transitiveClosure()
  return G
}

// Determinar si una lectura ve una escritura legalmente
func read_sees_write(readEvent, writeEvent, hbGraph) -> boolean {
  // debe existir writeEvent -> readEvent en hbGraph
  return hbGraph.hasPath(writeEvent, readEvent)
}
`}
                        </pre>
                      </div>

                      <div className="bg-indigo-900/20 p-3 rounded">
                        <p className="text-sm text-indigo-100">
                          Ventajas: formaliza visibilidad y permite razonar sobre seguridad en concurrencia. Desventajas: puede ser complejo construir grafos grandes; requiere registros de eventos para análisis post-mortem.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Atomic Operations */}
                <TabsContent value="atomic" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-lime-700/50">
                    <h3 className="text-xl font-bold text-lime-400 mb-4">Atomic Operations</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-lime-300 mb-2">Concepto</h4>
                        <p className="text-sm text-gray-300">Operaciones atómicas (CAS, fetch_add, exchange) proporcionan indivisibilidad para operaciones de lectura-modificación-escritura y pueden incluir memory orders (relaxed, acquire, release, seq_cst).</p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-lime-300 mb-2">Pseudocódigo — Compare-And-Swap (CAS)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Atomic CAS: compara y actualiza en una operación atómica
func compareAndSwap(addr: Atomic<int>, expected: int, newVal: int) -> boolean {
  atomic { // bloque atómico provisto por hardware
    if (*addr == expected) {
      *addr = newVal
      return true
    } else {
      return false
    }
  }
}

// Ejemplo: contador lock-free
estructura AtomicCounter { value: Atomic<int> }

func increment(counter: AtomicCounter) {
  while (true) {
    old = counter.value.load(memory_order_relaxed)
    if (compareAndSwap(&counter.value, old, old + 1)) {
      return
    }
    // retry
  }
}

// Pseudocódigo — fetch_add (Instrumental)
func fetch_add(addr: Atomic<int>, delta: int) -> int {
  while (true) {
    old = addr.load(memory_order_relaxed)
    if (compareAndSwap(addr, old, old + delta)) return old
  }
}

// Notas: memory_order_seq_cst es la semántica más fuerte (sequentially consistent for atomics)
`}
                        </pre>
                      </div>

                      <div className="bg-lime-900/20 p-3 rounded">
                        <p className="text-sm text-lime-100">
                          Ventajas: primitives atómicas son building blocks para algoritmos lock-free. Desventajas: pueden ser difíciles de usar correctamente; operaciones compuestas requieren patrones adicionales (ej: DCAS, descriptors).
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
                <TrendingDown className="size-5" />
                <span>Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="demo-fences" className="px-6 pb-6">
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-6 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="demo-fences">Fences</TabsTrigger>
                    <TabsTrigger value="demo-volatile">Volatile</TabsTrigger>
                    <TabsTrigger value="demo-acqrel">Acq/Rel</TabsTrigger>
                    <TabsTrigger value="demo-seq">Seq Consistency</TabsTrigger>
                    <TabsTrigger value="demo-hb">Happens-Before</TabsTrigger>
                    <TabsTrigger value="demo-atomic">Atomic Ops</TabsTrigger>
                  </TabsList>
                </div>

                {/* Demo 1: Memory Fences */}
                <TabsContent value="demo-fences" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-sky-700/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4">Demo: Memory Fences</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setFencesRunning(!fencesRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            fencesRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-sky-600 hover:bg-sky-700"
                          }`}
                        >
                          {fencesRunning ? (
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
                          onClick={resetFences}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {fencesSpeed}ms
                        </label>
                        <Slider
                          value={[fencesSpeed]}
                          onValueChange={([value]) => setFencesSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Estado compartido */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-sky-300 mb-3">Shared Memory</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-sky-900/30 p-2 rounded">
                          <span className="text-sky-300 font-bold">x:</span> {fencesSharedData.x}
                        </div>
                        <div className="bg-sky-900/30 p-2 rounded">
                          <span className="text-sky-300 font-bold">y:</span> {fencesSharedData.y}
                        </div>
                        <div className="bg-sky-900/30 p-2 rounded">
                          <span className="text-sky-300 font-bold">flag:</span> {fencesSharedData.flag}
                        </div>
                      </div>
                    </div>

                    {/* Threads */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-2">Thread 1</h4>
                        <div className="text-xs space-y-1 text-gray-300">
                          <div>r1: {fencesT1Values.r1}</div>
                          <div>r2: {fencesT1Values.r2}</div>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-red-300 mb-2">Thread 2</h4>
                        <div className="text-xs space-y-1 text-gray-300">
                          <div>r3: {fencesT2Values.r3}</div>
                          <div>r4: {fencesT2Values.r4}</div>
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-sky-300 mb-3">Event Log</h4>
                      <div
                        ref={fencesLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {fencesLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Volatile */}
                <TabsContent value="demo-volatile" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-emerald-700/50">
                    <h3 className="text-xl font-bold text-emerald-400 mb-4">Demo: Volatile Variables</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setVolatileRunning(!volatileRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            volatileRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          {volatileRunning ? (
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
                          onClick={resetVolatile}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {volatileSpeed}ms
                        </label>
                        <Slider
                          value={[volatileSpeed]}
                          onValueChange={([value]) => setVolatileSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-emerald-300 mb-3">Variables</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-900/30 p-3 rounded">
                          <div className="text-emerald-300 font-bold mb-1">data</div>
                          <div className="text-2xl">{volatileData}</div>
                        </div>
                        <div className="bg-emerald-900/30 p-3 rounded">
                          <div className="text-emerald-300 font-bold mb-1">volatile flag</div>
                          <div className="text-2xl">{volatileFlag}</div>
                        </div>
                      </div>
                    </div>

                    {/* Reader */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-emerald-300 mb-3">Reader vio</h4>
                      <div className="text-xl text-emerald-400">
                        {volatileReaderSaw !== null ? volatileReaderSaw : "esperando..."}
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-emerald-300 mb-3">Event Log</h4>
                      <div
                        ref={volatileLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {volatileLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Acquire/Release */}
                <TabsContent value="demo-acqrel" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-violet-700/50">
                    <h3 className="text-xl font-bold text-violet-400 mb-4">Demo: Acquire/Release Ring Buffer</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setAcqrelRunning(!acqrelRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            acqrelRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-violet-600 hover:bg-violet-700"
                          }`}
                        >
                          {acqrelRunning ? (
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
                          onClick={resetAcqrel}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {acqrelSpeed}ms
                        </label>
                        <Slider
                          value={[acqrelSpeed]}
                          onValueChange={([value]) => setAcqrelSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Ring Buffer */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-violet-300 mb-3">Ring Buffer</h4>
                      <div className="flex items-center gap-2 justify-center">
                        {acqrelBuffer.map((val, idx) => (
                          <div
                            key={idx}
                            className={`w-16 h-16 flex items-center justify-center rounded font-bold text-lg ${
                              idx === acqrelHead
                                ? "bg-blue-600 ring-2 ring-blue-400"
                                : idx === acqrelTail
                                ? "bg-violet-600 ring-2 ring-violet-400"
                                : "bg-gray-700"
                            }`}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-around mt-2 text-xs">
                        <div className="text-blue-300">HEAD: {acqrelHead}</div>
                        <div className="text-violet-300">TAIL: {acqrelTail}</div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-violet-300 mb-3">Event Log</h4>
                      <div
                        ref={acqrelLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {acqrelLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Sequential Consistency */}
                <TabsContent value="demo-seq" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-rose-700/50">
                    <h3 className="text-xl font-bold text-rose-400 mb-4">Demo: Sequential Consistency</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setSeqRunning(!seqRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            seqRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-rose-600 hover:bg-rose-700"
                          }`}
                        >
                          {seqRunning ? (
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
                          onClick={resetSeq}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {seqSpeed}ms
                        </label>
                        <Slider
                          value={[seqSpeed]}
                          onValueChange={([value]) => setSeqSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-rose-300 mb-3">Shared Variables</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-rose-900/30 p-3 rounded">
                          <div className="text-rose-300 font-bold">x</div>
                          <div className="text-2xl">{seqX}</div>
                        </div>
                        <div className="bg-rose-900/30 p-3 rounded">
                          <div className="text-rose-300 font-bold">y</div>
                          <div className="text-2xl">{seqY}</div>
                        </div>
                      </div>
                    </div>

                    {/* Threads */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-2">Thread 1</h4>
                        <div className="text-xs text-gray-300">
                          r1 (lee y): {seqT1R !== null ? seqT1R : "—"}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-red-300 mb-2">Thread 2</h4>
                        <div className="text-xs text-gray-300">
                          r2 (lee x): {seqT2R !== null ? seqT2R : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-rose-300 mb-3">Event Log</h4>
                      <div
                        ref={seqLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {seqLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: Happens-Before */}
                <TabsContent value="demo-hb" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-indigo-700/50">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Demo: Happens-Before Graph</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setHbRunning(!hbRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            hbRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                        >
                          {hbRunning ? (
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
                          onClick={resetHb}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {hbSpeed}ms
                        </label>
                        <Slider
                          value={[hbSpeed]}
                          onValueChange={([value]) => setHbSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Events */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-indigo-300 mb-3">Events</h4>
                      <div className="space-y-2">
                        {hbEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-2 rounded text-xs ${
                              event.thread === 1 ? "bg-blue-900/30" : "bg-red-900/30"
                            }`}
                          >
                            E{event.id} (T{event.thread}): {event.type}({event.variable}
                            {event.value !== undefined ? `, ${event.value}` : ""})
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Relations */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-indigo-300 mb-3">
                        Happens-Before Relations
                      </h4>
                      <div className="space-y-1 text-xs text-gray-300">
                        {hbRelations.map(([from, to], idx) => (
                          <div key={idx}>E{from} → E{to}</div>
                        ))}
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-indigo-300 mb-3">Event Log</h4>
                      <div
                        ref={hbLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {hbLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 6: Atomic Operations */}
                <TabsContent value="demo-atomic" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-lime-700/50">
                    <h3 className="text-xl font-bold text-lime-400 mb-4">Demo: Atomic CAS Operations</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setAtomicRunning(!atomicRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            atomicRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-lime-600 hover:bg-lime-700"
                          }`}
                        >
                          {atomicRunning ? (
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
                          onClick={resetAtomic}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {atomicSpeed}ms
                        </label>
                        <Slider
                          value={[atomicSpeed]}
                          onValueChange={([value]) => setAtomicSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Counter */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-lime-300 mb-3">Atomic Counter</h4>
                      <div className="text-4xl font-bold text-lime-400 text-center">
                        {atomicCounter}
                      </div>
                    </div>

                    {/* Threads */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-2">Thread 1</h4>
                        <div className="text-xs text-gray-300">
                          CAS attempts: {atomicT1Attempts}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-red-300 mb-2">Thread 2</h4>
                        <div className="text-xs text-gray-300">
                          CAS attempts: {atomicT2Attempts}
                        </div>
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-lime-300 mb-3">Event Log</h4>
                      <div
                        ref={atomicLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {atomicLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
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
  )
}