import { Button, Input, Select, Space } from 'antd';
import { motion } from 'framer-motion';
import { Filter, RotateCcw, Search } from 'lucide-react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

const { Option } = Select;

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  hideFilter?: boolean;
  searchPlaceholder?: string;
  unitText?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchValue,
  onSearchChange,
  filterType,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
  hideFilter = false,
  searchPlaceholder,
  unitText,
}) => {
  const { colors } = useTheme()!;
  const { t } = useTranslation('poster');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: colors.surface,
        padding: '20px',
        borderRadius: '12px',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        marginBottom: '24px',
        border: `1px solid ${colors.borderSecondary}`,
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
          <Space size="middle" style={{ flex: 1, minWidth: '300px' }}>
            <Input
              placeholder={searchPlaceholder || t('search_placeholder')}
              prefix={<Search size={16} color={colors.textSecondary} />}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                borderRadius: 8,
                minWidth: '200px',
              }}
              allowClear
            />

            {!hideFilter && (
              <Select
                value={filterType}
                onChange={onFilterChange}
                style={{ minWidth: '120px' }}
                suffixIcon={<Filter size={16} color={colors.textSecondary} />}
              >
                <Option value="all">{t('filter_all')}</Option>
                <Option value="super">{t('filter_super')}</Option>
                <Option value="normal">{t('filter_normal')}</Option>
              </Select>
            )}

            <Button icon={<RotateCcw size={16} />} onClick={onReset} style={{ borderRadius: 8 }}>
              {t('reset')}
            </Button>
          </Space>

          <div
            style={{
              color: colors.textSecondary,
              fontSize: '14px',
              whiteSpace: 'nowrap',
            }}
          >
            <Trans
              i18nKey="showing_posters"
              ns="poster"
              values={{
                filteredCount,
                totalCount,
                unit: unitText || t('unit_text'),
              }}
              components={{
                1: <span style={{ color: colors.primary, fontWeight: 600 }} />,
              }}
            />
          </div>
        </div>
      </Space>
    </motion.div>
  );
};

export default SearchAndFilter;
