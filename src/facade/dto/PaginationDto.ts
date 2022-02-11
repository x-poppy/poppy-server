import { SwaggerDefinition } from "@augejs/koa-swagger"
import { IsInt, Length, Max, MaxLength, Min } from "@augejs/validator"

@SwaggerDefinition({
  properties: {
    offset: {
      type: 'number',
      example: 0
    },
    size: {
      type: 'number',
      example: 20
    },
  },
})
export class PaginationDTO {
  @IsInt()
  @Min(0)
  @Max(10000)
  offset?: number
  @IsInt()
  @Min(0)
  @Max(10000)
  size?: number
}
