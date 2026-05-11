import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Tag, ExternalLink, Filter } from "lucide-react";
import type { Product } from "../types/portfolio";
import { fetchProducts, fetchProductCategories } from "../utils/api";
import MediaGallery from "../components/MediaGallery";

export default function Showcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchProductCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const openGallery = (product: Product) => {
    if (product.images.length > 0 || product.videos.length > 0) {
      setGalleryProduct(product);
      setGalleryOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono flex items-center justify-center">
        <div className="bg-white border-4 border-black p-8 shadow-lego">
          <p className="text-xl">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white border-4 border-black p-8 shadow-lego mb-12"
        >
          <div className="absolute -top-[14px] left-6 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-4 bg-white border-x-4 border-t-4 border-black rounded-t-lg"
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <ShoppingBag className="w-12 h-12 text-lego-yellow" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">我的橱窗</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            这里展示我的商品和作品，欢迎浏览和选购。
          </p>
        </motion.div>

        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-white border-4 border-black p-6 shadow-lego mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} />
              <span className="font-bold">按分类筛选</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 border-2 border-black text-sm font-bold transition-all ${
                  selectedCategory === null
                    ? "bg-lego-blue text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 border-2 border-black text-sm font-bold transition-all flex items-center gap-1 ${
                    selectedCategory === category
                      ? "bg-lego-blue text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <Tag size={14} />
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-white border-4 border-black shadow-lego hover:shadow-[8px_8px_0px_#000] transition-shadow duration-300"
            >
              <div className="absolute -top-[14px] left-6 flex gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-4 bg-white border-x-4 border-t-4 border-black rounded-t-lg"
                  />
                ))}
              </div>

              {product.images.length > 0 && (
                <div
                  className="relative overflow-hidden border-b-4 border-black cursor-pointer"
                  onClick={() => openGallery(product)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {(product.images.length > 1 || product.videos.length > 0) && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 text-xs font-bold">
                      {product.images.length + product.videos.length} 个媒体
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-black">{product.name}</h2>
                  {product.inStock ? (
                    <span className="bg-lego-green text-white px-2 py-1 text-xs font-bold">
                      在售
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white px-2 py-1 text-xs font-bold">
                      售罄
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {product.description}
                </p>

                <div className="text-2xl font-black text-lego-red mb-4">
                  ¥{product.price.toFixed(2)}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category && (
                    <span className="bg-lego-blue text-white px-3 py-1 text-xs font-bold border-2 border-black">
                      {product.category}
                    </span>
                  )}
                  {product.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-lego-yellow text-black px-3 py-1 text-xs font-bold border-2 border-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {product.link && (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-lego-green text-white px-4 py-2 border-2 border-black shadow-lego hover:shadow-lego-active transition-all text-sm font-bold"
                    >
                      <ExternalLink size={14} /> 购买链接
                    </a>
                  )}
                  {(product.images.length > 0 || product.videos.length > 0) && (
                    <button
                      onClick={() => openGallery(product)}
                      className="flex items-center gap-1 px-4 py-2 border-2 border-black hover:bg-gray-100 transition-all text-sm font-bold"
                    >
                      查看详情
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-white border-4 border-black p-12 shadow-lego text-center"
          >
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {selectedCategory
                ? `没有"${selectedCategory}"分类的商品`
                : "还没有商品，去管理页面添加吧！"}
            </p>
          </motion.div>
        )}
      </div>

      {galleryProduct && (
        <MediaGallery
          images={galleryProduct.images}
          videos={galleryProduct.videos}
          isOpen={galleryOpen}
          onClose={() => {
            setGalleryOpen(false);
            setGalleryProduct(null);
          }}
        />
      )}
    </div>
  );
}
