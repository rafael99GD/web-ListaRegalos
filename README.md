# 🎄 Lista de Deseos & Regalos (Navidad & Cumpleaños) | Rafael

Una aplicación web moderna, interactiva y festiva diseñada para compartir deseos de Navidad, Reyes Magos y Cumpleaños con familiares y amigos.

Alojada de forma **100% gratuita** con **GitHub Pages** y respaldada en tiempo real por **Google Firebase** (Firestore + Auth).

---

## ✨ Características Principales

1. **💌 Carta Personal Interactiva**:
   - Sobre vintage con sello de cera lacrado interactivo (`R`).
   - Al pulsar el sello, se reproduce un crujido de papel y se despliega una carta personal en pergamino con tipografía editorial y firma manuscrita.
   - Totalmente editable en tiempo real desde el Panel de Administración sin tener que tocar código.

2. **🎴 Modo Tinder (Tarjetas Deslizables)**:
   - Desliza a los lados con gestos táctiles o botones (`⬅️ Siguiente`, `➡️ Me lo pido`).
   - Efecto físico 3D para **girar la tarjeta (`🔄`)** y consultar la ficha técnica: por qué lo quiero, notas personales, enlaces a tiendas oficiales y precios estimados.
   - Sellos visuales festivos: *"¡ME LO PIDO!"* y *"SIGUIENTE"*.

3. **📑 Modo Galería Boutique**:
   - Alterna entre el modo deslizante (Tinder) y una cuadrícula completa estilo catálogo.
   - Ideal para comparar precios o ver todos los regalos de un solo vistazo.

4. **🔒 Sistema de Reservas Seguro y Anti-Duplicados**:
   - Cualquier familiar o amigo puede marcar un regalo como *"¡Me lo pido para regalárselo!"*.
   - Al reservarlo, se lanza confeti festivo y un sonido de campanilla celestial.
   - **Regla de Seguridad**: Solo la persona que reservó el regalo o Rafael (Admin) tienen permiso para restaurarlo a disponible. Ningún otro usuario puede desmarcar un regalo ajeno.

5. **👥 Visibilidad y Audiencias Segmentadas**:
   - Puedes asignar regalos para que solo aparezcan a usuarios o grupos específicos (ej: Solo visible para *Mamá*, solo para *Familia*, solo para *Amigos*, o para *Todos*).

6. **🤫 Modo Sorpresa para Rafael (Admin)**:
   - Como Rafael es el destinatario de los regalos, el panel de control incluye un conmutador inteligente:
     - **Modo Sorpresa Activo**: Muestra los regalos como reservados con una caja misteriosa, sin revelar quién lo compró para no arruinar la sorpresa del día de Reyes o Cumpleaños.
     - **Modo Supervisor**: Revela los nombres de los compradores en caso de necesitar coordinar algo.

7. **👑 Panel de Administración Completo**:
   - Crear, editar y eliminar regalos.
   - Subida y vista previa inmediata de fotos, precios y enlaces.
   - Editor de la carta en vivo.
   - Gestor de usuarios y familias.
   - Restaurador de la lista original del año pasado con 1 solo clic.

8. **❄️ Ambiente Festivo**:
   - Nevada suave toggleable (con optimización de batería y rendimiento).
   - Efectos de sonido sintetizados mediante Web Audio API (0 dependencias externas que puedan fallar o expirar).

---

## 🛠️ Tecnologías y Librerías 100% Oficiales

- **React 18 / 19 & TypeScript**: Código tipado, robusto y escalable.
- **Vite**: Compilador ultrarrápido configurado para GitHub Pages.
- **Tailwind CSS**: Sistema de diseño a medida (paleta de verdes pino, borgoñas terciopelo y dorados).
- **Framer Motion**: Animaciones y físicas de arrastre (drag) de alta precisión.
- **Firebase SDK Oficial (`firebase@11`)**: Auth + Firestore con reglas de seguridad estrictas.
- **Lucide React**: Iconografía oficial y consistente.
- **Canvas Confetti**: Celebración visual táctil.

---

## 🚀 Despliegue Automático en GitHub Pages

El repositorio cuenta con un flujo de trabajo de **GitHub Actions** en `.github/workflows/deploy.yml`. Cada vez que hagas `git push` a la rama `main`, la web se compilará y desplegará automáticamente en:

👉 **`https://rafael99GD.github.io/web-ListaRegalos/`**

### ¿Cómo configurarlo en GitHub?
1. Ve a tu repositorio en GitHub: `https://github.com/rafael99GD/web-ListaRegalos`
2. Ve a **Settings** -> **Pages**.
3. En **Source**, selecciona **GitHub Actions**.

---

## 📖 Configuración de Firebase

Para activar la sincronización en la nube gratuita, consulta la guía paso a paso en [GUIA_FIREBASE.md](./GUIA_FIREBASE.md).
