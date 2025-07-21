import './checkout.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import CheckoutForm from '../../Components/Checkout/CheckoutForm';

import Breadcrumbs from '../../Components/Checkout/Breadcrumbs';

export default function CheckoutPage() {
  return (
    <div className="checkout-bg">
      <Header />
      <main className="checkout-main">
        <Breadcrumbs />
        <div className="checkout-section-icon">
          <span className="bar"></span>
          <span className="icon">🛒</span>
          <h1 className="checkout-title">Checkout</h1>
        </div>
        <div className="checkout-cards-row">
          <div className="checkout-form-card">
            <CheckoutForm />
          </div>
          <div className="checkout-summary-card">
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 