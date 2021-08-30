import { Provider, Value } from '@augejs/core';
import FlakeId from 'flake-idgen';
import intformat from 'biguint-format';

@Provider()
export class UniqueIdService {
  @Value('/snowflake')
  private config!: Record<string, unknown> | null;

  private snowflakeInst!: FlakeId;

  onInit(): void {
    this.snowflakeInst = new FlakeId(this.config ?? {});
  }

  async getUniqueId(): Promise<string> {
    return intformat(this.snowflakeInst.next(), 'dec');
  }
}
