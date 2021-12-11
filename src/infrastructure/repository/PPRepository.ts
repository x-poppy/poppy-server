/* eslint-disable @typescript-eslint/no-unused-vars */
import { PPEntity } from "@/domain/model/PPEntity";
import { DeepPartialData } from "@/types/DeepPartialData";
import { FindAllOpt } from "@/types/FindAllOpt";
import { FindDeepPartial } from "@/types/FindDeepPartial";
import { FindManyOpt } from "@/types/FindManyOpt";
import { FindOneOpt } from "@/types/FindOneOpts";
import { EntityManager, EntityTarget, getRepository, Repository } from "@augejs/typeorm";

export abstract class PPRepository<TPPEntity extends PPEntity> {

  private readonly repository!: Repository<TPPEntity>;
  protected readonly getRepository: (manager?: EntityManager) => Repository<TPPEntity>;

  constructor(entityClass: EntityTarget<TPPEntity>) {
    this.repository = getRepository(entityClass);
    this.getRepository = (manager?: EntityManager) => {
      return manager?.getRepository(entityClass) ?? this.repository
    }
  }

  async create(data: DeepPartialData<TPPEntity>, manager?: EntityManager): Promise<TPPEntity> {
    return this.getRepository(manager).save(data);
  }

  async batchCreate(data: DeepPartialData<TPPEntity>[], manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).insert(data);
  }

  async findOne(condition: FindDeepPartial<TPPEntity>, opts?: FindOneOpt): Promise<TPPEntity | undefined> {
    return this.repository.findOne({
      where: condition,
      select: opts?.select as (keyof TPPEntity)[]
    });
  }

  async findMany(condition: FindDeepPartial<TPPEntity>, opts?: FindManyOpt): Promise<[TPPEntity[], number]> {
    return this.repository.findAndCount({
      where: condition,
      order: opts?.order as unknown as any,
      skip: opts?.pagination?.offset ?? 0,
      take: opts?.pagination?.size ?? 10000,
      select: opts?.select as (keyof TPPEntity)[]
    })
  }

  async findAll(condition: FindDeepPartial<TPPEntity>, opts?: FindAllOpt): Promise<TPPEntity[]> {
    return this.repository.find({
      where: condition,
      order: opts?.order as unknown as any,
      select: opts?.select as (keyof TPPEntity)[]
    })
  }

  async count(condition: FindDeepPartial<TPPEntity>): Promise<number> {
    return this.repository.count({
      where: condition,
    })
  }

  async update(criteria: string | FindDeepPartial<TPPEntity>, data: DeepPartialData<TPPEntity>, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).update(criteria, data);
  }

  async delete(criteria: string | FindDeepPartial<TPPEntity>, manager?: EntityManager): Promise<void> {
    await this.getRepository(manager).delete(criteria);
  }
}
