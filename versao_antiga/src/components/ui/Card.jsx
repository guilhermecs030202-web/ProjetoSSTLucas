import React from 'react';

const Card = ({ children, className = '', title, action }) => {
  return (
    <div className={`card ${className}`} style={{ padding: '1.5rem' }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {title && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
