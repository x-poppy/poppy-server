import { PPRepository } from "@/infrastructure/repository/PPRepository";
import { DeepPartialData } from "@/types/DeepPartialData";
import { FindAllOpt } from "@/types/FindAllOpt";
import { FindDeepPartial } from "@/types/FindDeepPartial";
import { FindManyOpt } from "@/types/FindManyOpt";
import { FindOneOpt } from "@/types/FindOneOpts";
import { EntityManager } from "@augejs/typeorm";
import { PPDO } from "../model/PPDO";

export class PPService<TPPEntity extends PPDO,TPPRepository extends PPRepository<TPPEntity>> {

  protected repository!: TPPRepository;

  async create(data: DeepPartialData<TPPEntity>, manager?: EntityManager): Promise<TPPEntity> {
    return this.repository.create(data, manager);
  }

  async update(criteria: string | FindDeepPartial<TPPEntity>, data: DeepPartialData<TPPEntity>, manager?: EntityManager): Promise<void> {
    await this.repository.update(criteria, data, manager);
  }

  async findOne(condition: FindDeepPartial<TPPEntity>, opts?: FindOneOpt): Promise<TPPEntity | undefined> {
    return this.repository.findOne(condition, opts);
  }

  async findMany(condition: FindDeepPartial<TPPEntity>, opts?: FindManyOpt): Promise<[TPPEntity[], number]> {
    return this.repository.findMany(condition, opts);
  }

  async findAll(condition: FindDeepPartial<TPPEntity>, opts?: FindAllOpt): Promise<TPPEntity[]> {
    return this.repository.findAll(condition, opts);
  }

  async delete(criteria: string | FindDeepPartial<TPPEntity>, manager?: EntityManager): Promise<void> {
    return this.repository.delete(criteria, manager);
  }
}
