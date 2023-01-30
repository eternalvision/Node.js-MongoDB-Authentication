const Success = async (res, code, status, data) => {
    try {
        return res.status(code).json({
            code,
            status,
            data,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const Register = async (res, code, status, message, token, req) => {
    try {
        return res.status(code).json({
            code,
            status,
            message,
            data: {
                token,
                ...req.body,
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};

const Update = async (res, code, status, message, req) => {
    try {
        return res.status(code).json({
            code,
            status,
            message,
            data: {
                ...req.body,
            },
        });
    } catch (error) {
        console.log(error.message);
    }
};

const Delete = async (res, code, status, message) => {
    try {
        return res.status(code).json({
            code,
            status,
            message,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const Conflict = async (res, code, status, message) => {
    try {
        return res.status(code).json({
            code,
            status,
            message,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const Error = async (res, code, status, message, error) => {
    try {
        return res.status(code).json({
            code,
            status,
            message,
            error: error.message,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const NotFound = async (code, res, message, status) => {
    try {
        return res.status(code).json({
            code,
            status,
            message,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const Unauthorized = async (res, code, status, message) => {
    try {
        return res.status(code).json({
            code,
            status,
            message,
        });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    Conflict,
    Error,
    Register,
    Update,
    Delete,
    Success,
    NotFound,
    Unauthorized,
};
