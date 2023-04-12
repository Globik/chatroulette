import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { GoogleAuthGuard } from './oauth20/google.oauth20/auth/google-auth.guard';
import { YandexAuthGuard } from './oauth20/yandex.oauth20/yandex-auth.guard';
import { Request, Response } from 'express';
import { VkAuthGuard } from './oauth20/vk.oauth20/vk-auth.guard';
import { GoogleLinkGuard } from './oauth20/google.oauth20/link/google-link.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('/sign-up')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
        let result = await this.authService.createUser(createUserDto).catch((e) => {
            throw e;
        });

        return { userId: result };
    }

    @HttpCode(HttpStatus.OK)
    @Post('/sign-in')
    async signIn(@Body() signInDto: SignInDto): Promise<any> {
        let result = await this.authService.signin(signInDto).catch((e) => {
            throw e;
        });
        
        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Get('update-refresh-token')
    async updateRefreshToken(@Query('token') refresh_token: string): Promise<any>{
        let result = await this.authService.updateRefreshToken(refresh_token).catch((e) => {
            throw e;
        });
        
        return {
                access_token: result.access_token,
                expires: result.expires,
                refresh_token: result.refresh_token,
                refresh_token_expires: result.refresh_token_expires
            };
    }

    @UseGuards(GoogleAuthGuard)
    @Get("google/login")
    async signInWithGoogle() {}
  
    @UseGuards(GoogleAuthGuard)
    @Get("google/redirect")
    async signInWithGoogleRedirect(@Req() req) {
        return this.authService.signInWithGoogle(req).catch((e) => {
            throw e;
        });
    }

    @UseGuards(JwtAuthGuard)
    @UseGuards(GoogleLinkGuard)
    @Get("google-link")
    async linkGoogle() {}
  
    @UseGuards(JwtAuthGuard)
    @UseGuards(GoogleAuthGuard)
    @Get("google-link/redirect")
    async linkGoogleRedirect(@Req() req: Request) {
        return this.authService.linkGoogle(req).catch((e) => {
            throw e;
        });
    }

    @UseGuards(YandexAuthGuard)
    @Get("yandex/login")
    async signInWithYandex() {}
  
    @UseGuards(YandexAuthGuard)
    @Get("yandex/redirect")
    async signInWithYandexRedirect(@Req() req) {
        return this.authService.signInWithYandex(req).catch((e) => {
            throw e;
        });        
    }

    @UseGuards(VkAuthGuard)
    @Get("vk/login")
    async signInWithVk(@Res() res: Response) {}
  
    @UseGuards(VkAuthGuard)
    @Get("vk/redirect")
    async signInWithVkRedirect(@Req() req) {
        return this.authService.signInWithVkontakte(req).catch((e) => {
            throw e;
        });  
    }

}