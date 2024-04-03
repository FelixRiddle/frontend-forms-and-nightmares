import { ExpressAuthentication } from "felixriddle.good-roots-ts-api";
import { formFetchAllValues } from "felixriddle.checkpoint";

import validateProperty from "../../../validation/validateProperty.js";
// import MarkPositionManager from "../../../map/MarkPositionManager.js";

// const markerPosition = new MarkPositionManager();


/**
 * Position change callback
 * 
 * @param {Object} newPosition The new position, contains tons of information
 */
const positionChangeCallback = (newPosition: any) => {
    // We have to set street, latitude and longitude.
    // Street
    let streetName = `${newPosition.streetName} ${newPosition.streetNumber}`;
    let street = <HTMLInputElement>document.getElementById("street");
    if(street) {
        street.value = streetName;
    }
    
    // Display street name to the user
    let showStreet = document.getElementById("show_street");
    if(showStreet) {
        showStreet.innerHTML = streetName;
    }
    
    // Latitude
    let latitude = <HTMLInputElement>document.getElementById("latitude");
    if(latitude) {
        latitude.value = newPosition.latitude;
    }
    
    // Longitude
    let longitude = <HTMLInputElement>document.getElementById("longitude");
    if(longitude) {
        longitude.value = newPosition.longitude;
    }
}

// markerPosition.setPositionChangeCallback(positionChangeCallback);

// The whole class was just a hook before
// // On button click send request
// hookRequestOnButtonClick();

/**
 * Create property
 * 
 * Class for the only purpose of creating a property
 */
export default class CreateProperty {
    token: string;
    
    constructor(token: string) {
        this.token = token;
    }

    /**
     * Send a request on button click
     * 
     * @returns 
     */
    hookRequestOnButtonClick() {
        // Get submit button
        let submitBtn = document.getElementById("createProperty");
        if(!submitBtn) {
            // An error has occurred
            console.log(`Couldn't find submit button!`);
            return;
        }
        
        // Hook the click event
        submitBtn.addEventListener("click", this.onClick);
    }    
    
    /**
     * On click
     * 
     * @param event 
     * @returns 
     */
    async onClick(event: any) {
        // Post on create
        try {
            event.preventDefault();
            
            console.log(`The user clicked the button.`);
            
            // I could do a library that defines input elements
            // Another for the views that read these input elements
            // Another for validation
            // Every input element name
            const inputElementsNames = [
                "title",
                "description",
                "rooms",
                "parking",
                "bathrooms",
                "street",
                "latitude",
                "longitude",
                "priceId",
                "categoryId",
            ];
            
            // Take the form and fetch every value from the names
            let property = formFetchAllValues(inputElementsNames);
            if(property) {
                console.log(`Fetch form values Ok`);
            } else {
                console.log(`Couldn't fetch form values!`);
                
                // Get outta here
                return;
            }
            
            // Parse values
            property.categoryId = parseInt(property.categoryId);
            property.priceId = parseInt(property.priceId);
            property.bathrooms = parseInt(property.bathrooms);
            property.parking = parseInt(property.parking);
            property.rooms = parseInt(property.rooms);
            
            // Place
            property.latitude = parseFloat(property.latitude);
            property.longitude = parseFloat(property.longitude);
            
            console.log(`Property: `, property);
            
            // Check that validation passes
            let result = validateProperty(property);
            if(result.length > 0) {
                console.log(`Validation didn't pass`);
                return result;
            }
            console.log(`Validation passed`);
            
            // Create property api
            const api = new ExpressAuthentication();
            const userApi = await api.userApi(this.token);
            const propertyApi = userApi.propertyApi();
            
            // Create property
            await propertyApi.create(property);
        } catch(err) {
            console.log(`Error: `, err);
        }
    }
}
