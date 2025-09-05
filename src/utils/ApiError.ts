type ErrorDetails = string[] | Record<string, any>[];

class ApiError<TData = null> extends Error {
    statusCode: number;
    success: boolean;
    data: TData | null;
    errors: ErrorDetails;

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors: ErrorDetails = [],
        data: TData | null = null,
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.data = data;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
