import { Button, Input, Select, Space } from 'antd';
import { motion } from 'framer-motion';
import { Filter, RotateCcw, Search } from 'lucide-react';
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const { Option } = Select;

export type FilterType = 'all' | 'super' | 'normal' | string;

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterType: FilterType;
  onFilterChange: (value: FilterType) => void;
  onReset: () => void;
  searchPlaceholder?: string;
  filterOptions?: { label: string; value: FilterType }[];
  resetText: string;
  showingText: React.ReactNode;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchValue,
  onSearchChange,
  filterType,
  onFilterChange,
  onReset,
  searchPlaceholder,
  filterOptions,
  resetText,
  showingText,
}) => {
  const { colors } = useTheme()!;

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
              placeholder={searchPlaceholder}
              prefix={<Search size={16} color={colors.textSecondary} />}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                borderRadius: 8,
                minWidth: '200px',
              }}
              allowClear
            />

            {filterOptions && (
              <Select
                value={filterType}
                onChange={onFilterChange}
                style={{ minWidth: '120px' }}
                suffixIcon={<Filter size={16} color={colors.textSecondary} />}
              >
                {filterOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            )}

            <Button icon={<RotateCcw size={16} />} onClick={onReset} style={{ borderRadius: 8 }}>
              {resetText}
            </Button>
          </Space>

          <div
            style={{
              color: colors.textSecondary,
              fontSize: '14px',
              whiteSpace: 'nowrap',
            }}
          >
            {showingText}
          </div>
        </div>
      </Space>
    </motion.div>
  );
};

export default SearchAndFilter;
