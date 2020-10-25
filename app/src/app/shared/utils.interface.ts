export interface GenericApiResponse {
  meta: { code: number; errorMessage?: string; errorType?: string };
  data: any;
}
