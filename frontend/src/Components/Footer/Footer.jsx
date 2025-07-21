import React from 'react';
import './Footer.css';
import fbIcon from '../../Assets/fb.png';
import instaIcon from '../../Assets/insta.png';
import tutorIcon from '../../Assets/tutor.png';
import linkIcon from '../../Assets/link.png';

import card1 from '../../Assets/1.png';
import card2 from '../../Assets/2.png';
import card3 from '../../Assets/3.png';
import card4 from '../../Assets/4.png';
import card5 from '../../Assets/5.png';

const Footer = () => {
  return (
    <footer className="footer-container">
      
      <div className="footer-content">
          <div className="footer-left">
            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-list">
                <li><a href="#">Fashion</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">Works</a></li>
                <li><a href="#">Career</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Help</h4>
              <ul className="footer-list">
                <li><a href="#"><span className="no-wrap">Customer Support</span></a></li>
                <li><a href="#"><span className="no-wrap">Term & Conditions</span></a></li>
                <li><a href="#">Delivery details</a></li>
                <li><a href="#">Privacy policy</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">FAQs</h4>
              <ul className="footer-list">
                <li><a href="#">Accounts</a></li>
                <li><a href="#">Orders</a></li>
                <li><a href="#">Payments</a></li>
                <li><a href="#">Delivery</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-right">
            <p className="subscribe-title">SIGN UP FOR LAURA’S CLOSET STYLE NEWS</p>
            <div className="subscribe-box">
              <input type="email" placeholder="Your email" className="email-input" />
              <button className="subscribe-button">SUBSCRIBE</button>
            </div>
            <p className="privacy-text">
              By clicking the SUBSCRIBE button, you are agreeing to our <a href="#">Privacy & Cookie Policy</a>
            </p>
          </div>
        </div>

        <div className="footer-socials">
          <img src={fbIcon} alt="Facebook" />
          <img src={instaIcon} alt="Instagram" />
          <img src={tutorIcon} alt="Twitter" />
          <img src={linkIcon} alt="LinkedIn" />
        </div>

        <hr className="footer-line" />

        <div className="footer-bottom">
          <p className="footer-copy">Houseofsalga © 2025, All Rights Reserved</p>
          <div className="footer-payments">
            <img src={card1} alt="payment1" />
            <img src={card2} alt="payment2" />
            <img src={card3} alt="payment3" />
            <img src={card4} alt="payment4" />
            <img src={card5} alt="payment5" />
          </div>
      </div>
    </footer>
  );
};

export default Footer;