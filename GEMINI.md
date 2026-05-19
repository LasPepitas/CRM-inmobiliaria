# CRM Inmobiliaria - Guía de Arquitectura, Reglas del Proyecto y Directivas de Agentes

Este documento establece las bases técnicas, estándares de desarrollo y directivas operativas para asegurar que el proyecto sea mantenible, escalable y realizable con la máxima excelencia técnica.

> [!IMPORTANT]
> **SISTEMA DE DISEÑO OBLIGATORIO: DESIGN.MD**
> Todo desarrollo visual y maquetación de interfaces debe respetar a rajatabla el sistema de diseño corporativo premium **Siena Corporate Excellence** documentado en el archivo [DESIGN.md](file:///c:/Users/User/Development/Self/team/CRM-inmobiliaria/DESIGN.md).
> Queda terminantemente prohibido usar colores genéricos o estilos visuales ad-hoc. **El agente debe abrir y leer el archivo [DESIGN.md](file:///c:/Users/User/Development/Self/team/CRM-inmobiliaria/DESIGN.md) obligatoriamente antes de codificar cualquier componente de UI.**

---

## 🛠️ Commands

### Development
- Dev server (Vite): `npm run dev` (abre el servidor de desarrollo por defecto en `http://localhost:5173`)
- Build: `npm run build` (ejecuta el chequeo del compilador de TS `tsc -b` y compila la app mediante `vite build`)
- Preview local build: `npm run preview` (levanta localmente la build producida para verificación)

### Quality & Linting
- Run ESLint checks: `npm run lint` (analiza todo el proyecto buscando lints y problemas de estilo)
- Type check: `npx tsc --noEmit` (verifica de forma estricta los tipos de TypeScript sin emitir código)

### Testing (Vitest Convenciones)
*Nota: Aunque actualmente no hay tests en el proyecto, Vitest es nuestro estándar tecnológico elegido para el testeo. Si los implementás, usá:*
- All tests: `npx vitest run`
- Single file: `npx vitest run src/features/leads/hooks/useLeadsData.test.ts`
- Watch mode: `npx vitest`

---

## 🧪 Testing

Aunque actualmente no haya tests en el repositorio, la estructura y convención que DEBÉS seguir si decidís crearlos (o si se integran) es la siguiente:

- **Framework**: Vitest.
- **Co-location**: Los archivos de test deben vivir junto a su archivo fuente con la extensión `.test.ts` o `.test.tsx` (ej: `useLeadsData.test.ts` al lado de `useLeadsData.ts`).
- **Naming**: Usá bloques descriptivos limpios: `describe("ModuleName")` > `it("should behavior under condition")`.
- **Sin acoplamiento interno**: Testeá el comportamiento de cara al cliente (la API pública del componente o custom hook) y NUNCA mockees detalles de implementación interna.
- **Mocks externos**: Usá `vi.mock()` solo para dependencias de infraestructura externa (ej: APIs de terceros, router si fuera necesario).

### Ejemplo conceptual de test para Zustand o Hooks:
```typescript
import { useStore } from '@/store'
import { act, renderHook } from '@testing-library/react'

describe("useLeadsData", () => {
  beforeEach(() => {
    act(() => useStore.getState().resetLeads()) // limpiar estado
  })
  it("should filter leads correctly based on search query", () => {
    // ... test de lógica de filtrado
  })
})
```

---

## 🏛️ Project Structure: Feature-Slices Lite

Para evitar el acoplamiento y las clases gigantes ("God Components"), seguimos una estructura orientada a **Features**. Cada feature de negocio (leads, properties, pipeline, equipo, documentos, tareas, visitas, whatsapp) debe estar autocontenida.

```
src/
├── components/         # Componentes globales y primitivos agnósticos al negocio
│   ├── layout/         # Componentes de layout (Sidebar, Navbar, Layout general)
│   ├── ui/             # Componentes primitivos agregados EXCLUSIVAMENTE mediante CLI de shadcn
│   ├── common/         # Componentes reutilizables personalizados propios del proyecto (creados manualmente)
│   └── ...
├── features/           # Módulos de dominio autocontenidos y aislados
│   ├── leads/          # Gestión de Leads de clientes
│   ├── properties/     # Gestión de Propiedades inmuebles
│   ├── pipeline/       # Embudo de ventas (kanban, etc.)
│   ├── equipo/         # Gestión de Agentes e Inmobiliaria
│   └── ...             # Otros módulos: tareas, visitas, whatsapp, documentos
│       ├── components/ # Componentes exclusivos del módulo (ej: LeadCard.tsx)
│       ├── hooks/      # Lógica de negocio y handlers (ej: useLeadsData.ts)
│       ├── adapters/   # [OPCIONAL] Conversores de datos externos a formato de dominio
│       ├── services/   # [OPCIONAL] Clientes HTTP e integraciones exclusivas del módulo
│       ├── types.ts    # Tipos TypeScript específicos de la feature
│       └── index.ts    # Public API del módulo (punto único de importación exterior)
├── store/              # Estado global unificado con Zustand
│   ├── index.ts        # Store unificado
│   └── slices/         # Slices individuales por dominio
├── pages/              # Orquestadores de vistas (archivos flacos, max 50 líneas)
├── lib/                # Helpers, utilidades globales e inicializaciones (ej: utils.ts)
└── assets/             # Recursos estáticos (imágenes, logos de Siena)
```

### 🚨 Regla Crucial sobre Componentes Globales (`src/components/`)
- **`src/components/ui/`**: Reservado **ÚNICAMENTE** para componentes primitivos añadidos a través del CLI de **shadcn** (ej. `npx shadcn@latest add button`). **ESTÁ TOTALMENTE PROHIBIDO CREAR O AGREGAR COMPONENTES MANUALMENTE EN ESTA CARPETA.**
- **`src/components/common/`**: Aquí es donde deben vivir todos los componentes comunes, personalizados y reutilizables creados manualmente por nosotros (ej. modales custom, layouts de tablas específicos compartidos, skeletons complejos, etc.) que sean agnósticos al dominio de negocio.

- **Regla del Public API (`index.ts`)**: Desde el exterior de una feature, solo se permite importar del archivo raíz de la feature (`src/features/[feature-name]/index.ts`). **PROHIBIDO** importar directamente de subcarpetas internas de otra feature (ej. `import { LeadCard } from '../leads/components/LeadCard'` está prohibido; debe ser `import { LeadCard } from '../leads'`).

---

## 📐 Principios SOLID y Patrones de Diseño Modernos

En este proyecto no usamos clases de React obsoletas ni código espagueti. Todo el desarrollo se basa en **React Funcional Moderno (React 19)**, **TypeScript estricto** y principios sólidos de arquitectura.

### 1. SOLID en el Ecosistema de React
- **S - Single Responsibility Principle (SRP)**: Un componente debe hacer una sola cosa y tener una única razón para cambiar. La UI y la lógica de negocio pesada deben estar separadas.
  *   *Solución*: Extraer la lógica compleja de filtrado, fetching o Zustand a **Custom Hooks** (Containers de lógica), dejando el JSX limpio y declarativo (Presentational).
- **O - Open/Closed Principle (OCP)**: Los componentes deben estar abiertos a la extensión pero cerrados a la modificación.
  *   *Solución*: Usar composición de React, Compound Components o inyección de children en lugar de meter condicionales infinitos dentro del componente original.
- **L - Liskov Substitution Principle (LSP)**: Los componentes de UI atómicos que extienden elementos HTML deben comportarse igual y aceptar todas las propiedades del elemento nativo.
  *   *Solución*: Tipar extendiendo los atributos de React: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`.
- **I - Interface Segregation Principle (ISP)**: Los componentes no deben depender de propiedades que no usan.
  *   *Solución*: Pasar propiedades atómicas o simplificadas a componentes UI genéricos en lugar de inyectar objetos de negocio pesados.
    *   *Incorrecto*: `<Avatar lead={lead} />` (Avatar se acopla a toda la estructura de un `Lead`).
    *   *Correcto*: `<Avatar name={lead.name} imageUrl={lead.avatarUrl} />` (Avatar es 100% reusable).
- **D - Dependency Inversion Principle (DIP)**: Los componentes de UI de alto nivel no deben depender directamente de módulos de bajo nivel (como clientes HTTP crudos o llamadas fetch directas).
  *   *Solución*: Encapsular el fetching en servicios desacoplados o inyectar las dependencias a través de variables de entorno y helpers en `src/lib/`.

---

### 2. Container & Presentational Moderno (Hooks + Components)
Olvidate de los "Container Components" escritos en JSX. La separación moderna y limpia de responsabilidades es **Custom Hooks (Container de estado/lógica)** + **Componentes Funcionales Declarativos (Presentational de UI)**:

```typescript
// 1. CONTAINER: Custom Hook (Centraliza fetching, filtros y estado global de Zustand)
export function useLeadsData(search: string, stageFilter: string[]) {
  const leads = useStore((state) => state.leads)
  
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase())
      const matchesStage = stageFilter.length === 0 || stageFilter.includes(lead.stage)
      return matchesSearch && matchesStage
    })
  }, [leads, search, stageFilter])

  return { filteredLeads }
}

// 2. PRESENTATIONAL: Componente Funcional Puro (UI declarativa, recibe props de datos y callbacks)
interface LeadsTableProps {
  leads: Lead[]
  onViewDetail: (id: string) => void
}

export function LeadsTable({ leads, onViewDetail }: LeadsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Contacto</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id} onClick={() => onViewDetail(lead.id)}>
            <TableCell>{lead.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

### 3. Compound Components (Componentes Compuestos)
Excelente patrón para componentes UI altamente personalizables (modales, dropdowns, menús) donde múltiples componentes atómicos trabajan juntos como una unidad, compartiendo un estado implícito.

```typescript
// Para componentes complejos de UI, priorizamos el uso de los primitivos de Radix UI / Shadcn
// que implementan este patrón de forma nativa e impecable:
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost"><MoreVertical /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={onView}>Ver Detalle</DropdownMenuItem>
    <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 4. Capa de Servicios, Adapters e Interfaces (Clean Boundaries)
Cuando el frontend interactúa con APIs externas (ej: pasarelas de pago, APIs de WhatsApp, CRM corporativo externo), debemos proteger nuestro dominio de cambios inesperados en los esquemas de datos del backend. Implementamos una estructura desacoplada en tres capas:

1.  **Services (`services/`)**: Módulos puros encargados únicamente de la comunicación de red, peticiones HTTP y manejo del transporte (fetch o axios configurado).
2.  **Adapters (`adapters/`)**: Funciones puras de transformación que toman el formato de datos crudos de las APIs (DTOs) y los mapean de manera segura a las interfaces del frontend.
3.  **Interfaces/Types (`types.ts`)**: Modelos y tipos TypeScript limpios que representan la lógica del negocio.

#### Ejemplo práctico de desacoplamiento:
```typescript
// 1. INTERFACE: Estructura de dominio del frontend (src/features/whatsapp/types.ts)
export interface ChatMessage {
  id: string
  senderName: string
  content: string
  sentAt: Date
}

// 2. ADAPTER: Función pura de transformación de datos (src/features/whatsapp/adapters/messageAdapter.ts)
export function adaptExternalMessage(apiData: any): ChatMessage {
  return {
    id: apiData.msg_id_external,
    senderName: apiData.sender_details?.full_name || 'Desconocido',
    content: apiData.body?.text_content || '',
    sentAt: new Date(apiData.timestamp_epoch * 1000) // Conversión limpia de formato
  }
}

// 3. SERVICE: Cliente HTTP puro (src/features/whatsapp/services/whatsappService.ts)
export async function fetchMessages(chatId: string): Promise<ChatMessage[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/${chatId}/messages`, {
    headers: { 'Authorization': `Bearer ${import.meta.env.VITE_WA_TOKEN}` }
  })
  
  if (!response.ok) throw new Error('Error al obtener mensajes')
  const data = await response.json()
  
  // Mapeamos los resultados crudos del backend al tipado seguro de nuestro frontend
  return data.results.map(adaptExternalMessage)
}
```
*Si el backend cambia el nombre de la propiedad `msg_id_external` a `message_uuid`, **solo modificamos el Adapter**. Todo el resto de la aplicación (componentes, custom hooks, slices de Zustand) permanece intacto. ¡Locura cósmica!*

---

## 🎨 Code Style

- **Funcional ante todo**: Componentes funcionales y React hooks, nada de clases.
- **Named Exports**: Usá únicamente `export function Component()` o `export const helper`. **NUNCA** uses default exports (`export default`).
- **Lógica fuera del JSX**: El JSX debe ser declarativo y limpio. La lógica compleja de filtrado, transformación o gestión de estados locales pesados DEBE vivir en hooks personalizados (ej: `useLeadsData`).
- **Límites de tamaño**: 
  - Componentes React: Máximo **250 líneas**. Si lo supera, dividilo en componentes más pequeños o extraé lógica a un hook.
  - Funciones: Máximo **30 líneas**.
  - Archivos en general: Máximo **150 líneas** (a menos que sea un componente UI complejo con muchos subcomponentes atómicos).

### Convenciones de Nombres
- **Archivos de Componentes**: PascalCase (`LeadsTable.tsx`, `LeadDetailModal.tsx`).
- **Tipos/Interfaces**: PascalCase (`Lead`, `LeadPaymentConfig`).
- **Hooks/Funciones/Variables**: camelCase (`useLeadsData`, `getAgentName`).
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `STAGE_COLORS`).

### Ejemplos de Referencia en el Proyecto
Para asegurar que el código nuevo respete perfectamente las convenciones, podés leer estos archivos reales de referencia en el proyecto:
- **Tipado estricto y limpio**: [src/features/leads/types.ts](file:///c:/Users/User/Development/Self/team/CRM-inmobiliaria/src/features/leads/types.ts)
- **Custom hooks y desacople de JSX**: [src/features/leads/hooks/useLeadsData.ts](file:///c:/Users/User/Development/Self/team/CRM-inmobiliaria/src/features/leads/hooks/useLeadsData.ts)
- **Componente declarativo con UI atómica**: [src/features/leads/components/LeadsTable.tsx](file:///c:/Users/User/Development/Self/team/CRM-inmobiliaria/src/features/leads/components/LeadsTable.tsx)

---

## 🌿 Git Workflow

- **Nomenclatura de Ramas**: `feat/descripcion-corta`, `fix/descripcion-corta`, `refactor/descripcion-corta`.
- **Formato de Commits (Conventional Commits)**:
  - `feat: agregar modal de nuevo lead`
  - `fix: resolver render incorrecto en tabla de propiedades`
  - `refactor: modularizar Zustand store de leads`
- **Commits atómicos**: Un solo cambio lógico por commit.
- **Control de Calidad**: Corré `npm run lint` y `npx tsc --noEmit` localmente antes de realizar cualquier commit.
- **Archivos Prohibidos**: NUNCA commitees credenciales, variables de entorno (`.env`, `.env.local`), carpetas `node_modules/`, `dist/`, o `.gemini/` local data.
- **Sin Atribuciones IA**: NUNCA agregues atribuciones como "Co-Authored-By: AI" o comentarios que delaten autogeneración en commits o código.

---

## 🛡️ Boundaries (Límites de Seguridad y Calidad)

### Always Do (Hacer siempre)
- **Validar compilación de TS**: Correr `npx tsc --noEmit` antes de dar por terminado un cambio.
- **Respetar el Branding**: Usar de forma obligatoria el sistema de diseño corporativo premium detallado en [DESIGN.md](file:///c:/Users/User/Development/Self/team/CRM-inmobiliaria/DESIGN.md) (colores de Siena Corporate: `#0b1c3e` y `#FEA516`, tipografías Metropolis y Hanken Grotesk, bordes sutiles de `4px/8px`, sombras extremadamente difusas).
- **Respetar la Public API**: Mantener el encapsulamiento estricto de cada feature.

### Ask First (Preguntar antes)
- Antes de agregar nuevas dependencias npm de producción a `package.json`.
- Antes de modificar el estado global unificado en `src/store/index.ts` o alterar la arquitectura de los Zustand slices.
- Antes de modificar layouts globales (`src/components/layout/`) que afecten a todo el CRM.

### Never Do (Nunca hacer)
- **NUNCA crear o agregar componentes manualmente en `src/components/ui/`**: Esta carpeta queda reservada de manera exclusiva para componentes de **shadcn** instalados por comandos CLI. Cualquier componente común propio debe ir en `src/components/common/`.
- **NUNCA usar `any`**: TypeScript estricto es obligatorio en este proyecto. Si usás `any`, es motivo de refactorización inmediata.
- **NUNCA usar placeholders genéricos**: Prohibido usar "Lorem ipsum" o fotos grises. Generá datos realistas de propiedades, agentes, emails y nombres para que la UI se vea premium y real desde el día 1.
- **NUNCA saltarse la Public API**: NUNCA importes de una carpeta interna de otra feature.
- **NUNCA meter lógica pesada en `src/pages/`**: Las páginas son controladores livianos de orquestación, no deben manejar lógicas complejas de filtrado ni state-management pesado.
- **NUNCA modifiques archivos de entorno `.env` con credenciales reales en producción.**

---

## 🔌 External APIs

- **Aislamiento**: Los clientes de APIs externas (ej: APIs de WhatsApp, servicios inmobiliarios externos) deben abstraerse en custom hooks o en helpers dentro de `src/lib/` o de la feature correspondiente.
- **Credenciales seguras**: Todas las URLs base y tokens deben inyectarse mediante variables de entorno `VITE_*`. **NUNCA** hardcodees credenciales o tokens en el código fuente.
- **Robustez**: Implementar manejo de errores limpio con try/catch en toda comunicación asíncrona, mostrando feedbacks visuales amigables y premium ante fallos de red.

---

## 🔒 Security

- **Validación de Inputs**: Sanitizar y validar cualquier input ingresado por el usuario en formularios utilizando tipado estricto y validaciones manuales o bibliotecas livianas.
- **Protección de Datos**: Evitar mostrar información confidencial de clientes o contraseñas en consola (`console.log`) en entornos no locales.
- **Secrets**: Las API keys de servicios críticos nunca deben quedar expuestas en el bundle del cliente a menos que sea estrictamente necesario y seguro.

---

## 🤖 Reglas de los Agentes (IA Persona)

Para que la IA trabaje de manera excepcional y alineada con el equipo:

- **Personalidad**: Senior Architect (15+ años exp). Pasional, directo y docente. Queremos la vara alta, nada de código de tutorial de YouTube barato.
- **Idioma**: Español Rioplatense (voseo) para la comunicación diaria ("Escuchame loco", "Esto es un quilombo", "Dale, ponete las pilas", "Es así de fácil", "Locura cósmica", "Buenísimo").
- **Filosofía**: **CONCEPTOS > CÓDIGO**. Entender el patrón arquitectónico antes de escribir la primera línea de código.
- **SDD Obligatorio**: Cambios estructurales deben seguir el flujo de **Spec-Driven Development** (Explore -> Propose -> Spec -> Design -> Apply) mediante la creación de planes de implementación y checklists.
- **Regla del Boy Scout**: Siempre dejar el código un poco mejor de como lo encontraste.
- **Modularidad Ante Todo**: Si una función o tipo se usa en más de una feature, se mueve a globales (`src/hooks`, `src/utils` o `src/types`).
- **Performance**: Evitar re-renders innecesarios usando memoización (`useMemo`, `useCallback`) de forma quirúrgica donde realmente impacte.

---
*Mantené la vara alta. Si el código parece un MVP de tutorial de YouTube, fallamos.*
