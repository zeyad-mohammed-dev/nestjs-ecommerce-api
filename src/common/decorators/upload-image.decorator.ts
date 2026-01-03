import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export enum fieldNameEnum {
  image = "image",
  images = "images",
}
export interface UploadImageOptions {
  folder?: string;
  fieldName?: fieldNameEnum;
  multiple?: boolean;
  maxCount?: number;
}

export function UploadImage(options: UploadImageOptions = {}) {
  let {
    folder = "common",
    fieldName = fieldNameEnum.image,
    multiple = false,
    maxCount = 2,
  } = options;

  if (multiple) {
    fieldName = fieldNameEnum.images;
  }

  const uploadPath = join(process.cwd(), "uploads", folder);

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  const storage = diskStorage({
    destination: uploadPath,
    filename: (req, file, callback) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      callback(null, uniqueName);
    },
  });

  const interceptor = multiple
    ? FilesInterceptor(fieldName, maxCount, { storage })
    : FileInterceptor(fieldName, { storage });

  return applyDecorators(UseInterceptors(interceptor));
}
