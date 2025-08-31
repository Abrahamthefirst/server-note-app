export type ValidationResult<T> = { error: string } | { data: T };

export type AuthResetPasswordType = {
  email: string
  oldPassword: string;
  newPassword: string;
};

export type UploadedResultType = {
  url: string;
  publicId: string;
  fileType: string;
  fileSize: string;
  title: string;
};


export type Roles = "ADMIN" | "EDITOR" | "VIEWER";
