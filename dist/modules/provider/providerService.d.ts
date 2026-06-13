import { IProviderUpdate } from '../../types/provider';
import { Types } from 'mongoose';
interface IOfferCreateData {
    requestId: string;
    offeredPrice?: number;
    message?: string;
    estimatedTime?: Date;
}
declare const overviewInfo: (userId: string) => Promise<{
    pendingRequests: number;
    activeJobs: number;
    completedJobs: number;
    completedEarnings: any;
    monthlyEarnings: {
        month: string;
        amount: any;
    }[];
    categoryStats: any[];
    recentRequests: (import("mongoose").Document<unknown, {}, import("../../types/request").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../../types/request").IRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[];
}>;
declare const providerInfo: (providerId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../../types/provider").IProvider, {}, import("mongoose").DefaultSchemaOptions> & import("../../types/provider").IProvider & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const providerInfoUpdate: (userId: string, data: IProviderUpdate) => Promise<(import("mongoose").Document<unknown, {}, import("../../types/provider").IProvider, {}, import("mongoose").DefaultSchemaOptions> & import("../../types/provider").IProvider & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const requestInfo: (userId: string) => Promise<{
    request: Types.ObjectId;
    provider: Types.ObjectId;
    offeredPrice?: number;
    message?: string;
    estimatedTime?: Date;
    status: "pending" | "offered" | "accepted" | "rejected";
    _id: Types.ObjectId;
}[]>;
declare const offerCreate: (userId: string, data: IOfferCreateData) => Promise<import("mongoose").Document<unknown, {}, import("../../types/offer").IOffer, {}, import("mongoose").DefaultSchemaOptions> & import("../../types/offer").IOffer & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
declare const offeredInfo: (userId: string) => Promise<{
    request: Types.ObjectId;
    provider: Types.ObjectId;
    offeredPrice?: number;
    message?: string;
    estimatedTime?: Date;
    status: "pending" | "offered" | "accepted" | "rejected";
    _id: Types.ObjectId;
}[]>;
declare const providerJobsInfo: (userId: string) => Promise<{
    user: Types.ObjectId;
    provider: Types.ObjectId;
    title: string;
    category: Types.ObjectId;
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
    status: "pending" | "open" | "assigned" | "in_progress" | "completed" | "cancelled";
    image: string;
    requestType: "normal" | "direct";
    _id: Types.ObjectId;
}[]>;
declare const jobStatusChange: (userId: string, data: any) => Promise<void>;
declare const getProviderReviews: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, {
    user: Types.ObjectId;
    provider: Types.ObjectId;
    rating: number;
    request: Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: Types.ObjectId;
    provider: Types.ObjectId;
    rating: number;
    request: Types.ObjectId;
    comment?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
})[]>;
declare const getProviderPaymentHistory: (userId: string, queryData: {
    search?: string;
    status?: string;
}) => Promise<{
    payments: (import("mongoose").Document<unknown, {}, {
        user: Types.ObjectId;
        provider: Types.ObjectId;
        status: "pending" | "cancelled" | "paid" | "failed" | "refunded";
        request: Types.ObjectId;
        amount: number;
        transactionId: string;
        paymentMethod: string;
        offer?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        user: Types.ObjectId;
        provider: Types.ObjectId;
        status: "pending" | "cancelled" | "paid" | "failed" | "refunded";
        request: Types.ObjectId;
        amount: number;
        transactionId: string;
        paymentMethod: string;
        offer?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    })[];
    statsInfo: {
        totalEarnings: any[];
        totalPaid: number;
        totalPending: number;
        totalFailed: number;
        totalCancelled: number;
    };
}>;
export { overviewInfo, providerInfo, providerInfoUpdate, requestInfo, offerCreate, offeredInfo, providerJobsInfo, jobStatusChange, getProviderReviews, getProviderPaymentHistory, };
