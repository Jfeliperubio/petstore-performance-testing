import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    scenarios: {
        createPet: {
            executor: 'constant-vus',
            vus: 1,
            duration: '1m', // Duración total de la prueba de 1 minuto
            gracefulStop: '0s', // Evitar esperar al finalizar las iteraciones
        },
    },
    thresholds: {
        // El 90% de las solicitudes deben responder en menos de 500ms
        'http_req_duration': ['p(90) < 500'],
        // El 95% de las solicitudes deben ser exitosas
        'http_req_failed': ['rate<0.05'],
    },
};

export default function () {
    const url = 'http://localhost:8080/api/v3/pet';
  
    const payload = JSON.stringify({
        id: 10,
        name: "doggie",
        category: {
            id: 1,
            name: "Dogs"
        },
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

    http.post(url, payload, params);

    // Introduce un tiempo de espera para simular una carga más ligera
    // Ajusta este valor según sea necesario para reflejar el nivel de carga deseado
    sleep(10); // Espera 10 segundos entre cada solicitud
}
