
import { useCallback } from 'react';
import { User } from '../../types/user';

export const useRoleChecks = (currentUser: User | null) => {
  const isSuperAdmin = useCallback(() => {
    return currentUser?.role === 'super_admin';
  }, [currentUser]);

  const isTeacher = useCallback(() => {
    return currentUser?.role === 'teacher' || currentUser?.role === 'super_admin';
  }, [currentUser]);

  const isAdmin = useCallback(() => {
    return currentUser?.role === 'super_admin' || 
           currentUser?.role === 'admin_faculty' || 
           currentUser?.role === 'dept_head' ||
           currentUser?.role === 'vice_dean_pedagogy' ||
           currentUser?.role === 'vice_dean_postgrad' ||
           currentUser?.role === 'domain_manager' ||
           currentUser?.role === 'planning_service_head' ||
           currentUser?.role === 'secretary_general';
  }, [currentUser]);

  return {
    isSuperAdmin,
    isTeacher,
    isAdmin
  };
};
