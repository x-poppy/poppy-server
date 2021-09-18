import { MenuEntity, MenuPosition, MenuStatus } from '@/domain/model/MenuEntity';
import { Provider } from '@augejs/core';
import { getRepository, LessThan, Repository } from '@augejs/typeorm';
@Provider()
export class MenuRepository {
  private menuRepository: Repository<MenuEntity> = getRepository(MenuEntity);

  async findAllPermissionsByAppNo(appNo: string): Promise<MenuEntity[] | undefined> {
    return await this.menuRepository.find({
      where: {
        appNo,
        hasPermission: true,
        status: MenuStatus.NORMAL,
      },
    });
  }

  async findAllPermissionsByAppLevel(appLevel: number): Promise<MenuEntity[] | undefined> {
    return await this.menuRepository.find({
      where: {
        appLevel: LessThan(appLevel + 1),
        hasPermission: false,
        status: MenuStatus.NORMAL,
      },
    });
  }

  async findAllMenusByNormalStatus(appLevel: number, position?: MenuPosition): Promise<MenuEntity[] | undefined> {
    return await this.menuRepository.find({
      where: {
        appLevel: LessThan(appLevel + 1),
        status: MenuStatus.NORMAL,
        ...(position && {
          position,
        }),
      },
      order: {
        priority: 'DESC',
      },
    });
  }

  async findMenuByNormalStatus(menuCode: string): Promise<MenuEntity | undefined> {
    return await this.menuRepository.findOne(menuCode, {
      where: {
        status: MenuStatus.NORMAL,
      },
    });
  }
}
