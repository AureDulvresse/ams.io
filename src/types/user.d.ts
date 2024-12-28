export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  emailVerified?: Date;
  is_active: boolean;
  last_login?: Date;
  image?: string;
  created_at: Date;
  updated_at: Date;
  role: Role;
};
