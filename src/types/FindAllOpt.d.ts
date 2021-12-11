import { OrderDto } from "@/facade/dto/OrderDto";

export interface FindAllOpt {
  order?: OrderDto,
  select?: string[],
  params?: Record<string, unknown>
}
