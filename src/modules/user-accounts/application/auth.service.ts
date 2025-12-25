import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { EmailService } from './email.service';
import { AuthLoginInputDto } from '../api/input-dto/auth-login.input-dto';
import { UserModel } from '../domain/user.entity';
import { AuthRegistrationEmailResendingInputDto } from '../api/input-dto/auth-registration-email-resending.input.dto';
import { AuthRegistrationConfirmationInputDto } from '../api/input-dto/auth-registration-confirmation.input-dto';
import { AuthRegistrationInputDto } from '../api/input-dto/auth-registration.input-dto';
import { PasswordHelper } from './helpers/password.helper';
import { GenerateConfirmationCodeHelper } from './helpers/generate-confirmation-code.helper';
import { MeUserOutputDto } from './dto/output-dto/me-user.output-dto';
import { GenerateExpirationDateHelper } from './helpers/generate-expiration-date.helper';
import { UserFilter } from '../api/type/user.type';
import { CustomHttpException, DomainExceptionCode } from '../../../core/exceptions/domain.exception';
import { UserOutputDto } from '../api/view-dto/user.output.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  //TODO почистить тут все
  async registerUser(user: AuthRegistrationInputDto): Promise<true | null> {
    // const findUserByEmail = await this.usersRepository.findByLoginOrEmail({ email: user.email })
    // if(findUserByEmail) {
    //   throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'incorrect email', [
    //     {
    //       constraints: {
    //         matches: 'Incorrect email',
    //       },
    //       property: 'email',
    //     },
    //   ]);
    // }
    // const findUserBylogin = await this.usersRepository.findByLoginOrEmail({ login: user.login })
    // if(findUserBylogin) {
    //   throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'incorrect login', [
    //     {
    //       constraints: {
    //         matches: 'Incorrect login',
    //       },
    //       property: 'login',
    //     },
    //   ]);
    // }
    const passwordHash: string = await PasswordHelper.hashPassword(user.password);
    const createUser: UserModel = UserModel.createInstance({
      ...user,
      password: passwordHash,
      confirmationCode: GenerateConfirmationCodeHelper.generateCode(),
      expirationDate: GenerateExpirationDateHelper.generateDate(),
    });
    await this.usersRepository.save(createUser);

    // try {
      this.emailService.sendRegistrationEmail(createUser.email, createUser.confirmationCode!);
    // } catch (e) {
    //   console.log(e);
    // }

    return true;
  }
  //TODO вынести все эти проверки в хелпер
  async registrationConfirmationUser(code: AuthRegistrationConfirmationInputDto) {
    const user: UserModel | null = await this.usersRepository.findUserByConfirmationCode(code.code);

    if (!user) {
      throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'incorrect login', [
        {
          constraints: {
            matches: 'Incorrect confirmation code',
          },
          property: 'code',
        },
      ]);
    }

    if (user.expirationDate! < new Date()) {
      throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'incorrect login', [
        {
          constraints: {
            matches: 'Code expired',
          },
          property: 'code',
        },
      ]);
    }

    if (user.isConfirmed === true) {
      throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'incorrect login', [
        {
          constraints: {
            matches: 'Already confirmed',
          },
          property: 'code',
        },
      ]);
    }

    await this.usersRepository.verifyUser(user.id);
  }

  async resendRegistrationEmail(email: AuthRegistrationEmailResendingInputDto) {
    const user: UserModel | null = await this.usersRepository.findByLoginOrEmail( {email: email.email} );
    if (!user) {
      throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'incorrect email', [
        {
          constraints: {
            matches: 'incorrect email',
          },
          property: 'email',
        },
      ]);
    }

    if (user.isConfirmed == true) throw new CustomHttpException(DomainExceptionCode.BAD_REQUEST, 'incorrect email', [
      {
        constraints: {
          matches: 'Already confirmed',
        },
        property: 'email',
      },
    ]);
    const newCode: string = GenerateConfirmationCodeHelper.generateCode();
    const newExpiration: Date = GenerateExpirationDateHelper.generateDate();

    await this.usersRepository.updateConfirmation(user.id, newCode, newExpiration);

    this.emailService.sendRegistrationEmail(user.email, newCode);
    return true;
  }

  async login(data: AuthLoginInputDto) {
    let filter: UserFilter = {} as UserFilter;
    const isEmail: boolean = data.loginOrEmail.includes('@');
    if(isEmail) filter = {email: data.loginOrEmail}
    if(!isEmail) filter = {login: data.loginOrEmail}

    const user: UserModel | null = await this.usersRepository.findByLoginOrEmail(filter);

    if (!user) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    const isPasswordValid: boolean = await PasswordHelper.comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);

    return user;
  }

  async meUser(id: string): Promise<MeUserOutputDto | null> {
    const user: UserModel | null = await this.usersRepository.findById(id);
    if (!user) throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);
    const outputUser: UserOutputDto = {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
    return outputUser;
  }

  async passwordRecovery(user: UserModel): Promise<void> {
    const newCode: string = GenerateConfirmationCodeHelper.generateCode();
    const newExpiration: Date = GenerateExpirationDateHelper.generateDate();
    await this.usersRepository.updateConfirmation(user.id, newCode, newExpiration);

    await this.emailService.passwordRecovery(user.email, newCode);
  }

  async saveNewPassword(code: string, password: string) {
    const findUserInDb: UserModel | null = await this.usersRepository.findUserByConfirmationCode(code);
    if (!findUserInDb) return { success: false, field: 'recoveryCode', message: 'Invalid recovery code' };
    //TODO вынести в мидлу
    if (findUserInDb.expirationDate! < new Date()) {
      return { success: false, field: 'recoveryCode', message: 'Invalid recovery code' };
    }

    if (password.length < 6 || password.length > 20) {
      return { success: false, field: 'newPassword', message: 'Invalid new password format' };
    }

    const passwordHash: string = await PasswordHelper.hashPassword(password);
    await this.usersRepository.updatePassword(findUserInDb.id, passwordHash);
    return { success: true };
  }

}
