export type Locale = "en" | "fr" | "es" | "pt" | "ar";

export const SUPPORTED_LOCALES: { code: Locale; label: string; dir?: "rtl" }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

type TranslationKeys = {
  // Nav
  "nav.browse": string;
  "nav.howItWorks": string;
  "nav.dashboard": string;
  "nav.signIn": string;
  "nav.signOut": string;
  "nav.getStarted": string;
  "nav.myOrders": string;
  // Hero
  "hero.title": string;
  "hero.subtitle": string;
  "hero.cta": string;
  // Products
  "products.search": string;
  "products.found": string;
  "products.noResults": string;
  "products.clearFilters": string;
  "products.bestPrice": string;
  "products.vendors": string;
  "products.buyWhatsapp": string;
  "products.compare": string;
  "products.inStock": string;
  "products.outOfStock": string;
  // Orders
  "orders.title": string;
  "orders.empty": string;
  "orders.continueShopping": string;
  "orders.contactVendor": string;
  "orders.openDispute": string;
  "orders.disputeReason": string;
  "orders.disputeDesc": string;
  "orders.submitDispute": string;
  // Auth
  "auth.welcome": string;
  "auth.createAccount": string;
  "auth.vendorRegister": string;
  "auth.signIn": string;
  "auth.signUp": string;
  "auth.vendor": string;
  "auth.checkEmail": string;
  // Common
  "common.loading": string;
  "common.save": string;
  "common.cancel": string;
  "common.from": string;
};

const translations: Record<Locale, TranslationKeys> = {
  en: {
    "nav.browse": "Browse Products",
    "nav.howItWorks": "How It Works",
    "nav.dashboard": "Dashboard",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",
    "nav.getStarted": "Get Started",
    "nav.myOrders": "My Orders",
    "hero.title": "Compare prices. Save money. Shop smarter.",
    "hero.subtitle": "Find the best deals from verified vendors across Africa and beyond.",
    "hero.cta": "Start Comparing",
    "products.search": "Search products...",
    "products.found": "products found",
    "products.noResults": "No products found",
    "products.clearFilters": "Clear Filters",
    "products.bestPrice": "Best price from",
    "products.vendors": "vendors",
    "products.buyWhatsapp": "Buy on WhatsApp",
    "products.compare": "Compare",
    "products.inStock": "In Stock",
    "products.outOfStock": "Out of Stock",
    "orders.title": "My Orders",
    "orders.empty": "No orders yet",
    "orders.continueShopping": "Continue Shopping",
    "orders.contactVendor": "Contact Vendor",
    "orders.openDispute": "Open Dispute",
    "orders.disputeReason": "Reason",
    "orders.disputeDesc": "Description",
    "orders.submitDispute": "Submit Dispute",
    "auth.welcome": "Welcome back",
    "auth.createAccount": "Create account",
    "auth.vendorRegister": "Register as Vendor",
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.vendor": "Vendor",
    "auth.checkEmail": "Check your email",
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.from": "from",
  },
  fr: {
    "nav.browse": "Parcourir les produits",
    "nav.howItWorks": "Comment ça marche",
    "nav.dashboard": "Tableau de bord",
    "nav.signIn": "Connexion",
    "nav.signOut": "Déconnexion",
    "nav.getStarted": "Commencer",
    "nav.myOrders": "Mes Commandes",
    "hero.title": "Comparez les prix. Économisez. Achetez malin.",
    "hero.subtitle": "Trouvez les meilleures offres de vendeurs vérifiés en Afrique et au-delà.",
    "hero.cta": "Commencer à comparer",
    "products.search": "Rechercher des produits...",
    "products.found": "produits trouvés",
    "products.noResults": "Aucun produit trouvé",
    "products.clearFilters": "Effacer les filtres",
    "products.bestPrice": "Meilleur prix de",
    "products.vendors": "vendeurs",
    "products.buyWhatsapp": "Acheter sur WhatsApp",
    "products.compare": "Comparer",
    "products.inStock": "En stock",
    "products.outOfStock": "Rupture de stock",
    "orders.title": "Mes Commandes",
    "orders.empty": "Aucune commande",
    "orders.continueShopping": "Continuer les achats",
    "orders.contactVendor": "Contacter le vendeur",
    "orders.openDispute": "Ouvrir un litige",
    "orders.disputeReason": "Motif",
    "orders.disputeDesc": "Description",
    "orders.submitDispute": "Soumettre le litige",
    "auth.welcome": "Bon retour",
    "auth.createAccount": "Créer un compte",
    "auth.vendorRegister": "S'inscrire comme vendeur",
    "auth.signIn": "Connexion",
    "auth.signUp": "Inscription",
    "auth.vendor": "Vendeur",
    "auth.checkEmail": "Vérifiez votre email",
    "common.loading": "Chargement...",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.from": "de",
  },
  es: {
    "nav.browse": "Ver Productos",
    "nav.howItWorks": "Cómo Funciona",
    "nav.dashboard": "Panel",
    "nav.signIn": "Iniciar Sesión",
    "nav.signOut": "Cerrar Sesión",
    "nav.getStarted": "Empezar",
    "nav.myOrders": "Mis Pedidos",
    "hero.title": "Compara precios. Ahorra dinero. Compra inteligente.",
    "hero.subtitle": "Encuentra las mejores ofertas de vendedores verificados en África y más allá.",
    "hero.cta": "Empezar a comparar",
    "products.search": "Buscar productos...",
    "products.found": "productos encontrados",
    "products.noResults": "No se encontraron productos",
    "products.clearFilters": "Limpiar filtros",
    "products.bestPrice": "Mejor precio de",
    "products.vendors": "vendedores",
    "products.buyWhatsapp": "Comprar en WhatsApp",
    "products.compare": "Comparar",
    "products.inStock": "En stock",
    "products.outOfStock": "Agotado",
    "orders.title": "Mis Pedidos",
    "orders.empty": "Sin pedidos",
    "orders.continueShopping": "Seguir comprando",
    "orders.contactVendor": "Contactar vendedor",
    "orders.openDispute": "Abrir disputa",
    "orders.disputeReason": "Motivo",
    "orders.disputeDesc": "Descripción",
    "orders.submitDispute": "Enviar disputa",
    "auth.welcome": "Bienvenido de nuevo",
    "auth.createAccount": "Crear cuenta",
    "auth.vendorRegister": "Registrarse como vendedor",
    "auth.signIn": "Iniciar Sesión",
    "auth.signUp": "Registrarse",
    "auth.vendor": "Vendedor",
    "auth.checkEmail": "Revisa tu email",
    "common.loading": "Cargando...",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.from": "de",
  },
  pt: {
    "nav.browse": "Ver Produtos",
    "nav.howItWorks": "Como Funciona",
    "nav.dashboard": "Painel",
    "nav.signIn": "Entrar",
    "nav.signOut": "Sair",
    "nav.getStarted": "Começar",
    "nav.myOrders": "Meus Pedidos",
    "hero.title": "Compare preços. Economize. Compre com inteligência.",
    "hero.subtitle": "Encontre as melhores ofertas de vendedores verificados na África e além.",
    "hero.cta": "Começar a comparar",
    "products.search": "Buscar produtos...",
    "products.found": "produtos encontrados",
    "products.noResults": "Nenhum produto encontrado",
    "products.clearFilters": "Limpar filtros",
    "products.bestPrice": "Melhor preço de",
    "products.vendors": "vendedores",
    "products.buyWhatsapp": "Comprar no WhatsApp",
    "products.compare": "Comparar",
    "products.inStock": "Em estoque",
    "products.outOfStock": "Esgotado",
    "orders.title": "Meus Pedidos",
    "orders.empty": "Sem pedidos",
    "orders.continueShopping": "Continuar comprando",
    "orders.contactVendor": "Contatar vendedor",
    "orders.openDispute": "Abrir disputa",
    "orders.disputeReason": "Motivo",
    "orders.disputeDesc": "Descrição",
    "orders.submitDispute": "Enviar disputa",
    "auth.welcome": "Bem-vindo de volta",
    "auth.createAccount": "Criar conta",
    "auth.vendorRegister": "Registrar como vendedor",
    "auth.signIn": "Entrar",
    "auth.signUp": "Registrar",
    "auth.vendor": "Vendedor",
    "auth.checkEmail": "Verifique seu email",
    "common.loading": "Carregando...",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.from": "de",
  },
  ar: {
    "nav.browse": "تصفح المنتجات",
    "nav.howItWorks": "كيف يعمل",
    "nav.dashboard": "لوحة التحكم",
    "nav.signIn": "تسجيل الدخول",
    "nav.signOut": "تسجيل الخروج",
    "nav.getStarted": "ابدأ الآن",
    "nav.myOrders": "طلباتي",
    "hero.title": "قارن الأسعار. وفّر المال. تسوّق بذكاء.",
    "hero.subtitle": "اعثر على أفضل العروض من بائعين موثوقين في أفريقيا وحول العالم.",
    "hero.cta": "ابدأ المقارنة",
    "products.search": "ابحث عن منتجات...",
    "products.found": "منتجات موجودة",
    "products.noResults": "لا توجد منتجات",
    "products.clearFilters": "مسح الفلاتر",
    "products.bestPrice": "أفضل سعر من",
    "products.vendors": "بائعين",
    "products.buyWhatsapp": "شراء عبر واتساب",
    "products.compare": "قارن",
    "products.inStock": "متوفر",
    "products.outOfStock": "غير متوفر",
    "orders.title": "طلباتي",
    "orders.empty": "لا توجد طلبات",
    "orders.continueShopping": "متابعة التسوق",
    "orders.contactVendor": "التواصل مع البائع",
    "orders.openDispute": "فتح نزاع",
    "orders.disputeReason": "السبب",
    "orders.disputeDesc": "الوصف",
    "orders.submitDispute": "إرسال النزاع",
    "auth.welcome": "مرحباً بعودتك",
    "auth.createAccount": "إنشاء حساب",
    "auth.vendorRegister": "التسجيل كبائع",
    "auth.signIn": "تسجيل الدخول",
    "auth.signUp": "إنشاء حساب",
    "auth.vendor": "بائع",
    "auth.checkEmail": "تحقق من بريدك",
    "common.loading": "جاري التحميل...",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.from": "من",
  },
};

export default translations;
