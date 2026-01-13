"use client"; // Dodajte ovo jer koristite useState i useEffect

import { motion } from "motion/react";
import {
  Calendar,
  User,
  Clock,
  MapPin,
  Share2,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Promijenjeno iz react-router-dom

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  images: string[];
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  location: string;
}

const blogPosts: Record<number, BlogPost> = {
  1: {
    id: 1,
    title: "10 Skrivenih Dragulja Hrvatske Koje Morate Posjetiti",
    excerpt:
      "Otkrijte najljepša mjesta koja turisti ne znaju - od tajnih plaža do lokalnih konoba.",
    content: `Hrvatska je zemlja puna nevjerojatnih lokacija koje često ostaju skrivene od očiju turista. U ovom članku otkrivamo vam 10 najljepših skrivenih dragulja koje morate posjetiti.

**1. Stiniva plaža, Vis**

Stiniva je jedna od najljepših plaža na Jadranu, skrivena između visokih stijena. Pristup je zahtjevan, ali to je ono što ju čini posebnom. Kristalno čisto more i mirnoća čine je savršenim mjestom za bijeg od gužve.

**2. Modro jezero, Imotski**

Ovo prirodno čudo nalazi se nedaleko od Imotskog. Jezero mijenja boju ovisno o dobu dana i godišnjem dobu, od tirkizne do duboko plave. U sušnim ljetnim mjesecima jezero gotovo potpuno isušuje, otkrivajući dno.

**3. Veliki Buk, Plitvička jezera**

Dok su Plitvička jezera poznata, Veliki Buk je često zanemaren. Ovaj spektakularan slap visok je 78 metara i smješten je u prelijepom okruženju šume. Najbolje ga je posjetiti u proljeće kada je vodostaj najviši.

**4. Lokrum, Dubrovnik**

Otok Lokrum je samo 10 minuta vožnje brodom od Dubrovnika, ali izgleda kao drugi svijet. Botanički vrt, napušteni benediktinski samostan i jezero Mrtvo more čine ga savršenom jedanodnevnom ekskurzijom.

**5. Konoba kod Mate, Pelješac**

Ova lokalna konoba skrivena je u vinogradima Pelješca. Ovdje možete probati najbolju domaću hranu i vino koje proizvode vlasnici. Sve je autentično i svježe - prava kulinarsko iskustvo.

**6. Punta Rata, Brač**

Ova šljunčana plaža s kristalnim morem često se smatra najljepšom plažom na Braču. Okružena je borovom šumom koja pruža hlad tijekom vrućih ljetnih dana.

**7. Nacionalni park Risnjak**

Dok svi znaju za Plitvice i Krku, Risnjak ostaje relativno nepoznat. Ovo je raj za planinare s nevjerojatnim pogledima, bogatom florom i faunom, i autentičnim planinskim iskustvom.

**8. Tvrđava Klis**

Ova srednjovjekovna tvrđava iznad Splita korištena je kao lokacija za snimanje Game of Thrones. Pogled s tvrđave je spektakularan, a priča o njenoj povijesti fascinantna.

**9. Betina, Murter**

Malo ribarsko mjesto poznato po tradiciji gradnje drvenih brodova. Ovdje možete posjetiti muzej drvene brodogradnje i isprobati lokalnu gastronomiju u autentičnim konobama.

**10. Restoran Vinica Monkodonja, Rovinj**

Ova vinarija i restoran smješteni su na vrhu brda s pogledom na Rovinj. Lokalna vina i jela pripremljena od lokalnih sastojaka čine ga nezaboravnim gastro iskustvom.

Svaka od ovih lokacija nudi nešto jedinstveno - bilo da tražite prirodne ljepote, kulturno-povijesne znamenitosti ili autentična gastronomska iskustva. Najbolje je posjetiti ih s lokalnim vodičem koji vam može ispričati priče i pokazati skrivene detalje koje turisti obično propuste.`,
    images: [
      "https://images.unsplash.com/photo-1537932155948-d391809047d5?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    ],
    author: "Ana Jurić",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    date: "10. Prosinac 2024",
    readTime: "5 min",
    category: "Putovanja",
    location: "Hrvatska",
  },
  2: {
    id: 2,
    title: "Kako Postati Uspješan Lokalni Vodič",
    excerpt:
      "Sve što trebate znati o pokretanju vlastite turističke ture i dijeljenju lokalne kulture.",
    content: `Postati lokalni turistički vodič može biti nevjerojatno ispunjujuće iskustvo. U ovom članku dijelim s vama sve što trebate znati da uspijete u ovom poslu.

**Što znači biti lokalni vodič?**

Lokalni vodič nije samo netko tko pokazuje znamenitosti. To je netko tko dijeli priče, kulturu i dušu svog grada ili regije. Vaš zadatak je stvoriti nezaboravno iskustvo koje turisti ne mogu pronaći u vodiču.

**Koraci do uspjeha:**

**1. Poznajte svoju destinaciju**
Ne radi se samo o poznavanju znamenitosti. Morate znati priče, legende, povijest i aktualnosti. Provedite vrijeme istražujući i učeći o svom području.

**2. Razvijte svoj stil**
Svaki vodič ima svoj jedinstveni stil. Neki su zabavni i karizmatični, drugi su više fokusirani na povijest i činjenice. Pronađite što vama odgovara.

**3. Kreirajte jedinstvenu turu**
Što vas čini različitim? Možda znate najbolje lokalne restorane, ili poznajete skrivene viewpointe, ili imate pristup mjestima koja nisu javno dostupna.

**4. Investirajte u edukaciju**
Razmislite o certificiranjima, tečajevima prve pomoći, i kontinuiranoj edukaciji o vašem području.

**5. Izgradite online prisutnost**
U današnje vrijeme većina rezervacija dolazi online. Trebate dobar profil, pozitivne recenzije i profesionalne fotografije.

**Praktični savjeti:**

- Budite na vrijeme - uvijek
- Prilagodite turu svojoj publici
- Budite fleksibilni
- Slušajte što vaši gosti žele
- Tražite feedback i učite iz njega

**Financijski aspekt:**

Početkom može biti teško, ali ustrajnost se isplati. Budite realni s cijenom - ne podcjenjujte svoj rad, ali budite konkurentni. Razmislite o grupnim turama za bolju zaradu.

**Izazovi:**

- Sezonalnost posla
- Loše vrijeme
- Zahtjevni gosti
- Konkurencija

**Prednosti:**

- Fleksibilno radno vrijeme
- Upoznavanje ljudi iz cijelog svijeta
- Dijeljenje svoje strasti
- Mogućnost zarađivanja radeći ono što volite

Zaključak: Biti lokalni vodič je više od posla - to je poziv. Ako volite svoj grad i volite ljude, to je savršena prilika za vas.`,
    images: [
      "https://images.unsplash.com/photo-1641749621450-9ce997284397?w=1200",
      "https://images.unsplash.com/photo-1537932155948-d391809047d5?w=1200",
    ],
    author: "Marko Kovač",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    date: "5. Prosinac 2024",
    readTime: "8 min",
    category: "Vodič",
    location: "Zagreb, Hrvatska",
  },
};

 function BlogDetailPage() {
  // Promijenjeno u export default
  const params = useParams(); // Koristite useParams iz next/navigation
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const id = params?.id as string; // U Next.js, params je objekt
  const post = blogPosts[Number(id)] || blogPosts[1];

  useEffect(() => {
    // Postavi trenutni URL za dijeljenje
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  return (
    <>
      <div className="pt-16 min-h-screen bg-gradient-to-br from-[#2b946f]/5 to-[#0f6659]/5">
        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px]">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="inline-block bg-[#2b946f] text-white px-4 py-1 rounded-full mb-4">
                {post.category}
              </div>
              <h1 className="text-white text-3xl md:text-5xl mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{post.readTime} čitanja</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{post.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Share Button */}
          <div className="flex justify-end mb-8">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Share2 size={20} className="text-[#2b946f]" />
                <span className="text-gray-700">Podijeli</span>
              </button>

              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl p-4 z-10 w-48"
                >
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Facebook size={20} className="text-blue-600" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${shareUrl}`,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Twitter size={20} className="text-sky-500" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `mailto:?subject=${encodeURIComponent(
                          post.title
                        )}&body=${encodeURIComponent(shareUrl)}`,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Mail size={20} className="text-gray-600" />
                    <span>Email</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 md:p-12 shadow-lg mb-8"
          >
            <div className="prose prose-lg max-w-none">
              {post.content.split("\n\n").map((paragraph, idx) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3 key={idx} className="text-2xl text-[#104d2f] mt-8 mb-4">
                      {paragraph.replace(/\*\*/g, "")}
                    </h3>
                  );
                }
                return (
                  <p key={idx} className="text-gray-700 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Additional Images */}
            {post.images.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                {post.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${post.title} ${idx + 2}`}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                ))}
              </div>
            )}
          </motion.article>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#2b946f]/10 to-[#0f6659]/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-6">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white"
              />
              <div>
                <h4 className="text-[#104d2f] mb-2">O autoru</h4>
                <p className="text-gray-700 mb-2">{post.author}</p>
                <p className="text-gray-600 text-sm">
                  Lokalni vodič i pisac sa strašću za dijeljenjem lokalnih priča
                  i iskustava.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    
    </>
  );
}

export default BlogDetailPage;