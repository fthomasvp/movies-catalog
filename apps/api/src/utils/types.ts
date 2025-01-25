export type PaginationParams = {
  offset: number;
  limit: number;
  sort?: string;
};

export type CustomError = Error & {
  code: string;
};
