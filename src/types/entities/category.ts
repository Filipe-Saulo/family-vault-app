export interface Category {
  categoryId: number;
  description: string;
  purpose: {
    categoryPurposeId: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string | null;
}
