import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [// Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'nest_user'),
        password: configService.get('DB_PASSWORD', 'nest_passworrd'),
        database: configService.get('DB_DATABASE', 'nest_auth_db'),
        entities: [User],   // todas las entidades
        synchronize: true,  // solo en desarrollo (crea tablas automáticamente)
        logging: true,      // muestra SQL en consola
      }),
      inject: [ConfigService],
    }),
    
    AuthModule,
    UsersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
