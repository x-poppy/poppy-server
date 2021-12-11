import { OrderDto } from "@/facade/dto/OrderDto"
import { PaginationDto } from "@/facade/dto/PaginationDto"

export interface FindManyOpt {
  order?: OrderDto
  pagination?: PaginationDto
  select?: string[]
  params?: Record<string, unknown>
}
