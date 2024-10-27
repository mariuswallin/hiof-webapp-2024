export type Success<T> = {
  success: true;
  data: T;
};

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

// Promise<Result<Student[]>>
