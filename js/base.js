window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader_active");
  if (preloader) {
    preloader.style.transition = "opacity 0.6s ease";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 600);
  }
});

let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("click", activeLink));

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

function formatPrice(price) {
  if (isNaN(price)) return "Invalid price";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDateOrder(date1, date2 = null) {
  if (date2 === null) {
    return `Le ${formatDate2(date1)}`;
  } else {
    return `Entre Le ${formatDate2(date1)} et le ${formatDate2(date2)}`;
  }
}

function formatDate1(timestamp) {
  const date = new Date(timestamp);

  const optionsDate = { day: "numeric", month: "long", year: "numeric" };

  const formattedDate = date.toLocaleDateString("fr-FR", optionsDate);

  return `${formattedDate}`;
}

function formatDate2(timestamp) {
  const date = new Date(timestamp);

  const optionsDate = { day: "numeric", month: "long", year: "numeric" };
  const optionsTime = { hour: "2-digit", minute: "2-digit" };

  const formattedDate = date.toLocaleDateString("fr-FR", optionsDate);
  const formattedTime = date.toLocaleTimeString("fr-FR", optionsTime);

  return `${formattedDate} à ${formattedTime}`;
}

class Product {
  constructor(
    id,
    sales,
    qty,
    name,
    category,
    price,
    priceReduction,
    images,
    specs,
    reviews
  ) {
    this.id = id;
    this.sales = sales;
    this.qty = qty;
    this.name = name;
    this.category = category;
    this.price = price;
    this.priceReduction = priceReduction;
    this.images = images;
    this.specs = specs;
    this.reviews = reviews;
    this.reference = this.generateReference();
    this.description = this.generateDescription();
  }

  generateReference() {
    const model = this.name.split(" ")[0].toUpperCase();
    const ram = this.specs["Mémoire RAM"]
      ? this.specs["Mémoire RAM"].match(/\d+/)[0]
      : "NA";
    const storage = this.specs["Stockage"]
      ? this.specs["Stockage"].match(/\d+/)[0]
      : "NA";
    const color = this.specs["Couleur"]
      ? this.specs["Couleur"].substring(0, 2).toUpperCase()
      : "XX";

    return `${model}-${ram}-${storage}-${color}`;
  }

  generateDescription() {
    let desc = `[${this.reference}]\n`;

    for (const [key, value] of Object.entries(this.specs)) {
      desc += `- ${key} : ${value}\n`;
    }

    return desc.trim();
  }
}

const products = [
  new Product(
    0,
    100,
    10,
    "Uphone lightning cable",
    "Téléphonie & Tablette/Accessoirs/Chargeurs & cablés",
    10000,
    0,
    [
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],
    {
      "Système d'exploitation": "Windows 10",
      Processeur: "Intel Atom",
      "Réf processeur":
        "Intel Atom x5-Z8350 Quad Core, 1,44 GHz jusqu'à 1,92 GHz, 2 Mode mémoire cache",
      "Taille de mémoire": "64Go",
      Mémoire: "2 Go",
      "Disque Dur": "32 Go eMMC",
      "Carte Graphique": "Intel HD Graphics",
      "Taille Ecran": '14"',
      "Type Ecran": "Full HD",
      "Ecran Tactile": "Non",
      Réseau: "WiFi - Bluetooth",
      Caméra: "Webcam avec micro",
      // Guarantee: "1 an",
      Couleur: "Noir",
      Availability: "Available In stock",
      Access: "oui",
    },
    [
      {
        name: "Oumarou",
        date: "12/04/2024",
        rating: 1,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ben Arfa",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Arafat",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    1,
    10,
    15,
    "Smartphone Tecno Spark Go 2024",
    "Téléphonie & Tablette/Smartphone",
    65000,
    5000,
    [
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
    ],
    {
      "Double SIM": "Oui",
      Écran: 'Hole Screen 6.67" (720 x 1600 px), 120 Hz',
      Processeur: "Unisoc T615 Octa-core (12 nm)",
      "Mémoire RAM": "4 Go (+ 4 Go étendus)",
      Stockage: "128 Go",
      "Système opérateur": "Android 14 Go",
      Réseau: "4G",
      "Caméra Avant": "8 MP, double flash avant",
      "Caméra Arrière": "13 MP, double flash arrière",
      "Indice de protection": "IP54",
      "Capteur d'empreintes": "Latéral",
      Télécommande: "Infrarouge",
      Batterie: "5000mAh",
      "Charge rapide": "15 W Type C",
      Audio: "Deux haut-parleurs (Son DTS)",
      Couleur: "Vert",
      Guarantee: "1 an",
    },
    [
      {
        name: "Mohamed",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ahmed",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Abou",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    2,
    5,
    20,
    "iPhone 14 pro max",
    "Téléphonie & Tablette/Smartphone",
    250000,
    45000,

    [
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p8_523c97c7-2aa2-47e8-8b17-5a3c05a66db3_1024x1024.jpg?v=1674275335",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],

    {
      Écran: '15.6" Full HD (1920 x 1080), IPS, 144 Hz',
      Processeur:
        "Intel Core i7-13620H 13e génération (jusqu’à 4.9 GHz, 24 Mo de cache)",
      Mémoire: "8 Go DDR5",
      Stockage: "SSD NVMe M.2 512 Go",
      "Carte graphique": "NVIDIA GeForce RTX 4060, 8 Go GDDR6",
      Clavier: "Rétroéclairé simple",
      Webcam: "HD 720p",
      Audio: "2x haut-parleurs 2W, Nahimic 3 Audio Enhancer, Hi-Res Audio",
      Connectique: "2x USB 3.2, 1x USB-C 3.2, 1x HDMI 2.1",
      Réseau: "Gigabit Ethernet - Wi-Fi 6E - Bluetooth 5.3",
      Système: "FreeDos",
      Couleur: "Noir translucide",
      Guarantee: "1 an",
    },
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    3,
    100,
    10,
    "Uphone lightning cable",
    "Téléphonie & Tablette/Accessoirs/Chargeurs & cablés",
    10000,
    0,
    [
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],
    {
      "Système d'exploitation": "Windows 10",
      Processeur: "Intel Atom",
      "Réf processeur":
        "Intel Atom x5-Z8350 Quad Core, 1,44 GHz jusqu'à 1,92 GHz, 2 Mode mémoire cache",
      "Taille de mémoire": "64Go",
      Mémoire: "2 Go",
      "Disque Dur": "32 Go eMMC",
      "Carte Graphique": "Intel HD Graphics",
      "Taille Ecran": '14"',
      "Type Ecran": "Full HD",
      "Ecran Tactile": "Non",
      Réseau: "WiFi - Bluetooth",
      Caméra: "Webcam avec micro",
      Guarantee: "1 an",
      Couleur: "Noir",
      Availability: "Available In stock",
      Access: "oui",
    },
    [
      {
        name: "Oumarou",
        date: "12/04/2024",
        rating: 1,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ben Arfa",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Arafat",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    4,
    10,
    15,
    "Smartphone Tecno Spark Go 2024",
    "Téléphonie & Tablette/Smartphone",
    65000,
    5000,
    [
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
    ],
    {
      "Double SIM": "Oui",
      Écran: 'Hole Screen 6.67" (720 x 1600 px), 120 Hz',
      Processeur: "Unisoc T615 Octa-core (12 nm)",
      "Mémoire RAM": "4 Go (+ 4 Go étendus)",
      Stockage: "128 Go",
      "Système opérateur": "Android 14 Go",
      Réseau: "4G",
      "Caméra Avant": "8 MP, double flash avant",
      "Caméra Arrière": "13 MP, double flash arrière",
      "Indice de protection": "IP54",
      "Capteur d'empreintes": "Latéral",
      Télécommande: "Infrarouge",
      Batterie: "5000mAh",
      "Charge rapide": "15 W Type C",
      Audio: "Deux haut-parleurs (Son DTS)",
      Couleur: "Vert",
      Guarantee: "1 an",
    },
    [
      {
        name: "Mohamed",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ahmed",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Abou",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    5,
    5,
    20,
    "iPhone 14 pro max",
    "Téléphonie & Tablette/Smartphone",
    250000,
    45000,

    [
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p8_523c97c7-2aa2-47e8-8b17-5a3c05a66db3_1024x1024.jpg?v=1674275335",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],

    {
      Écran: '15.6" Full HD (1920 x 1080), IPS, 144 Hz',
      Processeur:
        "Intel Core i7-13620H 13e génération (jusqu’à 4.9 GHz, 24 Mo de cache)",
      Mémoire: "8 Go DDR5",
      Stockage: "SSD NVMe M.2 512 Go",
      "Carte graphique": "NVIDIA GeForce RTX 4060, 8 Go GDDR6",
      Clavier: "Rétroéclairé simple",
      Webcam: "HD 720p",
      Audio: "2x haut-parleurs 2W, Nahimic 3 Audio Enhancer, Hi-Res Audio",
      Connectique: "2x USB 3.2, 1x USB-C 3.2, 1x HDMI 2.1",
      Réseau: "Gigabit Ethernet - Wi-Fi 6E - Bluetooth 5.3",
      Système: "FreeDos",
      Couleur: "Noir translucide",
      Guarantee: "1 an",
    },
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
];

class Filters {
  constructor() {
    this.categories = [];
  }

  addCategory(category) {
    this.categories.push(category);
  }

  generateFilters() {
    return this.categories;
  }
}

class Category {
  constructor(name) {
    this.name = name;
    this.subCategories = [];
    this.options = [];
  }

  addSubCategory(subCategory) {
    this.subCategories.push(subCategory);
  }

  getSubCategory() {
    return this.subCategories;
  }

  addOption(option) {
    this.options.push(option);
  }

  getOptions() {
    return this.options;
  }
}

class Option {
  constructor(title, values = []) {
    this.title = title;
    this.values = values;
  }

  getTitle() {
    return this.title;
  }

  getValues() {
    return this.values;
  }
}

class SubCategory extends Category {}

const informatique = new Category("Informatique");

const ordinateurPortable = new SubCategory("Ordinateur Portable");
const ordinateurBureau = new SubCategory("Ordinateur Bureau");
const Iaccessoirs = new SubCategory("Accessoirs et Peripherique");

informatique.addSubCategory(ordinateurPortable);
informatique.addSubCategory(ordinateurBureau);
informatique.addSubCategory(Iaccessoirs);
// ordinateurPortable.addOption(new Option("Access", ["oui", "non"]));
// ordinateurPortable.addOption(new Option("Stockage", ["SSD", "HDD"]));
// informatique.addOption(new Option("Résolution", ["1080p", "2k", "4K"]));
// ordinateurPortable.addOption(new Option("Résolution", ["Full HD"]));

// const oP = new SubCategory("Pc Portable");
// const pc1 = new SubCategory("pc1");
// const pc2 = new SubCategory("pc2");
// const pc3 = new SubCategory("pc3");
// const pc4 = new SubCategory("pc4");
// oP.addSubCategory(pc1);
// pc1.addSubCategory(pc2);
// pc2.addSubCategory(pc3);
// pc3.addSubCategory(pc4);

// oP.addOption(new Option("Access", ["oui-non", "non-oui"]));
ordinateurPortable.addSubCategory(new SubCategory("Pc Portable"));
ordinateurPortable.addSubCategory(new SubCategory("Pc Portable Gamer"));
ordinateurPortable.addSubCategory(new SubCategory("Pc Portable Pro"));

ordinateurBureau.addSubCategory(new SubCategory("Ecran"));
ordinateurBureau.addSubCategory(new SubCategory("Pc Bureau"));
ordinateurBureau.addSubCategory(new SubCategory("Pc Bureau Gamer"));
ordinateurBureau.addSubCategory(new SubCategory("Pc Tout en Un"));

Iaccessoirs.addSubCategory(new SubCategory("Casque"));
Iaccessoirs.addSubCategory(new SubCategory("Sac à Dos"));
Iaccessoirs.addSubCategory(new SubCategory("Souris"));
Iaccessoirs.addSubCategory(new SubCategory("Claviers"));

//Telephonie & Tablette
const telephonieTablette = new Category("Téléphonie & Tablette");
const Taccessoirs = new SubCategory("Accessoirs");
telephonieTablette.addOption(new Option("Garantie", ["1ans", "2ans"]));
telephonieTablette.addOption(new Option("Couleur", ["Noir", "Rouge", "Vert"]));
telephonieTablette.addSubCategory(new SubCategory("Telephone Portable"));
const smartphone = new SubCategory("Smartphone");
smartphone.addOption(
  new Option("Écran", ['Hole Screen 6.67" (720 x 1600 px), 120 Hz'])
);
smartphone.addOption(
  new Option("Processeur", ["Unisoc T615 Octa-core (12 nm)"])
);
smartphone.addOption(new Option("Mémoire RAM", ["4 Go (+ 4 Go étendus)"]));
smartphone.addOption(new Option("Stockage", ["128 Go"]));
smartphone.addOption(new Option("Système opérateur", ["Android 14 Go"]));
smartphone.addOption(new Option("Réseau", ["4G"]));
smartphone.addOption(new Option("Caméra Avant", ["8 MP, double flash avant"]));
smartphone.addOption(
  new Option("Caméra Arrière", ["13 MP, double flash arrière"])
);
smartphone.addOption(new Option("Indice de protection", ["IP54"]));
smartphone.addOption(new Option("Capteur d'empreintes", ["Latéral"]));
smartphone.addOption(new Option("Télécommande", ["Infrarouge"]));
smartphone.addOption(new Option("Batterie", ["5000mAh"]));
smartphone.addOption(new Option("Charge rapide", ["15 W Type C"]));
smartphone.addOption(new Option("Audio", ["Deux haut-parleurs (Son DTS)"]));
telephonieTablette.addSubCategory(smartphone);
telephonieTablette.addSubCategory(new SubCategory("Telephone Fixe"));
telephonieTablette.addSubCategory(new SubCategory("Tablette tactile"));
telephonieTablette.addSubCategory(new SubCategory("Smart Watch"));
telephonieTablette.addSubCategory(Taccessoirs);

const chargeursCables = new SubCategory("Chargeurs & cablés");
chargeursCables.addOption(new Option("Interface", ["Bluetooth"]));
chargeursCables.addOption(new Option("Batterie", ["250mha", "500mha"]));
chargeursCables.addOption(new Option("Micro", ["Oui", "Non"]));
Taccessoirs.addSubCategory(new SubCategory("Protection"));
Taccessoirs.addSubCategory(chargeursCables);
Taccessoirs.addSubCategory(new SubCategory("Power Bank"));
Taccessoirs.addSubCategory(new SubCategory("Batterie"));
Taccessoirs.addSubCategory(new SubCategory("Divers"));

//Stockage
const stockage = new Category("Stockage");

stockage.addSubCategory(new SubCategory("Disque Dur internes"));
stockage.addSubCategory(new SubCategory("Disque Dur externes"));
stockage.addSubCategory(new SubCategory("Clé USB"));
stockage.addSubCategory(new SubCategory("Carte mémoire"));

// TV-Son-Console
const tvSonConsole = new Category("TV-Son-Console");
const consoles = new SubCategory("Consoles & Jeux");

tvSonConsole.addSubCategory(new SubCategory("TV"));
tvSonConsole.addSubCategory(new SubCategory("Son"));
tvSonConsole.addSubCategory(new SubCategory("Appareils Photos"));
tvSonConsole.addSubCategory(consoles);
consoles.addSubCategory(new SubCategory("Consoles"));
consoles.addSubCategory(new SubCategory("Manettes de Jeux"));
consoles.addSubCategory(new SubCategory("Disques de Jeux"));

// Sécurite
const securite = new Category("Sécurité");

securite.addSubCategory(new SubCategory("Systèmes & Logiciels Antivirus"));
securite.addSubCategory(new SubCategory("Systèmes de Sécurité"));
securite.addSubCategory(new SubCategory("Caméras"));

// Creation des filters
const filters = new Filters();
filters.addCategory(informatique);
filters.addCategory(telephonieTablette);
filters.addCategory(stockage);
filters.addCategory(tvSonConsole);
filters.addCategory(securite);

class User {
  constructor(
    id,
    email,
    addresses = [],
    currentIndex,
    role = "client",
    total = 0
  ) {
    this.id = id;
    this.email = email;
    this.addresses = addresses;
    this.currentIndex = currentIndex;
    this.role = role;
    this.total = total;
  }

  getAddresses() {
    return this.addresses;
  }

  addAddress(address) {
    this.addresses.push(address);
  }

  removeAddress(index) {
    this.addresses.splice(index, 1);
  }

  updateTotal(upPrice) {
    this.total += upPrice;
  }

  updateAddress(index, address) {
    this.addresses[index] = address;
  }
}

class Address {
  constructor(
    firstName,
    lastName,
    phoneNumber1,
    phoneNumber2,
    region,
    district,
    street
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber1 = phoneNumber1;
    this.phoneNumber2 = phoneNumber2;
    this.region = region;
    this.district = district;
    this.street = street;
  }
}

class UsersManager {
  constructor(users = []) {
    this.users = users;
  }

  addUser(user) {
    this.users.push(user);
  }

  getUserById(id) {
    return this.users.filter((u) => u.id === id);
  }

  getUsers() {
    return this.users;
  }
}

var user = new User(
  0,
  "oumaroumamodou123@gmail.com",
  [
    new Address(
      "Oumarou",
      "M1",
      "+227 98663248",
      "+227 94464839",
      "Niamey",
      "Dar es salam",
      "Pharmacy Say"
    ),
    new Address(
      "Oumarou",
      "M2",
      "+227 98663248",
      "+227 94464839",
      "Niamey",
      "Dar es salam",
      "Pharmacy Say"
    ),
    new Address(
      "Oumarou",
      "M3",
      "+227 98663248",
      "+227 94464839",
      "Niamey",
      "Dar es salam",
      "Pharmacy Say"
    ),
  ],
  0,
  "admin",
  100000000
);

var users = new UsersManager([
  new User(
    0,
    "oumaroumamodou123@gmail.com",
    [
      new Address(
        "Oumarou",
        "Mamoudou",
        "+227 98663248",
        "+227 94464839",
        "Niamey",
        "Dar es salam",
        "Pharmacy Say"
      ),
    ],
    0,
    "admin",
    1000000
  ),
  new User(
    1,
    "loukmane@gmail.com",
    [
      new Address(
        "Loukmane",
        "Goumey",
        "+227 98663248",
        "+227 94464839",
        "Niamey",
        "Dar es salam",
        "Pharmacy Say"
      ),
      new Address(
        "Louk",
        "Goumey",
        "+227 98663248",
        "+227 94464839",
        "Niamey",
        "Dar es salam",
        "Pharmacy Say"
      ),
    ],
    0,
    "client",
    2000000
  ),
  new User(
    2,
    "azima@gmail.com",
    [
      new Address(
        "Azima",
        "Goumey",
        "+227 98663248",
        "+227 94464839",
        "Niamey",
        "Dar es salam",
        "Pharmacy Say"
      ),
    ],
    0,
    "client",
    500000
  ),
  new User(
    3,
    "ben@gmail.com",
    [
      new Address(
        "Ben Arfa",
        "Balla",
        "+227 98663248",
        "+227 94464839",
        "Niamey",
        "Dar es salam",
        "Pharmacy Say"
      ),
    ],
    0,
    "client",
    25000
  ),
]);

class Justification {
  constructor(quantity, justification, justificationImage = null) {
    this.quantity = quantity;
    this.justification = justification;
    this.justificationImage = justificationImage;
  }
}

class orderItemHistory {
  constructor(
    status,
    updateAt,
    endingAt = null,
    guarantee = null,
    justification = null
  ) {
    this.status = status;
    this.updateAt = updateAt;
    this.endingAt = endingAt;
    this.guarantee = guarantee;
    this.justification = justification;
  }
}

class orderItem {
  constructor(
    productId,
    productName,
    image,
    price,
    priceReduction,
    quantity,
    history = []
  ) {
    this.productId = productId;
    this.productName = productName;
    this.image = image;
    this.price = price;
    this.priceReduction = priceReduction;
    this.quantity = quantity;
    this.history = history;
  }
}

class Order {
  constructor(
    id,
    userId,
    userEmail,
    items = [],
    shippingAddress = null,
    payment,
    totalPrice,
    deliveryPrice,
    status,
    createAt,
    updateAt
  ) {
    this.id = id;
    this.userId = userId;
    this.userEmail = userEmail;
    this.items = items;
    this.shippingAddress = shippingAddress;
    this.payment = payment;
    this.totalPrice = totalPrice;
    this.deliveryPrice = deliveryPrice;
    this.status = status;
    this.createAt = createAt;
    this.updateAt = updateAt;
  }

  getItems() {
    return this.items;
  }
}

class OrdersManager {
  constructor(orders = []) {
    this.orders = orders;
  }

  addOrder(order) {
    this.orders.push(order);
  }

  getOrderById(id) {
    return this.orders.filter((o) => o.id === id);
  }

  getOrders() {
    return this.orders;
  }
}

var ordersManager = new OrdersManager([
  new Order(
    0,
    0,
    "oumaroumamodou123@gmail.com",
    [
      new orderItem(
        0,
        "Uphone lightning cable",
        "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
        10000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "progress",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
          new orderItemHistory(
            "pending",
            Date.now() - 2 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
        ]
      ),
      new orderItem(
        1,
        "iPhone 14 pro max",
        "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
        200000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "shipping",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
        ]
      ),
      new orderItem(
        2,
        "Smartphone Tecno Spark Go 2024",
        "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
        65000,
        5000,
        2,
        [
          new orderItemHistory("pending", Date.now() - 1 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "shipping",
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ),
          new orderItemHistory(
            "progressed",
            Date.now() - 1 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
          new orderItemHistory(
            "progressed-returned",
            Date.now(),
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ),
        ]
      ),
    ],
    user.addresses[0],
    "cash",
    1800000,
    1000,
    "shipping",
    Date.now() - 3 * 24 * 60 * 60 * 1000,
    Date.now()
  ),
  new Order(
    1,
    0,
    "asma@gmail.com",
    [
      new orderItem(
        3,
        "Uphone lightning cable",
        "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
        10000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "progress",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
          new orderItemHistory(
            "checking",
            Date.now() - 1 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
        ]
      ),
      new orderItem(
        4,
        "iPhone 14 pro max",
        "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
        200000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "report-returned",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
        ]
      ),
      new orderItem(
        5,
        "Smartphone Tecno Spark Go 2024",
        "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
        65000,
        5000,
        2,
        [new orderItemHistory("report-delivered", Date.now())]
      ),
    ],
    user.addresses[0],
    "virtual-wallet-10248732",
    1800000,
    1000,
    "shipping",
    Date.now() - 3 * 24 * 60 * 60 * 1000,
    Date.now()
  ),
  new Order(
    2,
    0,
    "oumaroumamodou123@gmail.com",
    [
      new orderItem(
        0,
        "Uphone lightning cable",
        "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
        10000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "shipping",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
          new orderItemHistory(
            "checking",
            Date.now() - 2 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
        ]
      ),
      new orderItem(
        1,
        "iPhone 14 pro max",
        "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
        200000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "checking",
            Date.now() - 1 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
        ]
      ),
      new orderItem(
        2,
        "Smartphone Tecno Spark Go 2024",
        "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
        65000,
        5000,
        2,
        [
          new orderItemHistory("pending", Date.now() - 1 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "shipping",
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ),
          new orderItemHistory(
            "checking",
            Date.now() - 1 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
        ]
      ),
    ],
    user.addresses[0],
    "cash",
    1800000,
    1000,
    "shipping",
    Date.now() - 3 * 24 * 60 * 60 * 1000,
    Date.now()
  ),
]);

class Message {
  constructor(id, sender, receiver, message, time, isRead) {
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.time = time;
    this.isRead = isRead;
  }
}

const messages = [
  new Message(
    0,
    "Administrateur",
    "all",
    "Bienvenue sur notre boutique en ligne ! 🎉 Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir nos produits et à nous contacter si vous avez des questions. Bonne navigation !",
    Date.now(),
    false
  ),
  new Message(
    1,
    "Support",
    "all",
    "Votre commande est en cours de traitement.",
    Date.now(),
    false
  ),
  new Message(
    2,
    "Livraison",
    "all",
    "Votre colis arrivera demain.",
    Date.now(),
    false
  ),
  new Message(
    3,
    "Administrateur",
    "all",
    "Bienvenue sur notre boutique en ligne ! 🎉 Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir nos produits et à nous contacter si vous avez des questions. Bonne navigation !",
    Date.now(),
    true
  ),
  new Message(
    4,
    "demo@gmail.com",
    "Administrateur",
    "Je rencontre des problème quand je fais des commande",
    Date.now(),
    false
  ),
  new Message(
    5,
    "asma@gmail.com",
    "Administrateur",
    "Je rencontre des problème avec le site web",
    Date.now(),
    false
  ),
];

class Blog {
  constructor(id, name, paragraphs, important, date, comments, tag, reviews) {
    this.id = id;
    this.name = name;
    this.paragraphs = paragraphs;
    this.important = important;
    this.date = date;
    this.comments = comments;
    this.tag = tag;
    this.reviews = reviews;
  }
}

const blogs = [
  new Blog(
    1,
    "Music magnate headphones",

    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/04_684500ea-e527-4171-8e1a-07c34d71c243_1024x1024.jpg?v=1674279180",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    12,
    "iphone",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    2,
    "MacBook Air labore et dolore",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b1_a4c8283b-edba-463f-bcb7-d2cf8f3ce46f_1024x1024.jpg?v=1674279118",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/12/2024",
    15,
    "mac OS",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    3,
    "New iPhone 17 review",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b2_74c4b7c0-e805-4704-a4ab-4e68c8e4eae2_1024x1024.jpg?v=1674279232",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    18,
    "iphone",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    4,
    "MacBook Air 3 labore et dolore",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b1_3b00d3c2-2f39-45bc-8e1c-fa7af69a0a27_1024x1024.jpg?v=1674279260",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    18,
    "mac OS",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    4,
    "MacBook Air 3 labore et dolore",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b1_3b00d3c2-2f39-45bc-8e1c-fa7af69a0a27_1024x1024.jpg?v=1674279260",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: ["assets/images/banner/banner1.jpg"],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: ["assets/images/banner/banner2.jpg"],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    18,
    "mac OS",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
];
