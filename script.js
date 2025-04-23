// Funzione asincrona per ottenere i dati della dashboard relativi a una città
async function getDashboardData(query) {

    try {
        // URL base 
        const BASE_URL = 'https://boolean-spec-frontend.vercel.app/freetestapi';
        console.log(`Inizio recupero dati per la città: "${query}"`);

        // Esegue tutte le richieste in parallelo con Promise.all
        const [destRes, weatherRes, airportRes] = await Promise.all([
            fetch(`${BASE_URL}/destinations?search=${query}`),
            fetch(`${BASE_URL}/weathers?search=${query}`),
            fetch(`${BASE_URL}/airports?search=${query}`)
        ]);

        console.log("Risposte ricevute, ora parsing JSON...");

        // Converte le risposte in JSON
        const [destinations, weathers, airports] = await Promise.all([
            destRes.json(),
            weatherRes.json(),
            airportRes.json()
        ]);

        // Estrae il primo risultato da ciascun array 
        const destination = destinations[0];
        const weather = weathers[0];
        const airport = airports[0];

        // Verifica che tutti i dati siano stati trovati
        if (!destination || !weather || !airport) {
            throw new Error("Alcuni dati non sono stati trovati.");
        }

        // Costruisce l'oggetto aggregato
        const data = {
            city: destination.name,
            country: destination.country,
            temperature: weather.temperature,
            weather: weather.weather_description,
            airport: airport.name
        };

        // console.log("Dati aggregati pronti:", data);

        // Stampa i dati in console 
        console.log('Dashboard data:', data);
        console.log(
            `${data.city} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
            `The main airport is ${data.airport}.\n`
        );

        // Restituisce l'oggetto
        return data;


    } catch (error) {
        // Gestione degli errori
        console.error("Errore nel recupero dei dati:", error.message);
        throw error;
    }

}

// Esempio di utilizzo della funzione con la città "london"
getDashboardData('london');