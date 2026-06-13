import mongoose from 'mongoose';
declare const adminOverviewInfo: () => Promise<{
    totalUsers: number;
    totalProviders: number;
    totalRequests: number;
    totalRevenue: any[];
    monthlySignups: {
        month: string;
        users: number;
        providers: number;
    }[];
    revenueData: {
        month: string;
        amount: any;
    }[];
    categoryStats: any[];
    recentUsers: (mongoose.Document<unknown, {}, import("../../models/user").IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<import("../../models/user").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    })[];
}>;
declare const usersManage: (queryData: any) => Promise<{
    statsInfo: {
        totalUsers: number;
        totalActiveUsers: number;
        totalSuspendUsers: number;
    };
    data: (mongoose.Document<unknown, {}, import("../../models/user").IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<import("../../models/user").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
declare const userStatusChange: (userId: string, data: any) => Promise<(mongoose.Document<unknown, {}, import("../../models/user").IUser, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<import("../../models/user").IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}) | null>;
declare const requestsManage: (queryData: any) => Promise<{
    kpiInfo: {
        totalRequests: number;
        totalPending: number;
        totalOpened: number;
        totalInProgress: number;
        totalAssigned: number;
        totalCompleted: number;
        totalCancelled: number;
    };
    data: (mongoose.Document<unknown, {}, import("../../types/request").IRequest, {}, mongoose.DefaultSchemaOptions> & import("../../types/request").IRequest & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
declare const createCategories: (categories: any) => Promise<(Omit<mongoose.Document<unknown, {}, {
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
}, string | number | symbol> & Omit<any, "_id">)[]>;
declare const paymentsManage: (queryData: any) => Promise<{
    kpiInfo: {
        totalPayments: number;
        totalPaid: number;
        totalPending: number;
        totalFailed: number;
        totalCancelled: number;
        totalRefunded: number;
    };
    data: (mongoose.Document<unknown, {}, {
        user: mongoose.Types.ObjectId;
        provider: mongoose.Types.ObjectId;
        status: "pending" | "cancelled" | "paid" | "failed" | "refunded";
        request: mongoose.Types.ObjectId;
        amount: number;
        transactionId: string;
        paymentMethod: string;
        offer?: mongoose.Types.ObjectId | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        user: mongoose.Types.ObjectId;
        provider: mongoose.Types.ObjectId;
        status: "pending" | "cancelled" | "paid" | "failed" | "refunded";
        request: mongoose.Types.ObjectId;
        amount: number;
        transactionId: string;
        paymentMethod: string;
        offer?: mongoose.Types.ObjectId | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
declare const reviewsManage: (queryData: any) => Promise<{
    kpiInfo: {
        totalReviews: number;
        averageRating: any;
        rating5: number;
        rating4: number;
        rating3: number;
        rating2: number;
        rating1: number;
    };
    data: (mongoose.Document<unknown, {}, {
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
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export { usersManage, adminOverviewInfo, userStatusChange, requestsManage, createCategories, paymentsManage, reviewsManage, };
