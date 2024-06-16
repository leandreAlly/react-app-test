import { useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import ProductsTable from '../components/ProductsTable';
import SelectCategory from '../components/SelectCategory';

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <SelectCategory
          onchange={(categoryId) => setSelectedCategoryId(categoryId)}
        />
      </div>
      <ProductsTable selectedCategoryId={selectedCategoryId!} />
    </div>
  );
}

export default BrowseProducts;
