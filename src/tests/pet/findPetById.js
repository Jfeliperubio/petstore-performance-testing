import http from 'k6/http';
import { check } from 'k6';

export let options = {
    stages: [],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // El 95% de las solicitudes deben completarse por debajo de 500ms
    }
};

// Configurar las etapas según la variable de entorno TIPO_CARGA
switch (__ENV.TIPO_CARGA) {
    case 'ligera':
        options.stages = [
            { duration: '1m', target: 5 }, // Simular una carga ligera
        ];
        break;
    case 'constante':
        options.stages = [
            { duration: '2m', target: 10 }, // Simular una carga constante
        ];
        break;
    case 'pico':
        options.stages = [
            { duration: '2m', target: 30 }, // Simular una carga de pico
        ];
        break;
    default:
        // Por defecto, usar carga ligera si TIPO_CARGA no está especificado
        options.stages = [
            { duration: '1m', target: 5 },
        ];
        break;
}

export default function () {
    let petId = 7; // Puedes modificar de acuerdo a la necesidad
    let url = `http://localhost:8080/api/v3/pet/${petId}`;
    let headers = {
        'Accept': 'application/xml',
    };

    let response = http.get(url, { headers: headers });

    check(response, {
        'is status 200': (r) => r.status === 200,
        // Agrega más checks si se necesitan
    });
}
