## Descripción

Este proyecto utiliza Vite junto con D3.js para crear un gráfico de flujo Sankey. El script `main.js` maneja la conexión a un broker MQTT para actualizar dinámicamente el gráfico en función de los datos recibidos. Si no tienes configurado el broker MQTT, puedes simular la recepción de datos utilizando el archivo `simulation.js`.

## Estructura del Proyecto

- `src/main.js`: Este script crea el gráfico Sankey y se conecta a un broker MQTT para actualizar el gráfico en función de los datos recibidos.
- `src/simulation.js`: Este script simula la recepción de mensajes MQTT para verificar que las funciones que actualizan el gráfico funcionan correctamente.

## Uso

### Configuración del Broker MQTT

El script `src/main.js` se conecta a un broker MQTT configurado mediante una URL WebSocket. La configuración puede variar dependiendo de si el sitio web tiene un certificado TLS y de los detalles del broker MQTT, como el puerto y las credenciales de usuario.

### Configuración MQTT

- **URL de WebSocket**: Utiliza `ws` si el sitio web no tiene un certificado TLS y `wss` si lo tiene.
- **Puerto**: El puerto varía según el broker MQTT. Por ejemplo, el puerto común para WebSocket sin TLS es `8884`, mientras que con TLS podría ser `8883` u otro definido por el broker.
- **Credenciales**: Si el broker requiere autenticación, asegúrate de proporcionar el nombre de usuario y la contraseña.

```jsx
// src/main.js

import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import mqtt from 'mqtt';

// Código del gráfico Sankey aquí...

// Configuración del cliente MQTT
const host = 'your-mqtt-broker-host';
const port = 8884; // Cambia según el broker
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

// Cambia ws por wss si tienes un certificado TLS
const connectUrl = `ws://${host}:${port}/mqtt`;

const client = mqtt.connect(connectUrl, {
  username: 'your-username',
  password: 'your-password',
  rejectUnauthorized: false,
});

client.on('connect', () => {
  console.log('Conectado al broker MQTT');
  client.subscribe('sankey/data');
});

client.on('message', (topic, message) => {
  const newData = JSON.parse(message.toString());
  console.log(`Mensaje recibido: ${topic} - ${newData}`);

  // Actualiza el gráfico con los nuevos datos
  updateSankeyChart(newData);
});

// Función para actualizar el gráfico Sankey
function updateSankeyChart(newData) {
  // Actualiza el gráfico con los nuevos datos
  const { nodes, links } = sankey(newData);

  // Actualización del gráfico
  svg.selectAll('.node')
    .data(nodes)
    .attr('transform', d => `translate(${d.x0},${d.y0})`);

  svg.selectAll('rect')
    .data(nodes)
    .attr('height', d => d.y1 - d.y0)
    .attr('width', sankey.nodeWidth());

  svg.selectAll('.link')
    .data(links)
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke-width', d => Math.max(1, d.width));
}
```

### Simulación de Datos MQTT

Si no tienes configurado un broker MQTT, puedes simular la recepción de datos utilizando el archivo `src/simulation.js`. Para ello, sigue estos pasos:

1. Renombra el archivo `src/main.js` a `src/main_backup.js` (u otro nombre a tu elección).
2. Renombra el archivo `src/simulation.js` a `src/main.js`.
3. Ejecuta el proyecto como lo harías normalmente.

```jsx
// src/simulation.js

import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';

// Código del gráfico Sankey aquí...

// Simulación de la recepción de mensajes MQTT
function simulateMQTTMessage(newData) {
  console.log('Simulando mensaje MQTT con datos:', newData);

  // Actualiza el gráfico con los nuevos datos
  updateSankeyChart(newData);
}

// Ejemplo de datos simulados para la prueba
const simulatedData = {
  "nodes": [
    { "id": 0, "name": "coal" },
    { "id": 1, "name": "natural gas" },
    // ...
  ],
  "links": [
    { "source": 0, "target": 8, "value": 5.48 },
    { "source": 1, "target": 8, "value": 7.94 },
    // ...
  ]
};

// Simular la recepción de un mensaje MQTT después de 5 segundos
setTimeout(() => {
  simulateMQTTMessage(simulatedData);
}, 5000);

// Función para actualizar el gráfico Sankey
function updateSankeyChart(newData) {
  // Actualiza el gráfico con los nuevos datos
  const { nodes, links } = sankey(newData);

  // Actualización del gráfico
  svg.selectAll('.node')
    .data(nodes)
    .attr('transform', d => `translate(${d.x0},${d.y0})`);

  svg.selectAll('rect')
    .data(nodes)
    .attr('height', d => d.y1 - d.y0)
    .attr('width', sankey.nodeWidth());

  svg.selectAll('.link')
    .data(links)
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke-width', d => Math.max(1, d.width));
}
```

### Ejecución

Para ejecutar el proyecto, asegúrate de tener un entorno de desarrollo configurado con Node.js y Vite.

1. **Instalación de dependencias**:

```bash
npm install
```

1. **Ejecución del proyecto**:

```bash
npm run dev
```

Si estás utilizando el archivo de simulación, asegúrate de seguir los pasos mencionados anteriormente para renombrar los archivos.

## Nota

La configuración de la conexión MQTT depende del broker y del entorno en el que estás trabajando. Asegúrate de revisar la documentación de tu broker MQTT para obtener detalles específicos sobre los puertos, la configuración de WebSocket (ws o wss) y las credenciales necesarias.