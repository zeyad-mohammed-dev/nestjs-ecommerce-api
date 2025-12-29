import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export interface UploadImageOptions {
  folder?: string;
}

export function UploadImage(options: UploadImageOptions = {}) {
  const folderName = options.folder ?? "common";
  const uploadPath = join(process.cwd(), "uploads", folderName);

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }
  return applyDecorators(
    UseInterceptors(
      FileInterceptor("image", {
        storage: diskStorage({
          destination: uploadPath,
          filename(req, file, callback) {
            const uniqueName = Date.now() + "-" + file.originalname;
            callback(null, uniqueName);
          },
        }),
      }),
    ),
  );
}
