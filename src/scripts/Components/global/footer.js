import "../../../styles/footer.css";

export function createFooter() {
  return `
      <footer class="main-footer">
        <div class="footer-content">
          <div class="footer-section about">
            <h2>About Us</h2>
            <p>Discover the ease of managing your supply chain with CGL's comprehensive logistics services.</p>
          </div>
          <div class="footer-section links">
            <h2>Quick Links</h2>
            <ul class="quick-links--list">
              <li><a href="/home">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section contact">
            <h2>Contact Us</h2>
            <p><u>Email:</u> Cindy@CanadianGlobalLogistics.ca</p>
            
          </div>
          <div class="footer-section social">
            <h2>Follow Us</h2>
            <div class="social-icons">
              <a href="#"><img src="../assets/images/icons/fb-1.png" alt="Facebook">Facebook</a>
              <a href="#"><img src="../assets/images/icons/twitter-1.png" alt="Twitter">Twitter</a>
              <a href="#"><img src="../assets/images/icons/ig-1.png" alt="Instagram">Instagram</a>
              <a href="#"><img src="../assets/images/icons/li-1.png" alt="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>2024 Canadian Global Logistics Inc. <sup>®</sup></p>
        </div>
      </footer>
    `;
}
