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

export default function Convoying() {
  // ==================== DEMO 1: Spinlock vs Mutex ====================
  const [spinlockRunning, setSpinlockRunning] = useState(false);
  const [spinlockSpeed, setSpinlockSpeed] = useState(500);
  const [spinlockPhase, setSpinlockPhase] = useState(0);
  const [spinlockThreads, setSpinlockThreads] = useState([
    { id: 1, state: "waiting", priority: 5, type: "spinlock" },
    { id: 2, state: "waiting", priority: 3, type: "spinlock" },
    { id: 3, state: "waiting", priority: 8, type: "mutex" },
    { id: 4, state: "waiting", priority: 2, type: "mutex" },
  ]);
  const [spinlockCpuUsage, setSpinlockCpuUsage] = useState({ spinlock: 0, mutex: 0 });
  const [spinlockLogs, setSpinlockLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 2: Priority Inheritance ====================
  const [priorityRunning, setPriorityRunning] = useState(false);
  const [prioritySpeed, setPrioritySpeed] = useState(500);
  const [priorityPhase, setPriorityPhase] = useState(0);
  const [priorityThreads, setPriorityThreads] = useState([
    { id: 1, name: "Low", priority: 10, effectivePriority: 10, state: "waiting", hasLock: false },
    { id: 2, name: "Medium", priority: 50, effectivePriority: 50, state: "waiting", hasLock: false },
    { id: 3, name: "High", priority: 100, effectivePriority: 100, state: "waiting", hasLock: false },
  ]);
  const [priorityInversionDetected, setPriorityInversionDetected] = useState(false);
  const [priorityBoostActive, setPriorityBoostActive] = useState(false);
  const [priorityLogs, setPriorityLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 3: Preemption Control ====================
  const [preemptionRunning, setPreemptionRunning] = useState(false);
  const [preemptionSpeed, setPreemptionSpeed] = useState(500);
  const [preemptionPhase, setPreemptionPhase] = useState(0);
  const [preemptionThreads, setPreemptionThreads] = useState([
    { id: 1, name: "Thread A", state: "ready", hasLock: false, preemptDisabled: false, criticalSection: false },
    { id: 2, name: "Thread B", state: "ready", hasLock: false, preemptDisabled: false, criticalSection: false },
  ]);
  const [preemptionEnabled, setPreemptionEnabled] = useState(true);
  const [contextSwitches, setContextSwitches] = useState(0);
  const [preemptionLogs, setPreemptionLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 4: Lock-Free Stack ====================
  const [lockfreeRunning, setLockfreeRunning] = useState(false);
  const [lockfreeSpeed, setLockfreeSpeed] = useState(500);
  const [lockfreePhase, setLockfreePhase] = useState(0);
  const [lockfreeStack, setLockfreeStack] = useState<number[]>([]);
  const [lockfreeThreads, setLockfreeThreads] = useState([
    { id: 1, operation: "push", value: 10, state: "ready", casAttempts: 0 },
    { id: 2, operation: "pop", value: null, state: "ready", casAttempts: 0 },
    { id: 3, operation: "push", value: 20, state: "ready", casAttempts: 0 },
  ]);
  const [lockfreeCasCount, setLockfreeCasCount] = useState(0);
  const [lockfreeLogs, setLockfreeLogs] = useState<LogEntry[]>([]);

  // ==================== DEMO 5: Adaptive Spinning ====================
  const [adaptiveRunning, setAdaptiveRunning] = useState(false);
  const [adaptiveSpeed, setAdaptiveSpeed] = useState(500);
  const [adaptivePhase, setAdaptivePhase] = useState(0);
  const [adaptiveThreads, setAdaptiveThreads] = useState([
    { id: 1, state: "ready", spinning: false, blocked: false, spinCount: 0 },
    { id: 2, state: "ready", spinning: false, blocked: false, spinCount: 0 },
    { id: 3, state: "ready", spinning: false, blocked: false, spinCount: 0 },
  ]);
  const [adaptiveOwner, setAdaptiveOwner] = useState<number | null>(null);
  const [adaptiveOwnerRunning, setAdaptiveOwnerRunning] = useState(false);
  const [adaptiveHistory, setAdaptiveHistory] = useState({ successful: 0, failed: 0 });
  const [adaptiveLogs, setAdaptiveLogs] = useState<LogEntry[]>([]);

  // Refs para auto-scroll
  const spinlockLogsRef = useRef<HTMLDivElement>(null);
  const priorityLogsRef = useRef<HTMLDivElement>(null);
  const preemptionLogsRef = useRef<HTMLDivElement>(null);
  const lockfreeLogsRef = useRef<HTMLDivElement>(null);
  const adaptiveLogsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    spinlockLogsRef.current?.scrollTo({ top: spinlockLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [spinlockLogs]);

  useEffect(() => {
    priorityLogsRef.current?.scrollTo({ top: priorityLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [priorityLogs]);

  useEffect(() => {
    preemptionLogsRef.current?.scrollTo({ top: preemptionLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [preemptionLogs]);

  useEffect(() => {
    lockfreeLogsRef.current?.scrollTo({ top: lockfreeLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [lockfreeLogs]);

  useEffect(() => {
    adaptiveLogsRef.current?.scrollTo({ top: adaptiveLogsRef.current.scrollHeight, behavior: "smooth" });
  }, [adaptiveLogs]);

  // ==================== SIMULACIÓN 1: Spinlock vs Mutex ====================
  useEffect(() => {
    if (!spinlockRunning) return;

    const timer = setTimeout(() => {
      setSpinlockPhase((prev) => {
        const next = (prev + 1) % 12;

        if (next === 0) {
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Reiniciando simulación", type: "info" }]);
        } else if (next === 1) {
          // Thread 1 (spinlock) intenta adquirir
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "Thread 1 (spinlock, P=5) intenta adquirir lock", type: "info" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "spinning" } : th)));
          setSpinlockCpuUsage({ spinlock: 100, mutex: 0 });
        } else if (next === 2) {
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread 1 adquirió lock, ejecutando sección crítica", type: "success" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "running" } : th)));
        } else if (next === 3) {
          // Thread 2 (spinlock) intenta mientras T1 tiene lock
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ Thread 2 (spinlock, P=3) hace SPINNING (consume CPU)", type: "warning" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "spinning" } : th)));
          setSpinlockCpuUsage({ spinlock: 200, mutex: 0 }); // Dos threads consumiendo CPU
        } else if (next === 4) {
          // Thread 3 (mutex) intenta
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "Thread 3 (mutex, P=8) se BLOQUEA (no consume CPU)", type: "info" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "blocked" } : th)));
          setSpinlockCpuUsage({ spinlock: 200, mutex: 0 }); // Mutex no consume CPU
        } else if (next === 5) {
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Thread 2 sigue haciendo SPINNING (desperdicio de CPU)", type: "warning" }]);
        } else if (next === 6) {
          // T1 libera lock
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "Thread 1 libera lock", type: "info" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "finished" } : th)));
        } else if (next === 7) {
          // T2 adquiere inmediatamente (spinlock gana por estar spinning)
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread 2 adquiere lock INMEDIATAMENTE (ventaja del spinning)", type: "success" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "running" } : th)));
          setSpinlockCpuUsage({ spinlock: 100, mutex: 0 });
        } else if (next === 8) {
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 ejecutando sección crítica", type: "info" }]);
        } else if (next === 9) {
          // T2 libera
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 libera lock", type: "info" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "finished" } : th)));
        } else if (next === 10) {
          // T3 despierta y adquiere
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "Thread 3 (mutex) despierta y adquiere lock", type: "success" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "running" } : th)));
          setSpinlockCpuUsage({ spinlock: 0, mutex: 0 });
        } else if (next === 11) {
          setSpinlockLogs((logs) => [...logs, { time: Date.now(), message: "✅ Comparación: Spinlock = baja latencia, alto CPU | Mutex = alta latencia, bajo CPU", type: "success" }]);
          setSpinlockThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "finished" } : th)));
          setSpinlockCpuUsage({ spinlock: 0, mutex: 0 });
        }

        return next;
      });
    }, spinlockSpeed);

    return () => clearTimeout(timer);
  }, [spinlockRunning, spinlockPhase, spinlockSpeed]);

  // ==================== SIMULACIÓN 2: Priority Inheritance ====================
  useEffect(() => {
    if (!priorityRunning) return;

    const timer = setTimeout(() => {
      setPriorityPhase((prev) => {
        const next = (prev + 1) % 10;

        if (next === 0) {
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Reiniciando simulación de Priority Inheritance", type: "info" }]);
          setPriorityInversionDetected(false);
          setPriorityBoostActive(false);
        } else if (next === 1) {
          // Low priority adquiere lock
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "Thread Low (P=10) adquiere lock", type: "info" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "running", hasLock: true } : th)));
        } else if (next === 2) {
          // Medium priority ejecuta (no usa lock)
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "Thread Medium (P=50) ejecuta trabajo (no necesita lock)", type: "info" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "running" } : th)));
        } else if (next === 3) {
          // High priority intenta adquirir lock
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ Thread High (P=100) intenta adquirir lock → BLOQUEADO", type: "warning" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "blocked" } : th)));
          setPriorityInversionDetected(true);
        } else if (next === 4) {
          // Inversión de prioridad: Medium ejecuta mientras High espera
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "🚨 INVERSIÓN DE PRIORIDAD: Medium (P=50) ejecuta, High (P=100) espera!", type: "error" }]);
        } else if (next === 5) {
          // Priority Inheritance activado
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "✅ PRIORITY INHERITANCE: Low hereda prioridad 100 de High", type: "success" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 1 ? { ...th, effectivePriority: 100 } : th)));
          setPriorityBoostActive(true);
        } else if (next === 6) {
          // Low (boosted) desaloja a Medium
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "Thread Low (P efectiva=100) desaloja a Medium", type: "info" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "ready" } : th)));
        } else if (next === 7) {
          // Low completa y libera lock
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "Thread Low completa sección crítica y libera lock", type: "info" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "finished", hasLock: false, effectivePriority: 10 } : th)));
          setPriorityBoostActive(false);
        } else if (next === 8) {
          // High adquiere lock
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread High adquiere lock y ejecuta", type: "success" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "running", hasLock: true } : th)));
          setPriorityInversionDetected(false);
        } else if (next === 9) {
          setPriorityLogs((logs) => [...logs, { time: Date.now(), message: "✅ Priority Inheritance previno convoying prolongado", type: "success" }]);
          setPriorityThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "finished", hasLock: false } : th)));
        }

        return next;
      });
    }, prioritySpeed);

    return () => clearTimeout(timer);
  }, [priorityRunning, priorityPhase, prioritySpeed]);

  // ==================== SIMULACIÓN 3: Preemption Control ====================
  useEffect(() => {
    if (!preemptionRunning) return;

    const timer = setTimeout(() => {
      setPreemptionPhase((prev) => {
        const next = (prev + 1) % 10;

        if (next === 0) {
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Reiniciando simulación de Preemption Control", type: "info" }]);
          setContextSwitches(0);
        } else if (next === 1) {
          // Thread A adquiere lock y deshabilita preemption
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "Thread A adquiere lock y DESHABILITA preemption", type: "info" }]);
          setPreemptionThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "running", hasLock: true, preemptDisabled: true, criticalSection: true } : th)));
          setPreemptionEnabled(false);
        } else if (next === 2) {
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "Thread A en sección crítica (preemption disabled)", type: "info" }]);
        } else if (next === 3) {
          // Timer interrupt intenta desalojar Thread A
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "⏰ Timer interrupt: intento de preemption BLOQUEADO", type: "warning" }]);
        } else if (next === 4) {
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread A NO es desalojado (previene convoying)", type: "success" }]);
        } else if (next === 5) {
          // Thread A completa sección crítica
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "Thread A completa sección crítica y libera lock", type: "info" }]);
          setPreemptionThreads((t) => t.map((th) => (th.id === 1 ? { ...th, criticalSection: false, hasLock: false } : th)));
        } else if (next === 6) {
          // Thread A reactiva preemption
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "Thread A REACTIVA preemption", type: "info" }]);
          setPreemptionThreads((t) => t.map((th) => (th.id === 1 ? { ...th, preemptDisabled: false } : th)));
          setPreemptionEnabled(true);
        } else if (next === 7) {
          // Context switch ocurre ahora
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Context switch a Thread B", type: "info" }]);
          setPreemptionThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "ready" } : th.id === 2 ? { ...th, state: "running" } : th)));
          setContextSwitches((c) => c + 1);
        } else if (next === 8) {
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "Thread B ejecuta su trabajo", type: "info" }]);
        } else if (next === 9) {
          setPreemptionLogs((logs) => [...logs, { time: Date.now(), message: "✅ Preemption control redujo context switches durante locks", type: "success" }]);
          setPreemptionThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "finished" } : th)));
        }

        return next;
      });
    }, preemptionSpeed);

    return () => clearTimeout(timer);
  }, [preemptionRunning, preemptionPhase, preemptionSpeed]);

  // ==================== SIMULACIÓN 4: Lock-Free Stack ====================
  useEffect(() => {
    if (!lockfreeRunning) return;

    const timer = setTimeout(() => {
      setLockfreePhase((prev) => {
        const next = (prev + 1) % 12;

        if (next === 0) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Reiniciando simulación Lock-Free", type: "info" }]);
          setLockfreeStack([]);
          setLockfreeCasCount(0);
        } else if (next === 1) {
          // Thread 1 push(10)
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "Thread 1 intenta PUSH(10)", type: "info" }]);
          setLockfreeThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "executing" } : th)));
        } else if (next === 2) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "Thread 1: CAS exitoso, 10 agregado al stack", type: "success" }]);
          setLockfreeStack([10]);
          setLockfreeCasCount((c) => c + 1);
          setLockfreeThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "finished", casAttempts: 1 } : th)));
        } else if (next === 3) {
          // Thread 2 y 3 simultáneamente
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 intenta POP, Thread 3 intenta PUSH(20) SIMULTÁNEAMENTE", type: "warning" }]);
          setLockfreeThreads((t) => t.map((th) => (th.id === 2 || th.id === 3 ? { ...th, state: "executing" } : th)));
        } else if (next === 4) {
          // Thread 3 gana CAS
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "Thread 3: CAS exitoso, 20 agregado (Thread 2 falló CAS)", type: "success" }]);
          setLockfreeStack([20, 10]);
          setLockfreeCasCount((c) => c + 1);
          setLockfreeThreads((t) => t.map((th) => (th.id === 3 ? { ...th, casAttempts: 1 } : th.id === 2 ? { ...th, casAttempts: 1 } : th)));
        } else if (next === 5) {
          // Thread 2 reintenta POP
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 REINTENTA POP con nuevo top", type: "info" }]);
        } else if (next === 6) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2: CAS exitoso, POP(20) del stack", type: "success" }]);
          setLockfreeStack([10]);
          setLockfreeCasCount((c) => c + 1);
          setLockfreeThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "finished", value: 20, casAttempts: 2 } : th.id === 3 ? { ...th, state: "finished" } : th)));
        } else if (next === 7) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "✅ Stack final: [10]", type: "info" }]);
        } else if (next === 8) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "📊 Total CAS: " + (lockfreeCasCount + 1) + " (sin locks, sin bloqueos)", type: "success" }]);
        } else if (next === 9) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "✅ Ventajas: No convoying, no priority inversion", type: "success" }]);
        } else if (next === 10) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "⚠️ Desventajas: CAS puede fallar y reintentar (Thread 2: 2 intentos)", type: "warning" }]);
        } else if (next === 11) {
          setLockfreeLogs((logs) => [...logs, { time: Date.now(), message: "Lock-free elimina completamente el convoying", type: "success" }]);
        }

        return next;
      });
    }, lockfreeSpeed);

    return () => clearTimeout(timer);
  }, [lockfreeRunning, lockfreePhase, lockfreeSpeed, lockfreeCasCount]);

  // ==================== SIMULACIÓN 5: Adaptive Spinning ====================
  useEffect(() => {
    if (!adaptiveRunning) return;

    const timer = setTimeout(() => {
      setAdaptivePhase((prev) => {
        const next = (prev + 1) % 14;

        if (next === 0) {
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "🔄 Reiniciando Adaptive Spinning", type: "info" }]);
          setAdaptiveHistory({ successful: 0, failed: 0 });
        } else if (next === 1) {
          // Thread 1 adquiere lock
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 1 adquiere lock", type: "info" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "running" } : th)));
          setAdaptiveOwner(1);
          setAdaptiveOwnerRunning(true);
        } else if (next === 2) {
          // Thread 2 intenta adquirir
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 intenta adquirir lock...", type: "info" }]);
        } else if (next === 3) {
          // Heurística: owner está ejecutándose → SPIN
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "🔍 Heurística: Owner (T1) EJECUTÁNDOSE → Decisión: SPIN", type: "warning" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 2 ? { ...th, spinning: true, spinCount: 1 } : th)));
        } else if (next === 4) {
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 hace SPINNING (esperando lock)...", type: "info" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 2 ? { ...th, spinCount: th.spinCount + 1 } : th)));
        } else if (next === 5) {
          // Thread 1 libera lock
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 1 libera lock", type: "info" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 1 ? { ...th, state: "finished" } : th)));
          setAdaptiveOwner(null);
          setAdaptiveOwnerRunning(false);
        } else if (next === 6) {
          // Thread 2 adquiere inmediatamente (spinning exitoso)
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "✅ Thread 2 adquiere lock INMEDIATAMENTE (spinning exitoso)", type: "success" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "running", spinning: false } : th)));
          setAdaptiveOwner(2);
          setAdaptiveOwnerRunning(true);
          setAdaptiveHistory((h) => ({ ...h, successful: h.successful + 1 }));
        } else if (next === 7) {
          // Thread 3 intenta mientras owner bloqueado
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 3 intenta adquirir lock...", type: "info" }]);
          setAdaptiveOwnerRunning(false); // Simular que T2 está bloqueado
        } else if (next === 8) {
          // Heurística: owner NO ejecutándose → BLOCK
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "🔍 Heurística: Owner (T2) NO ejecutándose → Decisión: BLOCK", type: "warning" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 3 ? { ...th, blocked: true } : th)));
        } else if (next === 9) {
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 3 se BLOQUEA (ahorra CPU)", type: "info" }]);
          setAdaptiveHistory((h) => ({ ...h, failed: h.failed + 1 }));
        } else if (next === 10) {
          // Thread 2 libera
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 2 libera lock", type: "info" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 2 ? { ...th, state: "finished" } : th)));
          setAdaptiveOwner(null);
        } else if (next === 11) {
          // Thread 3 despierta
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: "Thread 3 despierta y adquiere lock", type: "success" }]);
          setAdaptiveThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "running", blocked: false } : th)));
          setAdaptiveOwner(3);
        } else if (next === 12) {
          setAdaptiveThreads((t) => t.map((th) => (th.id === 3 ? { ...th, state: "finished" } : th)));
          setAdaptiveOwner(null);
        } else if (next === 13) {
          const { successful, failed } = adaptiveHistory;
          const total = successful + failed;
          const rate = total > 0 ? ((successful / total) * 100).toFixed(0) : 0;
          setAdaptiveLogs((logs) => [...logs, { time: Date.now(), message: `✅ Historial: ${successful} exitosos, ${failed} fallidos (${rate}% efectividad)`, type: "success" }]);
        }

        return next;
      });
    }, adaptiveSpeed);

    return () => clearTimeout(timer);
  }, [adaptiveRunning, adaptivePhase, adaptiveSpeed, adaptiveHistory]);

  // ==================== FUNCIONES RESET ====================
  const resetSpinlock = () => {
    setSpinlockRunning(false);
    setSpinlockPhase(0);
    setSpinlockThreads([
      { id: 1, state: "waiting", priority: 5, type: "spinlock" },
      { id: 2, state: "waiting", priority: 3, type: "spinlock" },
      { id: 3, state: "waiting", priority: 8, type: "mutex" },
      { id: 4, state: "waiting", priority: 2, type: "mutex" },
    ]);
    setSpinlockCpuUsage({ spinlock: 0, mutex: 0 });
    setSpinlockLogs([]);
  };

  const resetPriority = () => {
    setPriorityRunning(false);
    setPriorityPhase(0);
    setPriorityThreads([
      { id: 1, name: "Low", priority: 10, effectivePriority: 10, state: "waiting", hasLock: false },
      { id: 2, name: "Medium", priority: 50, effectivePriority: 50, state: "waiting", hasLock: false },
      { id: 3, name: "High", priority: 100, effectivePriority: 100, state: "waiting", hasLock: false },
    ]);
    setPriorityInversionDetected(false);
    setPriorityBoostActive(false);
    setPriorityLogs([]);
  };

  const resetPreemption = () => {
    setPreemptionRunning(false);
    setPreemptionPhase(0);
    setPreemptionThreads([
      { id: 1, name: "Thread A", state: "ready", hasLock: false, preemptDisabled: false, criticalSection: false },
      { id: 2, name: "Thread B", state: "ready", hasLock: false, preemptDisabled: false, criticalSection: false },
    ]);
    setPreemptionEnabled(true);
    setContextSwitches(0);
    setPreemptionLogs([]);
  };

  const resetLockfree = () => {
    setLockfreeRunning(false);
    setLockfreePhase(0);
    setLockfreeStack([]);
    setLockfreeThreads([
      { id: 1, operation: "push", value: 10, state: "ready", casAttempts: 0 },
      { id: 2, operation: "pop", value: null, state: "ready", casAttempts: 0 },
      { id: 3, operation: "push", value: 20, state: "ready", casAttempts: 0 },
    ]);
    setLockfreeCasCount(0);
    setLockfreeLogs([]);
  };

  const resetAdaptive = () => {
    setAdaptiveRunning(false);
    setAdaptivePhase(0);
    setAdaptiveThreads([
      { id: 1, state: "ready", spinning: false, blocked: false, spinCount: 0 },
      { id: 2, state: "ready", spinning: false, blocked: false, spinCount: 0 },
      { id: 3, state: "ready", spinning: false, blocked: false, spinCount: 0 },
    ]);
    setAdaptiveOwner(null);
    setAdaptiveOwnerRunning(false);
    setAdaptiveHistory({ successful: 0, failed: 0 });
    setAdaptiveLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-8 text-amber-400" />
          <h1 className="text-4xl font-bold">Convoying — Pseudocódigos</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed">
          Colección de pseudocódigos para las técnicas que previenen el problema de convoying 
          (convoy effect): spinlocks, priority boosting y control de preemption. El convoying 
          ocurre cuando threads de alta prioridad esperan por threads de baja prioridad que 
          mantienen locks.
        </p>
      </div>

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
              <Tabs defaultValue="spinlocks" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="spinlocks" className="data-[state=active]:bg-blue-600">
                    Spinlocks
                  </TabsTrigger>
                  <TabsTrigger value="priority" className="data-[state=active]:bg-blue-600">
                    Priority Boosting
                  </TabsTrigger>
                  <TabsTrigger value="preemption" className="data-[state=active]:bg-blue-600">
                    Preemption Control
                  </TabsTrigger>
                  <TabsTrigger value="lockfree" className="data-[state=active]:bg-blue-600">
                    Lock-Free
                  </TabsTrigger>
                  <TabsTrigger value="adaptive" className="data-[state=active]:bg-blue-600">
                    Adaptive Spinning
                  </TabsTrigger>
                </TabsList>

                {/* Spinlocks */}
                <TabsContent value="spinlocks" className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 p-6 rounded-lg border border-blue-700/50">
                    <h3 className="text-2xl font-bold text-blue-300 mb-3">
                      🔄 Solución 1: Spinlocks
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Los spinlocks utilizan busy-waiting (espera activa) en lugar de bloquear el thread. 
                      Cuando un thread intenta adquirir un lock ocupado, sigue ejecutándose en un loop 
                      verificando el estado del lock. Esto evita el overhead de context switches y es 
                      eficiente para períodos de espera cortos.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Busy-waiting sin context switches</li>
                        <li>• Ideal para secciones críticas cortas</li>
                        <li>• Usa operaciones atómicas (CAS)</li>
                        <li>• Evita overhead del scheduler</li>
                        <li>• Puede causar uso excesivo de CPU</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Spinlocks
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Spinlock básico con Test-and-Set
estructura Spinlock {
    locked: booleano atómico
}

función crear_spinlock() -> Spinlock {
    lock: Spinlock
    lock.locked = falso
    return lock
}

// Adquirir spinlock (busy-wait)
función spin_lock(lock: Spinlock) {
    mientras test_and_set(&lock.locked, verdadero) hacer
        // Busy-wait: consumir CPU hasta que el lock esté libre
        // El thread NO se bloquea ni cede el CPU
    fin mientras
    
    // Lock adquirido
    memory_barrier()  // Garantizar orden de memoria
}

// Liberar spinlock
función spin_unlock(lock: Spinlock) {
    memory_barrier()  // Garantizar que todas las escrituras sean visibles
    atomic_store(&lock.locked, falso)
}

// Test-and-Set atómico
función test_and_set(addr: puntero a booleano, nuevo_valor: booleano) -> booleano {
    // Operación atómica
    old_value = *addr
    *addr = nuevo_valor
    return old_value
}

// Spinlock mejorado con Compare-and-Swap
función spin_lock_cas(lock: Spinlock) {
    esperado = falso
    
    mientras no compare_and_swap(&lock.locked, esperado, verdadero) hacer
        esperado = falso  // Resetear para siguiente intento
        // Busy-wait
    fin mientras
    
    memory_barrier()
}

// Spinlock con exponential backoff (reduce contención)
función spin_lock_backoff(lock: Spinlock) {
    delay = DELAY_INICIAL  // ej. 10 ciclos
    max_delay = DELAY_MAXIMO  // ej. 1000 ciclos
    
    mientras test_and_set(&lock.locked, verdadero) hacer
        // Esperar con backoff exponencial
        busy_wait(delay)
        delay = min(delay * 2, max_delay)
    fin mientras
    
    memory_barrier()
}

// Spinlock con yield (híbrido)
función spin_lock_yield(lock: Spinlock) {
    intentos = 0
    max_spins = 100
    
    mientras test_and_set(&lock.locked, verdadero) hacer
        intentos++
        
        si intentos >= max_spins entonces
            // Demasiados intentos, ceder CPU
            thread_yield()
            intentos = 0
        fin si
    fin mientras
    
    memory_barrier()
}

// Test-and-Test-and-Set (reducir tráfico de bus)
función spin_lock_ttas(lock: Spinlock) {
    mientras verdadero hacer
        // Primera fase: solo leer (no escribe en el bus)
        mientras atomic_load(&lock.locked) == verdadero hacer
            cpu_relax()  // Hint al CPU (ej. PAUSE en x86)
        fin mientras
        
        // Segunda fase: intentar adquirir
        si no test_and_set(&lock.locked, verdadero) entonces
            break  // Lock adquirido
        fin si
    fin mientras
    
    memory_barrier()
}

// Ticket spinlock (garantiza fairness FIFO)
estructura TicketSpinlock {
    ticket_actual: entero atómico
    ticket_servido: entero atómico
}

función ticket_lock(lock: TicketSpinlock) {
    // Obtener ticket
    mi_ticket = atomic_fetch_add(&lock.ticket_actual, 1)
    
    // Esperar turno
    mientras atomic_load(&lock.ticket_servido) != mi_ticket hacer
        cpu_relax()
    fin mientras
    
    memory_barrier()
}

función ticket_unlock(lock: TicketSpinlock) {
    memory_barrier()
    atomic_fetch_add(&lock.ticket_servido, 1)
}

// MCS Lock (queue-based, mejor escalabilidad)
estructura MCS_Node {
    next: puntero a MCS_Node atómico
    locked: booleano atómico
}

estructura MCS_Lock {
    tail: puntero a MCS_Node atómico
}

función mcs_lock(lock: MCS_Lock, mi_nodo: MCS_Node) {
    mi_nodo.next = NULL
    mi_nodo.locked = verdadero
    
    // Añadirse a la cola
    pred = atomic_swap(&lock.tail, mi_nodo)
    
    si pred != NULL entonces
        // Hay threads esperando
        atomic_store(&pred.next, mi_nodo)
        
        // Esperar hasta que el predecesor nos libere
        mientras atomic_load(&mi_nodo.locked) hacer
            cpu_relax()
        fin mientras
    fin si
    
    memory_barrier()
}

función mcs_unlock(lock: MCS_Lock, mi_nodo: MCS_Node) {
    memory_barrier()
    
    next = atomic_load(&mi_nodo.next)
    
    si next == NULL entonces
        // Posiblemente somos el último
        si compare_and_swap(&lock.tail, mi_nodo, NULL) entonces
            // Éramos el último, terminado
            return
        fin si
        
        // Alguien más se está añadiendo, esperar
        mientras (next = atomic_load(&mi_nodo.next)) == NULL hacer
            cpu_relax()
        fin mientras
    fin si
    
    // Liberar al siguiente
    atomic_store(&next.locked, falso)
}

// Ejemplo: Usar spinlock para sección crítica
función ejemplo_uso_spinlock() {
    lock: Spinlock = crear_spinlock()
    contador_compartido: entero = 0
    
    función worker_thread() {
        para i = 1 hasta 1000 hacer
            spin_lock(lock)
            
            // Sección crítica (DEBE ser corta)
            contador_compartido++
            
            spin_unlock(lock)
        fin para
    }
    
    // Crear threads
    threads: arreglo[4] de Thread
    para i = 0 hasta 3 hacer
        threads[i] = crear_thread(worker_thread)
    fin para
    
    // Esperar
    para cada thread en threads hacer
        thread.join()
    fin para
    
    imprimir("Contador final: " + contador_compartido)
}

// Comparación: Spinlock vs Mutex
función comparar_spinlock_mutex() {
    // SPINLOCK: Mejor para
    // - Secciones críticas MUY cortas (< 100 ciclos)
    // - Cuando el lock rara vez está contendido
    // - Contexto de kernel/interrupt handlers
    // - Sistemas con muchos cores
    
    // MUTEX: Mejor para
    // - Secciones críticas largas
    // - Alta contención del lock
    // - Necesidad de dormir threads
    // - Ahorrar CPU
}

// Adaptive Mutex (híbrido: spin luego block)
función adaptive_mutex_lock(lock: Mutex) {
    intentos_spin = 0
    max_spins = 1000
    
    // Fase 1: Spin
    mientras intentos_spin < max_spins hacer
        si try_lock(lock) entonces
            return  // Lock adquirido
        fin si
        
        intentos_spin++
        cpu_relax()
    fin mientras
    
    // Fase 2: Block (usar mutex tradicional)
    mutex_lock(lock)
}

// Métricas de rendimiento
función medir_spinlock_performance() {
    lock: Spinlock = crear_spinlock()
    threads = 8
    iteraciones = 100000
    
    inicio = timestamp()
    
    función thread_worker() {
        para i = 1 hasta iteraciones hacer
            spin_lock(lock)
            // Trabajo mínimo
            spin_unlock(lock)
        fin para
    }
    
    para i = 1 hasta threads hacer
        crear_thread(thread_worker)
    fin para
    
    wait_all_threads()
    
    fin = timestamp()
    tiempo_total = fin - inicio
    ops_por_segundo = (iteraciones * threads) / tiempo_total
    
    imprimir("Operaciones/seg: " + ops_por_segundo)
    imprimir("Latencia promedio: " + (tiempo_total / (iteraciones * threads)))
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Priority Boosting */}
                <TabsContent value="priority" className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 p-6 rounded-lg border border-purple-700/50">
                    <h3 className="text-2xl font-bold text-purple-300 mb-3">
                      ⬆️ Solución 2: Priority Boosting (Priority Inheritance)
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Priority boosting aumenta temporalmente la prioridad de un thread de baja prioridad 
                      que mantiene un lock necesitado por un thread de alta prioridad. Esto previene la 
                      inversión de prioridad y el convoying, asegurando que el thread con el lock complete 
                      rápidamente su sección crítica.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Previene inversión de prioridad</li>
                        <li>• Boost temporal de prioridad</li>
                        <li>• Restaura prioridad al liberar lock</li>
                        <li>• Usado en sistemas de tiempo real</li>
                        <li>• Puede causar cadenas de herencia</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Priority Boosting
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Estructura de thread con prioridad
estructura Thread {
    id: entero
    prioridad_base: entero
    prioridad_efectiva: entero
    locks_mantenidos: Lista<Lock>
    esperando_lock: Lock o NULL
}

// Lock con información de propietario
estructura PriorityInheritanceLock {
    locked: booleano atómico
    owner: Thread o NULL
    wait_queue: Cola<Thread> ordenada por prioridad
    mutex: Mutex
}

// Crear lock con herencia de prioridad
función crear_pi_lock() -> PriorityInheritanceLock {
    lock: PriorityInheritanceLock
    lock.locked = falso
    lock.owner = NULL
    lock.wait_queue = nueva_cola_prioridad()
    return lock
}

// Adquirir lock con priority inheritance
función pi_lock(lock: PriorityInheritanceLock, thread: Thread) {
    lock.mutex.lock()
    
    si no lock.locked entonces
        // Lock disponible
        lock.locked = verdadero
        lock.owner = thread
        thread.locks_mantenidos.append(lock)
        lock.mutex.unlock()
        return
    fin si
    
    // Lock ocupado - aplicar priority inheritance
    owner = lock.owner
    
    si thread.prioridad_efectiva > owner.prioridad_efectiva entonces
        // Thread actual tiene mayor prioridad que el owner
        // Boost la prioridad del owner
        boost_priority(owner, thread.prioridad_efectiva)
    fin si
    
    // Añadir a cola de espera
    thread.esperando_lock = lock
    lock.wait_queue.enqueue(thread)
    
    lock.mutex.unlock()
    
    // Dormir hasta ser despertado
    thread.dormir()
    
    // Al despertar, el lock fue adquirido
    thread.esperando_lock = NULL
}

// Liberar lock con priority inheritance
función pi_unlock(lock: PriorityInheritanceLock, thread: Thread) {
    lock.mutex.lock()
    
    // Remover lock de la lista del thread
    thread.locks_mantenidos.remove(lock)
    
    // Restaurar prioridad del thread
    recalcular_prioridad(thread)
    
    // Despertar siguiente thread en espera
    si no lock.wait_queue.vacia() entonces
        next_thread = lock.wait_queue.dequeue()
        
        // Transferir ownership
        lock.owner = next_thread
        next_thread.locks_mantenidos.append(lock)
        
        lock.mutex.unlock()
        
        // Despertar thread
        next_thread.despertar()
    sino
        // No hay threads esperando
        lock.locked = falso
        lock.owner = NULL
        lock.mutex.unlock()
    fin si
}

// Boost de prioridad (herencia)
función boost_priority(thread: Thread, nueva_prioridad: entero) {
    si nueva_prioridad <= thread.prioridad_efectiva entonces
        return  // No necesita boost
    fin si
    
    old_priority = thread.prioridad_efectiva
    thread.prioridad_efectiva = nueva_prioridad
    
    // Reordenar en cola del scheduler
    scheduler_update_priority(thread, old_priority, nueva_prioridad)
    
    // Propagar boost a threads bloqueantes (cadena de herencia)
    si thread.esperando_lock != NULL entonces
        lock = thread.esperando_lock
        
        si lock.owner != NULL entonces
            // Propagar boost al owner del lock que estamos esperando
            boost_priority(lock.owner, nueva_prioridad)
        fin si
    fin si
}

// Recalcular prioridad después de liberar lock
función recalcular_prioridad(thread: Thread) {
    max_inherited = thread.prioridad_base
    
    // Buscar la máxima prioridad heredada de threads esperando
    para cada lock en thread.locks_mantenidos hacer
        para cada waiter en lock.wait_queue hacer
            si waiter.prioridad_efectiva > max_inherited entonces
                max_inherited = waiter.prioridad_efectiva
            fin si
        fin para
    fin para
    
    si max_inherited != thread.prioridad_efectiva entonces
        old_priority = thread.prioridad_efectiva
        thread.prioridad_efectiva = max_inherited
        scheduler_update_priority(thread, old_priority, max_inherited)
    fin si
}

// Priority Ceiling Protocol (alternativa)
estructura PriorityCeilingLock {
    locked: booleano
    ceiling_priority: entero  // Prioridad máxima de todos los threads que lo usan
    owner: Thread o NULL
    wait_queue: Cola<Thread>
}

función pc_lock(lock: PriorityCeilingLock, thread: Thread) {
    lock.mutex.lock()
    
    // Elevar inmediatamente a ceiling priority
    old_priority = thread.prioridad_efectiva
    thread.prioridad_efectiva = lock.ceiling_priority
    scheduler_update_priority(thread, old_priority, lock.ceiling_priority)
    
    mientras lock.locked hacer
        thread.esperando_lock = lock
        lock.wait_queue.enqueue(thread)
        
        lock.mutex.unlock()
        thread.dormir()
        lock.mutex.lock()
    fin mientras
    
    lock.locked = verdadero
    lock.owner = thread
    thread.esperando_lock = NULL
    
    lock.mutex.unlock()
}

función pc_unlock(lock: PriorityCeilingLock, thread: Thread) {
    lock.mutex.lock()
    
    lock.locked = falso
    lock.owner = NULL
    
    // Restaurar prioridad original
    recalcular_prioridad(thread)
    
    // Despertar siguiente
    si no lock.wait_queue.vacia() entonces
        next = lock.wait_queue.dequeue()
        next.despertar()
    fin si
    
    lock.mutex.unlock()
}

// Ejemplo: Prevenir inversión de prioridad
función ejemplo_priority_inversion() {
    lock: PriorityInheritanceLock = crear_pi_lock()
    recurso_compartido: entero = 0
    
    // Thread de BAJA prioridad
    función low_priority_thread() {
        thread_actual.prioridad_base = 10
        thread_actual.prioridad_efectiva = 10
        
        pi_lock(lock, thread_actual)
        
        imprimir("Low: Lock adquirido (prioridad: " + thread_actual.prioridad_efectiva + ")")
        
        // Trabajo largo
        para i = 1 hasta 1000000 hacer
            recurso_compartido++
        fin para
        
        imprimir("Low: Liberando lock")
        pi_unlock(lock, thread_actual)
    }
    
    // Thread de MEDIA prioridad (no usa el lock)
    función medium_priority_thread() {
        thread_actual.prioridad_base = 50
        thread_actual.prioridad_efectiva = 50
        
        // Trabajo que consume CPU
        para i = 1 hasta 500000 hacer
            // Busy work
        fin para
    }
    
    // Thread de ALTA prioridad
    función high_priority_thread() {
        thread_actual.prioridad_base = 100
        thread_actual.prioridad_efectiva = 100
        
        dormir(100ms)  // Dar tiempo a low priority para adquirir lock
        
        imprimir("High: Intentando adquirir lock")
        pi_lock(lock, thread_actual)
        
        // Con Priority Inheritance:
        // El thread LOW será boosted a prioridad 100
        // Esto previene que MEDIUM lo retrase
        
        imprimir("High: Lock adquirido")
        recurso_compartido += 1000
        
        pi_unlock(lock, thread_actual)
    }
    
    crear_thread(low_priority_thread)
    dormir(10ms)
    crear_thread(medium_priority_thread)
    crear_thread(high_priority_thread)
}

// Cadena de herencia de prioridad
función ejemplo_priority_chain() {
    lock_a: PriorityInheritanceLock = crear_pi_lock()
    lock_b: PriorityInheritanceLock = crear_pi_lock()
    
    // Thread 1 (prioridad 10) mantiene lock_a
    función thread1() {
        prioridad = 10
        pi_lock(lock_a, thread_actual)
        
        // Trabajo largo
        dormir(1000ms)
        
        pi_unlock(lock_a, thread_actual)
    }
    
    // Thread 2 (prioridad 50) mantiene lock_b, espera lock_a
    función thread2() {
        prioridad = 50
        pi_lock(lock_b, thread_actual)
        
        // Thread2 espera lock_a (owned by thread1)
        // Thread1 heredará prioridad 50
        pi_lock(lock_a, thread_actual)
        
        pi_unlock(lock_a, thread_actual)
        pi_unlock(lock_b, thread_actual)
    }
    
    // Thread 3 (prioridad 100) espera lock_b
    función thread3() {
        prioridad = 100
        
        // Thread3 espera lock_b (owned by thread2)
        // Thread2 heredará prioridad 100
        // Thread1 heredará prioridad 100 (cadena)
        pi_lock(lock_b, thread_actual)
        
        pi_unlock(lock_b, thread_actual)
    }
}

// Métricas de inversión de prioridad
función medir_priority_inversion() {
    high_wait_time: entero = 0
    inversions_detected: entero = 0
    
    // Detectar cuándo thread de alta prioridad espera por baja
    si thread_high.esperando_lock != NULL entonces
        owner = thread_high.esperando_lock.owner
        
        si owner.prioridad_base < thread_high.prioridad_base entonces
            inversions_detected++
            
            // Medir tiempo de espera
            high_wait_time = timestamp() - thread_high.wait_start
            
            imprimir("Inversión detectada!")
            imprimir("  High priority: " + thread_high.prioridad_base)
            imprimir("  Low priority: " + owner.prioridad_base)
            imprimir("  Tiempo de espera: " + high_wait_time + "ms")
        fin si
    fin si
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Preemption Control */}
                <TabsContent value="preemption" className="space-y-4">
                  <div className="bg-gradient-to-br from-green-900/30 to-slate-800/30 p-6 rounded-lg border border-green-700/50">
                    <h3 className="text-2xl font-bold text-green-300 mb-3">
                      🛡️ Solución 3: Preemption Control
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      El control de preemption desactiva temporalmente la capacidad del scheduler de 
                      interrumpir un thread mientras mantiene un lock. Esto previene el convoying al 
                      garantizar que el thread complete su sección crítica sin ser desalojado por el 
                      scheduler, reduciendo el tiempo que otros threads deben esperar.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Desactiva preemption temporalmente</li>
                        <li>• Garantiza completar sección crítica</li>
                        <li>• Reduce latencia de locks</li>
                        <li>• Usado en kernels de sistemas operativos</li>
                        <li>• Debe usarse con cuidado (afecta latencia)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Preemption Control
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Control de preemption a nivel de thread
estructura PreemptionState {
    count: entero  // Contador de desactivaciones anidadas
    interrupts_enabled: booleano
}

// Variable por-thread
thread_local preempt_state: PreemptionState

// Desactivar preemption
función preempt_disable() {
    preempt_state.count++
    
    si preempt_state.count == 1 entonces
        // Primera desactivación - deshabilitar interrupts del scheduler
        preempt_state.interrupts_enabled = scheduler_interrupts_enabled()
        disable_scheduler_interrupts()
    fin si
    
    // Barrera de compilador (prevenir reordenamiento)
    compiler_barrier()
}

// Reactivar preemption
función preempt_enable() {
    compiler_barrier()
    
    preempt_state.count--
    
    si preempt_state.count == 0 entonces
        // Última reactivación
        si preempt_state.interrupts_enabled entonces
            enable_scheduler_interrupts()
        fin si
        
        // Verificar si hay preemption pendiente
        si scheduler_should_preempt() entonces
            scheduler_preempt()
        fin si
    fin si
    
    si preempt_state.count < 0 entonces
        panic("Preemption count underflow!")
    fin si
}

// Lock con preemption disabled
estructura PreemptDisabledLock {
    spinlock: Spinlock
}

función pd_lock(lock: PreemptDisabledLock) {
    // Desactivar preemption ANTES de adquirir spinlock
    preempt_disable()
    
    // Ahora adquirir el spinlock
    spin_lock(&lock.spinlock)
    
    // En este punto:
    // - Tenemos el lock
    // - Preemption está desactivada
    // - No podemos ser desalojados
}

función pd_unlock(lock: PreemptDisabledLock) {
    // Liberar spinlock
    spin_unlock(&lock.spinlock)
    
    // Reactivar preemption (puede causar preemption inmediata)
    preempt_enable()
}

// Read-Copy-Update (RCU) con preemption control
estructura RCU_Section {
    nesting_level: entero
}

thread_local rcu: RCU_Section

función rcu_read_lock() {
    preempt_disable()
    rcu.nesting_level++
}

función rcu_read_unlock() {
    rcu.nesting_level--
    
    si rcu.nesting_level == 0 entonces
        preempt_enable()
    fin si
}

// Sección crítica con preemption disabled
función critical_section_preempt_disabled(callback: función) {
    preempt_disable()
    
    intentar {
        callback()
    } capturar error {
        // Asegurar que preemption se reactive incluso con error
        preempt_enable()
        re_lanzar(error)
    }
    
    preempt_enable()
}

// Per-CPU data con preemption control
estructura PerCPUData {
    cpu_id: entero
    contador: entero
    buffer: arreglo de datos
}

per_cpu_data: arreglo[NUM_CPUS] de PerCPUData

función acceder_percpu_data() -> entero {
    preempt_disable()
    
    cpu = get_current_cpu()
    data = &per_cpu_data[cpu]
    
    // Acceso seguro - no podemos migrar a otro CPU
    data.contador++
    valor = data.contador
    
    preempt_enable()
    
    return valor
}

// Lock-free con preemption control
función incrementar_contador_lockfree() {
    preempt_disable()
    
    cpu = get_current_cpu()
    
    // Incrementar contador per-CPU sin locks
    per_cpu_data[cpu].contador++
    
    preempt_enable()
}

// Spinlock en kernel con IRQ disable
estructura KernelSpinlock {
    locked: booleano atómico
    irq_flags: entero
}

función kernel_spin_lock_irqsave(lock: KernelSpinlock) -> entero {
    // Guardar estado de interrupts y desactivarlos
    flags = save_and_disable_interrupts()
    
    // Desactivar preemption
    preempt_disable()
    
    // Adquirir spinlock
    mientras test_and_set(&lock.locked, verdadero) hacer
        cpu_relax()
    fin mientras
    
    lock.irq_flags = flags
    return flags
}

función kernel_spin_unlock_irqrestore(lock: KernelSpinlock, flags: entero) {
    // Liberar spinlock
    atomic_store(&lock.locked, falso)
    
    // Reactivar preemption
    preempt_enable()
    
    // Restaurar estado de interrupts
    restore_interrupts(flags)
}

// Big Kernel Lock (BKL) - ejemplo histórico
estructura BigKernelLock {
    lock: Spinlock
    owner: Thread o NULL
    depth: entero
}

global bkl: BigKernelLock

función lock_kernel() {
    thread = thread_actual
    
    si bkl.owner == thread entonces
        // Lock recursivo
        bkl.depth++
        return
    fin si
    
    preempt_disable()
    spin_lock(&bkl.lock)
    
    bkl.owner = thread
    bkl.depth = 1
}

función unlock_kernel() {
    thread = thread_actual
    
    si bkl.owner != thread entonces
        panic("Unlock kernel by non-owner!")
    fin si
    
    bkl.depth--
    
    si bkl.depth == 0 entonces
        bkl.owner = NULL
        spin_unlock(&bkl.lock)
        preempt_enable()
    fin si
}

// Secciones críticas cortas sin locks
función atomic_sequence_preempt_disabled() {
    preempt_disable()
    
    // Secuencia de operaciones que deben ser atómicas
    // (no necesariamente thread-safe entre CPUs)
    global_counter++
    global_sum += valor
    
    preempt_enable()
}

// Scheduler: implementación de preempt_disable/enable
función scheduler_interrupts_enabled() -> booleano {
    return (current_cpu_flags & INTERRUPT_FLAG) != 0
}

función disable_scheduler_interrupts() {
    // Deshabilitar timer interrupts
    cli()  // Clear Interrupt Flag (x86)
}

función enable_scheduler_interrupts() {
    // Habilitar timer interrupts
    sti()  // Set Interrupt Flag (x86)
}

función scheduler_should_preempt() -> booleano {
    thread = thread_actual
    
    // Verificar si hay thread de mayor prioridad listo
    si run_queue_has_higher_priority(thread.prioridad) entonces
        return verdadero
    fin si
    
    // Verificar si se agotó el time slice
    si thread.time_slice_expired entonces
        return verdadero
    fin si
    
    return falso
}

función scheduler_preempt() {
    // Guardar contexto del thread actual
    save_context(thread_actual)
    
    // Seleccionar siguiente thread
    next = scheduler_pick_next()
    
    // Cambiar contexto
    context_switch(thread_actual, next)
}

// Ejemplo: Código de kernel con preemption control
función kernel_timer_handler() {
    // Los interrupt handlers ejecutan con preemption disabled
    
    actualizar_jiffies()
    
    // Procesar timers expirados
    para cada timer en timers_expirados hacer
        timer.callback()
    fin para
    
    // Al salir del handler, preemption puede ocurrir
}

// Work queues con preemption control
función queue_work(work: Work) {
    preempt_disable()
    
    cpu = get_current_cpu()
    queue = &per_cpu_work_queues[cpu]
    
    queue.enqueue(work)
    
    preempt_enable()
    
    // Despertar worker thread
    wake_up_worker(cpu)
}

// Métricas de preemption
función medir_preemption_latency() {
    max_disabled_time: entero = 0
    total_disabled_time: entero = 0
    disable_count: entero = 0
    
    función instrumentar_preempt_disable() {
        preempt_state.disable_timestamp = timestamp()
        disable_count++
    }
    
    función instrumentar_preempt_enable() {
        disabled_time = timestamp() - preempt_state.disable_timestamp
        total_disabled_time += disabled_time
        
        si disabled_time > max_disabled_time entonces
            max_disabled_time = disabled_time
        fin si
    }
    
    imprimir("Desactivaciones de preemption: " + disable_count)
    imprimir("Tiempo total disabled: " + total_disabled_time + "μs")
    imprimir("Tiempo máximo disabled: " + max_disabled_time + "μs")
    imprimir("Promedio: " + (total_disabled_time / disable_count) + "μs")
}

// Sistema de tiempo real con preemption control
función rt_task_execute() {
    // Task de tiempo real
    preempt_disable()
    disable_interrupts()
    
    // Código crítico de tiempo real
    // Garantía: no será interrumpido
    ejecutar_control_critico()
    
    enable_interrupts()
    preempt_enable()
}

// Comparación: Con y sin preemption control
función comparar_preemption() {
    // SIN preemption control:
    // - Lock puede ser mantenido mientras el thread es desalojado
    // - Otros threads esperan más tiempo
    // - Causa convoying
    
    función sin_preempt_control() {
        spin_lock(&lock)
        // Si somos desalojados aquí, otros esperan
        trabajo_largo()
        spin_unlock(&lock)
    }
    
    // CON preemption control:
    // - Thread completa sección crítica sin interrupciones
    // - Otros threads esperan menos tiempo
    // - Previene convoying
    
    función con_preempt_control() {
        preempt_disable()
        spin_lock(&lock)
        // No podemos ser desalojados
        trabajo_largo()
        spin_unlock(&lock)
        preempt_enable()
    }
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Lock-Free Algorithms */}
                <TabsContent value="lockfree" className="space-y-4">
                  <div className="bg-gradient-to-br from-cyan-900/30 to-slate-800/30 p-6 rounded-lg border border-cyan-700/50">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-3">
                      🔓 Solución 4: Lock-Free Algorithms
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Los algoritmos lock-free eliminan completamente el uso de locks tradicionales, 
                      utilizando operaciones atómicas (CAS, fetch-and-add) para manipular datos compartidos. 
                      Esto previene el convoying porque no hay locks que puedan ser mantenidos por threads 
                      de baja prioridad, eliminando la posibilidad de inversión de prioridad.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Sin locks tradicionales</li>
                        <li>• Usa operaciones atómicas (CAS)</li>
                        <li>• Garantía de progreso del sistema</li>
                        <li>• Elimina convoying completamente</li>
                        <li>• Alta complejidad de implementación</li>
                        <li>• Problemas: ABA, memory reclamation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Lock-Free Algorithms
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Lock-Free Stack usando CAS
estructura LockFreeNode<T> {
    data: T
    next: puntero a LockFreeNode<T> atómico
}

estructura LockFreeStack<T> {
    top: puntero a LockFreeNode<T> atómico
}

función crear_lockfree_stack<T>() -> LockFreeStack<T> {
    stack: LockFreeStack<T>
    stack.top = NULL
    return stack
}

// Push lock-free
función lf_push<T>(stack: LockFreeStack<T>, valor: T) {
    nuevo_nodo = allocar<LockFreeNode<T>>()
    nuevo_nodo.data = valor
    
    mientras verdadero hacer
        // Leer top actual
        old_top = atomic_load(&stack.top)
        nuevo_nodo.next = old_top
        
        // Intentar CAS: si top no cambió, actualizar
        si compare_and_swap(&stack.top, old_top, nuevo_nodo) entonces
            return  // Push exitoso
        fin si
        
        // CAS falló, otro thread modificó el stack
        // Reintentar con nuevo valor de top
    fin mientras
}

// Pop lock-free
función lf_pop<T>(stack: LockFreeStack<T>) -> T o NULL {
    mientras verdadero hacer
        old_top = atomic_load(&stack.top)
        
        si old_top == NULL entonces
            return NULL  // Stack vacío
        fin si
        
        next = atomic_load(&old_top.next)
        
        // Intentar CAS: si top no cambió, actualizar
        si compare_and_swap(&stack.top, old_top, next) entonces
            // Pop exitoso
            valor = old_top.data
            liberar(old_top)  // CUIDADO: ABA problem
            return valor
        fin si
        
        // CAS falló, reintentar
    fin mientras
}

// Lock-Free Queue (Michael-Scott Queue)
estructura LockFreeQueue<T> {
    head: puntero a LockFreeNode<T> atómico
    tail: puntero a LockFreeNode<T> atómico
}

función crear_lockfree_queue<T>() -> LockFreeQueue<T> {
    queue: LockFreeQueue<T>
    
    // Nodo dummy inicial
    dummy = allocar<LockFreeNode<T>>()
    dummy.next = NULL
    
    queue.head = dummy
    queue.tail = dummy
    
    return queue
}

// Enqueue lock-free
función lf_enqueue<T>(queue: LockFreeQueue<T>, valor: T) {
    nuevo_nodo = allocar<LockFreeNode<T>>()
    nuevo_nodo.data = valor
    nuevo_nodo.next = NULL
    
    mientras verdadero hacer
        tail = atomic_load(&queue.tail)
        next = atomic_load(&tail.next)
        
        // Verificar que tail no cambió
        si tail == atomic_load(&queue.tail) entonces
            si next == NULL entonces
                // Tail apunta al último nodo
                si compare_and_swap(&tail.next, NULL, nuevo_nodo) entonces
                    // Enqueue exitoso, intentar actualizar tail
                    compare_and_swap(&queue.tail, tail, nuevo_nodo)
                    return
                fin si
            sino
                // Tail está retrasado, ayudar a avanzarlo
                compare_and_swap(&queue.tail, tail, next)
            fin si
        fin si
    fin mientras
}

// Dequeue lock-free
función lf_dequeue<T>(queue: LockFreeQueue<T>) -> T o NULL {
    mientras verdadero hacer
        head = atomic_load(&queue.head)
        tail = atomic_load(&queue.tail)
        next = atomic_load(&head.next)
        
        // Verificar consistencia
        si head == atomic_load(&queue.head) entonces
            si head == tail entonces
                si next == NULL entonces
                    return NULL  // Queue vacía
                fin si
                
                // Tail retrasado, ayudar
                compare_and_swap(&queue.tail, tail, next)
            sino
                // Leer valor antes de CAS
                valor = next.data
                
                si compare_and_swap(&queue.head, head, next) entonces
                    // Dequeue exitoso
                    liberar(head)  // Liberar nodo dummy viejo
                    return valor
                fin si
            fin si
        fin si
    fin mientras
}

// Lock-Free Counter
estructura LockFreeCounter {
    value: entero atómico
}

función lf_increment(counter: LockFreeCounter) -> entero {
    mientras verdadero hacer
        old_value = atomic_load(&counter.value)
        new_value = old_value + 1
        
        si compare_and_swap(&counter.value, old_value, new_value) entonces
            return new_value
        fin si
    fin mientras
}

// Alternativa: usar fetch-and-add (más eficiente)
función lf_increment_faa(counter: LockFreeCounter) -> entero {
    return atomic_fetch_add(&counter.value, 1) + 1
}

// Lock-Free Hash Table (simplified)
estructura LockFreeHashBucket<K, V> {
    key: K
    value: V atómico
    next: puntero a LockFreeHashBucket<K, V> atómico
}

estructura LockFreeHashTable<K, V> {
    buckets: arreglo de (puntero a LockFreeHashBucket<K, V> atómico)
    size: entero
}

función lf_hash_insert<K, V>(table: LockFreeHashTable<K, V>, key: K, value: V) -> booleano {
    hash = hash_function(key) % table.size
    bucket_head = &table.buckets[hash]
    
    nuevo_nodo = allocar<LockFreeHashBucket<K, V>>()
    nuevo_nodo.key = key
    nuevo_nodo.value = value
    
    mientras verdadero hacer
        old_head = atomic_load(bucket_head)
        
        // Verificar si key ya existe
        actual = old_head
        mientras actual != NULL hacer
            si actual.key == key entonces
                // Key existe, actualizar valor
                atomic_store(&actual.value, value)
                liberar(nuevo_nodo)
                return falso  // No insertado, solo actualizado
            fin si
            actual = atomic_load(&actual.next)
        fin mientras
        
        // Insertar al inicio de la lista
        nuevo_nodo.next = old_head
        
        si compare_and_swap(bucket_head, old_head, nuevo_nodo) entonces
            return verdadero  // Insertado exitosamente
        fin si
    fin mientras
}

función lf_hash_lookup<K, V>(table: LockFreeHashTable<K, V>, key: K) -> V o NULL {
    hash = hash_function(key) % table.size
    bucket_head = &table.buckets[hash]
    
    actual = atomic_load(bucket_head)
    
    mientras actual != NULL hacer
        si actual.key == key entonces
            return atomic_load(&actual.value)
        fin si
        actual = atomic_load(&actual.next)
    fin mientras
    
    return NULL  // No encontrado
}

// Lock-Free Reference Counting (para memory reclamation)
estructura LockFreeRefCounted<T> {
    data: T
    ref_count: entero atómico
}

función lf_acquire_ref<T>(obj: LockFreeRefCounted<T>) -> booleano {
    mientras verdadero hacer
        old_count = atomic_load(&obj.ref_count)
        
        si old_count == 0 entonces
            return falso  // Objeto siendo destruido
        fin si
        
        si compare_and_swap(&obj.ref_count, old_count, old_count + 1) entonces
            return verdadero
        fin si
    fin mientras
}

función lf_release_ref<T>(obj: LockFreeRefCounted<T>) {
    old_count = atomic_fetch_sub(&obj.ref_count, 1)
    
    si old_count == 1 entonces
        // Última referencia, liberar objeto
        destruir(obj.data)
        liberar(obj)
    fin si
}

// Hazard Pointers (alternativa para memory reclamation)
constante MAX_HAZARD_POINTERS = 100

estructura HazardPointer {
    pointer: puntero atómico
}

global hazard_pointers: arreglo[MAX_HAZARD_POINTERS] de HazardPointer

función acquire_hazard_pointer<T>(ptr: puntero a T) -> entero {
    // Buscar slot libre
    para i = 0 hasta MAX_HAZARD_POINTERS - 1 hacer
        si atomic_load(&hazard_pointers[i].pointer) == NULL entonces
            atomic_store(&hazard_pointers[i].pointer, ptr)
            return i
        fin si
    fin para
    
    return -1  // No hay slots disponibles
}

función release_hazard_pointer(index: entero) {
    atomic_store(&hazard_pointers[index].pointer, NULL)
}

función is_hazardous<T>(ptr: puntero a T) -> booleano {
    para i = 0 hasta MAX_HAZARD_POINTERS - 1 hacer
        si atomic_load(&hazard_pointers[i].pointer) == ptr entonces
            return verdadero
        fin si
    fin para
    
    return falso
}

// Pop con hazard pointers (evita ABA)
función lf_pop_hazard<T>(stack: LockFreeStack<T>) -> T o NULL {
    mientras verdadero hacer
        old_top = atomic_load(&stack.top)
        
        si old_top == NULL entonces
            return NULL
        fin si
        
        // Proteger con hazard pointer
        hp_index = acquire_hazard_pointer(old_top)
        
        si hp_index == -1 entonces
            continue  // No hay hazard pointers, reintentar
        fin si
        
        // Verificar que top no cambió
        si atomic_load(&stack.top) != old_top entonces
            release_hazard_pointer(hp_index)
            continue  // Top cambió, reintentar
        fin si
        
        next = atomic_load(&old_top.next)
        
        si compare_and_swap(&stack.top, old_top, next) entonces
            // Pop exitoso
            valor = old_top.data
            
            release_hazard_pointer(hp_index)
            
            // Agregar a lista de nodos a liberar
            // Solo liberar cuando NO sea hazardous
            si no is_hazardous(old_top) entonces
                liberar(old_top)
            sino
                defer_free(old_top)
            fin si
            
            return valor
        fin si
        
        release_hazard_pointer(hp_index)
    fin mientras
}

// Lock-Free Skip List (estructura avanzada)
estructura LockFreeSkipNode<T> {
    value: T
    next: arreglo dinámico de (puntero a LockFreeSkipNode<T> atómico)
    top_level: entero
}

función lf_skiplist_insert<T>(skiplist: LockFreeSkipList<T>, value: T) -> booleano {
    // Generar nivel aleatorio
    nivel = random_level()
    
    nuevo_nodo = crear_skip_node(value, nivel)
    
    mientras verdadero hacer
        // Encontrar predecesores
        preds = encontrar_predecesores(skiplist, value)
        
        // Intentar insertar en nivel 0
        next = atomic_load(&preds[0].next[0])
        
        si next != NULL y next.value == value entonces
            return falso  // Valor ya existe
        fin si
        
        nuevo_nodo.next[0] = next
        
        si compare_and_swap(&preds[0].next[0], next, nuevo_nodo) entonces
            // Inserción en nivel 0 exitosa
            
            // Insertar en niveles superiores
            para i = 1 hasta nivel hacer
                mientras verdadero hacer
                    next = atomic_load(&preds[i].next[i])
                    nuevo_nodo.next[i] = next
                    
                    si compare_and_swap(&preds[i].next[i], next, nuevo_nodo) entonces
                        break
                    fin si
                    
                    // Actualizar predecesores si CAS falla
                    preds = encontrar_predecesores(skiplist, value)
                fin mientras
            fin para
            
            return verdadero
        fin si
    fin mientras
}

// Wait-Free vs Lock-Free
// Lock-Free: Al menos un thread hace progreso
// Wait-Free: Todos los threads hacen progreso en tiempo acotado

// Ejemplo wait-free: Counter con fetch-and-add
función wf_increment(counter: entero atómico) -> entero {
    // Una sola operación atómica - wait-free
    return atomic_fetch_add(&counter, 1) + 1
}

// Compare con lock-free usando CAS (puede hacer loop infinito)
función lf_increment_cas(counter: entero atómico) -> entero {
    mientras verdadero hacer  // Puede loop infinitamente
        old = atomic_load(&counter)
        new = old + 1
        
        si compare_and_swap(&counter, old, new) entonces
            return new
        fin si
    fin mientras
}

// Double-CAS (DCAS) - no disponible en hardware común
// Simular con version counters para evitar ABA
estructura VersionedPointer<T> {
    pointer: puntero a T
    version: entero
}

función lf_pop_versioned<T>(stack: LockFreeStack<T>) -> T o NULL {
    // Stack.top ahora es VersionedPointer
    mientras verdadero hacer
        old_top = atomic_load(&stack.top)  // {pointer, version}
        
        si old_top.pointer == NULL entonces
            return NULL
        fin si
        
        next_ptr = atomic_load(&old_top.pointer.next)
        new_top = {next_ptr, old_top.version + 1}
        
        // CAS comparando tanto pointer como version
        si compare_and_swap_128(&stack.top, old_top, new_top) entonces
            valor = old_top.pointer.data
            liberar(old_top.pointer)
            return valor
        fin si
    fin mientras
}

// Lock-Free Work Stealing Queue
estructura LockFreeDeque<T> {
    items: arreglo circular de T
    top: entero atómico      // Owner escribe
    bottom: entero atómico   // Owner escribe, thieves leen
}

función lf_deque_push<T>(deque: LockFreeDeque<T>, item: T) {
    // Solo el owner thread puede hacer push
    b = atomic_load_relaxed(&deque.bottom)
    deque.items[b % SIZE] = item
    
    atomic_store_release(&deque.bottom, b + 1)
}

función lf_deque_pop<T>(deque: LockFreeDeque<T>) -> T o NULL {
    // Solo el owner thread puede hacer pop
    b = atomic_load_relaxed(&deque.bottom) - 1
    atomic_store_relaxed(&deque.bottom, b)
    
    t = atomic_load_acquire(&deque.top)
    
    si b < t entonces
        // Deque vacío
        atomic_store_relaxed(&deque.bottom, t)
        return NULL
    fin si
    
    item = deque.items[b % SIZE]
    
    si b > t entonces
        return item
    fin si
    
    // Último item - competir con thieves
    atomic_store_relaxed(&deque.bottom, t + 1)
    
    si compare_and_swap(&deque.top, t, t + 1) entonces
        return item
    fin si
    
    return NULL  // Thief ganó
}

función lf_deque_steal<T>(deque: LockFreeDeque<T>) -> T o NULL {
    // Thieves pueden hacer steal
    mientras verdadero hacer
        t = atomic_load_acquire(&deque.top)
        b = atomic_load_acquire(&deque.bottom)
        
        si t >= b entonces
            return NULL  // Deque vacío
        fin si
        
        item = deque.items[t % SIZE]
        
        si compare_and_swap(&deque.top, t, t + 1) entonces
            return item
        fin si
        
        // CAS falló, otro thief robó, reintentar
    fin mientras
}

// Ejemplo: Sistema completo lock-free
función ejemplo_sistema_lockfree() {
    queue: LockFreeQueue<Work> = crear_lockfree_queue()
    counter: LockFreeCounter
    counter.value = 0
    
    función producer() {
        para i = 1 hasta 10000 hacer
            work: Work
            work.id = i
            
            lf_enqueue(queue, work)
            lf_increment_faa(counter)
        fin para
    }
    
    función consumer() {
        mientras verdadero hacer
            work = lf_dequeue(queue)
            
            si work != NULL entonces
                procesar(work)
            sino
                break
            fin si
        fin mientras
    }
    
    // Múltiples producers y consumers
    para i = 1 hasta 4 hacer
        crear_thread(producer)
    fin para
    
    para i = 1 hasta 4 hacer
        crear_thread(consumer)
    fin para
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                {/* Adaptive Spinning */}
                <TabsContent value="adaptive" className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-900/30 to-slate-800/30 p-6 rounded-lg border border-orange-700/50">
                    <h3 className="text-2xl font-bold text-orange-300 mb-3">
                      🔄 Solución 5: Adaptive Spinning
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Adaptive spinning es una técnica híbrida que decide dinámicamente entre hacer 
                      spinning (busy-wait) o bloquear el thread basándose en heurísticas sobre el estado 
                      del lock. Si el lock está siendo mantenido por un thread en ejecución, hace spinning. 
                      Si el owner está bloqueado, el thread se duerme. Esto previene convoying al evitar 
                      esperas innecesarias cuando el lock estará disponible pronto.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                      <h4 className="font-mono text-sm text-emerald-400 mb-2">Características:</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Decisión dinámica: spin vs block</li>
                        <li>• Monitorea estado del owner thread</li>
                        <li>• Heurísticas basadas en historial</li>
                        <li>• Reduce context switches innecesarios</li>
                        <li>• Balancea latencia y uso de CPU</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Code className="size-5" />
                      Pseudocódigo: Adaptive Spinning
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-sm text-gray-100 font-mono">
{`// Estructura de mutex adaptivo
estructura AdaptiveMutex {
    locked: booleano atómico
    owner: Thread o NULL
    wait_queue: Cola<Thread>
    spin_history: SpinHistory
    mutex: Mutex
}

estructura SpinHistory {
    recent_spins: arreglo circular de booleano  // Últimas N decisiones
    successful_spins: entero  // Spins que adquirieron lock
    failed_spins: entero      // Spins que bloquearon
    index: entero
}

constante HISTORY_SIZE = 16
constante MAX_SPIN_ITERATIONS = 1000

// Crear mutex adaptivo
función crear_adaptive_mutex() -> AdaptiveMutex {
    mutex: AdaptiveMutex
    mutex.locked = falso
    mutex.owner = NULL
    mutex.wait_queue = nueva_cola()
    mutex.spin_history.successful_spins = 0
    mutex.spin_history.failed_spins = 0
    mutex.spin_history.index = 0
    return mutex
}

// Adquirir mutex adaptivo
función adaptive_lock(mutex: AdaptiveMutex, thread: Thread) {
    // Primer intento rápido
    si no atomic_swap(&mutex.locked, verdadero) entonces
        mutex.owner = thread
        return  // Lock adquirido inmediatamente
    fin si
    
    // Lock ocupado - decidir: spin o block?
    si should_spin(mutex, thread) entonces
        // Intentar spinning
        si adaptive_spin(mutex, thread) entonces
            // Spinning exitoso, lock adquirido
            registrar_spin_exitoso(mutex)
            return
        fin si
        
        // Spinning falló, caer a bloqueo
        registrar_spin_fallido(mutex)
    fin si
    
    // Bloquear thread
    adaptive_block(mutex, thread)
}

// Decidir si hacer spinning basado en heurísticas
función should_spin(mutex: AdaptiveMutex, thread: Thread) -> booleano {
    owner = atomic_load(&mutex.owner)
    
    si owner == NULL entonces
        return falso  // No hay owner, no hacer spin
    fin si
    
    // Heurística 1: ¿El owner está ejecutándose?
    si no thread_is_running(owner) entonces
        return falso  // Owner no está en CPU, no hacer spin
    fin si
    
    // Heurística 2: ¿Estamos en el mismo CPU?
    si get_cpu(owner) == get_cpu(thread) entonces
        return falso  // Mismo CPU, spinning no ayuda
    fin si
    
    // Heurística 3: ¿El historial sugiere spinning?
    si mutex.spin_history.successful_spins < mutex.spin_history.failed_spins entonces
        // Más fallos que éxitos recientes
        return falso
    fin si
    
    // Heurística 4: ¿Hay muchos threads esperando?
    si queue_length(mutex.wait_queue) > NUM_CPUS entonces
        return falso  // Demasiada contención
    fin si
    
    return verdadero  // Hacer spinning
}

// Spinning adaptivo
función adaptive_spin(mutex: AdaptiveMutex, thread: Thread) -> booleano {
    iterations = 0
    backoff = 1
    
    mientras iterations < MAX_SPIN_ITERATIONS hacer
        // Verificar si lock está disponible
        si no atomic_load(&mutex.locked) entonces
            // Lock parece libre, intentar adquirir
            si no atomic_swap(&mutex.locked, verdadero) entonces
                mutex.owner = thread
                return verdadero  // Lock adquirido
            fin si
        fin si
        
        // Verificar si el owner sigue ejecutándose
        owner = atomic_load(&mutex.owner)
        
        si owner == NULL o no thread_is_running(owner) entonces
            // Owner ya no está ejecutándose, dejar de hacer spin
            return falso
        fin si
        
        // Backoff exponencial
        para i = 1 hasta backoff hacer
            cpu_relax()  // PAUSE instruction
        fin para
        
        backoff = min(backoff * 2, 64)
        iterations++
    fin mientras
    
    return falso  // Spinning agotado
}

// Bloquear thread
función adaptive_block(mutex: AdaptiveMutex, thread: Thread) {
    mutex.mutex.lock()
    
    // Verificar nuevamente (podría haberse liberado)
    si no mutex.locked entonces
        si no atomic_swap(&mutex.locked, verdadero) entonces
            mutex.owner = thread
            mutex.mutex.unlock()
            return
        fin si
    fin si
    
    // Añadir a cola de espera
    mutex.wait_queue.enqueue(thread)
    
    mutex.mutex.unlock()
    
    // Dormir hasta ser despertado
    thread.dormir()
    
    // Al despertar, lock fue adquirido
    mutex.owner = thread
}

// Liberar mutex adaptivo
función adaptive_unlock(mutex: AdaptiveMutex, thread: Thread) {
    mutex.mutex.lock()
    
    mutex.owner = NULL
    atomic_store(&mutex.locked, falso)
    
    // Despertar siguiente thread
    si no mutex.wait_queue.vacia() entonces
        next = mutex.wait_queue.dequeue()
        next.despertar()
    fin si
    
    mutex.mutex.unlock()
}

// Registrar resultado de spinning
función registrar_spin_exitoso(mutex: AdaptiveMutex) {
    hist = &mutex.spin_history
    
    hist.recent_spins[hist.index] = verdadero
    hist.successful_spins++
    hist.index = (hist.index + 1) % HISTORY_SIZE
    
    // Decaer contador de fallos
    hist.failed_spins = hist.failed_spins * 9 / 10
}

función registrar_spin_fallido(mutex: AdaptiveMutex) {
    hist = &mutex.spin_history
    
    hist.recent_spins[hist.index] = falso
    hist.failed_spins++
    hist.index = (hist.index + 1) % HISTORY_SIZE
    
    // Decaer contador de éxitos
    hist.successful_spins = hist.successful_spins * 9 / 10
}

// Verificar si thread está ejecutándose
función thread_is_running(thread: Thread) -> booleano {
    // Verificar estado del thread
    estado = atomic_load(&thread.estado)
    
    si estado == RUNNING entonces
        return verdadero
    fin si
    
    // En algunos sistemas, verificar si está en CPU
    para cada cpu en cpus hacer
        si cpu.current_thread == thread entonces
            return verdadero
        fin si
    fin para
    
    return falso
}

// Adaptive Spinning con Pause Heuristics
función adaptive_spin_pause(mutex: AdaptiveMutex, thread: Thread) -> booleano {
    iterations = 0
    pause_duration = INITIAL_PAUSE
    
    mientras iterations < MAX_SPIN_ITERATIONS hacer
        // Intentar adquirir
        si no atomic_swap(&mutex.locked, verdadero) entonces
            mutex.owner = thread
            return verdadero
        fin si
        
        // Verificar owner
        owner = atomic_load(&mutex.owner)
        
        si owner != NULL entonces
            // Owner existe, ajustar pause basado en su estado
            si thread_is_running(owner) entonces
                // Owner ejecutándose, pause corto
                pause_duration = min_pause
            sino
                // Owner bloqueado, pause largo o detener
                pause_duration = max_pause
                
                si iterations > MAX_SPIN_ITERATIONS / 2 entonces
                    return falso  // Detener spinning
                fin si
            fin si
        fin si
        
        // Ejecutar pause
        para i = 1 hasta pause_duration hacer
            cpu_relax()
        fin para
        
        iterations++
    fin mientras
    
    return falso
}

// Adaptive Mutex con predicción de duración
estructura PredictiveAdaptiveMutex {
    mutex: AdaptiveMutex
    avg_hold_time: entero  // Tiempo promedio de hold
    last_acquire_time: timestamp atómico
}

función predictive_lock(pmutex: PredictiveAdaptiveMutex, thread: Thread) {
    // Primer intento
    si no atomic_swap(&pmutex.mutex.locked, verdadero) entonces
        pmutex.mutex.owner = thread
        pmutex.last_acquire_time = timestamp()
        return
    fin si
    
    // Estimar cuánto tiempo quedará el lock ocupado
    now = timestamp()
    acquire_time = atomic_load(&pmutex.last_acquire_time)
    elapsed = now - acquire_time
    
    estimated_remaining = pmutex.avg_hold_time - elapsed
    
    si estimated_remaining > 0 y estimated_remaining < SPIN_THRESHOLD entonces
        // Lock debería liberarse pronto, hacer spin
        si adaptive_spin(&pmutex.mutex, thread) entonces
            pmutex.last_acquire_time = timestamp()
            return
        fin si
    fin si
    
    // Bloquear
    adaptive_block(&pmutex.mutex, thread)
    pmutex.last_acquire_time = timestamp()
}

función predictive_unlock(pmutex: PredictiveAdaptiveMutex, thread: Thread) {
    now = timestamp()
    acquire_time = atomic_load(&pmutex.last_acquire_time)
    hold_time = now - acquire_time
    
    // Actualizar tiempo promedio de hold (EWMA)
    pmutex.avg_hold_time = (pmutex.avg_hold_time * 7 + hold_time) / 8
    
    adaptive_unlock(&pmutex.mutex, thread)
}

// Adaptive Spinning con feedback del scheduler
estructura SchedulerAdaptiveMutex {
    mutex: AdaptiveMutex
    scheduler_hints: SchedulerHints
}

estructura SchedulerHints {
    load_average: flotante  // Carga del sistema
    context_switch_cost: entero  // Costo estimado de CS
}

función scheduler_adaptive_lock(samutex: SchedulerAdaptiveMutex, thread: Thread) {
    // Primer intento
    si no atomic_swap(&samutex.mutex.locked, verdadero) entonces
        samutex.mutex.owner = thread
        return
    fin si
    
    hints = &samutex.scheduler_hints
    
    // Decidir basado en carga del sistema
    si hints.load_average < NUM_CPUS * 0.7 entonces
        // Sistema no muy cargado, spinning es razonable
        max_spins = MAX_SPIN_ITERATIONS
    sino si hints.load_average < NUM_CPUS * 1.5 entonces
        // Sistema moderadamente cargado, reducir spinning
        max_spins = MAX_SPIN_ITERATIONS / 2
    sino
        // Sistema sobrecargado, ir directo a bloqueo
        max_spins = 0
    fin si
    
    si max_spins > 0 entonces
        si adaptive_spin_limited(&samutex.mutex, thread, max_spins) entonces
            return
        fin si
    fin si
    
    adaptive_block(&samutex.mutex, thread)
}

función adaptive_spin_limited(mutex: AdaptiveMutex, thread: Thread, max: entero) -> booleano {
    para i = 1 hasta max hacer
        si no atomic_load(&mutex.locked) entonces
            si no atomic_swap(&mutex.locked, verdadero) entonces
                mutex.owner = thread
                return verdadero
            fin si
        fin si
        
        cpu_relax()
    fin mientras
    
    return falso
}

// Two-Phase Adaptive Lock
función two_phase_adaptive_lock(mutex: AdaptiveMutex, thread: Thread) {
    // Fase 1: Spinning agresivo corto
    si aggressive_spin(mutex, thread, 100) entonces
        return  // Lock adquirido en fase 1
    fin si
    
    // Fase 2: Verificar si owner sigue ejecutándose
    owner = atomic_load(&mutex.owner)
    
    si owner != NULL y thread_is_running(owner) entonces
        // Fase 2: Spinning conservador
        si conservative_spin(mutex, thread, 1000) entonces
            return  // Lock adquirido en fase 2
        fin si
    fin si
    
    // Fase 3: Bloquear
    adaptive_block(mutex, thread)
}

función aggressive_spin(mutex: AdaptiveMutex, thread: Thread, iterations: entero) -> booleano {
    // Spinning sin pause, máxima velocidad
    para i = 1 hasta iterations hacer
        si no atomic_swap(&mutex.locked, verdadero) entonces
            mutex.owner = thread
            return verdadero
        fin si
    fin para
    
    return falso
}

función conservative_spin(mutex: AdaptiveMutex, thread: Thread, iterations: entero) -> booleano {
    // Spinning con pause y verificaciones
    backoff = 1
    
    para i = 1 hasta iterations hacer
        si no atomic_swap(&mutex.locked, verdadero) entonces
            mutex.owner = thread
            return verdadero
        fin si
        
        // Verificar owner periódicamente
        si i % 50 == 0 entonces
            owner = atomic_load(&mutex.owner)
            
            si owner == NULL o no thread_is_running(owner) entonces
                return falso  // Detener spinning
            fin si
        fin si
        
        para j = 1 hasta backoff hacer
            cpu_relax()
        fin para
        
        backoff = min(backoff + 1, 16)
    fin para
    
    return falso
}

// Ejemplo: Comparación de estrategias
función benchmark_adaptive_strategies() {
    normal_mutex: Mutex
    adaptive_mutex: AdaptiveMutex
    
    // Test 1: Baja contención
    imprimir("=== Baja Contención ===")
    bench_lock(normal_mutex, 4, 1000)
    bench_lock(adaptive_mutex, 4, 1000)
    
    // Test 2: Alta contención
    imprimir("=== Alta Contención ===")
    bench_lock(normal_mutex, 16, 10000)
    bench_lock(adaptive_mutex, 16, 10000)
}

función bench_lock(lock: cualquier, threads: entero, ops: entero) {
    contador = 0
    inicio = timestamp()
    
    función worker() {
        para i = 1 hasta ops hacer
            adquirir(lock)
            contador++
            liberar(lock)
        fin para
    }
    
    para i = 1 hasta threads hacer
        crear_thread(worker)
    fin para
    
    wait_all_threads()
    
    fin = timestamp()
    tiempo = fin - inicio
    throughput = (threads * ops) / tiempo
    
    imprimir("Tiempo: " + tiempo + "ms")
    imprimir("Throughput: " + throughput + " ops/s")
}

// Métricas de adaptive spinning
función medir_adaptive_performance(mutex: AdaptiveMutex) {
    hist = mutex.spin_history
    
    total_decisiones = hist.successful_spins + hist.failed_spins
    
    si total_decisiones > 0 entonces
        tasa_exito = (hist.successful_spins * 100.0) / total_decisiones
        
        imprimir("Decisiones de spinning:")
        imprimir("  Exitosos: " + hist.successful_spins)
        imprimir("  Fallidos: " + hist.failed_spins)
        imprimir("  Tasa de éxito: " + tasa_exito + "%")
    fin si
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

      {/* SEGUNDO ACCORDION: DEMOSTRACIONES */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="single" defaultValue="demos" collapsible className="space-y-4">
          <AccordionItem value="demos" className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 rounded-t-xl">
              <div className="flex items-center gap-3">
                <TrendingDown className="size-6 text-green-400" />
                <span className="text-2xl font-semibold">Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Tabs defaultValue="demo-spinlock" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 p-1 rounded-lg mb-6">
                  <TabsTrigger value="demo-spinlock" className="data-[state=active]:bg-green-600">
                    Spinlock vs Mutex
                  </TabsTrigger>
                  <TabsTrigger value="demo-priority" className="data-[state=active]:bg-green-600">
                    Priority Inheritance
                  </TabsTrigger>
                  <TabsTrigger value="demo-preemption" className="data-[state=active]:bg-green-600">
                    Preemption Control
                  </TabsTrigger>
                  <TabsTrigger value="demo-lockfree" className="data-[state=active]:bg-green-600">
                    Lock-Free Stack
                  </TabsTrigger>
                  <TabsTrigger value="demo-adaptive" className="data-[state=active]:bg-green-600">
                    Adaptive Spinning
                  </TabsTrigger>
                </TabsList>

                {/* DEMO 1: Spinlock vs Mutex */}
                <TabsContent value="demo-spinlock" className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-900/20 to-slate-800/20 p-6 rounded-lg border border-blue-700/30">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4">🔄 Demo: Spinlock vs Mutex</h3>
                    <p className="text-gray-300 mb-4">
                      Compara spinlocks (busy-wait) con mutexes (bloqueo). Observa el uso de CPU.
                    </p>

                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setSpinlockRunning(!spinlockRunning)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          spinlockRunning
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {spinlockRunning ? (
                          <>
                            <Pause className="inline size-5 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="inline size-5 mr-2" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetSpinlock}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                      >
                        <RotateCcw className="inline size-5 mr-2" />
                        Resetear
                      </button>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[spinlockSpeed]}
                          onValueChange={(val) => setSpinlockSpeed(val[0])}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-400 w-16">{spinlockSpeed}ms</span>
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Threads */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-cyan-400 mb-3">Threads</h4>
                        <div className="space-y-2">
                          {spinlockThreads.map((thread) => (
                            <div
                              key={thread.id}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                thread.state === "running"
                                  ? "bg-green-900/30 border-green-500"
                                  : thread.state === "spinning"
                                  ? "bg-yellow-900/30 border-yellow-500 animate-pulse"
                                  : thread.state === "blocked"
                                  ? "bg-red-900/30 border-red-500"
                                  : thread.state === "finished"
                                  ? "bg-gray-900/30 border-gray-500"
                                  : "bg-slate-800/30 border-slate-600"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-sm">
                                  T{thread.id} ({thread.type})
                                </span>
                                <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                                  P={thread.priority}
                                </span>
                              </div>
                              <div className="text-xs mt-1 text-gray-400">
                                Estado: {thread.state}
                                {thread.state === "spinning" && " 🔄 (Consume CPU)"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CPU Usage */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-orange-400 mb-3">Uso de CPU</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Spinlocks</span>
                              <span className="text-yellow-400">{spinlockCpuUsage.spinlock}%</span>
                            </div>
                            <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                                style={{ width: `${Math.min(spinlockCpuUsage.spinlock, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Mutexes</span>
                              <span className="text-green-400">{spinlockCpuUsage.mutex}%</span>
                            </div>
                            <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                                style={{ width: `${Math.min(spinlockCpuUsage.mutex, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-4 p-2 bg-slate-800/50 rounded">
                            💡 Spinlocks: baja latencia, alto CPU<br />
                            💡 Mutexes: alta latencia, bajo CPU
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Log */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-bold text-purple-400 mb-3">Event Log</h4>
                      <div
                        ref={spinlockLogsRef}
                        className="h-48 overflow-y-auto space-y-1 font-mono text-xs"
                      >
                        {spinlockLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded ${
                              log.type === "success"
                                ? "bg-green-900/20 text-green-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/20 text-yellow-300"
                                : log.type === "error"
                                ? "bg-red-900/20 text-red-300"
                                : "bg-slate-800/20 text-gray-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* DEMO 2: Priority Inheritance */}
                <TabsContent value="demo-priority" className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-900/20 to-slate-800/20 p-6 rounded-lg border border-purple-700/30">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4">⬆️ Demo: Priority Inheritance</h3>
                    <p className="text-gray-300 mb-4">
                      Observa cómo priority inheritance previene inversión de prioridad y convoying.
                    </p>

                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setPriorityRunning(!priorityRunning)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          priorityRunning
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {priorityRunning ? (
                          <>
                            <Pause className="inline size-5 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="inline size-5 mr-2" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetPriority}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                      >
                        <RotateCcw className="inline size-5 mr-2" />
                        Resetear
                      </button>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[prioritySpeed]}
                          onValueChange={(val) => setPrioritySpeed(val[0])}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-400 w-16">{prioritySpeed}ms</span>
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Threads con prioridades */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-cyan-400 mb-3">Threads (Prioridad)</h4>
                        <div className="space-y-3">
                          {priorityThreads.map((thread) => (
                            <div
                              key={thread.id}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                thread.state === "running"
                                  ? "bg-green-900/30 border-green-500"
                                  : thread.state === "blocked"
                                  ? "bg-red-900/30 border-red-500"
                                  : thread.state === "finished"
                                  ? "bg-gray-900/30 border-gray-500"
                                  : "bg-slate-800/30 border-slate-600"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-bold">{thread.name}</span>
                                {thread.hasLock && <span className="text-xs bg-yellow-600 px-2 py-1 rounded">🔒 Lock</span>}
                              </div>
                              <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                  <span>Base:</span>
                                  <span className="text-blue-400">{thread.priority}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Efectiva:</span>
                                  <span
                                    className={`font-bold ${
                                      thread.effectivePriority > thread.priority
                                        ? "text-yellow-400"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {thread.effectivePriority}
                                    {thread.effectivePriority > thread.priority && " ⬆️"}
                                  </span>
                                </div>
                                <div className="text-gray-400">Estado: {thread.state}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Indicadores */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-orange-400 mb-3">Indicadores</h4>
                        <div className="space-y-4">
                          <div
                            className={`p-4 rounded-lg border-2 transition-all ${
                              priorityInversionDetected
                                ? "bg-red-900/30 border-red-500 animate-pulse"
                                : "bg-slate-800/30 border-slate-600"
                            }`}
                          >
                            <div className="text-sm font-bold mb-1">Inversión de Prioridad</div>
                            <div className="text-2xl">
                              {priorityInversionDetected ? "🚨 DETECTADA" : "✅ No"}
                            </div>
                          </div>
                          <div
                            className={`p-4 rounded-lg border-2 transition-all ${
                              priorityBoostActive
                                ? "bg-yellow-900/30 border-yellow-500"
                                : "bg-slate-800/30 border-slate-600"
                            }`}
                          >
                            <div className="text-sm font-bold mb-1">Priority Boost</div>
                            <div className="text-2xl">
                              {priorityBoostActive ? "⬆️ ACTIVO" : "➖ Inactivo"}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-4 p-2 bg-slate-800/50 rounded">
                            💡 Priority inheritance eleva temporalmente la prioridad del thread
                            que mantiene un lock necesitado por un thread de alta prioridad.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Log */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-bold text-purple-400 mb-3">Event Log</h4>
                      <div
                        ref={priorityLogsRef}
                        className="h-48 overflow-y-auto space-y-1 font-mono text-xs"
                      >
                        {priorityLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded ${
                              log.type === "success"
                                ? "bg-green-900/20 text-green-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/20 text-yellow-300"
                                : log.type === "error"
                                ? "bg-red-900/20 text-red-300"
                                : "bg-slate-800/20 text-gray-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* DEMO 3: Preemption Control */}
                <TabsContent value="demo-preemption" className="space-y-6">
                  <div className="bg-gradient-to-br from-green-900/20 to-slate-800/20 p-6 rounded-lg border border-green-700/30">
                    <h3 className="text-2xl font-bold text-green-300 mb-4">🛡️ Demo: Preemption Control</h3>
                    <p className="text-gray-300 mb-4">
                      Desactivar preemption durante secciones críticas previene context switches innecesarios.
                    </p>

                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setPreemptionRunning(!preemptionRunning)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          preemptionRunning
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {preemptionRunning ? (
                          <>
                            <Pause className="inline size-5 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="inline size-5 mr-2" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetPreemption}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                      >
                        <RotateCcw className="inline size-5 mr-2" />
                        Resetear
                      </button>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[preemptionSpeed]}
                          onValueChange={(val) => setPreemptionSpeed(val[0])}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-400 w-16">{preemptionSpeed}ms</span>
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Threads */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-cyan-400 mb-3">Threads</h4>
                        <div className="space-y-3">
                          {preemptionThreads.map((thread) => (
                            <div
                              key={thread.id}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                thread.state === "running"
                                  ? "bg-green-900/30 border-green-500"
                                  : thread.state === "ready"
                                  ? "bg-blue-900/30 border-blue-500"
                                  : "bg-gray-900/30 border-gray-500"
                              }`}
                            >
                              <div className="font-bold mb-2">{thread.name}</div>
                              <div className="text-xs space-y-1">
                                <div>Estado: {thread.state}</div>
                                <div>
                                  Lock: {thread.hasLock ? "🔒 Sí" : "❌ No"}
                                </div>
                                <div>
                                  Preemption: {thread.preemptDisabled ? "🚫 Disabled" : "✅ Enabled"}
                                </div>
                                <div>
                                  Sección Crítica: {thread.criticalSection ? "⚠️ Sí" : "No"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Estado del Sistema */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-orange-400 mb-3">Estado del Sistema</h4>
                        <div className="space-y-4">
                          <div
                            className={`p-4 rounded-lg border-2 transition-all ${
                              !preemptionEnabled
                                ? "bg-red-900/30 border-red-500"
                                : "bg-green-900/30 border-green-500"
                            }`}
                          >
                            <div className="text-sm font-bold mb-1">Preemption Global</div>
                            <div className="text-2xl">
                              {preemptionEnabled ? "✅ Enabled" : "🚫 DISABLED"}
                            </div>
                          </div>
                          <div className="p-4 rounded-lg border-2 bg-slate-800/30 border-slate-600">
                            <div className="text-sm font-bold mb-1">Context Switches</div>
                            <div className="text-3xl text-cyan-400">{contextSwitches}</div>
                          </div>
                          <div className="text-xs text-gray-400 mt-4 p-2 bg-slate-800/50 rounded">
                            💡 Preemption disabled garantiza que el thread complete su
                            sección crítica sin interrupciones, reduciendo el tiempo total
                            que otros threads esperan por el lock.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Log */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-bold text-purple-400 mb-3">Event Log</h4>
                      <div
                        ref={preemptionLogsRef}
                        className="h-48 overflow-y-auto space-y-1 font-mono text-xs"
                      >
                        {preemptionLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded ${
                              log.type === "success"
                                ? "bg-green-900/20 text-green-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/20 text-yellow-300"
                                : log.type === "error"
                                ? "bg-red-900/20 text-red-300"
                                : "bg-slate-800/20 text-gray-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* DEMO 4: Lock-Free Stack */}
                <TabsContent value="demo-lockfree" className="space-y-6">
                  <div className="bg-gradient-to-br from-cyan-900/20 to-slate-800/20 p-6 rounded-lg border border-cyan-700/30">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-4">🔓 Demo: Lock-Free Stack</h3>
                    <p className="text-gray-300 mb-4">
                      Operaciones lock-free usando CAS. Sin locks = sin convoying.
                    </p>

                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setLockfreeRunning(!lockfreeRunning)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          lockfreeRunning
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {lockfreeRunning ? (
                          <>
                            <Pause className="inline size-5 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="inline size-5 mr-2" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetLockfree}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                      >
                        <RotateCcw className="inline size-5 mr-2" />
                        Resetear
                      </button>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[lockfreeSpeed]}
                          onValueChange={(val) => setLockfreeSpeed(val[0])}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-400 w-16">{lockfreeSpeed}ms</span>
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Stack */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-cyan-400 mb-3">Lock-Free Stack</h4>
                        <div className="space-y-2 mb-4">
                          {lockfreeStack.length === 0 ? (
                            <div className="text-gray-500 text-center py-8 border-2 border-dashed border-slate-600 rounded">
                              Stack vacío
                            </div>
                          ) : (
                            <>
                              {[...lockfreeStack].reverse().map((value, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-blue-900/30 border-2 border-blue-500 rounded-lg text-center font-bold text-xl animate-pulse"
                                >
                                  {value}
                                  {idx === 0 && <span className="text-xs ml-2">← TOP</span>}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 bg-slate-800/50 p-2 rounded">
                          Total CAS operations: <span className="text-cyan-400 font-bold">{lockfreeCasCount}</span>
                        </div>
                      </div>

                      {/* Threads */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-orange-400 mb-3">Threads</h4>
                        <div className="space-y-3">
                          {lockfreeThreads.map((thread) => (
                            <div
                              key={thread.id}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                thread.state === "executing"
                                  ? "bg-yellow-900/30 border-yellow-500 animate-pulse"
                                  : thread.state === "finished"
                                  ? "bg-green-900/30 border-green-500"
                                  : "bg-slate-800/30 border-slate-600"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-bold">Thread {thread.id}</span>
                                <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                                  {thread.operation.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-xs space-y-1">
                                <div>
                                  Valor: {thread.operation === "push" ? thread.value : thread.value ?? "—"}
                                </div>
                                <div>CAS attempts: {thread.casAttempts}</div>
                                <div className="text-gray-400">Estado: {thread.state}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-4 p-2 bg-slate-800/50 rounded">
                          💡 Los threads pueden fallar CAS y reintentar, pero NUNCA se
                          bloquean esperando un lock.
                        </div>
                      </div>
                    </div>

                    {/* Event Log */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-bold text-purple-400 mb-3">Event Log</h4>
                      <div
                        ref={lockfreeLogsRef}
                        className="h-48 overflow-y-auto space-y-1 font-mono text-xs"
                      >
                        {lockfreeLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded ${
                              log.type === "success"
                                ? "bg-green-900/20 text-green-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/20 text-yellow-300"
                                : log.type === "error"
                                ? "bg-red-900/20 text-red-300"
                                : "bg-slate-800/20 text-gray-300"
                            }`}
                          >
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* DEMO 5: Adaptive Spinning */}
                <TabsContent value="demo-adaptive" className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-900/20 to-slate-800/20 p-6 rounded-lg border border-orange-700/30">
                    <h3 className="text-2xl font-bold text-orange-300 mb-4">🔄 Demo: Adaptive Spinning</h3>
                    <p className="text-gray-300 mb-4">
                      Decisión inteligente: spin si owner ejecutándose, block si no.
                    </p>

                    {/* Controles */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setAdaptiveRunning(!adaptiveRunning)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          adaptiveRunning
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {adaptiveRunning ? (
                          <>
                            <Pause className="inline size-5 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="inline size-5 mr-2" />
                            Iniciar
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetAdaptive}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                      >
                        <RotateCcw className="inline size-5 mr-2" />
                        Resetear
                      </button>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm text-gray-300">Velocidad:</span>
                        <Slider
                          value={[adaptiveSpeed]}
                          onValueChange={(val) => setAdaptiveSpeed(val[0])}
                          min={100}
                          max={2000}
                          step={100}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-400 w-16">{adaptiveSpeed}ms</span>
                      </div>
                    </div>

                    {/* Visualización */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Threads */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-cyan-400 mb-3">Threads</h4>
                        <div className="space-y-3">
                          {adaptiveThreads.map((thread) => (
                            <div
                              key={thread.id}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                thread.state === "running"
                                  ? "bg-green-900/30 border-green-500"
                                  : thread.spinning
                                  ? "bg-yellow-900/30 border-yellow-500 animate-pulse"
                                  : thread.blocked
                                  ? "bg-red-900/30 border-red-500"
                                  : thread.state === "finished"
                                  ? "bg-gray-900/30 border-gray-500"
                                  : "bg-slate-800/30 border-slate-600"
                              }`}
                            >
                              <div className="font-bold mb-2">Thread {thread.id}</div>
                              <div className="text-xs space-y-1">
                                <div>Estado: {thread.state}</div>
                                <div>Spinning: {thread.spinning ? "🔄 Sí" : "No"}</div>
                                <div>Blocked: {thread.blocked ? "🚫 Sí" : "No"}</div>
                                <div>Spin count: {thread.spinCount}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Owner State & History */}
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                        <h4 className="font-bold text-orange-400 mb-3">Estado del Owner & Historial</h4>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg border-2 bg-slate-800/30 border-slate-600">
                            <div className="text-sm font-bold mb-1">Lock Owner</div>
                            <div className="text-2xl">
                              {adaptiveOwner ? `Thread ${adaptiveOwner}` : "Ninguno"}
                            </div>
                          </div>
                          <div
                            className={`p-4 rounded-lg border-2 transition-all ${
                              adaptiveOwnerRunning
                                ? "bg-green-900/30 border-green-500"
                                : "bg-red-900/30 border-red-500"
                            }`}
                          >
                            <div className="text-sm font-bold mb-1">Owner Estado</div>
                            <div className="text-xl">
                              {adaptiveOwnerRunning ? "▶️ RUNNING" : "⏸️ Bloqueado"}
                            </div>
                          </div>
                          <div className="p-4 rounded-lg border-2 bg-slate-800/30 border-slate-600">
                            <div className="text-sm font-bold mb-2">Historial de Spinning</div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Exitosos:</span>
                                <span className="text-green-400 font-bold">
                                  {adaptiveHistory.successful}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Fallidos:</span>
                                <span className="text-red-400 font-bold">
                                  {adaptiveHistory.failed}
                                </span>
                              </div>
                              <div className="flex justify-between border-t border-slate-600 pt-1 mt-1">
                                <span>Efectividad:</span>
                                <span className="text-cyan-400 font-bold">
                                  {adaptiveHistory.successful + adaptiveHistory.failed > 0
                                    ? Math.round(
                                        (adaptiveHistory.successful /
                                          (adaptiveHistory.successful + adaptiveHistory.failed)) *
                                          100
                                      )
                                    : 0}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 p-2 bg-slate-800/50 rounded">
                            💡 Adaptive spinning decide dinámicamente entre spinning y
                            bloqueo basándose en si el owner está ejecutándose.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Log */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                      <h4 className="font-bold text-purple-400 mb-3">Event Log</h4>
                      <div
                        ref={adaptiveLogsRef}
                        className="h-48 overflow-y-auto space-y-1 font-mono text-xs"
                      >
                        {adaptiveLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded ${
                              log.type === "success"
                                ? "bg-green-900/20 text-green-300"
                                : log.type === "warning"
                                ? "bg-yellow-900/20 text-yellow-300"
                                : log.type === "error"
                                ? "bg-red-900/20 text-red-300"
                                : "bg-slate-800/20 text-gray-300"
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