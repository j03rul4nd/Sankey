// src/main.js

import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';

// Datos del gráfico Sankey
const data = {
  "nodes": [
    { "id": 0, "name": "coal" },
    { "id": 1, "name": "natural gas" },
    { "id": 2, "name": "petroleum" },
    { "id": 3, "name": "other gases" },
    { "id": 4, "name": "nuclear electric power" },
    { "id": 5, "name": "renewable energy" },
    { "id": 6, "name": "other" },
    { "id": 7, "name": "net imports of electricity" },
    { "id": 8, "name": "fossil fuels" },
    { "id": 9, "name": "energy consumed to generate electricity" },
    { "id": 10, "name": "conversion losses" },
    { "id": 11, "name": "gross generation" },
    { "id": 12, "name": "plant use" },
    { "id": 13, "name": "net generation" },
    { "id": 14, "name": "T&D losses & unnacounted" },
    { "id": 15, "name": "end use" },
    { "id": 16, "name": "residential" },
    { "id": 17, "name": "commercial" },
    { "id": 18, "name": "industrial" },
    { "id": 19, "name": "transportation" },
    { "id": 20, "name": "direct use" }
  ],
  "links": [
    { "source": 0, "target": 8, "value": 9.48 },
    { "source": 1, "target": 8, "value": 11.94 },
    { "source": 2, "target": 8, "value": 0.2 },
    { "source": 3, "target": 8, "value": 0.07 },
    { "source": 4, "target": 9, "value": 8.13 },
    { "source": 5, "target": 9, "value": 7.35 },
    { "source": 6, "target": 9, "value": 0.18 },
    { "source": 7, "target": 15, "value": 0.13 },
    { "source": 8, "target": 9, "value": 21.69 },
    { "source": 9, "target": 10, "value": 22.61 },
    { "source": 9, "target": 11, "value": 14.74 },
    { "source": 11, "target": 12, "value": 0.7 },
    { "source": 11, "target": 13, "value": 14.04 },
    { "source": 13, "target": 14, "value": 0.76 },
    { "source": 13, "target": 15, "value": 13.28 },
    { "source": 15, "target": 16, "value": 5.04 },
    { "source": 15, "target": 17, "value": 4.52 },
    { "source": 15, "target": 18, "value": 3.37 },
    { "source": 15, "target": 19, "value": 0.02 },
    { "source": 15, "target": 20, "value": 0.46 }
  ]
};

// Dimensiones del SVG
const margin = { top: 15, right: 25, bottom: 25, left: 25 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Crear el contenedor SVG
const svg = d3.select('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Crear el layout Sankey
const sankey = d3Sankey()
  .nodeWidth(20)
  .nodePadding(20)
  .extent([[1, 1], [width - 1, height - 6]]);

// Aplicar el layout Sankey a los datos
const graph = sankey(data);

// Añadir los enlaces
const link = svg.append('g')
  .selectAll('.link')
  .data(graph.links)
  .enter().append('path')
  .attr('class', 'link')
  .attr('d', sankeyLinkHorizontal())
  .attr('stroke-width', d => Math.max(1, d.width))
  .style('stroke', '#000')
  .style('stroke-opacity', 0.2)
  .append('title')
  .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

// Añadir los nodos
const node = svg.append('g')
  .selectAll('.node')
  .data(graph.nodes)
  .enter().append('g')
  .attr('class', 'node')
  .attr('transform', d => `translate(${d.x0},${d.y0})`);

node.append('rect')
  .attr('height', d => d.y1 - d.y0)
  .attr('width', sankey.nodeWidth())
  .style('fill', '#00f')
  .style('stroke', '#000')
  .append('title')
  .text(d => `${d.name}\n${d.value}`);

// Añadir los textos a los nodos
node.append('text')
  .attr('x', -6)
  .attr('y', d => (d.y1 - d.y0) / 2)
  .attr('dy', '0.35em')
  .attr('text-anchor', 'end')
  .text(d => d.name)
  .filter(d => d.x0 < width / 2)
  .attr('x', 6 + sankey.nodeWidth())
  .attr('text-anchor', 'start');

// Simulación de la recepción de mensajes MQTT
function simulateMQTTMessage(newData) {
  console.log('Simulando mensaje MQTT con datos:', newData);

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

// Ejemplo de datos simulados para la prueba
const simulatedData = {
  "nodes": [
    { "id": 0, "name": "coal" },
    { "id": 1, "name": "natural gas" },
    { "id": 2, "name": "petroleum" },
    { "id": 3, "name": "other gases" },
    { "id": 4, "name": "nuclear electric power" },
    { "id": 5, "name": "renewable energy" },
    { "id": 6, "name": "other" },
    { "id": 7, "name": "net imports of electricity" },
    { "id": 8, "name": "fossil fuels" },
    { "id": 9, "name": "energy consumed to generate electricity" },
    { "id": 10, "name": "conversion losses" },
    { "id": 11, "name": "gross generation" },
    { "id": 12, "name": "plant use" },
    { "id": 13, "name": "net generation" },
    { "id": 14, "name": "T&D losses & unnacounted" },
    { "id": 15, "name": "end use" },
    { "id": 16, "name": "residential" },
    { "id": 17, "name": "commercial" },
    { "id": 18, "name": "industrial" },
    { "id": 19, "name": "transportation" },
    { "id": 20, "name": "direct use" }
  ],
  "links": [
    { "source": 0, "target": 8, "value": 5.48 },
    { "source": 1, "target": 8, "value": 7.94 },
    { "source": 2, "target": 8, "value": 0.1 },
    { "source": 3, "target": 8, "value": 0.03 },
    { "source": 4, "target": 9, "value": 6.13 },
    { "source": 5, "target": 9, "value": 5.35 },
    { "source": 6, "target": 9, "value": 0.08 },
    { "source": 7, "target": 15, "value": 0.03 },
    { "source": 8, "target": 9, "value": 12.69 },
    { "source": 9, "target": 10, "value": 18.61 },
    { "source": 9, "target": 11, "value": 12.74 },
    { "source": 11, "target": 12, "value": 0.3 },
    { "source": 11, "target": 13, "value": 10.04 },
    { "source": 13, "target": 14, "value": 0.26 },
    { "source": 13, "target": 15, "value": 10.28 },
    { "source": 15, "target": 16, "value": 3.04 },
    { "source": 15, "target": 17, "value": 3.52 },
    { "source": 15, "target": 18, "value": 1.37 },
    { "source": 15, "target": 19, "value": 0.01 },
    { "source": 15, "target": 20, "value": 0.16 }
  ]
};

// Simular la recepción de un mensaje MQTT después de 5 segundos
setTimeout(() => {
  simulateMQTTMessage(simulatedData);
}, 5000);
