
type EmptyCb = () => void;

/**
 * Whole class just to handle property images easily
 * 
 * Features:
 * - Get array of names
 * - Get 'Union' image names of two sets
 */
export default class PropertyImages {
    propertyImages: Array<string> = [];
    updatePropertyCallback: undefined | EmptyCb = undefined;
    
    /**
     * 
     */
    constructor() {
    }
    
    // --- Operations ---
    /**
     * Are there more than one property
     */
    exists() {
       return this.propertyImages.length > 0;
    }
    
    /**
     * Get all
     */
    getAll() {
        return this.propertyImages;
    }
    
    /**
     * Get all images url
     * 
     * Converts the property images location to image urls, using 'location.origin' as the base url.
     * 
     * @returns {Array} Array of images url
     */
    getAllImagesUrl() {
        // Create image views
        const propertyImages = this.getAll();
        let index = 0;
        let imagesUrl: Array<string> = [];
        
        for(const imgLocation of propertyImages) {
            // Set image source
            const imgSource = `${location.origin}/${imgLocation}`;
            
            // Insert into the carousel view
            imagesUrl.push(imgSource);
            
            index++;
        }
        
        return imagesUrl;
    }
    
    /**
     * Get array of names only
     */
    names() {
        return this.propertyImages.map((img) => {
            const parts = img.split("/");
            
            // Remember it's encoded
            const encodedName = parts[parts.length - 1];
            
            // Decode it
            return decodeURI(encodedName);
        });
    }
    
    /**
     * Compare an array of names and get the elements that intersect with property image names
     * 
     * This is used for determining extra images that exceed the maximum limit.
     * 
     * @param {Array} imageNames Image names
     */
    namesIntersection(imageNames: Array<string>) {
        return this.names().filter((element: string) => imageNames.includes(element));
    }
    
    /**
     * Get element at
     * 
     * @param {number} index Property image index
     */
    at(index: number) {
        return this.propertyImages[index];
    }
    
    /**
     * Set property images
     * 
     * 
     */
    setPropertyImages(propertyImages: Array<string>) {
        this.propertyImages = propertyImages;
    }
    
    // --- Special ---
    /**
     * Update property callback
     * 
     * @param {function} cb Callback
     */
    setUpdatePropertyCallback(cb: EmptyCb) {
        this.updatePropertyCallback = cb;
    }
    
    /**
     * Call update property callback
     */
    callUpdatePropertyCB() {
        // Check if it exists
        if(this.updatePropertyCallback) {
            this.updatePropertyCallback();
        }
    }
}
