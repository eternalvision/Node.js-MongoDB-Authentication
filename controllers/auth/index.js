const {
    register,
    login,
    loginNumber,
    logout,
    deleteUser,
    deleteAnotherUser,
    getCurrent,
    getAnotherUser,
    getAllUsers,
    updateUserFinanceInfo,
    updateUserPassword,
    updateAnotherUserPassword,
} = require("./userControllers");

module.exports = {
    register,
    login,
    loginNumber,
    logout,
    getCurrent,
    getAnotherUser,
    getAllUsers,
    updateUserFinanceInfo,
    deleteUser,
    deleteAnotherUser,
    updateUserPassword,
    updateAnotherUserPassword,
};
