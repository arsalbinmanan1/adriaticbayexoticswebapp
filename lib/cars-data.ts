import Corvette1 from "@/public/car-images/Corvette1.jpeg";
import Corvette2 from "@/public/car-images/Corvette2.jpeg";
import Corvette3 from "@/public/car-images/Corvette3.jpeg";
import Corvette4 from "@/public/car-images/Corvette4.jpeg";
import Corvette5 from "@/public/car-images/Corvette5.jpeg";
import Corvette6 from "@/public/car-images/Corvette6.jpeg";
import Corvette7 from "@/public/car-images/Corvette7.jpeg";
import Corvette8 from "@/public/car-images/Corvette8.jpeg";
import McLarenBlue1 from "@/public/car-images/McLarenBlue1.jpeg";
import McLarenBlue2 from "@/public/car-images/McLarenBlue2.jpeg";
import Lamborghini1 from "@/public/car-images/Lamborghini1.jpeg";
import Lamborghini2 from "@/public/car-images/Lamborghini2.jpeg";
import Lamborghini3 from "@/public/car-images/Lamborghini3.jpeg";
import Lamborghini4 from "@/public/car-images/Lamborghini4.jpeg";
import Lamborghini5 from "@/public/car-images/Lamborghini5.jpeg";
import Lamborghini6 from "@/public/car-images/Lamborghini6.jpeg";
import maserati1 from "@/public/car-images/maserati1.webp";
import maserati2 from "@/public/car-images/maserati2.jpg";
import McLarenOrange1 from "@/public/car-images/McLarenOrange1.jpeg";
import McLarenOrange2 from "@/public/car-images/McLarenOrange2.jpeg";
import McLarenOrange3 from "@/public/car-images/McLarenOrange3.jpeg";
import Urus1 from "@/public/car-images/Urus1.jpeg";
import Urus2 from "@/public/car-images/Urus2.jpeg";
import Urus3 from "@/public/car-images/Urus3.jpeg";

export interface Car {
  id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  category: "exotic" | "luxury" | "sports";
  pricing: {
    perDay: number;
    fourHours?: number;
    deposit: number;
    specialOffer?: string;
  };
  colors: {
    exterior: string;
    interior: string;
  };
  images: {
    main: string;
    gallery: string[];
  };
  specs: {
    engine: string;
    horsepower: string;
    acceleration: string;
    topSpeed: string;
    transmission: string;
    drivetrain: string;
  };
  features: string[];
  description: string;
  detailedDescription: {
    vibe: string;
    highlights: string[];
  };
  available: boolean;
}

export const carsData: Car[] = [
  {
    id: "1",
    name: "Corvette C8-R",
    slug: "corvette-c8-r",
    brand: "Chevrolet",
    model: "Corvette C8-R",
    year: 2024,
    category: "sports",
    pricing: {
      perDay: 419,
      fourHours: 219,
      deposit: 1000,
    },
    colors: {
      exterior: "Racing Yellow",
      interior: "Black Leather",
    },
    images: {
      main: Corvette1.src,
      gallery: [
        Corvette1.src,
        Corvette2.src,
        Corvette3.src,
        Corvette4.src,
        Corvette5.src,
        Corvette6.src,
        Corvette7.src,
        Corvette8.src,
      ],
    },
    specs: {
      engine: "6.2L V8",
      horsepower: "495 HP",
      acceleration: "0-60 mph in 2.9s",
      topSpeed: "194 mph",
      transmission: "8-Speed Dual-Clutch",
      drivetrain: "RWD",
    },
    features: [
      "Mid-engine layout",
      "Magnetic ride control",
      "Performance exhaust",
      "Carbon fiber trim",
      "Premium Bose audio",
      "Advanced safety tech",
    ],
    description: "The Corvette C8-R represents American supercar excellence with its revolutionary mid-engine design. Experience raw power and precision handling in this track-ready beast.",
    detailedDescription: {
      vibe: "A track-born instant collectible. This isn't just a Corvette; it's the limited-edition C8.R Championship package. With a mid-engine exotic layout and open-air freedom, it punches way above its weight class.",
      highlights: [
        "Z51 Performance Package: Upgraded suspension, Brembo brakes, and louder performance exhaust.",
        "Exclusive C8.R Edition: Features unique race-inspired graphics and striking yellow brake calipers.",
        "Luxury 3LT Trim: The highest interior trim available, featuring wall-to-wall premium leather and carbon fiber accents.",
      ],
    },
    available: true,
  },
  {
    id: "2",
    name: "McLaren 570S Spyder",
    slug: "mclaren-570s",
    brand: "McLaren",
    model: "570S Spyder",
    year: 2023,
    category: "exotic",
    pricing: {
      perDay: 1199,
      fourHours: 589,
      deposit: 1000,
      specialOffer: "RENT 2 DAYS GET ONE FREE",
    },
    colors: {
      exterior: "Paris Blue",
      interior: "Jet Black with Yellow Stitching Inserts",
    },
    images: {
      main: McLarenBlue2.src,
      gallery: [
        McLarenBlue2.src,
        McLarenBlue1.src
      ],
    },
    specs: {
      engine: "3.8L Twin-Turbo V8",
      horsepower: "562 HP",
      acceleration: "0-60 mph in 3.1s",
      topSpeed: "204 mph",
      transmission: "7-Speed SSG",
      drivetrain: "RWD",
    },
    features: [
      "Carbon fiber monocoque",
      "Dihedral doors",
      "Active aerodynamics",
      "Bowers & Wilkins audio",
      "Track telemetry",
      "Launch control",
    ],
    description: "The McLaren 570S delivers pure driving pleasure with Formula 1-inspired technology. Lightweight construction and twin-turbo power create an unforgettable driving experience.",
    detailedDescription: {
      vibe: "British engineering meets pure adrenaline. The 570S Spyder is designed to be the ultimate driver's car—lightweight, agile, and unmistakably exotic with its signature dihedral (upward-opening) doors.",
      highlights: [
        "Dihedral Doors: The ultimate 'arrival' statement.",
        "Carbon Fiber Monocell: Formula 1 technology that makes the car incredibly light and rigid.",
        "Retractable Hardtop: Lowers in just 15 seconds at speeds up to 25 mph.",
      ],
    },
    available: true,
  },
  {
    id: "3",
    name: "Lamborghini Huracan Spyder LP 580",
    slug: "lamborghini-huracan",
    brand: "Lamborghini",
    model: "Huracan Spyder LP 580",
    year: 2024,
    category: "exotic",
    pricing: {
      perDay: 1049,
      deposit: 1000,
    },
    colors: {
      exterior: "Giallo Orion",
      interior: "Black Leather with Yellow Stitching Inserts",
    },
    images: {
      main: Lamborghini1.src,
      gallery: [
        Lamborghini1.src,
        Lamborghini2.src,
        Lamborghini3.src,
        Lamborghini4.src,
        Lamborghini5.src,
        Lamborghini6.src
      ],
      },
      specs: {
        engine: "5.2L V10",
        horsepower: "631 HP",
        acceleration: "0-60 mph in 2.9s",
        topSpeed: "202 mph",
        transmission: "7-Speed Dual-Clutch",
        drivetrain: "AWD",
      },
      features: [
        "All-wheel drive",
      "Rear-wheel steering",
      "LDVI vehicle dynamics",
      "Alcantara interior",
      "Digital cockpit",
      "Sport exhaust",
    ],
    description: "The Lamborghini Huracan EVO is Italian supercar perfection. With its naturally aspirated V10 and aggressive styling, this is the ultimate exotic car experience.",
    detailedDescription: {
      vibe: "The poster car for Italian aggression. This Rear-Wheel Drive (RWD) variant is built for pure driving pleasure, allowing for thrilling handling dynamics that the All-Wheel Drive models can't match.",
      highlights: [
        "Naturally Aspirated V10: No turbos, just pure, screaming engine noise that turns heads blocks away.",
        "RWD Setup: The 'Drift' spec Huracán, offering a more engaging and spirited driving experience.",
        "ANIMA Switch: Toggle instantly between Strada (Street), Sport, and Corsa (Track) modes on the steering wheel.",
      ],
    },
    available: true,
  },
  {
    id: "4",
    name: "Maserati Levante GrandSport Q4",
    slug: "maserati-levante",
    brand: "Maserati",
    model: "Levante GrandSport Q4 (Fully Loaded)",
    year: 2024,
    category: "luxury",
    pricing: {
      perDay: 199,
      deposit: 500,
      specialOffer: "RENT 2 DAYS GET ONE FREE",
    },
    colors: {
      exterior: "Grigio Maratea Metallescent",
      interior: "Rosso with Nero Stitching",
    },
    images: {
      main: maserati1.src,
      gallery: [
        maserati1.src,
        maserati2.src
      ],
    },
    specs: {
      engine: "3.8L Twin-Turbo V8",
      horsepower: "580 HP",
      acceleration: "0-60 mph in 3.8s",
      topSpeed: "187 mph",
      transmission: "8-Speed Automatic",
      drivetrain: "AWD",
    },
    features: [
      "Luxury SUV comfort",
      "Premium leather interior",
      "Panoramic sunroof",
      "Harman Kardon audio",
      "Advanced driver assist",
      "Spacious cargo area",
    ],
    description: "The Maserati Levante combines Italian luxury with SUV practicality. Perfect for families or groups wanting to travel in style and comfort.",
    detailedDescription: {
      vibe: "The SUV that thinks it's a Ferrari. Perfect for when you need space for passengers and luggage but refuse to compromise on Italian style and exhaust note.",
      highlights: [
        "Q4 Intelligent AWD: Provides sports-car grip in all weather conditions.",
        "GranSport Trim: Adds aggressive sport bumpers, red brake calipers, and sport seats for a sharper look.",
        "Ferrari-Built Engine: The heart of this beast is built at the Ferrari factory in Maranello.",
      ],
    },
    available: true,
  },
  {
    id: "5",
    name: "Lamborghini Urus",
    slug: "lamborghini-urus",
    brand: "Lamborghini",
    model: "Urus",
    year: 2024,
    category: "exotic",
    pricing: {
      perDay: 1049,
      fourHours: 659,
      deposit: 1000,
    },
    colors: {
      exterior: "Grigio Keres Metallic",
      interior: "Marrone Elpis with Nero Ade",
    },
    images: {
      main: Urus1.src,
      gallery: [
        Urus1.src,
        Urus2.src,
        Urus3.src
      ],
    },
    specs: {
      engine: "4.0L Twin-Turbo V8",
      horsepower: "641 HP",
      acceleration: "0-60 mph in 3.6s",
      topSpeed: "190 mph",
      transmission: "8-Speed Automatic",
      drivetrain: "AWD",
    },
    features: [
      "Super SUV performance",
      "Carbon ceramic brakes",
      "Active roll stabilization",
      "Sport seats",
      "Advanced infotainment",
      "Multiple drive modes",
    ],
    description: "The Lamborghini Urus is the world's first Super Sport Utility Vehicle. Combining supercar performance with SUV versatility for an unmatched driving experience.",
    detailedDescription: {
      vibe: "The world's first Super Sport Utility Vehicle. It defies physics, offering the comfort of a luxury SUV with the acceleration of a supercar. It is the ultimate 'do-it-all' exotic.",
      highlights: [
        "Supercar Speed: Faster off the line than many two-seat sports cars.",
        "Tamburo Drive Mode: Select specialized modes including Neve (Snow), Terra (Off-road), and Sabbia (Sand).",
        "Ceramic Brakes: Massive carbon-ceramic brakes (the largest on a production car) provide immense stopping power.",
      ],
    },
    available: true,
  },
  {
    id: "6",
    name: "McLaren 650S Spyder",
    slug: "mclaren-650s",
    brand: "McLaren",
    model: "650S Spyder",
    year: 2023,
    category: "exotic",
    pricing: {
      perDay: 1399,
      fourHours: 689,
      deposit: 500,
    },
    colors: {
      exterior: "Volcano Orange",
      interior: "Carbon Black Alcantara",
    },
      images: {
        main: McLarenOrange1.src,
        gallery: [
          McLarenOrange1.src,
          McLarenOrange2.src,
          McLarenOrange3.src,
        ],
      },
    specs: {
      engine: "3.8L Twin-Turbo V8",
      horsepower: "641 HP",
      acceleration: "0-60 mph in 2.9s",
      topSpeed: "207 mph",
      transmission: "7-Speed SSG",
      drivetrain: "RWD",
    },
    features: [
      "Retractable hardtop",
      "ProActive chassis control",
      "Carbon fiber body",
      "Airbrake system",
      "Iris recognition",
      "Meridian sound system",
    ],
    description: "The McLaren 650S Spider offers open-top thrills with brutal performance. Experience the wind in your hair at supercar speeds with this British masterpiece.",
    detailedDescription: {
      vibe: "A technological marvel. The 650S one of the fastest McLarens, featuring active aerodynamics and a hydraulic suspension system that practically erases bumps in the road.",
      highlights: [
        "Active Airbrake: The rear spoiler automatically deploys to stabilize the car and acts as an airbrake when stopping hard.",
        "ProActive Chassis Control: A suspension system that magically balances track-level stiffness with limousine comfort.",
        "Volcano Orange Paint: A multi-layer premium paint that glows in direct sunlight.",
      ],
    },
    available: true,
  },
];

export function getCarBySlug(slug: string): Car | undefined {
  return carsData.find((car) => car.slug === slug);
}

export function getCarsByCategory(category?: string): Car[] {
  if (!category || category === "all") {
    return carsData;
  }
  return carsData.filter((car) => car.category === category);
}
