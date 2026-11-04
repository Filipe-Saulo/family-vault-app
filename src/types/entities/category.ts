export interface Category {
  categoryId: number;
  description: string;
  purpose: {
    categoryPurposeId: number;
    name: string;
    code: number;
  };
  createdAt: string;
  updatedAt: string | null;
}
