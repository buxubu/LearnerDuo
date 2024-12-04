import { Photo } from './photo';

export interface Member {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  city: string;
  country: string;
  created: string;
  age: number;
  gender: string;
  lookingFor: string;
  interests: string;
  knownAs: string;
  description: string;
  lastActive: string;
  status?: any;
  coin: number;
  price: number;
  photos: Photo[];
}
