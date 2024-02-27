import http from 'k6/http';
import { check } from 'k6';

let tipoCarga = __ENV.TIPO_CARGA || 'ligera'; // Utiliza la variable de entorno CARGA o 'ligera' por defecto

export let options = {
    stages: [
        // Configuración por defecto para 'ligera'. Se sobrescribirá según el caso.
        { duration: '1m', target: 1 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // El 95% de las solicitudes deben completarse por debajo de 500ms
    },
    tags: {
        tipo_de_carga: tipoCarga, // Añade el tipo de carga como tag global
        caso_de_prueba: "ActualizacionPet", // Ejemplo de nombre para el caso de prueba
    }
};

// Configurar las etapas según la variable de entorno CARGA
switch (tipoCarga) {
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
    // No se necesita un default ya que el caso por defecto se maneja al definir tipoCarga
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
