import { AlertTriangle, BookOpen, Code, Play, RotateCcw, Pause, Minus, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useState, useRef, useEffect } from 'react';

export default function CondicionCarrera() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl">⚡</div>
            <div>
              <h1 className="text-4xl font-bold text-white">Condición de Carrera</h1>
              <p className="text-gray-400 text-sm mt-1">Race Condition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Descripción del Problema */}
        <div className="bg-white text-gray-900 rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="size-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Descripción del Problema</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Una <strong className="text-red-600">condición de carrera</strong> (race condition) ocurre cuando dos o más threads acceden a datos compartidos 
            simultáneamente y al menos uno de ellos modifica los datos. El resultado final depende del orden de ejecución de los threads, 
            lo que puede llevar a comportamientos impredecibles y errores difíciles de reproducir.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">¿Por qué es peligroso?</h3>
                <p className="text-sm text-gray-700">
                  Las condiciones de carrera pueden causar corrupción de datos, resultados incorrectos, crashes del sistema e incluso vulnerabilidades de seguridad. 
                  Son especialmente peligrosas porque pueden aparecer de manera intermitente y ser difíciles de depurar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acordeón: Soluciones y Demostración */}
        <Accordion type="multiple" defaultValue={['soluciones', 'demostracion']} className="space-y-4">
          {/* SECCIÓN 1: SOLUCIONES */}
          <AccordionItem value="soluciones" className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <AccordionTrigger className="text-xl font-bold text-white hover:no-underline px-6">
              <div className="flex items-center gap-2">
                <Code className="size-5" />
                <span>Soluciones</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="mutex" className="w-full">
                <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-gray-900 p-2">
                  <TabsTrigger value="mutex">Mutex</TabsTrigger>
                  <TabsTrigger value="semaforos">Semáforos</TabsTrigger>
                  <TabsTrigger value="atomicas">Variables Atómicas</TabsTrigger>
                  <TabsTrigger value="monitores">Monitores</TabsTrigger>
                  <TabsTrigger value="rwlocks">Locks Lectura/Escritura</TabsTrigger>
                </TabsList>

                {/* Solución 1: Mutex */}
                <TabsContent value="mutex" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Mutex (Mutual Exclusion)</h3>
                    <p className="text-gray-300">
                      Un mutex garantiza que solo un thread pueda acceder a la sección crítica a la vez.
                      Cuando un thread adquiere el mutex, todos los demás deben esperar.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Mutex para proteger contador compartido

// Declaración de recursos compartidos
COMPARTIDO contador = 0
COMPARTIDO mutex = NuevoMutex()

PROCEDIMIENTO incrementar():
    mutex.adquirir()           // Entrar a sección crítica
    
    // Sección crítica - solo un thread a la vez
    temp = contador
    temp = temp + 1
    contador = temp
    
    mutex.liberar()            // Salir de sección crítica
FIN PROCEDIMIENTO

PROCEDIMIENTO thread_worker(id):
    PARA i = 1 HASTA 1000:
        incrementar()
    FIN PARA
    
    IMPRIMIR "Thread", id, "terminado"
FIN PROCEDIMIENTO

// Programa principal
CREAR thread1 QUE EJECUTE thread_worker(1)
CREAR thread2 QUE EJECUTE thread_worker(2)

ESPERAR thread1
ESPERAR thread2

IMPRIMIR "Valor final del contador:", contador  // Resultado: 2000`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Simple, garantiza exclusión mutua, previene condiciones de carrera.<br />
                        <strong>⚠️ Desventajas:</strong> Puede causar contención, reduce concurrencia, riesgo de deadlock.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 2: Semáforos */}
                <TabsContent value="semaforos" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Semáforos</h3>
                    <p className="text-gray-300">
                      Los semáforos permiten controlar el acceso a un recurso mediante un contador. 
                      Un semáforo binario (valor 0 o 1) funciona similar a un mutex.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Semáforo binario

// Declaración
COMPARTIDO contador = 0
COMPARTIDO semaforo = NuevoSemaforo(1)  // Valor inicial: 1

PROCEDIMIENTO incrementar():
    semaforo.esperar()         // P(s) o wait(s) - decrementa
    
    // Sección crítica
    contador = contador + 1
    
    semaforo.señalar()         // V(s) o signal(s) - incrementa
FIN PROCEDIMIENTO

// Ejemplo: Semáforo con múltiples recursos
COMPARTIDO recursos_disponibles = NuevoSemaforo(5)  // 5 recursos

PROCEDIMIENTO usar_recurso(id):
    IMPRIMIR "Thread", id, "esperando recurso..."
    recursos_disponibles.esperar()
    
    IMPRIMIR "Thread", id, "usando recurso"
    DORMIR(2)  // Simular trabajo
    
    IMPRIMIR "Thread", id, "liberando recurso"
    recursos_disponibles.señalar()
FIN PROCEDIMIENTO

// Crear 10 threads compitiendo por 5 recursos
PARA i = 1 HASTA 10:
    CREAR thread QUE EJECUTE usar_recurso(i)
FIN PARA`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Flexible, permite múltiples accesos simultáneos, útil para productores-consumidores.<br />
                        <strong>⚠️ Desventajas:</strong> Más complejo que mutex, fácil cometer errores (olvidar señalar).
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 3: Variables Atómicas */}
                <TabsContent value="atomicas" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Variables Atómicas</h3>
                    <p className="text-gray-300">
                      Las operaciones atómicas se ejecutan como una unidad indivisible. El hardware garantiza que no pueden ser interrumpidas.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Variables atómicas

// Declaración de variable atómica
COMPARTIDO ATOMICA contador = 0

PROCEDIMIENTO incrementar_atomico():
    // Operación atómica - garantizada por hardware
    ATOMICO_INCREMENTAR(contador, 1)
    
    // Equivalente a:
    // atomicamente { contador = contador + 1 }
FIN PROCEDIMIENTO

PROCEDIMIENTO compare_and_swap(id):
    intentos = 0
    
    REPETIR:
        viejo = contador
        nuevo = viejo + 1
        intentos = intentos + 1
        
        // CAS: solo actualiza si valor no cambió
        exito = ATOMICO_CAS(contador, viejo, nuevo)
        
    HASTA QUE exito
    
    IMPRIMIR "Thread", id, "exitoso en intento", intentos
FIN PROCEDIMIENTO

// Operaciones atómicas comunes:
ATOMICO_LEER(variable)           // Lectura atómica
ATOMICO_ESCRIBIR(variable, valor) // Escritura atómica
ATOMICO_INTERCAMBIAR(var, nuevo)  // Exchange
ATOMICO_SUMAR(variable, valor)    // Fetch-and-add
ATOMICO_CAS(var, viejo, nuevo)    // Compare-and-swap

// Ejemplo de uso
PROCEDIMIENTO thread_worker():
    PARA i = 1 HASTA 1000:
        ATOMICO_INCREMENTAR(contador, 1)
    FIN PARA
FIN PROCEDIMIENTO

CREAR 10 threads workers
ESPERAR todos los threads
IMPRIMIR "Total:", contador  // Siempre 10000`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Muy rápidas, no requieren locks, sin deadlocks, alta concurrencia.<br />
                        <strong>⚠️ Desventajas:</strong> Solo para operaciones simples, limitadas por hardware, puede causar ABA problem.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 4: Monitores */}
                <TabsContent value="monitores" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Monitores</h3>
                    <p className="text-gray-300">
                      Un monitor encapsula datos compartidos y métodos de acceso con sincronización implícita.
                      Solo un thread puede estar activo dentro del monitor a la vez.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Monitor

MONITOR ContadorSeguro:
    // Variables privadas del monitor
    PRIVADO contador = 0
    
    // Métodos sincronizados automáticamente
    PROCEDIMIENTO incrementar():
        // Solo un thread puede ejecutar esto a la vez
        contador = contador + 1
    FIN PROCEDIMIENTO
    
    PROCEDIMIENTO decrementar():
        contador = contador - 1
    FIN PROCEDIMIENTO
    
    FUNCION obtener_valor():
        RETORNAR contador
    FIN FUNCION
FIN MONITOR

// Monitor con variables de condición
MONITOR Buffer:
    PRIVADO datos = []
    PRIVADO capacidad = 10
    PRIVADO no_lleno = NuevaCondicion()
    PRIVADO no_vacio = NuevaCondicion()
    
    PROCEDIMIENTO insertar(item):
        // Esperar si el buffer está lleno
        MIENTRAS longitud(datos) >= capacidad:
            no_lleno.esperar()      // Libera el monitor y espera
        FIN MIENTRAS
        
        agregar(datos, item)
        no_vacio.señalar()          // Despertar consumidores
    FIN PROCEDIMIENTO
    
    FUNCION extraer():
        // Esperar si el buffer está vacío
        MIENTRAS longitud(datos) == 0:
            no_vacio.esperar()
        FIN MIENTRAS
        
        item = remover_primero(datos)
        no_lleno.señalar()          // Despertar productores
        RETORNAR item
    FIN FUNCION
FIN MONITOR

// Uso del monitor
COMPARTIDO monitor = NuevoContadorSeguro()

PROCEDIMIENTO thread_incrementador():
    PARA i = 1 HASTA 1000:
        monitor.incrementar()      // Sincronización automática
    FIN PARA
FIN PROCEDIMIENTO`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Sincronización implícita, encapsulación, menos errores de programación.<br />
                        <strong>⚠️ Desventajas:</strong> Overhead mayor, requiere soporte del lenguaje, menos control fino.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 5: Locks Lectura/Escritura */}
                <TabsContent value="rwlocks" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Locks de Lectura/Escritura</h3>
                    <p className="text-gray-300">
                      Permiten múltiples lectores simultáneos, pero escritura exclusiva. 
                      Optimiza el caso común de muchas lecturas y pocas escrituras.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Read-Write Lock

COMPARTIDO datos = []
COMPARTIDO rwlock = NuevoRWLock()

PROCEDIMIENTO leer_datos(id):
    rwlock.adquirir_lectura()   // Múltiples lectores permitidos
    
    // Sección de lectura
    IMPRIMIR "Thread", id, "leyendo:", datos
    DORMIR(1)  // Simular lectura larga
    
    rwlock.liberar_lectura()
FIN PROCEDIMIENTO

PROCEDIMIENTO escribir_datos(id, valor):
    rwlock.adquirir_escritura()  // Acceso exclusivo
    
    // Sección de escritura
    IMPRIMIR "Thread", id, "escribiendo:", valor
    agregar(datos, valor)
    DORMIR(2)  // Simular escritura larga
    
    rwlock.liberar_escritura()
FIN PROCEDIMIENTO

// Implementación interna simplificada
ESTRUCTURA RWLock:
    lectores_activos = 0
    escritor_activo = FALSO
    mutex = NuevoMutex()
    puede_leer = NuevaCondicion()
    puede_escribir = NuevaCondicion()
    
    PROCEDIMIENTO adquirir_lectura():
        mutex.adquirir()
        
        // Esperar si hay escritor activo
        MIENTRAS escritor_activo:
            puede_leer.esperar(mutex)
        FIN MIENTRAS
        
        lectores_activos = lectores_activos + 1
        mutex.liberar()
    FIN PROCEDIMIENTO
    
    PROCEDIMIENTO liberar_lectura():
        mutex.adquirir()
        lectores_activos = lectores_activos - 1
        
        SI lectores_activos == 0:
            puede_escribir.señalar()  // Permitir escritor
        FIN SI
        
        mutex.liberar()
    FIN PROCEDIMIENTO
    
    PROCEDIMIENTO adquirir_escritura():
        mutex.adquirir()
        
        // Esperar a que no haya lectores ni escritores
        MIENTRAS lectores_activos > 0 O escritor_activo:
            puede_escribir.esperar(mutex)
        FIN MIENTRAS
        
        escritor_activo = VERDADERO
        mutex.liberar()
    FIN PROCEDIMIENTO
    
    PROCEDIMIENTO liberar_escritura():
        mutex.adquirir()
        escritor_activo = FALSO
        
        puede_escribir.señalar()   // Permitir otro escritor
        puede_leer.señalar_todos() // Permitir lectores
        
        mutex.liberar()
    FIN PROCEDIMIENTO
FIN ESTRUCTURA

// Uso: 90% lecturas, 10% escrituras
CREAR 9 threads lectores
CREAR 1 thread escritor`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Alta concurrencia en lecturas, eficiente para lectura-pesada.<br />
                        <strong>⚠️ Desventajas:</strong> Más complejo, puede causar starvation de escritores, overhead adicional.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          {/* SECCIÓN 2: DEMOSTRACIÓN */}
          <AccordionItem value="demostracion" className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <AccordionTrigger className="text-xl font-bold text-white hover:no-underline px-6">
              <div className="flex items-center gap-2">
                <Play className="size-5" />
                <span>Demostración Interactiva</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DemostracionCondicionCarrera />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// Tipos para los estados
type ThreadState = {
  id: number;
  estado: string;
  color: string;
  colorText: string;
};

type LogEntry = {
  mensaje: string;
  color: string;
};

// Componente de demostración interactiva
function DemostracionCondicionCarrera() {
  const [solucion, setSolucion] = useState<string>('sin-proteccion');
  const [ejecutando, setEjecutando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [contador, setContador] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [threadStates, setThreadStates] = useState<ThreadState[]>([]);
  
  // Configuración
  const [numThreads, setNumThreads] = useState(5);
  const [numRecursos, setNumRecursos] = useState(3);
  const [velocidad, setVelocidad] = useState([50]); // 0-100, donde 100 es más rápido
  
  const pausaRef = useRef(false);
  const stopRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const getVelocidadMs = () => {
    // Invertir: velocidad 100 = 100ms, velocidad 0 = 2000ms
    return 2000 - (velocidad[0] * 19);
  };

  const agregarLog = (mensaje: string, color: string = 'text-green-400') => {
    setLogs(prev => [...prev, { mensaje: `[${new Date().toLocaleTimeString()}] ${mensaje}`, color }]);
  };

  // Auto-scroll cuando se agregan logs
  useEffect(() => {
    if (shouldAutoScrollRef.current && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Detectar scroll manual del usuario
  const handleScroll = () => {
    if (!logsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
    
    shouldAutoScrollRef.current = isAtBottom;
  };

  const esperarSiPausado = async () => {
    while (pausaRef.current && !stopRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const delay = async (ms: number) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    await esperarSiPausado();
  };

  // Simulación SIN protección
  const simularSinProteccion = async (id: number) => {
    const iteraciones = 3;
    
    for (let i = 0; i < iteraciones; i++) {
      if (stopRef.current) return;
      
      // Esperando
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Esperando', color: 'bg-gray-600', colorText: 'text-gray-400'} : t
      ));
      agregarLog(`Thread ${id}: Esperando para acceder`, 'text-gray-400');
      await delay(getVelocidadMs() * Math.random());

      // Accediendo sin protección
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Accediendo', color: 'bg-red-600', colorText: 'text-red-400'} : t
      ));
      agregarLog(`Thread ${id}: ⚠️ Accediendo SIN protección`, 'text-red-400');
      
      const temp = contador;
      await delay(getVelocidadMs() * 0.5);
      setContador(temp + 1);
      agregarLog(`Thread ${id}: Incrementó contador (posible race condition)`, 'text-red-300');

      // Trabajando
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : t
      ));
      await delay(getVelocidadMs() * 0.3);
    }

    setThreadStates(prev => prev.map(t => 
      t.id === id ? {...t, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500'} : t
    ));
    agregarLog(`Thread ${id}: ✅ Terminado`, 'text-green-400');
  };

  // Simulación CON Mutex
  const simularConMutex = async (id: number, mutexQueue: number[]) => {
    const iteraciones = 3;
    
    for (let i = 0; i < iteraciones; i++) {
      if (stopRef.current) return;
      
      // Esperando lock
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Esperando lock', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : t
      ));
      agregarLog(`Thread ${id}: 🔒 Intentando adquirir mutex`, 'text-yellow-400');
      
      // Esperar turno en la cola
      while (mutexQueue.length > 0 && mutexQueue[0] !== id) {
        await delay(100);
        if (stopRef.current) return;
      }
      
      // Adquirió el lock
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Sección crítica', color: 'bg-green-600', colorText: 'text-green-400'} : t
      ));
      agregarLog(`Thread ${id}: ✅ Adquirió mutex - En sección crítica`, 'text-green-400');
      
      await delay(getVelocidadMs() * 0.8);
      setContador(c => c + 1);
      agregarLog(`Thread ${id}: Incrementó contador de forma segura`, 'text-green-300');
      
      await delay(getVelocidadMs() * 0.5);
      
      // Liberar mutex
      mutexQueue.shift();
      agregarLog(`Thread ${id}: 🔓 Liberó mutex`, 'text-cyan-400');
      
      // Trabajando
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : t
      ));
      await delay(getVelocidadMs() * 0.3);
    }

    setThreadStates(prev => prev.map(t => 
      t.id === id ? {...t, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500'} : t
    ));
    agregarLog(`Thread ${id}: ✅ Terminado`, 'text-green-400');
  };

  // Simulación con Semáforos
  const simularConSemaforo = async (id: number, semaforo: { valor: number, cola: number[] }) => {
    const iteraciones = 3;
    
    for (let i = 0; i < iteraciones; i++) {
      if (stopRef.current) return;
      
      // Esperando semáforo
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Esperando semáforo', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : t
      ));
      agregarLog(`Thread ${id}: 🔢 Esperando semáforo (valor: ${semaforo.valor})`, 'text-yellow-400');
      
      // Esperar hasta que el semáforo esté disponible
      while (semaforo.valor <= 0) {
        await delay(100);
        if (stopRef.current) return;
      }
      
      // Wait (P)
      semaforo.valor--;
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Usando recurso', color: 'bg-green-600', colorText: 'text-green-400'} : t
      ));
      agregarLog(`Thread ${id}: ✅ Ejecutó wait(S) - Usando recurso (S=${semaforo.valor})`, 'text-green-400');
      
      await delay(getVelocidadMs() * 0.8);
      setContador(c => c + 1);
      agregarLog(`Thread ${id}: Incrementó contador`, 'text-green-300');
      
      await delay(getVelocidadMs() * 0.5);
      
      // Signal (V)
      semaforo.valor++;
      agregarLog(`Thread ${id}: 🔔 Ejecutó signal(S) - Liberó recurso (S=${semaforo.valor})`, 'text-cyan-400');
      
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : t
      ));
      await delay(getVelocidadMs() * 0.3);
    }

    setThreadStates(prev => prev.map(t => 
      t.id === id ? {...t, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500'} : t
    ));
    agregarLog(`Thread ${id}: ✅ Terminado`, 'text-green-400');
  };

  // Simulación con Variables Atómicas
  const simularConAtomica = async (id: number) => {
    const iteraciones = 3;
    
    for (let i = 0; i < iteraciones; i++) {
      if (stopRef.current) return;
      
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Preparando CAS', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : t
      ));
      agregarLog(`Thread ${id}: ⚛️ Preparando operación atómica`, 'text-yellow-400');
      await delay(getVelocidadMs() * 0.3);

      // Compare-and-Swap
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Ejecutando CAS', color: 'bg-green-600', colorText: 'text-green-400'} : t
      ));
      agregarLog(`Thread ${id}: ⚡ Ejecutando ATOMIC_INCREMENT`, 'text-green-400');
      
      await delay(getVelocidadMs() * 0.2);
      setContador(c => c + 1);
      agregarLog(`Thread ${id}: ✅ Operación atómica completada`, 'text-green-300');

      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : t
      ));
      await delay(getVelocidadMs() * 0.3);
    }

    setThreadStates(prev => prev.map(t => 
      t.id === id ? {...t, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500'} : t
    ));
    agregarLog(`Thread ${id}: ✅ Terminado`, 'text-green-400');
  };

  // Simulación con Monitores
  const simularConMonitor = async (id: number, monitor: { ocupado: boolean, cola: number[] }) => {
    const iteraciones = 3;
    
    for (let i = 0; i < iteraciones; i++) {
      if (stopRef.current) return;
      
      // Intentando entrar al monitor
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Esperando monitor', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : t
      ));
      agregarLog(`Thread ${id}: 🏛️ Intentando entrar al monitor`, 'text-yellow-400');
      
      // Esperar si el monitor está ocupado
      while (monitor.ocupado) {
        await delay(100);
        if (stopRef.current) return;
      }
      
      // Entró al monitor
      monitor.ocupado = true;
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Dentro del monitor', color: 'bg-green-600', colorText: 'text-green-400'} : t
      ));
      agregarLog(`Thread ${id}: ✅ Entró al monitor - Ejecutando método sincronizado`, 'text-green-400');
      
      await delay(getVelocidadMs() * 0.8);
      setContador(c => c + 1);
      agregarLog(`Thread ${id}: Incrementó contador (sincronización implícita)`, 'text-green-300');
      
      await delay(getVelocidadMs() * 0.5);
      
      // Salir del monitor
      monitor.ocupado = false;
      agregarLog(`Thread ${id}: 🚪 Salió del monitor`, 'text-cyan-400');
      
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : t
      ));
      await delay(getVelocidadMs() * 0.3);
    }

    setThreadStates(prev => prev.map(t => 
      t.id === id ? {...t, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500'} : t
    ));
    agregarLog(`Thread ${id}: ✅ Terminado`, 'text-green-400');
  };

  // Simulación con Read-Write Locks
  const simularConRWLock = async (id: number, rwlock: { lectores: number, escritor: boolean }) => {
    const iteraciones = 3;
    const esEscritor = id % 3 === 0; // Cada 3er thread es escritor
    
    for (let i = 0; i < iteraciones; i++) {
      if (stopRef.current) return;
      
      if (esEscritor) {
        // Thread escritor
        setThreadStates(prev => prev.map(t => 
          t.id === id ? {...t, estado: 'Esperando write lock', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : t
        ));
        agregarLog(`Thread ${id}: 📝 Esperando write lock`, 'text-yellow-400');
        
        // Esperar a que no haya lectores ni escritores
        while (rwlock.lectores > 0 || rwlock.escritor) {
          await delay(100);
          if (stopRef.current) return;
        }
        
        rwlock.escritor = true;
        setThreadStates(prev => prev.map(t => 
          t.id === id ? {...t, estado: 'Escribiendo', color: 'bg-purple-600', colorText: 'text-purple-400'} : t
        ));
        agregarLog(`Thread ${id}: ✍️ Adquirió write lock - Escribiendo`, 'text-purple-400');
        
        await delay(getVelocidadMs() * 1.2);
        setContador(c => c + 1);
        agregarLog(`Thread ${id}: Modificó datos (escritura exclusiva)`, 'text-purple-300');
        
        await delay(getVelocidadMs() * 0.5);
        rwlock.escritor = false;
        agregarLog(`Thread ${id}: 🔓 Liberó write lock`, 'text-cyan-400');
        
      } else {
        // Thread lector
        setThreadStates(prev => prev.map(t => 
          t.id === id ? {...t, estado: 'Esperando read lock', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : t
        ));
        agregarLog(`Thread ${id}: 📖 Esperando read lock`, 'text-yellow-400');
        
        // Esperar solo si hay escritor
        while (rwlock.escritor) {
          await delay(100);
          if (stopRef.current) return;
        }
        
        rwlock.lectores++;
        setThreadStates(prev => prev.map(t => 
          t.id === id ? {...t, estado: `Leyendo (${rwlock.lectores} lectores)`, color: 'bg-green-600', colorText: 'text-green-400'} : t
        ));
        agregarLog(`Thread ${id}: 👓 Adquirió read lock - Leyendo (${rwlock.lectores} lectores activos)`, 'text-green-400');
        
        await delay(getVelocidadMs() * 0.6);
        agregarLog(`Thread ${id}: Leyó datos (compartido con otros lectores)`, 'text-green-300');
        
        await delay(getVelocidadMs() * 0.4);
        rwlock.lectores--;
        agregarLog(`Thread ${id}: 🔓 Liberó read lock (${rwlock.lectores} lectores restantes)`, 'text-cyan-400');
      }
      
      setThreadStates(prev => prev.map(t => 
        t.id === id ? {...t, estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : t
      ));
      await delay(getVelocidadMs() * 0.3);
    }

    setThreadStates(prev => prev.map(t => 
      t.id === id ? {...t, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500'} : t
    ));
    agregarLog(`Thread ${id}: ✅ Terminado`, 'text-green-400');
  };

  const ejecutarDemo = async () => {
    stopRef.current = false;
    pausaRef.current = false;
    setEjecutando(true);
    setPausado(false);
    setContador(0);
    setLogs([]);
    
    // Inicializar threads
    const threads: ThreadState[] = Array.from({length: numThreads}, (_, i) => ({
      id: i + 1,
      estado: 'Iniciando',
      color: 'bg-blue-600',
      colorText: 'text-blue-400'
    }));
    setThreadStates(threads);

    const expectedValue = numThreads * 3;
    agregarLog(`🚀 Iniciando demostración: ${getSolucionNombre()}`, 'text-cyan-400');
    agregarLog(`📊 Configuración: ${numThreads} threads, ${numRecursos} recursos`, 'text-gray-400');
    agregarLog(`🎯 Objetivo: Incrementar contador ${expectedValue} veces (3 por thread)`, 'text-gray-400');
    agregarLog('─'.repeat(50), 'text-gray-600');

    const threadPromises: Promise<void>[] = [];

    switch (solucion) {
      case 'sin-proteccion': {
        // Sin protección - concurrente
        for (let i = 1; i <= numThreads; i++) {
          threadPromises.push(simularSinProteccion(i));
        }
        await Promise.all(threadPromises);
        break;
      }

      case 'mutex': {
        // Con Mutex - cola de espera
        const mutexQueue = Array.from({length: numThreads}, (_, i) => i + 1);
        for (let i = 1; i <= numThreads; i++) {
          threadPromises.push(simularConMutex(i, mutexQueue));
        }
        await Promise.all(threadPromises);
        break;
      }

      case 'semaforo': {
        // Con Semáforo
        const semaforo = { valor: numRecursos, cola: [] };
        for (let i = 1; i <= numThreads; i++) {
          threadPromises.push(simularConSemaforo(i, semaforo));
        }
        await Promise.all(threadPromises);
        break;
      }

      case 'atomica': {
        // Con Variables Atómicas
        for (let i = 1; i <= numThreads; i++) {
          threadPromises.push(simularConAtomica(i));
        }
        await Promise.all(threadPromises);
        break;
      }

      case 'monitor': {
        // Con Monitor
        const monitor = { ocupado: false, cola: [] };
        for (let i = 1; i <= numThreads; i++) {
          threadPromises.push(simularConMonitor(i, monitor));
        }
        await Promise.all(threadPromises);
        break;
      }

      case 'rwlock': {
        // Con Read-Write Lock
        const rwlock = { lectores: 0, escritor: false };
        for (let i = 1; i <= numThreads; i++) {
          threadPromises.push(simularConRWLock(i, rwlock));
        }
        await Promise.all(threadPromises);
        break;
      }
    }

    if (!stopRef.current) {
      agregarLog('─'.repeat(50), 'text-gray-600');
      agregarLog(`🏁 Resultado final: ${contador}`, 'text-cyan-400');
      if (contador === expectedValue) {
        agregarLog(`✅ ¡Correcto! Se alcanzó el valor esperado (${expectedValue})`, 'text-green-400');
      } else {
        agregarLog(`❌ Race condition detectada! Esperado: ${expectedValue}, Obtenido: ${contador}`, 'text-red-400');
      }
    }

    setEjecutando(false);
    setPausado(false);
  };

  const togglePausa = () => {
    pausaRef.current = !pausaRef.current;
    setPausado(!pausado);
    if (pausaRef.current) {
      agregarLog('⏸️ Demostración pausada', 'text-yellow-400');
    } else {
      agregarLog('▶️ Demostración reanudada', 'text-green-400');
    }
  };

  const reiniciar = () => {
    stopRef.current = true;
    pausaRef.current = false;
    setEjecutando(false);
    setPausado(false);
    setContador(0);
    setLogs([]);
    setThreadStates(Array.from({length: numThreads}, (_, i) => ({
      id: i + 1,
      estado: 'Esperando',
      color: 'bg-gray-600',
      colorText: 'text-gray-400'
    })));
  };

  const getSolucionNombre = () => {
    const nombres: Record<string, string> = {
      'sin-proteccion': 'Sin Protección',
      'mutex': 'Mutex',
      'semaforo': 'Semáforo',
      'atomica': 'Variable Atómica',
      'monitor': 'Monitor',
      'rwlock': 'Read-Write Lock'
    };
    return nombres[solucion] || solucion;
  };

  const cambiarNumThreads = (delta: number) => {
    const nuevo = Math.max(3, Math.min(10, numThreads + delta));
    setNumThreads(nuevo);
    if (!ejecutando) {
      setThreadStates(Array.from({length: nuevo}, (_, i) => ({
        id: i + 1,
        estado: 'Esperando',
        color: 'bg-gray-600',
        colorText: 'text-gray-400'
      })));
    }
  };

  const cambiarNumRecursos = (delta: number) => {
    const nuevo = Math.max(1, Math.min(20, numRecursos + delta));
    setNumRecursos(nuevo);
  };

  return (
    <div className="space-y-6">
      {/* Configuración */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">⚙️ Configuración de la Simulación</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Número de Threads */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de Threads
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarNumThreads(-1)}
                disabled={ejecutando || numThreads <= 3}
                className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded"
              >
                <Minus className="size-4" />
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-white">{numThreads}</div>
                <div className="text-xs text-gray-400">Min: 3, Max: 10</div>
              </div>
              <button
                onClick={() => cambiarNumThreads(1)}
                disabled={ejecutando || numThreads >= 10}
                className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Velocidad */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Velocidad de Simulación
            </label>
            <div className="space-y-2">
              <Slider
                value={velocidad}
                onValueChange={setVelocidad}
                max={100}
                step={1}
                disabled={ejecutando}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Lenta</span>
                <span className="font-bold text-white">{velocidad[0]}%</span>
                <span>Rápida</span>
              </div>
            </div>
          </div>

          {/* Número de Recursos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recursos Compartidos
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarNumRecursos(-1)}
                disabled={ejecutando || numRecursos <= 1}
                className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded"
              >
                <Minus className="size-4" />
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-white">{numRecursos}</div>
                <div className="text-xs text-gray-400">Min: 1, Max: 20</div>
              </div>
              <button
                onClick={() => cambiarNumRecursos(1)}
                disabled={ejecutando || numRecursos >= 20}
                className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Soluciones */}
      <Tabs value={solucion} onValueChange={setSolucion} className="w-full">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-gray-900 p-2">
          <TabsTrigger value="sin-proteccion">❌ Sin Protección</TabsTrigger>
          <TabsTrigger value="mutex">🔒 Mutex</TabsTrigger>
          <TabsTrigger value="semaforo">🔢 Semáforo</TabsTrigger>
          <TabsTrigger value="atomica">⚛️ Atómica</TabsTrigger>
          <TabsTrigger value="monitor">🏛️ Monitor</TabsTrigger>
          <TabsTrigger value="rwlock">📖 RW Lock</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          {/* Controles */}
          <div className="flex gap-3">
            <button
              onClick={ejecutarDemo}
              disabled={ejecutando && !pausado}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Play className="size-5" />
              {ejecutando && pausado ? 'Continuar Demostración' : 'Ejecutar Demostración'}
            </button>
            
            {ejecutando && (
              <button
                onClick={togglePausa}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Pause className="size-5" />
                {pausado ? 'Reanudar' : 'Pausar'}
              </button>
            )}
            
            <button
              onClick={reiniciar}
              disabled={!ejecutando && logs.length === 0}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw className="size-5" />
              Reiniciar
            </button>
          </div>

          {/* Visualización */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Estados de Threads */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Estado de Threads</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {threadStates.map(thread => (
                  <div key={thread.id} className="flex items-center gap-3">
                    <div className={`size-3 rounded-full ${thread.color} animate-pulse flex-shrink-0`}></div>
                    <span className="text-white font-mono text-sm w-20">Thread {thread.id}:</span>
                    <span className={`${thread.colorText} text-sm`}>{thread.estado}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Contador Compartido</div>
                  <div className="text-5xl font-bold text-white font-mono">{contador}</div>
                  <div className="text-sm text-gray-400 mt-1">Esperado: {numThreads * 3}</div>
                </div>
              </div>
            </div>

            {/* Logs de Ejecución */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Logs de Ejecución</h3>
              <div 
                ref={logsContainerRef}
                onScroll={handleScroll}
                className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm"
              >
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center mt-8">
                    Configura los parámetros y presiona "Ejecutar" para comenzar
                  </div>
                ) : (
                  <>
                    {logs.map((log, idx) => (
                      <div key={idx} className={`${log.color} mb-1`}>{log.mensaje}</div>
                    ))}
                    <div ref={logsEndRef} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Explicación de la solución actual */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
            {solucion === 'sin-proteccion' && (
              <>
                <h4 className="font-bold text-blue-200 mb-2">❌ Sin Protección</h4>
                <p className="text-sm text-blue-100">
                  Los threads acceden al contador simultáneamente sin sincronización. Esto causa race conditions donde 
                  múltiples threads leen el mismo valor antes de incrementar, resultando en incrementos perdidos.
                  El resultado final será menor al esperado en la mayoría de las ejecuciones.
                </p>
              </>
            )}
            {solucion === 'mutex' && (
              <>
                <h4 className="font-bold text-blue-200 mb-2">🔒 Mutex (Mutual Exclusion)</h4>
                <p className="text-sm text-blue-100">
                  Un mutex protege la sección crítica garantizando que solo un thread pueda incrementar el contador a la vez.
                  Los threads se organizan en una cola y esperan su turno, eliminando completamente las race conditions.
                  El resultado siempre será exacto.
                </p>
              </>
            )}
            {solucion === 'semaforo' && (
              <>
                <h4 className="font-bold text-blue-200 mb-2">🔢 Semáforo</h4>
                <p className="text-sm text-blue-100">
                  Un semáforo controla el acceso mediante un contador. Permite que múltiples threads (hasta el límite del semáforo)
                  accedan simultáneamente al recurso. Usa operaciones wait(S) para decrementar y signal(S) para incrementar.
                  Ideal cuando hay múltiples recursos disponibles.
                </p>
              </>
            )}
            {solucion === 'atomica' && (
              <>
                <h4 className="font-bold text-blue-200 mb-2">⚛️ Variable Atómica</h4>
                <p className="text-sm text-blue-100">
                  Las operaciones atómicas garantizan que el incremento se realiza como una unidad indivisible a nivel de hardware.
                  Usa instrucciones especiales del procesador (como Compare-And-Swap) sin necesidad de locks explícitos.
                  Es la solución más eficiente y rápida. El resultado siempre es exacto.
                </p>
              </>
            )}
            {solucion === 'monitor' && (
              <>
                <h4 className="font-bold text-blue-200 mb-2">🏛️ Monitor</h4>
                <p className="text-sm text-blue-100">
                  Un monitor encapsula datos y métodos con sincronización automática. Solo un thread puede estar activo
                  dentro del monitor a la vez. La sincronización es implícita, reduciendo errores de programación.
                  Común en lenguajes orientados a objetos como Java (synchronized).
                </p>
              </>
            )}
            {solucion === 'rwlock' && (
              <>
                <h4 className="font-bold text-blue-200 mb-2">📖 Read-Write Lock</h4>
                <p className="text-sm text-blue-100">
                  Permite múltiples lectores simultáneos pero escritura exclusiva. Los threads lectores (📖) pueden acceder
                  al mismo tiempo, mientras que los escritores (📝) requieren acceso exclusivo. Optimiza escenarios donde
                  las lecturas son más frecuentes que las escrituras.
                </p>
              </>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
