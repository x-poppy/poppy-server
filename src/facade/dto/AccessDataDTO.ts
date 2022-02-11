import { PPAccessData } from "@/types/PPAccessData";
import { SwaggerDefinition } from "@augejs/koa-swagger";

@SwaggerDefinition({
  properties: {
    accountName: { type: 'string' },
    userId: {  type: 'string' },
    appId: {type: 'string' },
    appLevel: {type: 'number' },
    userRoleId: {type: 'string' },
    userRoleLevel: {type: 'number' },
    device: {type: 'string' },
    token: {type: 'string' },
    ip: {type: 'string' },
  },
})
export class AccessDataDTO {

  static fromAccessData(accessData: PPAccessData):AccessDataDTO  {
    const accessDataVO = new AccessDataDTO();
    accessDataVO.accountName = accessData.get<string>('accountName');
    accessDataVO.userId = accessData.get<string>('userId');
    accessDataVO.appId = accessData.get<string>('appId');
    accessDataVO.appLevel = accessData.get<number>('appLevel');
    accessDataVO.userRoleId = accessData.get<string>('userRoleId');
    accessDataVO.userRoleLevel = accessData.get<number>('userRoleLevel');
    accessDataVO.device = accessData.get<string>('device');
    accessDataVO.token =  accessData.token;
    accessDataVO.ip = accessData.ip;
    return accessDataVO;
  }

  accountName!: string
  userId!: string
  appId!: string
  appLevel!: number
  userRoleId!: string
  userRoleLevel!: number
  device!: string
  token!: string
  ip!: string
}
