export type Category = {
  id: string;
  user_id: string | null;
  name: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
};

export type FindAllCategoryResponse = {
  message: string;
  data: Category[];
};
