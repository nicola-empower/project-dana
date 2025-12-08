'use client';

import React, { useState, useEffect } from 'react';
import { useView } from '@/context/ViewContext';
import { Search, ChefHat, Flame, Clock, X, ArrowLeft, ArrowRight, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mealDb } from '@/services/mealDb';

export default function DecoyView() {
    const { isMagicSearch } = useView();
    const [searchVal, setSearchVal] = useState('');
    const [trending, setTrending] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
    const [magicError, setMagicError] = useState(false);

    useEffect(() => {
        // Load "Trending" meals by fetching a random letter
        // This simulates a large database better than picking 3 random single items
        const loadTrending = async () => {
            const letters = 'abcdefghijklmnpqrstuvwxyz';
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            const meals = await mealDb.getMealsByFirstLetter(randomLetter);
            // Limit to 20 to populate the grid nicely
            setTrending(meals?.slice(0, 20) || []);
        };
        loadTrending();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Check Magic Words First
        const triggered = isMagicSearch(searchVal);
        if (triggered) return;

        // 2. Perform Real Search
        if (!searchVal.trim()) {
            setIsSearching(false);
            return;
        }

        setIsLoading(true);
        setIsSearching(true);
        try {
            const results = await mealDb.searchMeals(searchVal);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchVal('');
        setIsSearching(false);
        setSearchResults([]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full overflow-y-auto bg-gray-50 flex flex-col"
        >
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200/50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-chef-green cursor-pointer" onClick={clearSearch}>
                        <ChefHat className="w-7 h-7" />
                        <span className="font-serif text-2xl tracking-tight font-medium text-gray-900">ChefAI</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="hidden md:block text-sm font-medium text-gray-500 hover:text-chef-green">Saved Recipes</button>
                        <div className="w-9 h-9 bg-gradient-to-br from-chef-green to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-200">
                            JD
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative bg-white pb-12 pt-10 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    {!isSearching ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
                                Discover your next <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-chef-green to-emerald-400">favorite meal.</span>
                            </h1>
                            <p className="text-gray-500 mb-8 max-w-2xl mx-auto font-light">
                                Explore thousands of recipes from around the world. Input your ingredients and let us handle the rest.
                            </p>
                        </>
                    ) : (
                        <div className="mb-6 flex items-center justify-center gap-4">
                            <button onClick={clearSearch} className="flex items-center gap-2 text-gray-400 hover:text-gray-600">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <h2 className="text-2xl font-serif text-gray-800">Results for "{searchVal}"</h2>
                        </div>
                    )}

                    <div className="relative max-w-xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 to-chef-green rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                        <form onSubmit={handleSearch} className="relative bg-white rounded-full shadow-xl flex items-center p-2 border border-gray-100">
                            <Search className="ml-4 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                placeholder="Search recipes (e.g. 'Chicken')..."
                                className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg"
                            />
                            <button type="submit" disabled={isLoading} className="bg-chef-green hover:bg-emerald-800 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-[1.02] active:scale-95 shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                                {isLoading ? 'Searching...' : 'Find'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
                {isSearching ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {searchResults.length > 0 ? (
                            searchResults.map(meal => (
                                <RecipeCard key={meal.idMeal} meal={meal} onClick={() => setSelectedRecipe(meal)} />
                            ))
                        ) : (
                            !isLoading && (
                                <div className="col-span-full text-center py-12 text-gray-400">
                                    <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No recipes found. Try a different ingredient.</p>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="font-serif text-3xl text-gray-900">Trending Now</h2>
                            <button onClick={() => window.location.reload()} className="text-chef-green font-medium hover:underline text-sm">Refresh</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {trending.map((meal, i) => (
                                <RecipeCard key={meal?.idMeal || i} meal={meal} onClick={() => setSelectedRecipe(meal)} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Footer / Hint for user during dev */}
            <div className="bg-gray-900/90 text-white text-center py-3 text-sm font-medium border-t border-gray-800 mt-auto">
                <span className="opacity-75">Demo Codes: </span>
                <span className="text-chef-accent font-bold mx-2">"Blueberry Pancakes"</span> (Secure Vault) |
                <span className="text-love-accent font-bold mx-2">"Burnt Toast"</span> (Love Bomb/Duress Log)
            </div>

            {/* Recipe Details Modal */}
            <AnimatePresence>
                {selectedRecipe && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl overflow-hidden flex flex-col md:flex-row"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="md:w-1/2 h-64 md:h-auto relative">
                                <img src={selectedRecipe.strMealThumb} className="w-full h-full object-cover" alt={selectedRecipe.strMeal} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:hidden">
                                    <h2 className="text-2xl font-serif text-white font-bold">{selectedRecipe.strMeal}</h2>
                                </div>
                                <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md md:hidden">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="md:w-1/2 p-8 flex flex-col relative">
                                <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hidden md:block">
                                    <X className="w-6 h-6" />
                                </button>

                                <h2 className="text-3xl font-serif text-gray-900 font-bold mb-2 hidden md:block">{selectedRecipe.strMeal}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold">{selectedRecipe.strCategory}</span>
                                    <span className="flex items-center gap-1"><Utensils className="w-4 h-4" /> {selectedRecipe.strArea}</span>
                                </div>

                                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Ingredients</h3>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            {Array.from({ length: 20 }).map((_, i) => {
                                                const ingredient = selectedRecipe[`strIngredient${i + 1}`];
                                                const measure = selectedRecipe[`strMeasure${i + 1}`];
                                                if (ingredient) {
                                                    return (
                                                        <li key={i} className="flex justify-between items-center border-b border-gray-50 pb-1 last:border-0">
                                                            <span>{ingredient}</span>
                                                            <span className="font-bold text-gray-400">{measure}</span>
                                                        </li>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Instructions</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                            {selectedRecipe.strInstructions}
                                        </p>
                                    </div>

                                    {selectedRecipe.strSource && (
                                        <a href={selectedRecipe.strSource} target="_blank" rel="noreferrer" className="block text-center text-xs text-blue-500 hover:underline pt-4">
                                            View Original Source
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function RecipeCard({ meal, onClick }: { meal: any, onClick: () => void }) {
    if (!meal) return null;
    return (
        <div onClick={onClick} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
            <div className="h-56 overflow-hidden relative bg-gray-100">
                <img src={meal.strMealThumb} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={meal.strMeal} />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> {meal.strCategory}
                </div>
            </div>
            <div className="p-6">
                <h3 className="font-serif text-xl text-gray-900 mb-2 group-hover:text-chef-green transition-colors line-clamp-1" title={meal.strMeal}>
                    {meal.strMeal}
                </h3>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 25-40 min</span>
                    <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-400">{meal.strArea}</span>
                </div>
            </div>
        </div>
    )
}
