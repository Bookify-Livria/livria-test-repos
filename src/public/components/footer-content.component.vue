<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import facebookIcon from "../../assets/images/icons/Facebook.svg";
import instagramIcon from "../../assets/images/icons/Instagram.svg";
import twitterIcon from "../../assets/images/icons/Twitter.svg";
import linkedinIcon from "../../assets/images/icons/Linkedin.svg";

export default {
  name: "footer-content" ,
  components: {
    LanguageSwitcher,
    facebookIcon,
    instagramIcon,
    twitterIcon,
    linkedinIcon,
  }
}
</script>

<template>

  <footer class="footer">
    <div class="color-bar">
      <div class="color-bar__section color-bar__section--orange"></div>
      <div class="color-bar__section color-bar__section--yellow"></div>
      <div class="color-bar__section color-bar__section--light-yellow"></div>
      <div class="color-bar__section color-bar__section--dark-blue"></div>
      <div class="color-bar__section color-bar__section--light"></div>
      <div class="color-bar__section color-bar__section--teal"></div>
      <div class="color-bar__section color-bar__section--blue"></div>
    </div>

    <div class="footer__container">
      <div class="footer__columns">
        <div class="footer__column">
          <div class="footer__logo">
            <img src="../../assets/images/logo/logo.png" alt="livria_logo">
          </div>
          <p class="footer__description">{{ $t('phrase') }}</p>
          <div class="footer__social">
            <a href="#" class="footer__social-link" aria-label="Facebook">
              <facebookIcon class="footer-icon" />
            </a>
            <a href="#" class="footer__social-link" aria-label="Twitter">
              <instagramIcon class="footer-icon" />
            </a>
            <a href="#" class="footer__social-link" aria-label="Instagram">
              <twitterIcon class="footer-icon" />
            </a>
            <a href="#" class="footer__social-link" aria-label="LinkedIn">
              <linkedinIcon class="footer-icon" />
            </a>
          </div>
        </div>

        <div class="footer__column">
          <h3 class="footer__heading">{{ $t('navigation') }}</h3>
          <ul class="footer__links">
            <li><router-link to="/home" class="footer__link">{{ $t('home') }}</router-link></li>
            <li><router-link to="" class="footer__link">{{ $t('recommendations') }}</router-link></li>
            <li><router-link to="/communities" class="footer__link">{{ $t('communities') }}</router-link></li>
            <li><router-link to="" class="footer__link">{{ $t('shop') }}</router-link></li>
          </ul>
        </div>

        <div class="footer__column">
          <h3 class="footer__heading">{{ $t('legal') }}</h3>
          <ul class="footer__links">
            <li><a href="#" class="footer__link">{{ $t('terms-conditions') }}</a></li>
            <li><a href="#" class="footer__link">{{ $t('privacy-policy') }}</a></li>
            <li><a href="#" class="footer__link">{{ $t('cookies-policy') }}</a></li>
            <li><a href="#" class="footer__link">{{ $t('complaints-book') }}</a></li>
          </ul>
        </div>

        <div class="footer__column">
          <h3 class="footer__heading">{{ $t('support') }}</h3>
          <ul class="footer__links">
            <li><a href="#" class="footer__link">{{ $t('help') }}</a></li>
            <li><a href="#" class="footer__link">{{ $t('frequent-questions') }}</a></li>
            <li><a href="#" class="footer__link">{{ $t('contact-us') }}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">{{ $t('copyrights') }}</p>
        <language-switcher/>
      </div>
    </div>
  </footer>

</template>

<style scoped>
.footer {
  background-color: var(--color-light);
  width: 100vw;
  padding-bottom: 30px;
  margin: 0;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 0;
}

.footer__columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 40px;
}

.footer__column {
  flex: 1;
  min-width: 200px;
  padding: 0 2rem;
}

.footer__logo {
  display: flex;
  align-items: center;
}

.footer__logo img {
  width: auto;
  height: 30px;
  margin-top: 2rem;
}

.footer__description {
  color: var(--color-text);
  font-size: 14px;
  text-align: left;
  margin-top: 2rem;
}

.footer__social {
  display: flex;
  gap: 15px;
  margin-top: 2rem;
}

.footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-light);
  color: var(--color-blue);
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer__social-link:hover {
  background-color: var(--color-secondary);
  color: white;
  transform: translateY(-3px);
}

.footer__heading {
  font-family: var(--font-heading);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 22px;
  font-weight: 600;
  color: var(--color-accent-orange);
  margin-bottom: 20px;
}

.footer__links {
  list-style: none;
  padding: 0;
}

.footer__link {
  display: block;
  color: var(--color-blue);
  text-decoration: none;
  text-align: left;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.footer__link:hover {
  color: var(--color-accent-yellow);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.footer__copyright {
  color: var(--color-text);
  font-size: 14px;
}


</style>