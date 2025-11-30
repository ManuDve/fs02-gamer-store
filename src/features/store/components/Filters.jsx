import { useId, useState, useEffect } from 'react';
import './Filters.css';
import { productService } from '../../../shared/services/productService';

const Filters = ({ onChange }) => {
    const categorySelectId = useId();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const products = await productService.getAll();
            // Obtener categorías únicas
            const uniqueCategories = [...new Set(products.map(p => p.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handleCategoryChange = (event) => {
        onChange((prevFilters) => ({
            ...prevFilters,
            category: event.target.value
        }));
    };

    return (
        <div className="filters">
            <label htmlFor={categorySelectId}>Categoría</label>
            <select id={categorySelectId} onChange={handleCategoryChange}>
                <option value="all">Todas</option>
                {categories.map(category => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Filters;