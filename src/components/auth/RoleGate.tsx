import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/database.types';

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { role, isAuthenticated } = useAuth();

  // If authenticated and role matches, render children
  if (isAuthenticated && role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
