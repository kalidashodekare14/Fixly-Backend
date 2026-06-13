declare const createReview: (userId: string, payload: {
    requestId: string;
    rating: number;
    comment?: string;
}) => Promise<import("mongoose").Document<unknown, {}, {
    user: import("mongoose").Types.ObjectId;
    provider: import("mongoose").Types.ObjectId;
    rating: number;
    request: import("mongoose").Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: import("mongoose").Types.ObjectId;
    provider: import("mongoose").Types.ObjectId;
    rating: number;
    request: import("mongoose").Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
declare const getMyReviews: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, {
    user: import("mongoose").Types.ObjectId;
    provider: import("mongoose").Types.ObjectId;
    rating: number;
    request: import("mongoose").Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: import("mongoose").Types.ObjectId;
    provider: import("mongoose").Types.ObjectId;
    rating: number;
    request: import("mongoose").Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
})[]>;
declare const updateReview: (userId: string, reviewId: string, payload: {
    rating?: number;
    comment?: string;
}) => Promise<import("mongoose").Document<unknown, {}, {
    user: import("mongoose").Types.ObjectId;
    provider: import("mongoose").Types.ObjectId;
    rating: number;
    request: import("mongoose").Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: import("mongoose").Types.ObjectId;
    provider: import("mongoose").Types.ObjectId;
    rating: number;
    request: import("mongoose").Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export { createReview, getMyReviews, updateReview };
