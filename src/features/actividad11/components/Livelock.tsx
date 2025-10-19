import { AlertTriangle, BookOpen, Code, Play, Pause, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";

interface Agent {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  state: 'moving' | 'waiting' | 'blocked' | 'success';
  priority: number;
  retryCount: number;
  backoffDelay: number;
  lastMoveTime: number;
  stateHistory: string[];
}

export default function Livelock() {
  // Estados para Randomización Demo
  const [randomAgents, setRandomAgents] = useState<Agent[]>([
    { id: 1, x: 100, y: 200, targetX: 400, targetY: 200, color: 'bg-blue-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
    { id: 2, x: 400, y: 200, targetX: 100, targetY: 200, color: 'bg-red-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
  ]);
  const [randomRunning, setRandomRunning] = useState(false);
  const [randomTime, setRandomTime] = useState(0);
  const [randomSpeed, setRandomSpeed] = useState([300]);
  const [randomLogs, setRandomLogs] = useState<string[]>(['Simulación de Randomización iniciada.']);
  const randomLogRef = useRef<HTMLDivElement>(null);

  // Estados para Prioridades Demo
  const [priorityAgents, setPriorityAgents] = useState<Agent[]>([
    { id: 1, x: 100, y: 200, targetX: 400, targetY: 200, color: 'bg-purple-500', state: 'moving', priority: 10, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
    { id: 2, x: 400, y: 200, targetX: 100, targetY: 200, color: 'bg-pink-500', state: 'moving', priority: 5, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
  ]);
  const [priorityRunning, setPriorityRunning] = useState(false);
  const [priorityTime, setPriorityTime] = useState(0);
  const [prioritySpeed, setPrioritySpeed] = useState([300]);
  const [priorityLogs, setPriorityLogs] = useState<string[]>(['Simulación con Prioridades iniciada.']);
  const priorityLogRef = useRef<HTMLDivElement>(null);

  // Estados para Backoff Demo
  const [backoffAgents, setBackoffAgents] = useState<Agent[]>([
    { id: 1, x: 100, y: 200, targetX: 400, targetY: 200, color: 'bg-orange-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
    { id: 2, x: 400, y: 200, targetX: 100, targetY: 200, color: 'bg-yellow-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
  ]);
  const [backoffRunning, setBackoffRunning] = useState(false);
  const [backoffTime, setBackoffTime] = useState(0);
  const [backoffSpeed, setBackoffSpeed] = useState([300]);
  const [backoffLogs, setBackoffLogs] = useState<string[]>(['Simulación de Backoff Exponencial iniciada.']);
  const backoffLogRef = useRef<HTMLDivElement>(null);

  const [patternLogs] = useState<string[]>(['Simulación con Detección de Patrones iniciada.']);
  const patternLogRef = useRef<HTMLDivElement>(null);

  const [coordLogs] = useState<string[]>(['Simulación con Coordinador Centralizado iniciada.']);
  const coordLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs
  useEffect(() => {
    if (randomLogRef.current) randomLogRef.current.scrollTop = randomLogRef.current.scrollHeight;
  }, [randomLogs]);

  useEffect(() => {
    if (priorityLogRef.current) priorityLogRef.current.scrollTop = priorityLogRef.current.scrollHeight;
  }, [priorityLogs]);

  useEffect(() => {
    if (backoffLogRef.current) backoffLogRef.current.scrollTop = backoffLogRef.current.scrollHeight;
  }, [backoffLogs]);

  useEffect(() => {
    if (patternLogRef.current) patternLogRef.current.scrollTop = patternLogRef.current.scrollHeight;
  }, [patternLogs]);

  useEffect(() => {
    if (coordLogRef.current) coordLogRef.current.scrollTop = coordLogRef.current.scrollHeight;
  }, [coordLogs]);

  // Simulación Randomización
  useEffect(() => {
    if (!randomRunning) return;

    const interval = setInterval(() => {
      setRandomTime(prev => prev + randomSpeed[0]);

      setRandomAgents(prev => {
        const agent1 = prev[0];
        const agent2 = prev[1];

        // Detectar colisión en el medio (x ≈ 250)
        const collision = Math.abs(agent1.x - 250) < 30 && Math.abs(agent2.x - 250) < 30;

        if (collision && agent1.state === 'moving' && agent2.state === 'moving') {
          // Retardos aleatorios
          const delay1 = Math.random() * 500 + 100;
          const delay2 = Math.random() * 500 + 100;

          setRandomLogs(prevLogs => [...prevLogs,
            `⚠️ Colisión detectada en x=250`,
            `🎲 A1 espera ${delay1.toFixed(0)}ms, A2 espera ${delay2.toFixed(0)}ms`
          ]);

          return prev.map(a => ({
            ...a,
            state: 'waiting' as const,
            backoffDelay: a.id === 1 ? delay1 : delay2,
          }));
        }

        return prev.map(agent => {
          if (agent.state === 'waiting') {
            const newDelay = agent.backoffDelay - randomSpeed[0];
            if (newDelay <= 0) {
              setRandomLogs(prevLogs => [...prevLogs, `✅ A${agent.id} reinicia movimiento`]);
              return { ...agent, state: 'moving' as const, backoffDelay: 0 };
            }
            return { ...agent, backoffDelay: newDelay };
          }

          // Mover hacia objetivo
          const direction = agent.targetX > agent.x ? 1 : -1;
          const newX = agent.x + (direction * 10);

          // Verificar si llegó al objetivo
          if (Math.abs(newX - agent.targetX) < 20) {
            setRandomLogs(prevLogs => [...prevLogs, `🎯 A${agent.id} llegó a su destino!`]);
            return { ...agent, x: agent.targetX, state: 'success' as const };
          }

          return { ...agent, x: newX };
        });
      });
    }, randomSpeed[0]);

    return () => clearInterval(interval);
  }, [randomRunning, randomSpeed]);

  // Simulación Prioridades
  useEffect(() => {
    if (!priorityRunning) return;

    const interval = setInterval(() => {
      setPriorityTime(prev => prev + prioritySpeed[0]);

      setPriorityAgents(prev => {
        const agent1 = prev[0];
        const agent2 = prev[1];

        const collision = Math.abs(agent1.x - 250) < 30 && Math.abs(agent2.x - 250) < 30;

        if (collision && agent1.state === 'moving' && agent2.state === 'moving') {
          // Resolver por prioridad
          const winner = agent1.priority > agent2.priority ? agent1 : agent2;
          const loser = winner.id === agent1.id ? agent2 : agent1;

          setPriorityLogs(prevLogs => [...prevLogs,
            `⚠️ Colisión detectada`,
            `🎯 A${winner.id} (prioridad ${winner.priority}) tiene paso`,
            `⏸️ A${loser.id} (prioridad ${loser.priority}) cede`
          ]);

          return prev.map(a => ({
            ...a,
            state: a.id === winner.id ? 'moving' as const : 'blocked' as const,
          }));
        }

        return prev.map(agent => {
          if (agent.state === 'blocked') {
            // Esperar que el otro agente avance
            const other = prev.find(a => a.id !== agent.id);
            if (other && Math.abs(other.x - 250) > 50) {
              setPriorityLogs(prevLogs => [...prevLogs, `✅ A${agent.id} reinicia movimiento`]);
              return { ...agent, state: 'moving' as const };
            }
            return agent;
          }

          if (agent.state !== 'moving') return agent;

          const direction = agent.targetX > agent.x ? 1 : -1;
          const newX = agent.x + (direction * 10);

          if (Math.abs(newX - agent.targetX) < 20) {
            setPriorityLogs(prevLogs => [...prevLogs, `🎯 A${agent.id} llegó a su destino!`]);
            return { ...agent, x: agent.targetX, state: 'success' as const };
          }

          return { ...agent, x: newX };
        });
      });
    }, prioritySpeed[0]);

    return () => clearInterval(interval);
  }, [priorityRunning, prioritySpeed]);

  // Simulación Backoff Exponencial
  useEffect(() => {
    if (!backoffRunning) return;

    const interval = setInterval(() => {
      setBackoffTime(prev => prev + backoffSpeed[0]);

      setBackoffAgents(prev => {
        const agent1 = prev[0];
        const agent2 = prev[1];

        const collision = Math.abs(agent1.x - 250) < 30 && Math.abs(agent2.x - 250) < 30;

        if (collision && agent1.state === 'moving' && agent2.state === 'moving') {
          return prev.map(a => {
            const newRetryCount = a.retryCount + 1;
            const delay = Math.min(10 * Math.pow(2, a.retryCount), 2000);

            setBackoffLogs(prevLogs => [...prevLogs,
              `⚠️ Colisión - A${a.id} intento #${newRetryCount}`,
              `⏱️ Delay exponencial: ${delay}ms (2^${a.retryCount} * 10)`
            ]);

            return {
              ...a,
              state: 'waiting' as const,
              retryCount: newRetryCount,
              backoffDelay: delay,
            };
          });
        }

        return prev.map(agent => {
          if (agent.state === 'waiting') {
            const newDelay = agent.backoffDelay - backoffSpeed[0];
            if (newDelay <= 0) {
              setBackoffLogs(prevLogs => [...prevLogs, `✅ A${agent.id} reinicia (delay completado)`]);
              return { ...agent, state: 'moving' as const, backoffDelay: 0 };
            }
            return { ...agent, backoffDelay: newDelay };
          }

          if (agent.state !== 'moving') return agent;

          const direction = agent.targetX > agent.x ? 1 : -1;
          const newX = agent.x + (direction * 10);

          if (Math.abs(newX - agent.targetX) < 20) {
            setBackoffLogs(prevLogs => [...prevLogs, `🎯 A${agent.id} llegó después de ${agent.retryCount} reintentos!`]);
            return { ...agent, x: agent.targetX, state: 'success' as const };
          }

          return { ...agent, x: newX };
        });
      });
    }, backoffSpeed[0]);

    return () => clearInterval(interval);
  }, [backoffRunning, backoffSpeed]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="size-12 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">🔄 Livelock</h1>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            El <span className="font-bold text-yellow-400">Livelock</span> ocurre cuando dos o más procesos
            cambian continuamente su estado en respuesta a los cambios de otros procesos, sin realizar
            ningún progreso útil. A diferencia del deadlock donde los procesos están bloqueados, en livelock
            los procesos están activos pero atrapados en un ciclo de respuestas mutuas.
          </p>
          <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-200">
              <span className="font-bold">Analogía:</span> Es como dos personas intentando pasar por un pasillo
              estrecho y ambas se mueven simultáneamente en la misma dirección para evitar al otro, repitiendo
              este movimiento indefinidamente sin que ninguno logre pasar.
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
              <Tabs defaultValue="randomizacion" className="px-6 pb-6">
                <TabsList className="grid grid-cols-5 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="randomizacion">🎲 Randomización</TabsTrigger>
                  <TabsTrigger value="prioridades">🎯 Prioridades</TabsTrigger>
                  <TabsTrigger value="backoff">⏱️ Backoff Exponencial</TabsTrigger>
                  <TabsTrigger value="patrones">🔍 Detección de Patrones</TabsTrigger>
                  <TabsTrigger value="coordinacion">🎛️ Coordinación Centralizada</TabsTrigger>
                </TabsList>

                {/* Solución 1: Randomización */}
                <TabsContent value="randomizacion" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-blue-400 mb-4">🎲 Randomización</h3>
                    <p className="text-gray-300 mb-4">
                      Introduce retardos aleatorios antes de reintentar, rompiendo la sincronización entre procesos.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`function intentarAccion() {
  INTENTOS = 0
  MAX_INTENTOS = 10
  
  mientras INTENTOS < MAX_INTENTOS:
    si puedeRealizarAccion():
      realizarAccion()
      retornar EXITO
    
    // Retardo aleatorio para romper sincronización
    DELAY = random(MIN_DELAY, MAX_DELAY)
    esperar(DELAY)
    
    INTENTOS++
  
  retornar FALLO
}

// Ejemplo: Dos procesos compitiendo por recursos
Proceso P1:
  mientras verdadero:
    si intentarAccion():
      continuar
    esperar(random(100, 500)) // ms aleatorios
    
Proceso P2:
  mientras verdadero:
    si intentarAccion():
      continuar
    esperar(random(100, 500)) // ms aleatorios`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded">
                      <p className="text-sm text-blue-200">
                        <span className="font-bold">Ventaja:</span> Simple de implementar, efectivo para romper
                        patrones de sincronización. <span className="font-bold">Desventaja:</span> No garantiza
                        tiempo de respuesta predecible.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 2: Prioridades */}
                <TabsContent value="prioridades" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">🎯 Prioridades</h3>
                    <p className="text-gray-300 mb-4">
                      Asigna prioridades a los procesos para establecer un orden de ejecución determinístico.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura Proceso {
  id: entero
  prioridad: entero
  timestamp: tiempo
}

función resolverConflicto(P1, P2) {
  // Resolver por prioridad
  si P1.prioridad > P2.prioridad:
    P1.continuar()
    P2.retroceder()
    retornar P1
  sino si P1.prioridad < P2.prioridad:
    P2.continuar()
    P1.retroceder()
    retornar P2
  sino:
    // Prioridades iguales: usar timestamp
    si P1.timestamp < P2.timestamp:
      retornar P1
    sino:
      retornar P2
}

// Ejemplo: Acceso a recurso compartido
función accederRecurso(proceso) {
  mientras verdadero:
    si recurso.intentarBloquear(proceso):
      // Recurso adquirido
      usarRecurso()
      recurso.liberar()
      retornar
    sino:
      // Conflicto detectado
      competidor = recurso.obtenerCompetidor()
      ganador = resolverConflicto(proceso, competidor)
      
      si ganador != proceso:
        // Ceder y esperar
        esperar(TIEMPO_BASE * (competidor.prioridad - proceso.prioridad))
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded">
                      <p className="text-sm text-purple-200">
                        <span className="font-bold">Ventaja:</span> Garantiza progreso para procesos de alta
                        prioridad. <span className="font-bold">Desventaja:</span> Puede causar starvation en
                        procesos de baja prioridad.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 3: Backoff Exponencial */}
                <TabsContent value="backoff" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-orange-400 mb-4">⏱️ Backoff Exponencial</h3>
                    <p className="text-gray-300 mb-4">
                      Incrementa exponencialmente el tiempo de espera después de cada fallo, reduciendo la contención.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`función backoffExponencial() {
  INTENTOS = 0
  MAX_INTENTOS = 10
  DELAY_BASE = 10 // milisegundos
  MAX_DELAY = 5000
  
  mientras INTENTOS < MAX_INTENTOS:
    si intentarAccion():
      retornar EXITO
    
    // Calcular delay exponencial: 2^n * base
    DELAY = min(DELAY_BASE * (2 ** INTENTOS), MAX_DELAY)
    
    // Opcional: añadir jitter aleatorio
    JITTER = random(0, DELAY * 0.1)
    DELAY_TOTAL = DELAY + JITTER
    
    esperar(DELAY_TOTAL)
    INTENTOS++
  
  retornar FALLO
}

// Secuencia de delays:
// Intento 1: 10ms
// Intento 2: 20ms
// Intento 3: 40ms
// Intento 4: 80ms
// Intento 5: 160ms
// Intento 6: 320ms
// Intento 7: 640ms
// Intento 8: 1280ms
// Intento 9: 2560ms
// Intento 10: 5000ms (MAX_DELAY)

función accederConBackoff(recurso) {
  intentos = 0
  
  mientras intentos < MAX_INTENTOS:
    bloqueo = recurso.intentarBloquear()
    
    si bloqueo.exitoso:
      usarRecurso()
      recurso.liberar()
      retornar EXITO
    
    delay = calcularBackoff(intentos)
    esperar(delay)
    intentos++
  
  retornar TIMEOUT
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-orange-900/30 border border-orange-700/50 rounded">
                      <p className="text-sm text-orange-200">
                        <span className="font-bold">Ventaja:</span> Reduce contención progresivamente, usado en
                        protocolos de red (Ethernet). <span className="font-bold">Desventaja:</span> Aumenta
                        latencia con muchos reintentos.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 4: Detección de Patrones */}
                <TabsContent value="patrones" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">🔍 Detección de Patrones</h3>
                    <p className="text-gray-300 mb-4">
                      Monitorea el comportamiento de los procesos para detectar ciclos de livelock y tomar medidas correctivas.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura EstadoProceso {
  id: entero
  estados: Cola[Estado]
  ultimoCambio: tiempo
  contadorCambios: entero
}

función detectarLivelock(proceso) {
  VENTANA_TIEMPO = 1000 // 1 segundo
  UMBRAL_CAMBIOS = 10
  LONGITUD_PATRON = 5
  
  // Contar cambios de estado recientes
  cambiosRecientes = contarCambios(
    proceso,
    tiempo_actual - VENTANA_TIEMPO
  )
  
  si cambiosRecientes > UMBRAL_CAMBIOS:
    // Detectar patrón repetitivo
    patron = extraerPatron(proceso.estados, LONGITUD_PATRON)
    
    si esPatronRepetitivo(patron):
      retornar LIVELOCK_DETECTADO
  
  retornar OK
}

función manejarLivelock(proceso) {
  // Acciones correctivas
  
  opción 1: Forzar espera prolongada
    proceso.forzarEspera(random(500, 2000))
  
  opción 2: Cambiar estrategia
    proceso.cambiarEstrategia(ESTRATEGIA_ALTERNATIVA)
  
  opción 3: Escalar prioridad temporalmente
    proceso.incrementarPrioridad(BOOST_TEMPORAL)
    
  opción 4: Notificar coordinador
    coordinador.resolverConflicto(proceso)
}

// Monitor continuo
función monitorearSistema() {
  mientras verdadero:
    para cada proceso en procesos_activos:
      estado = detectarLivelock(proceso)
      
      si estado == LIVELOCK_DETECTADO:
        log("Livelock detectado en proceso", proceso.id)
        manejarLivelock(proceso)
        metricas.registrarLivelock(proceso)
    
    esperar(INTERVALO_MONITOREO)
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-700/50 rounded">
                      <p className="text-sm text-cyan-200">
                        <span className="font-bold">Ventaja:</span> Detecta y corrige problemas automáticamente.
                        <span className="font-bold">Desventaja:</span> Overhead de monitoreo, puede tener falsos
                        positivos.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 5: Coordinación Centralizada */}
                <TabsContent value="coordinacion" className="mt-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-pink-400 mb-4">🎛️ Coordinación Centralizada</h3>
                    <p className="text-gray-300 mb-4">
                      Un coordinador central arbitra el acceso a recursos, eliminando las decisiones descentralizadas
                      que causan livelock.
                    </p>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-green-400">{`estructura Coordinador {
  cola_solicitudes: ColaPrioridad[Solicitud]
  recursos_disponibles: Conjunto[Recurso]
  asignaciones: Mapa[Proceso, Recurso]
  mutex: Lock
}

función Coordinador.solicitarRecurso(proceso, recurso) {
  mutex.bloquear()
  
  solicitud = nuevaSolicitud(proceso, recurso, tiempo_actual)
  cola_solicitudes.insertar(solicitud)
  
  // Procesar solicitudes pendientes
  procesarSolicitudes()
  
  mutex.liberar()
  
  // Esperar asignación
  mientras no asignaciones.contiene(proceso):
    esperar(POLLING_INTERVAL)
  
  retornar asignaciones[proceso]
}

función Coordinador.procesarSolicitudes() {
  // Ordenar por prioridad y timestamp
  cola_solicitudes.ordenar()
  
  mientras no cola_solicitudes.vacia():
    solicitud = cola_solicitudes.primero()
    
    si recursos_disponibles.contiene(solicitud.recurso):
      // Asignar recurso
      recursos_disponibles.remover(solicitud.recurso)
      asignaciones[solicitud.proceso] = solicitud.recurso
      cola_solicitudes.remover(solicitud)
      
      log("Recurso", solicitud.recurso, "asignado a", solicitud.proceso)
    sino:
      // No disponible, esperar
      break
}

función Coordinador.liberarRecurso(proceso) {
  mutex.bloquear()
  
  recurso = asignaciones[proceso]
  asignaciones.remover(proceso)
  recursos_disponibles.añadir(recurso)
  
  log("Recurso", recurso, "liberado por", proceso)
  
  // Reintentar asignaciones pendientes
  procesarSolicitudes()
  
  mutex.liberar()
}

// Uso desde proceso
función Proceso.ejecutar() {
  recurso = coordinador.solicitarRecurso(self, RECURSO_NECESARIO)
  
  // Usar recurso
  trabajarCon(recurso)
  
  coordinador.liberarRecurso(self)
}`}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-pink-900/30 border border-pink-700/50 rounded">
                      <p className="text-sm text-pink-200">
                        <span className="font-bold">Ventaja:</span> Elimina completamente el livelock, control
                        total sobre asignaciones. <span className="font-bold">Desventaja:</span> Punto único de
                        fallo, posible cuello de botella.
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
              <Tabs defaultValue="demo-random" className="px-6 pb-6">
                <TabsList className="grid grid-cols-5 gap-2 bg-gray-900/50 p-2">
                  <TabsTrigger value="demo-random">🎲 Randomización</TabsTrigger>
                  <TabsTrigger value="demo-priority">🎯 Prioridades</TabsTrigger>
                  <TabsTrigger value="demo-backoff">⏱️ Backoff</TabsTrigger>
                  <TabsTrigger value="demo-pattern">🔍 Patrones</TabsTrigger>
                  <TabsTrigger value="demo-coord">🎛️ Coordinación</TabsTrigger>
                </TabsList>

                {/* Demo 1: Randomización */}
                <TabsContent value="demo-random" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Randomización 🎲</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setRandomRunning(!randomRunning)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {randomRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {randomRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={() => {
                            setRandomRunning(false);
                            setRandomTime(0);
                            setRandomAgents([
                              { id: 1, x: 100, y: 200, targetX: 400, targetY: 200, color: 'bg-blue-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
                              { id: 2, x: 400, y: 200, targetX: 100, targetY: 200, color: 'bg-red-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
                            ]);
                            setRandomLogs(['Simulación de Randomización reiniciada.']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={randomSpeed}
                            onValueChange={setRandomSpeed}
                            min={100}
                            max={500}
                            step={50}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{randomSpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">Tiempo: {randomTime}ms</div>
                      </div>
                    </div>

                    {/* Visualización del Pasillo */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Pasillo Estrecho 🚶‍♂️🚶‍♀️</h4>
                      <div className="relative h-64 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
                        {/* Paredes del pasillo */}
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gray-700 border-b-2 border-yellow-600"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-700 border-t-2 border-yellow-600"></div>
                        
                        {/* Punto de colisión */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full bg-red-500/20"></div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-red-400">
                          ZONA DE COLISIÓN
                        </div>

                        {/* Agentes */}
                        {randomAgents.map((agent) => (
                          <div
                            key={agent.id}
                            className="absolute transition-all duration-300"
                            style={{
                              left: `${agent.x}px`,
                              top: `${agent.y - 20}px`,
                            }}
                          >
                            <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center font-bold text-white shadow-lg ${
                              agent.state === 'waiting' ? 'animate-pulse' : ''
                            }`}>
                              A{agent.id}
                            </div>
                            <div className="text-xs text-center mt-1 text-white">
                              {agent.state === 'waiting' && `⏳ ${agent.backoffDelay.toFixed(0)}ms`}
                              {agent.state === 'success' && '✅'}
                              {agent.state === 'moving' && '→'}
                            </div>
                          </div>
                        ))}

                        {/* Objetivos */}
                        <div className="absolute left-[400px] top-[180px] text-2xl">🎯</div>
                        <div className="absolute left-[100px] top-[180px] text-2xl">🎯</div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Eventos</h4>
                      <div 
                        ref={randomLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {randomLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 2: Prioridades */}
                <TabsContent value="demo-priority" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Sistema de Prioridades 🎯</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setPriorityRunning(!priorityRunning)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {priorityRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {priorityRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={() => {
                            setPriorityRunning(false);
                            setPriorityTime(0);
                            setPriorityAgents([
                              { id: 1, x: 100, y: 200, targetX: 400, targetY: 200, color: 'bg-purple-500', state: 'moving', priority: 10, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
                              { id: 2, x: 400, y: 200, targetX: 100, targetY: 200, color: 'bg-pink-500', state: 'moving', priority: 5, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
                            ]);
                            setPriorityLogs(['Simulación con Prioridades reiniciada.']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={prioritySpeed}
                            onValueChange={setPrioritySpeed}
                            min={100}
                            max={500}
                            step={50}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{prioritySpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">Tiempo: {priorityTime}ms</div>
                      </div>
                    </div>

                    {/* Tabla de Prioridades */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-3">Prioridades de Agentes</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {priorityAgents.map(agent => (
                          <div key={agent.id} className="bg-gray-800 rounded p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded ${agent.color}`}></div>
                              <span className="font-bold">Agente {agent.id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">Prioridad:</span>
                              <span className="font-mono font-bold text-white">{agent.priority}</span>
                              {agent.state === 'blocked' && <span className="text-xs bg-red-600 px-2 py-1 rounded">🛑 BLOQUEADO</span>}
                              {agent.state === 'moving' && <span className="text-xs bg-green-600 px-2 py-1 rounded">▶ AVANZANDO</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visualización del Pasillo */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Pasillo con Prioridades</h4>
                      <div className="relative h-64 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gray-700 border-b-2 border-purple-600"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-700 border-t-2 border-purple-600"></div>
                        
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full bg-purple-500/20"></div>

                        {priorityAgents.map((agent) => (
                          <div
                            key={agent.id}
                            className="absolute transition-all duration-300"
                            style={{
                              left: `${agent.x}px`,
                              top: `${agent.y - 20}px`,
                            }}
                          >
                            <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center font-bold text-white shadow-lg relative ${
                              agent.state === 'blocked' ? 'opacity-50' : ''
                            }`}>
                              A{agent.id}
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-900 px-2 py-1 rounded whitespace-nowrap">
                                P: {agent.priority}
                              </div>
                            </div>
                            <div className="text-xs text-center mt-1 text-white">
                              {agent.state === 'blocked' && '🛑'}
                              {agent.state === 'success' && '✅'}
                              {agent.state === 'moving' && '→'}
                            </div>
                          </div>
                        ))}

                        <div className="absolute left-[400px] top-[180px] text-2xl">🎯</div>
                        <div className="absolute left-[100px] top-[180px] text-2xl">🎯</div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Eventos de Resolución</h4>
                      <div 
                        ref={priorityLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {priorityLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 3: Backoff Exponencial */}
                <TabsContent value="demo-backoff" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Demostración: Backoff Exponencial ⏱️</h3>
                    
                    {/* Controles */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setBackoffRunning(!backoffRunning)}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium flex items-center gap-2"
                        >
                          {backoffRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                          {backoffRunning ? 'Pausar' : 'Iniciar'}
                        </button>
                        <button
                          onClick={() => {
                            setBackoffRunning(false);
                            setBackoffTime(0);
                            setBackoffAgents([
                              { id: 1, x: 100, y: 200, targetX: 400, targetY: 200, color: 'bg-orange-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
                              { id: 2, x: 400, y: 200, targetX: 100, targetY: 200, color: 'bg-yellow-500', state: 'moving', priority: 0, retryCount: 0, backoffDelay: 0, lastMoveTime: 0, stateHistory: [] },
                            ]);
                            setBackoffLogs(['Simulación de Backoff Exponencial reiniciada.']);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center gap-2"
                        >
                          <RotateCcw className="size-4" />
                          Reiniciar
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Velocidad:</span>
                          <Slider
                            value={backoffSpeed}
                            onValueChange={setBackoffSpeed}
                            min={100}
                            max={500}
                            step={50}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-400">{backoffSpeed[0]}ms</span>
                        </div>
                        <div className="ml-auto text-gray-400">Tiempo: {backoffTime}ms</div>
                      </div>
                    </div>

                    {/* Tabla de Reintentos */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-3">Estadísticas de Backoff</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {backoffAgents.map(agent => (
                          <div key={agent.id} className="bg-gray-800 rounded p-3">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-4 h-4 rounded ${agent.color}`}></div>
                              <span className="font-bold">Agente {agent.id}</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Reintentos:</span>
                                <span className="font-mono text-white">{agent.retryCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Delay actual:</span>
                                <span className="font-mono text-yellow-400">{agent.backoffDelay.toFixed(0)}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fórmula:</span>
                                <span className="font-mono text-orange-400">2^{agent.retryCount} × 10</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visualización del Pasillo */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h4 className="font-bold text-white mb-4">Pasillo con Backoff Exponencial</h4>
                      <div className="relative h-64 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gray-700 border-b-2 border-orange-600"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-700 border-t-2 border-orange-600"></div>
                        
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full bg-orange-500/20"></div>

                        {backoffAgents.map((agent) => (
                          <div
                            key={agent.id}
                            className="absolute transition-all duration-300"
                            style={{
                              left: `${agent.x}px`,
                              top: `${agent.y - 20}px`,
                            }}
                          >
                            <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center font-bold text-white shadow-lg ${
                              agent.state === 'waiting' ? 'animate-pulse scale-110' : ''
                            }`}>
                              A{agent.id}
                            </div>
                            <div className="text-xs text-center mt-1 text-white">
                              {agent.state === 'waiting' && `⏳ ${agent.backoffDelay.toFixed(0)}ms`}
                              {agent.state === 'success' && '✅'}
                              {agent.state === 'moving' && '→'}
                            </div>
                            {agent.retryCount > 0 && (
                              <div className="text-xs text-center text-orange-400">
                                Intento #{agent.retryCount}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="absolute left-[400px] top-[180px] text-2xl">🎯</div>
                        <div className="absolute left-[100px] top-[180px] text-2xl">🎯</div>
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">Eventos de Backoff</h4>
                      <div 
                        ref={backoffLogRef}
                        className="bg-black rounded p-3 font-mono text-xs text-green-400 h-48 overflow-y-auto"
                      >
                        {backoffLogs.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Demo 4: Detección de Patrones - Placeholder */}
                <TabsContent value="demo-pattern" className="mt-6">
                  <div className="p-6 text-center text-gray-400">
                    <div className="text-6xl mb-4">🚧</div>
                    <p className="text-lg">Demo de Detección de Patrones en desarrollo...</p>
                  </div>
                </TabsContent>

                {/* Demo 5: Coordinación Centralizada - Placeholder */}
                <TabsContent value="demo-coord" className="mt-6">
                  <div className="p-6 text-center text-gray-400">
                    <div className="text-6xl mb-4">🚧</div>
                    <p className="text-lg">Demo de Coordinación Centralizada en desarrollo...</p>
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
