import { ImageObject } from "./ImageObject.model";

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: ImageObject[];
  followers: { total: number };
  country: string;
  product: string;
}