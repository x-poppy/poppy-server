import { MenuDO, MenuPermissionType, MenuStatus, MenuType } from '@/domain/model/MenuDO';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindAllOpt } from '@/types/FindAllOpt';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindOneOpt } from '@/types/FindOneOpts';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, LessThan, Like, Not } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';

@Provider()
export class MenuRepository extends PPRepository<MenuDO>{

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(MenuDO);
  }

  override async create(data: DeepPartialData<MenuDO>, manager?: EntityManager): Promise<MenuDO> {
    const id = data.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...data,
      id,
    });
  }

  override async findOne(condition: FindDeepPartial<MenuDO>, opts?: FindOneOpt): Promise<MenuDO | undefined> {
    return this.getRepository().findOne({
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.menuCode && {
          menuCode: condition.menuCode
        }),
      },
      select: opts?.select as (keyof MenuDO)[]
    });
  }

  override async findAll(condition: FindDeepPartial<MenuDO>, opts?: FindAllOpt): Promise<MenuDO[]> {
    return this.getRepository().find({
      where: [{
        appId: condition.appId,
        ...(condition.menuCode && {
          menuCode: Like(`${condition.menuCode}%`),
        }),
        ...(condition.title && {
          title: Like(`${condition.title}%`),
        }),
        ...(condition.status && {
          status: condition.status
        })
      }, {
        appLevel: LessThan(condition.appLevel),
        ...(condition.menuCode && {
          menuCode: Like(`${condition.menuCode}%`),
        }),
        ...(condition.title && {
          title: Like(`${condition.title}%`),
        }),
        ...(condition.status && {
          status: condition.status
        })
      }],
      order: {
        appLevel: 'DESC',
        priority: 'DESC',
        createAt: 'DESC',
        title: 'ASC',
        ...opts?.order
      },
      select: opts?.select as (keyof MenuDO)[]
    });
  }

  findAllBySideBar(appId: string, appLevel: number): Promise<MenuDO[]> {
    return this.getRepository().find({
      where: [{
        appId,
        type: Not(MenuType.MENU_ITEM_PERM),
        permissionType: Not(MenuPermissionType.WITH_PERMISSION),
        status: MenuStatus.NORMAL,
      }, {
        appLevel: LessThan(appLevel),
        type: Not(MenuType.MENU_ITEM_PERM),
        permissionType: MenuPermissionType.NO_PERMISSION,
        status: MenuStatus.NORMAL,
      }],
      order: {
        appLevel: 'DESC',
        priority: 'DESC',
        createAt: 'DESC',
        title: 'ASC',
      },
    });
  }

  findAllNoPermissionMenus(appId: string, appLevel: number): Promise<MenuDO[]> {
    return this.getRepository().find({
      where: [{
          appId,
          permissionType: Not(MenuPermissionType.WITH_PERMISSION),
          status: MenuStatus.NORMAL,
        },{
          appLevel: LessThan(appLevel),
          permissionType: MenuPermissionType.NO_PERMISSION,
          status: MenuStatus.NORMAL,
        }
      ],
      order: {
        appLevel: 'DESC',
        priority: 'DESC',
        createAt: 'DESC',
        title: 'ASC',
      },
      select: ['appId', 'menuCode']
    });
  }
}
