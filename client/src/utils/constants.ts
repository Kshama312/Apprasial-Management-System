import { Role } from '../types';  // or whatever the correct path is to your types file

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE_APPRAISAL: '/appraisals/create',
  VIEW_APPRAISAL: '/appraisals/:id',
  GIVE_FEEDBACK: '/appraisals/:id/feedback',
};

export const ROLE_PERMISSIONS = {
  [Role.EMPLOYEE]: ['CREATE_APPRAISAL', 'VIEW_SELF_APPRAISAL'],
  [Role.JUNIOR]: ['VIEW_APPRAISAL', 'GIVE_FEEDBACK'],
  [Role.PEER]: ['VIEW_APPRAISAL', 'GIVE_FEEDBACK'],
  [Role.MANAGER]: ['VIEW_ALL_APPRAISALS', 'APPROVE_APPRAISAL', 'FORWARD_TO_SUPERVISOR'],
  [Role.SUPERVISOR]: ['VIEW_ALL_APPRAISALS', 'FORWARD_FOR_FEEDBACK', 'COLLECT_FEEDBACK'],
};