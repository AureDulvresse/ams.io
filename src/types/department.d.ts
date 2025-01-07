export type Department = {
  id: number;
  name: string;
  code: string;
  type: string; // 'academic' | 'administrative' | 'service';
  description?: string | null;
  created_at: Date;
  updated_at?: Date;
};
