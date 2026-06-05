import Category from '../../models/category';

const createCategories = async (categories: any) => {
  const category = await Category.insertMany(categories);
  return category;
};

export { createCategories };
