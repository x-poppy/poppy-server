import { Provider } from "@augejs/core";
import { Prefix } from "@augejs/koa";

@Provider()
@Prefix('/api/v1/file')
export class FileController {

}
