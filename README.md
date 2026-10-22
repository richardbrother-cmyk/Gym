# Gym Tracker (PWA)

**App publicada en: https://gym.consultoriaconfia.com**

App web instalable (PWA) para llevar el seguimiento de rutinas de gimnasio:

- **Rutinas** con nombre, lista de ejercicios, series y repeticiones objetivo.
- **Animaciones** de cada ejercicio (video en bucle o imagen) y **fichas técnicas** con descripción, músculos, ejecución paso a paso, consejos, errores comunes y fuentes (`exercise-info.js`).
- **Entrenamiento guiado**: registra repeticiones y peso de cada serie, con temporizador de descanso, notificación al terminar el descanso (aunque la app esté en segundo plano) y referencia de la última sesión.
- **Histórico** de sesiones y **progreso** por ejercicio (peso máximo, volumen y récords) en gráficas.
- **Copia en la nube** opcional (Cloudflare Worker + KV, carpeta `worker/`): con una frase secreta, cada cambio se sube solo y se restaura al abrir la app en un teléfono vacío; también sincroniza entre dispositivos.
- Funciona **sin conexión** y se puede **instalar** en el teléfono (Android/Chrome e iOS/Safari).
- Los datos se guardan en el dispositivo (localStorage, con copia espejo en IndexedDB que se restaura sola si el navegador vacía el almacenamiento). La app pide almacenamiento persistente, avisa cuando la última copia tiene más de 7 días y permite **exportar/importar** en JSON desde Ajustes o Progreso (en el móvil usa la hoja de compartir).

> **Importante en iPhone**: Safari borra los datos de las webs tras 7 días sin usarlas. Instala la app en la pantalla de inicio para evitarlo.

## Ejecutar en local

No hay paso de compilación. Sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# abre http://localhost:8080
```

> El service worker y la instalación PWA requieren HTTPS o `localhost`.

## Publicar

La app se publica con **Cloudflare Pages**, conectado a este repositorio: cada push a la rama
`claude/pwa-gym-routine-tracker-xu2pm2` se despliega automáticamente en https://gym.consultoriaconfia.com
(sin comando de build, directorio de salida `/`). El dominio propio da a la app su propio
almacenamiento en el navegador, independiente de otras apps publicadas en `github.io`.

El workflow `.github/workflows/pages.yml` (GitHub Pages) se conserva como alternativa; solo actúa si existe una rama `main`.

## Instalar en el teléfono

Abre https://gym.consultoriaconfia.com y:

- **Android (Chrome)**: pulsa "Instalar app" en la cabecera o *Menú → Instalar aplicación*.
- **iPhone (Safari)**: *Compartir → Añadir a pantalla de inicio*.

> Si Chrome dice que la app ya está instalada, búscala en el cajón de aplicaciones o en
> *Ajustes → Aplicaciones*. No borres los datos del navegador: eso elimina el historial de la app.
> Guarda antes una copia desde *Ajustes → Tus datos*.

## Estructura

```
index.html            Interfaz base
app.js                Lógica de la app (rutinas, entrenamiento, historial, progreso)
exercise-info.js      Fichas técnicas de los ejercicios
styles.css            Estilos
sw.js                 Service worker (caché offline)
manifest.webmanifest  Manifest PWA
media/                Videos e imágenes de los ejercicios (+ miniaturas en thumbs/)
worker/               Worker de Cloudflare para la copia en la nube (ver worker/README.md)
icons/                Íconos de la app
```
