import { useId } from 'react';
import './Filters.css';

const Filters = ({ onChange }) => {

    const categorySelectId = useId();

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
                <option value="Juego de Mesa">Juego de Mesa</option>
                <option value="Periférico Gamer">Periférico Gamer</option>
                <option value="Consola">Consola</option>
            </select>
        </div>
    )
}

export default Filters