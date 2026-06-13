declare const dispatchRequest: (requestId: string, providers: any[]) => Promise<{
    provider: any;
    request: string;
    status: string;
}[]>;
export { dispatchRequest };
