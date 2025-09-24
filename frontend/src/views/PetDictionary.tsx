/**
 * 亚比查询组件
 * ---------------------------
 * 精确复刻自原始的 uTools 插件 UI 和逻辑
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  DownloadOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { App, Card, Collapse, Empty, Image, Input, Select, Space, Switch, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillCard from '../components/SkillCard';
import { getAttributeIconUrl, getEraIconUrl, ProcessedAttribute } from '../utils/attribute-helper';
import {
  calculateStats,
  fetchPetDictionaryById,
  formatTime,
  generateCollapseSkillItems,
  generateSearchOptions,
  getAttributeName,
  handleDownloadAudio,
  handlePlayAudio,
  handleProgressClick,
  setupAudio,
  Stat,
} from '../utils/pet-dictionary-helper';
import {
  createAttributeNameMap,
  fetchPetList,
  fetchPetRawDataById,
  fetchSkillAttributes,
  filterPets,
  generateSkillItems,
  getPetImageUrl,
  PetListItem,
} from '../utils/pet-helper';
import './PetDictionary.css';

const { Option } = Select;
const { Title } = Typography;

/**
 * 一个异步组件，用于获取并显示指定亚比的描述信息。
 * @param {object} props - 组件属性。
 * @param {number} props.petId - 需要获取描述的亚比ID。
 * @returns {React.ReactElement} 渲染的加载状态、错误信息或亚比描述。
 */
const PetDescription: React.FC<{ petId: number }> = ({ petId }) => {
  const { t } = useTranslation('petDictionary');
  const {
    data: description,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['petDictionary', petId, 'description'],
    queryFn: () => fetchPetDictionaryById(petId),
    select: (data) => data.petIntro || t('no_description'),
    enabled: !!petId,
  });

  if (isLoading) return <div className="description-loading">{t('description_loading')}</div>;
  if (error) return <div className="description-error">{t('description_error')}</div>;
  return <div className="description-content">{description}</div>;
};

/**
 * 亚比图鉴页面的主组件。
 * 该组件集成了搜索、筛选、详情展示、技能切换和语音播放等多项功能。
 * 它负责管理整个页面的状态，包括：
 * - 获取所有亚比列表和属性数据。
 * - 处理用户输入（搜索关键字、筛选条件）。
 * - 展示搜索结果和选定亚比的详细信息。
 * - 管理技能版本（新/旧）的切换。
 * - 控制亚比语音的播放、暂停和下载。
 * @returns {React.ReactElement} 渲染的亚比图鉴页面。
 */
export default function PetDictionary() {
  // --- Hooks ---
  const { t } = useTranslation('petDictionary'); // 国际化
  const { message } = App.useApp(); // Ant Design的全局消息提示
  const navigate = useNavigate(); // 路由导航

  // --- State ---
  // 搜索关键字
  const [searchKeyword, setSearchKeyword] = useState('');
  // 选中的属性筛选器
  const [selectedAttribute, setSelectedAttribute] = useState('all');
  // 当前选中的亚比
  const [selectedPet, setSelectedPet] = useState<PetListItem | null>(null);
  // 是否显示搜索结果下拉框
  const [showSearchResults, setShowSearchResults] = useState(false);
  // 是否显示新版技能集
  const [isNewSkillSet, setIsNewSkillSet] = useState(true);

  // 音频播放器状态
  const [audioState, setAudioState] = useState({
    isLoading: false, // 是否正在加载音频
    isPlaying: false, // 是否正在播放
    error: false, // 是否发生错误
    duration: 0, // 音频总时长
    currentTime: 0, // 当前播放时间
    progress: 0, // 播放进度百分比
  });
  // 音频元素的引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 进度条元素的引用
  const progressRef = useRef<HTMLDivElement | null>(null);

  // --- Data Fetching (React Query) ---
  // 获取所有亚比的基础列表
  const {
    data: pets = [],
    isLoading: isLoadingPets,
    error: petsError,
  } = useQuery<PetListItem[], Error>({
    queryKey: ['pets'],
    queryFn: fetchPetList,
    staleTime: Infinity, // 设置为无限期，因为亚比列表不常变动
  });

  // 获取所有技能属性的列表
  const { data: skillAttributes = [] } = useQuery<ProcessedAttribute[], Error>({
    queryKey: ['skillAttributes'],
    queryFn: fetchSkillAttributes,
    staleTime: Infinity, // 属性列表也不常变动
  });

  // 获取当前选中亚比的原始（详细）数据
  const { data: selectedPetRawData } = useQuery({
    queryKey: ['petRawData', selectedPet?.id],
    queryFn: () => fetchPetRawDataById(selectedPet!.id),
    enabled: !!selectedPet, // 只有在选中了亚比后才执行此查询
  });

  // 获取当前选中亚比的图鉴（字典）数据，如简介、时代等
  const { data: petDictionaryData } = useQuery({
    queryKey: ['petDictionary', selectedPet?.id],
    queryFn: () => fetchPetDictionaryById(Number(selectedPet!.id)),
    enabled: !!selectedPet, // 同样，只有在选中了亚比后才执行
  });

  // --- Memos (Optimizations) ---
  // 创建一个属性ID到属性名称的映射表，避免在渲染中重复计算
  const attributeNameMap = useMemo(
    () => createAttributeNameMap(skillAttributes),
    [skillAttributes]
  );

  // --- Effects (Side Effects) ---
  // 效果1: 组件加载后，如果没有选中任何亚比，则默认选中列表中的第一个
  useEffect(() => {
    if (!isLoadingPets && pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0]);
    }
  }, [isLoadingPets, pets, selectedPet]);

  // 效果2: 每次切换亚比时，重置技能显示为“新版技能”
  useEffect(() => {
    if (selectedPet) {
      setIsNewSkillSet(true);
    }
  }, [selectedPet]);

  // 效果3: 组件卸载时，暂停并清理音频播放器，防止内存泄漏
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // --- Callbacks (Memoized Handlers) ---
  // 当用户从搜索结果中选择一个亚比时的回调函数
  const handleSelectPet = useCallback((pet: PetListItem) => {
    setSelectedPet(pet);
    setSearchKeyword(pet.name); // 将搜索框内容更新为所选亚比的名称
    setShowSearchResults(false); // 关闭搜索结果下拉框
  }, []);

  // --- Memos (Derived Data) ---
  // 根据搜索关键字和属性筛选，生成搜索结果选项
  const searchOptions = useMemo(() => {
    const options = generateSearchOptions(pets, searchKeyword, selectedAttribute, filterPets);
    return options.map(({ value, pet }) => ({
      value,
      pet,
      label: (
        // 自定义搜索结果的渲染
        <div className="search-option" onClick={() => handleSelectPet(pet)}>
          <img
            src={getPetImageUrl(pet.id, 'small')}
            alt={pet.name}
            className="search-option-icon"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="search-option-info">
            <span className="search-option-name">{pet.name}</span>
            <span className="search-option-id">ID: {pet.id}</span>
          </div>
          {pet.attribute1 && pet.attribute1 !== '0' && (
            <div className="search-option-attribute">
              <img
                src={getAttributeIconUrl(Number(pet.attribute1))}
                alt={getAttributeName(pet.attribute1, attributeNameMap)}
              />
            </div>
          )}
          {pet.attribute2 && pet.attribute2 !== '0' && pet.attribute1 !== pet.attribute2 && (
            <div className="search-option-attribute">
              <img
                src={getAttributeIconUrl(Number(pet.attribute2))}
                alt={getAttributeName(pet.attribute2, attributeNameMap)}
              />
            </div>
          )}
        </div>
      ),
    }));
  }, [pets, searchKeyword, selectedAttribute, attributeNameMap, handleSelectPet, getAttributeName]);

  // 根据获取到的原始数据和图鉴数据，计算亚比的最终种族值
  const stats: Stat[] = useMemo(
    () => calculateStats(selectedPetRawData, petDictionaryData),
    [selectedPetRawData, petDictionaryData]
  );

  // 生成技能列表，并处理新旧技能切换的逻辑
  const { skillItems, hasNewSkills, hasOldSkills } = useMemo(() => {
    const { items, fallback, hasNewSkills, hasOldSkills } = generateCollapseSkillItems(
      selectedPetRawData,
      isNewSkillSet,
      (data, isNew) => generateSkillItems(data, isNew, t)
    );

    // 如果请求新技能但数据不存在，则自动回退到旧技能
    if (fallback) {
      setTimeout(() => setIsNewSkillSet(false), 0);
    }

    // 如果没有技能数据，则显示空状态
    if (items.length === 0 || items[0].children === null) {
      return {
        skillItems: [
          {
            key: '1',
            label: t('skill_list'),
            children: <Empty description={t('no_skill_data')} />,
          },
        ],
        hasNewSkills,
        hasOldSkills,
      };
    }

    // 将技能数据映射为Collapse组件所需的格式
    const mappedItems = items.map(
      (item: { key: string; label: string; children: string[] | null }) => ({
        ...item,
        children: (
          <div className="skills-grid">
            {(item.children as string[]).map((skill, index) => {
              const parts = skill.split('-');
              const skillId = parts[parts.length - 1];
              const unlockLevel = parts[0];
              return (
                <SkillCard key={`skill-${index}`} skillId={skillId} unlockLevel={unlockLevel} />
              );
            })}
          </div>
        ),
      })
    );
    return { skillItems: mappedItems, hasNewSkills, hasOldSkills };
  }, [selectedPetRawData, isNewSkillSet, message]);

  // --- Handlers ---
  // 处理技能版本切换的开关事件
  const handleSkillSetChange = (checked: boolean) => {
    if (checked && hasNewSkills) {
      setIsNewSkillSet(true);
    } else if (checked) {
      message.info(t('no_new_skills')); // 如果没有新技能，则提示用户
    } else if (hasOldSkills) {
      setIsNewSkillSet(false);
    } else {
      message.info(t('no_old_skills')); // 如果没有旧技能，则提示用户
    }
  };

  // --- Audio Handlers ---
  // 初始化音频播放器设置的回调
  const setupAudioCallback = useCallback(() => {
    setupAudio(audioRef, setAudioState, message);
  }, [message]);

  // 效果4: 当选中的亚比改变时，设置或更新音频源
  useEffect(() => {
    // 只有ID大于等于3923的亚比才有语音
    if (selectedPet && Number(selectedPet.id) >= 3923) {
      setupAudioCallback();
      const audio = audioRef.current!;
      audio.pause();
      const petId = selectedPet.id.toString().replace('_0', '');
      const audioSrc = `/proxy/play/music/petsound/petsound${petId}.mp3`;

      // 如果音频源改变了，则重新加载
      if (audio.src !== audioSrc) {
        setAudioState((prev) => ({
          ...prev,
          isLoading: true,
          isPlaying: false,
          progress: 0,
          currentTime: 0,
        }));
        audio.src = audioSrc;
        audio.load();
      } else {
        // 如果音频源未变，则重置播放状态
        setAudioState((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          progress: 0,
          currentTime: 0,
        }));
      }
    }
  }, [selectedPet, setupAudioCallback]);

  // 播放/暂停音频的回调
  const handlePlayAudioCallback = useCallback(() => {
    handlePlayAudio(selectedPet, audioRef, audioState, setupAudioCallback, setAudioState, message);
  }, [selectedPet, audioState, setupAudioCallback, message]);

  // 点击进度条跳转播放进度的回调
  const handleProgressClickCallback = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handleProgressClick(e, audioRef, audioState, progressRef);
    },
    [audioState]
  );

  // 下载音频的回调
  const handleDownloadAudioCallback = useCallback(() => {
    handleDownloadAudio(selectedPet, message);
  }, [selectedPet, message]);

  // --- Render Logic ---
  if (isLoadingPets) {
    return (
      <Layout>
        <LoadingSpinner text={t('loading_pets')} />
      </Layout>
    );
  }

  if (petsError) {
    return (
      <Layout>
        <ErrorDisplay error={petsError.message} onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pet-container">
        <Title level={1} style={{ textAlign: 'center', margin: '20px 0' }}>
          {t('page_title')}
        </Title>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'var(--color-surface)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px var(--color-shadow)',
            marginBottom: '24px',
            border: '1px solid var(--border-dark)',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div className="search-filter-wrapper">
                <Input
                  placeholder={t('search_placeholder')}
                  prefix={<Search size={16} />}
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setShowSearchResults(true);
                  }}
                  style={{
                    borderRadius: 8,
                    minWidth: '200px',
                  }}
                  allowClear
                  size="large"
                />
                <Select
                  value={selectedAttribute}
                  onChange={setSelectedAttribute}
                  style={{ minWidth: '120px' }}
                  suffixIcon={<Filter size={16} />}
                  size="large"
                >
                  <Option value="all">
                    <span>{t('all_attributes')}</span>
                  </Option>
                  {skillAttributes.map((attr) => (
                    <Option key={attr.id} value={attr.id.toString()}>
                      <div className="attribute-option">
                        <img
                          src={getAttributeIconUrl(attr.id)}
                          alt={attr.name}
                          className="attribute-option-icon"
                        />
                        <span>{attr.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
                {showSearchResults && searchOptions.length > 0 && (
                  <div className="search-results-dropdown">
                    {searchOptions.map((option) => (
                      <div key={option.value} className="search-result-item">
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Space>
        </motion.div>

        {selectedPet ? (
          <Card>
            <div className="pet-info-container">
              <div className="pet-avatar">
                <Image
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'contain' }}
                  src={getPetImageUrl(selectedPet.id, 'big')}
                  alt={selectedPet.name}
                  fallback={getPetImageUrl(selectedPet.id, 'small')}
                  preview={false}
                />
              </div>
              <div className="pet-detail-area">
                <div className="pet-detail-header">
                  <div className="pet-name-container">
                    <h2 className="pet-name">{selectedPet.name}</h2>
                    {petDictionaryData?.petEra &&
                      (() => {
                        const iconUrl = getEraIconUrl(
                          petDictionaryData.petEra.eraName,
                          petDictionaryData.petEra.typeId
                        );
                        return (
                          iconUrl && (
                            <div
                              className="pet-era-tag"
                              title={petDictionaryData.petEra.displayName}
                            >
                              <img
                                src={iconUrl}
                                alt={petDictionaryData.petEra.displayName}
                                className="era-icon"
                              />
                            </div>
                          )
                        );
                      })()}
                    <div className="pet-attributes">
                      {selectedPet.attribute1 && selectedPet.attribute1 !== '0' && (
                        <div
                          className="pet-attribute clickable"
                          onClick={() =>
                            navigate(`/app/attribute?attrId=${selectedPet.attribute1}`)
                          }
                        >
                          <img
                            src={getAttributeIconUrl(Number(selectedPet.attribute1))}
                            alt={getAttributeName(selectedPet.attribute1, attributeNameMap)}
                            className="attribute-icon"
                          />
                        </div>
                      )}
                      {selectedPet.attribute2 &&
                        selectedPet.attribute2 !== '0' &&
                        selectedPet.attribute1 !== selectedPet.attribute2 && (
                          <div
                            className="pet-attribute clickable"
                            onClick={() =>
                              navigate(`/app/attribute?attrId=${selectedPet.attribute2}`)
                            }
                          >
                            <img
                              src={getAttributeIconUrl(Number(selectedPet.attribute2))}
                              alt={getAttributeName(selectedPet.attribute2, attributeNameMap)}
                              className="attribute-icon"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="pet-audio-container">
                    <div className="pet-id">
                      {t('race_id')}: <span className="pet-id-value">{selectedPet.id}</span>
                    </div>
                    {Number(selectedPet.id) >= 3923 && (
                      <div className="pet-audio-player">
                        <button
                          className="audio-play-button"
                          onClick={handlePlayAudioCallback}
                          disabled={audioState.isLoading || audioState.error}
                          title={audioState.isPlaying ? t('pause') : t('play')}
                        >
                          {audioState.isLoading ? (
                            <LoadingOutlined className="audio-icon loading" />
                          ) : audioState.isPlaying ? (
                            <PauseCircleOutlined className="audio-icon playing" />
                          ) : (
                            <SoundOutlined className="audio-icon" />
                          )}
                        </button>
                        <div
                          className="audio-progress-container"
                          ref={progressRef}
                          onClick={handleProgressClickCallback}
                        >
                          <div
                            className="audio-progress-bar"
                            style={{ width: `${audioState.progress}%` }}
                          />
                        </div>
                        <span className="audio-time">
                          {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
                        </span>
                        <button
                          className="audio-download"
                          onClick={handleDownloadAudioCallback}
                          title="下载语音"
                        >
                          <DownloadOutlined style={{ color: '#1890ff' }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <PetDescription petId={Number(selectedPet.id)} />
                <Card title={t('base_stats')} style={{ marginTop: '20px' }}>
                  <div className="stats-grid">
                    {stats.map((stat) => (
                      <div className="stat-item" key={stat.key}>
                        <span className="stat-label">{stat.label}</span>
                        <div className="stat-bar-container">
                          <motion.div
                            className="stat-bar"
                            initial={{ width: '0%' }}
                            animate={{ width: `${stat.percent || 0}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                          <span className="stat-value">{stat.display || stat.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="skills-section">
                  <div className="skills-header">
                    <h3>{t('skills')}</h3>
                    <div className="skill-toggle">
                      <Space>
                        <span>{t('old_version')}</span>
                        <Switch
                          checked={isNewSkillSet}
                          onChange={handleSkillSetChange}
                          checkedChildren={t('new_version')}
                          unCheckedChildren={t('old_version')}
                        />
                        <span>{t('new_version')}</span>
                      </Space>
                    </div>
                  </div>
                  <Collapse items={skillItems} defaultActiveKey={['exclusive', 'common']} />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="error-container">
            <Empty description="请从左侧列表选择或搜索一个亚比来查看详情" />
          </div>
        )}
      </div>
    </Layout>
  );
}
