import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SHORTENER_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3000 },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
