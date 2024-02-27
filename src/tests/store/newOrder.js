import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';


const cargaLigera = 10; // Asumiendo que 0.1 VUs equivalen a 10 VUs para facilitar el ejemplo
const cargaConstante = 20; // Asumiendo que 0.2 VUs equivalen a 20 VUs
const cargaPico = 60; // Asumiendo que 0.6 VUs equivalen a 60 VUs


let tipoCarga = __ENV.TIPO_CARGA || "cargaLigera"; // cargaLigera es el valor predeterminado

let stages = [];

if (tipoCarga === "cargaLigera") {
    stages = [
        { duration: '1m', target: cargaLigera },
        { duration: '3m', target: cargaLigera },
        { duration: '1m', target: 0 },
    ];
} else if (tipoCarga === "cargaConstante") {
    stages = [
        { duration: '1m', target: cargaConstante },
        { duration: '3m', target: cargaConstante },
        { duration: '1m', target: 0 },
    ];
} else if (tipoCarga === "cargaPico") {
    stages = [
        { duration: '1m', target: cargaPico },
        { duration: '3m', target: cargaPico },
        { duration: '1m', target: 0 },
    ];
}

export let options = {
    stages: stages,
    thresholds: {
        'http_req_duration': ['p(95)<250'], // Ajusta según tus requisitos de rendimiento
        'http_req_failed': ['rate<0.01'],   // Asegura que menos del 1% de las peticiones fallen
    },
};

export default function () {
    let orderId = randomIntBetween(1, 1000000); // Genera un ID de orden único
    let petId = randomIntBetween(1, 10000); // Genera un ID de mascota aleatorio si es necesario
    let url = 'http://localhost:8080/api/v3/store/order';

    let payload = JSON.stringify({
        id: orderId,
        petId: petId,
        quantity: 7,
        shipDate: "2024-02-27T08:31:16.222Z",
        status: "approved",
        complete: true
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    let response = http.post(url, payload, params);

    // Verifica que la respuesta sea la esperada
    check(response, {
        'is status 200': (r) => r.status === 200,
        // Agrega más validaciones según sea necesario
    });

    sleep(1); // Pausa entre llamadas para simular el comportamiento del usuario
}
