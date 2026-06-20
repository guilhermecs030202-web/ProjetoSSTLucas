import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validateResource = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body;
            // req.query and req.params cannot be directly reassigned in Express.
            // If needed, we can do Object.assign(req.query, parsed.query)
            next();
        } catch (e: any) {
            if (e instanceof ZodError || e.name === "ZodError") {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: e.issues.map((err: any) => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            return res.status(400).send({ message: "Unknown error", error: String(e) });
        }
    };
};
