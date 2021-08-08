import { Provider, Value } from '@augejs/core';
import { UniqueID } from 'nodejs-snowflake';

@Provider()
export class UniqueIdService {
  @Value('/snowflake')
  private config!: Record<string, unknown> | null;

  private snowflakeInst!: UniqueID;

  onInit(): void {
    this.snowflakeInst = new UniqueID(this.config ?? {});
  }

  async getUniqueId(): Promise<string> {
    return (await this.snowflakeInst.asyncGetUniqueID()) as string;
  }
}
