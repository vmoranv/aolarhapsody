/**
 * 通用API响应类型接口
 * 定义了从后端API返回的数据结构
 * @template T - 响应数据的具体类型
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

/**
 * 通用API错误类
 * 扩展了JavaScript内置的Error类，用于处理API相关的错误
 */
export class ApiError extends Error {
  /**
   * 构造函数
   * @param message - 错误消息
   * @param status - HTTP状态码（可选）
   */
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 通用数据获取函数
 * 从指定的API端点获取数据列表
 * @template T - 数据项的类型
 * @param endpoint - API端点路径
 * @returns Promise<T[]> - 解析为数据项数组的Promise
 */
export const fetchData = async <T>(endpoint: string): Promise<T[]> => {
  // 构造完整的API URL
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api/${endpoint}`);

  // 检查响应状态
  if (!response.ok) {
    throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
  }

  const result = await response.json();

  // 处理不同格式的响应数据
  // Handle enveloped responses (both { success: true, data: [] } and { code: 200, data: [] }) and direct array responses
  if (result && (result.success === true || result.code === 200) && Array.isArray(result.data)) {
    return result.data.map((item: any) => ({ ...item, id: item.id ?? item.cardId }));
  } else if (Array.isArray(result)) {
    return result.map((item: any) => ({ ...item, id: item.id ?? item.cardId }));
  } else {
    // Log the problematic response for debugging
    console.error(`获取${endpoint}数据失败，无效的响应格式:`, result);
    throw new ApiError(result.error || result.message || `获取${endpoint}数据失败，无效的响应格式`);
  }
};

/**
 * 获取单个数据项
 * 从指定的API端点获取单个数据项的详细信息
 * @template T - 数据项的类型
 * @param endpoint - API端点路径
 * @param id - 数据项的唯一标识符
 * @returns Promise<T> - 解析为单个数据项的Promise
 */
export const fetchDataItem = async <T>(endpoint: string, id: string): Promise<T> => {
  // 构造完整的API URL
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api/${endpoint}/${id}`);

  // 检查响应状态
  if (!response.ok) {
    throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
  }

  const result: ApiResponse<T> = await response.json();

  // 检查响应是否成功并包含数据
  if (result.success && result.data) {
    return result.data;
  } else {
    throw new ApiError(result.error || `获取${endpoint}详情失败`);
  }
};

/**
 * 创建数据获取器工厂函数
 * 返回一个用于获取指定端点数据的函数
 * @template T - 数据项的类型
 * @param endpoint - API端点路径
 * @returns () => Promise<T[]> - 数据获取函数
 */
export const createDataFetcher = <T>(endpoint: string) => {
  return () => fetchData<T>(endpoint);
};

/**
 * 创建详情获取器工厂函数
 * 返回一个用于获取指定端点单个数据项详情的函数
 * @template T - 数据项的类型
 * @param endpoint - API端点路径
 * @returns (id: string) => Promise<T> - 详情获取函数
 */
export const createDetailFetcher = <T>(endpoint: string) => {
  return (id: string) => fetchDataItem<T>(endpoint, id);
};

/**
 * 基础数据项接口
 * 定义了所有数据项共有的基本属性
 */
export interface BaseItem {
  id: number;
  name: string;
}

/**
 * 价格数据项接口
 * 扩展了基础数据项，增加了价格相关属性
 */
export interface PriceItem extends BaseItem {
  price: number;
  rmb: number;
  level: number;
  desc: string;
}

/**
 * 类型数据项接口
 * 扩展了基础数据项，增加了类型属性
 */
export interface TypedItem extends BaseItem {
  type: number;
}

/**
 * 日期数据项接口
 * 扩展了价格数据项，增加了日期相关属性
 */
export interface DateItem extends PriceItem {
  startDate: string;
}

/**
 * 数据处理工具函数 - 根据搜索值过滤数据项
 * @template T - 数据项类型，必须包含name和id属性
 * @param items - 待过滤的数据项数组
 * @param searchValue - 搜索关键词
 * @param additionalFields - 可选的额外字段搜索函数
 * @returns T[] - 过滤后的数据项数组
 */
export const filterBySearch = <T extends { name: string; id: number | string }>(
  items: T[],
  searchValue: string,
  additionalFields?: (item: T) => string[]
): T[] => {
  // 如果搜索值为空，返回所有项
  if (!searchValue.trim()) {
    return items;
  }

  const lowerSearch = searchValue.toLowerCase();

  return items.filter((item) => {
    // 基本匹配：名称和ID
    const basicMatch =
      item.name.toLowerCase().includes(lowerSearch) || item.id.toString().includes(searchValue);

    if (basicMatch) {
      return true;
    }

    // 额外字段匹配
    if (additionalFields) {
      const additionalMatch = additionalFields(item).some((field) =>
        field.toLowerCase().includes(lowerSearch)
      );
      if (additionalMatch) {
        return true;
      }
    }

    return false;
  });
};

/**
 * 数据处理工具函数 - 根据类型过滤数据项
 * @template T - 数据项类型
 * @param items - 待过滤的数据项数组
 * @param filterType - 过滤类型 ('all', 'super', 'normal')
 * @param qualityField - 质量字段的键名
 * @param threshold - 阈值，默认为4
 * @returns T[] - 过滤后的数据项数组
 */
export const filterByType = <T extends { [key: string]: any }>(
  items: T[],
  filterType: 'all' | 'super' | 'normal',
  qualityField: keyof T,
  threshold: number = 4
): T[] => {
  // 如果过滤类型为'all'，返回所有项
  if (filterType === 'all') {
    return items;
  }

  return items.filter((item) => {
    const quality = item[qualityField] as number;
    // 根据过滤类型筛选超级或普通项
    if (filterType === 'super') {
      return quality >= threshold;
    } else {
      return quality < threshold;
    }
  });
};

/**
 * 数据处理工具函数 - 对数据进行分页
 * @template T - 数据项类型
 * @param items - 待分页的数据项数组
 * @param currentPage - 当前页码
 * @param pageSize - 每页数据项数量
 * @returns T[] - 当前页的数据项数组
 */
export const paginateData = <T>(items: T[], currentPage: number, pageSize: number): T[] => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};
