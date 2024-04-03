import { Validator } from "felixriddle.checkpoint";

/**
 * Validates a property object
 * 
 * @param {Object} property The property to validate
 * @returns {Array} Array of errors
 */
function validateProperty(property: any) {
    let coordinateScope = "coordinate_scope";
    let val = new Validator()
        // Title scope    
        .createScope("title", "title", property.title)
            .isNotFalsy()
            .lengthRange(3, 128)
        // Description scope
        .createScope("description", "description", property.description)
            .isNotFalsy()
            .lengthRange(10, 512)
        // Categories and price
        .createScope("cateogry", "categoryId", property.categoryId)
            .isInt()
            .numRange(0, 7)
        .createScope("price", "priceId", property.priceId)
            .isInt()
            .numRange(0, 10)
        // Others
        .createScope("rooms", "rooms", property.rooms)
            .isInt()
            .numRange(0, 9)
        .createScope("parking", "parking", property.parking)
            .isInt()
            .numRange(0, 4)
        .createScope("bathrooms", "bathrooms", property.bathrooms)
            .isInt()
            .numRange(0, 4)
        .createScope("latitude", "latitude", property.latitude)
            .isNotFalsy()
            .isFloat()
        .createScope("longitude", "longitude", property.longitude)
            .isNotFalsy()
            .isFloat()
        .createScope("street", "street", property.street)
            .isNotFalsy();
    
    // Check that validation passes
    let result = val.validate();
    if(result.length > 0) {
        return result;
    }
    
    return [];
}

export default validateProperty;
