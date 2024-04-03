const REMOVE_ICON = `${location.origin}/image/icons/cross/1/32.png`;

/**
 * Abstraction over remove icon
 */
export default class RemoveIcon {
    removeIconImg: HTMLImageElement;
    
    /**
     * Remove icon constructor
     * 
     * @param {string} imgElementId Remove icon image element id
     */
    constructor(imgElementId: string) {
        const removeIconImg = <HTMLImageElement>document.getElementById(imgElementId);
        if(removeIconImg) {
            removeIconImg.src = REMOVE_ICON;
            this.removeIconImg = removeIconImg;
        } else {
            throw Error("Couldn't find the element");
        }
    }
    
    /**
     * Set on click callback
     * 
     * @param {function} cb Callback
     */
    setClickCallback(cb: (event: MouseEvent) => void) {
        // This usually happens IDK why
        if(this.removeIconImg) {
            this.removeIconImg.addEventListener("click", cb);
        }
    }
    
    // --- Visibiliy in the document ---
    /**
     * Toggle remove action icon visibility
     */
    toggleVisibility() {
        this.removeIconImg.hidden = !this.removeIconImg.hidden;
    }
    
    /**
     * Show remove action icon
     */
    show() {
        this.removeIconImg.hidden = false;
    }
    
    /**
     * Show remove action icon
     */
    hide() {
        this.removeIconImg.hidden = true;
    }
}
