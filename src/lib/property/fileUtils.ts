
/**
 * Get images name
 * 
 * @param {string} inputId The input id
 * @returns {Array}
 */
function elementFileNames(inputId: string): Array<string> | undefined {
    const imagesInput = document.getElementById(inputId) as HTMLInputElement;
    
    if(imagesInput.files) {
        let imagesName: Array<string> = [];
        for(const image of imagesInput.files) {
            console.log("Pushing: ", image.name);
            imagesName.push(image.name);
        }
        
        return imagesName;
    }
    
    return undefined;
}

export {
    elementFileNames
}
