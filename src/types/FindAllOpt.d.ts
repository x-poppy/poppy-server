import { OrderDTO } from "@/facade/dto/OrderDTO";

export interface FindAllOpt {
  order?: OrderDTO,
  select?: string[],
  params?: Record<string, unknown>
}
