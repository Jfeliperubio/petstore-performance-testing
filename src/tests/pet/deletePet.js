import http from 'k6/http';
import { check, sleep } from 'k6';


const cargaLigera = 5; // Asumiendo que 0.025 VUs equivalen a 5 VUs para facilitar el ejemplo
const cargaConstante = 10; // Asumiendo que 0.05 VUs equivalen a 10 VUs
const cargaPico = 30; // Asumiendo que 0.15 VUs equivalen a 30 VUs


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
        'http_req_duration': ['p(95)<200'],
        'http_req_failed': ['rate<0.01'],
    },
};

export default function () {
    let petId = 8;
    let url = `http://localhost:8080/api/v3/pet/${petId}`;
    let headers = { 'Accept': '*/*' };

    let response = http.del(url, null, { headers: headers });

    sleep(1); // Pausa entre llamadas para simular el comportamiento del usuario
}
