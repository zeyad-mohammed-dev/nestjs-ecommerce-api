import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Image = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.file;
  },
);

export const Images = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request?.files) {
      const imagesPaths = request.files.map((file) => file.path);
      return imagesPaths;
    }
    return [];
  },
);
