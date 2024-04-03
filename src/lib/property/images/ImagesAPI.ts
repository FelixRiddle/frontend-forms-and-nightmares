import axios, { AxiosInstance } from "axios";

import { SERVERS_DEFAULT_LOCATION } from "../../../index";
import PropertyImages from "./PropertyImages";
import createAxiosInstance from "../../../createAxiosInstance";

/**
 * Images API
 * 
 * Images API is an endpoint abstraction to manage property images.
 * 
 * This is for editing images, not for viewing them.
 * 
 * Features:
 * - Fetches property images
 * - Removes images
 * - Sets images
 * - Can also publish/unpublish a property
 */
export default class ImagesAPI {
    propertyId: number;
    instance: AxiosInstance;
    propImgs: PropertyImages;
    jwtToken: string;
    
    /**
     * Images api
     * 
     * @param {number} propertyId This property id
     * @param {PropertyImages} propertyImages Property images manager
     */
    constructor(propertyId: number, jwtToken: string = '') {
        const url = `${SERVERS_DEFAULT_LOCATION['express-real-estate']}/user/property/images`;
        console.log(`Url: `, url);
        
        this.instance = createAxiosInstance(url, '', jwtToken);
        this.jwtToken = jwtToken;
        this.propertyId = propertyId;
        
        this.propImgs = new PropertyImages();
    }
    
    /**
     * Set property images object
     * 
     * @param {PropertyImages} propertyImages Property images manager
     */
    setPropertyImagesObject(propertyImages: PropertyImages) {
        this.propImgs = propertyImages;
    }
    
    // --- API Calls ---
    /**
     * When the page loads fetch all images
     */
    async fetchAll(): Promise<Array<string> | undefined> {
        const endpoint = `/get_all/${this.propertyId}`;
        console.log(`Endpoint: `, endpoint);
        let res = await this.instance.get(endpoint)
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
    
    // /**
    //  * Send preflight request to server about the images
    //  * 
    //  * @param {Array} images Array of image files
    //  */
    // async preflightRequest(images) {
    //     if(!images) {
    //         console.log("Can't send preflight request if there are no images!! 🤬🤬🤬🤬");
    //         return;
    //     }
        
    //     let imagesArray = [];
    //     for(const image of images) {
    //         imagesArray.push({
    //             name: image.name,
    //             size: image.size,
    //         });
    //     }
        
    //     const endpoint = `/add_image_preflight/${this.propertyId}`;
        
    //     // Post data
    //     let res = await this.instance.post(endpoint, {
    //         images: imagesArray,
    //     }).then((res) => res)
    //         .catch((err) => {
                
    //             console.log("Error: ", err);
    //             return;
    //         });
        
    //     // console.log(`Response status: `, res.status);
    //     // console.log(`Response data: `, res.data);
        
    //     // Update collisions
    //     this.collisions = res.data.collisions;
        
    //     return res.data;
    // }
    
    /**
     * Remove an image at a given index
     * 
     * The local index of images
     * 
     * @param {number} index Image index
     */
    async removeImage(index: number) {
        let imageName = this.propImgs.at(index);
        const endpoint = `/remove_image/${this.propertyId}`;
        
        // Post data
        let res = await this.instance.post(endpoint, {
            imageName,
        })
            .then((res) => res)
            .catch((err) => {
                console.error(`Error when posting the image name: `, err);
            });
        
        // console.log(`Response: `, res.data);
    }
    
    /**
     * Set images endpoint
     */
    async setImages() {
        const endpoint = `/set_image/${this.propertyId}`;
        
        // Post data
        let res = await this.instance.post(endpoint).then((res) => res)
            .catch((err) => {
                
                console.log("Error: ", err);
                return;
            });
    }
    
    /**
     * Set property to published
     * 
     * @param {bool} value 
     */
    async setPropertyPublished(value: boolean) {
        const instance = axios.create({
            baseURL: `${window.location.origin}/user/property`,
            timeout: 2000,
            headers: {'Content-Type': 'application/json'}
        });
        const endpoint = `/publish_property/${this.propertyId}`;
        
        // Post data
        await instance.post(endpoint, {
            value,
        })
            .then((res) => res)
            .catch((_err) => {
                // It keeps throwing an error I don't really know what it is, it's too long.
                // console.error(`Error when posting the image name: `, err);
            });
    }
    
    // --- Property images ---
    /**
     * Update property images
     */
    updatePropertyImages() {
        // Fetch property images, if they exist
        let propertyImages = Promise.resolve(this.fetchAll());
        let thisClass = this;
        propertyImages.then((images) => {
            if(images) {
                thisClass.propImgs.setPropertyImages(images);
            }
            
            thisClass.propImgs.callUpdatePropertyCB();
        });
    }
    
    /**
     * Update but async
     */
    async updatePropertyImagesAsync() {
        // Fetch property images, if they exist
        const propertyImages = await this.fetchAll();
        if(propertyImages) {
            this.propImgs.setPropertyImages(propertyImages);
        }
        
        this.propImgs.callUpdatePropertyCB();
        
        return propertyImages;
    }
    
    /**
     * Set update property callback
     */
    setUpdatePropertyCallback(cb: () => void) {
        this.propImgs.setUpdatePropertyCallback(cb);
    }
}
