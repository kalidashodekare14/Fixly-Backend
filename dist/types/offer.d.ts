import mongoose from 'mongoose';
interface IOffer {
    request: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    offeredPrice?: number;
    message?: string;
    estimatedTime?: Date;
    status: 'pending' | 'offered' | 'accepted' | 'rejected';
}
export { IOffer };
