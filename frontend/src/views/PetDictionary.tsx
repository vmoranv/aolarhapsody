/**
 * 亚比查询组件
 * ---------------------------
 * 精确复刻自原始的 uTools 插件 UI 和逻辑
 */
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const PetDescription: React.FC<{ petId: number }> = ({ petId }) => {
  const {
    data: description,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['petDictionary', petId, 'description'],
    queryFn: () => fetchPetDictionaryById(petId),
    select: (data) => data.petIntro || '暂无介绍',
    enabled: !!petId,
  });

  if (isLoading) return <div className="description-loading">加载介绍中...</div>;
  if (error) return <div className="description-error">获取介绍失败</div>;
  return <div className="description-content">{description}</div>;
};

export default function PetDictionary() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('all');
  const [selectedPet, setSelectedPet] = useState<PetListItem | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isNewSkillSet, setIsNewSkillSet] = useState(true);

  const [audioState, setAudioState] = useState({
    isLoading: false,
    isPlaying: false,
    error: false,
    duration: 0,
    currentTime: 0,
    progress: 0,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // --- Data Fetching ---
  const {
    data: pets = [],
    isLoading: isLoadingPets,
    error: petsError,
  } = useQuery<PetListItem[], Error>({
    queryKey: ['pets'],
    queryFn: fetchPetList,
    staleTime: Infinity,
  });

  const { data: skillAttributes = [] } = useQuery<ProcessedAttribute[], Error>({
    queryKey: ['skillAttributes'],
    queryFn: fetchSkillAttributes,
    staleTime: Infinity,
  });

  const { data: selectedPetRawData } = useQuery({
    queryKey: ['petRawData', selectedPet?.id],
    queryFn: () => fetchPetRawDataById(selectedPet!.id),
    enabled: !!selectedPet,
  });

  const { data: petDictionaryData } = useQuery({
    queryKey: ['petDictionary', selectedPet?.id],
    queryFn: () => fetchPetDictionaryById(Number(selectedPet!.id)),
    enabled: !!selectedPet,
  });

  const attributeNameMap = useMemo(
    () => createAttributeNameMap(skillAttributes),
    [skillAttributes]
  );

  // --- Effects ---
  useEffect(() => {
    if (!isLoadingPets && pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0]);
    }
  }, [isLoadingPets, pets, selectedPet]);

  useEffect(() => {
    if (selectedPet) {
      setIsNewSkillSet(true); // 每次选择新亚比时，重置为优先显示新技能
    }
  }, [selectedPet]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // --- Memos ---
  const handleSelectPet = useCallback((pet: PetListItem) => {
    setSelectedPet(pet);
    setSearchKeyword(pet.name);
    setShowSearchResults(false);
  }, []);

  const searchOptions = useMemo(() => {
    const options = generateSearchOptions(pets, searchKeyword, selectedAttribute, filterPets);
    return options.map(({ value, pet }) => ({
      value,
      pet,
      label: (
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

  const stats: Stat[] = useMemo(
    () => calculateStats(selectedPetRawData, petDictionaryData),
    [selectedPetRawData, petDictionaryData]
  );

  const { skillItems, hasNewSkills, hasOldSkills } = useMemo(() => {
    const { items, fallback, hasNewSkills, hasOldSkills } = generateCollapseSkillItems(
      selectedPetRawData,
      isNewSkillSet,
      generateSkillItems
    );

    if (fallback) {
      setTimeout(() => setIsNewSkillSet(false), 0);
    }

    if (items.length === 0 || items[0].children === null) {
      return {
        skillItems: [
          {
            key: '1',
            label: '技能列表',
            children: <Empty description="暂无技能数据" />,
          },
        ],
        hasNewSkills,
        hasOldSkills,
      };
    }

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
  const handleSkillSetChange = (checked: boolean) => {
    if (checked) {
      if (hasNewSkills) {
        setIsNewSkillSet(true);
      } else {
        message.info('该亚比没有新版技能组。');
      }
    } else {
      if (hasOldSkills) {
        setIsNewSkillSet(false);
      } else {
        message.info('该亚比没有旧版技能组。');
      }
    }
  };

  const setupAudioCallback = useCallback(() => {
    setupAudio(audioRef, setAudioState, message);
  }, [message]);

  useEffect(() => {
    if (selectedPet && Number(selectedPet.id) >= 3923) {
      setupAudioCallback();
      const audio = audioRef.current!;
      audio.pause();
      const petId = selectedPet.id.toString().replace('_0', '');
      const audioSrc = `http://aola.100bt.com/play/music/petsound/petsound${petId}.mp3`;
      if (audio.src !== audioSrc) {
        setAudioState({
          isLoading: true,
          isPlaying: false,
          error: false,
          duration: 0,
          currentTime: 0,
          progress: 0,
        });
        audio.src = audioSrc;
        audio.load();
      } else {
        setAudioState({
          isLoading: false,
          isPlaying: false,
          error: false,
          duration: audio.duration,
          currentTime: 0,
          progress: 0,
        });
      }
    }
  }, [selectedPet, setupAudioCallback]);

  const handlePlayAudioCallback = useCallback(() => {
    handlePlayAudio(selectedPet, audioRef, audioState, setupAudioCallback, setAudioState, message);
  }, [selectedPet, audioState, setupAudioCallback, message]);

  const handleProgressClickCallback = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handleProgressClick(e, audioRef, audioState, progressRef);
    },
    [audioState]
  );

  const handleDownloadAudioCallback = useCallback(() => {
    handleDownloadAudio(selectedPet);
  }, [selectedPet]);

  // --- Render ---
  if (isLoadingPets) {
    return (
      <Layout>
        <LoadingSpinner text="加载亚比列表中..." />
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
          亚比查询
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
                  placeholder="搜索亚比..."
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
                    <span>全部系别</span>
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
                      种族值ID: <span className="pet-id-value">{selectedPet.id}</span>
                    </div>
                    {Number(selectedPet.id) >= 3923 && (
                      <div className="pet-audio-player">
                        <button
                          className="audio-play-button"
                          onClick={handlePlayAudioCallback}
                          disabled={audioState.isLoading || audioState.error}
                          title={audioState.isPlaying ? '暂停' : '播放'}
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
                <Card title="种族值" style={{ marginTop: '20px' }}>
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
                    <h3>技能</h3>
                    <div className="skill-toggle">
                      <Space>
                        <span>旧版</span>
                        <Switch
                          checked={isNewSkillSet}
                          onChange={handleSkillSetChange}
                          checkedChildren="新版"
                          unCheckedChildren="旧版"
                        />
                        <span>新版</span>
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
