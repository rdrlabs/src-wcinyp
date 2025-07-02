import React from 'react';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ as: Tag = 'h1', children, className, ...props }) => {
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;