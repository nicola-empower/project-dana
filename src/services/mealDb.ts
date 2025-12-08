const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const mealDb = {
    async searchMeals(term: string) {
        const res = await fetch(`${BASE_URL}/search.php?s=${term}`);
        const data = await res.json();
        return data.meals || [];
    },

    async getRandomMeal() {
        const res = await fetch(`${BASE_URL}/random.php`);
        const data = await res.json();
        return data.meals?.[0] || null;
    },

    async getCategories() {
        const res = await fetch(`${BASE_URL}/categories.php`);
        const data = await res.json();
        return data.categories || [];
    },

    async getMealById(id: string) {
        const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
        const data = await res.json();
        return data.meals?.[0] || null;
    },

    async getMealsByFirstLetter(letter: string) {
        const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
        const data = await res.json();
        return data.meals || [];
    }
};
