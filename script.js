// Funzione asincrona per ottenere i dati della dashboard relativi a una città
async function getDashboardData(query) {

    try {
        // URL base 
        const BASE_URL = 'https://boolean-spec-frontend.vercel.app/freetestapi';

        // Esegue tutte le richieste in parallelo con Promise.all
        const [destRes, weatherRes, airportRes] = await Promise.all([
            fetch(`${BASE_URL}/destinations?search=${query}`),
            fetch(`${BASE_URL}/weathers?search=${query}`),
            fetch(`${BASE_URL}/airports?search=${query}`)
        ]);


    } catch (error) {
        // Gestione degli errori
        console.error("Errore nel recupero dei dati:", error.message);
        throw error;
    }

}