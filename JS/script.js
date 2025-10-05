let tendenciasChart, prediccionesChart;

function showSection(id, event) {
  document.querySelectorAll(".dashboard").forEach(sec => sec.classList.remove("active"));
  document.querySelector(`#${id}`).classList.add("active");
  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));

  if (event) event.target.classList.add("active");

  if (id === 'tendencias') renderCharts();
}

function renderCharts() {
  const ctx1 = document.getElementById("tendenciasChart").getContext("2d");
  const ctx2 = document.getElementById("prediccionesChart").getContext("2d");

  if (tendenciasChart) tendenciasChart.destroy();
  if (prediccionesChart) prediccionesChart.destroy();

  tendenciasChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: ["2019","2020","2021","2022","2023","2024","2025"],
      datasets: [{
        label: "Índice NDVI promedio",
        data: [0.42,0.45,0.46,0.44,0.49,0.52,0.50],
        borderColor: "#2e7d32",
        fill: true,
        backgroundColor: "rgba(46,125,50,0.1)",
        tension: 0.4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  prediccionesChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul"],
      datasets: [{
        label: "Probabilidad de floración (%)",
        data: [20,35,60,80,95,85,70],
        backgroundColor: "rgba(56,142,60,0.6)",
        borderRadius: 8
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
