import { Link } from 'react-router-dom';
import { AddToCartIcon } from '../../../shared/components/AddToCartIcon';
import { useCartDispatch, addToCart } from '../../../app/context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const Product = (props) => {
    return (
        <li key={props.id}>
            <Link to={`/products/${props.id}`}><img src={props.img} alt={props.name} /></Link>
            <div>
                <strong>{props.name}</strong>
                <p>{formatPrice(props.price)}</p>
            </div>
            <div>
                <CartButton id={props.id} name={props.name} price={props.price} img={props.img} />
            </div>
        </li>
    )
}

export default Product;

function CartButton({ id, name, price, img }) {
    const dispatch = useCartDispatch();
    return (
        <button
            type="button"
            className="btn"
            onClick={() => addToCart(dispatch, { id, name, price, img }, 1)}
        >{<AddToCartIcon />} Agregar al carro</button>
    );
}