import ImagesAPI from "./lib/property/images/ImagesAPI";
import GuestImagesAPI from "./lib/property/images/GuestImagesAPI";
import RemoveIcon from "./lib/property/images/RemoveIcon";

import CreateProperty from "./form/user/property/create";

const SERVERS_DEFAULT_LOCATION = {
    "good-roots": "http://localhost:3000",
    "express-authentication": "http://localhost:38001",
    "backdoor-server-access": "http://localhost:38002",
    "express-real-estate": "http://localhost:38003"
};

export {
    SERVERS_DEFAULT_LOCATION,
    
    ImagesAPI,
    GuestImagesAPI,
    RemoveIcon,
    
    CreateProperty,
}
