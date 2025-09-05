class ApiResponse<TData = null> {
    statusCode: number;
    success: boolean;
    data: TData | null;
    message: string;

    constructor(statusCode: number, data: TData | null, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }

}

export { ApiResponse }