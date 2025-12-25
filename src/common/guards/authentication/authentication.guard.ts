import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { tokenName } from "src/common/decorators/tokenType.decorator";
import { TokenEnum } from "src/common/enums";
import { TokenService } from "src/common/services/token.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tokenType: TokenEnum =
      this.reflector.getAllAndOverride<TokenEnum>(tokenName, [
        context.getClass(),
        context.getHandler(),
      ]) ?? TokenEnum.access;

    console.log(tokenName, tokenType);

    let authorization: string = "";
    let req: any;

    switch (context.getType()) {
      case "http":
        const httpCtx = context.switchToHttp();
        req = httpCtx.getRequest();
        authorization = req.headers.authorization;
        break;
      // case "rpc":
      //   const RPCtx = context.switchToRpc();
      //   break;
      // case "ws":
      //   const WSCtx = context.switchToWs();
      //   break;

      default:
        break;
    }

    const { user, decoded } = await this.tokenService.decodeToken({
      authorization,
      tokenType,
    });

    req.credentials = { user, decoded };
    return true;
  }
}
