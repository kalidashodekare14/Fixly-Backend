import mongoose from 'mongoose';
import { IRequest } from '../types/request';
declare const Request: mongoose.Model<IRequest, {}, {}, {}, mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IRequest>;
export default Request;
