import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
      files?: {
        [key: string]: {
          name: string;
          data: Buffer;
          size: number;
          mimetype: string;
          mv: (path: string) => Promise<void>;
        };
      };
    }
  }
}

export {};
