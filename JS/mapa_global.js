const bloomData = {
      "Peru": { fase: "Inicio de floración", fecha: "2025-09-22", especies: ["Polylepis", "Quinua roja"] },
      "Brazil": { fase: "Pico de floración", fecha: "2025-09-30", especies: ["Ipê-amarelo", "Eucalyptus"] },
      "United States": { fase: "Brote temprano", fecha: "2025-03-18", especies: ["Cherry blossom", "Maple"] },
      "Spain": { fase: "Floración media", fecha: "2025-04-20", especies: ["Olivo", "Almendro"] },
      "China": { fase: "Floración avanzada", fecha: "2025-05-12", especies: ["Cerezo", "Camelia"] }
    };

    const globe = Globe()
      (document.getElementById('globeViz'))
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('#001018')
      .showAtmosphere(true)
      .atmosphereColor('#40caff')
      .atmosphereAltitude(0.25);

    const infoPanel = document.getElementById('info');
    const btnToggle = document.getElementById('toggle-rotation');

    let isRotating = true;

    // Cargar mapa mundial GeoJSON
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(countries => {
        globe
          .polygonsData(countries.features)
          .polygonCapColor(d => {
            const hasData = bloomData[d.properties.name];
            return hasData ? "rgba(0,255,180,0.55)" : "rgba(100,100,100,0.25)";
          })
          .polygonSideColor(() => 'rgba(0,100,120,0.15)')
          .polygonStrokeColor(() => '#00ffaa')
          .polygonLabel(d => `${d.properties.name}`)
          .onPolygonClick(d => showCountryData(d.properties.name));
      });

    // Mostrar datos de floración
    function showCountryData(name) {
      const data = bloomData[name];
      if (data) {
        infoPanel.innerHTML = `
          <b>${name}</b><br>
          🌺 <b>${data.fase}</b><br>
          📅 ${data.fecha}<br>
          🌿 ${data.especies.join(', ')}
        `;
      } else {
        infoPanel.innerHTML = `<b>${name}</b><br>Sin datos de floración disponibles.`;
      }
      infoPanel.style.display = 'block';
    }

    // Rotación automática
    function rotate() {
      if (isRotating) {
        const { x, y, z } = globe.camera().position;
        globe.camera().position.set(
          x * Math.cos(0.0008) - z * Math.sin(0.0008),
          y,
          z * Math.cos(0.0008) + x * Math.sin(0.0008)
        );
        globe.camera().lookAt(globe.scene().position);
      }
      requestAnimationFrame(rotate);
    }
    rotate();

    // Botón rotación
    btnToggle.addEventListener('click', () => {
      isRotating = !isRotating;
      btnToggle.textContent = isRotating ? '⏸️ Detener rotación' : '▶️ Activar rotación';
    });
    // Ajustar tamaño del canvas al contenedor
const container = document.getElementById('globeContainer');

const resizeObserver = new ResizeObserver(() => {
  globe.width([container.clientWidth]);
  globe.height([container.clientHeight]);
});

resizeObserver.observe(container);
