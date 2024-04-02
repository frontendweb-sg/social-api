import { regExp } from "./regex";

export const slug = (title: string) => title.replace(/\s+/g, "-").toLowerCase();

export const tokenExpireDate = (time: number = 1): Date => {
  const date = new Date(Date.now());
  date.setHours(date.getHours() + time);
  return date;
};

// file filter
export const filterFile = (req: Request, file: any, cb: Function) => {
  if (!file.originalname.match(regExp.imgReg)) {
    return cb(
      new Error("Please upload file in these formats (jpe?g|png|giff|jfif|pmp)")
    );
  }

  return cb(null, true);
};

export const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
