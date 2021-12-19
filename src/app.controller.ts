import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { UrlShortenDto } from './UrlShortenDto';

@Controller()
export class AppController {
  constructor(
    @Inject('SHORTENER_SERVICE') private readonly client: ClientProxy,
  ) {}
  async onApplicationBootstrap() {
    await this.client.connect();
  }
  @Get('/:alias')
  async getUrl(@Param() data, @Res() res: Response) {
    const realUrl = await lastValueFrom(
      this.client.send<string>('redirect', data.alias),
    );
    console.log(realUrl);
    if (!realUrl) {
      throw new HttpErrorByCode[403]();
    }

    res.status(301).redirect(realUrl);
  }

  @Post()
  async shortenUrl(@Body() url: UrlShortenDto) {
    return lastValueFrom(this.client.send('shorten', url));
  }
}
