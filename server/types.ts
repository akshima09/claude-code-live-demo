export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginSuccess = {
  accessToken: string;
  member: {
    displayName: string;
  };
};

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

