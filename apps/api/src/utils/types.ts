import { Request } from 'express';

export type PaginationParams = {
  offset: number;
  limit: number;
  sort?: string;
};

export type RequestLog = {
  id: string;
} & Partial<Request>;
