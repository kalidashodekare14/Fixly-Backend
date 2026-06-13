import mongoose from 'mongoose';
import { IProvider } from '../types/provider';
declare const Provider: mongoose.Model<IProvider, {}, {}, {}, mongoose.Document<unknown, {}, IProvider, {}, mongoose.DefaultSchemaOptions> & IProvider & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IProvider>;
export default Provider;
