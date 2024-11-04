import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async login(loginUserDto: LoginUserDto) {
        try {
            const { password, email } = loginUserDto;

            const user = await this.userRepository.findOneBy({ email });

            if (!user) {
                throw new BadRequestException('Credenciales inválidas: Usuario no encontrado');
            }

            if (user.password !== password) {
                throw new BadRequestException('Credenciales inválidas: Contraseña incorrecta');
            }

            return {
                message: 'Login exitoso',
                user: {
                    id: user.id,
                    email: user.email,
                },
                token: this.getJwtToken({email: user.email})
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Error en el login');
        }
    }

    private getJwtToken( payload: JwtPayload){
        const token = this.jwtService.sign(payload);
        return token;
    }

}
