"use client"; 

import { motion } from "motion/react";
import Link from "next/link"; 
import { MapPin, Star } from "lucide-react";

interface Tour {
  id: number;
  image: string;
  title: string;
  guide: {
    name: string;
    avatar: string;
  };
  location: string;
  rating: number;
  reviews: number;
  price: number;
}

const tours: Tour[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1471240840307-485d3bc42300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBtb3VudGFpbiUyMHRvdXJ8ZW58MXx8fHwxNzY1NTAxNDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Planinski Uspon Velebit",
    guide: {
      name: "Marko Kovač",
      avatar:
        "https://images.unsplash.com/photo-1641749621450-9ce997284397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwZ3VpZGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjU1MDE0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    location: "Zadar, Hrvatska",
    rating: 4.9,
    reviews: 127,
    price: 45,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1762674462382-6ea7fb670032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwZm9vZCUyMHRvdXJ8ZW58MXx8fHwxNzY1NTAxNDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Street Food Aventura",
    guide: {
      name: "Ana Jurić",
      avatar:
        "https://images.unsplash.com/photo-1537932155948-d391809047d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRyYXZlbGVyJTIwbmF0dXJlfGVufDF8fHx8MTc2NTUwMTQ1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    location: "Zagreb, Hrvatska",
    rating: 5.0,
    reviews: 89,
    price: 60,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1765266958853-5c6ae343a711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMHdhbGtpbmclMjB0b3VyfGVufDF8fHx8MTc2NTUwMTQ0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Kulturna Šetnja Starom Gradom",
    guide: {
      name: "Ivana Marić",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    location: "Split, Hrvatska",
    rating: 4.8,
    reviews: 156,
    price: 25,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1631165538791-295d382f5edd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGtheWFraW5nJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc2NTUwMTQ0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Kayaking Jadranska Avantura",
    guide: {
      name: "Petar Novak",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    location: "Dubrovnik, Hrvatska",
    rating: 4.9,
    reviews: 203,
    price: 55,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1607220868624-dd855c2839be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMGFydHxlbnwxfHx8fDE3NjU0NDAwODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Street Art & Urbana Kultura",
    guide: {
      name: "Luka Horvat",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    location: "Rijeka, Hrvatska",
    rating: 4.7,
    reviews: 94,
    price: 30,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1537932155948-d391809047d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRyYXZlbGVyJTIwbmF0dXJlfGVufDF8fHx8MTc2NTUwMTQ1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Wine Tasting & Istra Tour",
    guide: {
      name: "Petra Babić",
      avatar: "https://i.pravatar.cc/150?img=10",
    },
    location: "Pula, Hrvatska",
    rating: 5.0,
    reviews: 167,
    price: 70,
  },
];

export default function FeaturedTours() {

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 relative overflow-hidden">

      <div className="absolute inset-0 opacity-5">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920"
          alt="Forest"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-[#104d2f] mb-4">Predloženi Izleti</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Otkrijte nezaboravna iskustva s našim lokalnim vodičima
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <Link key={tour.id} href={`/tours/${tour.id}`}>
              {" "}
              {/* Promijenjeno to u href */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "tween", duration: 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.05 } }}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 h-full flex flex-col"
              >
                {/* Tour Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-800">{tour.rating}</span>
                    <span className="text-xs text-gray-500">
                      ({tour.reviews})
                    </span>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#104d2f] mb-2 leading-tight group-hover:text-[#ff6309] transition-colors">
                      {tour.title}
                    </h3>
                    {/* Location - Moved closer to title (Proximity) */}
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <MapPin size={14} className="text-[#2b946f]" />
                      <span>{tour.location}</span>
                    </div>
                  </div>

                  {/* Footer: Guide Info & Price - Separated section */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={tour.guide.avatar}
                        alt={tour.guide.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          Vodič
                        </p>
                        <p className="text-xs font-semibold text-gray-700">
                          {tour.guide.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">od</p>
                      <p className="text-lg font-bold text-[#ff6309] leading-none">
                        {tour.price} €
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
