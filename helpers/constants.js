const HttpCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUEST: 429,
    INTERNAL_SERVER_ERROR: 500,
};

const Messages = {
    ERROR: "System error!",
    AGAIN: "Try it again!",
    LOGIN_USED: "Email or phone number already used!",
    LOGIN_EMAIL_WRONG: "Email or password is wrong!",
    LOGIN_NUMBER_WRONG: "The phone number or password is wrong!",
    USER_NOT_FOUND: "User not found!",
    USER_DELETED: "The user has been deleted",
    CREATED: "Created",
    UPDATED: "Updated",
    NOT_FOUND: "Not found!",
};

const Statuses = {
    ERROR: "error",
    SUCCESS: "success",
};

module.exports = { HttpCode, Messages, Statuses };
