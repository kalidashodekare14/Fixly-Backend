import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    image?: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'provider' | 'admin';
    phone?: string;
    location?: {
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    bio?: string;
    isVerified: boolean;
    averageRating: number;
    totalReviews: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
    status: 'active' | 'suspend';
    googleId?: string;
}
declare const User: mongoose.Model<IUser, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, IUser, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<IUser, mongoose.Model<IUser, any, any, any, any, any, IUser>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, IUser, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: mongoose.SchemaDefinitionProperty<string | undefined, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: mongoose.SchemaDefinitionProperty<string, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: mongoose.SchemaDefinitionProperty<string, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: mongoose.SchemaDefinitionProperty<string, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: mongoose.SchemaDefinitionProperty<"user" | "provider" | "admin", IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: mongoose.SchemaDefinitionProperty<string | undefined, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: mongoose.SchemaDefinitionProperty<{
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    } | undefined, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bio?: mongoose.SchemaDefinitionProperty<string | undefined, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isVerified?: mongoose.SchemaDefinitionProperty<boolean, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    averageRating?: mongoose.SchemaDefinitionProperty<number, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalReviews?: mongoose.SchemaDefinitionProperty<number, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    comparePassword?: mongoose.SchemaDefinitionProperty<(candidatePassword: string) => Promise<boolean>, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: mongoose.SchemaDefinitionProperty<"active" | "suspend", IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    googleId?: mongoose.SchemaDefinitionProperty<string | undefined, IUser, mongoose.Document<unknown, {}, IUser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, IUser>, IUser>;
export default User;
