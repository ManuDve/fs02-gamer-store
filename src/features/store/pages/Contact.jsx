import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-12 col-md-6">
          <h1>Contáctanos</h1>
          <p>Contáctanos a través del siguiente formulario</p>
          <ContactForm />
        </div>
        <div className="col-12 col-md-6">
          <div style={{ width: '100%' }}>
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Alvarez%202366+(Tienda%20Level-Up%20Gamer)&amp;t=&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              title="Ubicación Level-Up Gamer"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
