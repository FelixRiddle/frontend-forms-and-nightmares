
/**
 * Property Images Configuration
 */
export default interface PropertyImagesConfiguration {
    maxImages: number,
    minImages: number,
    supportedTypes: Array<string>,
    // Someone just can't export an image that weights too much
    // Flag that person as doing a little trolling
    maxSizeKb: number,
    // Someone just can't export an image that weights too little
    // Flag that person as doing a little trolling
    minSizeKb: number,
}
