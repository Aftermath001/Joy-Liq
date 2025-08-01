import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";

const PRODUCTS_PER_PAGE = 8;

const Shop = () => {
  const { products, fetchAllProducts, loading } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLast = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirst = indexOfLast - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Extract unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-brand-blue">
        Shop Our Products
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-brand-pink focus:border-brand-pink"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/4 px-4 py-2 text-brand-pink border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No products found.</p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-full font-medium border transition duration-300 ${
                      page === currentPage
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:bg-gold hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;