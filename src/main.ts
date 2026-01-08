import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setDefaultLanguage } from "./common";
import { LoggingInterceptor } from "./common/interceptors";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use("/order/webhook", express.raw({ type: "application/json" }));
  const port = process.env.PORT || 3000;
  app.use(setDefaultLanguage);
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port, () => {
    console.log(`Server is running on port :::${port} 🚀`);
  });
}
bootstrap();
