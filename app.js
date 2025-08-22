// app.js
// Panel de Accionistas – Legend World Shop
// Versión completa, segura y optimizada

document.addEventListener('DOMContentLoaded', () => {
    // Verifica que DATA esté cargado
    if (typeof DATA === 'undefined') {
        document.getElementById('app').innerHTML = `
      <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <div class="text-red-600 p-6 text-center">
          <h2 class="text-lg font-semibold">Error: Datos no cargados</h2>
          <p class="text-sm">Asegúrate de que <strong>data.js</strong> se cargue antes que este archivo.</p>
        </div>
      </div>
    `;
        console.error("❌ DATA no está definido. Revisa el orden de los scripts en index.html");
        return;
    }

    const usuarioId = localStorage.getItem('usuarioId');
    const accionista = DATA.accionistas.find(a => a.id === usuarioId);

    if (usuarioId && accionista) {
        mostrarDashboard(accionista);
    } else {
        mostrarLogin();
    }

    // Manejar login
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'login-form') {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value.trim();
            const password = document.getElementById('password').value;

            const accionista = DATA.accionistas.find(a => a.usuario === usuario && a.password === password);

            if (!accionista) {
                alert('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
                return;
            }

            localStorage.setItem('usuarioId', accionista.id);
            mostrarDashboard(accionista);
        }
    });
});

// Pantalla de login
function mostrarLogin() {
    document.getElementById('app').innerHTML = `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div class="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center hover:shadow-xl transition-shadow">
        <h1 class="text-2xl font-bold text-gray-900">Panel de Accionistas</h1>
        <p class="text-gray-600 mt-2">${DATA.meta.empresa}</p>
        
        <form id="login-form" class="space-y-5 mt-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 text-left">Usuario</label>
            <input type="text" id="usuario" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="ej: rafael" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 text-left">Contraseña</label>
            <input type="password" id="password" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" required />
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg font-medium transition">
            Iniciar Sesión
          </button>
        </form>

        <p class="text-xs text-gray-500 mt-6">
          Acceso exclusivo para accionistas registrados.<br>
          Este portal es estático. No apto para información ultra sensible.
        </p>
      </div>
    </div>
  `;
}

// Formatea fecha: "2025-04-01" → "1 abr 2025"
function formatoFecha(fechaStr) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', options);
}

// Formatea moneda: 1300 → "S/ 1,300.00"
function formatoMoneda(valor) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(valor);
}

// Dashboard del accionista
function mostrarDashboard(accionista) {
    // Cálculos globales
    const totalIngresos = DATA.ingresos.reduce((sum, i) => sum + i.monto, 0);
    const totalGastos = DATA.gastos.reduce((sum, g) => sum + g.monto, 0);
    const utilidadNetaTotal = totalIngresos - totalGastos;
    const utilidadNeta = Math.max(utilidadNetaTotal, 0);

    // Cálculos por accionista
    const totalAcciones = accionista.acciones || 0;
    const porcentaje = DATA.meta.totalAcciones > 0
        ? (totalAcciones / DATA.meta.totalAcciones) * 100
        : 0;

    const costoBase = accionista.compras.reduce((sum, c) => sum + (c.acciones * c.precioPorAccion), 0);
    const valorActualParticipacion = (porcentaje / 100) * DATA.empresa.valorActual;
    const variacionAbs = valorActualParticipacion - costoBase;
    const variacionPct = costoBase > 0 ? (valorActualParticipacion / costoBase - 1) * 100 : 0;

    // Valor por acción
    const valorPorAccion = DATA.empresa.valorActual / DATA.meta.totalAcciones;

    // Dividendos
    const montoDividendos = DATA.empresa.montoDividendos || 0;
    const dividendoEstimado = DATA.empresa.politicaDividendos === "distribuir"
        ? (porcentaje / 100) * montoDividendos
        : 0;

    // ✅ Renderizado con mejoras visuales
    document.getElementById('app').innerHTML = `
        <div class="min-h-screen bg-gray-50">
          <!-- Header con degradado -->
          <header class="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg text-white">
            <div class="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
              <h1 class="text-2xl font-bold">${DATA.meta.empresa}</h1>
              <div class="text-right">
                <p class="font-medium">${accionista.nombre}</p>
                <button id="logout" class="text-sm text-blue-200 hover:text-white hover:underline transition">
                  Cerrar sesión
                </button>
              </div>
            </div>
          </header>

          <main class="max-w-6xl mx-auto px-6 py-8 space-y-10">

            <!-- Encabezado -->
            <div class="text-center">
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Dashboard de Accionista</h2>
              <p class="text-gray-500 text-sm">
                Última actualización: ${formatoFecha(DATA.meta.ultimaActualizacion)}
              </p>
            </div>

            <!-- Información clave -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800">Valor de la Empresa</h3>
                <p class="text-2xl font-bold text-primary-600 mt-3">${formatoMoneda(DATA.empresa.valorActual)}</p>
                <p class="text-sm text-gray-500">Desde ${formatoMoneda(DATA.empresa.valorReferenciaPublico)}</p>
              </div>

              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800">Mi Participación</h3>
                <p class="text-2xl font-bold text-green-600 mt-3">${porcentaje.toFixed(2)}%</p>
                <p class="text-sm text-gray-500">${totalAcciones} de ${DATA.meta.totalAcciones} acciones</p>
              </div>

              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800">Valor por Acción</h3>
                <p class="text-2xl font-bold text-blue-700 mt-3">${formatoMoneda(valorPorAccion)}</p>
                <p class="text-sm text-gray-500">Basado en ${DATA.meta.totalAcciones} acciones</p>
              </div>

              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800">Valor Actual de Inversión</h3>
                <p class="text-2xl font-bold ${variacionAbs >= 0 ? 'text-green-600' : 'text-red-600'} mt-3">
                  ${formatoMoneda(valorActualParticipacion)}
                </p>
                <p class="${variacionAbs >= 0 ? 'text-green-600' : 'text-red-600'} text-sm">
                  ${variacionAbs >= 0 ? '↑' : '↓'} ${formatoMoneda(Math.abs(variacionAbs))} (${variacionPct.toFixed(1)}%)
                </p>
              </div>
            </div>

            <!-- Resultados de la Empresa -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800">Ventas</h3>
                <p class="text-2xl font-bold text-green-600">${formatoMoneda(totalIngresos)}</p>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800">Gastos</h3>
                <p class="text-2xl font-bold text-red-600">${formatoMoneda(totalGastos)}</p>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800">Utilidad Neta</h3>
                <p class="text-2xl font-bold text-green-600">${formatoMoneda(utilidadNeta)}</p>
              </div>
            </div>

            <!-- Gráficos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-5">Tu Inversión en el Tiempo</h3>
                <canvas id="chart-valor"></canvas>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-5">Ingresos vs Gastos</h3>
                <canvas id="chart-financiero"></canvas>
              </div>
            </div>

            <!-- Dividendos -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Dividendos</h3>
              <div class="space-y-3 text-sm">
                <p><strong>Política:</strong> 
                  <span class="font-medium">${DATA.empresa.politicaDividendos === "distribuir" ? "Distribución activa" : "Retención"}</span>
                </p>
                <p><strong>Monto a repartir:</strong> ${formatoMoneda(montoDividendos)}</p>
                <p class="text-green-600 font-medium">
                  <strong>Tu estimado:</strong> ${formatoMoneda(dividendoEstimado)}
                </p>

                ${accionista.dividendosRecibidos.length > 0 ? `
                  <div class="mt-4">
                    <p class="font-medium text-gray-800">Historial de pagos:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                      ${accionista.dividendosRecibidos.map(d => `
                        <li class="text-gray-700 hover:text-blue-600 transition">${formatoFecha(d.fecha)}: ${formatoMoneda(d.monto)}</li>
                      `).join('')}
                    </ul>
                  </div>
                ` : '<p class="text-gray-500 text-sm mt-2">Aún no se han realizado pagos.</p>'}
              </div>
            </div>

            <!-- Historial de Compras -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-5">Historial de Compras de Acciones</h3>
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Precio/Acción</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valor Empresa</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  ${accionista.compras.map(c => `
                    <tr class="hover:bg-gray-50 transition-colors cursor-default">
                      <td class="px-4 py-3">${formatoFecha(c.fecha)}</td>
                      <td class="px-4 py-3">${c.acciones}</td>
                      <td class="px-4 py-3">${formatoMoneda(c.precioPorAccion)}</td>
                      <td class="px-4 py-3 font-medium">${formatoMoneda(c.acciones * c.precioPorAccion)}</td>
                      <td class="px-4 py-3">${formatoMoneda(c.valorEmpresaEnCompra)}</td>
                    </tr>
                  `).join('')}
                  <tr class="font-semibold bg-blue-50 border-t">
                    <td class="px-4 py-3">Total</td>
                    <td class="px-4 py-3">${totalAcciones}</td>
                    <td></td>
                    <td class="px-4 py-3">${formatoMoneda(costoBase)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Comunicados -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-5">Comunicados de la Empresa</h3>
              ${DATA.comunicados.map(c => `
                <div class="mb-6 last:mb-0 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                  <p class="font-semibold text-gray-900">${c.titulo}</p>
                  <p class="text-gray-700 text-sm mt-1">${c.cuerpo}</p>
                  <p class="text-xs text-gray-500 mt-2">${formatoFecha(c.fecha)}</p>
                </div>
              `).join('')}
            </div>

            <!-- Solo para admin: lista de accionistas -->
            ${accionista.derechos.verCapTable ? `
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-5">👥 Todos los Accionistas</h3>
                <p class="text-sm text-gray-600 mb-4">Información confidencial. Solo visible para administradores.</p>
                
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead class="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nombre</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Participación</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contacto</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Usuario</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      ${DATA.accionistas.map(a => {
        const porcentaje = (a.acciones / DATA.meta.totalAcciones * 100).toFixed(2);
        return `
                          <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 font-medium">${a.nombre}</td>
                            <td class="px-4 py-3">${a.acciones}</td>
                            <td class="px-4 py-3">${porcentaje}%</td>
                            <td class="px-4 py-3 text-gray-600 text-sm">
                              ${a.contacto.email}<br>
                              <span class="text-gray-500">${a.contacto.telefono}</span>
                            </td>
                            <td class="px-4 py-3 text-gray-500 text-sm">${a.usuario}</td>
                          </tr>
                        `;
    }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

          </main>

          <footer class="max-w-6xl mx-auto px-6 py-5 text-center text-xs text-gray-500 border-t border-gray-200">
            Información interna. No es oferta pública. &copy; 2025 ${DATA.meta.empresa}. Todos los derechos reservados.
          </footer>
        </div>
    `;

    // ✅ Gráficos
    try {
        // Gráfico 1: Valor de la inversión
        new Chart(document.getElementById('chart-valor'), {
            type: 'bar',
            data: {
                labels: ['Costo Base', 'Valor Actual'],
                datasets: [{
                    label: 'Valor de tu participación (S/)',
                    data: [costoBase, valorActualParticipacion],
                    backgroundColor: ['#3b82f6', '#1e40af'],
                    borderColor: '#1e40af',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#374151', titleColor: '#fff', bodyColor: '#fff' }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280' } },
                    x: { grid: { display: false }, ticks: { color: '#374151' } }
                }
            }
        });

        // Gráfico 2: Ingresos vs Gastos
        new Chart(document.getElementById('chart-financiero'), {
            type: 'doughnut',
            data: {
                labels: ['Gastos', 'Ingresos'],
                datasets: [{
                    data: [totalGastos, totalIngresos],
                    backgroundColor: ['#ef4444', '#10b981'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#374151', font: { size: 12 } } },
                    tooltip: { backgroundColor: '#374151', bodyColor: '#fff' }
                },
                cutout: '60%'
            }
        });

        // Botón de cierre de sesión
        document.getElementById('logout').onclick = () => {
            localStorage.removeItem('usuarioId');
            location.reload();
        };

    } catch (error) {
        console.error("Error en mostrarDashboard:", error);
        document.getElementById('app').innerHTML = `
          <div class="text-center p-8 text-red-600">
            <h2 class="text-lg font-semibold">❌ Error al cargar el dashboard</h2>
            <p class="text-sm">Revisa la consola para más detalles.</p>
          </div>
        `;
    }
}