import axios, { AxiosInstance } from "axios";

/**
 * Images API for a user that is not logged in
 * 
 * Public Images API
 */
export default class GuestImagesAPI {
    instance: AxiosInstance;
    propertyId: number;
    
    /**
     * Images api
     * 
     * @param {number} propertyId This property id
     */
    constructor(propertyId: number) {
        // Create axios instance
        this.instance = axios.create({
            baseURL: `${window.location.origin}/property`,
            timeout: 2000,
            headers: {'Content-Type': 'application/json'}
        });
        this.propertyId = propertyId;
    }
    
    // --- API Calls ---
    /**
     * When the page loads fetch all images
     */
    async fetchAll() {
        let res = await this.instance.get(`/operation/get_all/${this.propertyId}`)
            .then((res) => {
                console.log(`Fetch property images result: `, res.data);
                return res;
            }).catch((err) => {
                console.log(`Error when fetching image names from the backend: `, err);
            });
        
        if(res && res.data) {
            return res.data.images;
        } else {
            return undefined;
        }
    }
}
