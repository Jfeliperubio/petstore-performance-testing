import http from 'k6/http';
import { check, sleep } from 'k6';

// Constantes para las cargas
const CARGAS = {
    ligera: 5, // 0.025 VUs equivalen a 5 VUs para facilitar el ejemplo
    constante: 10, // 0.05 VUs equivalen a 10 VUs
    pico: 30, // 0.15 VUs equivalen a 30 VUs
};

// Determinar el tipo de carga desde la variable de entorno o usar un valor predeterminado
let tipoCarga = __ENV.TIPO_CARGA || "ligera";

// Función para obtener las etapas de carga dinámicamente
function obtenerEtapas(carga) {
    return [
        { duration: '1m', target: carga },
        { duration: '3m', target: carga },
        { duration: '1m', target: 0 },
    ];
}

export let options = {
    stages: obtenerEtapas(CARGAS[tipoCarga] || CARGAS.cargaLigera), // Usar la función para obtener las etapas
    thresholds: {
        'http_req_duration': ['p(95)<200'], // 95% de las solicitudes deben ser menores a 200ms
        'http_req_failed': ['rate<0.01'], // Tasa de fallos debe ser menor al 1%
    },
    tags: {
        tipo_de_carga: tipoCarga, // Añadir el tipo de carga como un tag global
        caso_de_prueba: "ActualizacionPet", // Ejemplo de nombre para el caso de prueba
    },
};

export default function () {
    let petId = 8;
    let url = `http://localhost:8080/api/v3/pet/${petId}`;
    let headers = { 'Accept': '*/*' };

    let response = http.del(url, null, { headers: headers });

    // Verificar la respuesta
    check(response, {
        'is status 200': r => r.status === 200,
    });

    sleep(1); // Pausa entre llamadas para simular el comportamiento del usuario
}
