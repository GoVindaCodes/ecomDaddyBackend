// auth.module.ts
/* Created By: Rahul 30-11-2023 */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // Import your JwtStrategy
import { AuthService } from './auth.service';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Make sure you set the default strategy to 'jwt'
    JwtModule.register({
      secret: 'your_secret_key', // Replace with your secret key
      signOptions: { expiresIn: '9h' },
    }),
  ],
  providers: [
    JwtStrategy,
    AuthService
  ], // Include your JwtStrategy in the providers array
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
