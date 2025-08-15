/**
 * 将JSON对象或字符串加密为Base64字符串。
 * @param jsonData - 要加密的JSON对象或字符串。
 * @returns Base64编码的字符串。
 */
export function encryptJsonToBase64(jsonData: object | string): string {
  try {
    const jsonString = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData);
    return Buffer.from(jsonString).toString('base64');
  } catch (error) {
    console.error('加密JSON到Base64时出错:', error);
    throw new Error('无效的JSON数据');
  }
}

/**
 * 将Base64字符串解密为JSON对象。
 * @param base64Data - 要解密的Base64字符串。
 * @returns 解析后的JSON对象。
 */
export function decryptBase64ToJson<T>(base64Data: string): T {
  try {
    const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('解密Base64到JSON时出错:', error);
    throw new Error('无效的Base64字符串或格式不正确的JSON');
  }
}
