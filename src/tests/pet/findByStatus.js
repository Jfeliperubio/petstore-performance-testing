import http from 'k6/http';
import { check } from 'k6';

let tipoCarga = __ENV.TIPO_CARGA || 'ligera'; // Utiliza la variable de entorno TIPO_CARGA o 'ligera' por defecto

export let options = {
    stages: [
        // Configuración por defecto para 'ligera'. Se sobrescribirá según el caso.
        { duration: '1m', target: 5 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // El 95% de las solicitudes deben completarse por debajo de 500ms
    },
    tags: {
        tipo_de_carga: tipoCarga, // Añade el tipo de carga como tag global
        caso_de_prueba: "ConsultaDisponibilidadPets", // Ejemplo de nombre para el caso de prueba
    }
};

// Configurar las etapas según la variable de entorno TIPO_CARGA
switch (tipoCarga) {
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
    // No se necesita un caso default ya que el caso por defecto se maneja al definir tipoCarga
}

export default function () {
    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    let url = 'http://localhost:8080/api/v3/pet/findByStatus?status=available';

    let response = http.get(url, params);

    check(response, {
        'is status 200': (r) => r.status === 200,
        'is the status available': (r) => JSON.parse(r.body)[0].status === 'available',
    });
}
