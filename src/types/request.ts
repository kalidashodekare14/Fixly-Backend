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
    type: string;
    coordinates: number[];
  };
  dateline: Date;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
}

export { IRequest };
