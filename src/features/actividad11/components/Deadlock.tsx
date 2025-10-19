import { AlertTriangle, BookOpen, Code, Play, RotateCcw, Pause, Minus, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function Deadlock() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl">🔒</div>
            <div>
              <h1 className="text-4xl font-bold text-white">Deadlock</h1>
              <p className="text-gray-400 text-sm mt-1">Interbloqueo / Abrazo Mortal</p>
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
            Un <strong className="text-red-600">deadlock</strong> (interbloqueo) ocurre cuando un conjunto de procesos está 
            esperando por recursos que están siendo retenidos por otros procesos del mismo conjunto. Ningún proceso puede 
            continuar porque cada uno está esperando que otro libere un recurso.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Condiciones de Coffman</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Para que ocurra un deadlock, deben cumplirse simultáneamente estas 4 condiciones:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li><strong>1. Exclusión Mutua:</strong> Al menos un recurso debe estar en modo no compartible</li>
                  <li><strong>2. Hold and Wait:</strong> Un proceso retiene al menos un recurso y espera por otro</li>
                  <li><strong>3. No Preemption:</strong> Los recursos no pueden ser arrebatados, solo liberados voluntariamente</li>
                  <li><strong>4. Espera Circular:</strong> Existe una cadena circular de procesos esperando recursos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>💡 Estrategias:</strong> Para prevenir deadlocks podemos romper una o más de las condiciones de Coffman,
              detectar y recuperarnos del deadlock, o simplemente ignorarlo (algoritmo del avestruz).
            </p>
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
              <Tabs defaultValue="ordenar" className="w-full">
                <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-gray-900 p-2">
                  <TabsTrigger value="ordenar">Ordenar Recursos</TabsTrigger>
                  <TabsTrigger value="todos">Adquirir Todos</TabsTrigger>
                  <TabsTrigger value="timeout">Timeouts</TabsTrigger>
                  <TabsTrigger value="banquero">Algoritmo del Banquero</TabsTrigger>
                  <TabsTrigger value="grafo">Análisis de Grafos</TabsTrigger>
                  <TabsTrigger value="ciclos">Detectar Ciclos</TabsTrigger>
                  <TabsTrigger value="abortar">Abortar Procesos</TabsTrigger>
                  <TabsTrigger value="rollback">Rollback</TabsTrigger>
                </TabsList>

                {/* Solución 1: Ordenar Recursos */}
                <TabsContent value="ordenar" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Ordenar la Adquisición de Recursos</h3>
                    <p className="text-gray-300">
                      Establece un orden global para adquirir recursos. Todos los procesos deben solicitar recursos
                      en el mismo orden, rompiendo la condición de espera circular.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Orden Global de Recursos

// Definir orden de recursos (IDs únicos)
RECURSOS:
    R1 = 1  // Base de datos
    R2 = 2  // Archivo de log
    R3 = 3  // Buffer de red
    R4 = 4  // Impresora

PROCEDIMIENTO adquirir_recursos_ordenados(ids_recursos[]):
    // IMPORTANTE: Ordenar IDs antes de adquirir
    ids_ordenados = ORDENAR(ids_recursos)
    recursos_adquiridos = []
    
    PARA CADA id EN ids_ordenados:
        recurso = ADQUIRIR_LOCK(id)
        AGREGAR(recursos_adquiridos, recurso)
    FIN PARA
    
    RETORNAR recursos_adquiridos
FIN PROCEDIMIENTO

PROCEDIMIENTO liberar_recursos(recursos[]):
    // Liberar en orden inverso (opcional pero recomendado)
    PARA CADA recurso EN REVERSA(recursos):
        LIBERAR_LOCK(recurso)
    FIN PARA
FIN PROCEDIMIENTO

// Ejemplo: Dos procesos que necesitan mismos recursos
PROCEDIMIENTO proceso_A():
    // Necesita R2 y R4, pero los ordena primero
    recursos = adquirir_recursos_ordenados([R4, R2])  // Se ordena a [R2, R4]
    
    // Sección crítica
    USAR(recursos)
    
    liberar_recursos(recursos)
FIN PROCEDIMIENTO

PROCEDIMIENTO proceso_B():
    // También necesita R2 y R4
    recursos = adquirir_recursos_ordenados([R2, R4])  // Ya ordenados
    
    // Sección crítica
    USAR(recursos)
    
    liberar_recursos(recursos)
FIN PROCEDIMIENTO

// Sin ordenamiento: posible deadlock
// A adquiere R4, B adquiere R2
// A espera R2, B espera R4 -> DEADLOCK

// Con ordenamiento: sin deadlock
// Ambos intentan R2 primero, uno espera, no hay ciclo`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Prevención garantizada, simple de implementar, sin overhead en runtime.<br />
                        <strong>⚠️ Desventajas:</strong> Requiere conocer todos los recursos por adelantado, puede reducir concurrencia.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 2: Adquirir Todos */}
                <TabsContent value="todos" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Adquirir Todos los Recursos de Una Vez</h3>
                    <p className="text-gray-300">
                      Un proceso debe adquirir todos los recursos que necesita de forma atómica antes de comenzar,
                      o no adquirir ninguno. Rompe la condición de "hold and wait".
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Adquisición Atómica

COMPARTIDO lock_global = NuevoMutex()

PROCEDIMIENTO adquirir_todos_o_ninguno(recursos_requeridos[]):
    recursos_obtenidos = []
    exito = FALSO
    
    // Usar lock global para hacer la adquisición atómica
    lock_global.adquirir()
    
    INTENTAR:
        // Intentar adquirir todos
        PARA CADA recurso EN recursos_requeridos:
            SI recurso.esta_disponible():
                recurso.adquirir()
                AGREGAR(recursos_obtenidos, recurso)
            SINO:
                // Si alguno no está disponible, abortar
                IR_A liberar_y_fallar
            FIN SI
        FIN PARA
        
        exito = VERDADERO
        
    liberar_y_fallar:
        SI NO exito:
            // Liberar todo lo adquirido
            PARA CADA recurso EN recursos_obtenidos:
                recurso.liberar()
            FIN PARA
            recursos_obtenidos = []
        FIN SI
        
    FINALMENTE:
        lock_global.liberar()
    FIN INTENTAR
    
    RETORNAR recursos_obtenidos
FIN PROCEDIMIENTO

PROCEDIMIENTO proceso_con_retry():
    recursos_necesarios = [R1, R2, R3]
    recursos = []
    
    // Reintentar hasta obtener todos
    MIENTRAS VERDADERO:
        recursos = adquirir_todos_o_ninguno(recursos_necesarios)
        
        SI recursos.tamaño() > 0:
            SALIR  // Éxito, tenemos todos los recursos
        SINO:
            DORMIR(tiempo_aleatorio())  // Esperar antes de reintentar
        FIN SI
    FIN MIENTRAS
    
    // Usar recursos
    TRABAJAR_CON(recursos)
    
    // Liberar todos
    PARA CADA recurso EN recursos:
        recurso.liberar()
    FIN PARA
FIN PROCEDIMIENTO

// Variante sin lock global (usando banderas)
PROCEDIMIENTO adquirir_no_bloqueante(recursos[]):
    PARA CADA recurso EN recursos:
        SI NO recurso.try_lock():  // Intento no bloqueante
            // Liberar lo ya adquirido
            liberar_adquiridos_hasta_ahora()
            RETORNAR FALSO
        FIN SI
    FIN PARA
    RETORNAR VERDADERO
FIN PROCEDIMIENTO`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Previene deadlock completamente, fácil de razonar.<br />
                        <strong>⚠️ Desventajas:</strong> Puede causar starvation, reduce concurrencia, desperdicio si solo necesita algunos recursos.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 3: Timeouts */}
                <TabsContent value="timeout" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Implementar Timeouts</h3>
                    <p className="text-gray-300">
                      Los procesos intentan adquirir recursos con un tiempo límite. Si expira el timeout,
                      liberan todos los recursos y reintentan, rompiendo el deadlock potencial.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Timeouts para Prevenir Deadlock

CONSTANTE TIMEOUT_MS = 5000  // 5 segundos
CONSTANTE MAX_REINTENTOS = 3

PROCEDIMIENTO adquirir_con_timeout(recurso, timeout_ms):
    tiempo_inicio = TIEMPO_ACTUAL()
    
    MIENTRAS (TIEMPO_ACTUAL() - tiempo_inicio) < timeout_ms:
        SI recurso.try_lock():
            RETORNAR VERDADERO  // Éxito
        FIN SI
        
        DORMIR(10)  // Esperar un poco antes de reintentar
    FIN MIENTRAS
    
    RETORNAR FALSO  // Timeout expiró
FIN PROCEDIMIENTO

PROCEDIMIENTO proceso_con_timeout():
    recursos_adquiridos = []
    recursos_necesarios = [R1, R2, R3]
    intentos = 0
    
    MIENTRAS intentos < MAX_REINTENTOS:
        exito = VERDADERO
        
        // Intentar adquirir cada recurso con timeout
        PARA CADA recurso EN recursos_necesarios:
            SI adquirir_con_timeout(recurso, TIMEOUT_MS):
                AGREGAR(recursos_adquiridos, recurso)
            SINO:
                // Timeout: liberar todo y reintentar
                IMPRIMIR "Timeout al adquirir", recurso.id, "- Reintentando..."
                exito = FALSO
                SALIR_DEL_BUCLE
            FIN SI
        FIN PARA
        
        SI exito:
            // Tenemos todos los recursos
            TRABAJAR()
            
            // Liberar recursos
            PARA CADA recurso EN recursos_adquiridos:
                recurso.liberar()
            FIN PARA
            
            RETORNAR VERDADERO
        SINO:
            // Falló: liberar parciales
            PARA CADA recurso EN recursos_adquiridos:
                recurso.liberar()
            FIN PARA
            recursos_adquiridos = []
            
            // Backoff exponencial
            tiempo_espera = POTENCIA(2, intentos) * 100
            DORMIR(tiempo_espera + ALEATORIO(0, 100))
            
            intentos = intentos + 1
        FIN SI
    FIN MIENTRAS
    
    IMPRIMIR "ERROR: No se pudieron adquirir recursos tras", MAX_REINTENTOS, "intentos"
    RETORNAR FALSO
FIN PROCEDIMIENTO

// Variante con try_lock_for (C++/Java)
PROCEDIMIENTO ejemplo_moderno():
    mutex1 = NuevoMutex()
    mutex2 = NuevoMutex()
    
    SI mutex1.try_lock_for(2.segundos()):
        SI mutex2.try_lock_for(2.segundos()):
            // Ambos adquiridos
            TRABAJAR()
            mutex2.unlock()
        SINO:
            IMPRIMIR "Timeout en mutex2"
        FIN SI
        mutex1.unlock()
    SINO:
        IMPRIMIR "Timeout en mutex1"
    FIN SI
FIN PROCEDIMIENTO`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Flexible, permite recuperación automática, útil en sistemas distribuidos.<br />
                        <strong>⚠️ Desventajas:</strong> No garantiza prevención, overhead de reinicios, difícil elegir timeout correcto.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 4: Algoritmo del Banquero */}
                <TabsContent value="banquero" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Algoritmo del Banquero (Dijkstra)</h3>
                    <p className="text-gray-300">
                      Verifica que cada asignación de recursos deje al sistema en un estado seguro.
                      Un estado es seguro si existe al menos una secuencia de ejecución donde todos los procesos pueden terminar.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Algoritmo del Banquero

ESTRUCTURA EstadoSistema:
    disponible[]        // Recursos disponibles
    maximo[][]          // Máximo que necesita cada proceso
    asignacion[][]      // Recursos ya asignados
    necesidad[][]       // Recursos que aún necesita (maximo - asignacion)
FIN ESTRUCTURA

FUNCION es_estado_seguro(estado):
    trabajo = COPIAR(estado.disponible)
    terminado[] = [FALSO, FALSO, ..., FALSO]  // Para cada proceso
    secuencia_segura = []
    
    // Intentar encontrar secuencia donde todos terminan
    REPETIR:
        encontro_proceso = FALSO
        
        PARA i = 0 HASTA num_procesos - 1:
            SI NO terminado[i]:
                // Verificar si puede ejecutar con recursos disponibles
                puede_ejecutar = VERDADERO
                
                PARA j = 0 HASTA num_recursos - 1:
                    SI estado.necesidad[i][j] > trabajo[j]:
                        puede_ejecutar = FALSO
                        SALIR
                    FIN SI
                FIN PARA
                
                SI puede_ejecutar:
                    // Simular que el proceso termina y libera recursos
                    PARA j = 0 HASTA num_recursos - 1:
                        trabajo[j] = trabajo[j] + estado.asignacion[i][j]
                    FIN PARA
                    
                    terminado[i] = VERDADERO
                    AGREGAR(secuencia_segura, i)
                    encontro_proceso = VERDADERO
                FIN SI
            FIN SI
        FIN PARA
        
    HASTA QUE NO encontro_proceso O TODOS(terminado)
    
    SI TODOS(terminado):
        IMPRIMIR "Estado seguro. Secuencia:", secuencia_segura
        RETORNAR VERDADERO
    SINO:
        IMPRIMIR "Estado INSEGURO - posible deadlock"
        RETORNAR FALSO
    FIN SI
FIN FUNCION

FUNCION solicitar_recursos(proceso_id, solicitud[]):
    // 1. Verificar que no exceda necesidad
    PARA i = 0 HASTA num_recursos - 1:
        SI solicitud[i] > estado.necesidad[proceso_id][i]:
            ERROR "Proceso excede su máximo declarado"
        FIN SI
    FIN PARA
    
    // 2. Verificar disponibilidad
    PARA i = 0 HASTA num_recursos - 1:
        SI solicitud[i] > estado.disponible[i]:
            RETORNAR FALSO  // Esperar
        FIN SI
    FIN PARA
    
    // 3. Simular asignación
    estado_temporal = COPIAR(estado)
    PARA i = 0 HASTA num_recursos - 1:
        estado_temporal.disponible[i] -= solicitud[i]
        estado_temporal.asignacion[proceso_id][i] += solicitud[i]
        estado_temporal.necesidad[proceso_id][i] -= solicitud[i]
    FIN PARA
    
    // 4. Verificar si es seguro
    SI es_estado_seguro(estado_temporal):
        // Aplicar cambios reales
        estado = estado_temporal
        IMPRIMIR "Solicitud concedida - Estado seguro"
        RETORNAR VERDADERO
    SINO:
        IMPRIMIR "Solicitud rechazada - Estado inseguro"
        RETORNAR FALSO  // Proceso debe esperar
    FIN SI
FIN FUNCION

// Ejemplo de uso
INICIALIZAR:
    procesos = 5
    recursos = 3
    
    disponible = [10, 5, 7]
    
    maximo = [
        [7, 5, 3],   // P0
        [3, 2, 2],   // P1
        [9, 0, 2],   // P2
        [2, 2, 2],   // P3
        [4, 3, 3]    // P4
    ]
    
    asignacion = [
        [0, 1, 0],
        [2, 0, 0],
        [3, 0, 2],
        [2, 1, 1],
        [0, 0, 2]
    ]

VERIFICAR es_estado_seguro(estado_inicial)`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Garantiza prevención, permite alta utilización de recursos.<br />
                        <strong>⚠️ Desventajas:</strong> Requiere conocer máximo por adelantado, overhead computacional O(n²m), poco práctico en sistemas dinámicos.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 5: Análisis de Grafos */}
                <TabsContent value="grafo" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Análisis de Grafos de Asignación de Recursos</h3>
                    <p className="text-gray-300">
                      Representa el sistema como un grafo dirigido donde los procesos y recursos son nodos.
                      Las aristas representan asignaciones (recurso→proceso) y solicitudes (proceso→recurso).
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Grafo de Asignación de Recursos (RAG)

ESTRUCTURA Nodo:
    id: entero
    tipo: "PROCESO" | "RECURSO"
    instancias: entero  // Para recursos (cuántas instancias tiene)
FIN ESTRUCTURA

ESTRUCTURA Arista:
    desde: Nodo
    hacia: Nodo
    tipo: "SOLICITUD" | "ASIGNACION"
FIN ESTRUCTURA

ESTRUCTURA GrafoRAG:
    nodos: Lista<Nodo>
    aristas: Lista<Arista>
FIN ESTRUCTURA

// Agregar arista de solicitud: Proceso → Recurso
PROCEDIMIENTO solicitar(grafo, proceso, recurso):
    arista = NuevaArista(proceso, recurso, "SOLICITUD")
    AGREGAR(grafo.aristas, arista)
    
    // Verificar si causa ciclo
    SI detectar_ciclo(grafo):
        IMPRIMIR "⚠️ Advertencia: Ciclo detectado - posible deadlock"
    FIN SI
FIN PROCEDIMIENTO

// Agregar arista de asignación: Recurso → Proceso
PROCEDIMIENTO asignar(grafo, recurso, proceso):
    // Eliminar solicitud correspondiente
    ELIMINAR_ARISTA(proceso, recurso, "SOLICITUD")
    
    // Agregar asignación
    arista = NuevaArista(recurso, proceso, "ASIGNACION")
    AGREGAR(grafo.aristas, arista)
FIN PROCEDIMIENTO

// Liberar recurso
PROCEDIMIENTO liberar(grafo, proceso, recurso):
    ELIMINAR_ARISTA(recurso, proceso, "ASIGNACION")
FIN PROCEDIMIENTO

// Detectar ciclos usando DFS
FUNCION detectar_ciclo(grafo):
    visitado = {}
    en_pila = {}
    
    PARA CADA nodo EN grafo.nodos:
        visitado[nodo] = FALSO
        en_pila[nodo] = FALSO
    FIN PARA
    
    PARA CADA nodo EN grafo.nodos:
        SI dfs_tiene_ciclo(nodo, grafo, visitado, en_pila):
            RETORNAR VERDADERO
        FIN SI
    FIN PARA
    
    RETORNAR FALSO
FIN FUNCION

FUNCION dfs_tiene_ciclo(nodo, grafo, visitado, en_pila):
    visitado[nodo] = VERDADERO
    en_pila[nodo] = VERDADERO
    
    // Obtener vecinos (aristas salientes)
    PARA CADA arista EN grafo.aristas:
        SI arista.desde == nodo:
            vecino = arista.hacia
            
            SI NO visitado[vecino]:
                SI dfs_tiene_ciclo(vecino, grafo, visitado, en_pila):
                    RETORNAR VERDADERO
                FIN SI
            SINO SI en_pila[vecino]:
                // Encontramos un ciclo
                RETORNAR VERDADERO
            FIN SI
        FIN SI
    FIN PARA
    
    en_pila[nodo] = FALSO
    RETORNAR FALSO
FIN FUNCION

// Análisis para recursos de una sola instancia
FUNCION deadlock_en_recurso_unico(grafo):
    // Si hay ciclo, hay deadlock (recursos de 1 instancia)
    SI detectar_ciclo(grafo):
        ciclo = encontrar_ciclo(grafo)
        IMPRIMIR "DEADLOCK detectado en ciclo:", ciclo
        RETORNAR VERDADERO
    FIN SI
    RETORNAR FALSO
FIN FUNCION

// Análisis para recursos de múltiples instancias
FUNCION deadlock_en_recurso_multiple(grafo):
    // Ciclo es condición necesaria pero no suficiente
    // Usar reducción de grafo
    
    procesos_sin_espera = encontrar_procesos_que_pueden_terminar(grafo)
    
    MIENTRAS procesos_sin_espera NO_ESTA_VACIO:
        proceso = SACAR(procesos_sin_espera)
        
        // Simular que el proceso termina y libera recursos
        liberar_todos_recursos(proceso, grafo)
        
        // Ver si ahora otros procesos pueden continuar
        nuevos = encontrar_procesos_que_pueden_terminar(grafo)
        AGREGAR_TODOS(procesos_sin_espera, nuevos)
    FIN MIENTRAS
    
    // Si quedan procesos, hay deadlock
    SI grafo_tiene_aristas():
        IMPRIMIR "DEADLOCK: Procesos bloqueados restantes"
        RETORNAR VERDADERO
    FIN SI
    
    RETORNAR FALSO
FIN FUNCION

// Ejemplo de uso
grafo = NuevoGrafoRAG()

// Crear nodos
P1 = NuevoNodo(1, "PROCESO")
P2 = NuevoNodo(2, "PROCESO")
R1 = NuevoNodo(1, "RECURSO", instancias=1)
R2 = NuevoNodo(2, "RECURSO", instancias=1)

// Escenario de deadlock
asignar(grafo, R1, P1)      // P1 tiene R1
solicitar(grafo, P1, R2)    // P1 quiere R2
asignar(grafo, R2, P2)      // P2 tiene R2
solicitar(grafo, P2, R1)    // P2 quiere R1

// Detectar
SI deadlock_en_recurso_unico(grafo):
    IMPRIMIR "Ciclo: P1 → R2 → P2 → R1 → P1"
FIN SI`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Visualización clara, detección precisa, útil para debugging.<br />
                        <strong>⚠️ Desventajas:</strong> Overhead de mantener grafo, O(n) para detectar ciclos, solo detecta, no previene.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 6: Detectar Ciclos */}
                <TabsContent value="ciclos" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Detectar Ciclos en Grafo de Espera</h3>
                    <p className="text-gray-300">
                      Algoritmo más ligero que mantiene solo las relaciones de espera entre procesos (wait-for graph).
                      Ejecuta periódicamente para detectar deadlocks.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Wait-For Graph (Grafo de Espera)

// Estructura simplificada: solo procesos (no recursos)
ESTRUCTURA GrafoEspera:
    // Matriz de adyacencia: espera[i][j] = VERDADERO si Pi espera por Pj
    espera: matriz_booleana[n][n]
    procesos: conjunto_de_procesos
FIN ESTRUCTURA

// Agregar relación de espera
PROCEDIMIENTO proceso_espera_a(grafo, pi, pj):
    grafo.espera[pi][pj] = VERDADERO
    IMPRIMIR "P", pi, "ahora espera a P", pj
FIN PROCEDIMIENTO

// Eliminar relación (cuando recurso se libera)
PROCEDIMIENTO proceso_deja_esperar(grafo, pi, pj):
    grafo.espera[pi][pj] = FALSO
FIN PROCEDIMIENTO

// Detección de ciclos usando DFS
FUNCION detectar_ciclo_dfs(grafo):
    n = grafo.procesos.tamaño()
    visitado = ARREGLO_FALSO(n)
    en_camino = ARREGLO_FALSO(n)
    ciclo_encontrado = []
    
    PARA i = 0 HASTA n-1:
        SI NO visitado[i]:
            SI dfs_ciclo(i, grafo, visitado, en_camino, ciclo_encontrado):
                RETORNAR ciclo_encontrado
            FIN SI
        FIN SI
    FIN PARA
    
    RETORNAR []  // Sin ciclo
FIN FUNCION

FUNCION dfs_ciclo(nodo, grafo, visitado, en_camino, ruta):
    visitado[nodo] = VERDADERO
    en_camino[nodo] = VERDADERO
    AGREGAR(ruta, nodo)
    
    // Explorar vecinos (procesos que espera este)
    PARA vecino = 0 HASTA grafo.procesos.tamaño() - 1:
        SI grafo.espera[nodo][vecino]:  // Hay arista
            SI NO visitado[vecino]:
                SI dfs_ciclo(vecino, grafo, visitado, en_camino, ruta):
                    RETORNAR VERDADERO
                FIN SI
            SINO SI en_camino[vecino]:
                // Ciclo detectado
                AGREGAR(ruta, vecino)  // Completar el ciclo
                RETORNAR VERDADERO
            FIN SI
        FIN SI
    FIN PARA
    
    en_camino[nodo] = FALSO
    ELIMINAR_ULTIMO(ruta)
    RETORNAR FALSO
FIN FUNCION

// Detección usando algoritmo de Floyd (más eficiente para grafos densos)
FUNCION detectar_ciclo_floyd(grafo):
    n = grafo.procesos.tamaño()
    alcanzable = COPIAR(grafo.espera)  // Matriz de alcanzabilidad
    
    // Floyd-Warshall modificado
    PARA k = 0 HASTA n-1:
        PARA i = 0 HASTA n-1:
            PARA j = 0 HASTA n-1:
                alcanzable[i][j] = alcanzable[i][j] O 
                                   (alcanzable[i][k] Y alcanzable[k][j])
            FIN PARA
        FIN PARA
    FIN PARA
    
    // Verificar diagonal (si Pi puede alcanzarse a sí mismo, hay ciclo)
    procesos_en_ciclo = []
    PARA i = 0 HASTA n-1:
        SI alcanzable[i][i]:
            AGREGAR(procesos_en_ciclo, i)
        FIN SI
    FIN PARA
    
    SI procesos_en_ciclo NO_ESTA_VACIO:
        IMPRIMIR "Deadlock: Procesos", procesos_en_ciclo, "en ciclo"
        RETORNAR procesos_en_ciclo
    FIN SI
    
    RETORNAR []
FIN FUNCION

// Detector periódico de deadlock
PROCEDIMIENTO detector_periodico(grafo, intervalo_ms):
    MIENTRAS VERDADERO:
        DORMIR(intervalo_ms)
        
        ciclo = detectar_ciclo_dfs(grafo)
        
        SI ciclo NO_ESTA_VACIO:
            IMPRIMIR "🚨 DEADLOCK DETECTADO 🚨"
            IMPRIMIR "Ciclo de espera:", ciclo
            
            // Invocar recuperación
            recuperar_de_deadlock(ciclo)
        SINO:
            IMPRIMIR "✅ Sistema sin deadlock"
        FIN SI
    FIN MIENTRAS
FIN PROCEDIMIENTO

// Construcción del grafo desde asignaciones
PROCEDIMIENTO construir_grafo_espera(asignaciones, solicitudes):
    grafo = NuevoGrafoEspera()
    
    // Para cada proceso que solicita un recurso
    PARA CADA (proceso, recurso) EN solicitudes:
        // Encontrar quién tiene ese recurso
        propietario = asignaciones[recurso]
        
        SI propietario EXISTE:
            // proceso espera a propietario
            proceso_espera_a(grafo, proceso, propietario)
        FIN SI
    FIN PARA
    
    RETORNAR grafo
FIN PROCEDIMIENTO

// Ejemplo de uso
grafo = NuevoGrafoEspera(4)  // 4 procesos

// P0 espera a P1, P1 espera a P2, P2 espera a P0 (ciclo)
proceso_espera_a(grafo, 0, 1)
proceso_espera_a(grafo, 1, 2)
proceso_espera_a(grafo, 2, 0)

ciclo = detectar_ciclo_dfs(grafo)
SI ciclo EXISTE:
    IMPRIMIR "Deadlock en:", ciclo  // [0, 1, 2, 0]
FIN SI`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Más eficiente que RAG completo, O(n²) con Floyd, detección precisa.<br />
                        <strong>⚠️ Desventajas:</strong> Solo detecta (no previene), overhead de ejecución periódica, requiere recuperación manual.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 7: Abortar Procesos */}
                <TabsContent value="abortar" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Abortar Procesos</h3>
                    <p className="text-gray-300">
                      Una vez detectado el deadlock, se abortan uno o más procesos para romper el ciclo.
                      Se usan heurísticas para minimizar el costo de abortar.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Recuperación por Aborto de Procesos

ESTRUCTURA InfoProceso:
    id: entero
    prioridad: entero
    tiempo_ejecucion: entero
    recursos_retenidos: conjunto<Recurso>
    costo_abortar: real  // Cálculo del daño de abortar
FIN ESTRUCTURA

// Estrategia 1: Abortar todos los procesos en deadlock
PROCEDIMIENTO abortar_todos(procesos_en_deadlock):
    IMPRIMIR "🔴 Abortando TODOS los procesos en deadlock"
    
    PARA CADA proceso EN procesos_en_deadlock:
        IMPRIMIR "Abortando proceso", proceso.id
        
        // Liberar recursos
        PARA CADA recurso EN proceso.recursos_retenidos:
            liberar_recurso(recurso)
        FIN PARA
        
        // Terminar proceso
        terminar_proceso(proceso)
        
        // Rollback opcional
        restaurar_checkpoint(proceso)
    FIN PARA
    
    IMPRIMIR "Deadlock resuelto - Todos los procesos abortados"
FIN PROCEDIMIENTO

// Estrategia 2: Abortar de a uno hasta romper el ciclo
PROCEDIMIENTO abortar_minimo(grafo_deadlock):
    IMPRIMIR "🟡 Abortando mínimo necesario de procesos"
    
    MIENTRAS detectar_ciclo(grafo_deadlock):
        // Seleccionar víctima con menor costo
        victima = seleccionar_victima(grafo_deadlock)
        
        IMPRIMIR "Abortando proceso", victima.id, "(costo:", victima.costo_abortar, ")"
        
        // Liberar sus recursos
        PARA CADA recurso EN victima.recursos_retenidos:
            liberar_recurso(recurso)
            
            // Actualizar grafo
            eliminar_aristas_proceso(grafo_deadlock, victima)
        FIN PARA
        
        terminar_proceso(victima)
        
        // Verificar si el deadlock se resolvió
        SI NO detectar_ciclo(grafo_deadlock):
            IMPRIMIR "✅ Deadlock resuelto con", victimas_abortadas, "proceso(s)"
            SALIR
        FIN SI
    FIN MIENTRAS
FIN PROCEDIMIENTO

// Selección de víctima basada en múltiples criterios
FUNCION seleccionar_victima(procesos):
    mejor_victima = NULO
    costo_minimo = INFINITO
    
    PARA CADA proceso EN procesos:
        costo = calcular_costo_abortar(proceso)
        
        SI costo < costo_minimo:
            costo_minimo = costo
            mejor_victima = proceso
        FIN SI
    FIN PARA
    
    RETORNAR mejor_victima
FIN FUNCION

// Cálculo de costo de abortar un proceso
FUNCION calcular_costo_abortar(proceso):
    // Factores a considerar:
    
    // 1. Prioridad (menor prioridad = menor costo)
    costo_prioridad = MAX_PRIORIDAD - proceso.prioridad
    
    // 2. Tiempo de ejecución (menos ejecutado = menor costo)
    costo_tiempo = proceso.tiempo_ejecucion
    
    // 3. Recursos retenidos (menos recursos = menor costo)
    costo_recursos = proceso.recursos_retenidos.tamaño()
    
    // 4. Progreso (menos avanzado = menor costo)
    costo_progreso = proceso.porcentaje_completado
    
    // 5. Número de veces que ya fue víctima (evitar starvation)
    costo_starvation = proceso.veces_abortado * 1000
    
    // Combinación ponderada
    costo_total = (costo_prioridad * 0.3) +
                  (costo_tiempo * 0.2) +
                  (costo_recursos * 0.2) +
                  (costo_progreso * 0.2) +
                  (costo_starvation * 0.1)
    
    RETORNAR costo_total
FIN FUNCION

// Aborto con rollback
PROCEDIMIENTO abortar_con_rollback(proceso):
    IMPRIMIR "Abortando proceso", proceso.id, "con rollback"
    
    // 1. Guardar estado de los recursos antes de liberar
    estado_recursos = guardar_estado_recursos(proceso.recursos_retenidos)
    
    // 2. Liberar recursos
    PARA CADA recurso EN proceso.recursos_retenidos:
        liberar_recurso(recurso)
    FIN PARA
    
    // 3. Restaurar proceso a checkpoint anterior
    SI proceso.tiene_checkpoint():
        proceso.restaurar_checkpoint()
        proceso.estado = "LISTO"  // Volverá a ejecutar
        IMPRIMIR "Proceso restaurado a checkpoint anterior"
    SINO:
        terminar_proceso(proceso)
        IMPRIMIR "Proceso terminado (sin checkpoint)"
    FIN SI
    
    // 4. Incrementar contador de abortos (prevenir starvation)
    proceso.veces_abortado += 1
    
    SI proceso.veces_abortado > LIMITE_ABORTOS:
        IMPRIMIR "⚠️ Proceso", proceso.id, "abortado demasiadas veces"
        proceso.prioridad += 10  // Aumentar prioridad para evitar starvation
    FIN SI
FIN PROCEDIMIENTO

// Manejo de efectos en cascada
PROCEDIMIENTO abortar_con_dependencias(proceso):
    dependientes = encontrar_procesos_dependientes(proceso)
    
    SI dependientes NO_ESTA_VACIO:
        IMPRIMIR "⚠️ Proceso tiene", dependientes.tamaño(), "dependientes"
        
        // Opción 1: Abortar todos
        PARA CADA dep EN dependientes:
            abortar_con_rollback(dep)
        FIN PARA
        
        // Opción 2: Invalidar resultados
        // marcar_datos_invalidos(dependientes)
    FIN SI
    
    abortar_con_rollback(proceso)
FIN PROCEDIMIENTO

// Ejemplo de recuperación
PROCEDIMIENTO ejemplo_recuperacion():
    grafo = detectar_deadlock()
    
    SI grafo.tiene_ciclo:
        procesos_bloqueados = grafo.obtener_procesos_en_ciclo()
        
        // Estrategia seleccionable
        ELEGIR estrategia:
            CASO "MINIMO":
                abortar_minimo(procesos_bloqueados)
            CASO "TODOS":
                abortar_todos(procesos_bloqueados)
            CASO "POR_PRIORIDAD":
                victima = proceso_menor_prioridad(procesos_bloqueados)
                abortar_con_rollback(victima)
        FIN ELEGIR
    FIN SI
FIN PROCEDIMIENTO`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Recuperación rápida, simple de implementar, efectivo para romper deadlocks.<br />
                        <strong>⚠️ Desventajas:</strong> Pérdida de trabajo, posible starvation, efectos en cascada, difícil elegir víctima óptima.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Solución 8: Rollback */}
                <TabsContent value="rollback" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Rollback de Transacciones</h3>
                    <p className="text-gray-300">
                      En lugar de abortar completamente, se deshacen las operaciones hasta un punto seguro (checkpoint).
                      Común en bases de datos y sistemas transaccionales.
                    </p>

                    <div className="bg-black rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`// Pseudocódigo: Rollback con Checkpoints

ESTRUCTURA Checkpoint:
    id: entero
    tiempo: marca_temporal
    estado_variables: mapa<string, valor>
    recursos_retenidos: conjunto<Recurso>
    puntero_ejecucion: direccion_memoria
FIN ESTRUCTURA

ESTRUCTURA Transaccion:
    id: entero
    checkpoints: pila<Checkpoint>
    log_operaciones: lista<Operacion>
    estado: "ACTIVA" | "ABORTADA" | "COMPROMETIDA"
FIN ESTRUCTURA

// Crear checkpoint antes de operaciones críticas
PROCEDIMIENTO crear_checkpoint(transaccion):
    checkpoint = NuevoCheckpoint()
    checkpoint.id = generar_id()
    checkpoint.tiempo = TIEMPO_ACTUAL()
    
    // Guardar estado completo
    checkpoint.estado_variables = COPIAR(transaccion.variables)
    checkpoint.recursos_retenidos = COPIAR(transaccion.recursos)
    checkpoint.puntero_ejecucion = OBTENER_PC()
    
    APILAR(transaccion.checkpoints, checkpoint)
    
    IMPRIMIR "💾 Checkpoint", checkpoint.id, "creado para T", transaccion.id
    RETORNAR checkpoint.id
FIN PROCEDIMIENTO

// Rollback a checkpoint específico
PROCEDIMIENTO rollback_a_checkpoint(transaccion, checkpoint_id):
    IMPRIMIR "⏪ Iniciando rollback de T", transaccion.id, "a checkpoint", checkpoint_id
    
    // Deshacer operaciones hasta el checkpoint
    MIENTRAS transaccion.checkpoints NO_ESTA_VACIO:
        cp = DESAPILAR(transaccion.checkpoints)
        
        SI cp.id == checkpoint_id:
            // Restaurar estado
            transaccion.variables = cp.estado_variables
            transaccion.recursos = cp.recursos_retenidos
            SALTAR_A(cp.puntero_ejecucion)
            
            IMPRIMIR "✅ Rollback completado a checkpoint", checkpoint_id
            RETORNAR VERDADERO
        SINO:
            // Liberar recursos del checkpoint descartado
            liberar_recursos(cp.recursos_retenidos)
        FIN SI
    FIN MIENTRAS
    
    IMPRIMIR "❌ Checkpoint no encontrado"
    RETORNAR FALSO
FIN PROCEDIMIENTO

// Rollback completo (abortar transacción)
PROCEDIMIENTO rollback_completo(transaccion):
    IMPRIMIR "🔴 Rollback completo de T", transaccion.id
    
    // Deshacer todas las operaciones en orden inverso
    PARA CADA operacion EN REVERSA(transaccion.log_operaciones):
        deshacer_operacion(operacion)
    FIN PARA
    
    // Liberar todos los recursos
    PARA CADA recurso EN transaccion.recursos:
        liberar_recurso(recurso)
    FIN PARA
    
    // Limpiar checkpoints
    transaccion.checkpoints.limpiar()
    transaccion.log_operaciones.limpiar()
    
    transaccion.estado = "ABORTADA"
    IMPRIMIR "Transacción abortada - Estado inicial restaurado"
FIN PROCEDIMIENTO

// Sistema de log para operaciones
PROCEDIMIENTO log_operacion(transaccion, operacion):
    entrada_log = {
        tipo: operacion.tipo,
        dato_anterior: operacion.valor_viejo,
        dato_nuevo: operacion.valor_nuevo,
        recurso: operacion.recurso,
        timestamp: TIEMPO_ACTUAL()
    }
    
    AGREGAR(transaccion.log_operaciones, entrada_log)
FIN PROCEDIMIENTO

// Deshacer una operación específica
PROCEDIMIENTO deshacer_operacion(log_entrada):
    ELEGIR log_entrada.tipo:
        CASO "ESCRIBIR":
            // Restaurar valor anterior
            escribir(log_entrada.recurso, log_entrada.dato_anterior)
            
        CASO "MODIFICAR":
            restaurar(log_entrada.recurso, log_entrada.dato_anterior)
            
        CASO "INSERTAR":
            // Eliminar lo insertado
            eliminar(log_entrada.recurso, log_entrada.dato_nuevo)
            
        CASO "ELIMINAR":
            // Re-insertar lo eliminado
            insertar(log_entrada.recurso, log_entrada.dato_anterior)
    FIN ELEGIR
FIN PROCEDIMIENTO

// Recuperación de deadlock con rollback selectivo
PROCEDIMIENTO recuperar_deadlock_con_rollback(transacciones_bloqueadas):
    // Seleccionar víctima
    victima = seleccionar_transaccion_victima(transacciones_bloqueadas)
    
    IMPRIMIR "Víctima seleccionada: T", victima.id
    
    // Intentar rollback parcial primero
    SI victima.checkpoints.tamaño() > 0:
        checkpoint_mas_reciente = victima.checkpoints.tope()
        
        // Rollback al checkpoint antes de solicitar recurso conflictivo
        SI rollback_a_checkpoint(victima, checkpoint_mas_reciente.id):
            // Reintentar desde checkpoint
            IMPRIMIR "Reintentando desde checkpoint"
            reanudar_transaccion(victima)
            RETORNAR
        FIN SI
    FIN SI
    
    // Si rollback parcial falla, hacer rollback completo
    IMPRIMIR "Rollback parcial no posible - Abortando transacción completa"
    rollback_completo(victima)
FIN PROCEDIMIENTO

// Selección de víctima para rollback
FUNCION seleccionar_transaccion_victima(transacciones):
    mejor_victima = NULO
    costo_minimo = INFINITO
    
    PARA CADA trans EN transacciones:
        // Factores de costo
        trabajo_realizado = trans.log_operaciones.tamaño()
        tiempo_ejecucion = TIEMPO_ACTUAL() - trans.tiempo_inicio
        num_rollbacks_previos = trans.contador_rollbacks
        
        // Priorizar transacciones con menos trabajo
        costo = trabajo_realizado * 0.4 +
                tiempo_ejecucion * 0.3 +
                num_rollbacks_previos * 0.3
        
        SI costo < costo_minimo:
            costo_minimo = costo
            mejor_victima = trans
        FIN SI
    FIN PARA
    
    mejor_victima.contador_rollbacks += 1
    RETORNAR mejor_victima
FIN FUNCION

// Ejemplo: Transacción bancaria con checkpoints
PROCEDIMIENTO transferencia_bancaria(origen, destino, monto):
    trans = nueva_transaccion()
    
    // Checkpoint inicial
    cp0 = crear_checkpoint(trans)
    
    // Adquirir cuenta origen
    adquirir_lock(origen)
    log_operacion(trans, {tipo: "LOCK", recurso: origen})
    
    // Checkpoint después de primer lock
    cp1 = crear_checkpoint(trans)
    
    // Adquirir cuenta destino (posible deadlock aquí)
    SI NO adquirir_lock_timeout(destino, 5.segundos()):
        IMPRIMIR "Timeout - Posible deadlock"
        rollback_a_checkpoint(trans, cp1)  // Liberar origen
        DORMIR(aleatorio(100, 500))        // Backoff
        REINTENTAR
    FIN SI
    
    // Realizar transferencia
    origen.saldo -= monto
    log_operacion(trans, {tipo: "ESCRIBIR", recurso: origen, 
                         dato_anterior: origen.saldo + monto})
    
    destino.saldo += monto
    log_operacion(trans, {tipo: "ESCRIBIR", recurso: destino,
                         dato_anterior: destino.saldo - monto})
    
    // Commit
    trans.estado = "COMPROMETIDA"
    liberar_lock(origen)
    liberar_lock(destino)
    
    IMPRIMIR "✅ Transferencia completada"
FIN PROCEDIMIENTO`}</code>
                      </pre>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 rounded p-4">
                      <p className="text-sm text-blue-200">
                        <strong>✅ Ventajas:</strong> Preserva trabajo parcial, recuperación flexible, mantiene consistencia, útil en BD.<br />
                        <strong>⚠️ Desventajas:</strong> Overhead de checkpoints, espacio para logs, complejidad de implementación, posible starvation.
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
              <DemostracionDeadlock />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// Tipos para la demostración
type ProcesoState = {
  id: number;
  estado: string;
  color: string;
  colorText: string;
  recursosRetenidos: number[];
  recursosSolicitados: number[];
};

type RecursoState = {
  id: number;
  nombre: string;
  disponible: boolean;
  propietario: number | null;
};

type LogEntry = {
  mensaje: string;
  color: string;
};

// Componente de demostración interactiva
function DemostracionDeadlock() {
  const [solucion, setSolucion] = useState<string>('sin-solucion');
  const [ejecutando, setEjecutando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [procesos, setProcesos] = useState<ProcesoState[]>([]);
  const [recursos, setRecursos] = useState<RecursoState[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Configuración
  const [numProcesos, setNumProcesos] = useState(4);
  const [numRecursos, setNumRecursos] = useState(4);
  const [velocidad, setVelocidad] = useState([50]);
  
  const pausaRef = useRef(false);
  const stopRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const getVelocidadMs = () => {
    return 2000 - (velocidad[0] * 19);
  };

  const agregarLog = (mensaje: string, color: string = 'text-green-400') => {
    setLogs(prev => [...prev, { mensaje: `[${new Date().toLocaleTimeString()}] ${mensaje}`, color }]);
  };

  useEffect(() => {
    if (shouldAutoScrollRef.current && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

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

  // Demostración 1: Sin solución (deadlock clásico)
  const simularSinSolucion = async () => {
    agregarLog('🚀 Iniciando simulación SIN solución - Deadlock circular', 'text-cyan-400');
    agregarLog('⚠️ Los procesos adquirirán recursos en orden que causa deadlock', 'text-yellow-400');
    
    // P1 adquiere R1, P2 adquiere R2, P3 adquiere R3, P4 adquiere R4
    for (let i = 0; i < numProcesos; i++) {
      if (stopRef.current) return;
      const pId = i + 1;
      const rId = i + 1;

      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, estado: 'Adquiriendo recurso', color: 'bg-green-600', colorText: 'text-green-400'} : p
      ));
      
      setRecursos(prev => prev.map(r => 
        r.id === rId ? {...r, disponible: false, propietario: pId} : r
      ));

      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, recursosRetenidos: [rId]} : p
      ));

      agregarLog(`Proceso ${pId}: ✅ Adquirió recurso R${rId}`, 'text-green-400');
      await delay(getVelocidadMs() * 0.5);
    }

    agregarLog('─'.repeat(50), 'text-gray-600');

    // Ahora cada proceso solicita el siguiente recurso (circular)
    for (let i = 0; i < numProcesos; i++) {
      if (stopRef.current) return;
      const pId = i + 1;
      const rId = (i + 1) % numProcesos + 1;

      setProcesos(prev => prev.map(p => 
        p.id === pId ? {
          ...p, 
          estado: `Esperando R${rId}`, 
          color: 'bg-red-600', 
          colorText: 'text-red-400',
          recursosSolicitados: [rId]
        } : p
      ));

      agregarLog(`Proceso ${pId}: 🔒 Solicitando R${rId} (ocupado por P${recursos[rId-1]?.propietario})`, 'text-red-400');
      await delay(getVelocidadMs() * 0.3);
    }

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('🚨 DEADLOCK DETECTADO: Espera circular', 'text-red-400');
    agregarLog('P1 espera R2 (tiene P2) → P2 espera R3 (tiene P3) → P3 espera R4 (tiene P4) → P4 espera R1 (tiene P1)', 'text-red-300');
    agregarLog('❌ Sistema bloqueado permanentemente', 'text-red-400');
  };

  // Demostración 2: Ordenar recursos
  const simularOrdenar = async () => {
    agregarLog('🚀 Iniciando simulación con ORDEN GLOBAL de recursos', 'text-cyan-400');
    agregarLog('📋 Regla: Todos los procesos adquieren recursos en orden ascendente', 'text-blue-400');

    const recursosNecesarios = [
      [1, 2], // P1 necesita R1, R2
      [2, 3], // P2 necesita R2, R3
      [1, 3], // P3 necesita R1, R3
      [2, 4]  // P4 necesita R2, R4
    ];

    for (let i = 0; i < Math.min(numProcesos, recursosNecesarios.length); i++) {
      if (stopRef.current) return;
      const pId = i + 1;
      const recursos_ordenados = recursosNecesarios[i].sort((a, b) => a - b);

      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, estado: 'Ordenando solicitudes', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : p
      ));
      agregarLog(`Proceso ${pId}: Necesita ${recursos_ordenados.map(r => `R${r}`).join(', ')}`, 'text-gray-400');
      await delay(getVelocidadMs() * 0.3);

      // Adquirir en orden
      for (const rId of recursos_ordenados) {
        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, estado: `Esperando R${rId}`, color: 'bg-yellow-600', colorText: 'text-yellow-400'} : p
        ));

        // Esperar si está ocupado
        while (!recursos[rId - 1]?.disponible) {
          agregarLog(`Proceso ${pId}: ⏳ Esperando R${rId}...`, 'text-yellow-300');
          await delay(getVelocidadMs() * 0.5);
          if (stopRef.current) return;
        }

        // Adquirir
        setRecursos(prev => prev.map(r => 
          r.id === rId ? {...r, disponible: false, propietario: pId} : r
        ));

        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, recursosRetenidos: [...p.recursosRetenidos, rId]} : p
        ));

        agregarLog(`Proceso ${pId}: ✅ Adquirió R${rId} en orden`, 'text-green-400');
        await delay(getVelocidadMs() * 0.3);
      }

      // Trabajar
      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : p
      ));
      await delay(getVelocidadMs() * 0.8);

      // Liberar todos
      for (const rId of recursos_ordenados.reverse()) {
        setRecursos(prev => prev.map(r => 
          r.id === rId ? {...r, disponible: true, propietario: null} : r
        ));
        agregarLog(`Proceso ${pId}: 🔓 Liberó R${rId}`, 'text-cyan-400');
      }

      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500', recursosRetenidos: []} : p
      ));
      agregarLog(`Proceso ${pId}: ✅ Terminado sin deadlock`, 'text-green-400');
      await delay(getVelocidadMs() * 0.2);
    }

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('✅ Todos los procesos completados SIN deadlock', 'text-green-400');
    agregarLog('🎯 El orden global evitó la espera circular', 'text-blue-400');
  };

  // Demostración 3: Adquirir todos o ninguno
  const simularTodos = async () => {
    agregarLog('🚀 Iniciando simulación: Adquirir TODOS o NINGUNO', 'text-cyan-400');
    agregarLog('📋 Regla: Intento atómico - si falla alguno, libera todo', 'text-blue-400');

    const recursosNecesarios = [
      [1, 2],
      [2, 3],
      [1, 4],
      [3, 4]
    ];

    for (let i = 0; i < Math.min(numProcesos, recursosNecesarios.length); i++) {
      if (stopRef.current) return;
      const pId = i + 1;
      const recursos_req = recursosNecesarios[i];
      let intentos = 0;
      let exitoso = false;

      while (!exitoso && intentos < 5) {
        intentos++;
        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, estado: `Intento ${intentos}`, color: 'bg-yellow-600', colorText: 'text-yellow-400'} : p
        ));

        agregarLog(`Proceso ${pId}: 🎯 Intento ${intentos} - Solicitando ${recursos_req.map(r => `R${r}`).join(', ')}`, 'text-yellow-400');

        // Verificar si TODOS están disponibles
        const todosDisponibles = recursos_req.every(rId => recursos[rId - 1]?.disponible);

        if (todosDisponibles) {
          // Adquirir TODOS atómicamente
          for (const rId of recursos_req) {
            setRecursos(prev => prev.map(r => 
              r.id === rId ? {...r, disponible: false, propietario: pId} : r
            ));
          }

          setProcesos(prev => prev.map(p => 
            p.id === pId ? {...p, recursosRetenidos: recursos_req, estado: 'Trabajando', color: 'bg-green-600', colorText: 'text-green-400'} : p
          ));

          agregarLog(`Proceso ${pId}: ✅ Adquirió TODOS los recursos atómicamente`, 'text-green-400');
          exitoso = true;

          await delay(getVelocidadMs() * 1.2);

          // Liberar todos
          for (const rId of recursos_req) {
            setRecursos(prev => prev.map(r => 
              r.id === rId ? {...r, disponible: true, propietario: null} : r
            ));
          }

          setProcesos(prev => prev.map(p => 
            p.id === pId ? {...p, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500', recursosRetenidos: []} : p
          ));

          agregarLog(`Proceso ${pId}: ✅ Completado y recursos liberados`, 'text-cyan-400');
        } else {
          agregarLog(`Proceso ${pId}: ❌ No todos disponibles - Abortando intento`, 'text-red-400');
          await delay(getVelocidadMs() * 0.5);
        }

        await delay(getVelocidadMs() * 0.3);
      }
    }

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('✅ Simulación completada - No hubo deadlock', 'text-green-400');
    agregarLog('🎯 La adquisición atómica evitó hold-and-wait', 'text-blue-400');
  };

  // Demostración 4: Timeouts
  const simularTimeout = async () => {
    agregarLog('🚀 Iniciando simulación con TIMEOUTS', 'text-cyan-400');
    agregarLog('⏱️ Timeout: 2 segundos por recurso', 'text-blue-400');

    for (let i = 0; i < Math.min(numProcesos, 3); i++) {
      if (stopRef.current) return;
      const pId = i + 1;
      const r1 = i + 1;
      const r2 = (i + 1) % numRecursos + 1;

      // Adquirir primer recurso
      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, estado: `Adquiriendo R${r1}`, color: 'bg-green-600', colorText: 'text-green-400'} : p
      ));

      while (!recursos[r1 - 1]?.disponible) {
        await delay(100);
        if (stopRef.current) return;
      }

      setRecursos(prev => prev.map(r => 
        r.id === r1 ? {...r, disponible: false, propietario: pId} : r
      ));

      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, recursosRetenidos: [r1]} : p
      ));

      agregarLog(`Proceso ${pId}: ✅ Adquirió R${r1}`, 'text-green-400');
      await delay(getVelocidadMs() * 0.3);

      // Intentar segundo recurso con timeout
      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, estado: `Timeout en R${r2}`, color: 'bg-yellow-600', colorText: 'text-yellow-400'} : p
      ));

      let timeout_counter = 0;
      const max_timeout = 3;

      while (!recursos[r2 - 1]?.disponible && timeout_counter < max_timeout) {
        agregarLog(`Proceso ${pId}: ⏱️ Esperando R${r2}... (${timeout_counter + 1}/${max_timeout})`, 'text-yellow-300');
        await delay(getVelocidadMs() * 0.4);
        timeout_counter++;
      }

      if (timeout_counter >= max_timeout) {
        // Timeout expiró
        agregarLog(`Proceso ${pId}: ⏰ TIMEOUT - Liberando R${r1} y reintentando`, 'text-red-400');
        
        setRecursos(prev => prev.map(r => 
          r.id === r1 ? {...r, disponible: true, propietario: null} : r
        ));

        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, recursosRetenidos: [], estado: 'Reintentando', color: 'bg-orange-600', colorText: 'text-orange-400'} : p
        ));

        await delay(getVelocidadMs() * 0.8);
      } else {
        setRecursos(prev => prev.map(r => 
          r.id === r2 ? {...r, disponible: false, propietario: pId} : r
        ));

        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, recursosRetenidos: [r1, r2], estado: 'Trabajando', color: 'bg-blue-600', colorText: 'text-blue-400'} : p
        ));

        agregarLog(`Proceso ${pId}: ✅ Adquirió ambos recursos`, 'text-green-400');
        await delay(getVelocidadMs());

        // Liberar
        setRecursos(prev => prev.map(r => 
          (r.id === r1 || r.id === r2) ? {...r, disponible: true, propietario: null} : r
        ));

        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500', recursosRetenidos: []} : p
        ));

        agregarLog(`Proceso ${pId}: ✅ Terminado`, 'text-cyan-400');
      }

      await delay(getVelocidadMs() * 0.2);
    }

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('✅ Timeouts evitaron deadlock permanente', 'text-green-400');
  };

  // Demostración 5: Algoritmo del Banquero (simplificado)
  const simularBanquero = async () => {
    agregarLog('🚀 Iniciando simulación: Algoritmo del BANQUERO', 'text-cyan-400');
    agregarLog('🏦 Verificando estado seguro antes de cada asignación', 'text-blue-400');

    // Estado del sistema
    const disponible = [2, 2, 2]; // 3 tipos de recursos con 2 instancias cada uno
    const maximo = [[3, 2, 1], [2, 3, 2], [2, 2, 3]];
    const asignado = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    agregarLog(`Recursos disponibles: [${disponible.join(', ')}]`, 'text-gray-400');

    for (let i = 0; i < 3; i++) {
      if (stopRef.current) return;
      const pId = i + 1;
      const solicitud = maximo[i];

      setProcesos(prev => prev.map(p => 
        p.id === pId ? {...p, estado: 'Solicitando recursos', color: 'bg-yellow-600', colorText: 'text-yellow-400'} : p
      ));

      agregarLog(`Proceso ${pId}: Solicita [${solicitud.join(', ')}]`, 'text-yellow-400');
      await delay(getVelocidadMs() * 0.5);

      // Verificar estado seguro (simplificado)
      const puedeAsignar = solicitud.every((cant, idx) => cant <= disponible[idx]);

      if (puedeAsignar) {
        agregarLog(`Proceso ${pId}: ✅ Estado SEGURO - Asignación aprobada`, 'text-green-400');
        
        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, estado: 'Ejecutando', color: 'bg-green-600', colorText: 'text-green-400'} : p
        ));

        // Asignar
        solicitud.forEach((cant, idx) => {
          disponible[idx] -= cant;
          asignado[i][idx] = cant;
        });

        agregarLog(`Recursos disponibles ahora: [${disponible.join(', ')}]`, 'text-gray-400');
        await delay(getVelocidadMs());

        // Liberar al terminar
        solicitud.forEach((cant, idx) => {
          disponible[idx] += cant;
        });

        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, estado: 'Terminado', color: 'bg-gray-800', colorText: 'text-gray-500'} : p
        ));

        agregarLog(`Proceso ${pId}: ✅ Completado - Recursos liberados`, 'text-cyan-400');
      } else {
        agregarLog(`Proceso ${pId}: ⚠️ Estado INSEGURO - Solicitud RECHAZADA`, 'text-red-400');
        
        setProcesos(prev => prev.map(p => 
          p.id === pId ? {...p, estado: 'Esperando', color: 'bg-orange-600', colorText: 'text-orange-400'} : p
        ));
      }

      await delay(getVelocidadMs() * 0.3);
    }

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('✅ El banquero garantizó estado seguro - Sin deadlock', 'text-green-400');
  };

  // Demostración 6: Detección de ciclos
  const simularCiclos = async () => {
    agregarLog('🚀 Iniciando simulación: DETECCIÓN DE CICLOS', 'text-cyan-400');
    agregarLog('🔍 Monitoreando grafo de espera en tiempo real', 'text-blue-400');

    // Crear escenario de deadlock
    const asignaciones = [
      { proceso: 1, recurso: 1 },
      { proceso: 2, recurso: 2 },
      { proceso: 3, recurso: 3 }
    ];

    // Asignar recursos iniciales
    for (const {proceso, recurso} of asignaciones) {
      setRecursos(prev => prev.map(r => 
        r.id === recurso ? {...r, disponible: false, propietario: proceso} : r
      ));

      setProcesos(prev => prev.map(p => 
        p.id === proceso ? {...p, recursosRetenidos: [recurso]} : p
      ));

      agregarLog(`Proceso ${proceso}: Tiene R${recurso}`, 'text-green-400');
      await delay(getVelocidadMs() * 0.3);
    }

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('🔄 Creando dependencias circulares...', 'text-yellow-400');

    // Crear ciclo: P1→R2, P2→R3, P3→R1
    const solicitudes = [
      { proceso: 1, recurso: 2 },
      { proceso: 2, recurso: 3 },
      { proceso: 3, recurso: 1 }
    ];

    for (const {proceso, recurso} of solicitudes) {
      setProcesos(prev => prev.map(p => 
        p.id === proceso ? {
          ...p, 
          estado: `Esperando R${recurso}`, 
          color: 'bg-red-600', 
          colorText: 'text-red-400',
          recursosSolicitados: [recurso]
        } : p
      ));

      const propietario = recursos[recurso - 1]?.propietario;
      agregarLog(`Proceso ${proceso}: 🔒 Espera R${recurso} (lo tiene P${propietario})`, 'text-red-400');
      await delay(getVelocidadMs() * 0.4);
    }

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('🔍 Ejecutando detector de ciclos DFS...', 'text-yellow-400');
    await delay(getVelocidadMs() * 0.8);

    agregarLog('🚨 CICLO DETECTADO:', 'text-red-400');
    agregarLog('P1 → R2 (P2) → P2 → R3 (P3) → P3 → R1 (P1) → [CICLO]', 'text-red-300');
    agregarLog('💡 Acción: Abortar P1 para romper el ciclo', 'text-yellow-400');

    await delay(getVelocidadMs());

    // Abortar P1
    setRecursos(prev => prev.map(r => 
      r.id === 1 ? {...r, disponible: true, propietario: null} : r
    ));

    setProcesos(prev => prev.map(p => 
      p.id === 1 ? {...p, estado: 'Abortado', color: 'bg-gray-800', colorText: 'text-gray-500', recursosRetenidos: [], recursosSolicitados: []} : p
    ));

    agregarLog('Proceso 1: ❌ ABORTADO - R1 liberado', 'text-orange-400');
    await delay(getVelocidadMs() * 0.5);

    agregarLog('─'.repeat(50), 'text-gray-600');
    agregarLog('✅ Ciclo roto - P3 puede continuar', 'text-green-400');
  };

  // Ejecutar demostración
  const ejecutarDemo = async () => {
    stopRef.current = false;
    pausaRef.current = false;
    setEjecutando(true);
    setPausado(false);
    setLogs([]);
    
    inicializarEstadoCallback();

    await delay(300);

    switch (solucion) {
      case 'sin-solucion':
        await simularSinSolucion();
        break;
      case 'ordenar':
        await simularOrdenar();
        break;
      case 'todos':
        await simularTodos();
        break;
      case 'timeout':
        await simularTimeout();
        break;
      case 'banquero':
        await simularBanquero();
        break;
      case 'ciclos':
        await simularCiclos();
        break;
      case 'abortar':
        await simularCiclos(); // Similar a ciclos pero enfocado en abortar
        break;
      case 'rollback':
        agregarLog('🚧 Demostración de Rollback en construcción', 'text-yellow-400');
        break;
    }

    if (!stopRef.current) {
      agregarLog('🏁 Simulación completada', 'text-cyan-400');
    }

    setEjecutando(false);
    setPausado(false);
  };

  const togglePausa = () => {
    pausaRef.current = !pausaRef.current;
    setPausado(!pausado);
    if (pausaRef.current) {
      agregarLog('⏸️ Simulación pausada', 'text-yellow-400');
    } else {
      agregarLog('▶️ Simulación reanudada', 'text-green-400');
    }
  };

  const reiniciar = () => {
    stopRef.current = true;
    pausaRef.current = false;
    setEjecutando(false);
    setPausado(false);
    setLogs([]);
    inicializarEstadoCallback();
  };

  const cambiarNumProcesos = (delta: number) => {
    const nuevo = Math.max(3, Math.min(6, numProcesos + delta));
    setNumProcesos(nuevo);
  };

  const cambiarNumRecursos = (delta: number) => {
    const nuevo = Math.max(3, Math.min(6, numRecursos + delta));
    setNumRecursos(nuevo);
  };

  const inicializarEstadoCallback = useCallback(() => {
    const procs: ProcesoState[] = Array.from({length: numProcesos}, (_, i) => ({
      id: i + 1,
      estado: 'Iniciando',
      color: 'bg-blue-600',
      colorText: 'text-blue-400',
      recursosRetenidos: [],
      recursosSolicitados: []
    }));
    setProcesos(procs);

    const recs: RecursoState[] = Array.from({length: numRecursos}, (_, i) => ({
      id: i + 1,
      nombre: `R${i + 1}`,
      disponible: true,
      propietario: null
    }));
    setRecursos(recs);
  }, [numProcesos, numRecursos]);

  useEffect(() => {
    inicializarEstadoCallback();
  }, [inicializarEstadoCallback]);

  return (
    <div className="space-y-6">
      {/* Configuración */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">⚙️ Configuración de la Simulación</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Número de Procesos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de Procesos
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarNumProcesos(-1)}
                disabled={ejecutando || numProcesos <= 3}
                className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded"
              >
                <Minus className="size-4" />
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-white">{numProcesos}</div>
                <div className="text-xs text-gray-400">Min: 3, Max: 6</div>
              </div>
              <button
                onClick={() => cambiarNumProcesos(1)}
                disabled={ejecutando || numProcesos >= 6}
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
              Número de Recursos
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarNumRecursos(-1)}
                disabled={ejecutando || numRecursos <= 3}
                className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded"
              >
                <Minus className="size-4" />
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-white">{numRecursos}</div>
                <div className="text-xs text-gray-400">Min: 3, Max: 6</div>
              </div>
              <button
                onClick={() => cambiarNumRecursos(1)}
                disabled={ejecutando || numRecursos >= 6}
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
          <TabsTrigger value="sin-solucion">❌ Sin Solución</TabsTrigger>
          <TabsTrigger value="ordenar">🔢 Ordenar</TabsTrigger>
          <TabsTrigger value="todos">⚛️ Todos/Ninguno</TabsTrigger>
          <TabsTrigger value="timeout">⏱️ Timeout</TabsTrigger>
          <TabsTrigger value="banquero">🏦 Banquero</TabsTrigger>
          <TabsTrigger value="ciclos">🔍 Ciclos</TabsTrigger>
          <TabsTrigger value="abortar">🔴 Abortar</TabsTrigger>
          <TabsTrigger value="rollback">⏪ Rollback</TabsTrigger>
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
            {/* Estados */}
            <div className="space-y-4">
              {/* Procesos */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Estado de Procesos</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {procesos.map(proceso => (
                    <div key={proceso.id} className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className={`size-3 rounded-full ${proceso.color} animate-pulse flex-shrink-0`}></div>
                        <span className="text-white font-mono text-sm w-16">P{proceso.id}:</span>
                        <span className={`${proceso.colorText} text-sm`}>{proceso.estado}</span>
                      </div>
                      {proceso.recursosRetenidos.length > 0 && (
                        <div className="ml-10 text-xs text-gray-400">
                          Tiene: {proceso.recursosRetenidos.map(r => `R${r}`).join(', ')}
                        </div>
                      )}
                      {proceso.recursosSolicitados.length > 0 && (
                        <div className="ml-10 text-xs text-yellow-400">
                          Solicita: {proceso.recursosSolicitados.map(r => `R${r}`).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recursos */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Estado de Recursos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {recursos.map(recurso => (
                    <div key={recurso.id} className={`p-3 rounded border ${
                      recurso.disponible 
                        ? 'bg-green-900/30 border-green-700' 
                        : 'bg-red-900/30 border-red-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white">{recurso.nombre}</span>
                        <div className={`size-3 rounded-full ${
                          recurso.disponible ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div className="text-xs mt-1 text-gray-400">
                        {recurso.disponible ? 'Libre' : `P${recurso.propietario}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Logs de Ejecución</h3>
              <div 
                ref={logsContainerRef}
                onScroll={handleScroll}
                className="bg-black rounded p-4 h-[500px] overflow-y-auto font-mono text-sm"
              >
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center mt-8">
                    Selecciona un algoritmo y presiona "Ejecutar"
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

          {/* Explicación */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
            <h4 className="font-bold text-blue-200 mb-2">
              {solucion === 'sin-solucion' && '❌ Deadlock Clásico'}
              {solucion === 'ordenar' && '🔢 Orden Global de Recursos'}
              {solucion === 'todos' && '⚛️ Adquisición Atómica'}
              {solucion === 'timeout' && '⏱️ Timeouts con Reintentos'}
              {solucion === 'banquero' && '🏦 Algoritmo del Banquero'}
              {solucion === 'ciclos' && '🔍 Detección de Ciclos'}
              {solucion === 'abortar' && '🔴 Abortar Procesos'}
              {solucion === 'rollback' && '⏪ Rollback de Transacciones'}
            </h4>
            <p className="text-sm text-blue-100">
              {solucion === 'sin-solucion' && 'Los procesos adquieren recursos sin orden, creando una espera circular (P1→P2→P3→P4→P1). Las 4 condiciones de Coffman se cumplen, resultando en deadlock permanente.'}
              {solucion === 'ordenar' && 'Todos los procesos adquieren recursos en orden numérico ascendente. Esto rompe la condición de espera circular, garantizando que no puede formarse un ciclo de dependencias.'}
              {solucion === 'todos' && 'Los procesos intentan adquirir TODOS los recursos necesarios de forma atómica. Si alguno no está disponible, no adquieren ninguno. Rompe la condición de hold-and-wait.'}
              {solucion === 'timeout' && 'Los procesos esperan por recursos con un tiempo límite. Si expira el timeout, liberan los recursos que tienen y reintentan después. Evita deadlocks permanentes mediante recuperación automática.'}
              {solucion === 'banquero' && 'Antes de cada asignación, el sistema verifica que quedará en un estado seguro (existe una secuencia donde todos los procesos pueden terminar). Solo asigna si es seguro.'}
              {solucion === 'ciclos' && 'El sistema monitorea el grafo de espera en tiempo real. Cuando detecta un ciclo usando DFS, identifica el deadlock y toma acción correctiva (ej: abortar un proceso del ciclo).'}
              {solucion === 'abortar' && 'Cuando se detecta deadlock, se selecciona una "víctima" (proceso con menor costo) y se aborta para romper el ciclo. Los recursos liberados permiten que los demás procesos continúen.'}
              {solucion === 'rollback' && 'En lugar de abortar completamente, los procesos pueden retroceder a un checkpoint previo, liberando recursos parcialmente. Útil en sistemas transaccionales para minimizar pérdida de trabajo.'}
            </p>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
