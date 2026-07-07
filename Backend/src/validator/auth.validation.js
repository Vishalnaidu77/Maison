import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array() 
        });
    }
    next();
}

export const registerValidation = [
    body("fullname")
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    body("contact.countryCode")
        .notEmpty().withMessage("Country code is required")
        .isLength({ min: 1, max: 4 }).withMessage("Country code must be between 1 and 4 characters long"),

    body("contact.number")
        .notEmpty().withMessage("Contact number is required")
        .isMobilePhone().withMessage("Invalid contact number"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter"),

    body("isSeller")
        .isBoolean().withMessage("isSeller must be Boolean"),
        
    validate
]