import React from 'react';
const NextLink = ({ href, children, ...rest }: { href: string; children: React.ReactNode; className?: string }) => (
  <a href={href} {...rest}>{children}</a>
);
export default NextLink;
