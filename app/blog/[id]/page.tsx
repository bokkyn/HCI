"use client";

import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { useEffect } from "react";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const id = params?.id as string;
  const post = blogPosts[Number(id)] || blogPosts[1];

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
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                  <span className="text-sm font-medium">Uredničko mišljenje</span>
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


        </div>
      </div>
    
    </>
  );
}

export default BlogDetailPage;