import ImagesAPI from "../ImagesAPI";
import PropertyImages from "../PropertyImages";
import RemoveIcon from "../RemoveIcon";
import ImageInputChange from "./image_input_change/ImageInputChange";

/**
 * Image editor
 * 
 * API to communicate with the backend
 */
export default class ImageEditor {
    previousImagesInputLength = 0;
    imagesView: Array<HTMLImageElement> = [];
    
    // Store previous quantity of images, this is to check
    // which are the images that exceed the limit of 10 images, and remove them.
    previousImages = [];
    
    // Class abstraction for remove icons
    removeImageIcons: Array<RemoveIcon> = [];
    
    // Collisions
    // Files that have collided with others in the backend will be set here
    collisions = [];
    
    inputId: string;
    propertyId: number;
    api: ImagesAPI;
    propertyImages: PropertyImages;
    
    /**
     * Create a new image editor
     * 
     * @param {string} inputId Input ID
     */
    constructor(inputId: string) {
        this.inputId = inputId;
        
        // Get property id
        const paths = window.location.pathname.split("/");
        const propertyId = Number(paths[paths.length - 1]);
        this.propertyId = propertyId;
        
        // Images API
        this.api = new ImagesAPI(propertyId);
        
        // Property images
        this.propertyImages = this.api.propImgs;
        
        // Set update callback
        const thisObj = this;
        this.propertyImages.setUpdatePropertyCallback(() => {
            thisObj.updateImageViews();
            console.log(`Images updated!`);
            
            // Update disabled
            const btn = <HTMLButtonElement>document.getElementById("publish");
            btn.disabled = !this.propertyImages.exists();
        });
        
        // Trigger update
        this.api.updatePropertyImages();
        
        // Add image views
        this.startAddImageViews();
        
        // Publish property action
        this.bindPublishProperty();
    }
    
    // Start operations
    
    /**
     * On publish property button click, send request to server to publish it
     * 
     * Hmmm, this looks..., ABSTRACTABLE 😤😤
     */
    bindPublishProperty() {
        const btn = <HTMLButtonElement>document.getElementById("publish");
        if(btn) {
            const thisObj = this;
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                
                // Make request
                await thisObj.api.setPropertyPublished(true);
                
                // Redirect to admin page
                location.href = `${location.origin}/user/property/admin`;
            });
            
            // Disabled is the opposite of whether there's an image or not
            btn.disabled = !this.propertyImages.exists();
        } else {
            console.log(`Publish button not found!`);
        }
    }
    
    /**
     * Add image views
     */
    startAddImageViews() {
        // Get every image view
        for(let i = 0; i < 10; i++) {
            const imgView = <HTMLImageElement>document.getElementById(`image_${i}`);
            if(imgView) {
                this.imagesView.push(imgView);
            } else {
                // console.log(`Image view ${i} couldn't be found!`);
                
                // Skip
                continue;
            }
            
            // Remove icon class abstraction
            const removeIconElementID = `image_${i}_remove_icon`;
            const removeIcon = new RemoveIcon(removeIconElementID);
            
            // Click cb
            const THIS = this;
            removeIcon.setClickCallback(async (e) => {
                // Remove image
                await THIS.api.removeImage(i);
                
                // Update images
                THIS.api.updatePropertyImages();
            });
            
            // Push to the list
            this.removeImageIcons.push(removeIcon);
        }
    }
    
    // --- Operations ---
    /**
     * Update image views
     * 
     * Updates whether an img element is shown or not, and its src attribute.
     */
    updateImageViews() {
        const propLength = this.propertyImages.propertyImages.length;
        let index = 0;
        
        for(let imgView of this.imagesView) {
            // Update location and visibility
            if(propLength > 0 && index < propLength) {
                let srcLocation = `${location.origin}/${this.propertyImages.at(index)}`;
                imgView.src = srcLocation;
                imgView.hidden = false;
                
                // Show remove action icon
                this.removeImageIcons[index].show();
                // this.showRemoveAction(index);
                
                index++;
            } else {
                imgView.hidden = true;
                
                // Show remove action icon
                this.removeImageIcons[index].hide();
                // this.hideRemoveAction(index);
            }
        }
    }
    
    // --- Events ---
    /**
     * On change send request to the server to check whether the file is ready to be
     * uploaded or it collides with another image
     */
    async bindOnChange() {
        // FIX: Disable debug on release
        const inputChange = new ImageInputChange(
            this.api, this.inputId, this.propertyId, true
        );
        
        // Enable all rules
        inputChange.imagesNotZero();
        inputChange.uploadImages();
        inputChange.removeExtraImages();
        inputChange.removeHeavyImages();
        inputChange.removeImagesWhenFinished();
        inputChange.updatePropertyImages();
        
        await inputChange.enableWithCallback(() => {});
        
        return;
        // // Success
        // this.onSuccessImagesChange(imagesInput);
    }
    
    /**
     * When images change and it's successful, call this function
     * 
     * @param {HTMLInputElement} imagesInput Images input
     */
    onSuccessImagesChange(imagesInput: HTMLInputElement) {
        // Update images view
        this.api.updatePropertyImages();
        
        if(imagesInput && imagesInput.files) {
            // Update previous images input length
            this.previousImagesInputLength = imagesInput.files.length;
            
            // Store current images as previous images
            // This method doesn't exist anymore
            // this.previousImages = this.getImagesNameArray();
            
            // Remove images from the input
            // We will use the names to check which ones do exist
            imagesInput.value = "";
        }
    }
}
