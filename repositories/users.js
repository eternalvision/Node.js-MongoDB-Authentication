const { Auth } = require("../models");

const projection = { _id: 0, token: 0, workerId: 0, password: 0 };
const projectionAll = { _id: 0, token: 0, password: 0 };

const createUser = async ({
    _id,
    name,
    surname,
    password,
    workerId,
    email,
    phoneNumber,
}) => {
    try {
        const user = new Auth({
            _id,
            name,
            surname,
            email,
            phoneNumber,
            workerId,
        });
        user.setPassword(password);
        return await user.save();
    } catch (error) {
        console.log(error.message);
    }
};

const deleteUser = async (workerId) => {
    try {
        return await Auth.findOneAndDelete({ workerId });
    } catch (error) {
        console.log(error.message);
    }
};

const findAllUsers = async () => {
    try {
        return await Auth.find({}, projectionAll);
    } catch (error) {
        console.log(error.message);
    }
};

const findByEmail = async (email) => {
    try {
        return await Auth.findOne({ email });
    } catch (error) {
        console.log(error.message);
    }
};

const findByPhoneNumber = async (phoneNumber) => {
    try {
        return await Auth.findOne({ phoneNumber });
    } catch (error) {
        console.log(error.message);
    }
};

const updatePassword = async (workerId, password) => {
    try {
        const user = await Auth.findOneAndUpdate({ workerId }, { password });
        user.setPassword(password);
        return await user.save();
    } catch (error) {
        console.log(error.message);
    }
};

const findOneAndUpdate = async (req, workerId) => {
    try {
        return await Auth.findOneAndUpdate(
            { workerId },
            { ...req.body },
            { new: true }
        );
    } catch (error) {
        console.log(error.message);
    }
};

const updateToken = async (id, token) => {
    try {
        return await Auth.updateOne({ _id: id }, { token }, { new: true });
    } catch (error) {
        console.log(error.message);
    }
};

const findByWorkerId = async (workerId) => {
    try {
        return await Auth.findOne({ workerId }, projection);
    } catch (error) {
        console.log(error.message);
    }
};

const findUserById = async (_id) => {
    try {
        return await Auth.findById({ _id }, projection);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    findOneAndUpdate,
    findByWorkerId,
    findUserById,
    findAllUsers,
    findByEmail,
    findByPhoneNumber,
    createUser,
    deleteUser,
    updatePassword,
    updateToken,
};
