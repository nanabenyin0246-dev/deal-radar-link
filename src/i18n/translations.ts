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
  "hero.badge": string;
  "hero.titleStart": string;
  "hero.titleHighlight": string;
  "hero.titleEnd": string;
  "hero.subtitle": string;
  "hero.searchPlaceholder": string;
  "hero.cta": string;
  "hero.popular": string;
  "hero.statProducts": string;
  "hero.statVendors": string;
  "hero.statCountries": string;
  "hero.statFee": string;
  // Banner
  "banner.foundingVendor": string;
  "banner.foundingVendorSub": string;
  // HowItWorks
  "howItWorks.title": string;
  "howItWorks.subtitle": string;
  "howItWorks.step1Title": string;
  "howItWorks.step1Desc": string;
  "howItWorks.step2Title": string;
  "howItWorks.step2Desc": string;
  "howItWorks.step3Title": string;
  "howItWorks.step3Desc": string;
  "howItWorks.feature1Title": string;
  "howItWorks.feature1Desc": string;
  "howItWorks.feature2Title": string;
  "howItWorks.feature2Desc": string;
  "howItWorks.feature3Title": string;
  "howItWorks.feature3Desc": string;
  // Footer
  "footer.tagline": string;
  "footer.platform": string;
  "footer.browseProducts": string;
  "footer.forVendors": string;
  "footer.company": string;
  "footer.about": string;
  "footer.contact": string;
  "footer.legal": string;
  "footer.terms": string;
  "footer.privacy": string;
  "footer.vendorAgreement": string;
  "footer.copyright": string;
  "footer.madeIn": string;
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
  // ProductDetail
  "detail.description": string;
  "detail.compareVendors": string;
  "detail.lowest": string;
  "detail.payOnline": string;
  "detail.pay": string;
  "detail.buy": string;
  "detail.vendor": string;
  "detail.price": string;
  "detail.trust": string;
  "detail.shipping": string;
  "detail.stock": string;
  "detail.action": string;
  "detail.days": string;
  "detail.notFound": string;
  "detail.notFoundDesc": string;
  "detail.reviews": string;
  "detail.home": string;
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
    "hero.badge": "AI-Powered Price Comparison Across Africa & Beyond",
    "hero.titleStart": "Find the ",
    "hero.titleHighlight": "Best Prices",
    "hero.titleEnd": " from Trusted Vendors",
    "hero.subtitle": "Compare prices from thousands of vendors across Africa. Buy instantly via WhatsApp. Save money on every purchase.",
    "hero.searchPlaceholder": "Search for any product...",
    "hero.cta": "Compare Prices",
    "hero.popular": "Popular:",
    "hero.statProducts": "Products",
    "hero.statVendors": "Vendors",
    "hero.statCountries": "Countries",
    "hero.statFee": "Platform Fee",
    "banner.foundingVendor": "🎉 Founding Vendor Program – 0% Commission Until 1,000 Users",
    "banner.foundingVendorSub": "You keep 100% of revenue! Commission activates at 3% once we reach 1,000 registered users.",
    "howItWorks.title": "How It Works",
    "howItWorks.subtitle": "Three simple steps to find the best deals anywhere",
    "howItWorks.step1Title": "Search Any Product",
    "howItWorks.step1Desc": "Type what you're looking for. Our AI finds matching products from thousands of vendors.",
    "howItWorks.step2Title": "Compare Best Prices",
    "howItWorks.step2Desc": "See prices from multiple vendors side-by-side, sorted by the cheapest option.",
    "howItWorks.step3Title": "Buy via WhatsApp",
    "howItWorks.step3Desc": "Tap 'Buy on WhatsApp' to chat directly with the vendor and complete your purchase.",
    "howItWorks.feature1Title": "Verified Vendors",
    "howItWorks.feature1Desc": "Trusted sellers with ratings and reviews",
    "howItWorks.feature2Title": "Multi-Country",
    "howItWorks.feature2Desc": "Compare prices across Africa and beyond",
    "howItWorks.feature3Title": "AI-Powered",
    "howItWorks.feature3Desc": "Smart matching finds the best deals for you",
    "footer.tagline": "AI-powered price comparison across Africa and beyond.",
    "footer.platform": "Platform",
    "footer.browseProducts": "Browse Products",
    "footer.forVendors": "For Vendors",
    "footer.company": "Company",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.legal": "Legal",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",
    "footer.vendorAgreement": "Vendor Agreement",
    "footer.copyright": "© 2026 RobCompare. All rights reserved.",
    "footer.madeIn": "🇬🇭 Made in Ghana",
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
    "detail.description": "Description",
    "detail.compareVendors": "Compare {count} Vendor{plural}",
    "detail.lowest": "Lowest",
    "detail.payOnline": "Pay Online",
    "detail.pay": "Pay",
    "detail.buy": "Buy",
    "detail.vendor": "Vendor",
    "detail.price": "Price",
    "detail.trust": "Trust",
    "detail.shipping": "Shipping",
    "detail.stock": "Stock",
    "detail.action": "Action",
    "detail.days": "days",
    "detail.notFound": "Product not found",
    "detail.notFoundDesc": "This product may have been removed or doesn't exist.",
    "detail.reviews": "reviews",
    "detail.home": "Home",
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
    "hero.badge": "Comparaison de prix par IA en Afrique et au-delà",
    "hero.titleStart": "Trouvez les ",
    "hero.titleHighlight": "Meilleurs Prix",
    "hero.titleEnd": " auprès de Vendeurs de Confiance",
    "hero.subtitle": "Comparez les prix de milliers de vendeurs en Afrique. Achetez instantanément via WhatsApp. Économisez sur chaque achat.",
    "hero.searchPlaceholder": "Rechercher un produit...",
    "hero.cta": "Comparer les Prix",
    "hero.popular": "Populaire :",
    "hero.statProducts": "Produits",
    "hero.statVendors": "Vendeurs",
    "hero.statCountries": "Pays",
    "hero.statFee": "Frais",
    "banner.foundingVendor": "🎉 Programme Vendeur Fondateur – 0% de Commission Jusqu'à 1 000 Utilisateurs",
    "banner.foundingVendorSub": "Gardez 100% de vos revenus ! La commission de 3% s'active quand nous atteignons 1 000 utilisateurs.",
    "howItWorks.title": "Comment ça marche",
    "howItWorks.subtitle": "Trois étapes simples pour trouver les meilleures offres",
    "howItWorks.step1Title": "Cherchez un Produit",
    "howItWorks.step1Desc": "Tapez ce que vous cherchez. Notre IA trouve des produits de milliers de vendeurs.",
    "howItWorks.step2Title": "Comparez les Prix",
    "howItWorks.step2Desc": "Voyez les prix de plusieurs vendeurs côte à côte, triés par le moins cher.",
    "howItWorks.step3Title": "Achetez via WhatsApp",
    "howItWorks.step3Desc": "Cliquez sur 'Acheter sur WhatsApp' pour discuter directement avec le vendeur.",
    "howItWorks.feature1Title": "Vendeurs Vérifiés",
    "howItWorks.feature1Desc": "Vendeurs de confiance avec notes et avis",
    "howItWorks.feature2Title": "Multi-Pays",
    "howItWorks.feature2Desc": "Comparez les prix en Afrique et au-delà",
    "howItWorks.feature3Title": "Propulsé par l'IA",
    "howItWorks.feature3Desc": "L'IA trouve les meilleures offres pour vous",
    "footer.tagline": "Comparaison de prix par IA en Afrique et au-delà.",
    "footer.platform": "Plateforme",
    "footer.browseProducts": "Parcourir les Produits",
    "footer.forVendors": "Pour les Vendeurs",
    "footer.company": "Entreprise",
    "footer.about": "À propos",
    "footer.contact": "Contact",
    "footer.legal": "Juridique",
    "footer.terms": "Conditions d'utilisation",
    "footer.privacy": "Politique de confidentialité",
    "footer.vendorAgreement": "Accord Vendeur",
    "footer.copyright": "© 2026 RobCompare. Tous droits réservés.",
    "footer.madeIn": "🇬🇭 Fait au Ghana",
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
    "detail.description": "Description",
    "detail.compareVendors": "Comparer {count} Vendeur{plural}",
    "detail.lowest": "Le moins cher",
    "detail.payOnline": "Payer en ligne",
    "detail.pay": "Payer",
    "detail.buy": "Acheter",
    "detail.vendor": "Vendeur",
    "detail.price": "Prix",
    "detail.trust": "Confiance",
    "detail.shipping": "Livraison",
    "detail.stock": "Stock",
    "detail.action": "Action",
    "detail.days": "jours",
    "detail.notFound": "Produit introuvable",
    "detail.notFoundDesc": "Ce produit a peut-être été supprimé ou n'existe pas.",
    "detail.reviews": "avis",
    "detail.home": "Accueil",
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
    "hero.badge": "Comparación de precios con IA en África y más allá",
    "hero.titleStart": "Encuentra los ",
    "hero.titleHighlight": "Mejores Precios",
    "hero.titleEnd": " de Vendedores Confiables",
    "hero.subtitle": "Compara precios de miles de vendedores en África. Compra al instante por WhatsApp. Ahorra en cada compra.",
    "hero.searchPlaceholder": "Buscar un producto...",
    "hero.cta": "Comparar Precios",
    "hero.popular": "Popular:",
    "hero.statProducts": "Productos",
    "hero.statVendors": "Vendedores",
    "hero.statCountries": "Países",
    "hero.statFee": "Tarifa",
    "banner.foundingVendor": "🎉 Programa Vendedor Fundador – 0% Comisión Hasta 1.000 Usuarios",
    "banner.foundingVendorSub": "¡Quédate con el 100% de tus ingresos! La comisión del 3% se activa al alcanzar 1.000 usuarios.",
    "howItWorks.title": "Cómo Funciona",
    "howItWorks.subtitle": "Tres pasos sencillos para encontrar las mejores ofertas",
    "howItWorks.step1Title": "Busca Cualquier Producto",
    "howItWorks.step1Desc": "Escribe lo que buscas. Nuestra IA encuentra productos de miles de vendedores.",
    "howItWorks.step2Title": "Compara los Mejores Precios",
    "howItWorks.step2Desc": "Ve precios de varios vendedores lado a lado, ordenados por el más barato.",
    "howItWorks.step3Title": "Compra por WhatsApp",
    "howItWorks.step3Desc": "Haz clic en 'Comprar en WhatsApp' para chatear directamente con el vendedor.",
    "howItWorks.feature1Title": "Vendedores Verificados",
    "howItWorks.feature1Desc": "Vendedores de confianza con calificaciones y reseñas",
    "howItWorks.feature2Title": "Multi-País",
    "howItWorks.feature2Desc": "Compara precios en África y más allá",
    "howItWorks.feature3Title": "Impulsado por IA",
    "howItWorks.feature3Desc": "La IA encuentra las mejores ofertas para ti",
    "footer.tagline": "Comparación de precios con IA en África y más allá.",
    "footer.platform": "Plataforma",
    "footer.browseProducts": "Ver Productos",
    "footer.forVendors": "Para Vendedores",
    "footer.company": "Empresa",
    "footer.about": "Acerca de",
    "footer.contact": "Contacto",
    "footer.legal": "Legal",
    "footer.terms": "Términos de Servicio",
    "footer.privacy": "Política de Privacidad",
    "footer.vendorAgreement": "Acuerdo de Vendedor",
    "footer.copyright": "© 2026 RobCompare. Todos los derechos reservados.",
    "footer.madeIn": "🇬🇭 Hecho en Ghana",
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
    "detail.description": "Descripción",
    "detail.compareVendors": "Comparar {count} Vendedor{plural}",
    "detail.lowest": "Más bajo",
    "detail.payOnline": "Pagar en línea",
    "detail.pay": "Pagar",
    "detail.buy": "Comprar",
    "detail.vendor": "Vendedor",
    "detail.price": "Precio",
    "detail.trust": "Confianza",
    "detail.shipping": "Envío",
    "detail.stock": "Stock",
    "detail.action": "Acción",
    "detail.days": "días",
    "detail.notFound": "Producto no encontrado",
    "detail.notFoundDesc": "Este producto puede haber sido eliminado o no existe.",
    "detail.reviews": "reseñas",
    "detail.home": "Inicio",
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
    "hero.badge": "Comparação de preços com IA na África e além",
    "hero.titleStart": "Encontre os ",
    "hero.titleHighlight": "Melhores Preços",
    "hero.titleEnd": " de Vendedores Confiáveis",
    "hero.subtitle": "Compare preços de milhares de vendedores na África. Compre instantaneamente via WhatsApp. Economize em cada compra.",
    "hero.searchPlaceholder": "Buscar um produto...",
    "hero.cta": "Comparar Preços",
    "hero.popular": "Popular:",
    "hero.statProducts": "Produtos",
    "hero.statVendors": "Vendedores",
    "hero.statCountries": "Países",
    "hero.statFee": "Taxa",
    "banner.foundingVendor": "🎉 Programa Vendedor Fundador – 0% Comissão Até 1.000 Usuários",
    "banner.foundingVendorSub": "Fique com 100% da receita! A comissão de 3% é ativada quando atingirmos 1.000 usuários.",
    "howItWorks.title": "Como Funciona",
    "howItWorks.subtitle": "Três passos simples para encontrar as melhores ofertas",
    "howItWorks.step1Title": "Busque Qualquer Produto",
    "howItWorks.step1Desc": "Digite o que procura. Nossa IA encontra produtos de milhares de vendedores.",
    "howItWorks.step2Title": "Compare os Melhores Preços",
    "howItWorks.step2Desc": "Veja preços de vários vendedores lado a lado, ordenados pelo mais barato.",
    "howItWorks.step3Title": "Compre via WhatsApp",
    "howItWorks.step3Desc": "Clique em 'Comprar no WhatsApp' para conversar diretamente com o vendedor.",
    "howItWorks.feature1Title": "Vendedores Verificados",
    "howItWorks.feature1Desc": "Vendedores confiáveis com avaliações e reviews",
    "howItWorks.feature2Title": "Multi-País",
    "howItWorks.feature2Desc": "Compare preços na África e além",
    "howItWorks.feature3Title": "Impulsionado por IA",
    "howItWorks.feature3Desc": "A IA encontra as melhores ofertas para você",
    "footer.tagline": "Comparação de preços com IA na África e além.",
    "footer.platform": "Plataforma",
    "footer.browseProducts": "Ver Produtos",
    "footer.forVendors": "Para Vendedores",
    "footer.company": "Empresa",
    "footer.about": "Sobre",
    "footer.contact": "Contato",
    "footer.legal": "Legal",
    "footer.terms": "Termos de Serviço",
    "footer.privacy": "Política de Privacidade",
    "footer.vendorAgreement": "Acordo de Vendedor",
    "footer.copyright": "© 2026 RobCompare. Todos os direitos reservados.",
    "footer.madeIn": "🇬🇭 Feito em Gana",
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
    "detail.description": "Descrição",
    "detail.compareVendors": "Comparar {count} Vendedor{plural}",
    "detail.lowest": "Mais baixo",
    "detail.payOnline": "Pagar online",
    "detail.pay": "Pagar",
    "detail.buy": "Comprar",
    "detail.vendor": "Vendedor",
    "detail.price": "Preço",
    "detail.trust": "Confiança",
    "detail.shipping": "Envio",
    "detail.stock": "Estoque",
    "detail.action": "Ação",
    "detail.days": "dias",
    "detail.notFound": "Produto não encontrado",
    "detail.notFoundDesc": "Este produto pode ter sido removido ou não existe.",
    "detail.reviews": "avaliações",
    "detail.home": "Início",
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
    "hero.badge": "مقارنة أسعار بالذكاء الاصطناعي في أفريقيا وحول العالم",
    "hero.titleStart": "اعثر على ",
    "hero.titleHighlight": "أفضل الأسعار",
    "hero.titleEnd": " من بائعين موثوقين",
    "hero.subtitle": "قارن أسعار الآلاف من البائعين في أفريقيا. اشترِ فوراً عبر واتساب. وفّر في كل عملية شراء.",
    "hero.searchPlaceholder": "ابحث عن منتج...",
    "hero.cta": "قارن الأسعار",
    "hero.popular": "الأكثر بحثاً:",
    "hero.statProducts": "منتجات",
    "hero.statVendors": "بائعين",
    "hero.statCountries": "دول",
    "hero.statFee": "رسوم",
    "banner.foundingVendor": "🎉 برنامج البائع المؤسس – 0% عمولة حتى 1,000 مستخدم",
    "banner.foundingVendorSub": "احتفظ بـ 100% من إيراداتك! تبدأ العمولة بنسبة 3% عند وصولنا إلى 1,000 مستخدم.",
    "howItWorks.title": "كيف يعمل",
    "howItWorks.subtitle": "ثلاث خطوات بسيطة للعثور على أفضل العروض",
    "howItWorks.step1Title": "ابحث عن أي منتج",
    "howItWorks.step1Desc": "اكتب ما تبحث عنه. الذكاء الاصطناعي يجد منتجات من آلاف البائعين.",
    "howItWorks.step2Title": "قارن أفضل الأسعار",
    "howItWorks.step2Desc": "شاهد أسعار عدة بائعين جنباً إلى جنب، مرتبة من الأرخص.",
    "howItWorks.step3Title": "اشترِ عبر واتساب",
    "howItWorks.step3Desc": "انقر على 'شراء عبر واتساب' للتحدث مباشرة مع البائع.",
    "howItWorks.feature1Title": "بائعون موثوقون",
    "howItWorks.feature1Desc": "بائعون موثوقون مع تقييمات ومراجعات",
    "howItWorks.feature2Title": "متعدد الدول",
    "howItWorks.feature2Desc": "قارن الأسعار في أفريقيا وحول العالم",
    "howItWorks.feature3Title": "مدعوم بالذكاء الاصطناعي",
    "howItWorks.feature3Desc": "الذكاء الاصطناعي يجد أفضل العروض لك",
    "footer.tagline": "مقارنة أسعار بالذكاء الاصطناعي في أفريقيا وحول العالم.",
    "footer.platform": "المنصة",
    "footer.browseProducts": "تصفح المنتجات",
    "footer.forVendors": "للبائعين",
    "footer.company": "الشركة",
    "footer.about": "عن الموقع",
    "footer.contact": "اتصل بنا",
    "footer.legal": "قانوني",
    "footer.terms": "شروط الخدمة",
    "footer.privacy": "سياسة الخصوصية",
    "footer.vendorAgreement": "اتفاقية البائع",
    "footer.copyright": "© 2026 RobCompare. جميع الحقوق محفوظة.",
    "footer.madeIn": "🇬🇭 صنع في غانا",
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
    "detail.description": "الوصف",
    "detail.compareVendors": "مقارنة {count} بائع{plural}",
    "detail.lowest": "الأقل",
    "detail.payOnline": "ادفع عبر الإنترنت",
    "detail.pay": "ادفع",
    "detail.buy": "اشترِ",
    "detail.vendor": "البائع",
    "detail.price": "السعر",
    "detail.trust": "الثقة",
    "detail.shipping": "الشحن",
    "detail.stock": "المخزون",
    "detail.action": "الإجراء",
    "detail.days": "أيام",
    "detail.notFound": "المنتج غير موجود",
    "detail.notFoundDesc": "ربما تم حذف هذا المنتج أو أنه غير موجود.",
    "detail.reviews": "تقييمات",
    "detail.home": "الرئيسية",
    "common.loading": "جاري التحميل...",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.from": "من",
  },
};

export default translations;
