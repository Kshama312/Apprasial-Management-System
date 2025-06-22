// src/types/index.ts



export enum Role {
    EMPLOYEE = 'Employee',
    JUNIOR = 'Junior',
    PEER = 'Peer',
    MANAGER = 'Manager',
    SUPERVISOR = 'Supervisor',
  }
  
  export enum AppraisalStatus {
    DRAFT = 'Draft',
    PENDING_MANAGER = 'PendingManager',
    PENDING_SUPERVISOR = 'PendingSupervisor', 
    PENDING_FEEDBACK = 'PendingFeedback',
    APPROVED = 'Approved',
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    department: string;
  }
  
  export interface Feedback {
    reviewerId: string;
    comment: string;
    rating: number;
    createdAt: Date;
  }
  
  export interface Appraisal {
    _id: string;
    employeeId: User;
    status: AppraisalStatus;
    selfReview: string;
    peerFeedbacks: Feedback[];
    juniorFeedbacks: Feedback[];
    managerApproval: boolean;
    supervisorApproval: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    name: string;
    role: Role;
    department: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
  }
  