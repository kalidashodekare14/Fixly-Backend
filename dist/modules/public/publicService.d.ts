declare const publicService: (data: any) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../../types/provider").IProvider, {}, import("mongoose").DefaultSchemaOptions> & import("../../types/provider").IProvider & {
        _id: import("mongoose").Types.ObjectId;
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
declare const providerPublicProfile: (providerId: string) => Promise<import("mongoose").Document<unknown, {}, import("../../types/provider").IProvider, {}, import("mongoose").DefaultSchemaOptions> & import("../../types/provider").IProvider & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
declare const getCategories: () => Promise<(import("mongoose").Document<unknown, {}, {
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    value: string;
    label: string;
    isActive: boolean;
    icon?: string | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
})[]>;
export { publicService, providerPublicProfile, getCategories };
