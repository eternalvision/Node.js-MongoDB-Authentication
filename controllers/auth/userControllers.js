const Helpers = require("../../helpers");
const Repositories = require("../../repositories");
const jwt = require("jsonwebtoken");
const short = require("short-uuid");
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
    try {
        let workerId = short.generate();
        const { email, phoneNumber } = req.body;
        const srchEmail = await Repositories.findByEmail(email);
        const srchPhoneNumber = await Repositories.findByPhoneNumber(
            phoneNumber
        );
        req.body.workerId = workerId;
        if (srchEmail || srchPhoneNumber) {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.LOGIN_USED
            );
        }
        const createUser = await Repositories.createUser(req.body);
        const payload = {
            id: createUser._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: "1d",
        });
        await Repositories.updateToken(payload.id, token);
        if (createUser) {
            return Helpers.Register(
                res,
                Helpers.HttpCode.CREATED,
                Helpers.Statuses.SUCCESS,
                Helpers.Messages.CREATED,
                token,
                req
            );
        } else {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.AGAIN
            );
        }
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await Repositories.findByEmail(req.body.email);
        const isValidPassword = await user?.comparePassword(req.body.password);
        if (!user || !isValidPassword) {
            return Helpers.Unauthorized(
                res,
                Helpers.HttpCode.UNAUTHORIZED,
                Helpers.Statuses.ERROR,
                Helpers.Messages.LOGIN_EMAIL_WRONG
            );
        }
        const { name, surname, workerId, phoneNumber } = user;
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
        await Repositories.updateToken(payload.id, token);
        const { email } = await req.body;
        let data = {
            token,
            workerId: user.workerId,
            name,
            surname,
            email,
            phoneNumber,
        };
        if (res.status(Helpers.HttpCode.OK)) {
            return Helpers.Success(
                res,
                Helpers.HttpCode.OK,
                Helpers.Statuses.SUCCESS,
                data
            );
        } else {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.AGAIN
            );
        }
    } catch (error) {
        next(error);
    }
};

const loginNumber = async (req, res, next) => {
    try {
        const user = await Repositories.findByPhoneNumber(req.body.phoneNumber);
        const isValidPassword = await user?.comparePassword(req.body.password);
        if (!user || !isValidPassword) {
            return Helpers.Unauthorized(
                res,
                Helpers.HttpCode.UNAUTHORIZED,
                Helpers.Statuses.ERROR,
                Helpers.Messages.LOGIN_EMAIL_WRONG
            );
        }
        const { name, surname, workerId, email } = user;
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
        await Repositories.updateToken(payload.id, token);
        const { phoneNumber } = await req.body;
        let data = {
            token,
            workerId: user.workerId,
            name,
            surname,
            email,
            phoneNumber,
        };
        if (res.status(Helpers.HttpCode.OK)) {
            return Helpers.Success(
                res,
                Helpers.HttpCode.OK,
                Helpers.Statuses.SUCCESS,
                data
            );
        }
    } catch (error) {
        next(error);
    }
};

const updateUserPassword = async (req, res, next) => {
    try {
        await Repositories.updatePassword(req.user.workerId, req.body.password);
        await Repositories.updateToken(req.user._id, null);
        return res.status(Helpers.HttpCode.NO_CONTENT).json({});
    } catch (error) {
        next(error);
    }
};

const updateAnotherUserPassword = async (req, res, next) => {
    try {
        const { workerId } = req.params;
        const data = await Repositories.findByWorkerId(workerId);
        await Repositories.updatePassword(workerId, req.body.password);
        await Repositories.updateToken(data, null);
        return Helpers.Success(
            res,
            Helpers.HttpCode.OK,
            Helpers.Statuses.SUCCESS,
            data
        );
    } catch (error) {
        next(error);
    }
};

const updateUserFinanceInfo = async (req, res, next) => {
    try {
        const data = await Repositories.findOneAndUpdate(
            req,
            req.user.workerId
        );

        if (!data) {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.AGAIN
            );
        } else {
            return Helpers.Update(
                Helpers.HttpCode.OK,
                req,
                res,
                Helpers.Messages.UPDATED,
                Helpers.Statuses.SUCCESS
            );
        }
    } catch (error) {
        next(error);
    }
};

const getCurrent = async (req, res, next) => {
    try {
        const data = await Repositories.findByWorkerId(req.user.workerId);
        if (!data) {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.AGAIN
            );
        } else {
            return Helpers.Success(
                res,
                Helpers.HttpCode.OK,
                Helpers.Statuses.SUCCESS,
                data
            );
        }
    } catch (error) {
        next(error);
    }
};

const getAnotherUser = async (req, res, next) => {
    try {
        const data = await Repositories.findByWorkerId(req.params.workerId);
        if (!data) {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.AGAIN
            );
        } else {
            return Helpers.Success(
                res,
                Helpers.HttpCode.OK,
                Helpers.Statuses.SUCCESS,
                data
            );
        }
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const data = await Repositories.findAllUsers();
        if (!data) {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.AGAIN
            );
        } else {
            return Helpers.Success(
                res,
                Helpers.HttpCode.OK,
                Helpers.Statuses.SUCCESS,
                data
            );
        }
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const _id = req.user;
        await Repositories.updateToken(_id, null);
        return res.status(Helpers.HttpCode.NO_CONTENT).json({});
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await Repositories.deleteUser(req.user.workerId);
        if (!user) {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.LOGIN_USED
            );
        } else {
            return Helpers.Delete(
                res,
                Helpers.HttpCode.OK,
                Helpers.Statuses.SUCCESS,
                Helpers.Messages.USER_DELETED
            );
        }
    } catch (error) {
        next(error);
    }
};

const deleteAnotherUser = async (req, res, next) => {
    try {
        const user = await Repositories.deleteUser(req.params.workerId);
        if (!user) {
            return Helpers.Conflict(
                res,
                Helpers.HttpCode.CONFLICT,
                Helpers.Statuses.ERROR,
                Helpers.Messages.AGAIN
            );
        } else {
            return Helpers.Delete(
                res,
                Helpers.HttpCode.OK,
                Helpers.Statuses.SUCCESS,
                Helpers.Messages.USER_DELETED
            );
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    loginNumber,
    logout,
    deleteUser,
    deleteAnotherUser,
    getCurrent,
    getAnotherUser,
    getAllUsers,
    updateAnotherUserPassword,
    updateUserPassword,
    updateUserFinanceInfo,
};
