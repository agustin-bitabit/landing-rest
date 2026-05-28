# Desplegar landing-rest con AWS SAM

La app vive en `src/` (misma estructura que en local). Lambda usa el entrypoint `src/lambda.mjs`. SAM empaqueta el proyecto, sube el zip a **S3** y crea/actualiza la función apuntando a ese artefacto.

## Requisitos

1. **Cuenta AWS** con permisos para CloudFormation, Lambda, S3, IAM y API Gateway.
2. **AWS CLI v2** instalado y configurado:
   ```bash
   aws configure
   ```
3. **SAM CLI** instalado:
   - Windows: [instalador AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
   - Verificar: `sam --version`
4. **Docker Desktop** en ejecución (recomendado en Windows para compilar `bcrypt` y dependencias nativas para Linux).

## Estructura relevante

```
landing-rest/
├── template.yaml      # Infra: Lambda + HTTP API + parámetros
├── samconfig.toml     # Se crea con sam deploy --guided (no commitear secretos)
├── .samignore         # Archivos que no van al zip de Lambda
├── package.json       # Dependencias (raíz del proyecto)
└── src/
    ├── lambda.mjs     # Handler Lambda (importa bootstrap, app, etc.)
    ├── main.js        # Solo para desarrollo local
    ├── app.js
    └── ...
```

## Paso 1 — Variables y parámetros

En local usás `.env`. En AWS, SAM inyecta variables desde **parámetros** del template (`MongoDbUri`, `JwtSecret`, Contentful, etc.).

Tené a mano:

| Parámetro (template) | Variable en runtime |
|----------------------|---------------------|
| `MongoDbUri` | `MONGODB_URI` |
| `JwtSecret` | `JWT_SECRET` |
| `ContentfulSpaceId` | `CONTENTFUL_SPACE_ID` |
| `ContentfulAccessToken` | `CONTENTFUL_ACCESS_TOKEN` |
| `CorsOrigin` | `CORS_ORIGIN` (varios orígenes separados por coma) |

MongoDB Atlas: permití acceso desde **cualquier IP** (`0.0.0.0/0`) en Network Access, o configurá VPC en Lambda (fuera del alcance de esta guía básica).

## Paso 2 — Instalar dependencias (local)

Desde la raíz del repo:

```bash
npm install
```

## Paso 3 — Build con SAM

```bash
npm run sam:build
```

Equivalente:

```bash
sam build --use-container
```

- `--use-container` instala `node_modules` dentro de una imagen Linux (necesario para `bcrypt` en Windows).
- El artefacto queda en `.aws-sam/build/`.

Probar en local (opcional):

```bash
sam local start-api --env-vars env.json
```

`env.json` (no subir a git):

```json
{
  "LandingApiFunction": {
    "MONGODB_URI": "mongodb+srv://...",
    "JWT_SECRET": "tu-secreto",
    "CONTENTFUL_SPACE_ID": "...",
    "CONTENTFUL_ACCESS_TOKEN": "..."
  }
}
```

## Paso 4 — Primer deploy (guided)

```bash
sam deploy --guided
```

Respondé aproximadamente:

| Pregunta | Sugerencia |
|----------|------------|
| Stack Name | `landing-rest` |
| AWS Region | ej. `us-east-1` |
| Confirm changes | `Y` |
| Allow SAM IAM role creation | `Y` |
| Disable rollback | `N` |
| Save arguments to config | `Y` |
| **Resolve S3** | `Y` (SAM crea/usará un bucket para subir el zip) |
| Function may not have authorization | `n` (API público; ajustá después si querés auth en API GW) |

Cuando pida **parameter overrides**, pasá tus valores (ejemplo):

```
MongoDbUri="mongodb+srv://user:pass@cluster.mongodb.net/db" JwtSecret="secreto-largo" ContentfulSpaceId="xxx" ContentfulAccessToken="yyy" CorsOrigin="https://d3ltjbgcp4q663.cloudfront.net"
```

Eso genera `samconfig.toml`. Los siguientes deploys pueden ser:

```bash
npm run sam:deploy
```

## Paso 5 — Cómo funciona S3 + Lambda

No subís el zip a mano:

1. `sam build` prepara el paquete en `.aws-sam/build/LandingApiFunction/`.
2. `sam deploy` sube ese zip a un **bucket S3** (si elegiste `resolve_s3 = true`).
3. CloudFormation actualiza la función Lambda con `S3Bucket` + `S3Key` del artefacto.

En la consola de Lambda verás el código desplegado desde S3 en cada actualización del stack.

## Paso 6 — Probar el API desplegado

Al terminar el deploy, SAM muestra el output `HttpApiUrl`, por ejemplo:

```
https://abc123.execute-api.us-east-1.amazonaws.com
```

Pruebas:

```bash
curl https://TU_URL/health
curl https://TU_URL/api/testimonials
```

Si la URL pública incluye stage o prefijo extra (API Gateway antiguo o proxy), definí en parámetros:

- `ApiGatewayStage=default`
- `ApiBasePath=landing-back`

## Paso 7 — Actualizar código

Tras cambiar archivos en `src/`:

```bash
npm run sam:build
npm run sam:deploy
```

## Paso 8 — Solo subir código a S3 (avanzado)

Si ya tenés stack y solo querés actualizar la función sin pasar por CloudFormation completo:

```bash
sam build --use-container
sam deploy --no-execute-changeset   # opcional, para revisar
```

O publicar el paquete y usar CLI:

```bash
aws cloudformation package \
  --template-file template.yaml \
  --s3-bucket TU_BUCKET \
  --output-template-file packaged.yaml

aws cloudformation deploy \
  --template-file packaged.yaml \
  --stack-name landing-rest \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides MongoDbUri=... JwtSecret=...
```

## Errores frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| `Cannot find module 'bcrypt'` o error ELF | Volvé a build con `sam build --use-container` |
| Timeout / Mongo no conecta | URI, IP whitelist en Atlas, timeout de Lambda (30s en template) |
| 404 en todas las rutas | `API_GATEWAY_STAGE` / `API_BASE_PATH` |
| CORS en el navegador | `CorsOrigin` con la URL exacta del front (sin `/` final) |
| Handler not found | Handler debe ser `src/lambda.handler` y existir `export const handler` en `src/lambda.mjs` |

## Limpieza

Borrar stack y recursos:

```bash
sam delete --stack-name landing-rest
```
