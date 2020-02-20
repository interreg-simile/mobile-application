/**
 * @fileoverview This file contains the services for the miscellaneous endpoints. The services are workers which contain
 * the business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import fetch from "node-fetch";


/**
 * Fetches the current weather data for a given location from the OpenWeather API and return a subset of the result.
 *
 * @param {Object} query - The query parameters to apply to the request.
 * @return {Promise<{sky: number, temperature: number, wind: (number)}>} A Promise containing the weather data.
 */
export async function getWeather(query) {

    // Save the base url
    let url = "https://api.openweathermap.org/data/2.5/weather?";

    // Append each query parameter to the url
    for (const q in query) url += `${q}=${query[q]}&`;

    // Remove the last "&" or "?" from the url
    url = url.slice(0, -1);

    // Fetch the data from the OpenWeather API
    const res = await fetch(url);

    // Parse the response
    const json = await res.json();

    // Initialize the sky code
    let skyCode = 1;

    // Reduce the OpenWeather weather conditions to the one supported by the API
    if (json.weather[0].id >= 200 && json.weather[0].id < 600) skyCode = 4;
    else if (json.weather[0].id >= 600 && json.weather[0].id < 700) skyCode = 5;
    else if (json.weather[0].id >= 700 && json.weather[0].id < 800) skyCode = 6;
    else if (json.weather[0].id === 801) skyCode = 2;
    else if (json.weather[0].id > 801) skyCode = 3;

    // Return the weather data
    return { sky: skyCode, temperature: json.main.temp, wind: json.wind.speed };

}
