import http from 'k6/http';
import { check } from 'k6';

export let options = {
    stages: [],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // El 95% de las solicitudes deben completarse por debajo de 500ms
    }
};

// Configurar las etapas según la variable de entorno TIPO_CARGA
switch (__ENV.CARGA) {
    case 'ligera':
        options.stages = [
            { duration: '1m', target: 1 }, // Simular una carga ligera
        ];
        break;
    case 'constante':
        options.stages = [
            { duration: '2m', target: 2 }, // Simular una carga constante
        ];
        break;
    case 'pico':
        options.stages = [
            { duration: '2m', target: 6 }, // Simular una carga de pico
        ];
        break;
    default:
        // Por defecto, usar carga ligera si TIPO_CARGA no está especificado
        options.stages = [
            { duration: '1m', target: 1 },
        ];
        break;
}

export default function () {
    const payload = JSON.stringify({
        id: 10,
        name: "doggie",
        category: { id: 1, name: "Dogs" },
        photoUrls: ["string"],
        tags: [{ id: 0, name: "string" }],
        status: "available"
    });
    const params = { headers: { 'Content-Type': 'application/json' } };
    let response = http.put('http://localhost:8080/api/v3/pet', payload, params);

    check(response, {
        'is status 200': (r) => r.status === 200,
    });
}
