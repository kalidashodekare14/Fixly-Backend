import mongoose from 'mongoose';
declare const Category: mongoose.Model<{
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
}, mongoose.Document<unknown, {}, {
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Category;
