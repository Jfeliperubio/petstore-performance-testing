import http from 'k6/http';
import { check, sleep } from 'k6';

const cargaLigera = { duration: '1m', target: 10 }; // Simulando 0.3 VUs ajustando la duración y los sleeps
const cargaConstante = { duration: '1m', target: 20 }; // Simulando 0.6 VUs ajustando la duración y los sleeps
const cargaPico = { duration: '1m', target: 60 }; // Simulando 1.8 VUs ajustando la duración y los sleeps

// Seleccionar el tipo de carga mediante una variable de entorno
const cargaSeleccionada = __ENV.TIPO_CARGA || 'ligera'; // 'ligera', 'constante', 'pico'

export let options = {
    stages: [
        cargaSeleccionada === 'ligera' ? cargaLigera :
        cargaSeleccionada === 'constante' ? cargaConstante :
        cargaSeleccionada === 'pico' ? cargaPico :
        cargaLigera, // Por defecto, ejecutar carga ligera si no se especifica
    ],
    thresholds: {
        'http_req_duration': ['p(90) < 500'], // 90% de las solicitudes deben responder en menos de 500ms
        'http_req_failed': ['rate<0.01'], // Menos del 1% de las solicitudes deben fallar
    },
    tags: {
        tipo_de_carga: cargaSeleccionada, // Añade el tipo de carga como tag global
        caso_de_prueba: "newPet", // Añade un caso de prueba como ejemplo de manera global
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
