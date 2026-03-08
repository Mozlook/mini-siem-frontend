export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly detail?: unknown;

  constructor(args: {
    message: string;
    status: number;
    url: string;
    detail?: unknown;
  }) {
    super(args.message);
    this.name = "ApiError";
    this.status = args.status;
    this.url = args.url;
    this.detail = args.detail;
  }
}
