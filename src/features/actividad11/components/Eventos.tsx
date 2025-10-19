import { BookOpen, Code, Zap, Play, Pause, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";

interface Event { id: number; type: string; status: 'pending' | 'processing' | 'completed' | 'failed'; data?: number | string; }
interface Worker { id: number; status: 'idle' | 'working'; currentEvent?: number; }

export default function Eventos() {
  const [qEvents, setQEvents] = useState<Event[]>([]);
  const [qRunning, setQRunning] = useState(false);
  const [qSpeed, setQSpeed] = useState(500);
  const [qProcessed, setQProcessed] = useState(0);
  const [qLogs, setQLogs] = useState<string[]>(['Event Queue iniciado']);
  const qLogRef = useRef<HTMLDivElement>(null);
  const [oSeq, setOSeq] = useState(0);
  const [oViolations, setOViolations] = useState(0);
  const [oRunning, setORunning] = useState(false);
  const [oSpeed, setOSpeed] = useState(500);
  const [oLogs, setOLogs] = useState<string[]>(['Event Ordering iniciado']);
  const oLogRef = useRef<HTMLDivElement>(null);
  const [hActive, setHActive] = useState(0);
  const [hCompleted, setHCompleted] = useState(0);
  const [hRunning, setHRunning] = useState(false);
  const [hSpeed, setHSpeed] = useState(500);
  const [hLogs, setHLogs] = useState<string[]>(['Non-blocking Handlers iniciado']);
  const hLogRef = useRef<HTMLDivElement>(null);
  const [wWorkers, setWWorkers] = useState<Worker[]>([{ id: 1, status: 'idle' }, { id: 2, status: 'idle' }, { id: 3, status: 'idle' }, { id: 4, status: 'idle' }]);
  const [wQueue, setWQueue] = useState<Event[]>([]);
  const [wCompleted, setWCompleted] = useState(0);
  const [wRunning, setWRunning] = useState(false);
  const [wSpeed, setWSpeed] = useState(500);
  const [wLogs, setWLogs] = useState<string[]>(['Worker Threads iniciado']);
  const wLogRef = useRef<HTMLDivElement>(null);
  const [sBalance, setSBalance] = useState(1000);
  const [sItems, setSItems] = useState(0);
  const [sEvents, setSEvents] = useState<Event[]>([]);
  const [sRunning, setSRunning] = useState(false);
  const [sSpeed, setSSpeed] = useState(500);
  const [sLogs, setSLogs] = useState<string[]>(['Event Sourcing: Balance=$1000']);
  const sLogRef = useRef<HTMLDivElement>(null);
  const [rFiltered, setRFiltered] = useState(0);
  const [rMapped, setRMapped] = useState(0);
  const [rRunning, setRRunning] = useState(false);
  const [rSpeed, setRSpeed] = useState(500);
  const [rLogs, setRLogs] = useState<string[]>(['Reactive Programming iniciado']);
  const rLogRef = useRef<HTMLDivElement>(null);
  const [smState, setSmState] = useState('IDLE');
  const [smRunning, setSmRunning] = useState(false);
  const [smSpeed, setSmSpeed] = useState(500);
  const [smLogs, setSmLogs] = useState<string[]>(['State Machine: IDLE']);
  const smLogRef = useRef<HTMLDivElement>(null);
  const [bpProduced, setBpProduced] = useState(0);
  const [bpConsumed, setBpConsumed] = useState(0);
  const [bpBuffer, setBpBuffer] = useState<number[]>([]);
  const [bpDropped, setBpDropped] = useState(0);
  const [bpRunning, setBpRunning] = useState(false);
  const [bpSpeed, setBpSpeed] = useState(500);
  const [bpLogs, setBpLogs] = useState<string[]>(['Backpressure: Buffer capacity 10']);
  const bpLogRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (qLogRef.current) qLogRef.current.scrollTop = qLogRef.current.scrollHeight; }, [qLogs]);
  useEffect(() => { if (oLogRef.current) oLogRef.current.scrollTop = oLogRef.current.scrollHeight; }, [oLogs]);
  useEffect(() => { if (hLogRef.current) hLogRef.current.scrollTop = hLogRef.current.scrollHeight; }, [hLogs]);
  useEffect(() => { if (wLogRef.current) wLogRef.current.scrollTop = wLogRef.current.scrollHeight; }, [wLogs]);
  useEffect(() => { if (sLogRef.current) sLogRef.current.scrollTop = sLogRef.current.scrollHeight; }, [sLogs]);
  useEffect(() => { if (rLogRef.current) rLogRef.current.scrollTop = rLogRef.current.scrollHeight; }, [rLogs]);
  useEffect(() => { if (smLogRef.current) smLogRef.current.scrollTop = smLogRef.current.scrollHeight; }, [smLogs]);
  useEffect(() => { if (bpLogRef.current) bpLogRef.current.scrollTop = bpLogRef.current.scrollHeight; }, [bpLogs]);
  useEffect(() => {
    if (!qRunning) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.6 && qEvents.length < 12) {
        const e: Event = { id: Date.now(), type: ['click', 'input', 'submit'][Math.floor(Math.random() * 3)], status: 'pending' };
        setQEvents(prev => [...prev, e]);
        setQLogs(prev => [...prev.slice(-9), `📥 ${e.type} encolado`]);
      }
      setQEvents(prev => {
        if (prev.length === 0) return prev;
        const [first, ...rest] = prev;
        setQProcessed(p => p + 1);
        setQLogs(prevL => [...prevL.slice(-9), `✅ ${first.type} procesado (FIFO)`]);
        return rest;
      });
    }, qSpeed);
    return () => clearInterval(interval);
  }, [qRunning, qSpeed, qEvents.length]);
  useEffect(() => {
    if (!oRunning) return;
    const interval = setInterval(() => {
      const expected = oSeq;
      const actual = Math.random() < 0.9 ? expected : expected + Math.floor(Math.random() * 3) + 1;
      if (actual === expected) { setOSeq(prev => prev + 1); setOLogs(prev => [...prev.slice(-9), `✅ Evento #${actual} en orden`]); }
      else { setOViolations(prev => prev + 1); setOLogs(prev => [...prev.slice(-9), `❌ Violación: esperado #${expected}, recibido #${actual}`]); }
    }, oSpeed);
    return () => clearInterval(interval);
  }, [oRunning, oSpeed, oSeq]);
  useEffect(() => {
    if (!hRunning) return;
    const interval = setInterval(() => {
      const type = ['http', 'db', 'file'][Math.floor(Math.random() * 3)];
      setHActive(prev => prev + 1);
      setHLogs(prev => [...prev.slice(-9), `🚀 Handler ${type} ejecutando`]);
      setTimeout(() => {
        setHActive(prev => prev - 1);
        setHCompleted(prev => prev + 1);
        setHLogs(prevL => [...prevL.slice(-9), `✅ Handler ${type} completado`]);
      }, Math.random() * hSpeed * 2);
    }, hSpeed / 2);
    return () => clearInterval(interval);
  }, [hRunning, hSpeed]);
  useEffect(() => {
    if (!wRunning) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.5 && wQueue.length < 10) {
        const e: Event = { id: Date.now(), type: ['compute', 'io'][Math.floor(Math.random() * 2)], status: 'pending' };
        setWQueue(prev => [...prev, e]);
        setWLogs(prev => [...prev.slice(-9), `📋 Tarea ${e.type} encolada`]);
      }
      const idleIdx = wWorkers.findIndex(w => w.status === 'idle');
      if (idleIdx !== -1 && wQueue.length > 0) {
        setWQueue(prev => {
          const [, ...rest] = prev;
          setWWorkers(prevW => prevW.map((w, i) => i === idleIdx ? { ...w, status: 'working' as const } : w));
          setWLogs(prevL => [...prevL.slice(-9), `⚙️ Worker ${idleIdx + 1} procesando`]);
          setTimeout(() => {
            setWWorkers(prevW => prevW.map((w, i) => i === idleIdx ? { ...w, status: 'idle' as const } : w));
            setWCompleted(prev => prev + 1);
            setWLogs(prevL => [...prevL.slice(-9), `✅ Worker ${idleIdx + 1} completó`]);
          }, wSpeed);
          return rest;
        });
      }
    }, wSpeed / 2);
    return () => clearInterval(interval);
  }, [wRunning, wSpeed, wWorkers, wQueue.length]);
  useEffect(() => {
    if (!sRunning) return;
    const interval = setInterval(() => {
      const types = ['deposit', 'withdraw', 'buy'];
      const type = types[Math.floor(Math.random() * types.length)];
      if (type === 'deposit') {
        const amt = Math.floor(Math.random() * 200) + 50;
        setSBalance(prev => prev + amt);
        setSEvents(prev => [...prev.slice(-5), { id: Date.now(), type: 'DEPOSIT', status: 'completed', data: amt }]);
        setSLogs(prev => [...prev.slice(-9), `💰 DEPOSIT $${amt}`]);
      } else if (type === 'withdraw' && sBalance >= 100) {
        const amt = Math.floor(Math.random() * 100) + 50;
        setSBalance(prev => prev - amt);
        setSEvents(prev => [...prev.slice(-5), { id: Date.now(), type: 'WITHDRAW', status: 'completed', data: amt }]);
        setSLogs(prev => [...prev.slice(-9), `💸 WITHDRAW $${amt}`]);
      } else if (type === 'buy' && sBalance >= 50) {
        const cost = Math.floor(Math.random() * 50) + 20;
        setSBalance(prev => prev - cost);
        setSItems(prev => prev + 1);
        setSEvents(prev => [...prev.slice(-5), { id: Date.now(), type: 'BUY', status: 'completed', data: cost }]);
        setSLogs(prev => [...prev.slice(-9), `🛒 BUY $${cost}`]);
      }
    }, sSpeed);
    return () => clearInterval(interval);
  }, [sRunning, sSpeed, sBalance]);
  useEffect(() => {
    if (!rRunning) return;
    const interval = setInterval(() => {
      const val = Math.floor(Math.random() * 100);
      if (val > 50) { setRFiltered(prev => prev + 1); setRMapped(prev => prev + 1); setRLogs(prev => [...prev.slice(-9), `🔹 ${val} → Filter ✅ → Map (*2) = ${val * 2}`]); }
      else { setRLogs(prev => [...prev.slice(-9), `🔸 ${val} → Filter ❌`]); }
    }, rSpeed);
    return () => clearInterval(interval);
  }, [rRunning, rSpeed]);
  useEffect(() => {
    if (!smRunning) return;
    const interval = setInterval(() => {
      const transitions: Record<string, { event: string; next: string }[]> = {
        'IDLE': [{ event: 'start', next: 'RUNNING' }],
        'RUNNING': [{ event: 'pause', next: 'PAUSED' }, { event: 'complete', next: 'COMPLETED' }],
        'PAUSED': [{ event: 'resume', next: 'RUNNING' }],
        'COMPLETED': [{ event: 'reset', next: 'IDLE' }],
      };
      const possible = transitions[smState] || [];
      if (possible.length > 0) {
        const t = possible[Math.floor(Math.random() * possible.length)];
        setSmState(t.next);
        setSmLogs(prev => [...prev.slice(-9), `🔄 ${smState} --[${t.event}]--> ${t.next}`]);
      }
    }, smSpeed);
    return () => clearInterval(interval);
  }, [smRunning, smSpeed, smState]);
  useEffect(() => {
    if (!bpRunning) return;
    const pInterval = setInterval(() => {
      const data = Math.floor(Math.random() * 100);
      setBpProduced(prev => prev + 1);
      setBpBuffer(prev => {
        if (prev.length < 10) { setBpLogs(prevL => [...prevL.slice(-9), `📤 Producer: ${data} → Buffer (${prev.length + 1}/10)`]); return [...prev, data]; }
        else { setBpDropped(prevD => prevD + 1); setBpLogs(prevL => [...prevL.slice(-9), `❌ Buffer lleno! Dato ${data} descartado`]); return prev; }
      });
    }, bpSpeed / 3);
    const cInterval = setInterval(() => {
      setBpBuffer(prev => {
        if (prev.length > 0) {
          const [consumed, ...rest] = prev;
          setBpConsumed(prevC => prevC + 1);
          setBpLogs(prevL => [...prevL.slice(-9), `📥 Consumer: ${consumed} procesado → Buffer (${rest.length}/10)`]);
          return rest;
        }
        return prev;
      });
    }, bpSpeed);
    return () => { clearInterval(pInterval); clearInterval(cInterval); };
  }, [bpRunning, bpSpeed, bpBuffer.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Zap className="size-12 text-yellow-500" />
            <h1 className="text-4xl font-bold">⚡ Programación Basada en Eventos</h1>
          </div>
          <p className="text-lg text-gray-300">
            Paradigma donde el flujo del programa está determinado por eventos. Fundamental para aplicaciones asíncronas,
            UI, servidores de alta concurrencia y arquitecturas reactivas.
          </p>
          <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-200">
              <span className="font-bold">Ventajas:</span> Desacoplamiento, escalabilidad, responsividad.
              <span className="font-bold ml-4">Desafíos:</span> Event ordering, backpressure, debugging.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Accordion type="multiple" defaultValue={["pseudocodigos"]} className="space-y-4">
          {/* Sección de Pseudocódigos */}
          <AccordionItem value="pseudocodigos" className="bg-gray-800 rounded-lg border border-gray-700">
            <AccordionTrigger className="text-xl font-bold px-6">
              <div className="flex items-center gap-2">
                <Code className="size-5" />
                <span>Pseudocódigos de las Soluciones</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="ps-queue" className="px-6 pb-6">
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-4 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="ps-queue">📥 Queue</TabsTrigger>
                    <TabsTrigger value="ps-order">🔢 Ordering</TabsTrigger>
                    <TabsTrigger value="ps-handler">⚡ Handlers</TabsTrigger>
                    <TabsTrigger value="ps-worker">👷 Workers</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-4 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="ps-sourcing">📜 Sourcing</TabsTrigger>
                    <TabsTrigger value="ps-reactive">🔄 Reactive</TabsTrigger>
                    <TabsTrigger value="ps-sm">🤖 State</TabsTrigger>
                    <TabsTrigger value="ps-bp">🌊 Backpressure</TabsTrigger>
                  </TabsList>
                </div>

                {/* Pseudocódigo 1: Event Queue Management */}
                <TabsContent value="ps-queue" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-blue-700/50">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">📥 Event Queue Management</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">1. Cola FIFO Básica</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura EventQueue {
  cola: Queue<Event>
  mutex: Lock
  condVar: ConditionVariable
}

función enqueue(evento: Event) {
  mutex.lock()
  cola.push(evento)
  condVar.signal()  // Notificar que hay eventos
  mutex.unlock()
}

función dequeue() -> Event {
  mutex.lock()
  mientras cola.isEmpty():
    condVar.wait(mutex)  // Esperar eventos
  evento = cola.pop()
  mutex.unlock()
  retornar evento
}

función processEvents() {
  mientras true:
    evento = dequeue()
    handleEvent(evento)
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">2. Cola con Prioridades</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura PriorityEventQueue {
  colas: Array<Queue<Event>>  // Una cola por prioridad
  mutex: Lock
  maxPriority: entero = 5
}

función enqueue(evento: Event, prioridad: entero) {
  mutex.lock()
  si prioridad < 1 o prioridad > maxPriority:
    prioridad = maxPriority
  colas[prioridad].push(evento)
  mutex.unlock()
}

función dequeue() -> Event {
  mutex.lock()
  // Buscar desde mayor prioridad (1) a menor (5)
  para prioridad en 1 hasta maxPriority:
    si no colas[prioridad].isEmpty():
      evento = colas[prioridad].pop()
      mutex.unlock()
      retornar evento
  mutex.unlock()
  retornar null
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">3. Event Loop Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura EventLoop {
  running: booleano
  queue: EventQueue
  handlers: Map<TipoEvento, Handler>
}

función start() {
  running = true
  mientras running:
    evento = queue.dequeue()
    
    si evento != null:
      handler = handlers.get(evento.type)
      si handler != null:
        intentar:
          handler.execute(evento)
        capturar error:
          logError(error)
          evento.status = 'failed'
}

función registerHandler(tipo: TipoEvento, handler: Handler) {
  handlers.set(tipo, handler)
}

función stop() {
  running = false
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                          <span className="font-bold">Casos de Uso:</span> UI event handling, message brokers (RabbitMQ, Kafka),
                          task queues (Celery, Bull), command pattern, pub/sub systems.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 2: Event Ordering */}
                <TabsContent value="ps-order" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-green-700/50">
                    <h3 className="text-xl font-bold text-green-400 mb-4">🔢 Event Ordering Guarantees</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">1. Números de Secuencia</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura SequencedEvent {
  evento: Event
  secuencia: entero
  fuente: ID
}

estructura Sequencer {
  siguienteSecuencia: AtomicInteger = 0
  buffer: Map<entero, SequencedEvent>  // Out-of-order buffer
  esperado: entero = 0
}

función assignSequence(evento: Event) -> SequencedEvent {
  seq = siguienteSecuencia.incrementAndGet()
  retornar SequencedEvent(evento, seq, nodeId)
}

función processInOrder(seqEvento: SequencedEvent) {
  buffer[seqEvento.secuencia] = seqEvento
  
  mientras buffer.contains(esperado):
    evento = buffer.remove(esperado)
    handleEvent(evento.evento)
    esperado++
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">2. Vector Clocks (Causal Ordering)</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura VectorClock {
  vector: Array<entero>  // Un contador por nodo
  nodeId: entero
}

función increment() {
  vector[nodeId]++
}

función update(other: VectorClock) {
  para i en 0 hasta vector.length:
    vector[i] = max(vector[i], other.vector[i])
  vector[nodeId]++
}

función happensBefore(vc1: VectorClock, vc2: VectorClock) -> booleano {
  menorIgual = true
  estrictamenteMenor = false
  
  para i en 0 hasta vc1.vector.length:
    si vc1.vector[i] > vc2.vector[i]:
      menorIgual = false
      break
    si vc1.vector[i] < vc2.vector[i]:
      estrictamenteMenor = true
  
  retornar menorIgual Y estrictamenteMenor
}

función sendEvent(evento: Event) {
  increment()
  evento.vectorClock = copiar(vector)
  enviar(evento)
}

función receiveEvent(evento: Event) {
  update(evento.vectorClock)
  procesarSiEsSeguro(evento)
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-300 mb-3">3. Lamport Timestamps</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura LamportClock {
  timestamp: AtomicInteger = 0
  nodeId: entero
}

función tick() -> entero {
  retornar timestamp.incrementAndGet()
}

función update(recibido: entero) {
  mientras true:
    actual = timestamp.get()
    nuevo = max(actual, recibido) + 1
    si timestamp.compareAndSet(actual, nuevo):
      break
  retornar nuevo
}

función compare(t1: (timestamp, nodeId), t2: (timestamp, nodeId)) -> entero {
  si t1.timestamp < t2.timestamp:
    retornar -1
  sino si t1.timestamp > t2.timestamp:
    retornar 1
  sino:  // Desempate por nodeId
    retornar t1.nodeId - t2.nodeId
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                        <p className="text-sm text-green-200">
                          <span className="font-bold">Casos de Uso:</span> Event sourcing, distributed databases (Cassandra),
                          replication systems, causal consistency, blockchain, distributed tracing.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigo 3: Non-blocking Handlers */}
                <TabsContent value="ps-handler" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-purple-700/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">⚡ Non-blocking Event Handlers</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">1. Async/Await Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`// Patrón moderno con async/await
función async handleEventAsync(evento: Event) {
  intentar:
    evento.status = 'processing'
    
    // Operaciones no bloqueantes
    resultado = await operacionIO(evento.data)
    datos = await procesarDatos(resultado)
    await guardarResultado(datos)
    
    evento.status = 'completed'
  capturar error:
    evento.status = 'failed'
    logError(error)
    throw error
}

función async processEventsWithConcurrency(eventos: Array<Event>) {
  // Procesar múltiples eventos concurrentemente
  promesas = eventos.map(e => handleEventAsync(e))
  
  // Esperar todos con manejo de errores
  resultados = await Promise.allSettled(promesas)
  
  para resultado en resultados:
    si resultado.status == 'rejected':
      logError(resultado.reason)
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">2. Callback Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`función handleEventWithCallback(evento: Event, callback: Function) {
  // Iniciar operación asíncrona
  operacionAsync(evento.data, función(error, resultado) {
    si error:
      evento.status = 'failed'
      callback(error, null)
    sino:
      evento.status = 'completed'
      callback(null, resultado)
  })
  
  // Retornar inmediatamente sin bloquear
  retornar  // Handler no bloqueante
}

función processWithCallbacks(eventos: Array<Event>) {
  contador = AtomicInteger(eventos.length)
  resultados = []
  
  para evento en eventos:
    handleEventWithCallback(evento, función(error, resultado) {
      si error:
        logError(error)
      sino:
        resultados.push(resultado)
      
      si contador.decrementAndGet() == 0:
        onTodosCompletados(resultados)
    })
}`}
                        </pre>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-3">3. Promise Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`función handleEventWithPromise(evento: Event) -> Promise<Result> {
  retornar new Promise(función(resolve, reject) {
    intentar:
      evento.status = 'processing'
      
      // Operación asíncrona
      operacionAsync(evento.data)
        .then(función(resultado) {
          evento.status = 'completed'
          resolve(resultado)
        })
        .catch(función(error) {
          evento.status = 'failed'
          reject(error)
        })
    capturar error:
      reject(error)
  })
}

función processWithPromiseChain(eventos: Array<Event>) {
  // Procesar secuencialmente con promises
  promesa = Promise.resolve()
  
  para evento en eventos:
    promesa = promesa.then(función() {
      retornar handleEventWithPromise(evento)
    })
  
  retornar promesa
}`}
                        </pre>
                      </div>

                      <div className="p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                        <p className="text-sm text-purple-200">
                          <span className="font-bold">Casos de Uso:</span> Node.js event loop, web APIs (fetch), 
                          database queries, file I/O, network requests, microservices communication.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pseudocódigos 4-8 continuarán... */}
                <TabsContent value="ps-worker" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-yellow-700/50">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">👷 Worker Threads para Eventos</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-yellow-300 mb-3">Thread Pool Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura WorkerPool {
  workers: Array<Worker>
  taskQueue: BlockingQueue<Event>
  running: booleano
}

función iniciar(numWorkers: entero) {
  running = true
  para i en 1 hasta numWorkers:
    worker = new Worker(i, taskQueue)
    workers.push(worker)
    worker.start()
}

función submitEvent(evento: Event) {
  taskQueue.put(evento)
}

clase Worker extends Thread {
  id: entero
  queue: BlockingQueue<Event>
  
  función run() {
    mientras running:
      evento = queue.take()  // Bloquea hasta que haya trabajo
      procesarEvento(evento)
}`}
                        </pre>
                      </div>
                      <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                        <p className="text-sm text-yellow-200">
                          <span className="font-bold">Uso:</span> Processing pools, parallel event handling
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ps-sourcing" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-cyan-700/50">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">📜 Event Sourcing</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-cyan-300 mb-3">Event Store Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura EventStore {
  events: List<Event>
  snapshots: Map<ID, Snapshot>
}

función appendEvent(evento: Event) {
  evento.timestamp = now()
  evento.version = events.size() + 1
  events.append(evento)
  
  si evento.version % 100 == 0:
    crearSnapshot(evento.aggregateId)
}

función rebuild(aggregateId: ID) -> Estado {
  snapshot = snapshots.get(aggregateId)
  estado = snapshot != null ? snapshot.estado : estadoInicial()
  
  desde = snapshot != null ? snapshot.version : 0
  para evento en events desde desde:
    estado = aplicarEvento(estado, evento)
  
  retornar estado
}`}
                        </pre>
                      </div>
                      <div className="p-4 bg-cyan-900/30 border border-cyan-700/50 rounded-lg">
                        <p className="text-sm text-cyan-200">
                          <span className="font-bold">Uso:</span> CQRS, audit logs, time travel debugging
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ps-reactive" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-pink-700/50">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">🔄 Reactive Programming</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-pink-300 mb-3">Observable Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`clase Observable<T> {
  observers: List<Observer<T>>
  
  función subscribe(observer: Observer<T>) {
    observers.add(observer)
    retornar función unsubscribe() {
      observers.remove(observer)
    }
  }
  
  función emit(valor: T) {
    para observer en observers:
      observer.onNext(valor)
  }
  
  función map<R>(transform: Function<T, R>) -> Observable<R> {
    retornar new Observable(función(observer) {
      this.subscribe(función(valor) {
        observer.onNext(transform(valor))
      })
    })
  }
  
  función filter(predicate: Function<T, boolean>) -> Observable<T> {
    retornar new Observable(función(observer) {
      this.subscribe(función(valor) {
        si predicate(valor):
          observer.onNext(valor)
      })
    })
  }
}`}
                        </pre>
                      </div>
                      <div className="p-4 bg-pink-900/30 border border-pink-700/50 rounded-lg">
                        <p className="text-sm text-pink-200">
                          <span className="font-bold">Uso:</span> RxJS, data streams, reactive UI
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ps-sm" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-orange-700/50">
                    <h3 className="text-xl font-bold text-orange-400 mb-4">🤖 State Machine</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-orange-300 mb-3">FSM Pattern</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura StateMachine {
  estadoActual: Estado
  transiciones: Map<(Estado, Evento), Estado>
  acciones: Map<(Estado, Evento), Action>
}

función handleEvent(evento: Evento) {
  clave = (estadoActual, evento.tipo)
  
  si transiciones.contains(clave):
    nuevoEstado = transiciones.get(clave)
    
    // Ejecutar acción si existe
    si acciones.contains(clave):
      accion = acciones.get(clave)
      accion.execute(evento)
    
    // Transición
    onExit(estadoActual, evento)
    estadoActual = nuevoEstado
    onEnter(nuevoEstado, evento)
  sino:
    logWarning("Transición inválida: " + clave)
}`}
                        </pre>
                      </div>
                      <div className="p-4 bg-orange-900/30 border border-orange-700/50 rounded-lg">
                        <p className="text-sm text-orange-200">
                          <span className="font-bold">Uso:</span> Workflow engines, UI states, protocols
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ps-bp" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-teal-700/50">
                    <h3 className="text-xl font-bold text-teal-400 mb-4">🌊 Backpressure Management</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-teal-300 mb-3">Backpressure Strategies</h4>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`estructura BackpressureBuffer<T> {
  buffer: BoundedQueue<T>
  strategy: Strategy  // DROP, BLOCK, ERROR
}

función produce(item: T) {
  cuando strategy:
    DROP:
      si no buffer.offer(item):
        logDrop(item)  // Descartar silenciosamente
    
    BLOCK:
      buffer.put(item)  // Bloquear hasta que haya espacio
    
    ERROR:
      si no buffer.offer(item):
        throw BufferOverflowException()
}

función consume() -> T {
  retornar buffer.take()
}

// Patrón Reactive Streams
interfaz Publisher<T> {
  función subscribe(subscriber: Subscriber<T>)
}

interfaz Subscriber<T> {
  función onSubscribe(subscription: Subscription)
  función onNext(item: T)
  función onError(error: Error)
  función onComplete()
}

interfaz Subscription {
  función request(n: long)  // Pull-based backpressure
  función cancel()
}`}
                        </pre>
                      </div>
                      <div className="p-4 bg-teal-900/30 border border-teal-700/50 rounded-lg">
                        <p className="text-sm text-teal-200">
                          <span className="font-bold">Uso:</span> Reactive Streams, flow control, rate limiting
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de Demos */}
          <AccordionItem value="demos" className="bg-gray-800 rounded-lg border border-gray-700">
            <AccordionTrigger className="text-xl font-bold px-6">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5" />
                <span>Demostraciones Interactivas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="queue" className="px-6 pb-6">
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-4 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="queue">📥 Queue</TabsTrigger>
                    <TabsTrigger value="order">🔢 Ordering</TabsTrigger>
                    <TabsTrigger value="handler">⚡ Handlers</TabsTrigger>
                    <TabsTrigger value="worker">👷 Workers</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-4 gap-2 bg-gray-900/50 p-2">
                    <TabsTrigger value="sourcing">📜 Sourcing</TabsTrigger>
                    <TabsTrigger value="reactive">🔄 Reactive</TabsTrigger>
                    <TabsTrigger value="sm">🤖 State</TabsTrigger>
                    <TabsTrigger value="bp">🌊 Backpressure</TabsTrigger>
                  </TabsList>
                </div>

                {/* Demo 1: Event Queue */}
                <TabsContent value="queue" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-blue-400">Event Queue Management</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setQRunning(!qRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${qRunning ? 'bg-red-600' : 'bg-blue-600'}`}>
                          {qRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {qRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setQRunning(false); setQEvents([]); setQProcessed(0); setQLogs(['Event Queue reiniciado']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {qSpeed}ms</label>
                      <Slider value={[qSpeed]} onValueChange={([v]) => setQSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Cola FIFO</h4>
                        <div className="bg-gray-800 rounded p-4 h-64 overflow-y-auto">
                          {qEvents.length === 0 ? <div className="text-center text-gray-500">Cola vacía</div> : qEvents.map((e, i) => (
                            <div key={e.id} className={`p-2 mb-2 rounded border-2 ${i === 0 ? 'bg-blue-900/50 border-blue-500' : 'bg-gray-700 border-gray-600'}`}>
                              {i === 0 ? '🔵' : '⚪'} {e.type}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-center text-blue-400 font-bold">En cola: {qEvents.length}</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Estadísticas</h4>
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Procesados</div>
                            <div className="text-2xl font-bold text-green-400">{qProcessed}</div>
                          </div>
                          <div className="p-4 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">En Cola</div>
                            <div className="text-2xl font-bold text-blue-400">{qEvents.length}</div>
                          </div>
                          <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded text-center">
                            <div className="text-3xl mb-2">📥</div>
                            <div className="text-xs text-blue-300">Orden FIFO Garantizado</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={qLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-blue-400">
                        {qLogs.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Event Ordering */}
                <TabsContent value="order" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-green-400">Event Ordering Guarantees</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setORunning(!oRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${oRunning ? 'bg-red-600' : 'bg-green-600'}`}>
                          {oRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {oRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setORunning(false); setOSeq(0); setOViolations(0); setOLogs(['Event Ordering reiniciado']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {oSpeed}ms</label>
                      <Slider value={[oSpeed]} onValueChange={([v]) => setOSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">Secuencia Actual</div>
                          <div className="text-3xl font-bold text-green-400">#{oSeq}</div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">Violaciones</div>
                          <div className="text-3xl font-bold text-red-400">{oViolations}</div>
                        </div>
                      </div>
                      <div className="p-6 bg-green-900/30 border border-green-700/50 rounded text-center">
                        <div className="text-5xl mb-4">🔢</div>
                        <div className="text-xl font-bold text-green-300">
                          Tasa de éxito: {oSeq > 0 ? Math.round((1 - oViolations / (oSeq + oViolations)) * 100) : 100}%
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Vector clocks, Lamport timestamps</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={oLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-green-400">
                        {oLogs.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Non-blocking Handlers */}
                <TabsContent value="handler" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-purple-400">Non-blocking Handlers</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setHRunning(!hRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${hRunning ? 'bg-red-600' : 'bg-purple-600'}`}>
                          {hRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {hRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setHRunning(false); setHActive(0); setHCompleted(0); setHLogs(['Handlers reiniciado']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {hSpeed}ms</label>
                      <Slider value={[hSpeed]} onValueChange={([v]) => setHSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">Handlers Activos</div>
                          <div className="text-3xl font-bold text-purple-400">{hActive}</div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">Completados</div>
                          <div className="text-3xl font-bold text-green-400">{hCompleted}</div>
                        </div>
                      </div>
                      <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded text-center">
                        <div className="text-5xl mb-4">⚡</div>
                        <div className="text-lg font-bold text-purple-300">Procesamiento Asíncrono</div>
                        <div className="text-xs text-gray-400 mt-2">Callbacks, Promises, Async/Await</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={hLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-purple-400">
                        {hLogs.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Worker Threads */}
                <TabsContent value="worker" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-yellow-400">Worker Threads</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setWRunning(!wRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${wRunning ? 'bg-red-600' : 'bg-yellow-600'}`}>
                          {wRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {wRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setWRunning(false); setWWorkers(prev => prev.map(w => ({ ...w, status: 'idle' as const }))); setWQueue([]); setWCompleted(0); setWLogs(['Workers reiniciado']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {wSpeed}ms</label>
                      <Slider value={[wSpeed]} onValueChange={([v]) => setWSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Workers (4)</h4>
                        <div className="space-y-2">
                          {wWorkers.map(w => (
                            <div key={w.id} className={`p-3 rounded border-2 ${w.status === 'working' ? 'bg-yellow-900/50 border-yellow-500' : 'bg-gray-700 border-gray-600'}`}>
                              <div className="flex justify-between">
                                <span>👷 Worker {w.id}</span>
                                <span className={w.status === 'working' ? 'text-yellow-400' : 'text-gray-400'}>
                                  {w.status === 'working' ? '⚙️ Trabajando' : '💤 Idle'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-gray-400">Cola:</span> <span className="font-bold text-yellow-400">{wQueue.length}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">Completadas</div>
                          <div className="text-3xl font-bold text-green-400">{wCompleted}</div>
                        </div>
                        <div className="p-6 bg-yellow-900/30 border border-yellow-700/50 rounded text-center">
                          <div className="text-5xl mb-4">👷</div>
                          <div className="text-lg font-bold text-yellow-300">Thread Pool</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={wLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-yellow-400">
                        {wLogs.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 5: Event Sourcing */}
                <TabsContent value="sourcing" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-cyan-400">Event Sourcing</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setSRunning(!sRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${sRunning ? 'bg-red-600' : 'bg-cyan-600'}`}>
                          {sRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {sRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setSRunning(false); setSBalance(1000); setSItems(0); setSEvents([]); setSLogs(['Event Sourcing reiniciado']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {sSpeed}ms</label>
                      <Slider value={[sSpeed]} onValueChange={([v]) => setSSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Estado</h4>
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Balance</div>
                            <div className="text-3xl font-bold text-green-400">${sBalance}</div>
                          </div>
                          <div className="p-4 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Items</div>
                            <div className="text-3xl font-bold text-cyan-400">{sItems}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Eventos</h4>
                        <div className="bg-gray-800 rounded p-4 h-48 overflow-y-auto">
                          {sEvents.length === 0 ? <div className="text-center text-gray-500">Sin eventos</div> : sEvents.map(e => (
                            <div key={e.id} className="p-2 mb-2 rounded bg-cyan-900/30 border border-cyan-700/50">
                              <span className="text-sm">{e.type === 'DEPOSIT' ? '💰' : e.type === 'WITHDRAW' ? '💸' : '🛒'} {e.type} ${e.data}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={sLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-cyan-400">
                        {sLogs.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 6: Reactive Programming */}
                <TabsContent value="reactive" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-pink-400">Reactive Programming</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setRRunning(!rRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${rRunning ? 'bg-red-600' : 'bg-pink-600'}`}>
                          {rRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {rRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setRRunning(false); setRFiltered(0); setRMapped(0); setRLogs(['Reactive reiniciado']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {rSpeed}ms</label>
                      <Slider value={[rSpeed]} onValueChange={([v]) => setRSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">Filtrados (&gt;50)</div>
                          <div className="text-3xl font-bold text-pink-400">{rFiltered}</div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">Mapeados (*2)</div>
                          <div className="text-3xl font-bold text-purple-400">{rMapped}</div>
                        </div>
                      </div>
                      <div className="p-6 bg-pink-900/30 border border-pink-700/50 rounded text-center">
                        <div className="text-5xl mb-4">🔄</div>
                        <div className="text-lg font-bold text-pink-300">Reactive Streams</div>
                        <div className="text-xs text-gray-400 mt-2">Observables, filter, map</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={rLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-pink-400">
                        {rLogs.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 7: State Machine */}
                <TabsContent value="sm" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-orange-400">State Machine</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setSmRunning(!smRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${smRunning ? 'bg-red-600' : 'bg-orange-600'}`}>
                          {smRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {smRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setSmRunning(false); setSmState('IDLE'); setSmLogs(['State Machine: IDLE']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {smSpeed}ms</label>
                      <Slider value={[smSpeed]} onValueChange={([v]) => setSmSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="p-8 bg-gray-800 rounded text-center">
                        <div className="text-xs text-gray-400 mb-2">Estado Actual</div>
                        <div className="text-5xl font-bold text-orange-400 mb-4">{smState}</div>
                        <div className="text-xs text-gray-400">
                          {smState === 'IDLE' && '💤 En espera'}
                          {smState === 'RUNNING' && '🏃 Ejecutando'}
                          {smState === 'PAUSED' && '⏸️ Pausado'}
                          {smState === 'COMPLETED' && '✅ Completado'}
                        </div>
                      </div>
                      <div className="p-6 bg-orange-900/30 border border-orange-700/50 rounded">
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Transiciones</h4>
                        <div className="text-xs text-gray-300 space-y-2">
                          <div>IDLE → [start] → RUNNING</div>
                          <div>RUNNING → [pause] → PAUSED</div>
                          <div>RUNNING → [complete] → COMPLETED</div>
                          <div>PAUSED → [resume] → RUNNING</div>
                          <div>COMPLETED → [reset] → IDLE</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={smLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-orange-400">
                        {smLogs.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 8: Backpressure */}
                <TabsContent value="bp" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-teal-400">Backpressure Management</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setBpRunning(!bpRunning)} className={`px-4 py-2 rounded flex items-center gap-2 ${bpRunning ? 'bg-red-600' : 'bg-teal-600'}`}>
                          {bpRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {bpRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button onClick={() => { setBpRunning(false); setBpProduced(0); setBpConsumed(0); setBpBuffer([]); setBpDropped(0); setBpLogs(['Backpressure reiniciado']); }} className="px-4 py-2 bg-gray-700 rounded flex items-center gap-2">
                          <RotateCcw className="size-4" />Reiniciar
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Velocidad: {bpSpeed}ms</label>
                      <Slider value={[bpSpeed]} onValueChange={([v]) => setBpSpeed(v)} min={100} max={1000} step={50} className="w-64" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Métricas</h4>
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Producidos</div>
                            <div className="text-3xl font-bold text-blue-400">{bpProduced}</div>
                          </div>
                          <div className="p-4 bg-gray-800 rounded">
                            <div className="text-xs text-gray-400">Consumidos</div>
                            <div className="text-3xl font-bold text-green-400">{bpConsumed}</div>
                          </div>
                          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded">
                            <div className="text-xs text-gray-400">Descartados</div>
                            <div className="text-3xl font-bold text-red-400">{bpDropped}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Buffer (10)</h4>
                        <div className="bg-gray-800 rounded p-4 h-64">
                          <div className="grid grid-cols-10 gap-1 h-full">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className={`rounded ${i < bpBuffer.length ? 'bg-teal-500' : 'bg-gray-700'}`} />
                            ))}
                          </div>
                          <div className="mt-3 text-center">
                            <span className="text-teal-400 font-bold">{bpBuffer.length}/10</span>
                            {bpBuffer.length >= 10 && <span className="ml-3 text-red-400">⚠️ LLENO</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-2">Log</h4>
                      <div ref={bpLogRef} className="bg-black rounded p-3 h-40 overflow-y-auto font-mono text-xs text-teal-400">
                        {bpLogs.map((l, i) => <div key={i}>{l}</div>)}
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