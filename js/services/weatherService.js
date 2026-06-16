const API_KEY = "4b30ed721b9153e9646f66e7c18586d4";

async function obtenerClima(ciudad) {
    try {
        const respuesta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
        );

        if (!respuesta.ok) {
            return "Ciudad no encontrada";
        }

        const datos = await respuesta.json();
        const temperatura = datos.main.temp;
        const descripcion = datos.weather[0].description;

        return `🌤 ${temperatura}°C - ${descripcion}`;

    } catch (error) {
        return "Error al obtener el clima";
    }
}