import axios from "axios";

/**
 * Create headers
 * 
 * @returns {Object} 
 */
function createHeaders(jwtToken = "") {
    let headers = {
        "Content-Type": "application/json",
        "Cookie": ``,
    };
    if(jwtToken) {
        // Add jwt token
        headers["Cookie"] = `_token=${jwtToken}`;
    }
    
    return headers;
}

/**
 * Create server url and endpoint
 * 
 * @param {*} url 
 * @param {*} endpoint 
 */
function createServerUrlAndEndpoint(url: string, endpoint = "") {
    // Get full app url
    return endpoint ? `${url}/${endpoint}` : url;
}

/**
 * Create axios instance on the frontend or backend
 * 
 * @param {string} url 
 * @param {string} endpoint (Optional)
 * @param {string} jwtToken (Optional)
 */
export default function createAxiosInstance(serverUrl: string, endpoint = "", jwtToken = '') {
    // Get base url
    const baseUrl = createServerUrlAndEndpoint(serverUrl, endpoint);
    
    // Headers
    const headers = createHeaders(jwtToken);
    
    const instance = axios.create({
        withCredentials: true,
        baseURL: baseUrl,
        timeout: 2000,
        headers,
    });
    
    return instance;
}
