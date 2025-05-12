<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import CartDrawer from "../../cart/components/cart-drawer.component.vue"

//icons
import cartIcon from "../../assets/images/icons/Shop_kart.svg";
import locationIcon from "../../assets/images/icons/Location.svg";
import bellIcon from "../../assets/images/icons/Bell.svg";
import userIcon from "../../assets/images/icons/User_alt.svg";
import crownIcon from "../../assets/images/icons/Crown.svg";
import searchIcon from "../../assets/images/icons/Search_alt.svg";

export default {
  name: "Toolbar.component",
  components: {
    LanguageSwitcher,
    CartDrawer,
    cartIcon,
    locationIcon,
    bellIcon,
    userIcon,
    crownIcon,
    searchIcon,
  },
  data() {
    return {
      value1: "",
      isCartActive: false
    }
  },
  methods: {
    openCart() {
      this.isCartActive = true
      this.$refs.cartDrawerRef.toggleDrawer()
    },
    updateCartVisibility(val) {
      console.log('Drawer visible?', val)
      this.isCartActive = val
    },
    performSearch() {
      if (this.value1.trim()) {
        this.$router.push({name: 'BookSearch', query: {q: this.value1}});
        this.value1 = "";
      }
    }
  }
}
</script>

<template>

  <div class="header-wrapper">
    <pv-toolbar class="header">
      <template #start>
        <router-link to="/home"><img alt="livria_logo" class="header__logo" src="../../assets/images/logo/logo.png"/></router-link>
      </template>

      <template #center>
        <div class="search-bar">
          <pv-icon-field>
            <pv-input-icon><searchIcon class="nav-icon" /></pv-input-icon>
            <input
                v-model="value1"
                :placeholder="$t('toolbar.search')"
                @keyup.enter="performSearch"
            />          </pv-icon-field>
        </div>
      </template>

      <template #end>
        <nav class="header__nav" aria-label="Main Navigation">
          <ul class="header__nav-list">
            <li class="header__nav-item">
              <pv-button @click="openCart" :class="['header__nav-link', { active: isCartActive }]"><cartIcon class="nav-icon" />{{ $t('cart-toolbar') }}</pv-button>
              <CartDrawer ref="cartDrawerRef" @visibility-change="updateCartVisibility" />
            </li>
            <li class="header__nav-item">
              <router-link to="/nofuncatodav" class="header__nav-link" exact exact-active-class="active"><locationIcon class="nav-icon"/>{{ $t('shop') }}</router-link>
            </li>
            <li class="header__nav-item">
              <router-link to="/nofuncatodav" class="header__nav-link" exact exact-active-class="active"><bellIcon class="nav-icon"/>{{ $t('toolbar.notifications') }}</router-link>
            </li>
            <li class="header__nav-item">
              <router-link to="/account" class="header__nav-link" exact exact-active-class="active"><userIcon class="nav-icon"/>{{ $t('toolbar.account') }}</router-link>
            </li>
            <li class="header__nav-item">
              <language-switcher/>
            </li>
          </ul>
        </nav>
      </template>
    </pv-toolbar>

    <div class="color-bar">
      <div class="color-bar__section color-bar__section--orange"></div>
      <div class="color-bar__section color-bar__section--yellow"></div>
      <div class="color-bar__section color-bar__section--light-yellow"></div>
      <div class="color-bar__section color-bar__section--dark-blue"></div>
      <div class="color-bar__section color-bar__section--light"></div>
      <div class="color-bar__section color-bar__section--teal"></div>
      <div class="color-bar__section color-bar__section--blue"></div>
    </div>

    <div class="header">
      <div class="header__nav-subitem"><router-link to="/recommendations" class="header__nav-link go--orange">{{ $t('recommendations') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/bookl" class="header__nav-link go--orange">{{ $t('literature') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/booknf" class="header__nav-link go--orange">{{ $t('non-fiction') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/bookf" class="header__nav-link go--yellow">{{ $t('fiction') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/bookmc" class="header__nav-link go--yellow">{{ $t('mangas-comics') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/bookj" class="header__nav-link go--yellow">{{ $t('juvenile') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/bookc" class="header__nav-link go--blue">{{ $t('children') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/bookea" class="header__nav-link go--blue">{{ $t('ebooks-audiobooks') }}</router-link></div>
      <div class="header__nav-subitem"><router-link to="/communities" class="header__nav-link go--blue"><crownIcon class="nav-icon"/>{{ $t('communities') }}</router-link></div>
    </div>

  </div>

</template>

<style scoped>
/* Header Styles*/
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--color-background);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
}

.header__logo {
  width: auto;
  height: 30px;
}

.header__nav {
  margin-left: auto;
}

.header__nav-list {
  display: flex;
  list-style: none;
  gap: 40px;
  color: var(--color-text);
}

.header__nav-item,
.header__nav-subitem {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header__nav-item .header__nav-link {
  color: var(--color-text);
}

.header__nav-link {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 3px;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.header__nav .header__nav-link:hover,
.header__nav .header__nav-link.active {
  color: var(--color-accent-orange);
}

.nav-icon {
  stroke: currentColor;
  fill: none;
  overflow: visible;
  transition: fill 0.3s;
}

.header__nav-subitem {
  padding: 10px 40px;
}

.header__nav-subitem:has(.go--orange):hover {
  background-color: rgba(var(--color-accent-orange-rgb), 0.15);
  border-radius: 6px;
}

.header__nav-subitem:has(.go--yellow):hover {
  background-color: rgba(var(--color-accent-yellow-rgb), 0.15);
  border-radius: 6px;
}

.header__nav-subitem:has(.go--blue):hover {
  background-color: rgba(var(--color-blue-rgb), 0.15);
  border-radius: 6px;
}

/* Search Bar */
.search-bar {
  position: relative;
}

.search-bar input {
  border: 1px solid var(--color-accent-yellow);
  border-radius: 8px;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  font-size: 1rem;
  color: var(--color-text);
  background-color: transparent;
  outline: none;
  width: 1200px;
}

.search-bar input::placeholder {
  color: var(--color-accent-yellow);
  opacity: 0.7;
}

.search-bar input:focus {
  border-color: var(--color-accent-yellow);
}

.search-bar .nav-icon {
  color: var(--color-accent-yellow);
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}


</style>