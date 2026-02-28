import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { useStore } from '../App.tsx';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group glass-dark rounded-[3rem] border border-white/5 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(225,29,72,0.2)]"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-slate-950">
        <motion.img 
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-8 left-8">
          <span className="bg-white text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
            {product.category}
          </span>
        </div>
        {product.stock < 10 && (
          <div className="absolute bottom-8 left-8 glass px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-red-400 border border-red-500/30 animate-pulse">
            Exclusive: {product.stock} Left
          </div>
        )}
      </Link>
      
      <div className="p-10">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-2xl font-black text-white group-hover:text-red-500 transition-colors leading-tight mb-4 line-clamp-1 tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-1.5 mb-8">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa-solid fa-star text-[10px] ${i < Math.floor(product.rating) ? 'text-red-500' : 'text-white/10'}`}></i>
          ))}
          <span className="text-[10px] font-black text-white/30 ml-3 tracking-[0.2em] uppercase">Ref. {product.rating}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-white tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
            <div className="flex items-center mt-2">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 shadow-[0_0_10px_rgba(225,29,72,0.8)]"></div>
               <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em]">Priority Shipping</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product)}
            className="bg-white text-black w-16 h-16 rounded-[2rem] flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-500 shadow-2xl active:scale-90"
          >
            <i className="fa-solid fa-plus text-xl"></i>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
