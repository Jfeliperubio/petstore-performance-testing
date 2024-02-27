import http from 'k6/http';
import { check, sleep } from 'k6';

const ligera = 10; // Asumiendo que 0.1 VUs equivalen a 10 VUs para facilitar el ejemplo
const constante = 20; // Asumiendo que 0.2 VUs equivalen a 20 VUs
const pico = 60; // Asumiendo que 0.6 VUs equivalen a 60 VUs

let tipoCarga = __ENV.TIPO_CARGA || "ligera"; // cargaLigera es el valor predeterminado

let stages = [];

if (tipoCarga === "ligera") {
    stages = [
        { duration: '1m', target: ligera },
        { duration: '3m', target: ligera },
        { duration: '1m', target: 0 },
    ];
} else if (tipoCarga === "constante") {
    stages = [
        { duration: '1m', target: constante },
        { duration: '3m', target: constante },
        { duration: '1m', target: 0 },
    ];
} else if (tipoCarga === "pico") {
    stages = [
        { duration: '1m', target: pico },
        { duration: '3m', target: pico },
        { duration: '1m', target: 0 },
    ];
}

export let options = {
    stages: stages,
    thresholds: {
        'http_req_duration': ['p(95)<500'], // Ajusta este valor según tus requisitos de rendimiento
        'http_req_failed': ['rate<0.01'],   // Asegura que menos del 1% de las peticiones fallen
    },
    tags: {
        tipo_de_carga: tipoCarga, // Añadir el tipo de carga como un tag global
        caso_de_prueba: "ActualizacionPet", // Ejemplo de nombre para el caso de prueba
    },
};

export default function () {
    let url = 'http://localhost:8080/api/v3/store/inventory';
    let params = {
        headers: {
            'Accept': 'application/json',
        },
    };

    let response = http.get(url, params);

    // Verifica que la respuesta sea la esperada
    check(response, {
        'is status 200': (r) => r.status === 200,
        // Agrega más validaciones según sea necesario
    });

    sleep(1); // Pausa entre llamadas para simular el comportamiento del usuario
}
