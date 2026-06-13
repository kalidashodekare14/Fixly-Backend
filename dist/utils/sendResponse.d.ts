import { Response } from 'express';
type TMeta = {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
};
type TResponseData<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: TMeta;
    data?: T;
};
declare const sendResponse: <T>(res: Response, data: TResponseData<T>) => void;
export default sendResponse;
