import { IRequest, IRequestClient } from '../../types/request';
import mongoose, { Types } from 'mongoose';
declare const overviewInfo: (userId: string) => Promise<{
    totalRequests: number;
    pendingRequests: number;
    assignedJobs: number;
    completedJobs: number;
    budgetSummary: any;
    mongthlyBudget: {
        month: string;
        amount: any;
    }[];
    categoryStats: any[];
}>;
declare const createRequest: (userId: string, requestData: IRequestClient) => Promise<{
    request: mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    };
    offer: never[];
    offers?: undefined;
} | {
    request: mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    };
    offers: {
        provider: any;
        request: string;
        status: string;
    }[];
    offer?: undefined;
}>;
declare const getRequest: (userId: string) => Promise<(mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
})[]>;
declare const requestUpdate: (userId: string, updateData: Partial<IRequest>) => Promise<(mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const deleteRequest: (userId: string) => Promise<(mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
declare const viewOpenRequest: (userId: string) => Promise<(mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
})[]>;
declare const viewSelectedOfferForRequest: (userId: string) => Promise<{
    isReviewed: boolean;
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
    status: "pending" | "open" | "assigned" | "in_progress" | "completed" | "cancelled";
    image: string;
    requestType: "normal" | "direct";
    _id: Types.ObjectId;
    __v: number;
}[]>;
declare const getOffersForRequest: (requestId: string) => Promise<(mongoose.Document<unknown, {}, import("../../types/offer").IOffer, {}, mongoose.DefaultSchemaOptions> & import("../../types/offer").IOffer & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
})[]>;
declare const selectedProvider: (requestId: string) => Promise<{
    request: (mongoose.Document<unknown, {}, IRequest, {}, mongoose.DefaultSchemaOptions> & IRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null;
    offer: (mongoose.Document<unknown, {}, import("../../types/offer").IOffer, {}, mongoose.DefaultSchemaOptions> & import("../../types/offer").IOffer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null;
}>;
declare const acceptOffer: (userId: string, offerId: string) => Promise<void>;
declare const sslcommerzPayment: (userId: string, data: {
    requestId: string;
    offerId?: string;
}) => Promise<{
    paymentUrl: any;
    transactionId: string;
}>;
declare const paymentSuccessAndStatusChange: (paymentId: string) => Promise<(mongoose.Document<unknown, {}, {
    user: Types.ObjectId;
    provider: Types.ObjectId;
    status: "pending" | "cancelled" | "paid" | "failed" | "refunded";
    request: Types.ObjectId;
    amount: number;
    transactionId: string;
    paymentMethod: string;
    offer?: Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {
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
} & mongoose.DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}) | undefined>;
declare const getMyPaymentHistory: (userId: string, queryData: {
    search: string;
    status: string;
}) => Promise<{
    paymentInfo: (mongoose.Document<unknown, {}, {
        user: Types.ObjectId;
        provider: Types.ObjectId;
        status: "pending" | "cancelled" | "paid" | "failed" | "refunded";
        request: Types.ObjectId;
        amount: number;
        transactionId: string;
        paymentMethod: string;
        offer?: Types.ObjectId | null | undefined;
    } & mongoose.DefaultTimestampProps, {
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
    } & mongoose.DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    })[];
    kpiInfo: {
        totalSpent: any[];
        totalPaid: number;
        totalPending: number;
        totalFailed: number;
    };
}>;
export { overviewInfo, createRequest, getRequest, requestUpdate, deleteRequest, viewOpenRequest, getOffersForRequest, selectedProvider, acceptOffer, viewSelectedOfferForRequest, sslcommerzPayment, paymentSuccessAndStatusChange, getMyPaymentHistory, };
