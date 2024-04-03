import { v4 as uuidv4 } from 'uuid';

// import { DebugPropertyImageUploadAPI } from "felixriddle.good-roots-ts-api";

import PropertyImageUtils from "../../PropertyImageUtils";
import defaultPropertyImagesConfiguration from "../../../../config/defaultPropertyImagesConfiguration";
import ImagesAPI from "../../ImagesAPI";

// Executed at the start
const IMAGES_NOT_ZERO = 0;

// Executed in the middle
const REMOVE_HEAVY_IMAGES = 2;
// Images that are above the limit of max images
const REMOVE_EXTRA_IMAGES = 4;

// Executed at the end
const REMOVE_IMAGES_WHEN_FINISHED = 1;
const UPLOAD_IMAGES = 3;
const UPDATE_PROPERTY_IMAGES = 5;

// Action stage
// 1) Frontend validation
const ACTION_STAGE = 1;
// Course uuid
const COURSE_UUID = uuidv4();

/**
 * On images input change
 * 
 * Abstraction of things to do when the images input change
 * 
 * Behavior
 * * Order is forced internally
 * That is, if you added an action that should be executed at the end, regardless of
 * where you added it, it will be executed at the end.
 * 
 * Disordered images management
 * I've thought of a better way to do this
 * Enter [Ordered Images Management]
 * With this model the actions are put in the order that are given,
 * different from this one, in which the order is forced internally.
 * TODO: [Ordered Images Input Controller]
 */
export default class ImageInputChange {
    startRules: Array<number> = [];
    rules: Array<number> = [];
    endRules: Array<number> = [];
    
    stop = false;
    
    // For the debugging api
    debugEnabled = false;
    imagesInput: HTMLInputElement;
    propertyId: number;
    
    // Apis
    api: ImagesAPI;
    // debugImageUploadApi: DebugPropertyImageUploadAPI | undefined;
    
    /**
     * 
     * @param {ImagesAPI} api 
     * @param {string} inputId Images input id
     */
    constructor(api: ImagesAPI, inputId: string, propertyId: number, debug=false) {
        const imagesInput = document.getElementById(inputId) as HTMLInputElement;
        if(!imagesInput) {
            throw Error("The image input element doesn't exists!");
        } else {
            console.log("Image input element found!");
        }
        this.api = api;
        this.imagesInput = imagesInput;
        this.propertyId = propertyId;
        
        if(debug) {
            this.enableDebug();
        }
    }
    
    /**
     * Enable debug
     */
    async enableDebug() {
        console.log(`[Image input change] Enabled debug`);
        
        // // Debug
        // this.debugImageUploadApi = new DebugPropertyImageUploadAPI(
        //     ACTION_STAGE,
        //     COURSE_UUID,
        //     this.api.propImgs.names(),
        //     this.api.jwtToken,
        // );
        console.log(`Uuid type: ${typeof(COURSE_UUID)}`);
        
        // // Create first message
        // this.debugImageUploadApi.createMessage(
        //     "Start process",
        //     "Start process of uploading an image",
        //     1
        // );
        
        // Tell the class that debug was enabled
        this.debugEnabled = true;
    }
    
    /**
     * The callback is awaited
     * 
     * @param {function} cb Callback
     */
    async enableWithCallback(cb: () => void) {
        const thisObj = this;
        this.imagesInput.addEventListener("change", async (event) => {
            console.log(`Image has changed!`);
            
            // Start rules
            if(thisObj.startRules.length > 0) {
                await thisObj.onStart();
                
                // Some rules may want to stop the code from running
                if(thisObj.stop) {
                    console.log("(Start)Stopping code");
                    return;
                }
            }
            
            // Ruless
            if(thisObj.rules.length > 0) {
                thisObj.onMiddle();
                
                // Some rules may want to stop the code from running
                if(thisObj.stop) {
                    console.log("(Middle)Stopping code");
                    return;
                }
            }
            
            // End rules
            if(thisObj.rules.length > 0) {
                await thisObj.onFinish();
                
                // Some rules may want to stop the code from running
                if(thisObj.stop) {
                    console.log("(End)Stopping code");
                    return;
                }
            }
            
            await cb();
        });
    }
    
    /**
     * Functions at the start
     */
    async onStart() {
        for(let rule of this.startRules) {
            switch(rule) {
                case IMAGES_NOT_ZERO: {
                    console.log("Images not zero");
                    // Remove images from the input
                    await this.imagesNotZeroFn();
                    break;
                }
            };
            
            // Some rules may want to stop the code from running
            if(this.stop) {
                break;
            }
        }
    }
    
    /**
     * Middle functions
     */
    onMiddle() {
        for(let rule of this.rules) {
            switch(rule) {
                case REMOVE_HEAVY_IMAGES: {
                    console.log("Remove heavy images");
                    // Remove images from the input
                    this.removeHeavyImagesFn();
                    break;
                }
            }
        }
    }
    
    /**
     * Functions at the end
     */
    async onFinish() {
        // Latest of all
        let removeImages = false;
        let updatePropertyImages = false;
        
        // Execute every rule
        for(let rule of this.endRules) {
            switch(rule) {
                case UPLOAD_IMAGES: {
                    console.log("Upload images");
                    await this.uploadImagesFn();
                    break;
                }
                case REMOVE_IMAGES_WHEN_FINISHED: {
                    removeImages = true;
                    break;
                }
                case UPDATE_PROPERTY_IMAGES: {
                    updatePropertyImages = true;
                    break;
                }
            }
        }
        
        // At the end
        if(removeImages) {
            console.log("Remove images when finished");
            // Remove images from the input
            this.removeImagesWhenFinishedFn();
        }
        
        if(updatePropertyImages) {
            // Update images view
            this.updatePropertyImagesFn();
        }
    }
    
    // --- Rules functions ---
    /**
     * Check on the stop variable and send a message for either case
     * 
     * It first checks for debug enabled
     * 
     */
    async sendMessageOnStop(
        messageTitle: string,
        message: string,
    ) {
        // // Check for debug thingy
        // if(this.debugImageUploadApi) {
        //     if(this.stop) {
        //         await this.debugImageUploadApi.createMessage(
        //             messageTitle,
        //             message,
        //             4,
        //         );
        //     } else {
        //         await this.debugImageUploadApi.createMessage(
        //             messageTitle,
        //             message,
        //             2,
        //         );
        //     }
        // }
    }
    
    /**
     * Images are not zero function
     */
    async imagesNotZeroFn() {
        // Check that there are files
        const files = this.imagesInput.files as FileList;
        console.log(`Images: `, files.length);
        if(files.length === 0) {
            console.log("No images, stop");
            
            this.stop = true;
        }
        
        // Send message on stop
        this.sendMessageOnStop(
            "More than zero images",
            "Validate that there are more than zero images"
        );
    }
    
    /**
     * Upload images
     */
    async uploadImagesFn() {
        // Get form data from it
        const publishImageElement = document.getElementById("publish_image") as HTMLFormElement;
        
        if(!publishImageElement) {
            throw Error("Formulary doesn't exists or couldn't be found.");
        }
        
        const formData = new FormData(publishImageElement);
        
        // if(!this.debugImageUploadApi) {
        //     return;
        // }
        
        // await this.debugImageUploadApi.createMessage(
        //     "Send image",
        //     "Send image to the backend",
        //     2,
        // );
        
        // Send images to server
        await this.api.instance.postForm(
            `/set_image/${this.propertyId}`,
            formData
        );
        console.log("Image uploaded");
    }
    
    removeExtraImagesFn() {
        // If the size is greater remove the images
        // TODO: This limit has to work on the backend too, and test it.
        // TODO: This limit has to work here on the frontend, and test it.
        if(this.imagesInput.files &&
            this.imagesInput.files.length >= defaultPropertyImagesConfiguration.maxImages) {
            // Get current images...
            // Idk where the 'getImagesNameArray' method went, it seems it was deleted, my bad.
            // let currentImages = thisObject.getImagesNameArray();
            
            this.stop = true;
        }
        
        // Send message on stop
        this.sendMessageOnStop(
            "Stop on extra images",
            "Stop when there are more images than the limit declared by the server"
        );
    }
    
    /**
     * Remove heavy images
     * 
     * @returns {}
     */
    removeHeavyImagesFn() {
        // Remove files that don't fit the size configuration
        // TODO: This looks ABSTRACTABLE 😤😤😤
        if(this.imagesInput.files) {
            
            // Go through each image file
            for(const image of this.imagesInput.files) {
                
                // Get image size
                const bytesSize = image.size;
                const sizeInMB = Number((bytesSize / (1024*1024)).toFixed(2));
                console.log(`Image: `, image);
                
                // Check that file sizes are below the maximum allowed
                const maxSize = PropertyImageUtils.maxFileSizeMB();
                if(maxSize < sizeInMB) {
                    console.log(`Max size exceeded!`);
                    
                    // Let's not inject html for now
                    // // Create message
                    // const msgCtrl = new MessageController();
                    // msgCtrl.insertMessage(`Max file size exceeded, file name of the heavy file: ${this.image.name}`, 4);
                    
                    
                    // Stop code
                    this.stop = true;
                }
            }
            
            // Send message on stop
            this.sendMessageOnStop(
                "Greater file size",
                "Stop the code, when there are images that have a greater file size than they should"
            );
        }
    }
    
    /**
     * Remove images when finished
     * 
     * And push message
     */
    async removeImagesWhenFinishedFn() {
        // Remove images from the input
        // We will use the names to check which ones do exist
        this.imagesInput.value = "";
        
        // if(this.debugImageUploadApi) {
        //     // Send message on stop
        //     await this.debugImageUploadApi.createMessage(
        //         "Remove images",
        //         "Remove images from the input when finished",
        //         2,
        //     );
        // }
    }
    
    async updatePropertyImagesFn() {
        // Update images view
        this.api.updatePropertyImages();
    }
    
    // --- Enable rules ---
    /**
     * Check that images length is not zero
     */
    imagesNotZero() {
        this.startRules.push(IMAGES_NOT_ZERO);
    }
    
    removeExtraImages() {
        this.rules.push(REMOVE_EXTRA_IMAGES);
    }
    
    removeHeavyImages() {
        this.rules.push(REMOVE_HEAVY_IMAGES);
    }
    
    removeImagesWhenFinished() {
        this.endRules.push(REMOVE_IMAGES_WHEN_FINISHED);
    }
    
    uploadImages() {
        this.endRules.push(UPLOAD_IMAGES);
    }
    
    updatePropertyImages() {
        this.endRules.push(UPDATE_PROPERTY_IMAGES);
    }
}
