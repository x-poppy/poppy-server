import { OrderDTO } from "@/facade/dto/OrderDTO"
import { PaginationDTO } from "@/facade/dto/PaginationDTO"

export interface FindManyOpt {
  order?: OrderDTO
  pagination?: PaginationDTO
  select?: string[]
  params?: Record<string, unknown>
}
