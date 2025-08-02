import { URL_CONFIG } from '../types/url-config';

export interface MonitorSource {
  url: string;
  knownSubclasses: string[];
  file: string; // 用于标识来源文件
}

export const monitorConfig: Record<string, MonitorSource> = {
  hk: {
    url: URL_CONFIG.hk,
    knownSubclasses: ['data', 'buff'],
    file: 'hk.ts',
  },
  // 在这里可以添加更多要监控的数据源
  // example: {
  //   url: 'https://example.com/data.json',
  //   knownSubclasses: ['users', 'products'],
  //   file: 'example.ts'
  // }
};
