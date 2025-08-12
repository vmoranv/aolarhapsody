// 通用API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

// 通用API错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用数据获取函数
export const fetchData = async <T>(endpoint: string): Promise<T[]> => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api/${endpoint}`);

  if (!response.ok) {
    throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
  }

  const result: ApiResponse<T[]> = await response.json();

  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new ApiError(result.error || `获取${endpoint}数据失败`);
  }
};

// 获取单个数据项
export const fetchDataItem = async <T>(endpoint: string, id: string): Promise<T> => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api/${endpoint}/${id}`);

  if (!response.ok) {
    throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
  }

  const result: ApiResponse<T> = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new ApiError(result.error || `获取${endpoint}详情失败`);
  }
};

// 创建数据获取器工厂函数
export const createDataFetcher = <T>(endpoint: string) => {
  return () => fetchData<T>(endpoint);
};

// 创建详情获取器工厂函数
export const createDetailFetcher = <T>(endpoint: string) => {
  return (id: string) => fetchDataItem<T>(endpoint, id);
};

// 常用的数据类型定义
export interface BaseItem {
  id: number;
  name: string;
}

export interface PriceItem extends BaseItem {
  price: number;
  rmb: number;
  level: number;
  desc: string;
}

export interface TypedItem extends BaseItem {
  type: number;
}

export interface DateItem extends PriceItem {
  startDate: string;
}

// 数据处理工具函数
export const filterBySearch = <T extends { name: string; id: number }>(
  items: T[],
  searchValue: string,
  additionalFields?: (item: T) => string[]
): T[] => {
  if (!searchValue.trim()) {
    return items;
  }

  const lowerSearch = searchValue.toLowerCase();

  return items.filter((item) => {
    const basicMatch =
      item.name.toLowerCase().includes(lowerSearch) || item.id.toString().includes(searchValue);

    if (basicMatch) {
      return true;
    }

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

export const filterByType = <T extends { [key: string]: any }>(
  items: T[],
  filterType: 'all' | 'super' | 'normal',
  qualityField: keyof T,
  threshold: number = 4
): T[] => {
  if (filterType === 'all') {
    return items;
  }

  return items.filter((item) => {
    const quality = item[qualityField] as number;
    if (filterType === 'super') {
      return quality >= threshold;
    } else {
      return quality < threshold;
    }
  });
};

export const paginateData = <T>(items: T[], currentPage: number, pageSize: number): T[] => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};
