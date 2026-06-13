import IUser from '../../types/user';
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
declare const googleLogin: (idToken: string) => Promise<{
    user: import("../../models/user").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    token: string;
}>;
export { registerUser, loginUser, googleLogin, };
