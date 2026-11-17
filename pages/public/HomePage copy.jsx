

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const services = [
    {
      icon: Package,
      title: "Transport de colis",
      description:
        "Expédiez vos colis et marchandises avec un suivi adapté à vos besoins.",
    },
    {
      icon: Truck,
      title: "Livraison",
      description:
        "Suivez le parcours de vos expéditions jusqu'à leur livraison.",
    },
    {
      icon: Globe,
      title: "Réseau d'agences",
      description:
        "Retrouvez nos agences pour faciliter vos opérations de transport.",
    },
  ];

  return (
    <main className="home-page">
 
    </main>
  );
}
