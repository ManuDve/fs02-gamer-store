import Button from 'react-bootstrap/Button';
import './Products.css'
import { AddToCartIcon } from '../../../shared/components/AddToCartIcon';


const Products = ({ products }) => {
  
  const juegosDeMesa = products.filter(product => product.category === "Juego de Mesa");
  const perifericosGamer = products.filter(product => product.category === "Periférico Gamer");
  const consolas = products.filter(product => product.category === "Consola");

  return (
    <div className='container'>
      <h1 className='products-heading-h1'>Nuestros productos</h1>
      <h2 className='products-heading-h2'>Juegos de Mesa</h2>
      <div className='products'>
        <ul>
          {juegosDeMesa.map(product => (
            <li key={product.id}>
              <img src={product.img} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <p>$ {product.price}</p>
              </div>
              <div>
                <Button variant="primary">{<AddToCartIcon />} Agregar al carro</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <h2>Periféricos Gamer</h2>
      <div className='products'>
        <ul>
          {perifericosGamer.map(product => (
            <li key={product.id}>
              <img src={product.img} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <p>$ {product.price}</p>
              </div>
              <div>
                <Button variant="primary">{<AddToCartIcon />} Agregar al carro</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <h2>Consolas</h2>
      <div className='products'>
        <ul>
          {consolas.map(product => (
            <li key={product.id}>
              <img src={product.img} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <p>$ {product.price}</p>
              </div>
              <div>
                <Button variant="primary">{<AddToCartIcon />} Agregar al carro</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default Products;
