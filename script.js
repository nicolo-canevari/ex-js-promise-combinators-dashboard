// // Funzione asincrona per ottenere i dati della dashboard relativi a una città
// async function getDashboardData(query) {

//     try {
//         // URL base 
//         const BASE_URL = 'https://boolean-spec-frontend.vercel.app/freetestapi';
//         console.log(`Inizio recupero dati per la città: "${query}"`);

//         // Esegue tutte le richieste in parallelo con Promise.all
//         const [destRes, weatherRes, airportRes] = await Promise.all([
//             fetch(`${BASE_URL}/destinations?search=${query}`),
//             fetch(`${BASE_URL}/weathers?search=${query}`),
//             fetch(`${BASE_URL}/airports?search=${query}`)
//         ]);

//         console.log("Risposte ricevute, ora parsing JSON...");

//         // Converte le risposte in JSON
//         const [destinations, weathers, airports] = await Promise.all([
//             destRes.json(),
//             weatherRes.json(),
//             airportRes.json()
//         ]);

//         // Estrae il primo risultato da ciascun array 
//         const destination = destinations[0];
//         const weather = weathers[0];
//         const airport = airports[0];

//         // Verifica che tutti i dati siano stati trovati
//         if (!destination || !weather || !airport) {
//             throw new Error("Alcuni dati non sono stati trovati.");
//         }

//         // Costruisce l'oggetto aggregato
//         const data = {
//             city: destination.name,
//             country: destination.country,
//             temperature: weather.temperature,
//             weather: weather.weather_description,
//             airport: airport.name
//         };

//         // console.log("Dati aggregati pronti:", data);

//         // Stampa i dati in console 
//         console.log('Dashboard data:', data);
//         console.log(
//             `${data.city} is in ${data.country}.\n` +
//             `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
//             `The main airport is ${data.airport}.\n`
//         );

//         // Restituisce l'oggetto
//         return data;


//     } catch (error) {
//         // Gestione degli errori
//         console.error("Errore nel recupero dei dati:", error.message);
//         throw error;
//     }

// }

// TEST
// getDashboardData('london');


// BONUS 1

// // Funzione asincrona che recupera informazioni su una città
// async function getDashboardData(query) {

//     // URL base da usare per le chiamate API
//     const BASE_URL = 'https://boolean-spec-frontend.vercel.app/freetestapi';

//     // Costruzione degli endpoint API per destinazioni, meteo e aeroporti
//     const urls = {
//         destination: `${BASE_URL}/destinations?search=${query}`,
//         weather: `${BASE_URL}/weathers?search=${query}`,
//         airport: `${BASE_URL}/airports?search=${query}`
//     };

//     console.log(`Inizio chiamate API per "${query}"`);

//     try {
//         // Esecuzione delle tre fetch in parallelo con Promise.allSettled
//         const responses = await Promise.allSettled([
//             fetch(urls.destination),
//             fetch(urls.weather),
//             fetch(urls.airport)
//         ]);

//         console.log("Risposte fetch ricevute:", responses);

//         // Parsing JSON delle risposte solo se fulfilled
//         const jsonResults = await Promise.allSettled(
//             responses.map((res, i) =>
//                 res.status === 'fulfilled' ? res.value.json() : Promise.resolve(null)
//             )
//         );

//         console.log("JSON delle risposte:", jsonResults);

//         // Estrazione del primo elemento dagli array, o null se array vuoto o errore
//         const [dest, weather, airport] = jsonResults.map((result, i) => {
//             const label = ['Destinazione', 'Meteo', 'Aeroporto'][i];

//             // Verifica che la risposta sia valida e contenga almeno un risultato
//             if (result.status !== 'fulfilled' || !result.value || result.value.length === 0) {
//                 console.warn(`${label} non trovata o array vuoto.`);
//                 return null;
//             }
//             // Ritorna il primo risultato utile
//             return result.value[0];
//         });

//         // Costruzione dell’oggetto finale con i dati aggregati
//         const data = {
//             city: dest?.name ?? null,
//             country: dest?.country ?? null,
//             temperature: weather?.temperature ?? null,
//             weather: weather?.weather_description ?? null,
//             airport: airport?.name ?? null
//         };

//         console.log("Dati aggregati finali:", data);

//         // Stampa dei dati formattati solo se sono presenti
//         console.log("Output formattato:");
//         if (data.city && data.country) {
//             console.log(`${data.city} is in ${data.country}.`);
//         }
//         if (data.temperature !== null && data.weather !== null) {
//             console.log(`Today there are ${data.temperature} degrees and the weather is ${data.weather}.`);
//         }
//         if (data.airport) {
//             console.log(`The main airport is ${data.airport}.`);
//         }
//         // Ritorna i dati finali
//         return data;

//     } catch (err) {
//         // Gestione errori generici
//         console.error("Errore durante il recupero dei dati:", err.message);
//         throw err;
//     }
// }

// // TEST
// getDashboardData("vienna");


// BONUS 3

// Funzione principale per ottenere dati aggregati di una città
async function getDashboardData(query) {
    const BASE_URL = 'https://boolean-spec-frontend.vercel.app/freetestapi';

    // Definizione delle URL per le tre risorse.
    const urls = {
        destination: `${BASE_URL}/destinations?search=${query}`,
        // Il link per il meteo è fittizio per testare il caso di errore.
        weather: `https://www.meteofittizio.it/weathers?search=${query}`,
        airport: `${BASE_URL}/airports?search=${query}`
    };

    console.log(`Inizio chiamate API per "${query}"`);

    try {
        // Chiamate API simultanee con Promise.allSettled
        // Ci permette di gestire le fetch fallite senza bloccare tutta la funzione
        const responses = await Promise.allSettled([
            fetch(urls.destination),
            fetch(urls.weather),
            fetch(urls.airport)
        ]);

        console.log("Risposte fetch ricevute:", responses);

        // Effettua il parsing JSON delle risposte solo se la fetch ha avuto successo
        const jsonResults = await Promise.allSettled(
            responses.map((res, i) => {
                if (res.status === 'fulfilled') {
                    return res.value.json();
                    // Se una fetch è fallita, stampa un errore e restituiamo null per quella voce
                } else {
                    const label = ['Destinazione', 'Meteo', 'Aeroporto'][i];
                    console.error(`Errore nella fetch di ${label}:`, res.reason);
                    // Mantiene la posizione con valore null
                    return Promise.resolve(null);
                }
            })
        );

        console.log("🧪 JSON delle risposte:", jsonResults);

        // Estrazione e controllo dei dati per ogni sezione
        const [dest, weather, airport] = jsonResults.map((result, i) => {
            const label = ['Destinazione', 'Meteo', 'Aeroporto'][i];
            // Se la risposta JSON è vuota o nulla, warning!
            if (result.status !== 'fulfilled' || !result.value || result.value.length === 0) {
                console.warn(`${label} non trovata o array vuoto.`);
                return null;
            }
            // Prende il primo risultato valido
            return result.value[0];
        });

        // Costruzione dell'oggetto finale aggregato
        const data = {
            city: dest?.name ?? null,
            country: dest?.country ?? null,
            temperature: weather?.temperature ?? null,
            weather: weather?.weather_description ?? null,
            airport: airport?.name ?? null
        };

        console.log("✅ Dati aggregati finali:", data);

        // Output finale formattato in console (solo se i dati sono presenti)
        console.log("Output formattato:");
        if (data.city && data.country) {
            console.log(`${data.city} is in ${data.country}.`);
        }
        if (data.temperature !== null && data.weather !== null) {
            console.log(`Today there are ${data.temperature} degrees and the weather is ${data.weather}.`);
        }
        if (data.airport) {
            console.log(`The main airport is ${data.airport}.`);
        }

        // Ritorna i dati finali, utili anche per visualizzazioni nel DOM
        return data;

    } catch (err) {
        // Catch generale per eventuali altri errori
        console.error("❌ Errore generale nella funzione:", err.message);
        throw err;
    }
}

// TEST
getDashboardData("london");