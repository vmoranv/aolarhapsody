import { useEffect, useState } from 'react';
import { getAttributeIconUrl } from '../utils/attribute-helper';

// 与后端 ProcessedAttribute 类型匹配
type Attribute = {
  id: number;
  name: string;
  isSuper: boolean;
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

const Home = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/skill-attributes');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<Attribute[]> = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setAttributes(result.data);
          setError(null);
        } else {
          setError(result.error || '获取数据失败或数据格式不正确');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  if (loading) {
    return <div>正在加载技能数据...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>错误: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>奥拉星系别</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {attributes.map((attr) => (
          <div
            key={attr.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: '1px solid #ccc',
              padding: '5px',
              borderRadius: '5px',
            }}
          >
            <img
              src={getAttributeIconUrl(attr.id)}
              alt={attr.name}
              style={{ width: '24px', height: '24px' }}
            />
            <span>{`${attr.id}: ${attr.name}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
