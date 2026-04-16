export interface User {
  _id: string;
  name: string;
  email: string;
  branch: string;
  year: string;
  skills: string[];
  bio?: string;
  portfolioLink?: string;
  githubLink?: string;
  profileImage?: string;
  role: 'student' | 'host' | 'admin';
  createdAt: string;
}

export interface Competition {
  _id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  teamSize: number;
  deadline: string;
  createdBy: string | User;
  status: 'Open' | 'Closed';
  isOfficial: boolean;
  upvotes: number;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  competition: Competition;
  members: {
    user: User;
    role: 'Leader' | 'Member';
    joinedAt: string;
  }[];
  status: 'Open' | 'Full';
  createdBy: string | User;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  author: User;
  members: User[];
  requiredSkills: string[];
  maxMembers: number;
  category: string;
  status: 'open' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Request {
  _id: string;
  sender: User;
  receiverTeam?: Team;
  receiverProject?: Project;
  recipientUser?: User;
  status: 'pending' | 'accepted' | 'rejected';
  type: 'join_request' | 'invite';
  message?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  team: string;
  sender: User;
  content: string;
  createdAt: string;
}
