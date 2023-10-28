const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const bcrypt = require("bcryptjs");

const lang = ["ua", "en"];

const theme = ["light", "dark"];

const authSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Jméno je povinné!"],
            max: [15, "Maximálně 15 znaků!"],
            min: [2, "Minimální 2 znaky!"],
        },
        surname: {
            type: String,
            required: [true, "Příjmení je povinné!"],
            max: [15, "Maximálně 15 znaků!"],
            min: [2, "Minimální 2 znaky!"],
        },
        password: {
            type: String,
            required: [true, "Je vyžadováno heslo!"],
            max: [15, "Maximálně 15 znaků!"],
            min: [8, "Minimální 8 znaků!"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Telefonní číslo je povinné!"],
            max: [18, "Maximálně 15 znaků!"],
            min: [10, "Minimální 10 znaků!"],
        },
        email: {
            type: String,
            required: [true, "E-mail je povinný!"],
            unique: true,
            max: [256, "Maximálně 256 znaků"],
        },
        token: {
            type: String,
            default: null,
        },
        workerId: {
            type: String,
            default: null,
        },
        language: {
            type: String,
            default: "cz",
            enum: lang,
        },
        theme: {
            type: String,
            default: "light",
            enum: theme,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

authSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

authSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const joiSignUpSchema = Joi.object({
    name: Joi.string().min(2).max(15).required(),
    surname: Joi.string().min(2).max(15).required(),
    email: Joi.string().email().max(256).required(),
    password: joiPassword
        .string()
        .min(8)
        .max(15)
        .minOfSpecialCharacters(2)
        .minOfLowercase(2)
        .minOfUppercase(2)
        .minOfNumeric(2)
        .noWhiteSpaces()
        .required()
        .messages({
            "password.minOfUppercase":
                "Should contain at least {#min} uppercase character!",
            "password.minOfSpecialCharacters":
                "Should contain at least {#min} special character!",
            "password.minOfLowercase":
                "Should contain at least {#min} lowercase character!",
            "password.minOfNumeric":
                "Should contain at least {#min} numeric character!",
            "password.noWhiteSpaces": "Should not contain white spaces!",
        }),
    phoneNumber: Joi.string().min(9).max(13).required(),
    language: Joi.string().valid(...lang),
    theme: Joi.string().valid(...theme),
});

const joiLogInEmailSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const joiLogInNumberSchema = Joi.object({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
});

const joiUpdatePasswordSchema = Joi.object({
    password: joiPassword
        .string()
        .min(8)
        .max(15)
        .minOfSpecialCharacters(2)
        .minOfLowercase(2)
        .minOfUppercase(2)
        .minOfNumeric(2)
        .noWhiteSpaces()
        .required()
        .messages({
            "password.minOfUppercase":
                "Should contain at least {#min} uppercase character!",
            "password.minOfSpecialCharacters":
                "Should contain at least {#min} special character!",
            "password.minOfLowercase":
                "Should contain at least {#min} lowercase character!",
            "password.minOfNumeric":
                "Should contain at least {#min} numeric character!",
            "password.noWhiteSpaces": "Should not contain white spaces!",
        }),
});

const joiUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(15),
    surname: Joi.string().min(2).max(15),
    email: Joi.string().email().max(256),
    phoneNumber: Joi.string().min(9).max(13),
    language: Joi.string().valid(...lang),
    theme: Joi.string().valid(...theme),
});

const joiSearchSchema = Joi.object({
    email: Joi.string(),
    language: Joi.string(),
    theme: Joi.string(),
    name: Joi.string().min(3),
    phoneNumber: Joi.string(),
});

const Auth = model("auth", authSchema);

module.exports = {
    Auth,
    joiSignUpSchema,
    joiLogInNumberSchema,
    joiLogInEmailSchema,
    joiUpdateSchema,
    joiUpdatePasswordSchema,
    joiSearchSchema,
};
