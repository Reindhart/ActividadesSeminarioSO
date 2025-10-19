import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Code, AlertTriangle, Play, Pause, RotateCcw, TrendingDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Interfaces
interface StackNode {
  id: string;
  value: string;
  version?: number;
  next: string | null;
  refCount?: number;
}

interface StackState {
  nodes: StackNode[];
  head: string | null;
  version: number;
}

export default function ABA() {
  // Estados para Demo 1: Versioning/Tagging
  const [versioningRunning, setVersioningRunning] = useState(false);
  const [versioningSpeed, setVersioningSpeed] = useState(1000);
  const [versioningStack, setVersioningStack] = useState<StackState>({
    nodes: [
      { id: "A", value: "A", version: 0, next: "B" },
      { id: "B", value: "B", version: 0, next: "C" },
      { id: "C", value: "C", version: 0, next: null }
    ],
    head: "A",
    version: 0
  });
  const [versioningLog, setVersioningLog] = useState<string[]>([
    "📦 Stack inicializado: A(v0) → B(v0) → C(v0)"
  ]);
  const [, setVersioningPhase] = useState(0);

  // Estados para Demo 2: Hazard Pointers
  const [hazardRunning, setHazardRunning] = useState(false);
  const [hazardSpeed, setHazardSpeed] = useState(1000);
  const [hazardStack, setHazardStack] = useState<StackState>({
    nodes: [
      { id: "A", value: "A", next: "B" },
      { id: "B", value: "B", next: "C" },
      { id: "C", value: "C", next: null }
    ],
    head: "A",
    version: 0
  });
  const [hazardPointers, setHazardPointers] = useState<string[]>([]);
  const [retireList, setRetireList] = useState<string[]>([]);
  const [hazardLog, setHazardLog] = useState<string[]>([
    "🛡️ Sistema de Hazard Pointers inicializado"
  ]);
  const [, setHazardPhase] = useState(0);

  // Estados para Demo 3: DCAS
  const [dcasRunning, setDcasRunning] = useState(false);
  const [dcasSpeed, setDcasSpeed] = useState(1000);
  const [dcasStack, setDcasStack] = useState<StackState>({
    nodes: [
      { id: "A", value: "A", version: 0, next: "B" },
      { id: "B", value: "B", version: 0, next: null }
    ],
    head: "A",
    version: 0
  });
  const [dcasOperation, setDcasOperation] = useState<{
    pointer1: string | null;
    version1: number;
    pointer2: string | null;
    version2: number;
  }>({ pointer1: null, version1: 0, pointer2: null, version2: 0 });
  const [dcasLog, setDcasLog] = useState<string[]>([
    "⚛️ Sistema DCAS (128-bit CAS) inicializado"
  ]);
  const [, setDcasPhase] = useState(0);

  // Estados para Demo 4: Garbage Collection (EBR)
  const [gcRunning, setGcRunning] = useState(false);
  const [gcSpeed, setGcSpeed] = useState(1000);
  const [gcStack, setGcStack] = useState<StackState>({
    nodes: [
      { id: "A", value: "A", next: "B" },
      { id: "B", value: "B", next: "C" },
      { id: "C", value: "C", next: null }
    ],
    head: "A",
    version: 0
  });
  const [globalEpoch, setGlobalEpoch] = useState(0);
  const [threadEpochs, setThreadEpochs] = useState<number[]>([0, 0]);
  const [epochRetireList, setEpochRetireList] = useState<Map<number, string[]>>(new Map());
  const [gcLog, setGcLog] = useState<string[]>([
    "🗑️ Epoch-Based Reclamation inicializado (epoch 0)"
  ]);
  const [, setGcPhase] = useState(0);

  // Estados para Demo 5: LL/SC
  const [llscRunning, setLlscRunning] = useState(false);
  const [llscSpeed, setLlscSpeed] = useState(1000);
  const [llscStack, setLlscStack] = useState<StackState>({
    nodes: [
      { id: "A", value: "A", next: "B" },
      { id: "B", value: "B", next: "C" },
      { id: "C", value: "C", next: null }
    ],
    head: "A",
    version: 0
  });
  const [linkRegister, setLinkRegister] = useState<{
    active: boolean;
    address: string | null;
    value: string | null;
  }>({ active: false, address: null, value: null });
  const [llscLog, setLlscLog] = useState<string[]>([
    "🔗 Sistema LL/SC inicializado"
  ]);
  const [, setLlscPhase] = useState(0);

  // Refs para logs
  const versioningLogRef = useRef<HTMLDivElement>(null);
  const hazardLogRef = useRef<HTMLDivElement>(null);
  const dcasLogRef = useRef<HTMLDivElement>(null);
  const gcLogRef = useRef<HTMLDivElement>(null);
  const llscLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    if (versioningLogRef.current) {
      versioningLogRef.current.scrollTop = versioningLogRef.current.scrollHeight;
    }
  }, [versioningLog]);

  useEffect(() => {
    if (hazardLogRef.current) {
      hazardLogRef.current.scrollTop = hazardLogRef.current.scrollHeight;
    }
  }, [hazardLog]);

  useEffect(() => {
    if (dcasLogRef.current) {
      dcasLogRef.current.scrollTop = dcasLogRef.current.scrollHeight;
    }
  }, [dcasLog]);

  useEffect(() => {
    if (gcLogRef.current) {
      gcLogRef.current.scrollTop = gcLogRef.current.scrollHeight;
    }
  }, [gcLog]);

  useEffect(() => {
    if (llscLogRef.current) {
      llscLogRef.current.scrollTop = llscLogRef.current.scrollHeight;
    }
  }, [llscLog]);

  // Simulación Demo 1: Versioning/Tagging
  useEffect(() => {
    if (!versioningRunning) return;

    const interval = setInterval(() => {
      setVersioningPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setVersioningLog(prev => [...prev, "🔵 Thread 1: Inicia pop() - lee head = A(v0)"]);
        } else if (newPhase === 2) {
          setVersioningLog(prev => [...prev, "🔴 Thread 2: pop() exitoso - A(v0) → B(v1)"]);
          setVersioningStack(prev => ({
            ...prev,
            head: "B",
            version: 1,
            nodes: prev.nodes.map(n => n.id === "B" ? { ...n, version: 1 } : n)
          }));
        } else if (newPhase === 3) {
          setVersioningLog(prev => [...prev, "🔴 Thread 2: pop() exitoso - B(v1) → C(v2)"]);
          setVersioningStack(prev => ({
            ...prev,
            head: "C",
            version: 2,
            nodes: prev.nodes.map(n => n.id === "C" ? { ...n, version: 2 } : n)
          }));
        } else if (newPhase === 4) {
          setVersioningLog(prev => [...prev, "🔴 Thread 2: push(A) exitoso - C(v2) → A(v3)"]);
          setVersioningStack(prev => ({
            ...prev,
            head: "A",
            version: 3,
            nodes: [
              { id: "A", value: "A", version: 3, next: "C" },
              ...prev.nodes.filter(n => n.id !== "A")
            ]
          }));
        } else if (newPhase === 5) {
          setVersioningLog(prev => [
            ...prev,
            "⚠️ Head es A nuevamente, pero versión cambió: v0 → v3"
          ]);
        } else if (newPhase === 6) {
          setVersioningLog(prev => [
            ...prev,
            "🔵 Thread 1: Intenta CAS(A, v0) → (B, v1)"
          ]);
        } else if (newPhase === 7) {
          setVersioningLog(prev => [
            ...prev,
            "❌ CAS FALLA: expected=(A, v0) != actual=(A, v3)",
            "✅ ABA DETECTADO: versioning previno corrupción"
          ]);
          setVersioningRunning(false);
        }

        return newPhase;
      });
    }, versioningSpeed);

    return () => clearInterval(interval);
  }, [versioningRunning, versioningSpeed]);

  // Simulación Demo 2: Hazard Pointers
  useEffect(() => {
    if (!hazardRunning) return;

    const interval = setInterval(() => {
      setHazardPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setHazardLog(prev => [...prev, "🔵 Thread 1: acquire() hazard pointer"]);
          setHazardPointers(["A"]);
        } else if (newPhase === 2) {
          setHazardLog(prev => [
            ...prev,
            "🔵 Thread 1: protect(head) → HP[0] = A"
          ]);
        } else if (newPhase === 3) {
          setHazardLog(prev => [...prev, "🔴 Thread 2: pop() - intenta remover A"]);
        } else if (newPhase === 4) {
          setHazardLog(prev => [
            ...prev,
            "🔴 Thread 2: CAS exitoso, A removido del stack"
          ]);
          setHazardStack(prev => ({
            ...prev,
            head: "B"
          }));
        } else if (newPhase === 5) {
          setHazardLog(prev => [
            ...prev,
            "🔴 Thread 2: retire(A) - agregado a retire list"
          ]);
          setRetireList(["A"]);
        } else if (newPhase === 6) {
          setHazardLog(prev => [
            ...prev,
            "🔴 Thread 2: scan() - verifica hazard pointers"
          ]);
        } else if (newPhase === 7) {
          setHazardLog(prev => [
            ...prev,
            "⚠️ A está protegido por HP[0], NO se puede liberar",
            "✅ Hazard pointer previene use-after-free"
          ]);
        } else if (newPhase === 8) {
          setHazardLog(prev => [
            ...prev,
            "🔵 Thread 1: release(HP[0]) - A ya no está protegido"
          ]);
          setHazardPointers([]);
        } else if (newPhase === 9) {
          setHazardLog(prev => [
            ...prev,
            "🔴 Thread 2: scan() nuevamente"
          ]);
        } else if (newPhase === 10) {
          setHazardLog(prev => [
            ...prev,
            "✅ A no está protegido, se puede liberar: free(A)"
          ]);
          setRetireList([]);
          setHazardStack(prev => ({
            ...prev,
            nodes: prev.nodes.filter(n => n.id !== "A")
          }));
          setHazardRunning(false);
        }

        return newPhase;
      });
    }, hazardSpeed);

    return () => clearInterval(interval);
  }, [hazardRunning, hazardSpeed]);

  // Simulación Demo 3: DCAS
  useEffect(() => {
    if (!dcasRunning) return;

    const interval = setInterval(() => {
      setDcasPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setDcasLog(prev => [
            ...prev,
            "🔵 Thread 1: Inicia pop() - lee (pointer=A, version=0)"
          ]);
          setDcasOperation({
            pointer1: "A",
            version1: 0,
            pointer2: "B",
            version2: 1
          });
        } else if (newPhase === 2) {
          setDcasLog(prev => [
            ...prev,
            "🔴 Thread 2: DCAS exitoso - (A,v0) → (B,v1)"
          ]);
          setDcasStack(prev => ({
            ...prev,
            head: "B",
            version: 1
          }));
        } else if (newPhase === 3) {
          setDcasLog(prev => [
            ...prev,
            "🔴 Thread 2: DCAS exitoso - (B,v1) → (null,v2)"
          ]);
          setDcasStack(prev => ({
            ...prev,
            head: null,
            version: 2
          }));
        } else if (newPhase === 4) {
          setDcasLog(prev => [
            ...prev,
            "🔴 Thread 2: push(A) - DCAS exitoso (null,v2) → (A,v3)"
          ]);
          setDcasStack(prev => ({
            ...prev,
            head: "A",
            version: 3,
            nodes: [{ id: "A", value: "A", version: 3, next: null }]
          }));
        } else if (newPhase === 5) {
          setDcasLog(prev => [
            ...prev,
            "⚠️ Puntero volvió a A, pero versión: v0 → v3"
          ]);
        } else if (newPhase === 6) {
          setDcasLog(prev => [
            ...prev,
            "🔵 Thread 1: DCAS intenta (A,v0) → (B,v1)"
          ]);
        } else if (newPhase === 7) {
          setDcasLog(prev => [
            ...prev,
            "❌ DCAS FALLA: (pointer,version) no coinciden",
            "   Expected: (A, 0)",
            "   Actual:   (A, 3)",
            "✅ DCAS detectó cambio intermedio"
          ]);
          setDcasOperation({
            pointer1: null,
            version1: 0,
            pointer2: null,
            version2: 0
          });
          setDcasRunning(false);
        }

        return newPhase;
      });
    }, dcasSpeed);

    return () => clearInterval(interval);
  }, [dcasRunning, dcasSpeed]);

  // Simulación Demo 4: Garbage Collection (EBR)
  useEffect(() => {
    if (!gcRunning) return;

    const interval = setInterval(() => {
      setGcPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setGcLog(prev => [
            ...prev,
            "🔵 Thread 1: enterEpoch() - thread epoch = 0"
          ]);
          setThreadEpochs([0, -1]);
        } else if (newPhase === 2) {
          setGcLog(prev => [...prev, "🔵 Thread 1: pop() en progreso..."]);
        } else if (newPhase === 3) {
          setGcLog(prev => [
            ...prev,
            "🔴 Thread 2: enterEpoch() - thread epoch = 0"
          ]);
          setThreadEpochs([0, 0]);
        } else if (newPhase === 4) {
          setGcLog(prev => [
            ...prev,
            "🔴 Thread 2: pop(A) exitoso - retire(A) en epoch 0"
          ]);
          setGcStack(prev => ({ ...prev, head: "B" }));
          setEpochRetireList(new Map([[0, ["A"]]]));
        } else if (newPhase === 5) {
          setGcLog(prev => [
            ...prev,
            "🔴 Thread 2: exitEpoch() - thread epoch = -1"
          ]);
          setThreadEpochs([0, -1]);
        } else if (newPhase === 6) {
          setGcLog(prev => [
            ...prev,
            "🔵 Thread 1: exitEpoch() - thread epoch = -1"
          ]);
          setThreadEpochs([-1, -1]);
        } else if (newPhase === 7) {
          setGcLog(prev => [
            ...prev,
            "⚙️ Todos los threads salieron del epoch 0"
          ]);
        } else if (newPhase === 8) {
          setGcLog(prev => [
            ...prev,
            "✅ Avanzar global epoch: 0 → 1"
          ]);
          setGlobalEpoch(1);
        } else if (newPhase === 9) {
          setGcLog(prev => [
            ...prev,
            "🗑️ Liberar nodos del epoch 0: free(A)",
            "✅ Safe: ningún thread está en epoch 0"
          ]);
          setEpochRetireList(new Map());
          setGcStack(prev => ({
            ...prev,
            nodes: prev.nodes.filter(n => n.id !== "A")
          }));
          setGcRunning(false);
        }

        return newPhase;
      });
    }, gcSpeed);

    return () => clearInterval(interval);
  }, [gcRunning, gcSpeed]);

  // Simulación Demo 5: LL/SC
  useEffect(() => {
    if (!llscRunning) return;

    const interval = setInterval(() => {
      setLlscPhase(prevPhase => {
        const newPhase = prevPhase + 1;

        if (newPhase === 1) {
          setLlscLog(prev => [
            ...prev,
            "🔵 Thread 1: LL(&head) - lee A, activa link register"
          ]);
          setLinkRegister({
            active: true,
            address: "head",
            value: "A"
          });
        } else if (newPhase === 2) {
          setLlscLog(prev => [
            ...prev,
            "🔴 Thread 2: pop(A) - escribe en head"
          ]);
        } else if (newPhase === 3) {
          setLlscLog(prev => [
            ...prev,
            "🔴 Thread 2: head = A → B (ESCRITURA detectada por HW)"
          ]);
          setLlscStack(prev => ({ ...prev, head: "B" }));
          setLinkRegister(prev => ({ ...prev, active: false }));
        } else if (newPhase === 4) {
          setLlscLog(prev => [
            ...prev,
            "🔴 Thread 2: pop(B), luego push(A)"
          ]);
        } else if (newPhase === 5) {
          setLlscLog(prev => [...prev, "🔴 Thread 2: head = B → C"]);
          setLlscStack(prev => ({ ...prev, head: "C" }));
        } else if (newPhase === 6) {
          setLlscLog(prev => [...prev, "🔴 Thread 2: push(A) → head = C → A"]);
          setLlscStack(prev => ({
            ...prev,
            head: "A",
            nodes: [
              { id: "A", value: "A", next: "C" },
              ...prev.nodes.filter(n => n.id !== "A")
            ]
          }));
        } else if (newPhase === 7) {
          setLlscLog(prev => [
            ...prev,
            "⚠️ Head volvió a A (ABA ocurrió)"
          ]);
        } else if (newPhase === 8) {
          setLlscLog(prev => [
            ...prev,
            "🔵 Thread 1: SC(&head, B) - intenta escribir"
          ]);
        } else if (newPhase === 9) {
          setLlscLog(prev => [
            ...prev,
            "❌ SC FALLA: link register inactivo",
            "   Hardware detectó escritura intermedia",
            "✅ LL/SC detectó ABA automáticamente"
          ]);
          setLlscRunning(false);
        }

        return newPhase;
      });
    }, llscSpeed);

    return () => clearInterval(interval);
  }, [llscRunning, llscSpeed]);

  // Funciones reset
  const resetVersioning = () => {
    setVersioningRunning(false);
    setVersioningPhase(0);
    setVersioningStack({
      nodes: [
        { id: "A", value: "A", version: 0, next: "B" },
        { id: "B", value: "B", version: 0, next: "C" },
        { id: "C", value: "C", version: 0, next: null }
      ],
      head: "A",
      version: 0
    });
    setVersioningLog(["📦 Stack reinicializado: A(v0) → B(v0) → C(v0)"]);
  };

  const resetHazard = () => {
    setHazardRunning(false);
    setHazardPhase(0);
    setHazardStack({
      nodes: [
        { id: "A", value: "A", next: "B" },
        { id: "B", value: "B", next: "C" },
        { id: "C", value: "C", next: null }
      ],
      head: "A",
      version: 0
    });
    setHazardPointers([]);
    setRetireList([]);
    setHazardLog(["🛡️ Sistema reinicializado"]);
  };

  const resetDcas = () => {
    setDcasRunning(false);
    setDcasPhase(0);
    setDcasStack({
      nodes: [
        { id: "A", value: "A", version: 0, next: "B" },
        { id: "B", value: "B", version: 0, next: null }
      ],
      head: "A",
      version: 0
    });
    setDcasOperation({
      pointer1: null,
      version1: 0,
      pointer2: null,
      version2: 0
    });
    setDcasLog(["⚛️ Sistema DCAS reinicializado"]);
  };

  const resetGc = () => {
    setGcRunning(false);
    setGcPhase(0);
    setGcStack({
      nodes: [
        { id: "A", value: "A", next: "B" },
        { id: "B", value: "B", next: "C" },
        { id: "C", value: "C", next: null }
      ],
      head: "A",
      version: 0
    });
    setGlobalEpoch(0);
    setThreadEpochs([0, 0]);
    setEpochRetireList(new Map());
    setGcLog(["🗑️ Sistema EBR reinicializado (epoch 0)"]);
  };

  const resetLlsc = () => {
    setLlscRunning(false);
    setLlscPhase(0);
    setLlscStack({
      nodes: [
        { id: "A", value: "A", next: "B" },
        { id: "B", value: "B", next: "C" },
        { id: "C", value: "C", next: null }
      ],
      head: "A",
      version: 0
    });
    setLinkRegister({
      active: false,
      address: null,
      value: null
    });
    setLlscLog(["🔗 Sistema LL/SC reinicializado"]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border-b border-orange-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="size-8 text-orange-400" />
            <h1 className="text-4xl font-bold">ABA Problem</h1>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            El <span className="text-orange-400 font-semibold">problema ABA</span> ocurre en programación concurrente 
            lock-free cuando un valor cambia de A → B → A, y un thread usando CAS (Compare-And-Swap) no detecta que 
            el valor intermedio B existió, asumiendo incorrectamente que nada ha cambiado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-orange-900/30 border border-orange-700/50 rounded-lg p-4">
              <h3 className="font-bold text-orange-300 mb-2">⚠️ Problema</h3>
              <p className="text-sm text-gray-300">
                CAS(expected: A, new: C) puede tener éxito incluso si el valor pasó por B, causando 
                corrupción de memoria, use-after-free, o estados inconsistentes en estructuras de datos.
              </p>
            </div>
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
              <h3 className="font-bold text-red-300 mb-2">✅ Soluciones</h3>
              <p className="text-sm text-gray-300">
                Versioning/tagging, hazard pointers, DCAS, garbage collection, o instrucciones 
                LL/SC que detectan cualquier cambio intermedio en la memoria.
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
              <Tabs defaultValue="ps-versioning" className="px-6 pb-6">
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-5 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="ps-versioning">🔖 Versioning</TabsTrigger>
                    <TabsTrigger value="ps-hazard">🛡️ Hazard</TabsTrigger>
                    <TabsTrigger value="ps-dcas">⚛️ DCAS</TabsTrigger>
                    <TabsTrigger value="ps-gc">🗑️ GC</TabsTrigger>
                    <TabsTrigger value="ps-llsc">🔗 LL/SC</TabsTrigger>
                  </TabsList>
                </div>

                {/* Pseudocódigo 1: Versioning/Tagging */}
                <TabsContent value="ps-versioning" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-blue-700/50">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">🔖 Versioning / Tagged Pointers</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">1. Tagged Pointer Básico</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Empaquetar puntero + versión en un solo valor atómico

estructura TaggedPointer<T> {
  pointer: T*              // Puntero real (48-52 bits)
  version: entero          // Versión/tag (12-16 bits)
}

// Empaquetar en un entero de 64 bits
función pack(ptr: T*, version: entero) -> uint64 {
  // Asumir que punteros usan 48 bits (arquitecturas x86-64)
  // Los 16 bits superiores se usan para versión
  ptrBits = (uint64)ptr & 0x0000FFFFFFFFFFFF
  versionBits = ((uint64)version & 0xFFFF) << 48
  retornar ptrBits | versionBits
}

// Desempaquetar
función unpack(tagged: uint64) -> (T*, entero) {
  ptr = (T*)(tagged & 0x0000FFFFFFFFFFFF)
  version = (entero)((tagged >> 48) & 0xFFFF)
  retornar (ptr, version)
}

// Uso con CAS
función compareAndSwap(location: Atomic<uint64>, 
                      expected: TaggedPointer<T>,
                      newPtr: T*) -> booleano {
  
  expectedPacked = pack(expected.pointer, expected.version)
  newVersion = expected.version + 1  // INCREMENTAR versión
  newPacked = pack(newPtr, newVersion)
  
  retornar location.compareAndSwap(expectedPacked, newPacked)
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">2. Lock-Free Stack con Versioning</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura Node<T> {
  value: T
  next: Node<T>*
}

estructura VersionedStack<T> {
  head: Atomic<uint64>  // Empaqueta (Node*, version)
}

función push(stack: VersionedStack<T>, value: T) {
  newNode = allocate(Node<T>)
  newNode.value = value
  
  mientras true:
    // Leer head actual
    currentPacked = stack.head.load()
    (currentHead, currentVersion) = unpack(currentPacked)
    
    // Preparar nuevo nodo
    newNode.next = currentHead
    
    // CAS con versión incrementada
    expectedPacked = currentPacked
    newVersion = currentVersion + 1
    newPacked = pack(newNode, newVersion)
    
    si stack.head.compareAndSwap(expectedPacked, newPacked):
      retornar  // Éxito
    
    // Fallo: otro thread modificó head, reintentar
}

función pop(stack: VersionedStack<T>) -> T {
  mientras true:
    currentPacked = stack.head.load()
    (currentHead, currentVersion) = unpack(currentPacked)
    
    si currentHead == null:
      throw EmptyStackException()
    
    // Leer siguiente nodo
    nextNode = currentHead.next
    
    // CAS con versión incrementada
    expectedPacked = currentPacked
    newVersion = currentVersion + 1
    newPacked = pack(nextNode, newVersion)
    
    si stack.head.compareAndSwap(expectedPacked, newPacked):
      value = currentHead.value
      // PROBLEMA: ¿Cuándo liberar currentHead?
      // Solución: combinar con hazard pointers o GC
      retornar value
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">3. Escenario ABA Resuelto</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Ejemplo: Stack con 3 nodos A→B→C

// Estado inicial: head = (A, version: 0)
head = pack(A, 0)

// Thread 1: pop() - lee (A, 0)
T1_expected = (A, 0)
T1_new = (B, 1)  // Quiere avanzar a B con versión 1

// Thread 2: pop() dos veces, luego push(A)
T2_pop1 = (A, 0) → (B, 1)    // Version incrementada a 1
T2_pop2 = (B, 1) → (C, 2)    // Version incrementada a 2
T2_push = (C, 2) → (A, 3)    // Version incrementada a 3

// Head ahora: (A, 3) ← DIFERENTE versión!

// Thread 1: intenta CAS con (A, 0) → (B, 1)
expected = pack(A, 0)
actual = pack(A, 3)
// CAS FALLA porque 0 != 3, aunque puntero sea A

// ✅ ABA DETECTADO: versión previene corrupción`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">4. Double-Width CAS (128-bit)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// En sistemas de 64-bit, usar CAS de 128-bit

estructura DoubleWord {
  pointer: uint64    // Puntero completo de 64-bit
  version: uint64    // Versión completa de 64-bit
}

// x86-64: CMPXCHG16B
función DCAS(location: Atomic<DoubleWord>,
             expected: DoubleWord,
             new: DoubleWord) -> booleano {
  
  // Atomic compare-and-swap de 128 bits
  retornar compareAndSwap128(
    location,
    expected.pointer, expected.version,
    new.pointer, new.version
  )
}

función push128(stack: VersionedStack, value: T) {
  newNode = allocate(Node)
  newNode.value = value
  
  mientras true:
    current = stack.head.load()  // Load 128-bit
    newNode.next = current.pointer
    
    new = DoubleWord {
      pointer: (uint64)newNode,
      version: current.version + 1
    }
    
    si DCAS(stack.head, current, new):
      retornar
}

// Ventajas:
// - Punteros completos de 64-bit (sin limitación de 48-bit)
// - Versión de 64-bit (prácticamente imposible overflow)
// - Más robusto para sistemas de larga duración`}
                        </pre>
                      </div>

                      <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                          <span className="font-bold">Ventajas:</span> Simple de implementar, bajo overhead, 
                          compatible con la mayoría de arquitecturas.<br/>
                          <span className="font-bold">Desventajas:</span> Versión puede hacer overflow (requiere 
                          cuidado), en 64-bit solo 48-52 bits para puntero, aún necesita resolver memory reclamation.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                          <span className="font-bold">Casos de Uso:</span> Lock-free stacks/queues, concurrent data structures,
                          memoria transaccional, sistemas embebidos, bibliotecas como libcds, Folly (Facebook).
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 2: Hazard Pointers */}
                <TabsContent value="ps-hazard" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-green-700/50">
                    <h3 className="text-xl font-bold text-green-400 mb-4">🛡️ Hazard Pointers</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">1. Estructura Básica</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Hazard Pointers: sistema para safe memory reclamation

estructura HazardPointer {
  pointer: Atomic<void*>     // Puntero "protegido"
  active: Atomic<booleano>   // Si está en uso
  threadId: entero           // Thread dueño
}

estructura HazardPointerRecord {
  hazards: Array<HazardPointer>  // K hazards por thread
  retireList: List<void*>        // Nodos a liberar
  K: entero = 2                  // Número de hazards por thread
}

// Pool global de hazard pointers
global hazardPointers: Array<HazardPointerRecord>

función acquire() -> HazardPointer* {
  threadId = currentThread().id
  record = hazardPointers[threadId]
  
  // Buscar slot libre
  para cada hp en record.hazards:
    si no hp.active.load():
      si hp.active.compareAndSwap(false, true):
        retornar &hp
  
  throw NoHazardPointerAvailable()
}

función release(hp: HazardPointer*) {
  hp.pointer.store(null)
  hp.active.store(false)
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">2. Proteger Punteros</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Proteger un puntero antes de desreferenciarlo

función protect(source: Atomic<Node*>, hp: HazardPointer*) -> Node* {
  mientras true:
    // Leer puntero
    ptr = source.load()
    
    // PUBLICAR en hazard pointer
    hp.pointer.store(ptr)
    
    // Verificar que no cambió (evitar race condition)
    si source.load() == ptr:
      retornar ptr  // Protegido exitosamente
    
    // Cambió: reintentar
}

// Uso en operación lock-free
función pop(stack: LockFreeStack) -> T {
  hp = acquire()  // Obtener hazard pointer
  
  intentar:
    mientras true:
      // Proteger head antes de desreferenciar
      head = protect(stack.head, hp)
      
      si head == null:
        throw EmptyStackException()
      
      next = head.next  // Safe: head está protegido
      
      si stack.head.compareAndSwap(head, next):
        value = head.value
        retire(head)  // Marcar para liberación posterior
        retornar value
  
  finalmente:
    release(hp)  // Liberar hazard pointer
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">3. Retire y Scan</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Marcar nodo para liberación (no liberar inmediatamente)

función retire(node: Node*) {
  threadId = currentThread().id
  record = hazardPointers[threadId]
  
  // Agregar a lista de retirados
  record.retireList.add(node)
  
  // Si lista crece mucho, intentar limpiar
  si record.retireList.size() >= THRESHOLD:
    scan()
}

// Escanear hazard pointers y liberar nodos seguros
función scan() {
  threadId = currentThread().id
  record = hazardPointers[threadId]
  
  // Paso 1: Recolectar todos los hazard pointers activos
  protectedPointers = Set<void*>()
  
  para cada threadRecord en hazardPointers:
    para cada hp en threadRecord.hazards:
      si hp.active.load():
        ptr = hp.pointer.load()
        si ptr != null:
          protectedPointers.add(ptr)
  
  // Paso 2: Liberar nodos no protegidos
  newRetireList = List<void*>()
  
  para cada node en record.retireList:
    si node no está en protectedPointers:
      free(node)  // ¡SAFE! Nadie lo está usando
    sino:
      newRetireList.add(node)  // Aún protegido, mantener
  
  record.retireList = newRetireList
}

// Constantes típicas
THRESHOLD = K * N * 2
// K = hazards por thread
// N = número de threads`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">4. Stack Completo con Hazard Pointers</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura SafeLockFreeStack<T> {
  head: Atomic<Node<T>*>
}

función push(stack: SafeLockFreeStack<T>, value: T) {
  newNode = allocate(Node<T>)
  newNode.value = value
  
  mientras true:
    currentHead = stack.head.load()
    newNode.next = currentHead
    
    si stack.head.compareAndSwap(currentHead, newNode):
      retornar  // Push exitoso, no necesita hazard pointer
}

función pop(stack: SafeLockFreeStack<T>) -> T {
  hp = acquire()  // Obtener hazard pointer
  
  intentar:
    mientras true:
      // PROTEGER head
      head = protect(stack.head, hp)
      
      si head == null:
        throw EmptyStackException()
      
      // Desreferenciar SAFE (protegido por hazard pointer)
      next = head.next
      value = head.value
      
      si stack.head.compareAndSwap(head, next):
        // Pop exitoso
        retire(head)  // Marcar para liberación
        retornar value
      
      // CAS falló: otro thread modificó, reintentar
  
  finalmente:
    release(hp)  // IMPORTANTE: siempre liberar
}

// ✅ Resuelve ABA: incluso si A→B→A ocurre,
//    el nodo original A no puede ser liberado
//    mientras esté protegido por hazard pointer`}
                        </pre>
                      </div>

                      <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                        <p className="text-sm text-green-200">
                          <span className="font-bold">Ventajas:</span> No requiere GC, control explícito de memoria,
                          predecible, sin pausas, funciona en C/C++.<br/>
                          <span className="font-bold">Desventajas:</span> Overhead de scan, complejidad de implementación,
                          requiere gestión cuidadosa de hazard pointers.
                        </p>
                      </div>

                      <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                        <p className="text-sm text-green-200">
                          <span className="font-bold">Casos de Uso:</span> Folly (Facebook), libcds, sistemas C++ lock-free,
                          bases de datos (RocksDB), high-frequency trading, sistemas embebidos sin GC.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 3: DCAS */}
                <TabsContent value="ps-dcas" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-purple-700/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">⚛️ DCAS (Double Compare-And-Swap)</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">1. DCAS en Hardware</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// DCAS: comparar y swapear DOS ubicaciones atómicamente

// x86-64: CMPXCHG16B (128-bit CAS)
función CMPXCHG16B(addr: *uint128,
                   expected1: uint64, expected2: uint64,
                   new1: uint64, new2: uint64) -> booleano {
  
  // Atomic: si *addr == (expected1, expected2)
  //         entonces *addr = (new1, new2)
  //         retornar true
  //         sino retornar false
  
  // Implementación en assembly (x86-64)
  asm {
    mov rax, expected1
    mov rdx, expected2
    mov rbx, new1
    mov rcx, new2
    lock cmpxchg16b [addr]
    setz al  // al = 1 si éxito
  }
}

// ARM: No tiene DCAS nativo
// PowerPC: LDARX/STDCX (LL/SC puede simular DCAS)

// ⚠️ DCAS verdadero es RARO en hardware
// La mayoría usa LL/SC o word-based CAS`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">2. DCAS para ABA con Versioning</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Usar DCAS para actualizar puntero + versión atómicamente

estructura VersionedPointer {
  pointer: uint64
  version: uint64
}

función DCAS_push(stack: Atomic<VersionedPointer>, value: T) {
  newNode = allocate(Node)
  newNode.value = value
  
  mientras true:
    current = stack.load()  // Lee ambos: pointer y version
    newNode.next = (Node*)current.pointer
    
    nuevo = VersionedPointer {
      pointer: (uint64)newNode,
      version: current.version + 1  // Incrementar versión
    }
    
    // DCAS: comparar (pointer, version) y actualizar ambos
    si CMPXCHG16B(&stack,
                  current.pointer, current.version,
                  nuevo.pointer, nuevo.version):
      retornar  // Éxito
    
    // Fallo: otro thread modificó, reintentar
}

// ✅ Ventaja sobre CAS simple:
//    - Puntero completo de 64-bit (no limitado a 48-bit)
//    - Versión completa de 64-bit (no overflow en práctica)
//    - Actualización atómica de ambos campos`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">3. Simular DCAS con MCAS</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// MCAS: Multi-word Compare-And-Swap
// Extender a N palabras (no solo 2)

estructura MCASDescriptor {
  status: Atomic<enum { UNDECIDED, SUCCEEDED, FAILED }>
  words: Array<{
    address: Atomic<uint64>*
    expected: uint64
    new: uint64
  }>
}

función MCAS(descriptor: MCASDescriptor) -> booleano {
  // Fase 1: LOCK todas las palabras
  para cada word en descriptor.words:
    mientras true:
      current = word.address.load()
      
      si current == word.expected:
        // Intentar "lockear" con puntero a descriptor
        si word.address.compareAndSwap(current, &descriptor):
          break  // Locked
      sino si current == &descriptor:
        break  // Ya locked por nosotros
      sino:
        // Valor cambió o locked por otro: ABORT
        descriptor.status.store(FAILED)
        unlock_all(descriptor)
        retornar false
  
  // Fase 2: COMMIT (todos locked exitosamente)
  descriptor.status.store(SUCCEEDED)
  
  para cada word en descriptor.words:
    word.address.store(word.new)
  
  retornar true
}

// Uso para stack lock-free
función MCAS_push(stack: Stack, value: T) {
  mientras true:
    head = stack.head.load()
    version = stack.version.load()
    
    descriptor = MCASDescriptor {
      status: UNDECIDED,
      words: [
        { address: &stack.head, expected: head, new: newNode },
        { address: &stack.version, expected: version, new: version + 1 }
      ]
    }
    
    si MCAS(descriptor):
      retornar
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">4. DCAS vs LL/SC</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Comparación de primitivas atómicas

tabla ComparacionPrimitivas:

| Primitiva | Arquitecturas      | ABA Protection | Complejidad |
|-----------|-------------------|----------------|-------------|
| CAS       | x86, ARM, POWER   | ❌ No          | Baja        |
| DCAS      | x86-64 (CMPXCHG16B)| ✅ Con version | Media       |
| LL/SC     | ARM, POWER, RISC-V | ✅ Sí          | Media       |
| MCAS      | Software emulado   | ✅ Sí          | Alta        |

// LL/SC (Load-Linked / Store-Conditional)
// Detecta CUALQUIER escritura entre LL y SC

función LL_SC_push(stack: Stack, value: T) {
  mientras true:
    // LL: Load-Linked (marca dirección para monitoreo)
    head = LoadLinked(&stack.head)
    newNode.next = head
    
    // SC: Store-Conditional (falla si hubo escritura)
    si StoreConditional(&stack.head, newNode):
      retornar  // Éxito
    
    // SC falló: otra escritura ocurrió (incluso A→B→A)
    // ✅ LL/SC DETECTA todos los cambios intermedios
}

// DCAS solo detecta cambios si usamos versioning
// LL/SC detecta cambios automáticamente`}
                        </pre>
                      </div>

                      <div className="p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                        <p className="text-sm text-purple-200">
                          <span className="font-bold">Ventajas:</span> Actualización atómica de múltiples palabras,
                          no requiere tagged pointers, más limpio conceptualmente.<br/>
                          <span className="font-bold">Desventajas:</span> DCAS hardware es raro (solo x86-64),
                          emulación por software tiene alto overhead, no portable.
                        </p>
                      </div>

                      <div className="p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                        <p className="text-sm text-purple-200">
                          <span className="font-bold">Casos de Uso:</span> Implementaciones académicas, algoritmos MCAS
                          (Harris et al.), sistemas experimentales, research en STM (Software Transactional Memory).
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 4: Garbage Collection */}
                <TabsContent value="ps-gc" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-yellow-700/50">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">🗑️ Garbage Collection</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">1. GC Resuelve ABA Automáticamente</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// En lenguajes con GC (Java, Go, C#), ABA se resuelve naturalmente

// Java: Lock-Free Stack sin worries de ABA
clase LockFreeStack<T> {
  AtomicReference<Node<T>> head = new AtomicReference<>(null);
  
  void push(T value) {
    Node<T> newNode = new Node<>(value);
    
    while (true) {
      Node<T> currentHead = head.get();
      newNode.next = currentHead;
      
      // CAS simple: no necesita versioning
      if (head.compareAndSet(currentHead, newNode)) {
        return;  // Éxito
      }
      // Fallo: reintentar
    }
  }
  
  T pop() {
    while (true) {
      Node<T> currentHead = head.get();
      
      if (currentHead == null) {
        throw new EmptyStackException();
      }
      
      Node<T> next = currentHead.next;
      
      // CAS: incluso si A→B→A ocurre...
      if (head.compareAndSet(currentHead, next)) {
        // ✅ SAFE: GC garantiza que el objeto A original
        //    no puede ser reusado hasta que nadie lo referencie
        return currentHead.value;
      }
    }
  }
}

// ¿Por qué funciona?
// - GC rastrea referencias activas
// - Nodo A original no se libera hasta que:
//   1. No hay referencias desde head
//   2. No hay referencias locales (stack frames)
//   3. Pasa GC cycle completo
// - Si A reaparece en head, es un NUEVO objeto A'
//   con diferente dirección de memoria
// - CAS compara direcciones físicas, no valores`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">2. Epoch-Based Reclamation (EBR)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Alternativa ligera a GC completo: Epoch-Based Reclamation

estructura EpochManager {
  globalEpoch: Atomic<entero> = 0
  threadEpochs: Array<Atomic<entero>>  // Epoch por thread
  retireLists: Map<entero, List<void*>>  // Nodos por epoch
}

función enterEpoch() {
  threadId = currentThread().id
  global = globalEpoch.load()
  threadEpochs[threadId].store(global)
}

función exitEpoch() {
  threadId = currentThread().id
  threadEpochs[threadId].store(INACTIVE)
}

función retire(node: void*) {
  currentEpoch = globalEpoch.load()
  retireLists[currentEpoch].add(node)
  
  tryAdvanceEpoch()
}

función tryAdvanceEpoch() {
  currentEpoch = globalEpoch.load()
  
  // Verificar si todos los threads salieron del epoch viejo
  minEpoch = currentEpoch
  para cada threadEpoch en threadEpochs:
    epoch = threadEpoch.load()
    si epoch != INACTIVE Y epoch < minEpoch:
      minEpoch = epoch
  
  // Si todos avanzaron, incrementar epoch global
  si minEpoch == currentEpoch:
    globalEpoch.compareAndSwap(currentEpoch, currentEpoch + 1)
    
    // Liberar nodos de epochs viejos (safe ahora)
    para epoch en 0 hasta currentEpoch - 2:
      para cada node en retireLists[epoch]:
        free(node)  // ✅ SAFE: nadie lo está usando
      retireLists[epoch].clear()
}

// Uso en operaciones lock-free
función pop(stack: Stack) -> T {
  enterEpoch()  // Anunciar que estamos en epoch actual
  
  intentar:
    mientras true:
      head = stack.head.load()
      si head == null:
        throw EmptyStackException()
      
      next = head.next
      si stack.head.compareAndSwap(head, next):
        value = head.value
        retire(head)  // Marcar para liberación futura
        retornar value
  finalmente:
    exitEpoch()  // Salir del epoch
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">3. Reference Counting Atómico</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Otra aproximación: reference counting con operaciones atómicas

estructura RefCountedNode<T> {
  value: T
  next: Atomic<RefCountedNode<T>*>
  refCount: Atomic<entero>
}

función addRef(node: RefCountedNode<T>*) {
  si node != null:
    node.refCount.fetchAdd(1)
}

función release(node: RefCountedNode<T>*) {
  si node != null:
    oldCount = node.refCount.fetchSub(1)
    si oldCount == 1:
      // Última referencia: liberar
      nextNode = node.next.load()
      release(nextNode)  // Recursivo
      free(node)
}

función pop(stack: Stack) -> T {
  mientras true:
    head = stack.head.load()
    si head == null:
      throw EmptyStackException()
    
    addRef(head)  // Incrementar refcount
    
    // Verificar que sigue siendo head (race condition)
    si stack.head.load() != head:
      release(head)
      continue  // Reintentar
    
    next = head.next.load()
    addRef(next)
    
    si stack.head.compareAndSwap(head, next):
      value = head.value
      release(head)  // Decrementar refcount
      release(head)  // Decrementar por la referencia que teníamos
      retornar value
    sino:
      release(next)
      release(head)
      // Reintentar
}

// ⚠️ Problemas:
// - Overhead alto de atomic increment/decrement
// - Ciclos de referencias (memory leak)
// - Complicado de implementar correctamente`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">4. Comparación de Métodos GC</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`tabla ComparacionGC:

| Método              | Overhead | Pausas | Complejidad | Lenguajes    |
|---------------------|----------|--------|-------------|--------------|
| GC Completo         | Alto     | Sí     | Baja*       | Java, Go, C# |
| Epoch-Based (EBR)   | Bajo     | No     | Media       | C/C++, Rust  |
| Hazard Pointers     | Medio    | No     | Alta        | C/C++        |
| Reference Counting  | Alto     | No     | Alta        | C++, Swift   |

// * Baja para el desarrollador; alta para implementación de GC

// Elegir método según requisitos:

función elegirMetodo(requisitos: Requisitos) -> Metodo {
  si requisitos.lenguaje == JAVA o GO:
    retornar GC_COMPLETO  // Viene gratis con el lenguaje
  
  si requisitos.latenciaCritica Y requisitos.sinPausas:
    retornar EPOCH_BASED  // Rust crossbeam-epoch
  
  si requisitos.controlExplicito:
    retornar HAZARD_POINTERS  // Folly, libcds
  
  si requisitos.compatibilidadSmartPointers:
    retornar REFERENCE_COUNTING  // C++ shared_ptr
  
  retornar GC_COMPLETO  // Default más seguro
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                        <p className="text-sm text-yellow-200">
                          <span className="font-bold">Ventajas:</span> Simple para el desarrollador, seguro por defecto,
                          no requiere gestión manual de memoria.<br/>
                          <span className="font-bold">Desventajas:</span> Pausas de GC (stop-the-world), overhead de memoria,
                          no disponible en C/C++ sin bibliotecas externas.
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                        <p className="text-sm text-yellow-200">
                          <span className="font-bold">Casos de Uso:</span> Java concurrent collections, Go sync package,
                          C# concurrent collections, Rust crossbeam (EBR), aplicaciones empresariales.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 5: LL/SC */}
                <TabsContent value="ps-llsc" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-cyan-700/50">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">🔗 Load-Linked / Store-Conditional</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-cyan-300 mb-3">1. Primitivas LL/SC</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// LL/SC: alternativa superior a CAS para prevenir ABA

// Load-Linked: leer valor y "marcar" dirección para monitoreo
función LL(address: *T) -> T {
  // Hardware registra:
  // 1. La dirección leída
  // 2. El valor leído
  // 3. Activa "link register" o "reservation"
  
  valor = *address
  CPU.linkRegister.address = address
  CPU.linkRegister.active = true
  retornar valor
}

// Store-Conditional: escribir solo si nadie más escribió
función SC(address: *T, newValue: T) -> booleano {
  // Hardware verifica:
  // 1. Link register activo?
  // 2. Dirección coincide?
  // 3. ¿Hubo alguna escritura desde LL?
  
  si no CPU.linkRegister.active:
    retornar false  // No hay LL previo
  
  si CPU.linkRegister.address != address:
    retornar false  // Dirección incorrecta
  
  si CPU.monitorDetectedWrite:
    // ✅ CLAVE: detecta CUALQUIER escritura, incluso A→B→A
    CPU.linkRegister.active = false
    retornar false
  
  // Todo OK: escribir
  *address = newValue
  CPU.linkRegister.active = false
  retornar true  // Éxito
}

// ARM: LDREX/STREX
// PowerPC: LDARX/STDCX
// RISC-V: LR/SC
// MIPS: LL/SC`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-cyan-300 mb-3">2. Stack con LL/SC</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Lock-Free Stack usando LL/SC (sin versioning!)

estructura Node<T> {
  value: T
  next: Node<T>*
}

función push(stack: Stack<T>, value: T) {
  newNode = allocate(Node<T>)
  newNode.value = value
  
  mientras true:
    // LL: load-linked del head
    currentHead = LL(&stack.head)
    newNode.next = currentHead
    
    // SC: store-conditional del nuevo head
    si SC(&stack.head, newNode):
      retornar  // Éxito
    
    // SC falló: hubo escritura intermedia, reintentar
}

función pop(stack: Stack<T>) -> T {
  mientras true:
    // LL: load-linked del head
    head = LL(&stack.head)
    
    si head == null:
      throw EmptyStackException()
    
    // Leer siguiente (no necesita protección especial)
    next = head.next
    value = head.value
    
    // SC: intentar actualizar head
    si SC(&stack.head, next):
      // ✅ Éxito: garantizado que nadie escribió
      //    entre LL y SC, incluso si A→B→A ocurrió
      free(head)  // SAFE: podemos liberar inmediatamente
      retornar value
    
    // SC falló: otra escritura, reintentar
}

// ✅ Ventaja sobre CAS:
//    - No necesita versioning/tagging
//    - Detecta automáticamente A→B→A
//    - Más simple conceptualmente`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-cyan-300 mb-3">3. LL/SC vs CAS</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Comparación detallada

// Escenario: A→B→A

// Con CAS (sin versioning):
head = stack.head.load()  // Lee A
// ... Thread 2: pop A, pop B, push A (mismo puntero)
// head sigue siendo A (reusado)
si stack.head.CAS(A, next):
  // ❌ ÉXITO INCORRECTO: no detectó cambios intermedios
  // Potencial corrupción de memoria

// Con LL/SC:
head = LL(&stack.head)  // Lee A, activa monitor
// ... Thread 2: pop A (ESCRITURA detectada por hardware)
si SC(&stack.head, next):
  // ✅ FALLA: hardware detectó la escritura
  // Incluso si valor volvió a A

// Tabla comparativa:

tabla CAS_vs_LLSC:

| Aspecto          | CAS                    | LL/SC                  |
|------------------|------------------------|------------------------|
| ABA Detection    | ❌ No (sin versioning) | ✅ Sí (automático)     |
| Versioning       | ✅ Requerido           | ❌ No requerido        |
| Spurious Fails   | ❌ No                  | ✅ Sí (context switch) |
| Portabilidad     | ✅ Alta (x86, ARM)     | ⚠️ Media (ARM, POWER)  |
| Complejidad      | Media (con tagging)    | Baja                   |
| Memory Order     | Debe especificarse     | Automático             |`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-cyan-300 mb-3">4. Implementación en ARM64</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// ARM64: LDXR/STXR (Load-Exclusive/Store-Exclusive)

// Assembly ARM64 para push
función push_arm64(stack: *Node, newNode: *Node) {
  asm {
retry:
    // LDXR: Load-Exclusive (equivalente a LL)
    ldxr    x1, [x0]        // x1 = *stack, marca exclusiva
    str     x1, [newNode]   // newNode->next = x1
    
    // STXR: Store-Exclusive (equivalente a SC)
    stxr    w2, newNode, [x0]  // *stack = newNode si exclusiva
    cbnz    w2, retry       // Si w2 != 0, falló, retry
    
    // w2 == 0: éxito
    ret
  }
}

// C con intrinsics
función push_intrinsic(stack: _Atomic(Node*), newNode: Node*) {
  mientras true:
    // __atomic_load_exclusive
    currentHead = __builtin_arm_ldrex(&stack)
    newNode->next = currentHead
    
    // __atomic_store_exclusive
    si __builtin_arm_strex(newNode, &stack) == 0:
      retornar  // Éxito
    
    // Falló: reintentar
}

// RISC-V: LR.W/SC.W
función pop_riscv(stack: *Node) -> Node* {
  asm {
retry:
    lr.w.aq   a1, (a0)      // a1 = *stack, acquire semantics
    beqz      a1, empty     // if null, empty
    
    lw        a2, 0(a1)     // a2 = head->next
    sc.w.rl   a3, a2, (a0)  // *stack = a2, release semantics
    bnez      a3, retry     // if failed, retry
    
    mv        a0, a1        // return head
    ret
    
empty:
    li        a0, 0
    ret
  }
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-cyan-300 mb-3">5. Limitaciones y Spurious Failures</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// ⚠️ LL/SC puede fallar espuriamente (spurious failure)

// Causas de spurious failure:
// 1. Context switch entre LL y SC
// 2. Caché invalidation
// 3. Otras escrituras en la misma cache line
// 4. Interrupciones
// 5. Implementación conservadora del hardware

función pop_con_spurious(stack: Stack) -> T {
  reintentos = 0
  
  mientras true:
    head = LL(&stack.head)
    
    si head == null:
      throw EmptyStackException()
    
    next = head.next
    
    si SC(&stack.head, next):
      retornar head.value  // Éxito
    
    reintentos++
    si reintentos > MAX_RETRIES:
      // Posible livelock: demasiados spurious failures
      backoff()  // Esperar antes de reintentar
      reintentos = 0
}

// Mitigación: exponential backoff
función backoff() {
  sleepTime = random(1, 1000) * 2^reintentos
  sleep(min(sleepTime, MAX_SLEEP))
}

// Recomendación: minimizar trabajo entre LL y SC
función pop_optimizado(stack: Stack) -> T {
  mientras true:
    head = LL(&stack.head)
    
    si head == null:
      throw EmptyStackException()
    
    // ⚠️ MINIMIZAR código entre LL y SC
    // No llamar funciones, no hacer I/O, no locks
    
    si SC(&stack.head, head.next):
      // Hacer trabajo pesado DESPUÉS de SC
      value = head.value
      free(head)
      retornar value
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-cyan-900/30 border border-cyan-700/50 rounded-lg">
                        <p className="text-sm text-cyan-200">
                          <span className="font-bold">Ventajas:</span> Detecta ABA automáticamente, no requiere versioning,
                          más simple que CAS+tagging, semantics más limpias.<br/>
                          <span className="font-bold">Desventajas:</span> Spurious failures requieren retry loops, no disponible
                          en x86, puede tener más contención que CAS, implementación depende del hardware.
                        </p>
                      </div>

                      <div className="p-4 bg-cyan-900/30 border border-cyan-700/50 rounded-lg">
                        <p className="text-sm text-cyan-200">
                          <span className="font-bold">Casos de Uso:</span> ARM-based systems (mobile, embedded), PowerPC servers,
                          RISC-V systems, algoritmos lock-free académicos, investigación en arquitecturas de computadoras.
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
              <Tabs defaultValue="demo-versioning" className="px-6 pb-6">
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-5 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="demo-versioning">🔖 Versioning</TabsTrigger>
                    <TabsTrigger value="demo-hazard">🛡️ Hazard</TabsTrigger>
                    <TabsTrigger value="demo-dcas">⚛️ DCAS</TabsTrigger>
                    <TabsTrigger value="demo-gc">🗑️ GC</TabsTrigger>
                    <TabsTrigger value="demo-llsc">🔗 LL/SC</TabsTrigger>
                  </TabsList>
                </div>

                {/* Demo 1: Versioning/Tagging */}
                <TabsContent value="demo-versioning" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-blue-700/50">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">Demo: Versioning Detecta ABA</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setVersioningRunning(!versioningRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            versioningRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {versioningRunning ? (
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
                          onClick={resetVersioning}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {versioningSpeed}ms
                        </label>
                        <Slider
                          value={[versioningSpeed]}
                          onValueChange={([value]) => setVersioningSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización del Stack */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-blue-300 mb-3">Stack State</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">HEAD →</span>
                        {versioningStack.head && (
                          <div className="flex items-center gap-2">
                            {versioningStack.nodes
                              .filter(n => {
                                let current: string | null = versioningStack.head;
                                while (current) {
                                  if (current === n.id) return true;
                                  const node = versioningStack.nodes.find(x => x.id === current);
                                  current = node?.next || null;
                                }
                                return false;
                              })
                              .map((node, idx) => (
                                <div key={node.id} className="flex items-center gap-2">
                                  <div className="bg-blue-600 px-3 py-2 rounded">
                                    <span className="font-bold">{node.value}</span>
                                    <span className="text-xs text-blue-200 ml-1">
                                      (v{node.version})
                                    </span>
                                  </div>
                                  {idx < versioningStack.nodes.length - 1 &&
                                    node.next && (
                                      <span className="text-gray-400">→</span>
                                    )}
                                </div>
                              ))}
                          </div>
                        )}
                        {!versioningStack.head && (
                          <span className="text-gray-500 italic">null</span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-blue-300">
                        Global Version: {versioningStack.version}
                      </div>
                    </div>

                    {/* Log de Eventos */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-blue-300 mb-3">Event Log</h4>
                      <div
                        ref={versioningLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {versioningLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Hazard Pointers */}
                <TabsContent value="demo-hazard" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-green-700/50">
                    <h3 className="text-xl font-bold text-green-400 mb-4">Demo: Hazard Pointers</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setHazardRunning(!hazardRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            hazardRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {hazardRunning ? (
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
                          onClick={resetHazard}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {hazardSpeed}ms
                        </label>
                        <Slider
                          value={[hazardSpeed]}
                          onValueChange={([value]) => setHazardSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Hazard Pointers */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-green-300 mb-3">Hazard Pointers</h4>
                      <div className="flex gap-2">
                        {hazardPointers.length > 0 ? (
                          hazardPointers.map((hp, idx) => (
                            <div
                              key={idx}
                              className="bg-green-600 px-3 py-2 rounded font-bold"
                            >
                              HP[{idx}] = {hp}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">No hay hazard pointers activos</span>
                        )}
                      </div>
                    </div>

                    {/* Retire List */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-green-300 mb-3">Retire List</h4>
                      <div className="flex gap-2">
                        {retireList.length > 0 ? (
                          retireList.map((node, idx) => (
                            <div
                              key={idx}
                              className="bg-orange-600 px-3 py-2 rounded font-bold"
                            >
                              {node}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">Lista vacía</span>
                        )}
                      </div>
                    </div>

                    {/* Stack */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-green-300 mb-3">Stack</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">HEAD →</span>
                        {hazardStack.head && (
                          <div className="flex items-center gap-2">
                            {hazardStack.nodes
                              .filter(n => {
                                let current: string | null = hazardStack.head;
                                while (current) {
                                  if (current === n.id) return true;
                                  const node = hazardStack.nodes.find(x => x.id === current);
                                  current = node?.next || null;
                                }
                                return false;
                              })
                              .map((node, idx, arr) => (
                                <div key={node.id} className="flex items-center gap-2">
                                  <div
                                    className={`px-3 py-2 rounded ${
                                      hazardPointers.includes(node.id)
                                        ? "bg-green-600 ring-2 ring-green-400"
                                        : "bg-green-700"
                                    }`}
                                  >
                                    <span className="font-bold">{node.value}</span>
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <span className="text-gray-400">→</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-green-300 mb-3">Event Log</h4>
                      <div
                        ref={hazardLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {hazardLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: DCAS */}
                <TabsContent value="demo-dcas" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-purple-700/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Demo: DCAS (128-bit CAS)</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setDcasRunning(!dcasRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            dcasRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {dcasRunning ? (
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
                          onClick={resetDcas}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {dcasSpeed}ms
                        </label>
                        <Slider
                          value={[dcasSpeed]}
                          onValueChange={([value]) => setDcasSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* DCAS Operation */}
                    {dcasOperation.pointer1 && (
                      <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">DCAS Operation</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-purple-900/30 p-3 rounded">
                            <div className="text-purple-300 font-bold mb-1">Expected</div>
                            <div>Pointer: {dcasOperation.pointer1}</div>
                            <div>Version: {dcasOperation.version1}</div>
                          </div>
                          <div className="bg-purple-900/30 p-3 rounded">
                            <div className="text-purple-300 font-bold mb-1">New</div>
                            <div>Pointer: {dcasOperation.pointer2 || "null"}</div>
                            <div>Version: {dcasOperation.version2}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stack */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-purple-300 mb-3">Stack State</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">HEAD →</span>
                        {dcasStack.head ? (
                          <div className="flex items-center gap-2">
                            {dcasStack.nodes
                              .filter(n => {
                                let current: string | null = dcasStack.head;
                                while (current) {
                                  if (current === n.id) return true;
                                  const node = dcasStack.nodes.find(x => x.id === current);
                                  current = node?.next || null;
                                }
                                return false;
                              })
                              .map((node, idx, arr) => (
                                <div key={node.id} className="flex items-center gap-2">
                                  <div className="bg-purple-600 px-3 py-2 rounded">
                                    <span className="font-bold">{node.value}</span>
                                    <span className="text-xs text-purple-200 ml-1">
                                      (v{node.version})
                                    </span>
                                  </div>
                                  {idx < arr.length - 1 && node.next && (
                                    <span className="text-gray-400">→</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">null</span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-purple-300">
                        Version: {dcasStack.version}
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-purple-300 mb-3">Event Log</h4>
                      <div
                        ref={dcasLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {dcasLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Garbage Collection (EBR) */}
                <TabsContent value="demo-gc" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-yellow-700/50">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">Demo: Epoch-Based Reclamation</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setGcRunning(!gcRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            gcRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }`}
                        >
                          {gcRunning ? (
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
                          onClick={resetGc}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {gcSpeed}ms
                        </label>
                        <Slider
                          value={[gcSpeed]}
                          onValueChange={([value]) => setGcSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Epoch Info */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-yellow-300 mb-3">Epoch Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-yellow-300 font-bold">Global Epoch:</span>{" "}
                          {globalEpoch}
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <span className="text-yellow-300 font-bold">Thread 1:</span>{" "}
                            {threadEpochs[0] === -1 ? "inactive" : threadEpochs[0]}
                          </div>
                          <div>
                            <span className="text-yellow-300 font-bold">Thread 2:</span>{" "}
                            {threadEpochs[1] === -1 ? "inactive" : threadEpochs[1]}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Retire Lists por Epoch */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-yellow-300 mb-3">Retire Lists por Epoch</h4>
                      {epochRetireList.size > 0 ? (
                        <div className="space-y-2">
                          {Array.from(epochRetireList.entries()).map(([epoch, nodes]) => (
                            <div key={epoch} className="bg-yellow-900/30 p-2 rounded">
                              <span className="text-yellow-300 font-bold">Epoch {epoch}:</span>{" "}
                              {nodes.join(", ")}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No hay nodos pendientes</span>
                      )}
                    </div>

                    {/* Stack */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-yellow-300 mb-3">Stack</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">HEAD →</span>
                        {gcStack.head && (
                          <div className="flex items-center gap-2">
                            {gcStack.nodes
                              .filter(n => {
                                let current: string | null = gcStack.head;
                                while (current) {
                                  if (current === n.id) return true;
                                  const node = gcStack.nodes.find(x => x.id === current);
                                  current = node?.next || null;
                                }
                                return false;
                              })
                              .map((node, idx, arr) => (
                                <div key={node.id} className="flex items-center gap-2">
                                  <div className="bg-yellow-600 px-3 py-2 rounded font-bold">
                                    {node.value}
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <span className="text-gray-400">→</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-yellow-300 mb-3">Event Log</h4>
                      <div
                        ref={gcLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {gcLog.map((log, idx) => (
                          <div key={idx} className="text-gray-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: LL/SC */}
                <TabsContent value="demo-llsc" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-cyan-700/50">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">Demo: Load-Linked / Store-Conditional</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => setLlscRunning(!llscRunning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            llscRunning
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-cyan-600 hover:bg-cyan-700"
                          }`}
                        >
                          {llscRunning ? (
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
                          onClick={resetLlsc}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                        >
                          <RotateCcw className="size-4" />
                          Reset
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Velocidad: {llscSpeed}ms
                        </label>
                        <Slider
                          value={[llscSpeed]}
                          onValueChange={([value]) => setLlscSpeed(value)}
                          min={200}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Link Register */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-cyan-300 mb-3">Link Register (Hardware)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-bold">Active:</span>
                          <span
                            className={`px-2 py-1 rounded font-bold ${
                              linkRegister.active
                                ? "bg-green-600 text-white"
                                : "bg-gray-600 text-gray-300"
                            }`}
                          >
                            {linkRegister.active ? "YES" : "NO"}
                          </span>
                        </div>
                        <div>
                          <span className="text-cyan-300 font-bold">Address:</span>{" "}
                          {linkRegister.address || "none"}
                        </div>
                        <div>
                          <span className="text-cyan-300 font-bold">Value:</span>{" "}
                          {linkRegister.value || "none"}
                        </div>
                      </div>
                    </div>

                    {/* Stack */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-bold text-cyan-300 mb-3">Stack</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">HEAD →</span>
                        {llscStack.head ? (
                          <div className="flex items-center gap-2">
                            {llscStack.nodes
                              .filter(n => {
                                let current: string | null = llscStack.head;
                                while (current) {
                                  if (current === n.id) return true;
                                  const node = llscStack.nodes.find(x => x.id === current);
                                  current = node?.next || null;
                                }
                                return false;
                              })
                              .map((node, idx, arr) => (
                                <div key={node.id} className="flex items-center gap-2">
                                  <div
                                    className={`px-3 py-2 rounded font-bold ${
                                      linkRegister.active && linkRegister.value === node.id
                                        ? "bg-cyan-600 ring-2 ring-cyan-400"
                                        : "bg-cyan-700"
                                    }`}
                                  >
                                    {node.value}
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <span className="text-gray-400">→</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">null</span>
                        )}
                      </div>
                    </div>

                    {/* Log */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-cyan-300 mb-3">Event Log</h4>
                      <div
                        ref={llscLogRef}
                        className="bg-black/50 rounded p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto"
                      >
                        {llscLog.map((log, idx) => (
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
  );
}