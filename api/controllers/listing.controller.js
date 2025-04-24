import Listing from '../models/listing.model.js';
export const createListing = async (req, res,next) => {
    try{
        const listingData = {
            ...req.body,
            userRef: req.body.userRef
          };
        const listing = await Listing.create(listingData);
        res.status(201).json(listing);
    }
    catch(err){
        next(err);
    }
}   

