import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { App, Button, Card, Input, Space, Spin, Tabs, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Copy, Download, ExternalLink, Heart } from 'lucide-react';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { ExtendedUserData } from '../types/petExchange';

const { Title, Text } = Typography;

/**
 * 宠物兑换页面组件
 *
 * 该组件提供以下主要功能：
 * 1. 批量查询用户宠物信息
 * 2. 解析网络数据包提取用户ID
 * 3. 展示用户宠物列表和详细信息
 * 4. 图片预加载优化用户体验
 *
 */
const PetExchange: React.FC = () => {
  const { t } = useTranslation('petexchange');
  const { message: messageApi } = App.useApp();
  const [userIdInput, setUserIdInput] = useState<string>('75018034');
  const [userIdList, setUserIdList] = useState<string[]>(['75018034']);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allUsersData, setAllUsersData] = useState<ExtendedUserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<ExtendedUserData | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [databaseLoading, setDatabaseLoading] = useState<boolean>(false);
  const [imagePreloadProgress, setImagePreloadProgress] = useState<number>(0);

  useCopilotReadable({
    description: '当前宠物兑换页面状态',
    value: `当前有 ${userIdList.length} 个用户ID`,
  });

  useCopilotAction({
    name: 'addPetExchangeUserId',
    description: '添加要查询的用户ID',
    parameters: [
      {
        name: 'userId',
        type: 'string',
        description: '要添加的用户ID',
      },
    ],
    handler: async ({ userId }) => {
      if (userId && !userIdList.includes(userId)) {
        setUserIdList([...userIdList, userId]);
      }
    },
  });

  useCopilotAction({
    name: 'clearPetExchangeUserIds',
    description: '清空所有用户ID',
    parameters: [],
    handler: async () => {
      setUserIdList([]);
    },
  });

  useCopilotAction({
    name: 'searchPetExchange',
    description: '执行宠物兑换信息查询',
    parameters: [],
    handler: async () => {
      // 触发查询操作
      fetchBatchPetIds();
    },
  });

  // 批量添加用户ID的函数
  const batchAddIds = useCallback(() => {
    // 按逗号、换行符、制表符、空格等分隔符分割用户ID，并去除空字符串和已存在的ID
    const ids = userIdInput
      .split(/[,\n\r\t\s]+/)
      .map((id) => id.trim())
      .filter((id) => id && !userIdList.includes(id));

    // 使用Set进行二次去重处理
    const uniqueIds = [...new Set(ids)];

    if (uniqueIds.length > 0) {
      // 将新ID添加到现有列表中
      setUserIdList([...userIdList, ...uniqueIds]);
      // 清空输入框
      setUserIdInput('');
      // 显示成功添加的ID数量提示
      messageApi.success(`添加了 ${uniqueIds.length} 个用户ID`);
    }
  }, [userIdInput, userIdList]);

  // 清空用户ID列表函数 - 将用户ID列表重置为空数组
  const clearUserIdList = useCallback(() => {
    setUserIdList([]);
  }, []);

  // 添加单个用户ID函数 - 将输入框中的单个用户ID添加到列表中（如果不存在）
  const addUserId = useCallback(() => {
    if (userIdInput.trim() && !userIdList.includes(userIdInput.trim())) {
      setUserIdList([...userIdList, userIdInput.trim()]);
      setUserIdInput('');
    }
  }, [userIdInput, userIdList]);

  // 删除指定用户ID函数 - 从列表中移除指定的用户ID
  const removeUserId = useCallback(
    (userId: string) => {
      setUserIdList(userIdList.filter((id) => id !== userId));
    },
    [userIdList]
  );

  // 批量查询用户ID函数 - 向后端发送请求获取用户宠物数据
  const fetchBatchPetIds = useCallback(async () => {
    // 检查是否有待查询的用户ID
    if (userIdList.length === 0) {
      setError('请至少输入一个用户ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 构造API基础URL
      const baseUrl = import.meta.env.VITE_API_URL || '';
      // 发送POST请求到后端API
      const response = await fetch(`${baseUrl}/api/extract-petid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 将用户ID列表作为请求体发送
        body: JSON.stringify({ userIdList }),
      });
      const data = await response.json();

      if (response.ok) {
        // 清空现有数据，准备显示新的快速首屏数据
        setAllUsersData([]);

        // 使用requestIdleCallback优化大数据处理，避免阻塞UI
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(
            () => {
              // 处理新的快速首屏格式
              const results = data.results || data.fastResults || [];
              processBatchResults(results);

              // 显示更详细的成功消息，包含数据来源信息
              if (data.successCount > 0) {
                let message = `批量查询完成：成功 ${data.successCount} 个，失败 ${data.failed} 个`;

                // 如果有数据来源信息，添加到消息中
                if (data.databaseCount !== undefined && data.networkCount !== undefined) {
                  message += `（数据库：${data.databaseCount}，网络：${data.networkCount}）`;
                }

                // 如果有剩余数据，提示用户
                if (data.hasMore && data.remainingCount > 0) {
                  message += `，剩余 ${data.remainingCount} 个数据正在后台处理`;
                }

                messageApi.success(message);
              } else {
                messageApi.warning('所有用户ID查询都失败了');
              }
            },
            { timeout: 1000 }
          );
        } else {
          // 降级方案：使用setTimeout
          setTimeout(() => {
            // 处理新的快速首屏格式
            const results = data.results || data.fastResults || [];
            processBatchResults(results);

            // 显示更详细的成功消息，包含数据来源信息
            if (data.successCount > 0) {
              let message = `批量查询完成：成功 ${data.successCount} 个，失败 ${data.failed} 个`;

              // 如果有数据来源信息，添加到消息中
              if (data.databaseCount !== undefined && data.networkCount !== undefined) {
                message += `（数据库：${data.databaseCount}，网络：${data.networkCount}）`;
              }

              // 现在一次性返回所有数据，无需轮询

              messageApi.success(message);
            } else {
              messageApi.warning('所有用户ID查询都失败了');
            }
          }, 0);
        }
      } else {
        setError(data.error || '批量查询失败');
        messageApi.error(data.error || '批量查询失败');
      }
    } catch {
      const errorMessage = '批量查询失败';
      setError(errorMessage);
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userIdList]);

  // 处理用户卡片点击
  const handleUserCardClick = useCallback(async (user: ExtendedUserData) => {
    setDetailLoading(true);
    try {
      setSelectedUser(user);
    } catch (error) {
      // 添加错误处理逻辑
      console.error('处理用户卡片点击时出错:', error);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // 图片缓存
  const [imageCache, setImageCache] = useState<Set<string>>(new Set());
  const [preloadingImages, setPreloadingImages] = useState<boolean>(false);

  // 获取宠物图片URL
  const getPetImageUrl = useCallback((petId: string) => {
    const numId = Number(petId.toString().replace('_0', ''));
    if (numId >= 4399) {
      return `https://aola.100bt.com/h5/peticon/newlarge/type1/peticon${numId}/peticon${numId}_1.png`;
    } else {
      return `https://aola.100bt.com/h5/peticon/small/peticon${numId}.png`;
    }
  }, []);

  // 预加载宠物图片
  const preloadPetImages = useCallback(
    async (petIds: string[]) => {
      if (petIds.length === 0) {
        return;
      }

      setPreloadingImages(true);
      setImagePreloadProgress(0);

      const uniquePetIds = [...new Set(petIds)];
      const batchSize = 20; // 每批预加载20张图片
      let loadedCount = 0;

      for (let i = 0; i < uniquePetIds.length; i += batchSize) {
        const batch = uniquePetIds.slice(i, i + batchSize);
        const promises = batch.map(async (petId) => {
          const imageUrl = getPetImageUrl(petId);

          // 如果已经缓存过，跳过
          if (imageCache.has(imageUrl)) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              setImageCache((prev) => new Set(prev).add(imageUrl));
              resolve();
            };
            img.onerror = () => {
              resolve(); // 即使失败也继续，不阻塞其他图片
            };
            img.src = imageUrl;
          });
        });

        try {
          await Promise.allSettled(promises);
          loadedCount += batch.length;
          setImagePreloadProgress(Math.round((loadedCount / uniquePetIds.length) * 100));

          // 每批之间稍微延迟，避免过于密集的网络请求
          if (i + batchSize < uniquePetIds.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (error) {
          // 添加错误处理逻辑
          console.error('预加载宠物图片时出错:', error);
        }
      }

      setPreloadingImages(false);
    },
    [getPetImageUrl, imageCache]
  );

  // 处理批量查询结果，转换为DataView格式 - 优化大数据处理性能
  const processBatchResults = useCallback(
    (results: any[]) => {
      // 使用分块处理避免阻塞主线程
      const chunkSize = 100; // 每次处理100个结果
      let processedCount = 0;

      const processChunk = () => {
        const chunk = results.slice(processedCount, processedCount + chunkSize);
        const chunkUsers: ExtendedUserData[] = [];

        // 只处理成功的结果，过滤掉所有失败的查询
        const successfulResults = chunk.filter((result) => result.success);

        successfulResults.forEach((result) => {
          // 从rawData中提取用户名称
          const userName = result.rawData?.nn || `用户 ${result.userid}`;

          const user: ExtendedUserData = {
            id: result.userid,
            name: userName,
            userid: result.userid,
            success: result.success,
            error: result.error,
            pets: [],
            source: result.source || 'network', // 添加数据来源信息
          };

          if (result.success && result.petIds && result.petInfos) {
            result.petIds.forEach((petId: string, index: number) => {
              const petInfo = result.petInfos[index];
              if (petInfo) {
                user.pets.push({
                  id: petId,
                  name: petInfo.name,
                  type: petInfo.type,
                  imageUrl: getPetImageUrl(petId),
                });
              }
            });
          }

          chunkUsers.push(user);
        });

        // 更新状态，追加当前块的处理结果
        setAllUsersData((prev) => [...prev, ...chunkUsers]);

        processedCount += chunkSize;

        // 如果还有数据需要处理，继续下一块
        if (processedCount < results.length) {
          // 使用setTimeout让出主线程，避免UI卡顿
          setTimeout(processChunk, 0);
        }
      };

      // 开始处理第一批数据
      processChunk();

      // 在数据处理完成后，收集所有宠物ID并预加载图片
      const allPetIds = results
        .filter((result) => result.success && result.petIds)
        .flatMap((result) => result.petIds);

      if (allPetIds.length > 0) {
        // 使用setTimeout让出主线程，确保UI先更新
        setTimeout(() => {
          preloadPetImages(allPetIds);
        }, 100);
      }
    },
    [getPetImageUrl, messageApi, preloadPetImages]
  );

  // 从数据库加载所有用户数据（包括异步处理完成后的数据）
  const fetchAllUsersData = useCallback(async () => {
    setDatabaseLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/users-from-database`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        // 清空现有数据，显示所有用户数据
        setAllUsersData([]);

        const results = data.data || [];
        processBatchResults(results);

        messageApi.success(`从数据库加载了 ${data.total} 个用户的数据`);
      } else {
        setError(data.error || '从数据库加载所有用户数据失败');
        messageApi.error(data.error || '从数据库加载所有用户数据失败');
      }
    } catch {
      const errorMessage = '从数据库加载所有用户数据失败';
      setError(errorMessage);
      messageApi.error(errorMessage);
    } finally {
      setDatabaseLoading(false);
    }
  }, [processBatchResults, messageApi, setAllUsersData]);

  // 封包解析相关状态
  const [packetInput, setPacketInput] = useState<string>('');
  const [extractedUserIds, setExtractedUserIds] = useState<string[]>([]);
  const [packetLoading, setPacketLoading] = useState<boolean>(false);

  // 解析封包数据
  const parsePackets = useCallback(() => {
    if (!packetInput.trim()) {
      messageApi.warning('请输入封包数据');
      return;
    }

    setPacketLoading(true);

    try {
      // 按行分割封包数据
      const packetLines = packetInput.split('\n').filter((line) => line.trim());
      const extractedIds: string[] = [];

      // 正则表达式匹配 param 中的 un 值和 ui 值
      const unRegex = /"un":"([^"]+)"/g;
      const uiRegex = /"ui":(\d+)/g;

      packetLines.forEach((line) => {
        // 提取 un 值
        let match;
        while ((match = unRegex.exec(line)) !== null) {
          const unValue = match[1];
          // 如果un值包含逗号，分割成多个ID
          if (unValue.includes(',')) {
            const ids = unValue
              .split(',')
              .map((id) => id.trim())
              .filter((id) => id);
            extractedIds.push(...ids);
          } else {
            extractedIds.push(unValue);
          }
        }

        // 提取 ui 值
        while ((match = uiRegex.exec(line)) !== null) {
          const uiValue = match[1];
          extractedIds.push(uiValue);
        }
      });

      // 去重
      const uniqueIds = [...new Set(extractedIds)];
      setExtractedUserIds(uniqueIds);

      if (uniqueIds.length > 0) {
        messageApi.success(`成功提取 ${uniqueIds.length} 个用户ID`);
      } else {
        messageApi.warning('未找到有效的用户ID');
      }
    } catch {
      messageApi.error('封包解析失败');
    } finally {
      setPacketLoading(false);
    }
  }, [packetInput]);

  // 清空封包输入和结果
  const clearPacketData = useCallback(() => {
    setPacketInput('');
    setExtractedUserIds([]);
  }, []);

  // 将提取的用户ID添加到主列表
  const addExtractedIdsToMainList = useCallback(() => {
    if (extractedUserIds.length === 0) {
      messageApi.warning('没有可添加的用户ID');
      return;
    }

    const newIds = extractedUserIds.filter((id) => !userIdList.includes(id));
    if (newIds.length > 0) {
      setUserIdList([...userIdList, ...newIds]);
      messageApi.success(`添加了 ${newIds.length} 个新用户ID`);
    } else {
      messageApi.info('所有用户ID已存在于列表中');
    }
  }, [extractedUserIds, userIdList]);

  // 复制提取的用户ID
  const copyExtractedIds = useCallback(() => {
    if (extractedUserIds.length === 0) {
      messageApi.warning('没有可复制的用户ID');
      return;
    }

    const text = extractedUserIds.join('\n');
    navigator.clipboard.writeText(text);
    messageApi.success(`已复制 ${extractedUserIds.length} 个用户ID`);
  }, [extractedUserIds]);

  // 使用新的Tabs items API替代已弃用的TabPane
  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <Download size={16} />
          批量查询用户ID
        </span>
      ),
      children: (
        <div className="space-y-6 pt-6">
          {/* 查询设置面板 - 直接集成在页面中 */}
          <Card title="查询设置" className="mb-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 用户ID输入区域 */}
              <div className="space-y-4">
                <Text
                  className="text-sm font-medium block text-gray-700 dark:text-gray-300"
                  style={{ marginBottom: '12px' }}
                >
                  {t('url_placeholder')}
                </Text>
                <Input.TextArea
                  rows={4}
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder={t('batch_input_placeholder', '例如：75018034, 75018035, 75018036')}
                  className="w-full"
                  style={{ marginBottom: '24px' }}
                />
                <div className="flex gap-3" style={{ marginTop: '0' }}>
                  <Button
                    onClick={addUserId}
                    icon={<Download size={14} />}
                    style={{ borderRadius: 8, marginRight: '12px' }}
                  >
                    {t('add_to_list', '添加到列表')}
                  </Button>
                  <Button onClick={batchAddIds} style={{ borderRadius: 8 }}>
                    {t('batch_add', '批量添加')}
                  </Button>
                </div>
              </div>

              {/* 用户ID列表显示 */}
              <div className="space-y-4" style={{ marginTop: '8px', marginBottom: '16px' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('user_id_list', '待查询用户ID列表')} ({userIdList.length} 个)
                  </Text>
                  {userIdList.length > 0 && (
                    <Button
                      onClick={clearUserIdList}
                      size="small"
                      danger
                      style={{ borderRadius: 8 }}
                    >
                      {t('clear_list', '清空列表')}
                    </Button>
                  )}
                </div>
                <div
                  className="min-h-[120px] max-h-[160px] overflow-y-auto p-4 ant-input ant-input-outlined"
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--theme-border)',
                    backgroundColor: 'var(--theme-elevated)',
                    color: 'var(--theme-text)',
                    transition: 'all 0.2s ease',
                    marginBottom: '16px',
                  }}
                >
                  {userIdList.length > 0 ? (
                    <Space wrap size="large" className="w-full" style={{ padding: '8px 4px' }}>
                      {userIdList.map((userId) => (
                        <Tag
                          key={`user-id-${userId}`}
                          color="blue"
                          closable
                          onClose={() => removeUserId(userId)}
                          className="text-xs"
                        >
                          {userId}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <Text
                      className="text-gray-400 dark:text-gray-500 text-sm"
                      style={{ padding: '8px 12px' }}
                    >
                      {t('no_user_ids', '暂无用户ID，请先添加')}
                    </Text>
                  )}
                </div>
              </div>
            </div>

            {/* 查询按钮 */}
            <div
              style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}
              className="dark:border-gray-700"
            >
              <div className="flex gap-3">
                <Button
                  onClick={fetchBatchPetIds}
                  loading={loading}
                  size="large"
                  className="flex-1 h-12"
                  icon={<Download size={16} />}
                  disabled={userIdList.length === 0}
                  style={{ borderRadius: 8 }}
                >
                  {loading
                    ? t('querying', '查询中...')
                    : `${t('batch_query_button', '批量查询用户ID')} ${userIdList.length} 个用户`}
                </Button>
                <Button
                  onClick={fetchAllUsersData}
                  loading={databaseLoading}
                  size="large"
                  className="flex-1 h-12"
                  icon={<Heart size={16} />}
                  style={{ borderRadius: 8 }}
                >
                  {databaseLoading ? '加载中...' : '从数据库加载用户'}
                </Button>
              </div>
            </div>
          </Card>

          {/* 图片预加载进度显示 */}
          {preloadingImages && (
            <Card className="mb-4">
              <div className="flex items-center gap-3">
                <Spin size="small" />
                <Text>正在预加载宠物图片缓存 ({imagePreloadProgress}%)</Text>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${imagePreloadProgress}%` }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* 使用DataView显示用户列表 */}
          {allUsersData.length > 0 && (
            <DataView<ExtendedUserData>
              queryKey={['pet-exchange-user-data-view']}
              data={allUsersData}
              onCardClick={handleUserCardClick}
              renderCard={(user, index) => {
                return (
                  <ItemCard
                    item={user}
                    index={index}
                    imageUrl={
                      user.success && user.pets.length > 0 ? user.pets[0].imageUrl : undefined
                    }
                    icon={user.success ? <Heart size={48} color="white" /> : undefined}
                  />
                );
              }}
              renderDetailDialog={() =>
                detailLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 200,
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : selectedUser ? (
                  <div style={{ maxWidth: 800, maxHeight: 600, overflowY: 'auto' }}>
                    <Title
                      level={4}
                      style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span style={{ wordBreak: 'break-all' }}>
                        http://www.100bt.com/aola/act/zt-friend/?userid={selectedUser.userid}
                      </span>
                      <Button
                        type="link"
                        icon={<ExternalLink size={16} />}
                        onClick={() => {
                          const url = `http://www.100bt.com/aola/act/zt-friend/?userid=${selectedUser.userid}`;
                          window.open(url, '_blank');
                        }}
                        style={{ padding: 0 }}
                      />
                    </Title>

                    {selectedUser.success && selectedUser.pets.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {selectedUser.pets.map((pet, petIndex) => {
                          // 将宠物数据转换为 DataItem 格式以适配 ItemCard
                          const petDataItem = {
                            id: pet.id,
                            name: pet.name,
                            quality: 0, // 设置为 0 以隐藏星星显示
                          };

                          return (
                            <ItemCard
                              key={petIndex}
                              item={petDataItem}
                              index={petIndex}
                              imageUrl={pet.imageUrl}
                              imageStyle={{ height: '100px', maxHeight: '100px' }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : null
              }
              getSearchableFields={(user) => {
                const searchableFields = [user.userid];
                // 如果用户有宠物数据，添加所有宠物的ID和名称到可搜索字段
                if (user.success && user.pets.length > 0) {
                  user.pets.forEach((pet) => {
                    searchableFields.push(pet.id);
                    searchableFields.push(pet.name);
                  });
                }
                return searchableFields;
              }}
              getQuality={(user) => (user.success ? 1 : 0)}
              noLayout
              loadingText="加载用户数据..."
              errorText="加载失败"
              paginationTotalText={(start, end, total) =>
                `第 ${start}-${end} 条，共 ${total} 个用户`
              }
              noResultsText="没有找到匹配的用户"
              noDataText="暂无用户数据"
              searchPlaceholder="搜索用户ID、亚比名称或petid..."
              filterOptions={[
                { value: 'all', label: '全部' },
                { value: 'success', label: '成功' },
                { value: 'failed', label: '失败' },
              ]}
              resetText="重置"
              showingText={(filteredCount, totalCount) => (
                <>
                  显示 <span style={{ fontWeight: 600 }}>{filteredCount}</span> / {totalCount}{' '}
                  个用户
                </>
              )}
            />
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <Copy size={16} />
          封包解析提取
        </span>
      ),
      children: (
        <div className="space-y-6 pt-6">
          {/* 封包输入面板 */}
          <Card title="封包数据输入" className="mb-6 mt-6">
            <div className="space-y-6">
              <div>
                <Text
                  className="text-sm font-medium block text-gray-700 dark:text-gray-300"
                  style={{ marginBottom: '12px' }}
                >
                  {t('packet_input_placeholder', '粘贴封包数据 (支持提取un和ui参数)')}
                </Text>
                <Input.TextArea
                  rows={8}
                  value={packetInput}
                  onChange={(e) => setPacketInput(e.target.value)}
                  placeholder={`|#send={"id":21,"cmd":"21_1","param":{"un":"740876,50226394,2262584,44712959,132076830,1902226,190029611,14269,35662380,22891418","tp":1}}|
|#send={"id":21,"cmd":"21_0","param":{"un":"740876"}}|
|#send={"id":21,"cmd":"61_1","param":{"uid":172124799}}|
|#send={"id":12,"cmd":"71_27","param":{"ui":172124799}}|`}
                  className="w-full font-mono text-xs leading-relaxed border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  style={{ marginBottom: '24px' }}
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={parsePackets}
                  loading={packetLoading}
                  icon={<Copy size={14} />}
                  style={{ borderRadius: 8, marginRight: '12px' }}
                >
                  {t('parse_packets', '解析封包')}
                </Button>
                <Button onClick={clearPacketData} danger style={{ borderRadius: 8 }}>
                  {t('clear_data', '清空数据')}
                </Button>
              </div>
            </div>
          </Card>

          {/* 提取结果显示 */}
          {extractedUserIds.length > 0 && (
            <Card title="提取结果" className="mb-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('extracted_count', '提取到')} {extractedUserIds.length}{' '}
                    {t('user_ids_count', '个用户ID')}
                  </Text>
                  <Space>
                    <Button onClick={copyExtractedIds} size="small" icon={<Copy size={14} />}>
                      复制ID
                    </Button>
                    <Button
                      onClick={addExtractedIdsToMainList}
                      size="small"
                      icon={<Download size={14} />}
                    >
                      添加到查询列表
                    </Button>
                  </Space>
                </div>

                <div
                  className="min-h-[100px] max-h-[200px] overflow-y-auto p-4 ant-input ant-input-outlined"
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--theme-border)',
                    backgroundColor: 'var(--theme-elevated)',
                    color: 'var(--theme-text)',
                    transition: 'all 0.2s ease',
                    marginBottom: '16px',
                  }}
                >
                  <Space wrap size="small" className="w-full">
                    {extractedUserIds.map((userId) => (
                      <Tag key={`extracted-${userId}`} color="green" className="text-xs">
                        {userId}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Title
                level={1}
                className="mb-4 !text-4xl md:!text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                {t('page_title')}
              </Title>
            </motion.div>
          </div>

          {/* 添加间隔 */}
          <div className="h-8"></div>

          {/* 主要内容卡片 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              {/* 标签页 */}
              <Tabs
                defaultActiveKey="1"
                items={items}
                className="[&_.ant-tabs-content]:pt-8 [&_.ant-tabs-tabpane]:pt-0 mb-8"
                type="card"
                size="large"
                style={
                  {
                    '--ant-color-primary': '#3b82f6',
                    '--ant-color-primary-hover': '#2563eb',
                  } as React.CSSProperties
                }
              />

              {/* 错误显示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6"
                >
                  <Card
                    size="small"
                    className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                  >
                    <Text type="danger" className="font-medium">
                      {t('error_prefix')}: {error}
                    </Text>
                  </Card>
                </motion.div>
              )}

              {/* 加载状态 */}
              {loading && (
                <div className="flex justify-center items-center py-12 mb-6">
                  <Spin size="large" />
                  <Text className="ml-3 text-gray-600 dark:text-gray-400">
                    {t('extracting_pet_data', '正在提取宠物数据...')}
                  </Text>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PetExchange;
