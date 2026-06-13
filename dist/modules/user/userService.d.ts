type UpdateUserDTO = {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    location?: {
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    image?: string;
};
declare const getNavbarProfile: (userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../../models/user").IUser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../../models/user").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}>;
declare const userInfo: (userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../../models/user").IUser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../../models/user").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}>;
declare const updateUserInfo: (userId: string, updateData: UpdateUserDTO) => Promise<import("mongoose").Document<unknown, {}, import("../../models/user").IUser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../../models/user").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export { getNavbarProfile, userInfo, updateUserInfo };
