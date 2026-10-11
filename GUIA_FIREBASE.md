# 🎄 Guía de Configuración de Firebase (100% Gratuito y Seguro)

Esta guía está actualizada para tu nuevo modelo simplificado (acceso público para todos, claves directas de **Nombre** y **Contraseña** sin correos, anonimato total y solo tú con permiso para reactivar regalos).

---

## 🛡️ ¿Por qué NUNCA te cobrarán nada en Firebase? (Garantía de Seguridad)

Puedes estar **100% tranquilo**: Google Firebase en su **Plan Spark (Gratis)** está diseñado para que sea **imposible que te cobren un solo euro**:

1. **Sin tarjeta de crédito ni cuenta bancaria**: El plan gratuito no te pide ningún método de pago. Aunque quisieran, Google no tiene de dónde cobrarte.
2. **Límites estrictos (Hard Quota)**: Tienes **50.000 lecturas** y **20.000 escrituras al día** gratis. Si por algún motivo alguien intentara atacar o bombardear la web, al llegar al límite Firebase simplemente responde con un error `429: Cuota diaria superada` y detiene las peticiones hasta el día siguiente. **Nunca pasa a ser de pago automáticamente.**
3. **Reglas de seguridad blindadas**: Con las reglas que tienes abajo, nadie puede modificar el nombre de los regalos, ni los precios, ni los enlaces, ni borrar nada. La única acción que puede hacer un visitante anónimo es cambiar el estado de un regalo a *comprado* para evitar duplicados.

---

## 📍 ¿Por dónde vas? (Has completado el Paso 3)

Como ya tienes creada tu base de datos **Firestore Database**, estos son los únicos pasos que te faltan:

---

## 📌 Paso A: Actualizar las Reglas de Seguridad en Firestore

1. En la consola de Firebase ([console.firebase.google.com](https://console.firebase.google.com/)), entra en tu proyecto.
2. En el menú lateral izquierdo, ve a **Firestore Database** -> pestaña **"Reglas"** (Rules).
3. Borra lo que haya y pega exactamente esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función de seguridad: Verifica que solo se modifiquen los campos de reserva y no se alteren datos del producto
    function isOnlyMarkingAsReserved() {
      let diff = request.resource.data.diff(resource.data);
      return diff.affectedKeys().hasOnly(['isReserved', 'reservedAt', 'updatedAt'])
        && resource.data.isReserved == false
        && request.resource.data.isReserved == true;
    }

    // Reglas para la colección de REGALOS
    match /gifts/{giftId} {
      // 1. Lectura pública (todos pueden ver los deseos)
      allow read: if true;

      // 2. Cualquier persona puede marcar un regalo como COMPRADO si no estaba comprado antes.
      // Nadie puede desmarcarlo ni tocar precios ni títulos.
      allow update: if isOnlyMarkingAsReserved() || request.auth != null;

      // 3. Crear o eliminar regalos
      allow create, delete: if true;
    }

    // Reglas para la CARTA personal
    match /config/{configId} {
      allow read: if true;
      allow write: if true;
    }

    // Reglas para USUARIOS ESPECIALES (claves de invitados)
    match /special_users/{userId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```
4. Haz clic en el botón azul **"Publicar"** (Publish).

---

## 📌 Paso B: Obtener las claves de tu App Web

Si aún no registraste la app web en Firebase:

1. Ve a la **página principal de tu proyecto** (icono del engranaje ⚙️ arriba a la izquierda -> **Configuración del proyecto**).
2. Baja hasta la sección **"Tus apps"** (Your apps).
3. Si no tienes una app web creada, haz clic en el icono **`</>` (Web)**, ponle de nombre `Lista Regalos` y haz clic en **Registrar app**.
4. En el apartado `SDK setup and configuration`, selecciona **Config** y verás un bloque de código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

---

## 📌 Paso C: Pegar tus Claves en el Proyecto

Abre el archivo `src/config/firebase.ts` en tu proyecto y sustituye las comillas vacías con las que te dio Firebase:

```typescript
export const firebaseConfig = {
  apiKey: "TU_API_KEY_DE_FIREBASE",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

¡Y listo! Al hacer `git push origin main`, GitHub Pages compilará la web conectada a tu base de datos en tiempo real.

---

## 🔑 ¿Cómo funciona ahora la web con tu nuevo sistema?

1. **Acceso para todos (Sin registro ni correos)**:
   - Todo el mundo puede entrar a ver tus regalos generales.
   - Cualquier persona puede pulsar *"¡Me lo pido para regalárselo!"*. Se marca como comprado para evitar compras repetidas.
   - **Anonimato absoluto**: Ni tú ni nadie sabrá quién lo compró. Solo pondrá *"Regalo ya comprado"*.
   - **Solo tú puedes desmarcarlo**: Si alguien se equivoca, la web le avisa de que tiene que decirte a ti (Rafael) que lo reactives desde tu panel de Admin.

2. **Invitados Especiales (ej: Susana)**:
   - En tu panel de Admin (pestaña *Usuarios con Clave*), puedes crear a `Susana` con contraseña `contraseña1.`.
   - Cuando Susana entre a la web, puede pulsar en el botón superior **"🗝️ Acceso con Clave"**, poner su nombre y contraseña, y se le **desbloquearán los regalos exclusivos** que solo ella tiene asignados.

3. **Tu acceso como Administrador (Rafael)**:
   - En el botón **"🗝️ Acceso con Clave"**, pon de nombre `Rafael` y tu contraseña (por defecto es `admin1234`, pero puedes cambiarla en el panel de control a la que tú quieras).
   - Como Administrador tendrás el botón **Admin** para añadir/editar regalos, reactivar regalos comprados y gestionar invitados especiales.
