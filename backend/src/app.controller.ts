import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { HelloWorldEntity } from './entities/app.entity';

@ApiTags('hello')
@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/world')
  @HttpCode(HttpStatus.OK)
  getHello(): HelloWorldEntity {
    return this.appService.getHello();
  }
}
