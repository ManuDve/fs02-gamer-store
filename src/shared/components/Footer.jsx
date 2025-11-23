import paymentImage from "../../assets/img/payment.png";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 pb-4">
            <strong>Tienda Level-Up Gaming</strong>
            <ul>
              <li>Álvarez 2336, Viña del Mar, Chile.</li>
              <img className="py-1" src={paymentImage} id="payment-logos" alt="payment sytem logo" />
            </ul>
          </div>
          <div className="col-12 col-md-4 pb-4">
            <strong>Contáctanos</strong>
            <ul>
              <li>
                +569 9999 0000
              </li>
              <li>
                <a href="mailto:contacto@lupgamer.cl">contacto@lupgamer.cl</a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-4">
            <strong>Newsletter</strong>
            <form>
              <div className="mb-3 py-3">
                <input type="email" className="form-control" id="exampleInputEmail1"
                  aria-describedby="emailHelp" />
                <div>Ingresa tu correo para suscribirte.</div>
              </div>
              <button type="submit" id="newsletter-button" className="btn btn-primary">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
