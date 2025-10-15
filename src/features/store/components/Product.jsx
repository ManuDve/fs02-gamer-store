import { AddToCartIcon } from '../../../shared/components/AddToCartIcon';

const Product = (props) => {
    return (
        <li key={props.id}>
            <a href="#"><img src={props.img} alt={props.name} /></a>
            <div>
                <strong>{props.name}</strong>
                <p>$ {props.price}</p>
            </div>
            <div>
                <button type="button" className="btn">{<AddToCartIcon />} Agregar al carro</button>
            </div>
        </li>
    )
}

export default Product;