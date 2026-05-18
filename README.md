# Juego2: Orbit Synthesis

Juego web en un solo archivo (`index.html`) hecho con Canvas (Vanilla JS). Mezcla fusión en órbita + defensa del Planeta Madre.

## Jugar

1. Abre `index.html` en tu navegador.
1. Pulsa **Jugar**.

## Controles

- **Ratón / táctil**: arrastra para apuntar y suelta para lanzar un satélite desde el borde.
- **H**: abrir/cerrar ayuda.
- **S**: activar/desactivar sonido.
- **R**: reiniciar después de perder.

## Cómo se juega

- Los satélites quedan atraídos por la gravedad del centro y tienden a orbitar.
- Si **dos satélites del mismo nivel** chocan, **se fusionan** y crean uno de **nivel +1** (más rango y daño).
- Los satélites disparan automáticamente a los asteroides en rango.
- Cada oleada aumenta la presión (más cantidad/velocidad).
- Pierdes si la vida del **Planeta Madre** llega a 0.

## Objetivo

Maximiza la puntuación creando **cadenas de fusiones** (combo) mientras aguantas oleadas.

## Desarrollo

No hay dependencias ni build: todo vive en `index.html`.
