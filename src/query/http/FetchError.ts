export class FetchError extends Error {
    public response: Response | null;
  
    public data: {
      message: string;
      [key: string]: any;
    };
  
    constructor({
      message,
      response = null,
      data,
    }: {
      message: string;
      response?: Response | null;
      data?: {
        message: string;
        [key: string]: any;
      };
    }) {
      super(message);
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, FetchError);
      }
  
      this.response = response;
      this.data = data ?? { message };
    }
  
    public name = 'FetchError';
  }
  