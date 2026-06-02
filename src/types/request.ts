import mongoose from 'mongoose';

interface IRequest {
  user: mongoose.Types.ObjectId;
  title: string;
  category: string;
  description: string;
  budget: number;
  location: {
    address: string;
    city: string;
    division: string;
    postalCode: string;
    coordinates: number[];
  };
  deadline: Date;
  status:
    | 'pending'
    | 'open'
    | 'assigned'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  image: string;
}

interface IRequestClient {
  title: string;
  category: string;
  description: string;
  budget: number;
  location: {
    address: string;
    city: string;
    division: string;
    postalCode: string;
    coordinates: number[];
  };
  deadline: string;
  image?: string;
}

export { IRequest, IRequestClient };
