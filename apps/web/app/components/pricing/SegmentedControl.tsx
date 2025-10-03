'use client';

interface SegmentedControlProps {
  options: { value: string; label: string; badge?: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({ 
  options, 
  value, 
  onChange, 
  className = '' 
}: SegmentedControlProps) {
  return (
    <div 
      className={`segmented-control ${className}`}
      style={{
        display: 'flex',
        background: 'var(--gray-100)',
        borderRadius: 'var(--r-sm)',
        padding: '8px',
        gap: '4px'
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`toggle-option ${value === option.value ? 'active' : ''}`}
          style={{
            padding: '12px 20px',
            borderRadius: 'var(--r-xs)',
            border: 'none',
            background: value === option.value ? 'white' : 'transparent',
            color: value === option.value ? 'var(--brand)' : 'var(--gray-600)',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 180ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            position: 'relative',
            boxShadow: value === option.value ? 'var(--shadow-1)' : 'none'
          }}
        >
          {option.label}
          {option.badge && (
            <span 
              style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: '4px'
              }}
            >
              {option.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}




