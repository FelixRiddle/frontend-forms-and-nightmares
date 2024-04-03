import ImagesAPI from "../images/ImagesAPI";

/**
 * Carousel view
 */
export default class CarouselView {
    current = 0;
    
    imagesParent: HTMLElement;
    propertyId: number;
    carousel: HTMLElement;
    
    // API's
    api: ImagesAPI;
    
    /**
     * Carousel view
     */
    constructor() {
        // Images container
        const imgsParent = document.getElementById("horizontalView") as HTMLElement;
        this.imagesParent = imgsParent;
        
        // Get property id
        const paths = window.location.pathname.split("/");
        const propertyId = Number(paths[paths.length - 1]);
        this.propertyId = propertyId;
        
        // Images API
        this.api = new ImagesAPI(propertyId);
        
        // Set update callback
        const thisObj = this;
        // Images will be updated only once
        this.api.setUpdatePropertyCallback(() => {
            console.log(`Images updated!`);
            
            // Create image views
            thisObj.createImageViews();
            
            // Others
            thisObj.setCarouselButtonImages();
            thisObj.setCarouselButtonActions();
        });
        
        // Get property images
        this.api.updatePropertyImages();
        
        // Fetch carousel before updating properties
        this.carousel = document.getElementById("carousel") as HTMLElement;
        if(!this.carousel) {
            console.warn("Carousel element not found!");
            console.warn("This will cause the view to not work properly!");
            console.warn("Please add a 'div' with the id of 'carousel'");
        }
    }
    
    /**
     * Create image views
     * 
     * Injects images into the view
     */
    createImageViews() {
        // Create image views
        const propertyImages = this.api.propImgs.getAll();
        let index = 0;
        for(const imgLocation of propertyImages) {
            const imgEl = document.createElement("img");
            
            // Set image source
            const imgSource = `${location.origin}/${imgLocation}`;
            imgEl.src = imgSource;
            imgEl.id = `image_${index}`;
            
            // Insert into the carousel view
            this.imagesParent.appendChild(imgEl);
            
            index++;
        }
    }
    
    /**
     * Update image
     * 
     * After the user clicks to move to the next or previous image call this function to move the image
     */
    updateImage() {
        this.imagesParent.setAttribute('style', `transform: translateX(-${this.current * 100}%)`);
    }
    
    /**
     * Set carousel buttons image
     */
    setCarouselButtonImages() {
        const carouselLeftButtonImage = document.getElementById("carouselLeftButtonImage") as HTMLImageElement;
        const carouselRightButtonImage = document.getElementById("carouselRightButtonImage") as HTMLImageElement;
        
        if(carouselLeftButtonImage) {
            carouselLeftButtonImage.src = `${location.origin}/image/icons/arrow/black-solid/left-arrow.png`;
        }
        if(carouselRightButtonImage) {
            carouselRightButtonImage.src = `${location.origin}/image/icons/arrow/black-solid/right-arrow.png`;
        }
    }
    
    /**
     * Set carousel button actions
     */
    setCarouselButtonActions() {
        const carouselLeftButton = document.getElementById("carouselLeftButton");
        const carouselRightButton = document.getElementById("carouselRightButton");
        
        const images = this.api.propImgs.getAll();
        const imagesLength = images.length;
        
        const thisObj = this;
        if(carouselLeftButton) {
            carouselLeftButton.addEventListener("click", (e) => {
                if(thisObj.current === 0) {
                    thisObj.current = imagesLength - 1;
                } else {
                    thisObj.current -= 1;
                }
                
                thisObj.updateImage();
            });
        }
        
        if(carouselRightButton) {
            carouselRightButton.addEventListener("click", (e) => {
                if(thisObj.current === imagesLength - 1) {
                    thisObj.current = 0;
                } else {
                    thisObj.current += 1;
                }
                
                thisObj.updateImage();
            });
        }
    }
}
