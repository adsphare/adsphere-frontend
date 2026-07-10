import type { ListingType } from "./types";


export type CreateListingInput = {

  title: string;

  description?: string;

  location: string;

  type: ListingType;

  price: number;

};



export function validateListing(
  input: CreateListingInput
): string[] {


  const errors:string[] = [];


  if(!input.title.trim()){
    errors.push("Title is required.");
  }


  if(!input.location.trim()){
    errors.push("Location is required.");
  }


  if(!input.type){
    errors.push("Listing type is required.");
  }


  if(input.price <= 0){
    errors.push("Price must be greater than zero.");
  }


  return errors;

}
