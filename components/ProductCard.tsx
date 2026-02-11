import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { useStore } from '../App.tsx';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(220,38,38,0.15)] transition-all duration-500 transform hover:-translate-y-2">
      <Link to={`/product/${product.id}`} className="block relative aspect-[5/6] overflow-hidden bg-slate-50 dark:bg-slate-800">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-6 left-6">
          <span className="bg-red-600 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
            {product.category}
          </span>
        </div>
        {product.stock < 10 && (
          <div className="absolute bottom-6 left-6 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest animate-pulse border border-white/20">
            Last {product.stock} Units
          </div>
        )}
      </Link>
      
      <div className="p-7">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight mb-3 line-clamp-1 tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa-solid fa-star text-[10px] ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}></i>
          ))}
          <span className="text-[10px] font-black text-slate-400 ml-2 tracking-widest">{product.rating}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
            <div className="flex items-center mt-1">
               <div className="w-1 h-1 bg-green-500 rounded-full mr-1.5"></div>
               <p className="text-[9px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest">Free Delivery</p>
            </div>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="bg-red-600 text-white w-14 h-14 rounded-3xl flex items-center justify-center hover:bg-red-700 transition-all shadow-xl shadow-red-200 dark:shadow-none active:scale-90"
          >
            <i className="fa-solid fa-plus text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;