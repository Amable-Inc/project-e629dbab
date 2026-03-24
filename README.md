# 🌱 AgroCredit - MVP Plataforma de Crédito Verde (Solo Frontend)

## 📋 Descripción

**AgroCredit** es una plataforma AgTech/FinTech que democratiza el acceso al crédito agrícola mediante un **Green Credit Score** calculado a partir de prácticas preventivas de cultivo.

Este MVP es **100% frontend** con datos simulados en JSON (sin backend).

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir navegador
http://localhost:3000
```

¡Listo! La aplicación funciona con datos mock.

---

## 📁 Estructura del Proyecto

```
project/
├── app/
│   ├── page.tsx              # Dashboard del agricultor
│   ├── reporte/page.tsx      # Formulario de reportes
│   ├── perfil/page.tsx       # Perfil del agricultor
│   ├── compartir/page.tsx    # Tokens de acceso bancario
│   └── banco/page.tsx        # Vista ejecutiva bancos
│
├── components/
│   ├── credit-meter.tsx      # Termómetro de crédito
│   ├── field-report-form.tsx # Formulario de reportes
│   └── risk-card.tsx         # Card de actividad
│
├── data/                     # Base de datos JSON mock
│   ├── farmers.json
│   ├── plots.json
│   ├── risk-logs.json
│   ├── credit-scores.json
│   └── bank-tokens.json
│
└── lib/
    ├── db.ts                 # API simulada (CRUD)
    └── utils.ts
```

---

## 🎯 Funcionalidades

### Para Agricultores

#### 1. Dashboard (`/`)
- Ver **Green Credit Score** (0-100)
- Alertas climáticas
- Reportes recientes
- Métricas de actividad

#### 2. Nuevo Reporte (`/reporte`)
- Seleccionar parcela
- Tipo de acción (plagas, clima, prevención)
- Subir foto de evidencia
- Nivel de severidad (1-5)
- Índice NDVI (salud del cultivo)
- Costo de la acción

#### 3. Mi Perfil (`/perfil`)
- Información personal
- Datos de la finca
- Gestión de parcelas
- Estadísticas de membresía

#### 4. Compartir (`/compartir`)
- Generar tokens de acceso bancario
- Copiar tokens
- Revocar acceso
- Ver accesos realizados

### Para Bancos

#### Vista Banco (`/banco`)
- Acceso mediante token
- Perfil completo del agricultor
- Green Credit Score desglosado
- Historial de inversiones
- Recomendación de crédito

---

## 💾 Base de Datos JSON

### Datos Mock Incluidos

**Agricultores:** 2 perfiles
- Juan Pérez García (Finca El Progreso)
- María González (Finca La Esperanza)

**Parcelas:** 3 lotes
- Lote Norte (Arroz, 5 ha)
- Lote Sur (Maíz, 4.5 ha)
- Parcela Este (Café, 3 ha)

**Reportes:** 8 registros de mitigación
- Control de plagas
- Prevención de enfermedades
- Acciones climáticas

**Tokens:** 2 tokens activos
- Banco Agrario
- Bancolombia

### API Simulada (`lib/db.ts`)

```typescript
import { db } from '@/lib/db';

// Obtener agricultor
const farmer = await db.getFarmer('farmer-1');

// Parcelas por agricultor
const plots = await db.getPlotsByFarmerId('farmer-1');

// Reportes recientes
const logs = await db.getRiskLogsByFarmerId('farmer-1', 5);

// Credit Score
const score = await db.getCreditScoreByFarmerId('farmer-1');

// Crear nuevo reporte
await db.createRiskLog({
  plotId: 'plot-1',
  farmerId: 'farmer-1',
  logType: 'pest_control',
  description: 'Control de plagas...',
  cost: 350000,
  ndviIndex: 0.68,
  loggedAt: new Date().toISOString(),
});
```

---

## 🧮 Algoritmo Green Credit Score

### Cálculo Automático (0-100)

**Resiliencia Climática (0-50 pts)**
- Frecuencia de reportes: 0-15 pts
- NDVI promedio: 0-20 pts
- Semillas certificadas: 0-15 pts

**Compromiso Financiero (0-30 pts)**
- Inversión en prevención: 0-20 pts
- Diversidad de acciones: 0-10 pts

**Consistencia (0-20 pts)**
- Días desde último reporte: 0-10 pts
- Extensión monitoreada: 0-10 pts

### Niveles de Riesgo

| Puntaje | Riesgo | Color |
|---------|--------|-------|
| 70-100 | Bajo | 🟢 Verde |
| 40-69 | Medio | 🟡 Amarillo |
| 0-39 | Alto | 🔴 Rojo |

---

## 🎨 Diseño Mobile-First

La plataforma está optimizada para usuarios rurales:
- ✅ Botones grandes (≥44px)
- ✅ Alto contraste
- ✅ Navegación intuitiva
- ✅ Íconos visuales
- ✅ Optimizado para pantallas 320px+

---

## 🧪 Testing

### Datos de Prueba

**Usuario Agricultor:**
- ID: `farmer-1`
- Nombre: Juan Pérez García
- Finca: El Progreso
- Score actual: 68/100 (Riesgo Medio)

**Tokens Bancarios Válidos:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6  (Banco Agrario)
x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4  (Bancolombia)
```

### Flujo de Testing

1. **Dashboard**: Ver score y alertas
2. **Nuevo Reporte**: Llenar formulario y enviar
3. **Perfil**: Editar información
4. **Compartir**: Generar nuevo token
5. **Banco**: Ingresar token y ver perfil

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data**: JSON local (simulación)

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Ejecutar producción
npm start

# Linter
npm run lint
```

---

## 🔄 Próximos Pasos (Backend Real)

Para migrar a producción con backend:

1. **Instalar Supabase**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Reemplazar `lib/db.ts`** con cliente Supabase

3. **Migrar JSON a PostgreSQL**
   - Ejecutar schema SQL
   - Importar datos iniciales

4. **Configurar Storage** para fotos

5. **Agregar Auth** (SMS/Email)

Ver: `DEPLOYMENT.md` para guía completa.

---

## 📞 Soporte

- **Documentación**: Ver `USER_GUIDE.md`
- **Arquitectura**: Ver `ARCHITECTURE.md`
- **Deployment**: Ver `DEPLOYMENT.md`
- **Pitch**: Ver `EXECUTIVE_SUMMARY.md`

---

## 📄 Licencia

MIT License

---

**Desarrollado con ❤️ para democratizar el acceso al crédito agrícola**
