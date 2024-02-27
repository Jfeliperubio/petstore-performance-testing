import http from 'k6/http';
import { check, sleep } from 'k6';

// Definimos las cargas como variables para fácil referencia
const cargaLigera = { duration: '1m', target: 1 }; // Simulando 0.3 VUs ajustando la duración y los sleeps
const cargaConstante = { duration: '1m', target: 1 }; // Simulando 0.6 VUs ajustando la duración y los sleeps
const cargaPico = { duration: '1m', target: 2 }; // Simulando 1.8 VUs ajustando la duración y los sleeps

// Seleccionar el tipo de carga mediante una variable de entorno
const cargaSeleccionada = __ENV.CARGA || 'ligera'; // 'ligera', 'constante', 'pico'

export let options = {
    stages: [
        cargaSeleccionada === 'ligera' ? cargaLigera :
        cargaSeleccionada === 'constante' ? cargaConstante :
        cargaSeleccionada === 'pico' ? cargaPico :
        cargaLigera // Por defecto, ejecutar carga ligera si no se especifica
    ],
    thresholds: {
        'http_req_duration': ['p(90) < 500'], // 90% de las solicitudes deben responder en menos de 500ms
        'http_req_failed': ['rate<0.01'], // Menos del 1% de las solicitudes deben fallar
    },
};

export default function () {
    const url = 'http://localhost:8080/api/v3/pet';
    const payload = JSON.stringify({
        id: 10,
        name: "doggie",
        category: { id: 1, name: "Dogs" },
        photoUrls: ["string"],
        tags: [{ id: 0, name: "string" }],
        status: "available"
    });
    const params = {
        headers: {
            'accept': 'application/xml',
            'Content-Type': 'application/json',
        },
    };

    let response = http.post(url, payload, params);

    check(response, {
        'is status 200': (r) => r.status === 200,
    });

    // Ajustar el tiempo de espera según la carga seleccionada para simular el VU de manera más precisa
    sleep(cargaSeleccionada === 'ligera' ? 10 : cargaSeleccionada === 'constante' ? 5 : 1);
}
