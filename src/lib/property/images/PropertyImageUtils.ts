import defaultPropertyImagesConfiguration from "../../config/defaultPropertyImagesConfiguration";

/**
 * Property images utils
 */
export default class PropertyImageUtils {
    constructor() { }
    
    /**
     * Convert to megabytes
     */
    static maxFileSizeMB() {
        return defaultPropertyImagesConfiguration.maxSizeKb / 1024;
    }
    
    static minFileSize() {
        return defaultPropertyImagesConfiguration.minSizeKb / 1024;
    }
}
