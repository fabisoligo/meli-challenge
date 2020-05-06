import { Request } from 'express';
import { Author } from './author.entity';

/**
 * Request de Challenge.
 */
export interface ChallengeApiRequest extends Request {
    author?: Author;
}
