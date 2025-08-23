// data.js
// Sistema automático: las acciones del fundador se calculan

const DATA = {
    meta: {
        empresa: "Legend World Shop",
        moneda: "PEN",
        totalAcciones: 200, // Total fijo de acciones
        ultimaActualizacion: "2025-05-04T23:00:00Z",
        congelado: false
    },
    empresa: {
        valorActual: 1300.00,
        valorReferenciaPublico: 1000.00,
        politicaDividendos: "distribuir",
        porcentajeDividendos: 50,
        montoDividendos: null,
        notas: "Se distribuirá el 50% de las ganancias netas como dividendos."
    },
    ingresos: [
        { fecha: "2025-08-21", concepto: "Venta inicial", monto: 10.00 },
        { fecha: "2025-08-21", concepto: "Venta online", monto: 10.00 },
        { fecha: "2025-08-21", concepto: "Venta por mayor", monto: 36.00 },
        { fecha: "2025-08-21", concepto: "Venta por mayor", monto: 10.00 }

    ],
    gastos: [
        { fecha: "2025-08-21", concepto: "Compra mercadería", categoria: "Stock", monto: 12.00 },
        { fecha: "2025-08-21", concepto: "Aporte mercadería", categoria: "Stock", monto: 700.00 },
        { fecha: "2025-08-21", concepto: "Envío local", categoria: "Logística", monto: 8.50 },
        { fecha: "2025-08-21", concepto: "Packaging", categoria: "Operativo", monto: 85.00 },
        { fecha: "2025-08-21", concepto: "Mercaderia", categoria: "Stock", monto: 118.00 },
    ],
    comunicados: [
        {
            fecha: "2025-08-21",
            titulo: "Inicio de Operaciones",
            cuerpo: "Venta de acciones"
        }
    ],
    accionistas: [
        {
            id: "rafael",
            usuario: "rafael",
            password: "Omar45733747",
            nombre: "Rafael Paredes",
            contacto: { email: "rafael@legendworld.com", telefono: "+51 999 888 777" },
            compras: [
                { fecha: "2025-08-21", acciones: 10, precioPorAccion: 5.00, valorEmpresaEnCompra: 1000.00 }
            ],
            prestamosEmpresa: [],
            dividendosRecibidos: [],
            derechos: { voto: true, infoExtendida: true, verCapTable: false },
            notasPrivadas: ""
        },
        {
            id: "angel",
            usuario: "Aangelmoo90",
            password: "Aangelmoo",
            nombre: "Ángel Hiroshi",
            contacto: { email: "angel@legendworld.com", telefono: "+51 937 523 150" },
            compras: [
                { fecha: "2025-08-21", acciones: 1, precioPorAccion: 5.00, valorEmpresaEnCompra: 1000.00 }
            ],
            prestamosEmpresa: [],
            dividendosRecibidos: [],
            derechos: { voto: true, infoExtendida: true, verCapTable: false },
            notasPrivadas: "Inversionista activo, interesado en crecimiento acelerado."
        },
        {
            id: "josue",
            usuario: "josue",
            password: "josuepro",
            nombre: "Josué Llerena",
            contacto: { email: "josue@legendworld.com", telefono: "+51 999 666 555" },
            compras: [
                { fecha: "2025-08-21", acciones: 2, precioPorAccion: 5.00, valorEmpresaEnCompra: 1000.00 }
            ],
            prestamosEmpresa: [],
            dividendosRecibidos: [],
            derechos: { voto: true, infoExtendida: true, verCapTable: false },
            notasPrivadas: ""
        },
        {
            id: "gustavo",
            usuario: "Gustavo_19",
            password: "GUSTAVO19020605",
            nombre: "Gustavo Chilon",
            contacto: { email: "Gustavo@legendworld.com", telefono: "+51 999 666 555" },
            compras: [
                { fecha: "2025-08-21", acciones: 2, precioPorAccion: 5.00, valorEmpresaEnCompra: 1000.00 }
            ],
            prestamosEmpresa: [],
            dividendosRecibidos: [],
            derechos: { voto: true, infoExtendida: true, verCapTable: false },
            notasPrivadas: ""
        },
         {
            id: "fabian",
            usuario: "fabian",
            password: "fabian1616",
            nombre: "Fabian Ibrahin",
            contacto: { email: "fabian@legendworld.com", telefono: "+51 999 666 555" },
            compras: [
                { fecha: "2025-08-22", acciones: 2, precioPorAccion: 5.00, valorEmpresaEnCompra: 1000.00 }
            ],
            prestamosEmpresa: [],
            dividendosRecibidos: [],
            derechos: { voto: true, infoExtendida: true, verCapTable: false },
            notasPrivadas: ""
        },
        {
            id: "admin",
            usuario: "admin",
            password: "andy03082009",
            nombre: "Administrador",
            contacto: { email: "admin@legendworld.com", telefono: "" },
            // ❌ No pones compras ni acciones aquí todavía
            compras: [], // Se llenará automáticamente
            prestamosEmpresa: [],
            dividendosRecibidos: [],
            derechos: { voto: true, infoExtendida: true, verCapTable: true },
            notasPrivadas: "Usuario administrador del sistema. Fundador."
        }
    ],
    capTable: {
        series: []
    },
    ui: {
        mostrarCapTablePublica: false,
        mostrarGastosDetallados: false,
        mostrarIngresosDetallados: false
    }
};

// ✅ Paso 1: Calcular total de acciones de cada accionista (excepto admin)
DATA.accionistas.forEach(acc => {
    if (acc.id !== "admin") {
        acc.acciones = acc.compras.reduce((suma, compra) => suma + compra.acciones, 0);
    }
});

// ✅ Paso 2: Calcular acciones vendidas
const accionesVendidas = DATA.accionistas
    .filter(acc => acc.id !== "admin")
    .reduce((suma, acc) => suma + acc.acciones, 0);

// ✅ Paso 3: Calcular acciones del fundador (restantes)
const accionesFundador = DATA.meta.totalAcciones - accionesVendidas;

// ✅ Paso 4: Asignar esas acciones al admin como una compra inicial
if (accionesFundador > 0) {
    DATA.accionistas.find(acc => acc.id === "admin").compras.push({
        fecha: "2025-04-01",
        acciones: accionesFundador,
        precioPorAccion: 5.00,
        valorEmpresaEnCompra: 1000.00
    });
}

// ✅ Paso 5: Ahora sí, calcular acciones del admin
const admin = DATA.accionistas.find(acc => acc.id === "admin");
admin.acciones = admin.compras.reduce((suma, compra) => suma + compra.acciones, 0);

// ✅ Paso 6: Calcular utilidad neta
const totalIngresos = DATA.ingresos.reduce((sum, i) => sum + i.monto, 0);
const totalGastos = DATA.gastos.reduce((sum, g) => sum + g.monto, 0);
const utilidadNetaTotal = totalIngresos - totalGastos;

// ✅ Paso 7: Calcular monto de dividendos
if (utilidadNetaTotal > 0 && DATA.empresa.porcentajeDividendos > 0) {
    DATA.empresa.montoDividendos = utilidadNetaTotal * (DATA.empresa.porcentajeDividendos / 100);
} else {
    DATA.empresa.montoDividendos = 0;
}

// ✅ Paso 8: Actualizar capTable
DATA.capTable.series = [
    { nombre: "Fundadores", acciones: admin.acciones },
    { nombre: "Inversionistas", acciones: accionesVendidas }

];




