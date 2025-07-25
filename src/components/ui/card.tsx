// src/components/ui/card.tsx
import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const Card = ({ className = "", ...props }: CardProps) => (
  <div className={`bg-white rounded shadow-md ${className}`} {...props} />
);

const CardContent = ({ className = "", ...props }: CardContentProps) => (
  <div className={`p-4 ${className}`} {...props} />
);

export { Card, CardContent };
