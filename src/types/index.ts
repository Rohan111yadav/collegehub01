export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placements: number;
  image: string;
  description: string;
  courses: string[]; // JSON array on database, typed as string[]
  reviews: Review[];  // JSON array on database, typed as Review[]
  establishedYear: number;
  type: string;
  accreditation: string;
  website: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}
