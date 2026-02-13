# Guía de Abreviaturas CSS (Bootstrap)

## 📏 Márgenes (Margin)

| Abreviatura | Significado       | Descripción                       |
| ----------- | ----------------- | --------------------------------- |
| `m`         | margin            | Margen en todos los lados         |
| `mt`        | margin-top        | Margen superior                   |
| `mb`        | margin-bottom     | Margen inferior                   |
| `ms`        | margin-start      | Margen izquierdo (RTL compatible) |
| `me`        | margin-end        | Margen derecho (RTL compatible)   |
| `mx`        | margin horizontal | Margen izquierdo + derecho        |
| `my`        | margin vertical   | Margen superior + inferior        |

**Ejemplo de uso:**

- `mb-3` = margin-bottom: 1rem
- `mx-auto` = margin horizontal automático (centrar)
- `mt-5` = margin-top: 3rem

## 📦 Rellenos (Padding)

| Abreviatura | Significado        | Descripción                 |
| ----------- | ------------------ | --------------------------- |
| `p`         | padding            | Relleno en todos los lados  |
| `pt`        | padding-top        | Relleno superior            |
| `pb`        | padding-bottom     | Relleno inferior            |
| `ps`        | padding-start      | Relleno izquierdo           |
| `pe`        | padding-end        | Relleno derecho             |
| `px`        | padding horizontal | Relleno izquierdo + derecho |
| `py`        | padding vertical   | Relleno superior + inferior |

**Ejemplo de uso:**

- `p-4` = padding: 1.5rem en todos los lados
- `px-3` = padding horizontal de 1rem
- `py-2` = padding vertical de 0.5rem

## 📐 Tamaños (Width/Height)

| Abreviatura | Significado     | Descripción               |
| ----------- | --------------- | ------------------------- |
| `w`         | width           | Ancho                     |
| `h`         | height          | Alto                      |
| `mw`        | max-width       | Ancho máximo              |
| `mh`        | max-height      | Alto máximo               |
| `vw`        | viewport width  | Ancho relativo a viewport |
| `vh`        | viewport height | Alto relativo a viewport  |

**Ejemplo de uso:**

- `w-100` = width: 100%
- `h-50` = height: 50%
- `mw-100` = max-width: 100%

## 🎨 Display

| Clase            | Descripción           |
| ---------------- | --------------------- |
| `d-none`         | display: none         |
| `d-block`        | display: block        |
| `d-flex`         | display: flex         |
| `d-inline`       | display: inline       |
| `d-inline-block` | display: inline-block |
| `d-grid`         | display: grid         |

## 📱 Flexbox

| Abreviatura        | Significado         | Descripción               |
| ------------------ | ------------------- | ------------------------- |
| `justify-content-` | justify-content     | Alineación horizontal     |
| `align-items-`     | align-items         | Alineación vertical       |
| `flex-`            | flex direction/wrap | Dirección y envolvimiento |

**Valores comunes:**

- `justify-content-start` = al inicio
- `justify-content-center` = centrado
- `justify-content-between` = espaciado entre elementos
- `align-items-center` = centrado vertical
- `flex-column` = dirección en columna
- `flex-row` = dirección en fila

## 📝 Texto

| Abreviatura   | Significado        | Descripción          |
| ------------- | ------------------ | -------------------- |
| `text-start`  | text-align: left   | Texto a la izquierda |
| `text-center` | text-align: center | Texto centrado       |
| `text-end`    | text-align: right  | Texto a la derecha   |
| `fw-`         | font-weight        | Peso de la fuente    |
| `fs-`         | font-size          | Tamaño de fuente     |

**Ejemplo de uso:**

- `text-center` = centrar texto
- `fw-bold` = texto en negrita
- `fs-4` = tamaño de fuente nivel 4

## 🎯 Espaciado (Gap)

| Clase          | Descripción                        |
| -------------- | ---------------------------------- |
| `g-3`          | gap: 1rem (en grid/flex)           |
| `gap-2`        | gap: 0.5rem                        |
| `row-gap-3`    | espacio vertical entre elementos   |
| `column-gap-2` | espacio horizontal entre elementos |

## 🔢 Sistema de Espaciado Bootstrap

Los números del 0 al 5 representan diferentes tamaños:

| Número | Tamaño        |
| ------ | ------------- |
| `0`    | 0             |
| `1`    | 0.25rem (4px) |
| `2`    | 0.5rem (8px)  |
| `3`    | 1rem (16px)   |
| `4`    | 1.5rem (24px) |
| `5`    | 3rem (48px)   |
| `auto` | automático    |

## 🎨 Colores (Background y Texto)

| Abreviatura | Descripción      |
| ----------- | ---------------- |
| `bg-`       | Background color |
| `text-`     | Text color       |

**Colores comunes:**

- `bg-primary` / `text-primary` = azul principal
- `bg-success` / `text-success` = verde (éxito)
- `bg-danger` / `text-danger` = rojo (error)
- `bg-warning` / `text-warning` = amarillo (advertencia)
- `bg-light` / `text-light` = claro
- `bg-dark` / `text-dark` = oscuro

## 🔲 Bordes

| Abreviatura     | Descripción                |
| --------------- | -------------------------- |
| `border`        | Borde en todos los lados   |
| `border-top`    | Borde superior             |
| `border-bottom` | Borde inferior             |
| `border-start`  | Borde izquierdo            |
| `border-end`    | Borde derecho              |
| `rounded`       | Bordes redondeados         |
| `rounded-3`     | Bordes redondeados grandes |

## 🔍 Responsive (Breakpoints)

Añade el breakpoint antes de la propiedad:

| Breakpoint | Tamaño  | Ejemplo     |
| ---------- | ------- | ----------- |
| (ninguno)  | <576px  | `mb-3`      |
| `sm-`      | ≥576px  | `mb-sm-3`   |
| `md-`      | ≥768px  | `d-md-flex` |
| `lg-`      | ≥992px  | `px-lg-5`   |
| `xl-`      | ≥1200px | `mt-xl-4`   |
| `xxl-`     | ≥1400px | `p-xxl-5`   |

**Ejemplo de uso:**

- `d-none d-md-block` = Oculto en móviles, visible en tablets+
- `mb-2 mb-lg-5` = Margen inferior pequeño en móvil, grande en desktop

## 📋 Combinaciones Comunes

```html
<!-- Centrar contenido -->
<div class="d-flex justify-content-center align-items-center">
  <!-- Espaciado uniforme -->
  <div class="p-4 mb-3 mx-auto">
    <!-- Card con sombra y bordes -->
    <div class="border rounded-3 shadow-sm bg-light p-4">
      <!-- Texto centrado con margen -->
      <h3 class="text-center mb-4 fw-bold">
        <!-- Grid con espaciado -->
        <div class="row g-3 mb-3"></div>
      </h3>
    </div>
  </div>
</div>
```

## 💡 Consejos

1. **x** = horizontal (izquierda + derecha)
2. **y** = vertical (arriba + abajo)
3. **s** = start (izquierda en LTR)
4. **e** = end (derecha en LTR)
5. **t** = top (arriba)
6. **b** = bottom (abajo)

---

_Última actualización: Febrero 2026_
