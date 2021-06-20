import { Inject, Provider } from '@augejs/core';
import crypto from 'crypto';
import { EntityManager, getRepository, Repository } from '@augejs/typeorm';
import { SnowflakeService } from '../service/SnowflakeService';
import { UserEntity, UserStatus } from '../../domain/model/UserEntity';
import { PasswordService } from '../service/PasswordService';

interface CreateOpts {
  orgNo: string
  appNo: string
  roleNo: string
  accountName: string
  password: string | null
  mobileNo: string | null
  emailAddr: string | null
  displayName: string
}
@Provider()
export class UserRepository {
  @Inject(SnowflakeService)
  private snowflakeService!: SnowflakeService;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  private userRepository: Repository<UserEntity> = getRepository(UserEntity);

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async create(opts: CreateOpts, manager?: EntityManager): Promise<UserEntity> {
    const userRepository = manager?.getRepository(UserEntity) ?? this.userRepository;

    const userNo = await this.snowflakeService.getUniqueId();
    const nonce = crypto.randomBytes(16).toString('hex');

    const rawPassword = opts.password ?? crypto.randomBytes(16).toString('hex');
    const hashPassword = this.passwordService.hashPwd(userNo, nonce, rawPassword);

    const user = new UserEntity();
    user.userNo = userNo;
    user.accountName = opts.accountName;
    user.roleNo = opts.roleNo;
    user.nonce = nonce;
    user.orgNo = opts.orgNo;
    user.appNo = opts.appNo;
    user.mobileNo = opts.mobileNo;
    user.emailAddr = opts.emailAddr;
    user.passwd = hashPassword;
    user.displayName = opts.displayName;

    return userRepository.save(user);
  }

  async findByStatusNormal(userNo: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne(userNo.toString(), {
      where: {
        status: UserStatus.NORMAL,
      },
    });
  }

  async findByAccountNameAndAppNo(accountName: string, appNo: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: {
        accountName,
        appNo,
      },
    });
  }
}
