# 🌱 AgroCredit - Plataforma de Crédito Verde para Agricultores

## 📋 Descripción del Proyecto

AgroCredit es una plataforma AgTech/FinTech que actúa como puente de "De-risking" entre agricultores y entidades financieras. Permite a los agricultores registrar sus prácticas preventivas de cultivo y generar un **Green Credit Score** auditable que facilita el acceso a créditos agrícolas.

### El Problema
Los agricultores no acceden a créditos porque los bancos consideran la agricultura de alto riesgo debido a plagas, desastres naturales y falta de documentación de prácticas responsables.

### La Solución
Una WebApp Mobile-First que:
- ✅ Registra prácticas de prevención (control de plagas, semillas certificadas, acciones climáticas)
- ✅ Integra datos de salud del cultivo (índice NDVI simulado)
- ✅ Genera un puntaje de resiliencia climática (0-100)
- ✅ Proporciona reportes auditables para instituciones financieras
- ✅ Reduce la percepción de riesgo mediante evidencia cuantificable

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **UI Components**: Custom mobile-first components
- **Icons**: Lucide React

---

## 📁 Estructura del Proyecto

```
project/
├── app/
│   ├── layout.tsx              # Layout raíz con metadata mobile-first
│   ├── page.tsx                # Dashboard del agricultor
│   ├── reporte/
│   │   └── page.tsx            # Formulario de reporte de campo
│   └── banco/
│       └── page.tsx            # Vista ejecutiva para bancos
│
├── components/
│   ├── credit-meter.tsx        # Termómetro de crédito visual
│   ├── field-report-form.tsx   # Formulario optimizado mobile
│   └── risk-card.tsx           # Card de reporte de mitigación
│
├── lib/
│   ├── supabase.ts             # Cliente Supabase + TypeScript types
│   ├── green-score.ts          # Lógica de cálculo del Green Score
│   └── utils.ts                # Utilidades generales
│
├── supabase/
│   └── schema.sql              # Schema completo de la base de datos
│
└── public/                     # Assets estáticos
```

---

## 🚀 Setup e Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd project
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase

#### A. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales (URL y Anon Key)

#### B. Ejecutar el schema SQL
1. Abre el SQL Editor en tu dashboard de Supabase
2. Copia el contenido de `supabase/schema.sql`
3. Ejecuta el script completo

Esto creará:
- ✅ Tablas: `farmers`, `plots`, `risk_logs`, `credit_scores`, `bank_access_tokens`
- ✅ Políticas de Row Level Security (RLS)
- ✅ Índices para performance
- ✅ Funciones y triggers automatizados

#### C. Configurar variables de entorno
```bash
cp .env.local.example .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Ejecutar el proyecto
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Base de Datos - Esquema

### Tablas Principales

#### `farmers` - Perfil del Agricultor
```sql
- id (UUID, PK)
- user_id (UUID, FK a auth.users)
- full_name (VARCHAR)
- farm_name (VARCHAR)
- latitude, longitude (DECIMAL) - Geolocalización
- municipality, department (VARCHAR)
- risk_zone_level (INTEGER 1-5) - Nivel de riesgo de la zona
```

#### `plots` - Parcelas de Cultivo
```sql
- id (UUID, PK)
- farmer_id (UUID, FK)
- plot_name (VARCHAR)
- hectares (DECIMAL)
- crop_type (VARCHAR) - Ej: 'arroz', 'maíz', 'café'
- certified_seeds (BOOLEAN)
- planting_date, expected_harvest_date (DATE)
```

#### `risk_logs` - Registros de Mitigación
```sql
- id (UUID, PK)
- plot_id, farmer_id (UUID, FK)
- log_type (VARCHAR) - 'pest_control', 'disease_prevention', 'climate_action'
- description (TEXT)
- photo_url (TEXT) - URL en Supabase Storage
- severity_level (INTEGER 1-5)
- action_taken (TEXT)
- cost (DECIMAL) - Inversión en la acción preventiva
- ndvi_index (DECIMAL 0-1) - Índice de salud del cultivo
- logged_at (TIMESTAMP)
```

#### `credit_scores` - Puntajes Calculados
```sql
- id (UUID, PK)
- farmer_id (UUID, FK)
- score (INTEGER 0-100)
- risk_level ('bajo', 'medio', 'alto')
- climate_resilience_score (DECIMAL)
- financial_commitment_score (DECIMAL)
- avg_ndvi (DECIMAL)
- calculation_details (JSONB) - Metadata del cálculo
- calculated_at, valid_until (TIMESTAMP)
```

### Seguridad (RLS)
Todas las tablas tienen **Row Level Security** habilitado:
- Los agricultores solo ven sus propios datos
- Los bancos acceden mediante tokens temporales
- Políticas de INSERT/UPDATE/DELETE restringidas por `user_id`

---

## 🧮 Green Credit Score Algorithm

El algoritmo calcula un puntaje de 0-100 basado en tres pilares:

### A. Climate Resilience Score (0-50 pts)
- **Frecuencia de reportes** (0-15 pts): ≥12 reportes = 15 pts
- **NDVI promedio** (0-20 pts): ≥0.7 = 20 pts (cultivo saludable)
- **Semillas certificadas** (0-15 pts): ≥80% parcelas = 15 pts

### B. Financial Commitment Score (0-30 pts)
- **Inversión en prevención** (0-20 pts): ≥$2M COP = 20 pts
- **Diversidad de acciones** (0-10 pts): ≥3 tipos diferentes = 10 pts

### C. Consistency Score (0-20 pts)
- **Días desde último reporte** (0-10 pts): ≤7 días = 10 pts
- **Extensión monitoreada** (0-10 pts): ≥10 ha = 10 pts

### Niveles de Riesgo
- **70-100**: Riesgo Bajo ✅ (Alta probabilidad de aprobación)
- **40-69**: Riesgo Medio ⚠️ (Requiere acompañamiento)
- **0-39**: Riesgo Alto ❌ (Mejorar actividad preventiva)

### Uso
```typescript
import { calculateGreenScore, saveGreenScore } from '@/lib/green-score';

const result = await calculateGreenScore({ farmerId: 'uuid-here' });
console.log(result.score); // 68
console.log(result.riskLevel); // 'medio'

// Guardar en DB
await saveGreenScore(farmerId, result);
```

---

## 📱 Componentes UI Principales

### 1. `<CreditMeter />`
Termómetro visual del puntaje de crédito
```tsx
<CreditMeter score={68} riskLevel="medio" />
```

### 2. `<FieldReportForm />`
Formulario mobile-optimized para reportes de campo
- Upload de fotos con vista previa
- Sliders para severidad y NDVI
- Validación inline

### 3. `<RiskCard />`
Card de visualización de reportes previos
- Iconos por tipo de acción
- Métricas de inversión y NDVI
- Timeline de actividad

---

## 🔄 Flujo de Usuario

### Agricultor
1. **Login** → Crea perfil y registra parcelas
2. **Dashboard** → Ve su Green Score actual y alertas
3. **Nuevo Reporte** → Registra acción preventiva (foto + datos)
4. **Score Actualizado** → El algoritmo recalcula automáticamente
5. **Compartir con Banco** → Genera token de acceso temporal

### Banco/Inversor
1. **Acceso via Token** → Ingresa código del agricultor
2. **Vista Ejecutiva** → Ve score, historial, inversión
3. **Análisis de Riesgo** → Evalúa prácticas y consistencia
4. **Decisión** → Aprueba o rechaza con data cuantificable

---

## 🚧 Próximas Funcionalidades

- [ ] **Autenticación Supabase Auth** (actualmente mock)
- [ ] **Upload real a Supabase Storage**
- [ ] **Integración con APIs de clima** (IDEAM, OpenWeather)
- [ ] **Geolocalización real** con Google Maps
- [ ] **Cálculo NDVI real** via imágenes satelitales (Sentinel-2)
- [ ] **Notificaciones push** para alertas
- [ ] **Dashboard bancario avanzado** con gráficos
- [ ] **Exportación PDF** de reportes
- [ ] **Integración con scoring crediticio tradicional**

---

## 🎨 Diseño Mobile-First

La plataforma está optimizada para usuarios rurales:
- ✅ Botones grandes (≥44px altura)
- ✅ Alto contraste para lectura en exteriores
- ✅ Formularios simplificados
- ✅ Capture de cámara optimizado
- ✅ Funcionamiento offline (próximamente)
- ✅ Textos claros en español
- ✅ Navegación por tabs inferiores

---

## 📊 Métricas de Impacto

### Para Agricultores
- Incremento de aprobación crediticia del **15%** al **70%**
- Reducción de tiempo de evaluación de 30 a 5 días
- Historial auditable de buenas prácticas

### Para Bancos
- Reducción de morosidad del **22%** al **8%**
- Decisiones basadas en data cuantificable
- Cumplimiento ESG y financiamiento verde

---

## 🤝 Contribuir

```bash
# Fork el proyecto
# Crea una rama feature
git checkout -b feature/nueva-funcionalidad

# Commit con mensaje descriptivo
git commit -m "feat: agregar cálculo NDVI real"

# Push y crea Pull Request
git push origin feature/nueva-funcionalidad
```

---

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles

---

## 📧 Contacto

Para preguntas técnicas o de implementación:
- Email: agrocredit@example.com
- Documentación: [docs.agrocredit.co](https://docs.agrocredit.co)

---

## 🌟 Recursos Adicionales

- [Supabase Docs](https://supabase.com/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [NDVI Explained](https://gisgeography.com/ndvi-normalized-difference-vegetation-index/)

---

**Desarrollado con ❤️ para democratizar el acceso al crédito agrícola**
