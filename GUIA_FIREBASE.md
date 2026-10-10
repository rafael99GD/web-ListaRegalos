# 🎄 Guía de Configuración de Firebase (100% Gratis)

Esta guía te explicará paso a paso cómo crear y configurar tu proyecto en **Google Firebase** (Plan Spark Gratuito) para que funcione con tu web alojada en **GitHub Pages**.

> 💡 **Nota importante**: El plan gratuito (Spark) de Google Firebase no requiere tarjeta de crédito y ofrece:
> - **50.000 lecturas** y **20.000 escrituras** al día en Firestore (mucho más de lo que necesita una familia).
> - **50.000 usuarios activos mensuales** en Firebase Authentication.
> - Base de datos en tiempo real (cuando alguien reserve un regalo en su móvil, se actualizará al instante en los móviles de los demás sin recargar la página).

---

## 📌 Paso 1: Crear el Proyecto en Google Firebase

1. Entra en la consola de Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google.
3. Haz clic en **"Crear un proyecto"** (o "Añadir proyecto").
4. Ponle de nombre: `lista-regalos-rafael` (o el nombre que prefieras).
5. En la pantalla de Google Analytics, puedes desactivarlo si quieres simplificar (o dejarlo activo, es gratis).
6. Haz clic en **"Crear proyecto"** y espera unos segundos a que termine.

---

## 📌 Paso 2: Registrar tu Aplicación Web

1. En la página principal de tu nuevo proyecto en Firebase, verás varios iconos redondos (`iOS`, `Android`, `Web </>`).
2. Haz clic en el icono **Web (`</>`)**.
3. En el campo "Sobrenombre de la app", pon por ejemplo: `Web Regalos`.
4. Deja **desmarcada** la casilla de "Firebase Hosting" (ya que usaremos GitHub Pages gratis).
5. Haz clic en **"Registrar app"**.
6. Te aparecerá en pantalla un bloque de código con un objeto `const firebaseConfig = { ... };`. 
   **Copia esos valores**, los necesitaremos en el Paso 6.

---

## 📌 Paso 3: Activar la Base de Datos (Cloud Firestore)

1. En el menú lateral izquierdo de Firebase, ve a **Compilación** -> **Firestore Database**.
2. Haz clic en **"Crear base de datos"**.
3. Selecciona la ubicación del servidor: elige una cercana a España (por ejemplo `eur3 (europe-west)` o `europe-west1`).
4. En reglas de seguridad, selecciona **"Empezar en modo de producción"**.
5. Haz clic en **"Siguiente"** y luego en **"Habilitar"**.

### Aplicar las Reglas de Seguridad (¡Muy Importante!)
1. Dentro de Firestore Database, haz clic en la pestaña superior **"Reglas"** (Rules).
2. Borra lo que haya y pega exactamente el contenido del archivo `firestore.rules` de este repositorio:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email.matches('(?i).*rafael.*') ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
      );
    }

    match /gifts/{giftId} {
      allow read: if true;
      allow create, delete: if isAdmin();
      allow update: if 
        isAdmin() ||
        (
          request.auth != null &&
          !resource.data.isReserved &&
          request.resource.data.isReserved == true &&
          request.resource.data.reservedBy == request.auth.uid
        ) ||
        (
          request.auth != null &&
          resource.data.isReserved == true &&
          resource.data.reservedBy == request.auth.uid &&
          request.resource.data.isReserved == false
        );
    }

    match /config/{configId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if isAdmin() || (request.auth != null && request.auth.uid == userId);
    }
  }
}
```
3. Haz clic en **"Publicar"**.

---

## 📌 Paso 4: Activar Autenticación (Usuarios y Familiares)

1. En el menú lateral izquierdo, ve a **Compilación** -> **Authentication**.
2. Haz clic en **"Comenzar"**.
3. En la pestaña **"Sign-in method"**, haz clic en **"Correo electrónico/Contraseña"** (Email/Password).
4. Activa el interruptor **"Habilitar"** en la primera opción (Correo electrónico/contraseña).
5. Haz clic en **"Guardar"**.

---

## 📌 Paso 5: Crear los Usuarios para tus Familiares y para Ti

Ve a la pestaña **"Users"** dentro de Authentication:

1. **Tu usuario Admin (Rafael)**:
   - Haz clic en **"Agregar usuario"**.
   - Correo: `rafael@regalos.local` (o tu correo personal de Gmail).
   - Contraseña: La clave secreta que elijas para gestionar la web.
   - *Nota*: Como el correo contiene la palabra `rafael`, el sistema te reconocerá automáticamente como Administrador con permisos totales.

2. **Usuarios para Familiares / Amigos**:
   - Para que ellos no tengan que recordar un email largo, la web les permite escribir simplemente su usuario (`mama`, `papa`, etc.) y el sistema internamente lo completa con `@regalos.local`.
   - Crea un usuario para cada uno:
     - Mamá: `mama@regalos.local` | Contraseña: ej. `mama1234`
     - Papá: `papa@regalos.local` | Contraseña: ej. `papa1234`
     - Amigos: `amigos@regalos.local` | Contraseña: ej. `amigos1234`
   - ¡Listo! Ahora solo tienes que decirles: *"Para entrar, pon de usuario `mama` y tu clave"*.

---

## 📌 Paso 6: Conectar Firebase a tu Proyecto

Tienes dos formas muy sencillas de poner tus credenciales de Firebase:

### Opción A (La más rápida y directa)
Abre el archivo `src/config/firebase.ts` y sustituye los valores en el objeto `firebaseConfig`:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```
*(Nota de seguridad oficial de Google: Las claves de Firebase para frontend web no son secretos de servidor; su seguridad radica en las `firestore.rules` que configuramos en el Paso 3).*

### Opción B (Mediante Secretos de GitHub para CI/CD)
Si prefieres no subir las claves a GitHub en texto plano:
1. En tu repositorio de GitHub (`web-ListaRegalos`), ve a **Settings** -> **Secrets and variables** -> **Actions**.
2. Haz clic en **"New repository secret"** y añade:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. El archivo `.github/workflows/deploy.yml` ya está preparado para leer estos secretos automáticamente al compilar.

---

## 📌 Paso 7: Activar GitHub Pages en el Repositorio

1. En tu repositorio en GitHub (`https://github.com/rafael99GD/web-ListaRegalos`):
2. Ve a la pestaña **Settings** -> **Pages** (en el menú izquierdo).
3. En la sección **"Build and deployment"** -> **"Source"**, selecciona:
   👉 **GitHub Actions** (en lugar de "Deploy from a branch").
4. ¡Y ya está! Cada vez que hagas un `git push origin main`, GitHub Actions compilará la web y la desplegará automáticamente en tu URL de GitHub Pages:
   **`https://rafael99GD.github.io/web-ListaRegalos/`**

---

## 🎁 ¿Qué pasa antes de configurar Firebase?
El proyecto incluye un **modo local / demo inteligente**. Si abres la web sin configurar Firebase, todo funcionará con almacenamiento local en tu navegador con los regalos precargados del año pasado, para que puedas ver y probar el diseño inmediatamente. En cuanto pongas tus credenciales de Firebase, se activará la sincronización en la nube en tiempo real.
