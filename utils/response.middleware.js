export class ApiResponse {
    static send(res, { statusCode = 200, message = 'Success', data = null, errors = null }) {
        const isSuccess = statusCode >= 200 && statusCode < 300;
        
        const response = {
            success: isSuccess,
            statusCode,
            message,
        };

        if (data !== null) response.data = data;
        
        if (errors !== null) {
            response.errors = this.formatError(errors);
        }

        return res.status(statusCode).json(response);
    }

    static success(res, message = 'Success', data = null, statusCode = 200) {
        return this.send(res, { statusCode, message, data });
    }

    static error(res, message = 'An error occurred', statusCode = 400, errors = null) {
        return this.send(res, { statusCode, message, errors });
    }

    static formatError(err) {
        if (!err) return err;

        if (err instanceof Error) {
            const { name, message: msg } = err;
            return { name, message: msg };
        }

        if (Array.isArray(err)) return err.map(e => this.formatError(e));

        if (typeof err === 'object') {
            const name = err.name;
            const message = err.message || JSON.stringify(err);
            return { ...(name ? { name } : {}), message };
        }

        return { message: String(err) };
    }
}