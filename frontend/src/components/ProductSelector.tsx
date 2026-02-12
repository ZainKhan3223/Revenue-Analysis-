import React from 'react';

interface ProductSelectorProps {
    products: string[];
    selectedProduct: string;
    onSelect: (product: string) => void;
}

const ProductSelector = ({ products, selectedProduct, onSelect }: ProductSelectorProps) => {
    return (
        <div className="relative inline-block text-left mb-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                <span className="material-icons text-xs text-primary">filter_list</span>
                Product Filter
            </div>
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => onSelect('All Products')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedProduct === 'All Products'
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white border-primary shadow-lg shadow-primary/30 scale-105'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-primary/40 hover:bg-white/10 hover:scale-105'
                        }`}
                >
                    All Data
                </button>
                {products.map((product) => (
                    <button
                        key={product}
                        onClick={() => onSelect(product)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedProduct === product
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-white border-primary shadow-lg shadow-primary/30 scale-105'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-primary/40 hover:bg-white/10 hover:scale-105'
                            }`}
                    >
                        {product}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductSelector;
