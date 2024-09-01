document.addEventListener("DOMContentLoaded", function () {
    const montoInput = document.querySelector(".monto");
    const monedaSelect = document.querySelector(".moneda");
    const resultadoParagraph = document.querySelector(".resultado");
    const errorSpan = document.querySelector(".errorSpan");
    const btnBuscar = document.querySelector(".btnbuscar");
    const grafico = document.querySelector(".grafica");
    let chart = null; // Variable para almacenar la instancia del gráfico
  
    btnBuscar.addEventListener("click", function () {
      const monto = montoInput.value;
      const moneda = monedaSelect.value;
      grafico.style.backgroundColor = "white";
      // Hacer la solicitud a la API
      fetch(`https://mindicador.cl/api/${moneda}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud.");
          }
          return response.json();
        })
        .then((data) => {
          const valores = data.serie.slice(0, 10).map((entry) => entry.valor); // Obtener los últimos 10 valores de la moneda desde la respuesta de la API
  
          // Crear el gráfico
          if (chart) {
            chart.destroy(); // Destruir el gráfico anterior si existe
          }
          chart = new Chart(grafico, {
            type: "line",
            data: {
              labels: valores.map((_, index) => index + 1),
              datasets: [
                {
                  label: `Valor de ${moneda.toUpperCase()} en los últimos 10 días`,
                  data: valores,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            },
          });
  
          const valorMoneda = data.serie[0].valor; // Obtener el valor de la moneda desde la respuesta de la API
          const resultado = monto / valorMoneda;
  
          resultadoParagraph.textContent = `El resultado es: $${resultado.toFixed(
            2
          )}`;
  
          errorSpan.textContent = ""; // Limpiar cualquier mensaje de error anterior
        })
        .catch((error) => {
          console.error("Error:", error);
          errorSpan.textContent = `Hubo un error al realizar la conversión. Por favor, inténtalo nuevamente. ${error}`;
          resultadoParagraph.textContent = ""; // Limpiar cualquier resultado anterior en caso de error
        });
    });
  });