import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <div data-testid="layout">
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <main role="main">{children}</main>
    </div>
  );
};

export default Layout;