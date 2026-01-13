import { motion } from "motion/react";
import { Users, Search, Calendar, Sparkles } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Problem",
      description: "Turisti su umorni od klasičnih komercijalnih tura koje nude generička iskustva bez osobnog dodira",
      color: "#2b946f",
    },
    {
      icon: Users,
      title: "Tko smo mi",
      description: "Putnici koji žele autentična iskustva, lokalna mjesta i priče koje ne možete pronaći u vodiču",
      color: "#0f6659",
    },
    {
      icon: Calendar,
      title: "Rješenje",
      description: "CoverDis povezuje putnike s lokalnim vodičima koji nude unikatne ture prilagođene vašim interesima",
      color: "#104d2f",
    },
    {
      icon: Sparkles,
      title: "Rezultat",
      description: "Autentična iskustva, nova prijateljstva i nezaboravne uspomene s lokalnim vodičima",
      color: "#ff6309",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[#104d2f] mb-4">Kako Radi CoverDis</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Revolucioniramo način na koji ljudi doživljavaju nova mjesta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              {/* Icon Circle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: step.color }}
              >
                <step.icon size={40} className="text-white" />
              </motion.div>

              {/* Content */}
              <h4 className="text-[#104d2f] mb-3">{step.title}</h4>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>

              {/* Step Number */}
              <div className="mt-6">
                <span 
                  className="inline-block w-8 h-8 rounded-full text-white flex items-center justify-center"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines (Desktop Only) */}
        <div className="hidden lg:block relative -mt-32 mb-32">
          <svg className="w-full h-2" style={{ marginTop: "100px" }}>
            <motion.line
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              x1="12.5%"
              y1="50%"
              x2="37.5%"
              y2="50%"
              stroke="#ff6309"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
              x1="37.5%"
              y1="50%"
              x2="62.5%"
              y2="50%"
              stroke="#2b946f"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
              x1="62.5%"
              y1="50%"
              x2="87.5%"
              y2="50%"
              stroke="#0f6659"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}