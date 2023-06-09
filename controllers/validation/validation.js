const Joi = require("joi");

module.exports = {
    validateUser: (data) => {
        const schema = Joi.object({
        firstName: Joi.string().required().messages({
            "any.required": `First name is required`,
        }),
        lastName: Joi.string().required().messages({
            "any.required": `Last name is required`,
        }),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
            "any.required": `Email is required`,
            }),
        password: Joi.string().min(8).required().messages({
            "any.required": `Password is required`,
        }),
        confirmPassword: Joi.ref("password"),
        });

        const validate = schema.validate(data);

        if (validate.error) {
        return {
            success: false,
            messages: validate.error.details,
        };
        } else {
        return {
            success: true,
            messages: "",
        };
        }
    },

    validateLogin: (data) => {
        const schema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
            "any.required": `Email is required`,
            }),
        password: Joi.string().min(8).required().messages({
            "any.required": `Password is required`,
        }),
        });

        const validate = schema.validate(data);

        if (validate.error) {
        return {
            success: false,
            messages: validate.error.details,
        };
        } else {
        return {
            success: true,
            messages: "",
        };
        }
    },

    validateLoginFirebase: (data) => {
        const schema = Joi.object({
            token: Joi.string().required().messages({
                "any.required": `Password is required`,
            }),
        });

        const validate = schema.validate(data);

        if (validate.error) {
        return {
            success: false,
            messages: validate.error.details,
        };
        } else {
        return {
            success: true,
            messages: "",
        };
        }
    },
};