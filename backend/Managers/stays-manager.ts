import { Injectable } from '@nestjs/common';
import { RecordsManager } from './records-manager';
import type { Actor } from '../Src/Infrastructure/access';
import type { ListQuery } from '../Src/Contracts/common.contract';
import { paginate } from '../Src/Infrastructure/rules';
import { selectStays } from './selection-rules';
@Injectable()
export class StaysManager {
  constructor(private records: RecordsManager) {}
  async list(actor: Actor, query: ListQuery) {
    const data = await this.records.dataset(actor, query);
    return paginate(selectStays(data, query), query, data.business_date);
  }
}
