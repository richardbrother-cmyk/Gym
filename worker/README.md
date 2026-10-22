# Worker de respaldo en la nube (Cloudflare Workers + KV)

Guarda una copia de los datos de Gym Tracker en Cloudflare KV, identificada por un
**código de sincronización** (una frase que elige el usuario). La app sube la copia sola
tras cada cambio y la restaura al abrirla en un teléfono vacío.

## Puesta en marcha (una sola vez)

### Opción A: desde la terminal (recomendada)

```bash
cd worker
npx wrangler login
npx wrangler kv namespace create GYM_KV      # copia el id que devuelve
# pega el id en wrangler.toml → [[kv_namespaces]] id = "..."
npx wrangler secret put SALT                  # escribe cualquier frase larga y aleatoria
npx wrangler deploy
```

`wrangler.toml` ya incluye la ruta `gym.consultoriaconfia.com/api/*`, así que la app
llama a `/api/backup` en su propio dominio sin configurar ninguna URL.

### Opción B: desde el panel de Cloudflare

1. **Workers & Pages → KV → Create namespace**: nombre `GYM_KV`.
2. **Workers & Pages → Create → Start with Hello World**, nombre `gym-sync`. Pega el contenido
   de `src/index.js` en el editor y despliega.
3. En el Worker: **Settings → Bindings → Add → KV namespace**: variable `GYM_KV`, namespace `GYM_KV`.
4. **Settings → Variables and Secrets**: añade el secreto `SALT` (frase larga aleatoria) y la
   variable `ALLOWED_ORIGINS` = `https://gym.consultoriaconfia.com`.
5. **Settings → Domains & Routes → Add → Route**: `gym.consultoriaconfia.com/api/*`, zona
   `consultoriaconfia.com`.

## Comprobar

```bash
curl -i https://gym.consultoriaconfia.com/api/backup -H "X-Sync-Key: $(printf 'prueba' | sha256sum | cut -d' ' -f1)"
# → 200 {"exists":false}  (correcto: aún no hay copia para ese código)
```

## Seguridad

- La frase nunca sale del teléfono: la app envía su SHA-256 y el Worker lo vuelve a
  derivar con el secreto `SALT` antes de usarlo como clave de KV.
- Quien conozca la frase puede leer y sobrescribir esa copia: usa una frase larga.
- Límite de 4 MB por copia (suficiente para años de entrenamientos).
