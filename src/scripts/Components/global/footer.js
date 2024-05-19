import "../../../styles/footer.css";

export function createFooter() {
  return `
      <footer class="main-footer">
        <div class="footer-content">
          <div class="footer-section about">
            <h2>About Us</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br> Quisque fermentum, quam vel venenatis.</p>
          </div>
          <div class="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section contact">
            <h2>Contact Us</h2>
            <p>Email: info@example.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div class="footer-section social">
            <h2>Follow Us</h2>
            <div class="social-icons">
              <a href="#"><img src="/assets/icons/facebook.svg" alt="Facebook"></a>
              <a href="#"><img src="/assets/icons/twitter.svg" alt="Twitter"></a>
              <a href="#"><img src="/assets/icons/instagram.svg" alt="Instagram"></a>
              <a href="#"><img src="/assets/icons/linkedin.svg" alt="LinkedIn"></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </footer>
    `;
}
