export interface Category {
  categoryId: number;
  description: string;
  purpose: {
    categoryPurposeId: number;
    name: string;
    code: number;
  };
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string | null;
}
