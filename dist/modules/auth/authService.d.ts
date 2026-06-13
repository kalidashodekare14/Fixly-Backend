import IUser from '../../types/user';
declare const googleLogin: (userData: {
    googleId: string;
    name: string;
    email: string;
    image?: string;
}) => Promise<{
    user: import("../../models/user").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    token: string;
}>;
declare const registerUser: (userData: IUser) => Promise<import("mongoose").Document<unknown, {}, import("../../models/user").IUser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../../models/user").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}>;
declare const loginUser: (userData: IUser) => Promise<{
    user: import("../../models/user").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    token: string;
}>;
export { registerUser, loginUser, googleLogin };
