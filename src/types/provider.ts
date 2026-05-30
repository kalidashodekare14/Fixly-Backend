import mongoose from 'mongoose';
interface IProvider {
  user: mongoose.Types.ObjectId;
  services: string[];
  experience: number;
  skills: string[];
  bio: string;

  location: {
    address: string;
    city: string;
    division: string;
    postalCode: string;
    type: string;
    coordinates: number[];
  };

  rating: number;
  reviews: string[];
  availableStatus?: boolean;
  rate: number;
  rateType: 'hourly' | 'fixed';
  isVerified: boolean;
}

interface IProviderUpdate {
  image?: string;
  name?: string;
  email?: string;
  phone?: string;

  services?: string[];
  experience?: number;
  skills?: string[];
  bio?: string;

  location?: {
    address: string;
    city: string;
    division: string;
  };

  availableStatus?: boolean;
  rate?: number;
  rateType?: 'hourly' | 'fixed';
}

export { IProvider, IProviderUpdate };
