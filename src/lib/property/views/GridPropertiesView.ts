import { PropertyAPI, PropertyType } from "felixriddle.good-roots-ts-api";

/**
 * Grid properties view
 */
export default class GridPropertiesView {
    propertyApi: PropertyAPI;
    
    properties: Array<PropertyType> = [];
    
    constructor() {
        this.propertyApi = new PropertyAPI();
    }
    
    /**
     * Setup, updates everything in order
     * 
     */
    async setup() {
        await this.updateProperties();
        
        this.updatePropertyImages();
    }
    
    /**
     * Update property images
     */
    updatePropertyImages() {
        for(const property of this.properties) {
            if(property.images) {
                // Element id
                const elId = `grid_property_image_${property.id}`;
                
                // Get element
                const el = document.getElementById(elId) as HTMLImageElement;
                if(el) {
                    // Set the first image as its main
                    el.src = property.images[0];
                } else {
                    console.warn(`A property grid image element couldn't be found!!`);
                }
            }
        }
    }
    
    /**
     * Fetch properties
     */
    async updateProperties() {
        const resData = await this.propertyApi.fetchAll();
        
        // Properties now come with the images
        const properties = resData.properties;
        
        this.properties = properties;
    }
}
