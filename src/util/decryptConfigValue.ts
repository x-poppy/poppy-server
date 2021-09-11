import crypto from 'crypto';

function decryptConfigValue(key: string, message: string): string {
  return crypto.publicDecrypt(`-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`, Buffer.from(message, 'base64')).toString();
}

export function decryptConfigValues(results: Record<string, any>): any {
  results.redis.keyPrefix = decryptConfigValue(results.poppy.configDecryptKey, results.redis.keyPrefix);
  results.redis.host = decryptConfigValue(results.poppy.configDecryptKey, results.redis.host);
  results.redis.port = parseInt(decryptConfigValue(results.poppy.configDecryptKey, results.redis.port));

  results.typeorm.type = decryptConfigValue(results.poppy.configDecryptKey, results.typeorm.type);
  results.typeorm.host = decryptConfigValue(results.poppy.configDecryptKey, results.typeorm.host);
  results.typeorm.port = parseInt(decryptConfigValue(results.poppy.configDecryptKey, results.typeorm.port));
  results.typeorm.database = decryptConfigValue(results.poppy.configDecryptKey, results.typeorm.database);
  results.typeorm.username = decryptConfigValue(results.poppy.configDecryptKey, results.typeorm.username);
  results.typeorm.password = decryptConfigValue(results.poppy.configDecryptKey, results.typeorm.password);

  results.mail.host = decryptConfigValue(results.poppy.configDecryptKey, results.mail.host);
  results.mail.port = parseInt(decryptConfigValue(results.poppy.configDecryptKey, results.mail.port));
  results.mail.auth.user = decryptConfigValue(results.poppy.configDecryptKey, results.mail.auth.user);
  results.mail.auth.pass = decryptConfigValue(results.poppy.configDecryptKey, results.mail.auth.pass);

  return results;
}
