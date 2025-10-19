import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Code, Play, Pause, RotateCcw, TrendingDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface LogEntry {
  time: number;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export default function FalseSharing() {
  // ==================== DEMO 1: Cache Line Padding ====================
  const [paddingRunning, setPaddingRunning] = useState(false);
  const [paddingSpeed, setPaddingSpeed] = useState(500);
  const [paddingPhase, setPaddingPhase] = useState(0);
  const [paddingCounters, setPaddingCounters] = useState([
    { id: 0, value: 0, thread: 0, padded: false, cacheLine: 0 },
    { id: 1, value: 0, thread: 1, padded: false, cacheLine: 0 },
    { id: 2, value: 0, thread: 0, padded: true, cacheLine: 0 },
    { id: 3, value: 0, thread: 1, padded: true, cacheLine: 1 },
  ]);
  const [paddingCacheInvalidations, setPaddingCacheInvalidations] = useState({ withoutPadding: 0, withPadding: 0 });
  const [paddingLogs, setPaddingLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 2: Alignment Directives ====================
  const [alignmentRunning, setAlignmentRunning] = useState(false);
  const [alignmentSpeed, setAlignmentSpeed] = useState(500);
  const [alignmentPhase, setAlignmentPhase] = useState(0);
  // alignmentStructures removed (not used) to avoid unused-variable warnings
  const [alignmentCrossings, setAlignmentCrossings] = useState({ unaligned: 0, aligned: 0 });
  const [alignmentLogs, setAlignmentLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 3: Thread-Local Accumulators ====================
  const [accumulatorRunning, setAccumulatorRunning] = useState(false);
  const [accumulatorSpeed, setAccumulatorSpeed] = useState(500);
  const [accumulatorPhase, setAccumulatorPhase] = useState(0);
  const [accumulatorThreads, setAccumulatorThreads] = useState([
    { id: 0, localSum: 0, writes: 0, useLocal: false },
    { id: 1, localSum: 0, writes: 0, useLocal: false },
    { id: 2, localSum: 0, writes: 0, useLocal: true },
    { id: 3, localSum: 0, writes: 0, useLocal: true },
  ]);
  const [accumulatorGlobalSum, setAccumulatorGlobalSum] = useState({ shared: 0, threadLocal: 0 });
  const [accumulatorContentions, setAccumulatorContentions] = useState(0);
  const [accumulatorLogs, setAccumulatorLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 4: Structure Reorganization ====================
  const [structureRunning, setStructureRunning] = useState(false);
  const [structureSpeed, setStructureSpeed] = useState(500);
  const [structurePhase, setStructurePhase] = useState(0);
  // structureLayouts removed (not used) to avoid unused-variable warnings
  const [structureAccesses, setStructureAccesses] = useState({ badLayout: 0, goodLayout: 0 });
  const [structureLogs, setStructureLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 5: Cache-Aware Data Structures ====================
  const [cacheAwareRunning, setCacheAwareRunning] = useState(false);
  const [cacheAwareSpeed, setCacheAwareSpeed] = useState(500);
  const [cacheAwarePhase, setCacheAwarePhase] = useState(0);
  const [cacheAwareArrays, setCacheAwareArrays] = useState([
    { name: "Array of Structs (AoS)", layout: "aos", cacheHits: 0, cacheMisses: 0 },
    { name: "Struct of Arrays (SoA)", layout: "soa", cacheHits: 0, cacheMisses: 0 },
  ]);
  const [cacheAwareLogs, setCacheAwareLogs] = useState<LogEntry[]>([]);

  // Refs para auto-scroll
  const paddingLogsRef = useRef<HTMLDivElement>(null);
  const alignmentLogsRef = useRef<HTMLDivElement>(null);
  const accumulatorLogsRef = useRef<HTMLDivElement>(null);
  const structureLogsRef = useRef<HTMLDivElement>(null);
  const cacheAwareLogsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    paddingLogsRef.current?.scrollTo({ top: paddingLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [paddingLogs]);

  useEffect(() => {
    alignmentLogsRef.current?.scrollTo({ top: alignmentLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [alignmentLogs]);

  useEffect(() => {
    accumulatorLogsRef.current?.scrollTo({ top: accumulatorLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [accumulatorLogs]);

  useEffect(() => {
    structureLogsRef.current?.scrollTo({ top: structureLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [structureLogs]);

  useEffect(() => {
    cacheAwareLogsRef.current?.scrollTo({ top: cacheAwareLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [cacheAwareLogs]);

  // ==================== SIMULACIÓN 1: Cache Line Padding ====================
  useEffect(() => {
    if (!paddingRunning) return;

    const timer = setTimeout(() => {
      setPaddingPhase((prev) => {
        const next = (prev + 1) % 10;

        if (next === 0) {
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Iniciando simulación de Cache Line Padding", type: "info" }]);
        } else if (next === 1) {
          // Sin padding: Thread 0 escribe counter 0
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "❌ SIN PADDING: Thread 0 escribe counter[0]", type: "warning" }]);
          setPaddingCounters((c) => c.map((cnt) => (cnt.id === 0 ? { ...cnt, value: cnt.value + 1 } : cnt)));
        } else if (next === 2) {
          // Sin padding: Thread 1 escribe counter 1 → INVALIDACIÓN
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "🚨 Thread 1 escribe counter[1] → INVALIDA cache de Thread 0 (misma línea)", type: "error" }]);
          setPaddingCounters((c) => c.map((cnt) => (cnt.id === 1 ? { ...cnt, value: cnt.value + 1 } : cnt)));
          setPaddingCacheInvalidations((inv) => ({ ...inv, withoutPadding: inv.withoutPadding + 1 }));
        } else if (next === 3) {
          // Thread 0 intenta leer → cache miss
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ Thread 0 lee counter[0] → CACHE MISS (false sharing)", type: "warning" }]);
          setPaddingCacheInvalidations((inv) => ({ ...inv, withoutPadding: inv.withoutPadding + 1 }));
        } else if (next === 4) {
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "---", type: "info" }]);
        } else if (next === 5) {
          // Con padding: Thread 0 escribe counter 2
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "✅ CON PADDING: Thread 0 escribe counter[2] (línea 0)", type: "info" }]);
          setPaddingCounters((c) => c.map((cnt) => (cnt.id === 2 ? { ...cnt, value: cnt.value + 1 } : cnt)));
        } else if (next === 6) {
          // Con padding: Thread 1 escribe counter 3 → NO INVALIDACIÓN
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread 1 escribe counter[3] (línea 1) → NO invalida cache de Thread 0", type: "success" }]);
          setPaddingCounters((c) => c.map((cnt) => (cnt.id === 3 ? { ...cnt, value: cnt.value + 1 } : cnt)));
        } else if (next === 7) {
          // Thread 0 lee sin problema
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread 0 lee counter[2] → CACHE HIT (líneas separadas)", type: "success" }]);
        } else if (next === 8) {
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: `📊 Invalidaciones: Sin padding=${paddingCacheInvalidations.withoutPadding}, Con padding=${paddingCacheInvalidations.withPadding}`, type: "info" }]);
        } else if (next === 9) {
          setPaddingLogs((logs) => [...logs, { time: Date.now(), message: "✅ Padding elimina false sharing colocando datos en diferentes cache lines", type: "success" }]);
        }

        return next;
      });
    }, paddingSpeed);

    return () => clearTimeout(timer);
  }, [paddingRunning, paddingPhase, paddingSpeed, paddingCacheInvalidations]);

  // ==================== SIMULACIÓN 2: Alignment Directives ====================
  useEffect(() => {
    if (!alignmentRunning) return;

    const timer = setTimeout(() => {
      setAlignmentPhase((prev) => {
        const next = (prev + 1) % 8;

        if (next === 0) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Iniciando simulación de Alignment Directives", type: "info" }]);
        } else if (next === 1) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: "❌ UNALIGNED: Struct en offset 0 (size=12 bytes)", type: "warning" }]);
        } else if (next === 2) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: "❌ Struct en offset 12 → CRUZA línea de cache (12-24)", type: "error" }]);
          setAlignmentCrossings((c) => ({ ...c, unaligned: c.unaligned + 1 }));
        } else if (next === 3) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ Acceso requiere 2 lecturas de cache (cache line crossing)", type: "warning" }]);
          setAlignmentCrossings((c) => ({ ...c, unaligned: c.unaligned + 1 }));
        } else if (next === 4) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: "---", type: "info" }]);
        } else if (next === 5) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: "✅ ALIGNED: Struct en offset 0 (aligned to 64 bytes)", type: "success" }]);
        } else if (next === 6) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: "✅ Struct en offset 64 → En cache line separada", type: "success" }]);
        } else if (next === 7) {
          setAlignmentLogs((logs) => [...logs, { time: Date.now(), message: `✅ Alignment elimina crossings: Unaligned=${alignmentCrossings.unaligned}, Aligned=${alignmentCrossings.aligned}`, type: "success" }]);
        }

        return next;
      });
    }, alignmentSpeed);

    return () => clearTimeout(timer);
  }, [alignmentRunning, alignmentPhase, alignmentSpeed, alignmentCrossings]);

  // ==================== SIMULACIÓN 3: Thread-Local Accumulators ====================
  useEffect(() => {
    if (!accumulatorRunning) return;

    const timer = setTimeout(() => {
      setAccumulatorPhase((prev) => {
        const next = (prev + 1) % 12;

        if (next === 0) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Iniciando Thread-Local Accumulators", type: "info" }]);
        } else if (next === 1) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "❌ SHARED COUNTER: Thread 0 incrementa global", type: "warning" }]);
          setAccumulatorThreads((t) => t.map((th) => (th.id === 0 ? { ...th, writes: th.writes + 1 } : th)));
          setAccumulatorGlobalSum((s) => ({ ...s, shared: s.shared + 1 }));
          setAccumulatorContentions((c) => c + 1);
        } else if (next === 2) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "🚨 Thread 1 incrementa global → CONTENCIÓN (false sharing)", type: "error" }]);
          setAccumulatorThreads((t) => t.map((th) => (th.id === 1 ? { ...th, writes: th.writes + 1 } : th)));
          setAccumulatorGlobalSum((s) => ({ ...s, shared: s.shared + 1 }));
          setAccumulatorContentions((c) => c + 1);
        } else if (next === 3) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ Ambos threads escriben mismo contador → alta contención", type: "warning" }]);
          setAccumulatorContentions((c) => c + 1);
        } else if (next === 4) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "---", type: "info" }]);
        } else if (next === 5) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "✅ THREAD-LOCAL: Thread 2 incrementa LOCAL accumulator", type: "success" }]);
          setAccumulatorThreads((t) => t.map((th) => (th.id === 2 ? { ...th, localSum: th.localSum + 1, writes: th.writes + 1 } : th)));
        } else if (next === 6) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread 3 incrementa SU local accumulator (sin contención)", type: "success" }]);
          setAccumulatorThreads((t) => t.map((th) => (th.id === 3 ? { ...th, localSum: th.localSum + 1, writes: th.writes + 1 } : th)));
        } else if (next === 7) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "✅ Threads 2 y 3 trabajan en PARALELO sin interferencia", type: "success" }]);
          setAccumulatorThreads((t) =>
            t.map((th) =>
              th.id === 2 || th.id === 3 ? { ...th, localSum: th.localSum + 1, writes: th.writes + 1 } : th
            )
          );
        } else if (next === 8) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 finaliza: local_sum = " + (accumulatorThreads[2]?.localSum || 0), type: "info" }]);
        } else if (next === 9) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: "Thread 3 finaliza: local_sum = " + (accumulatorThreads[3]?.localSum || 0), type: "info" }]);
        } else if (next === 10) {
          const total = (accumulatorThreads[2]?.localSum || 0) + (accumulatorThreads[3]?.localSum || 0);
          setAccumulatorGlobalSum((s) => ({ ...s, threadLocal: total }));
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: `✅ Merge final: global = ${total} (1 sola escritura compartida)`, type: "success" }]);
        } else if (next === 11) {
          setAccumulatorLogs((logs) => [...logs, { time: Date.now(), message: `📊 Contentiones: Shared=${accumulatorContentions}, Thread-local=0`, type: "success" }]);
        }

        return next;
      });
    }, accumulatorSpeed);

    return () => clearTimeout(timer);
  }, [accumulatorRunning, accumulatorPhase, accumulatorSpeed, accumulatorContentions, accumulatorThreads]);

  // ==================== SIMULACIÓN 4: Structure Reorganization ====================
  useEffect(() => {
    if (!structureRunning) return;

    const timer = setTimeout(() => {
      setStructurePhase((prev) => {
        const next = (prev + 1) % 8;

        if (next === 0) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Iniciando Structure Reorganization", type: "info" }]);
        } else if (next === 1) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: "❌ BAD LAYOUT: [readFreq | writeFreq1 | writeFreq2 | readOnly]", type: "warning" }]);
        } else if (next === 2) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: "🚨 Thread A lee 'readFreq', Thread B escribe 'writeFreq1'", type: "error" }]);
          setStructureAccesses((a) => ({ ...a, badLayout: a.badLayout + 1 }));
        } else if (next === 3) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ FALSE SHARING: Datos read-frequently mezclados con write-frequently", type: "warning" }]);
          setStructureAccesses((a) => ({ ...a, badLayout: a.badLayout + 1 }));
        } else if (next === 4) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: "---", type: "info" }]);
        } else if (next === 5) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: "✅ GOOD LAYOUT: [readFreq | readOnly] [writeFreq1 | writeFreq2]", type: "success" }]);
        } else if (next === 6) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread A lee 'readFreq', Thread B escribe 'writeFreq1' → Sin interferencia", type: "success" }]);
          setStructureAccesses((a) => ({ ...a, goodLayout: a.goodLayout + 1 }));
        } else if (next === 7) {
          setStructureLogs((logs) => [...logs, { time: Date.now(), message: `✅ Reorganización agrupa campos por patrón de acceso: Bad=${structureAccesses.badLayout} invalidaciones, Good=${structureAccesses.goodLayout}`, type: "success" }]);
        }

        return next;
      });
    }, structureSpeed);

    return () => clearTimeout(timer);
  }, [structureRunning, structurePhase, structureSpeed, structureAccesses]);

  // ==================== SIMULACIÓN 5: Cache-Aware Data Structures ====================
  useEffect(() => {
    if (!cacheAwareRunning) return;

    const timer = setTimeout(() => {
      setCacheAwarePhase((prev) => {
        const next = (prev + 1) % 10;

        if (next === 0) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Iniciando Cache-Aware Data Structures (AoS vs SoA)", type: "info" }]);
        } else if (next === 1) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "❌ AoS: Acceso a campo 'x' de 4 elementos", type: "warning" }]);
        } else if (next === 2) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ Elementos dispersos en memoria → múltiples cache misses", type: "warning" }]);
          setCacheAwareArrays((a) =>
            a.map((arr) => (arr.layout === "aos" ? { ...arr, cacheMisses: arr.cacheMisses + 3 } : arr))
          );
        } else if (next === 3) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "AoS carga structs completos (desperdicia ancho de banda)", type: "info" }]);
          setCacheAwareArrays((a) =>
            a.map((arr) => (arr.layout === "aos" ? { ...arr, cacheHits: arr.cacheHits + 1 } : arr))
          );
        } else if (next === 4) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "---", type: "info" }]);
        } else if (next === 5) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "✅ SoA: Acceso a array 'x[]' de 4 elementos", type: "success" }]);
        } else if (next === 6) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "✅ Elementos contiguos en memoria → 1 cache line", type: "success" }]);
          setCacheAwareArrays((a) =>
            a.map((arr) => (arr.layout === "soa" ? { ...arr, cacheHits: arr.cacheHits + 4 } : arr))
          );
        } else if (next === 7) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "✅ SoA carga SOLO datos necesarios (eficiente)", type: "success" }]);
        } else if (next === 8) {
          const aosMisses = cacheAwareArrays[0]?.cacheMisses || 0;
          const soaMisses = cacheAwareArrays[1]?.cacheMisses || 0;
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: `📊 Cache Misses: AoS=${aosMisses}, SoA=${soaMisses}`, type: "info" }]);
        } else if (next === 9) {
          setCacheAwareLogs((logs) => [...logs, { time: Date.now(), message: "✅ SoA mejora localidad espacial para accesos columnares", type: "success" }]);
        }

        return next;
      });
    }, cacheAwareSpeed);

    return () => clearTimeout(timer);
  }, [cacheAwareRunning, cacheAwarePhase, cacheAwareSpeed, cacheAwareArrays]);

  // ==================== FUNCIONES RESET ====================
  const resetPadding = () => {
    setPaddingRunning(false);
    setPaddingPhase(0);
    setPaddingCounters([
      { id: 0, value: 0, thread: 0, padded: false, cacheLine: 0 },
      { id: 1, value: 0, thread: 1, padded: false, cacheLine: 0 },
      { id: 2, value: 0, thread: 0, padded: true, cacheLine: 0 },
      { id: 3, value: 0, thread: 1, padded: true, cacheLine: 1 },
    ]);
    setPaddingCacheInvalidations({ withoutPadding: 0, withPadding: 0 });
    setPaddingLogs([]);
  };

  const resetAlignment = () => {
    setAlignmentRunning(false);
    setAlignmentPhase(0);
    setAlignmentCrossings({ unaligned: 0, aligned: 0 });
    setAlignmentLogs([]);
  };

  const resetAccumulator = () => {
    setAccumulatorRunning(false);
    setAccumulatorPhase(0);
    setAccumulatorThreads([
      { id: 0, localSum: 0, writes: 0, useLocal: false },
      { id: 1, localSum: 0, writes: 0, useLocal: false },
      { id: 2, localSum: 0, writes: 0, useLocal: true },
      { id: 3, localSum: 0, writes: 0, useLocal: true },
    ]);
    setAccumulatorGlobalSum({ shared: 0, threadLocal: 0 });
    setAccumulatorContentions(0);
    setAccumulatorLogs([]);
  };

  const resetStructure = () => {
    setStructureRunning(false);
    setStructurePhase(0);
    setStructureAccesses({ badLayout: 0, goodLayout: 0 });
    setStructureLogs([]);
  };

  const resetCacheAware = () => {
    setCacheAwareRunning(false);
    setCacheAwarePhase(0);
    setCacheAwareArrays([
      { name: "Array of Structs (AoS)", layout: "aos", cacheHits: 0, cacheMisses: 0 },
      { name: "Struct of Arrays (SoA)", layout: "soa", cacheHits: 0, cacheMisses: 0 },
    ]);
    setCacheAwareLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-8 text-amber-400" />
          <h1 className="text-4xl font-bold">False Sharing — Soluciones</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed">
          Técnicas para prevenir false sharing: padding de cache lines, directivas de alineación,
          acumuladores thread-local, reorganización de estructuras y estructuras de datos cache-aware.
        </p>
      </div>

      {/* ACCORDION DE PSEUDOCÓDIGOS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="single" defaultValue="pseudocodigos" collapsible className="space-y-4">
          <AccordionItem value="pseudocodigos" className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <Code className="size-6 text-blue-400" />
                <span className="text-2xl font-semibold">Pseudocódigos de Soluciones</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Tabs defaultValue="padding" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="padding" className="data-[state=active]:bg-blue-600">
                    Cache Line Padding
                  </TabsTrigger>
                  <TabsTrigger value="alignment" className="data-[state=active]:bg-blue-600">
                    Alignment Directives
                  </TabsTrigger>
                  <TabsTrigger value="threadlocal" className="data-[state=active]:bg-blue-600">
                    Thread-Local
                  </TabsTrigger>
                  <TabsTrigger value="reorganization" className="data-[state=active]:bg-blue-600">
                    Structure Reorg
                  </TabsTrigger>
                  <TabsTrigger value="cacheaware" className="data-[state=active]:bg-blue-600">
                    Cache-Aware DS
                  </TabsTrigger>
                </TabsList>

                {/* Pseudocódigo 1: Cache Line Padding */}
                <TabsContent value="padding" className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 p-6 rounded-lg border border-blue-700/50">
                    <h3 className="text-2xl font-bold text-blue-300 mb-3">
                      🔲 Solución 1: Cache Line Padding
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Agrega bytes de relleno (padding) entre variables para forzar que cada una ocupe
                      una cache line completa (típicamente 64 bytes). Esto previene que threads diferentes
                      invaliden mutuamente sus caches al escribir variables que estarían en la misma línea.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Separa datos en diferentes cache lines</li>
                        <li>• Tamaño típico de cache line: 64 bytes</li>
                        <li>• Usa padding para alinear a 64 bytes</li>
                        <li>• Elimina false sharing entre threads</li>
                        <li>• Trade-off: usa más memoria</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Cache Line Padding
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Tamaño típico de cache line en arquitecturas modernas
constante CACHE_LINE_SIZE = 64  // bytes

// SIN PADDING (problema de false sharing)
estructura CounterArraySinPadding {
    counter: arreglo[NUM_THREADS] de entero
    // Todos los counters en memoria contigua
    // Múltiples counters en la misma cache line
}

función usar_sin_padding() {
    counters: CounterArraySinPadding
    
    función worker_thread(id: entero) {
        para i = 1 hasta 1000000 hacer
            counters.counter[id]++  // FALSE SHARING!
            // Escrituras de diferentes threads invalidan
            // mutuamente sus caches
        fin para
    }
    
    // Threads 0 y 1 comparten cache line
    // Cada escritura invalida la cache del otro
}

// CON PADDING (solución)
estructura PaddedCounter {
    value: entero
    padding: arreglo[CACHE_LINE_SIZE - sizeof(entero)] de byte
    // Padding garantiza que cada counter ocupe 64 bytes
}

estructura CounterArrayConPadding {
    counters: arreglo[NUM_THREADS] de PaddedCounter
    // Cada counter en su propia cache line
}

función usar_con_padding() {
    counters: CounterArrayConPadding
    
    función worker_thread(id: entero) {
        para i = 1 hasta 1000000 hacer
            counters.counters[id].value++  // Sin false sharing
            // Cada thread escribe en su propia cache line
        fin para
    }
    
    // Threads 0 y 1 tienen cache lines separadas
    // Sin invalidaciones mutuas
}

// Macro/Helper para crear variables padded
macro CACHE_ALIGNED(tipo, nombre)
    alignas(CACHE_LINE_SIZE) tipo nombre

// Ejemplo de uso
función ejemplo_cache_aligned() {
    CACHE_ALIGNED(entero, counter_thread_0)
    CACHE_ALIGNED(entero, counter_thread_1)
    
    // counter_thread_0 y counter_thread_1 están en
    // cache lines diferentes
}

// Padding explícito en C/C++
estructura PaddedData {
    data: entero
    char padding[CACHE_LINE_SIZE - sizeof(entero)]
} __attribute__((aligned(CACHE_LINE_SIZE)))

// Array de estructuras padded
función crear_array_padded(size: entero) -> arreglo de PaddedCounter {
    // Cada elemento ocupa 64 bytes
    arr: arreglo[size] de PaddedCounter
    
    // Verificar alineación
    para i = 0 hasta size - 1 hacer
        address = dirección_de(arr[i])
        assert(address % CACHE_LINE_SIZE == 0)
    fin para
    
    return arr
}

// Cálculo de padding necesario
función calcular_padding(size: entero) -> entero {
    si size >= CACHE_LINE_SIZE entonces
        return 0  // Ya es suficientemente grande
    fin si
    
    return CACHE_LINE_SIZE - (size % CACHE_LINE_SIZE)
}

// Estructura con múltiples campos padded
estructura MultiFieldPadded {
    // Campo 1
    field1: entero
    padding1: arreglo[60] de byte  // 4 + 60 = 64
    
    // Campo 2
    field2: entero
    padding2: arreglo[60] de byte  // 4 + 60 = 64
    
    // Cada campo en su propia cache line
}

// Template genérico para padding
template<T>
estructura Padded {
    value: T
    padding: arreglo[CACHE_LINE_SIZE - sizeof(T)] de byte
}

función usar_template_padded() {
    counter1: Padded<entero>
    counter2: Padded<entero>
    
    counter1.value++
    counter2.value++  // Sin false sharing
}

// Padding para diferentes tamaños de cache line
función detectar_cache_line_size() -> entero {
    // En runtime, detectar usando CPUID u otro método
    // Valor por defecto: 64 bytes
    return 64
}

función crear_estructura_adaptativa() {
    cache_size = detectar_cache_line_size()
    
    estructura AdaptivePadded {
        value: entero
        padding: arreglo[cache_size - sizeof(entero)] de byte
    }
}

// False sharing con arrays 2D
función ejemplo_array_2d_sin_padding() {
    // Problema: filas adyacentes comparten cache lines
    matrix: arreglo[NUM_THREADS][COLS] de entero
    
    función worker(thread_id: entero) {
        para j = 0 hasta COLS - 1 hacer
            matrix[thread_id][j]++  // Posible false sharing
        fin para
    }
}

función ejemplo_array_2d_con_padding() {
    // Solución: añadir padding entre filas
    PADDED_COLS = COLS + (CACHE_LINE_SIZE / sizeof(entero))
    matrix: arreglo[NUM_THREADS][PADDED_COLS] de entero
    
    función worker(thread_id: entero) {
        para j = 0 hasta COLS - 1 hacer
            matrix[thread_id][j]++  // Sin false sharing
        fin para
    }
}

// Verificar false sharing en runtime
función detectar_false_sharing() {
    inicio = timestamp()
    
    // Test sin padding
    counters_sin: arreglo[NUM_THREADS] de entero
    para cada thread hacer
        incrementar_contador(counters_sin[thread_id])
    fin para
    
    tiempo_sin = timestamp() - inicio
    
    // Test con padding
    counters_con: arreglo[NUM_THREADS] de PaddedCounter
    para cada thread hacer
        incrementar_contador(counters_con[thread_id].value)
    fin para
    
    tiempo_con = timestamp() - inicio
    
    mejora = (tiempo_sin - tiempo_con) / tiempo_sin * 100
    
    imprimir("Sin padding: " + tiempo_sin + "ms")
    imprimir("Con padding: " + tiempo_con + "ms")
    imprimir("Mejora: " + mejora + "%")
}

// Padding en lenguajes de alto nivel
// Java
clase PaddedCounterJava {
    long p0, p1, p2, p3, p4, p5, p6  // 56 bytes padding
    volatile long value                 // 8 bytes
    long p8, p9, p10, p11, p12, p13, p14  // 56 bytes padding
}

// Rust
#[repr(align(64))]
estructura PaddedCounterRust {
    value: AtomicU64
}

// Consideraciones de memoria
función calcular_overhead_memoria(num_elements: entero, size_elemento: entero) -> flotante {
    sin_padding = num_elements * size_elemento
    con_padding = num_elements * CACHE_LINE_SIZE
    
    overhead = (con_padding - sin_padding) / sin_padding * 100
    
    imprimir("Memoria sin padding: " + sin_padding + " bytes")
    imprimir("Memoria con padding: " + con_padding + " bytes")
    imprimir("Overhead: " + overhead + "%")
    
    return overhead
}

// Ejemplo completo: contador de eventos multi-thread
estructura EventCounters {
    counters: arreglo[MAX_EVENT_TYPES] de PaddedCounter
}

función inicializar_counters() -> EventCounters {
    ec: EventCounters
    
    para i = 0 hasta MAX_EVENT_TYPES - 1 hacer
        ec.counters[i].value = 0
    fin para
    
    return ec
}

función registrar_evento(ec: EventCounters, tipo: entero, thread_id: entero) {
    // Cada tipo de evento en cache line separada
    ec.counters[tipo].value++
    
    // Sin false sharing entre tipos de eventos
}

// Best practices
función mejores_practicas_padding() {
    // 1. Identificar variables compartidas frecuentemente escritas
    // 2. Medir impacto de false sharing primero
    // 3. Aplicar padding solo donde sea necesario
    // 4. Considerar trade-off memoria vs rendimiento
    // 5. Verificar alineación en runtime
    // 6. Documentar uso de padding en código
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>


                {/* Pseudocódigo 2: Alignment Directives */}
                <TabsContent value="alignment" className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 p-6 rounded-lg border border-purple-700/50">
                    <h3 className="text-2xl font-bold text-purple-300 mb-3">
                      📐 Solución 2: Alignment Directives
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Utiliza directivas del compilador para alinear estructuras a los límites de cache line.
                      Esto garantiza que las estructuras no crucen boundaries de cache lines, mejorando el
                      rendimiento y reduciendo cache line splits.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Alinea datos a boundaries de cache line</li>
                        <li>• Previene cache line splits</li>
                        <li>• Usa atributos del compilador (alignas, __attribute__)</li>
                        <li>• Mejora acceso a memoria</li>
                        <li>• Reduce accesos a múltiples cache lines</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Alignment Directives
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Constantes de alineación
constante CACHE_LINE_SIZE = 64
constante WORD_SIZE = sizeof(puntero)

// SIN ALINEACIÓN (problema de cache line crossing)
estructura DataSinAlinear {
    field1: entero      // offset 0, size 4
    field2: double      // offset 4, size 8
    field3: entero      // offset 12, size 4
    // Total: 16 bytes, puede cruzar cache line
}

función problema_sin_alinear() {
    // Si data está en offset 56:
    // field1: bytes 56-59 (línea 0)
    // field2: bytes 60-67 (cruza a línea 1!)
    // field3: bytes 68-71 (línea 1)
    
    data: DataSinAlinear en offset 56
    
    // Acceso a field2 requiere 2 lecturas de cache
    valor = data.field2  // CACHE LINE SPLIT
}

// CON ALINEACIÓN (solución)
alinear_a(CACHE_LINE_SIZE)
estructura DataAlineada {
    field1: entero
    field2: double
    field3: entero
    // Estructura completa alineada a 64 bytes
}

función solucion_con_alinear() {
    // data siempre empieza en múltiplo de 64
    // Nunca cruza cache line boundary
    
    data: DataAlineada  // offset 0, 64, 128, etc.
    
    // Acceso a field2 en 1 sola lectura
    valor = data.field2  // CACHE HIT
}

// Directivas de alineación en diferentes lenguajes

// C11/C++11
_Alignas(CACHE_LINE_SIZE)
estructura AlignedStructC {
    data: entero
}

// C++11 también
alignas(CACHE_LINE_SIZE)
estructura AlignedStructCpp {
    data: entero
}

// GCC/Clang attribute
estructura AlignedStructGCC {
    data: entero
} __attribute__((aligned(CACHE_LINE_SIZE)))

// MSVC
__declspec(align(CACHE_LINE_SIZE))
estructura AlignedStructMSVC {
    data: entero
}

// Verificar alineación en compilación
static_assert(alignof(AlignedStructC) == CACHE_LINE_SIZE,
              "Estructura no está correctamente alineada")

// Verificar alineación en runtime
función verificar_alineacion(ptr: puntero) -> booleano {
    address = convertir_a_entero(ptr)
    
    si address % CACHE_LINE_SIZE == 0 entonces
        return verdadero
    sino
        return falso
    fin si
}

// Alineación dinámica en heap
función allocar_alineado(size: entero) -> puntero {
    // Asegurar que memoria heap esté alineada
    ptr = aligned_alloc(CACHE_LINE_SIZE, size)
    
    assert(verificar_alineacion(ptr))
    
    return ptr
}

// Alineación de arrays
alinear_a(CACHE_LINE_SIZE)
estructura ArrayAlineado {
    datos: arreglo[100] de entero
}

función usar_array_alineado() {
    arr: ArrayAlineado
    
    // Primer elemento alineado a 64 bytes
    assert(verificar_alineacion(&arr.datos[0]))
}

// Alineación de campos individuales
estructura CamposAlineados {
    alinear_a(CACHE_LINE_SIZE) campo1: entero
    alinear_a(CACHE_LINE_SIZE) campo2: double
    alinear_a(CACHE_LINE_SIZE) campo3: entero
    // Cada campo en cache line separada
}

función calcular_offset_alineado(offset_actual: entero, alineacion: entero) -> entero {
    // Redondear hacia arriba al siguiente múltiplo
    si offset_actual % alineacion == 0 entonces
        return offset_actual
    fin si
    
    return ((offset_actual / alineacion) + 1) * alineacion
}

// Ejemplo: struct con múltiples campos
estructura MultiCampo {
    char c           // offset 0, size 1
    // padding: 7 bytes
    long l           // offset 8, size 8 (alineado a 8)
    int i            // offset 16, size 4
    // padding: 4 bytes (para alinear struct a 8)
    // Total: 24 bytes
}

// Forzar alineación a cache line
alinear_a(CACHE_LINE_SIZE)
estructura MultiCampoAlineado {
    char c
    long l
    int i
    // padding hasta 64 bytes
}

// Alineación para SIMD
alinear_a(16)  // SSE requiere alineación de 16 bytes
estructura DatosSIMD {
    datos: arreglo[4] de flotante
}

alinear_a(32)  // AVX requiere alineación de 32 bytes
estructura DatosAVX {
    datos: arreglo[8] de flotante
}

// Alineación condicional según arquitectura
#si ARQUITECTURA == X86_64 entonces
    constante ALINEACION_OPTIMA = 64
#sino_si ARQUITECTURA == ARM entonces
    constante ALINEACION_OPTIMA = 128
#sino
    constante ALINEACION_OPTIMA = 32
#fin si

alinear_a(ALINEACION_OPTIMA)
estructura DatosArquitectura {
    data: entero
}

// Alineación de stack
función funcion_con_stack_alineado() {
    // Forzar alineación de variables locales
    alinear_a(CACHE_LINE_SIZE) buffer: arreglo[256] de byte
    
    assert(verificar_alineacion(&buffer))
}

// Macro para facilitar uso
macro CACHE_ALIGNED_TYPE(tipo)
    alignas(CACHE_LINE_SIZE) tipo

// Uso
tipo AlignedInt = CACHE_ALIGNED_TYPE(entero)
tipo AlignedDouble = CACHE_ALIGNED_TYPE(double)

// Pool de objetos alineados
estructura PoolAlineado<T> {
    alinear_a(CACHE_LINE_SIZE) objetos: arreglo[MAX_OBJETOS] de T
}

función crear_pool<T>() -> PoolAlineado<T> {
    pool: PoolAlineado<T>
    
    // Verificar que cada objeto está alineado
    para i = 0 hasta MAX_OBJETOS - 1 hacer
        assert(verificar_alineacion(&pool.objetos[i]))
    fin para
    
    return pool
}

// Alineación para DMA
// Hardware DMA puede requerir alineación específica
alinear_a(4096)  // Alineación de página
estructura BufferDMA {
    datos: arreglo[4096] de byte
}

función preparar_buffer_dma() -> BufferDMA* {
    buffer = allocar_alineado(sizeof(BufferDMA))
    
    // Verificar alineación de página
    assert((convertir_a_entero(buffer) % 4096) == 0)
    
    return buffer
}

// Detección de alineación en compilación
template<typename T>
función verificar_alineacion_tipo() {
    imprimir("Tipo: " + nombre_de_tipo(T))
    imprimir("Tamaño: " + sizeof(T))
    imprimir("Alineación: " + alignof(T))
    imprimir("Alineado a cache line: " + 
             (alignof(T) == CACHE_LINE_SIZE))
}

// Análisis de layout de estructura
función analizar_layout() {
    imprimir("DataSinAlinear:")
    imprimir("  field1 offset: " + offsetof(DataSinAlinear, field1))
    imprimir("  field2 offset: " + offsetof(DataSinAlinear, field2))
    imprimir("  field3 offset: " + offsetof(DataSinAlinear, field3))
    imprimir("  Tamaño total: " + sizeof(DataSinAlinear))
    
    imprimir("DataAlineada:")
    imprimir("  field1 offset: " + offsetof(DataAlineada, field1))
    imprimir("  field2 offset: " + offsetof(DataAlineada, field2))
    imprimir("  field3 offset: " + offsetof(DataAlineada, field3))
    imprimir("  Tamaño total: " + sizeof(DataAlineada))
}

// Benchmark de alineación
función benchmark_alineacion() {
    iteraciones = 10000000
    
    // Test sin alineación
    data_sin: arreglo[100] de DataSinAlinear
    inicio = timestamp()
    
    para i = 1 hasta iteraciones hacer
        suma = 0
        para j = 0 hasta 99 hacer
            suma += data_sin[j].field2
        fin para
    fin para
    
    tiempo_sin = timestamp() - inicio
    
    // Test con alineación
    data_con: arreglo[100] de DataAlineada
    inicio = timestamp()
    
    para i = 1 hasta iteraciones hacer
        suma = 0
        para j = 0 hasta 99 hacer
            suma += data_con[j].field2
        fin para
    fin para
    
    tiempo_con = timestamp() - inicio
    
    imprimir("Sin alineación: " + tiempo_sin + "ms")
    imprimir("Con alineación: " + tiempo_con + "ms")
    imprimir("Mejora: " + ((tiempo_sin - tiempo_con) / tiempo_sin * 100) + "%")
}

// Consideraciones de portable
función obtener_alineacion_cache_line() -> entero {
    // Diferentes arquitecturas tienen diferentes tamaños
    // x86/x64: típicamente 64 bytes
    // ARM: puede ser 32, 64 o 128 bytes
    // PowerPC: típicamente 128 bytes
    
    #si ARQUITECTURA_CONOCIDA entonces
        return CACHE_LINE_SIZE_CONOCIDO
    #sino
        // Valor conservador
        return 64
    #fin si
}

// Union para forzar alineación
union AlineacionForzada {
    data: tipo_a_alinear
    padding: arreglo[CACHE_LINE_SIZE] de byte
}

// Best practices
función mejores_practicas_alineacion() {
    // 1. Usar alignas/alignof estándar cuando sea posible
    // 2. Verificar alineación con static_assert
    // 3. Considerar requisitos de diferentes plataformas
    // 4. Documentar por qué se usa alineación específica
    // 5. Medir impacto real en rendimiento
    // 6. Considerar trade-off memoria vs rendimiento
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 3: Thread-Local Accumulators */}
                <TabsContent value="threadlocal" className="space-y-4">
                  <div className="bg-gradient-to-br from-green-900/30 to-slate-800/30 p-6 rounded-lg border border-green-700/50">
                    <h3 className="text-2xl font-bold text-green-300 mb-3">
                      🧵 Solución 3: Thread-Local Accumulators
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Cada thread mantiene su propio acumulador local para operaciones de reducción.
                      Al finalizar, se combinan todos los acumuladores locales en un resultado global.
                      Esto elimina la contención y false sharing durante la acumulación.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Cada thread tiene acumulador privado</li>
                        <li>• Sin contención durante acumulación</li>
                        <li>• Merge final de resultados</li>
                        <li>• Ideal para operaciones de reducción</li>
                        <li>• Excelente escalabilidad</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Thread-Local Accumulators
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// PROBLEMA: Contador compartido (false sharing)
variable global counter_compartido: entero = 0
variable global lock: Mutex

función worker_compartido(id: entero, iteraciones: entero) {
    para i = 1 hasta iteraciones hacer
        adquirir(lock)
        counter_compartido++  // CONTENCIÓN!
        liberar(lock)
    fin para
    // Alto overhead de sincronización
}

función ejecutar_compartido(num_threads: entero) {
    threads: arreglo[num_threads] de Thread
    
    para i = 0 hasta num_threads - 1 hacer
        threads[i] = crear_thread(worker_compartido, i, 1000000)
    fin para
    
    para i = 0 hasta num_threads - 1 hacer
        esperar(threads[i])
    fin para
    
    imprimir("Resultado: " + counter_compartido)
}

// SOLUCIÓN 1: Array de contadores thread-local
estructura PaddedCounter {
    value: entero
    padding: arreglo[60] de byte  // Padding a 64 bytes
}

variable global counters_locales: arreglo[MAX_THREADS] de PaddedCounter

función worker_thread_local(id: entero, iteraciones: entero) {
    // Cada thread escribe SOLO en su contador
    para i = 1 hasta iteraciones hacer
        counters_locales[id].value++  // Sin lock, sin contención
    fin para
}

función ejecutar_thread_local(num_threads: entero) -> entero {
    threads: arreglo[num_threads] de Thread
    
    // Inicializar contadores
    para i = 0 hasta num_threads - 1 hacer
        counters_locales[i].value = 0
    fin para
    
    // Ejecutar threads
    para i = 0 hasta num_threads - 1 hacer
        threads[i] = crear_thread(worker_thread_local, i, 1000000)
    fin para
    
    para i = 0 hasta num_threads - 1 hacer
        esperar(threads[i])
    fin para
    
    // Merge final (1 sola vez, sin contención)
    total = 0
    para i = 0 hasta num_threads - 1 hacer
        total += counters_locales[i].value
    fin para
    
    return total
}

// SOLUCIÓN 2: Thread-Local Storage (TLS)
thread_local variable counter_tls: entero

función worker_tls(iteraciones: entero) {
    // Cada thread tiene su propia copia de counter_tls
    counter_tls = 0
    
    para i = 1 hasta iteraciones hacer
        counter_tls++  // Variable privada del thread
    fin para
}

función ejecutar_tls(num_threads: entero) -> entero {
    threads: arreglo[num_threads] de Thread
    resultados: arreglo[num_threads] de entero
    
    para i = 0 hasta num_threads - 1 hacer
        threads[i] = crear_thread(worker_tls, 1000000)
    fin para
    
    para i = 0 hasta num_threads - 1 hacer
        esperar(threads[i])
        // Obtener resultado de TLS de cada thread
        resultados[i] = obtener_tls_de_thread(threads[i], counter_tls)
    fin para
    
    // Combinar resultados
    total = 0
    para i = 0 hasta num_threads - 1 hacer
        total += resultados[i]
    fin para
    
    return total
}

// SOLUCIÓN 3: Acumuladores para operaciones complejas
estructura Acumulador {
    sum: double
    count: entero
    min: double
    max: double
    padding: arreglo[32] de byte  // Padding
}

variable global acumuladores: arreglo[MAX_THREADS] de Acumulador

función procesar_datos_local(id: entero, datos: arreglo de double) {
    // Inicializar acumulador local
    local_acc: Acumulador
    local_acc.sum = 0
    local_acc.count = 0
    local_acc.min = INFINITO
    local_acc.max = -INFINITO
    
    // Procesar datos sin contención
    para cada valor en datos hacer
        local_acc.sum += valor
        local_acc.count++
        
        si valor < local_acc.min entonces
            local_acc.min = valor
        fin si
        
        si valor > local_acc.max entonces
            local_acc.max = valor
        fin si
    fin para
    
    // Guardar resultado local
    acumuladores[id] = local_acc
}

función merge_acumuladores(num_threads: entero) -> Acumulador {
    resultado: Acumulador
    resultado.sum = 0
    resultado.count = 0
    resultado.min = INFINITO
    resultado.max = -INFINITO
    
    // Combinar acumuladores locales
    para i = 0 hasta num_threads - 1 hacer
        resultado.sum += acumuladores[i].sum
        resultado.count += acumuladores[i].count
        
        si acumuladores[i].min < resultado.min entonces
            resultado.min = acumuladores[i].min
        fin si
        
        si acumuladores[i].max > resultado.max entonces
            resultado.max = acumuladores[i].max
        fin si
    fin para
    
    return resultado
}

// SOLUCIÓN 4: Reduction pattern
función parallel_sum(datos: arreglo de entero, num_threads: entero) -> entero {
    // Dividir datos entre threads
    chunk_size = tamaño(datos) / num_threads
    
    // Acumuladores locales
    sumas_locales: arreglo[num_threads] de entero
    
    función worker_sum(id: entero) {
        inicio = id * chunk_size
        fin = min((id + 1) * chunk_size, tamaño(datos))
        
        suma_local = 0
        para i = inicio hasta fin - 1 hacer
            suma_local += datos[i]
        fin para
        
        sumas_locales[id] = suma_local
    }
    
    // Ejecutar workers
    threads: arreglo[num_threads] de Thread
    para i = 0 hasta num_threads - 1 hacer
        threads[i] = crear_thread(worker_sum, i)
    fin para
    
    para i = 0 hasta num_threads - 1 hacer
        esperar(threads[i])
    fin para
    
    // Reduction final
    suma_total = 0
    para i = 0 hasta num_threads - 1 hacer
        suma_total += sumas_locales[i]
    fin para
    
    return suma_total
}

// Template genérico para reduction
template<T, Op>
función parallel_reduce(datos: arreglo de T, 
                        operacion: Op,
                        valor_inicial: T,
                        num_threads: entero) -> T {
    
    resultados: arreglo[num_threads] de T
    chunk_size = tamaño(datos) / num_threads
    
    función worker_reduce(id: entero) {
        inicio = id * chunk_size
        fin = min((id + 1) * chunk_size, tamaño(datos))
        
        resultado_local = valor_inicial
        para i = inicio hasta fin - 1 hacer
            resultado_local = operacion(resultado_local, datos[i])
        fin para
        
        resultados[id] = resultado_local
    }
    
    // Ejecutar workers
    threads: arreglo[num_threads] de Thread
    para i = 0 hasta num_threads - 1 hacer
        threads[i] = crear_thread(worker_reduce, i)
    fin para
    
    para i = 0 hasta num_threads - 1 hacer
        esperar(threads[i])
    fin para
    
    // Combinar resultados
    resultado_final = valor_inicial
    para i = 0 hasta num_threads - 1 hacer
        resultado_final = operacion(resultado_final, resultados[i])
    fin para
    
    return resultado_final
}

// Uso de parallel_reduce
función ejemplos_reduce() {
    datos: arreglo[1000000] de entero
    
    // Sum
    suma = parallel_reduce(datos, 
                          lambda (a, b) -> a + b,
                          0, 
                          8)
    
    // Max
    maximo = parallel_reduce(datos,
                            lambda (a, b) -> max(a, b),
                            -INFINITO,
                            8)
    
    // Producto
    producto = parallel_reduce(datos,
                              lambda (a, b) -> a * b,
                              1,
                              8)
}

// Thread-local con cleanup automático
clase ThreadLocalAccumulator<T> {
    thread_local acumulador: T
    global lista_acumuladores: Lista<T*>
    global lock: Mutex
    
    función get() -> T* {
        si acumulador no inicializado entonces
            acumulador = crear_nuevo()
            
            adquirir(lock)
            lista_acumuladores.agregar(&acumulador)
            liberar(lock)
        fin si
        
        return &acumulador
    }
    
    función merge_all() -> T {
        resultado = valor_inicial()
        
        adquirir(lock)
        para cada acc en lista_acumuladores hacer
            resultado = combinar(resultado, *acc)
        fin para
        liberar(lock)
        
        return resultado
    }
}

// Uso de ThreadLocalAccumulator
función ejemplo_thread_local_accumulator() {
    accumulator: ThreadLocalAccumulator<entero>
    
    función worker() {
        local_sum = accumulator.get()
        
        para i = 1 hasta 1000000 hacer
            *local_sum += 1
        fin para
    }
    
    // Ejecutar workers
    threads: arreglo[8] de Thread
    para i = 0 hasta 7 hacer
        threads[i] = crear_thread(worker)
    fin para
    
    para i = 0 hasta 7 hacer
        esperar(threads[i])
    fin para
    
    // Obtener resultado final
    total = accumulator.merge_all()
    imprimir("Total: " + total)
}

// Benchmark
función benchmark_acumuladores() {
    iteraciones = 10000000
    num_threads = 8
    
    // Método 1: Compartido con lock
    inicio = timestamp()
    ejecutar_compartido(num_threads)
    tiempo_compartido = timestamp() - inicio
    
    // Método 2: Thread-local
    inicio = timestamp()
    ejecutar_thread_local(num_threads)
    tiempo_local = timestamp() - inicio
    
    imprimir("Compartido (con lock): " + tiempo_compartido + "ms")
    imprimir("Thread-local: " + tiempo_local + "ms")
    imprimir("Speedup: " + (tiempo_compartido / tiempo_local) + "x")
}

// Best practices
función mejores_practicas_thread_local() {
    // 1. Usar para operaciones de reducción/agregación
    // 2. Minimizar overhead de merge final
    // 3. Considerar número de threads vs overhead
    // 4. Usar padding para evitar false sharing
    // 5. Cleanup adecuado de recursos thread-local
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 4: Structure Reorganization */}
                <TabsContent value="reorganization" className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-900/30 to-slate-800/30 p-6 rounded-lg border border-orange-700/50">
                    <h3 className="text-2xl font-bold text-orange-300 mb-3">
                      🔄 Solución 4: Structure Reorganization
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Reorganiza los campos de las estructuras agrupando aquellos con patrones de acceso
                      similares. Separa campos read-only de read-write, y campos accedidos por diferentes
                      threads para minimizar false sharing.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Agrupa campos por patrón de acceso</li>
                        <li>• Separa read-only de read-write</li>
                        <li>• Minimiza cache line sharing</li>
                        <li>• Mejora localidad de datos</li>
                        <li>• Sin overhead de runtime</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Structure Reorganization
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// PROBLEMA: Mala organización de estructura
estructura MalaOrganizacion {
    // Campos mezclados sin considerar patrones de acceso
    read_only_config: entero        // Leído frecuentemente
    write_counter1: entero          // Escrito por Thread 1
    read_only_name: cadena          // Leído frecuentemente
    write_counter2: entero          // Escrito por Thread 2
    shared_state: entero            // Leído/escrito por todos
    write_timestamp: entero         // Escrito por Thread 1
    read_only_id: entero            // Leído frecuentemente
    // FALSE SHARING: campos write mezclados con read-only
}

función problema_mala_organizacion() {
    data: MalaOrganizacion
    
    // Thread 1 lee read_only_config
    thread1_lee(data.read_only_config)
    
    // Thread 2 escribe write_counter2
    // → Invalida cache de Thread 1!
    thread2_escribe(data.write_counter2)
}

// SOLUCIÓN: Reorganización por patrón de acceso
estructura BuenaOrganizacion {
    // Grupo 1: Campos read-only (cache line 0)
    read_only_config: entero
    read_only_name: cadena
    read_only_id: entero
    padding1: arreglo[40] de byte  // Padding a 64 bytes
    
    // Grupo 2: Campos escritos por Thread 1 (cache line 1)
    write_counter1: entero
    write_timestamp: entero
    padding2: arreglo[52] de byte  // Padding a 64 bytes
    
    // Grupo 3: Campos escritos por Thread 2 (cache line 2)
    write_counter2: entero
    padding3: arreglo[60] de byte  // Padding a 64 bytes
    
    // Grupo 4: Estado compartido (cache line 3)
    shared_state: entero
    shared_lock: Mutex
    padding4: arreglo[44] de byte  // Padding a 64 bytes
}

función solucion_buena_organizacion() {
    data: BuenaOrganizacion
    
    // Thread 1 lee read_only_config
    thread1_lee(data.read_only_config)
    
    // Thread 2 escribe write_counter2
    // → NO invalida cache de Thread 1 (cache lines diferentes)
    thread2_escribe(data.write_counter2)
}

// Análisis de patrones de acceso
estructura PatronAcceso {
    nombre_campo: cadena
    lecturas: entero
    escrituras: entero
    threads_lectores: conjunto de entero
    threads_escritores: conjunto de entero
    frecuencia: double
}

función analizar_patrones(estructura: TipoEstructura) -> arreglo de PatronAcceso {
    patrones: Lista de PatronAcceso
    
    para cada campo en estructura hacer
        patron: PatronAcceso
        patron.nombre_campo = campo.nombre
        patron.lecturas = contar_lecturas(campo)
        patron.escrituras = contar_escrituras(campo)
        patron.threads_lectores = identificar_lectores(campo)
        patron.threads_escritores = identificar_escritores(campo)
        patron.frecuencia = calcular_frecuencia_acceso(campo)
        
        patrones.agregar(patron)
    fin para
    
    return patrones
}

función clasificar_campo(patron: PatronAcceso) -> cadena {
    si patron.escrituras == 0 entonces
        return "READ_ONLY"
    sino_si patron.lecturas > patron.escrituras * 10 entonces
        return "READ_MOSTLY"
    sino_si tamaño(patron.threads_escritores) == 1 entonces
        return "SINGLE_WRITER"
    sino
        return "SHARED_WRITE"
    fin si
}

función reorganizar_estructura(patrones: arreglo de PatronAcceso) -> EstructuraOptimizada {
    // Agrupar por clasificación
    read_only: Lista de Campo
    read_mostly: Lista de Campo
    single_writers: Mapa de entero a Lista de Campo  // thread_id -> campos
    shared: Lista de Campo
    
    para cada patron en patrones hacer
        clasificacion = clasificar_campo(patron)
        
        si clasificacion == "READ_ONLY" entonces
            read_only.agregar(patron.nombre_campo)
        sino_si clasificacion == "READ_MOSTLY" entonces
            read_mostly.agregar(patron.nombre_campo)
        sino_si clasificacion == "SINGLE_WRITER" entonces
            writer_id = patron.threads_escritores.primero()
            single_writers[writer_id].agregar(patron.nombre_campo)
        sino
            shared.agregar(patron.nombre_campo)
        fin si
    fin para
    
    // Construir estructura reorganizada
    estructura_nueva: EstructuraOptimizada
    
    // Cache line 0: Read-only
    para cada campo en read_only hacer
        estructura_nueva.agregar(campo)
    fin para
    estructura_nueva.agregar_padding(CACHE_LINE_SIZE)
    
    // Cache lines siguientes: Read-mostly
    para cada campo en read_mostly hacer
        estructura_nueva.agregar(campo)
    fin para
    estructura_nueva.agregar_padding(CACHE_LINE_SIZE)
    
    // Cache lines para cada writer
    para cada (thread_id, campos) en single_writers hacer
        para cada campo en campos hacer
            estructura_nueva.agregar(campo)
        fin para
        estructura_nueva.agregar_padding(CACHE_LINE_SIZE)
    fin para
    
    // Última cache line: Shared
    para cada campo en shared hacer
        estructura_nueva.agregar(campo)
    fin para
    estructura_nueva.agregar_padding(CACHE_LINE_SIZE)
    
    return estructura_nueva
}

// Ejemplo: Estructura de red (network packet)
// ANTES (mala organización)
estructura NetworkPacketBad {
    header_length: entero      // Read-only
    packet_counter: entero     // Write (por procesador)
    protocol_type: entero      // Read-only
    checksum: entero          // Write (por procesador)
    source_ip: entero         // Read-only
    processing_time: entero   // Write (por procesador)
    dest_ip: entero          // Read-only
    // False sharing entre read-only y write
}

// DESPUÉS (buena organización)
estructura NetworkPacketGood {
    // Grupo 1: Header read-only (64 bytes)
    header_length: entero
    protocol_type: entero
    source_ip: entero
    dest_ip: entero
    // ... otros campos read-only
    padding1: arreglo[36] de byte
    
    // Grupo 2: Metadata de procesamiento (64 bytes)
    packet_counter: entero
    checksum: entero
    processing_time: entero
    // ... otros campos de procesamiento
    padding2: arreglo[52] de byte
}

// Ejemplo: Contador de estadísticas multi-thread
// ANTES
estructura StatsBad {
    total_requests: AtomicInt      // Todos los threads
    success_count: AtomicInt       // Thread 1
    error_count: AtomicInt         // Thread 2
    timeout_count: AtomicInt       // Thread 3
    // Todos en misma cache line → false sharing
}

// DESPUÉS
estructura StatsGood {
    // Cada contador en cache line separada
    alinear_a(64) total_requests: AtomicInt
    padding1: arreglo[60] de byte
    
    alinear_a(64) success_count: AtomicInt
    padding2: arreglo[60] de byte
    
    alinear_a(64) error_count: AtomicInt
    padding3: arreglo[60] de byte
    
    alinear_a(64) timeout_count: AtomicInt
    padding4: arreglo[60] de byte
}

// Alternativa: Array de structs separados
estructura PerThreadStats {
    success_count: AtomicInt
    error_count: AtomicInt
    timeout_count: AtomicInt
    padding: arreglo[52] de byte
}

estructura StatsArray {
    per_thread: arreglo[MAX_THREADS] de PerThreadStats
    total: AtomicInt
}

// Reorganización para hot/cold data
estructura DataHotCold {
    // HOT: Datos accedidos frecuentemente (cache line 0)
    hot_counter: entero
    hot_timestamp: entero
    hot_flags: entero
    padding1: arreglo[52] de byte
    
    // COLD: Datos accedidos raramente (cache lines siguientes)
    config_string: cadena
    debug_info: cadena
    creation_time: entero
    // No necesita padding
}

// Reorganización para secuencia de acceso
estructura SequentialAccess {
    // Campos accedidos en secuencia (juntos en cache line)
    step1_input: entero
    step1_output: entero
    step2_input: entero
    step2_output: entero
    // Aprovecha prefetching de CPU
}

// Tool para detectar oportunidades de reorganización
función detectar_oportunidades_reorganizacion(estructura: Tipo) {
    patrones = analizar_patrones(estructura)
    problemas: Lista de cadena
    
    // Detectar campos read-only mezclados con write
    para i = 0 hasta tamaño(patrones) - 2 hacer
        si clasificar_campo(patrones[i]) == "READ_ONLY" y
           clasificar_campo(patrones[i+1]) == "SINGLE_WRITER" entonces
            problemas.agregar("Campos read-only y write adyacentes: " +
                            patrones[i].nombre_campo + ", " +
                            patrones[i+1].nombre_campo)
        fin si
    fin para
    
    // Detectar campos escritos por diferentes threads adyacentes
    para i = 0 hasta tamaño(patrones) - 2 hacer
        si tamaño(interseccion(patrones[i].threads_escritores,
                              patrones[i+1].threads_escritores)) == 0 entonces
            problemas.agregar("Campos escritos por threads diferentes adyacentes: " +
                            patrones[i].nombre_campo + ", " +
                            patrones[i+1].nombre_campo)
        fin si
    fin para
    
    return problemas
}

// Benchmark antes/después de reorganización
función benchmark_reorganizacion() {
    // Crear instancias
    bad: MalaOrganizacion
    good: BuenaOrganizacion
    
    // Test con mala organización
    inicio = timestamp()
    parallel_access_bad(bad, NUM_THREADS)
    tiempo_bad = timestamp() - inicio
    
    // Test con buena organización
    inicio = timestamp()
    parallel_access_good(good, NUM_THREADS)
    tiempo_good = timestamp() - inicio
    
    imprimir("Mala organización: " + tiempo_bad + "ms")
    imprimir("Buena organización: " + tiempo_good + "ms")
    imprimir("Mejora: " + ((tiempo_bad - tiempo_good) / tiempo_bad * 100) + "%")
}

// Best practices
función mejores_practicas_reorganizacion() {
    // 1. Perfilar acceso real antes de reorganizar
    // 2. Agrupar campos por patrón de acceso
    // 3. Separar read-only de read-write
    // 4. Considerar secuencia de acceso
    // 5. Usar padding entre grupos de diferentes threads
    // 6. Balancear organización lógica vs rendimiento
    // 7. Documentar decisiones de organización
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 5: Cache-Aware Data Structures */}
                <TabsContent value="cacheaware" className="space-y-4">
                  <div className="bg-gradient-to-br from-red-900/30 to-slate-800/30 p-6 rounded-lg border border-red-700/50">
                    <h3 className="text-2xl font-bold text-red-300 mb-3">
                      💾 Solución 5: Cache-Aware Data Structures
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Diseña estructuras de datos considerando la jerarquía de cache desde el inicio.
                      Utiliza layouts como Structure of Arrays (SoA) en lugar de Array of Structures (AoS)
                      cuando se accede a campos específicos, mejorando la localidad espacial.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Diseño considerando cache desde inicio</li>
                        <li>• SoA vs AoS según patrón de acceso</li>
                        <li>• Mejora localidad espacial</li>
                        <li>• Reduce cache misses</li>
                        <li>• Aprovecha prefetching de hardware</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Cache-Aware Data Structures
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// PATRÓN 1: Array of Structures (AoS) vs Structure of Arrays (SoA)

// AoS: Estructura tradicional
estructura Particula {
    x: flotante
    y: flotante
    z: flotante
    vx: flotante
    vy: flotante
    vz: flotante
}

variable particulas_aos: arreglo[N] de Particula

función actualizar_posiciones_aos() {
    // Acceso a campo x de todas las partículas
    para i = 0 hasta N - 1 hacer
        particulas_aos[i].x += particulas_aos[i].vx
        // Carga struct completo (24 bytes)
        // Solo usa x (4 bytes) → desperdicio
    fin para
}

// SoA: Estructura optimizada para cache
estructura ParticlesSystem {
    x: arreglo[N] de flotante
    y: arreglo[N] de flotante
    z: arreglo[N] de flotante
    vx: arreglo[N] de flotante
    vy: arreglo[N] de flotante
    vz: arreglo[N] de flotante
}

variable particulas_soa: ParticlesSystem

función actualizar_posiciones_soa() {
    // Acceso contiguo a x[]
    para i = 0 hasta N - 1 hacer
        particulas_soa.x[i] += particulas_soa.vx[i]
        // Carga solo arrays de x y vx
        // Mejor localidad espacial
        // Prefetching más efectivo
    fin para
}

// Comparación de cache behavior
función analizar_cache_behavior() {
    cache_line_size = 64  // bytes
    float_size = 4        // bytes
    
    // AoS
    elementos_por_linea_aos = cache_line_size / sizeof(Particula)
    // 64 / 24 = 2.6 → ~2 partículas por cache line
    
    // SoA
    elementos_por_linea_soa = cache_line_size / float_size
    // 64 / 4 = 16 flotantes por cache line
    
    imprimir("AoS: " + elementos_por_linea_aos + " partículas/línea")
    imprimir("SoA: " + elementos_por_linea_soa + " elementos/línea")
    imprimir("SoA es " + (elementos_por_linea_soa / elementos_por_linea_aos) + "x más eficiente")
}

// Híbrido: AoSoA (Array of Structures of Arrays)
constante SOA_BLOCK_SIZE = 16  // Múltiplo de cache line

estructura ParticleBlock {
    x: arreglo[SOA_BLOCK_SIZE] de flotante
    y: arreglo[SOA_BLOCK_SIZE] de flotante
    z: arreglo[SOA_BLOCK_SIZE] de flotante
    vx: arreglo[SOA_BLOCK_SIZE] de flotante
    vy: arreglo[SOA_BLOCK_SIZE] de flotante
    vz: arreglo[SOA_BLOCK_SIZE] de flotante
}

variable particulas_aosoa: arreglo[N / SOA_BLOCK_SIZE] de ParticleBlock

función actualizar_posiciones_aosoa() {
    num_bloques = N / SOA_BLOCK_SIZE
    
    para bloque = 0 hasta num_bloques - 1 hacer
        // Procesar bloque completo (buena localidad)
        para i = 0 hasta SOA_BLOCK_SIZE - 1 hacer
            particulas_aosoa[bloque].x[i] += particulas_aosoa[bloque].vx[i]
        fin para
    fin para
}

// PATRÓN 2: Cache-Oblivious Data Structures

// B-Tree tradicional (malo para cache)
estructura NodoBTreeMalo {
    keys: arreglo[B] de entero
    children: arreglo[B+1] de puntero a NodoBTreeMalo
    // Nodos dispersos en memoria → cache misses
}

// B+ Tree cache-aware
constante NODO_SIZE = 64  // Tamaño de cache line

estructura NodoBPlusTree {
    keys: arreglo[(NODO_SIZE - 8) / 4] de entero  // Llenar cache line
    next: puntero a NodoBPlusTree
    // Nodo cabe exactamente en 1 cache line
}

// Cache-Oblivious B-Tree (van Emde Boas layout)
función veb_layout(arbol: BTree, inicio: entero, fin: entero, salida: arreglo) {
    si fin - inicio <= 1 entonces
        salida.agregar(arbol[inicio])
        return
    fin si
    
    medio = (inicio + fin) / 2
    
    // Recursivamente dividir en mitades
    veb_layout(arbol, inicio, medio, salida)
    salida.agregar(arbol[medio])
    veb_layout(arbol, medio + 1, fin, salida)
    
    // Layout optimiza acceso en todos los niveles de cache
}

// PATRÓN 3: Hash Table cache-friendly

// Hash Table tradicional (malo)
estructura HashNodeMalo {
    key: entero
    value: entero
    next: puntero a HashNodeMalo
    // Listas encadenadas → malas para cache
}

// Open Addressing cache-friendly
estructura HashTableCacheFriendly {
    // Todos los datos en array contiguo
    entries: arreglo[SIZE] de struct {
        key: entero
        value: entero
        occupied: booleano
        padding: arreglo[3] de byte
    }
}

función buscar_cache_friendly(table: HashTableCacheFriendly, key: entero) -> entero {
    hash = hash_function(key)
    indice = hash % SIZE
    
    // Linear probing aprovecha prefetching
    mientras table.entries[indice].occupied hacer
        si table.entries[indice].key == key entonces
            return table.entries[indice].value
        fin si
        indice = (indice + 1) % SIZE
    fin mientras
    
    return NOT_FOUND
}

// PATRÓN 4: Blocked Algorithms

// Multiplicación de matrices naive (malo para cache)
función matrix_mult_naive(A: matriz[N][N], B: matriz[N][N]) -> matriz[N][N] {
    C: matriz[N][N]
    
    para i = 0 hasta N - 1 hacer
        para j = 0 hasta N - 1 hacer
            suma = 0
            para k = 0 hasta N - 1 hacer
                suma += A[i][k] * B[k][j]
                // B accedido por columnas → cache misses
            fin para
            C[i][j] = suma
        fin para
    fin para
    
    return C
}

// Blocked matrix multiplication (cache-aware)
constante BLOCK_SIZE = 64  // Ajustar a tamaño de cache L1

función matrix_mult_blocked(A: matriz[N][N], B: matriz[N][N]) -> matriz[N][N] {
    C: matriz[N][N] = 0
    
    // Dividir en bloques que caben en cache
    para ii = 0 hasta N - 1 step BLOCK_SIZE hacer
        para jj = 0 hasta N - 1 step BLOCK_SIZE hacer
            para kk = 0 hasta N - 1 step BLOCK_SIZE hacer
                
                // Procesar bloque
                para i = ii hasta min(ii + BLOCK_SIZE, N) - 1 hacer
                    para j = jj hasta min(jj + BLOCK_SIZE, N) - 1 hacer
                        suma = C[i][j]
                        para k = kk hasta min(kk + BLOCK_SIZE, N) - 1 hacer
                            suma += A[i][k] * B[k][j]
                        fin para
                        C[i][j] = suma
                    fin para
                fin para
                
            fin para
        fin para
    fin para
    
    return C
}

// PATRÓN 5: Spatial Data Structures

// Quadtree cache-aware
estructura QuadtreeNode {
    // Almacenar nodos hijos inline (no punteros)
    children: arreglo[4] de QuadtreeNode
    // Nodos contiguos → mejor localidad
    
    data: arreglo[MAX_ITEMS_PER_NODE] de Item
    num_items: entero
}

// Z-order curve (Morton code) para ordenamiento espacial
función morton_encode(x: entero, y: entero) -> entero {
    // Intercalar bits de x e y
    código = 0
    
    para i = 0 hasta 15 hacer
        código |= ((x & (1 << i)) << i) | ((y & (1 << i)) << (i + 1))
    fin para
    
    return código
}

función ordenar_puntos_espacialmente(puntos: arreglo de Punto) {
    // Ordenar por Morton code
    para cada p en puntos hacer
        p.morton = morton_encode(p.x, p.y)
    fin para
    
    ordenar(puntos, lambda (a, b) -> a.morton < b.morton)
    
    // Puntos cercanos espacialmente → cercanos en memoria
}

// PATRÓN 6: Prefetch-Friendly Linked Lists

// Lista enlazada tradicional (malo)
estructura NodoListaMalo {
    data: entero
    next: puntero a NodoListaMalo
    // Nodos dispersos → no se puede prefetch
}

// Array-based linked list (cache-friendly)
estructura ListaArrayBased {
    data: arreglo[SIZE] de entero
    next: arreglo[SIZE] de entero  // Índices en lugar de punteros
    head: entero
}

función iterar_lista_array(lista: ListaArrayBased) {
    actual = lista.head
    
    mientras actual != -1 hacer
        procesar(lista.data[actual])
        
        // Prefetch siguiente nodo
        siguiente = lista.next[actual]
        si siguiente != -1 entonces
            __builtin_prefetch(&lista.data[siguiente])
        fin si
        
        actual = siguiente
    fin mientras
}

// PATRÓN 7: Cache-Partitioning Data Structures

// Estructura con hot/cold separation
estructura CachePartitionedStruct {
    // Hot data (cache line 0)
    alinear_a(64) hot_counter: AtomicInt
    hot_timestamp: entero
    hot_flags: entero
    padding1: arreglo[52] de byte
    
    // Warm data (cache line 1)
    alinear_a(64) warm_config: entero
    warm_stats: arreglo[14] de entero
    padding2: arreglo[4] de byte
    
    // Cold data (no padding necesario)
    cold_debug_info: cadena
    cold_creation_time: entero
}

// Benchmark AoS vs SoA
función benchmark_aos_vs_soa(N: entero) {
    // Setup AoS
    aos: arreglo[N] de Particula
    para i = 0 hasta N - 1 hacer
        aos[i] = inicializar_particula()
    fin para
    
    // Setup SoA
    soa: ParticlesSystem
    para i = 0 hasta N - 1 hacer
        soa.x[i] = valor_inicial_x()
        soa.vx[i] = valor_inicial_vx()
    fin para
    
    iteraciones = 1000
    
    // Benchmark AoS
    inicio = timestamp()
    para iter = 1 hasta iteraciones hacer
        para i = 0 hasta N - 1 hacer
            aos[i].x += aos[i].vx
        fin para
    fin para
    tiempo_aos = timestamp() - inicio
    
    // Benchmark SoA
    inicio = timestamp()
    para iter = 1 hasta iteraciones hacer
        para i = 0 hasta N - 1 hacer
            soa.x[i] += soa.vx[i]
        fin para
    fin para
    tiempo_soa = timestamp() - inicio
    
    imprimir("AoS: " + tiempo_aos + "ms")
    imprimir("SoA: " + tiempo_soa + "ms")
    imprimir("Speedup SoA: " + (tiempo_aos / tiempo_soa) + "x")
}

// Herramienta para elegir layout
función elegir_layout(patrón_acceso: cadena) -> cadena {
    si patrón_acceso == "TODOS_LOS_CAMPOS" entonces
        return "AoS"  // Acceso a struct completo
    sino_si patrón_acceso == "CAMPOS_INDIVIDUALES" entonces
        return "SoA"  // Acceso por columnas
    sino_si patrón_acceso == "MIXTO" entonces
        return "AoSoA"  // Híbrido
    fin si
}

// Best practices
función mejores_practicas_cache_aware() {
    // 1. Perfilar patrones de acceso reales
    // 2. Considerar tamaño de cache (L1, L2, L3)
    // 3. Usar SoA para acceso columnar
    // 4. Usar AoS para acceso a objetos completos
    // 5. Considerar AoSoA como híbrido
    // 6. Implementar blocked algorithms para grandes datasets
    // 7. Medir impacto con performance counters
    // 8. Balancear complejidad vs beneficio
}`}
                      </code>
                    </pre>
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
                <TrendingDown className="size-6 text-emerald-400" />
                <span className="text-2xl font-semibold">Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Tabs defaultValue="demo-padding" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="demo-padding" className="data-[state=active]:bg-emerald-600">
                    Cache Line Padding
                  </TabsTrigger>
                  <TabsTrigger value="demo-alignment" className="data-[state=active]:bg-emerald-600">
                    Alignment
                  </TabsTrigger>
                  <TabsTrigger value="demo-accumulator" className="data-[state=active]:bg-emerald-600">
                    Thread-Local
                  </TabsTrigger>
                  <TabsTrigger value="demo-structure" className="data-[state=active]:bg-emerald-600">
                    Structure Reorg
                  </TabsTrigger>
                  <TabsTrigger value="demo-cacheaware" className="data-[state=active]:bg-emerald-600">
                    Cache-Aware DS
                  </TabsTrigger>
                </TabsList>

                {/* Demo 1: Cache Line Padding */}
                <TabsContent value="demo-padding" className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/20 to-slate-800/20 p-6 rounded-lg border border-blue-700/50">
                    <h3 className="text-xl font-bold text-blue-300 mb-4">
                      Demo: Cache Line Padding (Sin Padding vs Con Padding)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setPaddingRunning(!paddingRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          paddingRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {paddingRunning ? (
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
                        onClick={resetPadding}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {paddingSpeed}ms
                        </label>
                        <Slider
                          value={[paddingSpeed]}
                          onValueChange={([value]) => setPaddingSpeed(value)}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Sin Padding */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/50">
                        <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                          ❌ Sin Padding (False Sharing)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-800 p-3 rounded border-2 border-red-500">
                            <div className="text-xs text-gray-400 mb-1">Cache Line 0 (64 bytes)</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className={`p-2 rounded text-center text-sm ${
                                paddingCounters[0].value > 0 ? "bg-orange-600" : "bg-slate-700"
                              }`}>
                                <div className="font-mono">counter[0]</div>
                                <div className="text-xs">Thread 0</div>
                                <div className="font-bold">{paddingCounters[0].value}</div>
                              </div>
                              <div className={`p-2 rounded text-center text-sm ${
                                paddingCounters[1].value > 0 ? "bg-orange-600" : "bg-slate-700"
                              }`}>
                                <div className="font-mono">counter[1]</div>
                                <div className="text-xs">Thread 1</div>
                                <div className="font-bold">{paddingCounters[1].value}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-red-300 flex items-center gap-2">
                            <span>🚨</span>
                            <span>Invalidaciones: {paddingCacheInvalidations.withoutPadding}</span>
                          </div>
                        </div>
                      </div>

                      {/* Con Padding */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                        <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                          ✅ Con Padding (Sin False Sharing)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-800 p-3 rounded border-2 border-green-500">
                            <div className="text-xs text-gray-400 mb-1">Cache Line 0 (64 bytes)</div>
                            <div className={`p-2 rounded text-center text-sm ${
                              paddingCounters[2].value > 0 ? "bg-green-600" : "bg-slate-700"
                            }`}>
                              <div className="font-mono">counter[2]</div>
                              <div className="text-xs">Thread 0</div>
                              <div className="font-bold">{paddingCounters[2].value}</div>
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded border-2 border-green-500">
                            <div className="text-xs text-gray-400 mb-1">Cache Line 1 (64 bytes)</div>
                            <div className={`p-2 rounded text-center text-sm ${
                              paddingCounters[3].value > 0 ? "bg-green-600" : "bg-slate-700"
                            }`}>
                              <div className="font-mono">counter[3]</div>
                              <div className="text-xs">Thread 1</div>
                              <div className="font-bold">{paddingCounters[3].value}</div>
                            </div>
                          </div>
                          <div className="text-sm text-green-300 flex items-center gap-2">
                            <span>✅</span>
                            <span>Invalidaciones: {paddingCacheInvalidations.withPadding}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={paddingLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {paddingLogs.map((log, i) => (
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

                {/* Demo 2: Alignment Directives */}
                <TabsContent value="demo-alignment" className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/20 to-slate-800/20 p-6 rounded-lg border border-purple-700/50">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">
                      Demo: Alignment Directives (Cache Line Crossing)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setAlignmentRunning(!alignmentRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          alignmentRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {alignmentRunning ? (
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
                        onClick={resetAlignment}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {alignmentSpeed}ms
                        </label>
                        <Slider
                          value={[alignmentSpeed]}
                          onValueChange={([value]) => setAlignmentSpeed(value)}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Unaligned */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/50">
                        <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                          ❌ Unaligned (Cache Line Crossing)
                        </h4>
                        <div className="space-y-2">
                          <div className="relative bg-slate-800 p-3 rounded border-2 border-red-500 h-24">
                            <div className="text-xs text-gray-400 mb-1">Cache Line Boundary (64 bytes)</div>
                            <div className="absolute top-8 left-2 w-1/3 h-12 bg-orange-600 rounded opacity-70 border-2 border-orange-400">
                              <div className="text-xs p-1">Struct 1</div>
                              <div className="text-xs px-1">0-12</div>
                            </div>
                            <div className="absolute top-8 left-1/3 w-1/3 h-12 bg-red-600 rounded opacity-70 border-2 border-red-400">
                              <div className="text-xs p-1">Struct 2</div>
                              <div className="text-xs px-1">12-24</div>
                              <div className="text-[10px] px-1">CRUZA!</div>
                            </div>
                            <div className="absolute top-14 left-0 w-full h-px bg-yellow-500"></div>
                            <div className="absolute top-14 right-2 text-xs text-yellow-400">64 bytes</div>
                          </div>
                          <div className="text-sm text-red-300 flex items-center gap-2">
                            <span>🚨</span>
                            <span>Cache Line Crossings: {alignmentCrossings.unaligned}</span>
                          </div>
                        </div>
                      </div>

                      {/* Aligned */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                        <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                          ✅ Aligned (No Crossing)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-800 p-3 rounded border-2 border-green-500 mb-2">
                            <div className="text-xs text-gray-400 mb-1">Cache Line 0</div>
                            <div className="bg-green-600 rounded p-2 text-sm">
                              <div className="font-mono">Struct 1 (aligned)</div>
                              <div className="text-xs">offset: 0</div>
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded border-2 border-green-500">
                            <div className="text-xs text-gray-400 mb-1">Cache Line 1</div>
                            <div className="bg-green-600 rounded p-2 text-sm">
                              <div className="font-mono">Struct 2 (aligned)</div>
                              <div className="text-xs">offset: 64</div>
                            </div>
                          </div>
                          <div className="text-sm text-green-300 flex items-center gap-2">
                            <span>✅</span>
                            <span>Cache Line Crossings: {alignmentCrossings.aligned}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={alignmentLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {alignmentLogs.map((log, i) => (
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

                {/* Demo 3: Thread-Local Accumulators */}
                <TabsContent value="demo-accumulator" className="space-y-4">
                  <div className="bg-gradient-to-br from-green-900/20 to-slate-800/20 p-6 rounded-lg border border-green-700/50">
                    <h3 className="text-xl font-bold text-green-300 mb-4">
                      Demo: Thread-Local Accumulators (Shared vs Local)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setAccumulatorRunning(!accumulatorRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          accumulatorRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {accumulatorRunning ? (
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
                        onClick={resetAccumulator}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {accumulatorSpeed}ms
                        </label>
                        <Slider
                          value={[accumulatorSpeed]}
                          onValueChange={([value]) => setAccumulatorSpeed(value)}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Shared Counter */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/50">
                        <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                          ❌ Shared Counter (Contención)
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-red-900/30 p-3 rounded border-2 border-red-500">
                            <div className="text-center">
                              <div className="text-sm text-gray-300">Global Counter</div>
                              <div className="text-3xl font-bold text-red-300">{accumulatorGlobalSum.shared}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {accumulatorThreads.slice(0, 2).map((thread) => (
                              <div key={thread.id} className="bg-slate-800 p-2 rounded text-center">
                                <div className="text-xs text-gray-400">Thread {thread.id}</div>
                                <div className="text-sm font-mono">Writes: {thread.writes}</div>
                              </div>
                            ))}
                          </div>
                          <div className="text-sm text-red-300 flex items-center gap-2">
                            <span>🚨</span>
                            <span>Contentiones: {accumulatorContentions}</span>
                          </div>
                        </div>
                      </div>

                      {/* Thread-Local */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                        <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                          ✅ Thread-Local (Sin Contención)
                        </h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            {accumulatorThreads.slice(2, 4).map((thread) => (
                              <div key={thread.id} className="bg-green-900/30 p-3 rounded border-2 border-green-500">
                                <div className="text-xs text-gray-400 text-center">Thread {thread.id}</div>
                                <div className="text-center">
                                  <div className="text-sm text-gray-300">Local Sum</div>
                                  <div className="text-2xl font-bold text-green-300">{thread.localSum}</div>
                                </div>
                                <div className="text-xs text-center mt-1">Writes: {thread.writes}</div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-green-900/30 p-3 rounded border-2 border-green-500">
                            <div className="text-center">
                              <div className="text-sm text-gray-300">Global (after merge)</div>
                              <div className="text-3xl font-bold text-green-300">{accumulatorGlobalSum.threadLocal}</div>
                            </div>
                          </div>
                          <div className="text-sm text-green-300 flex items-center gap-2">
                            <span>✅</span>
                            <span>Contentiones: 0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={accumulatorLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {accumulatorLogs.map((log, i) => (
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

                {/* Demo 4: Structure Reorganization */}
                <TabsContent value="demo-structure" className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-900/20 to-slate-800/20 p-6 rounded-lg border border-orange-700/50">
                    <h3 className="text-xl font-bold text-orange-300 mb-4">
                      Demo: Structure Reorganization (Field Layout)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setStructureRunning(!structureRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          structureRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {structureRunning ? (
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
                        onClick={resetStructure}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {structureSpeed}ms
                        </label>
                        <Slider
                          value={[structureSpeed]}
                          onValueChange={([value]) => setStructureSpeed(value)}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Bad Layout */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/50">
                        <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                          ❌ Bad Layout (Mixed Access)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-800 p-3 rounded border-2 border-red-500">
                            <div className="text-xs text-gray-400 mb-2">Structure Fields:</div>
                            <div className="space-y-1">
                              <div className="bg-blue-600 p-2 rounded text-xs">
                                readFreq (read-only)
                              </div>
                              <div className="bg-orange-600 p-2 rounded text-xs">
                                writeFreq1 (write Thread A)
                              </div>
                              <div className="bg-orange-600 p-2 rounded text-xs">
                                writeFreq2 (write Thread B)
                              </div>
                              <div className="bg-blue-600 p-2 rounded text-xs">
                                readOnly (read-only)
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-red-300 flex items-center gap-2">
                            <span>🚨</span>
                            <span>Invalidaciones: {structureAccesses.badLayout}</span>
                          </div>
                          <div className="text-xs text-red-400">
                            Read/Write mezclados → False sharing
                          </div>
                        </div>
                      </div>

                      {/* Good Layout */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                        <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                          ✅ Good Layout (Grouped Access)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-800 p-3 rounded border-2 border-green-500 mb-2">
                            <div className="text-xs text-gray-400 mb-1">Cache Line 0 (Read-only):</div>
                            <div className="space-y-1">
                              <div className="bg-blue-600 p-2 rounded text-xs">
                                readFreq
                              </div>
                              <div className="bg-blue-600 p-2 rounded text-xs">
                                readOnly
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-800 p-3 rounded border-2 border-green-500">
                            <div className="text-xs text-gray-400 mb-1">Cache Line 1 (Write):</div>
                            <div className="space-y-1">
                              <div className="bg-orange-600 p-2 rounded text-xs">
                                writeFreq1
                              </div>
                              <div className="bg-orange-600 p-2 rounded text-xs">
                                writeFreq2
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-green-300 flex items-center gap-2">
                            <span>✅</span>
                            <span>Invalidaciones: {structureAccesses.goodLayout}</span>
                          </div>
                          <div className="text-xs text-green-400">
                            Agrupados por patrón de acceso
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={structureLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {structureLogs.map((log, i) => (
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

                {/* Demo 5: Cache-Aware Data Structures */}
                <TabsContent value="demo-cacheaware" className="space-y-4">
                  <div className="bg-gradient-to-br from-red-900/20 to-slate-800/20 p-6 rounded-lg border border-red-700/50">
                    <h3 className="text-xl font-bold text-red-300 mb-4">
                      Demo: Cache-Aware DS (AoS vs SoA)
                    </h3>
                    
                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setCacheAwareRunning(!cacheAwareRunning)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                          cacheAwareRunning
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {cacheAwareRunning ? (
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
                        onClick={resetCacheAware}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="size-4" />
                        Reiniciar
                      </button>
                      <div className="flex-1">
                        <label className="text-sm text-gray-300 mb-1 block">
                          Velocidad: {cacheAwareSpeed}ms
                        </label>
                        <Slider
                          value={[cacheAwareSpeed]}
                          onValueChange={([value]) => setCacheAwareSpeed(value)}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Array of Structs (AoS) */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-orange-500/50">
                        <h4 className="font-bold text-orange-300 mb-3 flex items-center gap-2">
                          Array of Structs (AoS)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-800 p-3 rounded border-2 border-orange-500">
                            <div className="text-xs text-gray-400 mb-2">Memory Layout:</div>
                            <div className="grid grid-cols-4 gap-1">
                              <div className="bg-orange-600 p-1 rounded text-[10px] text-center">
                                x y z
                              </div>
                              <div className="bg-orange-600 p-1 rounded text-[10px] text-center">
                                x y z
                              </div>
                              <div className="bg-orange-600 p-1 rounded text-[10px] text-center">
                                x y z
                              </div>
                              <div className="bg-orange-600 p-1 rounded text-[10px] text-center">
                                x y z
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              Acceso a 'x': carga structs completos
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-green-900/30 p-2 rounded">
                              <div className="text-xs text-gray-400">Cache Hits</div>
                              <div className="font-bold text-green-300">{cacheAwareArrays[0]?.cacheHits || 0}</div>
                            </div>
                            <div className="bg-red-900/30 p-2 rounded">
                              <div className="text-xs text-gray-400">Cache Misses</div>
                              <div className="font-bold text-red-300">{cacheAwareArrays[0]?.cacheMisses || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Struct of Arrays (SoA) */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/50">
                        <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                          ✅ Struct of Arrays (SoA)
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-800 p-3 rounded border-2 border-green-500">
                            <div className="text-xs text-gray-400 mb-2">Memory Layout:</div>
                            <div className="space-y-1">
                              <div className="bg-green-600 p-2 rounded text-xs">
                                x[]: x x x x (contiguos)
                              </div>
                              <div className="bg-blue-600 p-2 rounded text-xs">
                                y[]: y y y y
                              </div>
                              <div className="bg-purple-600 p-2 rounded text-xs">
                                z[]: z z z z
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              Acceso a 'x': carga solo x[]
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-green-900/30 p-2 rounded">
                              <div className="text-xs text-gray-400">Cache Hits</div>
                              <div className="font-bold text-green-300">{cacheAwareArrays[1]?.cacheHits || 0}</div>
                            </div>
                            <div className="bg-red-900/30 p-2 rounded">
                              <div className="text-xs text-gray-400">Cache Misses</div>
                              <div className="font-bold text-red-300">{cacheAwareArrays[1]?.cacheMisses || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Eventos</h4>
                      <div
                        ref={cacheAwareLogsRef}
                        className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs"
                      >
                        {cacheAwareLogs.map((log, i) => (
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
