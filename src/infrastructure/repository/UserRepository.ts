import { Inject, Provider } from '@augejs/core';
import crypto from 'crypto';
import { EntityManager, getRepository, Repository } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { UserEntity, UserStatus } from '../../domain/model/UserEntity';
import { PasswordService } from '../service/PasswordService';

interface CreateOpts {
  orgNo: string;
  appNo: string;
  roleNo: string;
  accountName: string;
  password: string | null;
  mobileNo: string | null;
  emailAddr: string | null;
}

interface ListOpts {
  appNo: string;
  offset: number;
  size: number;
}

@Provider()
export class UserRepository {
  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  private userRepository: Repository<UserEntity> = getRepository(UserEntity);

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async list(opts: ListOpts): Promise<[UserEntity[], number]> {
    return this.userRepository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      select: ['userNo', 'orgNo', 'appNo', 'roleNo', 'accountName', 'headerImg', 'mobileNo', 'emailAddr', 'twoFactorAuth', 'status', 'createAt', 'updateAt'],
      where: {
        appNo: opts.appNo,
      },
      order: {
        createAt: 'DESC',
      },
    });
  }

  async create(opts: CreateOpts, manager?: EntityManager): Promise<UserEntity> {
    const userRepository = manager?.getRepository(UserEntity) ?? this.userRepository;

    const userNo = await this.uniqueIdService.getUniqueId();
    const nonce = crypto.randomBytes(16).toString('hex');

    const rawPassword = opts.password ?? crypto.randomBytes(16).toString('hex');
    const hashPassword = await this.passwordService.hashPwd(userNo, nonce, rawPassword);

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

    return userRepository.save(user);
  }

  async updateUserPassword(userNo: string, passwd: string): Promise<void> {
    await this.userRepository.update(userNo, {
      passwd,
    });
  }

  async find(userNo: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne(userNo);
  }

  async findByStatusNormal(userNo: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne(userNo, {
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
