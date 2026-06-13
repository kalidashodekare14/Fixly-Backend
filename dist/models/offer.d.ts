import mongoose from 'mongoose';
import { IOffer } from '../types/offer';
declare const Offer: mongoose.Model<IOffer, {}, {}, {}, mongoose.Document<unknown, {}, IOffer, {}, mongoose.DefaultSchemaOptions> & IOffer & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IOffer>;
export default Offer;
