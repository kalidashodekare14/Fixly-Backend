import mongoose from 'mongoose';
declare const Review: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    rating: number;
    request: mongoose.Types.ObjectId;
    comment?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Review;
