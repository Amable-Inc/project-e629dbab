# 🚀 Guía de Deployment - AgroCredit

Esta guía te ayudará a desplegar la plataforma AgroCredit en producción usando Vercel y Supabase.

---

## 📋 Pre-requisitos

- [ ] Cuenta en [Vercel](https://vercel.com)
- [ ] Cuenta en [Supabase](https://supabase.com)
- [ ] Git instalado
- [ ] Node.js 18+ instalado

---

## 🗄️ Paso 1: Configurar Supabase

### 1.1 Crear Proyecto
1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click en "New Project"
3. Completa:
   - **Name**: agrocredit-prod
   - **Database Password**: (genera una segura)
   - **Region**: South America (São Paulo) - Para menor latencia
4. Espera 2-3 minutos a que el proyecto se inicialice

### 1.2 Ejecutar Schema SQL
1. En tu proyecto Supabase, ve a **SQL Editor**
2. Copia y pega el contenido completo de `supabase/schema.sql`
3. Click en **Run** (esquina inferior derecha)
4. Verifica que todas las tablas se crearon:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   Deberías ver: `farmers`, `plots`, `risk_logs`, `credit_scores`, `bank_access_tokens`

### 1.3 Configurar Storage Bucket
1. Ve a **Storage** en el menú lateral
2. Click en "Create a new bucket"
3. Nombre: `risk-logs-photos`
4. **Public bucket**: NO (privado)
5. Click en "Create bucket"
6. En la configuración del bucket, agrega políticas:
   ```sql
   -- Permitir a usuarios subir sus propias fotos
   CREATE POLICY "Users can upload own photos"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'risk-logs-photos' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Permitir a usuarios ver sus propias fotos
   CREATE POLICY "Users can view own photos"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'risk-logs-photos' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### 1.4 Copiar Credenciales
1. Ve a **Project Settings** > **API**
2. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🌐 Paso 2: Desplegar en Vercel

### 2.1 Conectar Repositorio
1. Push tu código a GitHub/GitLab/Bitbucket
   ```bash
   git add .
   git commit -m "feat: initial AgroCredit MVP"
   git push origin main
   ```

2. Ve a [vercel.com/new](https://vercel.com/new)
3. Click en "Import Project"
4. Selecciona tu repositorio

### 2.2 Configurar Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (si tu proyecto está en la raíz)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### 2.3 Configurar Variables de Entorno
En la sección "Environment Variables", agrega:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production |

Click en "Deploy" 🚀

---

## ✅ Paso 3: Verificación Post-Deployment

### 3.1 Smoke Tests
Una vez desplegado, verifica:

1. **Homepage carga**
   - Abre: `https://tu-app.vercel.app`
   - Debería ver el Dashboard con datos mock

2. **Navegación funciona**
   - Click en "Nuevo Reporte de Campo"
   - Click en "Perfil"
   - Click en "Compartir"

3. **Responsive Design**
   - Abre Chrome DevTools (F12)
   - Toggle "Device Toolbar" (Ctrl+Shift+M)
   - Prueba en iPhone SE, iPhone 12 Pro, iPad

### 3.2 Test de Integración Supabase
1. Abre la consola del navegador (F12 > Console)
2. Ejecuta:
   ```javascript
   // Test conexión Supabase
   fetch('https://xxxxx.supabase.co/rest/v1/', {
     headers: {
       'apikey': 'tu-anon-key',
       'Authorization': 'Bearer tu-anon-key'
     }
   }).then(r => r.ok ? console.log('✅ Supabase OK') : console.error('❌ Error'));
   ```

---

## 🔐 Paso 4: Configurar Autenticación (Opcional)

### 4.1 Habilitar Email Auth
1. En Supabase, ve a **Authentication** > **Providers**
2. Habilita **Email**
3. Configura templates de email:
   - **Confirm signup**: Personaliza el mensaje
   - **Magic Link**: Habilitar si prefieres login sin password

### 4.2 Habilitar SMS Auth (Para Agricultores)
1. Ve a **Authentication** > **Providers**
2. Habilita **Phone**
3. Configura proveedor SMS:
   - **Twilio** (recomendado para Colombia)
   - Agrega credenciales de Twilio:
     - Account SID
     - Auth Token
     - Phone Number

### 4.3 Actualizar Frontend
En `lib/supabase.ts`, agrega:
```typescript
export async function signInWithPhone(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });
  return { data, error };
}

export async function verifyOTP(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: token,
    type: 'sms',
  });
  return { data, error };
}
```

---

## 🎨 Paso 5: Personalización del Dominio

### 5.1 Agregar Dominio Personalizado
1. En Vercel, ve a tu proyecto > **Settings** > **Domains**
2. Click en "Add"
3. Ingresa tu dominio: `agrocredit.co`
4. Sigue las instrucciones para configurar DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 5.2 Certificado SSL
- Vercel genera automáticamente un certificado SSL (Let's Encrypt)
- Espera 5-10 minutos para propagación

---

## 📊 Paso 6: Monitoring y Analytics

### 6.1 Vercel Analytics
1. En tu proyecto Vercel, ve a **Analytics**
2. Habilita **Web Analytics**
3. Monitorea:
   - **Visitors**: Usuarios únicos
   - **Page Views**: Vistas totales
   - **Top Pages**: Páginas más visitadas

### 6.2 Supabase Monitoring
1. En Supabase, ve a **Project Settings** > **API**
2. Monitorea:
   - **API Requests**: Llamadas a la DB
   - **Auth Users**: Usuarios registrados
   - **Storage Used**: Espacio consumido

### 6.3 Error Tracking con Sentry (Opcional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Configura en `next.config.ts`:
```typescript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Tu configuración de Next.js
}, {
  org: 'agrocredit',
  project: 'agrocredit-mvp',
});
```

---

## 🔄 Paso 7: CI/CD Automático

Vercel ya configura CI/CD automáticamente:
- ✅ **Push a `main`** → Deploy automático a producción
- ✅ **Pull Request** → Preview deployment con URL única
- ✅ **Rollback** → Un click para volver a versión anterior

### Custom Workflow
Si necesitas pasos adicionales, crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      # Vercel se encarga del deploy automáticamente
```

---

## 📱 Paso 8: Progressive Web App (PWA)

### 8.1 Instalar next-pwa
```bash
npm install next-pwa
```

### 8.2 Configurar
En `next.config.ts`:
```typescript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Tu configuración actual
});
```

### 8.3 Crear Manifest
`public/manifest.json`:
```json
{
  "name": "AgroCredit",
  "short_name": "AgroCredit",
  "description": "Plataforma de Crédito Verde para Agricultores",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch from Supabase"
```bash
# Verifica que las env vars estén configuradas
vercel env pull

# Redeploy
vercel --prod
```

### Error: "Build failed"
```bash
# Verifica tipos de TypeScript localmente
npm run type-check

# Si hay errores, arregla y push
git add .
git commit -m "fix: typescript errors"
git push
```

### Error: "RLS policy violation"
```sql
-- Verifica que las políticas RLS estén activas
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 📈 Optimización de Performance

### 1. Image Optimization
```typescript
// En componentes, usa next/image
import Image from 'next/image';

<Image 
  src="/hero.jpg" 
  width={1200} 
  height={600} 
  alt="Hero"
  priority // Para imágenes above-the-fold
/>
```

### 2. Code Splitting
```typescript
// Lazy load componentes pesados
const FieldReportForm = dynamic(() => import('@/components/field-report-form'), {
  loading: () => <p>Cargando...</p>,
});
```

### 3. Database Indexes
Ya están configurados en `schema.sql`, pero verifica:
```sql
-- Explica queries lentas
EXPLAIN ANALYZE 
SELECT * FROM risk_logs WHERE farmer_id = 'uuid' ORDER BY logged_at DESC;
```

---

## 🎉 Checklist Final

- [ ] Supabase configurado (DB + Storage + Auth)
- [ ] Vercel desplegado con env vars
- [ ] Dominio personalizado configurado
- [ ] SSL activo
- [ ] Analytics habilitado
- [ ] PWA instalable en móviles
- [ ] Tests smoke passed
- [ ] Documentación actualizada

---

## 🆘 Soporte

- **Documentación**: [docs.agrocredit.co](https://docs.agrocredit.co)
- **Issues**: GitHub Issues
- **Email**: support@agrocredit.co

---

**¡Felicitaciones! 🚀 AgroCredit está en producción.**
