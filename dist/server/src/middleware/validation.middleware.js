"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema, target = 'body') => {
    return (req, res, next) => {
        try {
            let dataToValidate;
            switch (target) {
                case 'body':
                    dataToValidate = req.body;
                    break;
                case 'query':
                    dataToValidate = req.query;
                    break;
                case 'params':
                    dataToValidate = req.params;
                    break;
            }
            const validated = schema.parse(dataToValidate);
            // Replace the original data with validated data
            switch (target) {
                case 'body':
                    req.body = validated;
                    break;
                case 'query':
                    req.query = validated;
                    break;
                case 'params':
                    req.params = validated;
                    break;
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid input data',
                        statusCode: 400,
                        timestamp: new Date().toISOString(),
                        path: req.path,
                        details: error.errors,
                    },
                });
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map