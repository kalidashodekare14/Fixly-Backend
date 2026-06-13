import mongoose from 'mongoose';
interface IRequest {
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    title: string;
    category: mongoose.Types.ObjectId;
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
    status: 'pending' | 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    image: string;
    requestType: 'normal' | 'direct';
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
    providerId: string;
    requestType: 'normal' | 'direct';
}
export { IRequest, IRequestClient };
