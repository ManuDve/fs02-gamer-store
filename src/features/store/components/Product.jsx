import { Link } from 'react-router-dom';
import { AddToCartIcon } from '../../../shared/components/AddToCartIcon';
import { useCartDispatch, addToCart } from '../../../app/context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import './Product.css';
import { useState } from 'react';

const Product = (props) => {
    return (
        <div className="card h-100 product-card">
            <Link to={`/products/${props.id}`} className="text-reset text-decoration-none">
                <div className="product-img-container">
                    <img src={props.img} alt={props.name} className="card-img-top" />
                </div>
            </Link>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">
                    <Link to={`/products/${props.id}`} className="text-decoration-none text-dark">{props.name}</Link>
                </h5>
                <p className="card-text text-muted flex-grow-1 mb-2 fw-bold">
                    {formatPrice(props.price)}
                </p>
                <div className="mb-3">
                    {props.stock > 0 ? (
                        <small className="text-success">
                            <strong>✓ Stock: {props.stock} unidades</strong>
                        </small>
                    ) : (
                        <small className="text-danger">
                            <strong>Sin stock</strong>
                        </small>
                    )}
                </div>
                <CartButton id={props.id} name={props.name} price={props.price} img={props.img} stock={props.stock} />
            </div>
        </div>
    )
}

export default Product;

function CartButton({ id, name, price, img, stock }) {
    const dispatch = useCartDispatch();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(dispatch, { id, name, price, img }, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            type="button"
            className={`btn w-100 ${isAdded ? 'btn-success' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={stock <= 0}
        >
            {isAdded ? '✓ Agregado al carro' : (<><AddToCartIcon /> Agregar al carro</>)}
        </button>
    );
}