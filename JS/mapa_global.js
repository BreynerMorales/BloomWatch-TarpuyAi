    const bloomData = {
      "Peru": {
        fase: "Inicio de floración",
        fecha: "2025-09-22",
        especies: ["Polylepis", "Quinua roja"],
        coords: [-75, -10]
      },
      "Brazil": {
        fase: "Pico de floración",
        fecha: "2025-09-30",
        especies: ["Ipê-amarelo", "Eucalyptus"],
        coords: [-51, -10]
      },
      "United States": {
        fase: "Brote temprano",
        fecha: "2025-03-18",
        especies: ["Cherry blossom", "Maple"],
        coords: [-98, 39]
      },
      "Spain": {
        fase: "Floración media",
        fecha: "2025-04-20",
        especies: ["Olivo", "Almendro"],
        coords: [-3.7, 40.4]
      },
      "China": {
        fase: "Floración avanzada",
        fecha: "2025-05-12",
        especies: ["Cerezo", "Camelia"],
        coords: [104, 35]
      }
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

    // Animar rotación
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

    // Botón de rotación
    btnToggle.addEventListener('click', () => {
      isRotating = !isRotating;
      btnToggle.textContent = isRotating ? '⏸️ Detener rotación' : '▶️ Activar rotación';
    });

    // Pulsos de floración
    globe.customLayerData(Object.entries(bloomData))
      .customThreeObject(([name, data]) => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.3 + data.especies.length * 0.1, 16, 16),
          new THREE.MeshBasicMaterial({
            color: 0x00ffaa,
            transparent: true,
            opacity: 0.7
          })
        );
        sphere.userData = {
          t: Math.random() * Math.PI * 2
        };
        return sphere;
      })
      .customThreeObjectUpdate(([name, data], obj) => {
        const [lng, lat] = data.coords;
        const r = 100; // radio del globo
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (180 - lng) * Math.PI / 180;
        obj.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
        // Pulso
        obj.userData.t += 0.05;
        const s = 0.3 + data.especies.length * 0.1 + Math.sin(obj.userData.t) * 0.1;
        obj.scale.set(s, s, s);
      });

    // Ajustar tamaño del canvas al contenedor
    const container = document.getElementById('globeContainer');
    const resizeObserver = new ResizeObserver(() => {
      globe.width([container.clientWidth]);
      globe.height([container.clientHeight]);
    });
    resizeObserver.observe(container);

// Añadir luces según floración
Globe.entries(bloomData).forEach(([name, data]) => {
  const [lng, lat] = data.coords;

  const r = 102; // radio del globo + pequeño extra para luz
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (180 - lng) * Math.PI / 180;

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);

  const light = new THREE.PointLight(0x00ffaa, 0.5 + data.especies.length * 0.3, 30);
  light.position.set(x, y, z);
  globe.scene().add(light);

  // (Opcional) Añadir una esfera emisiva para visualizar la fuente
  const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0x00ffaa,
      emissive: 0x00ffaa,
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.5
    })
  );
  lightSphere.position.set(x, y, z);
  globe.scene().add(lightSphere);
});
