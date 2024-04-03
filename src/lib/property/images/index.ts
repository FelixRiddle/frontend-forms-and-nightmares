
import { PropertyType } from "felixriddle.good-roots-ts-api";

import ImagesAPI from "./ImagesAPI";

/**
 * Get all property images url
 * 
 * @param {number} propertyId Property id
 */
async function getAllPropertyImagesUrl(propertyId: number) {
    // Images API
    const api = new ImagesAPI(propertyId);
    
    // Property images
    const propertyImages = api.propImgs;
    
    // Set it back to the api, wondering if this is ok?
    api.setPropertyImagesObject(propertyImages);
    
    // Get property images
    await api.updatePropertyImagesAsync();
    
    const imagesUrl = propertyImages.getAllImagesUrl();
    
    return imagesUrl;
}

/**
 * Update property images
 * 
 * Creates the field 'images' in every property given, which is an array of the property images.
 * 
 * @param {Array} properties Array of properties
 * @returns {Array} Properties with the field 'images' that has a url pointing to the image.
 */
async function updatePropertyImages(properties: Array<PropertyType>) {
    // This could be faster, because promises are separated, and executed asynchronously, maybe?
    // const propertyImages = await Promise.all([
    //     ...properties.map(async (property) => await getAllPropertyImagesUrl(property.id))
    // ]);
    
    for(const property of properties) {
        property.images = await getAllPropertyImagesUrl(property.id);
    }
    
    return properties;
}

/**
 * Update property images for guest user
 * 
 * Creates the field 'images' in every property given, which is an array of the property images.
 * 
 * @param {Array} properties Array of properties
 * @returns {Array} Properties with the field 'images' that has a url pointing to the image.
 */
async function guestUpdatePropertyImages(properties: Array<PropertyType>) {
    for(const property of properties) {
        property.images = await getAllPropertyImagesUrl(property.id);
    }
    
    return properties;
}

export {
    getAllPropertyImagesUrl,
    guestUpdatePropertyImages,
    updatePropertyImages,
}
