import { Request, Response, NextFunction } from 'express';
import { ChallengeApiRequest } from '../entities/api-request.entity';

export const routeHelper = (callback: (req: Request, res: Response) => void) => {
    return async (req: Request, res: Response) => {
        try {
            await callback(req, res);
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };
};

export const setAuthor = (req: ChallengeApiRequest, res: Response, next: NextFunction) => {
    req.author = {
        name: req.headers.name as string,
        lastname: req.headers.lastname as string
    };
    next();
};
