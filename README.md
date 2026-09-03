# Gym Tracker (PWA)

App web instalable (PWA) para llevar el seguimiento de rutinas de gimnasio:

- **Rutinas** con nombre, lista de ejercicios, series y repeticiones objetivo.
- **Animaciones** de cada ejercicio (video en bucle o imagen).
- **Entrenamiento guiado**: registra repeticiones y peso de cada serie, con temporizador de descanso y referencia de la última sesión.
- **Histórico** de sesiones y **progreso** por ejercicio (peso máximo, volumen y récords) en gráficas.
- Funciona **sin conexión** y se puede **instalar** en el teléfono (Android/Chrome e iOS/Safari).
- Los datos se guardan en el dispositivo (localStorage). Se pueden **exportar/importar** en JSON desde la pestaña Progreso.

## Ejecutar en local

No hay paso de compilación. Sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# abre http://localhost:8080
```

> El service worker y la instalación PWA requieren HTTPS o `localhost`.

## Publicar

El workflow `.github/workflows/pages.yml` despliega automáticamente a GitHub Pages al hacer push a `main`.
Activa Pages en *Settings → Pages → Source: GitHub Actions* la primera vez.

## Instalar en el teléfono

- **Android (Chrome)**: pulsa "Instalar app" en la cabecera o *Menú → Instalar aplicación*.
- **iPhone (Safari)**: *Compartir → Añadir a pantalla de inicio*.

## Estructura

```
index.html            Interfaz base
app.js                Lógica de la app (rutinas, entrenamiento, historial, progreso)
styles.css            Estilos
sw.js                 Service worker (caché offline)
manifest.webmanifest  Manifest PWA
media/                Videos e imágenes de los ejercicios (+ miniaturas en thumbs/)
icons/                Íconos de la app
```
