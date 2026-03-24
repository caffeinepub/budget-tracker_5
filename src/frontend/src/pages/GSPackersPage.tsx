import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Clock,
  Home,
  Mail,
  MapPin,
  Menu,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Truck,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const AREAS = [
  "Kukatpally",
  "KPHB",
  "JNTUH",
  "9th Phase",
  "Moosapet",
  "Vasanth Nagar",
  "Hyder Nagar",
  "Nijampet",
  "Pragati Nagar",
  "HMT Hills",
  "Bachupally",
  "Banjara Hills",
  "Jubilee Hills",
  "Madhapur",
  "Hitech City",
  "Kondapur",
  "Miyapur",
  "Chanda Nagar",
  "Lingampally",
];

const SERVICES = [
  {
    icon: Package,
    title: "Professional Packing",
    description:
      "Expert packing with premium materials to ensure zero damage to your belongings during transit.",
    image: "/assets/generated/service-packing.dim_600x400.jpg",
  },
  {
    icon: Truck,
    title: "Transportation",
    description:
      "Well-maintained vehicles with GPS tracking for safe and timely delivery to your destination.",
    image: "/assets/generated/service-transport.dim_600x400.jpg",
  },
  {
    icon: Home,
    title: "Household Shifting",
    description:
      "Complete home relocation services from careful packing to systematic unpacking and arrangement.",
    image: "/assets/generated/service-household.dim_600x400.jpg",
  },
  {
    icon: Building2,
    title: "Office Relocation",
    description:
      "Business moving services with minimal downtime and maximum efficiency for your team.",
    image: "/assets/generated/service-office.dim_600x400.jpg",
  },
];

const STATS = [
  { icon: Users, value: "500+", label: "Happy Customers" },
  { icon: ShieldCheck, value: "100%", label: "Safe Delivery" },
  { icon: Star, value: "5+", label: "Years Experience" },
  { icon: Clock, value: "24/7", label: "Customer Support" },
];

export default function GSPackersPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setForm({ name: "", phone: "", email: "", message: "" });
    toast.success("Quote request sent! We'll contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ===== FIXED HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gs-navy shadow-md">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <span className="text-gs-gold font-bold text-xl tracking-tight">
            GS Packers &amp; Movers
          </span>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm">
            {["home", "services", "areas", "contact"].map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => scrollTo(s)}
                  className="hover:text-gs-gold transition-colors capitalize"
                  data-ocid={`nav.${s}.link`}
                >
                  {s === "home"
                    ? "Home"
                    : s === "services"
                      ? "Services"
                      : s === "areas"
                        ? "Areas"
                        : "Contact"}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            onClick={() => scrollTo("contact")}
            className="hidden md:flex bg-gs-gold text-gs-navy font-bold hover:bg-gs-gold-dark rounded-full px-5 py-2 text-sm"
            data-ocid="nav.get_quote.button"
          >
            Get Quote
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden text-white p-1"
            data-ocid="nav.mobile_menu.toggle"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden bg-gs-navy-dark px-6 pb-4"
            >
              {["home", "services", "areas", "contact"].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="block w-full text-left text-white/90 py-2 font-medium capitalize hover:text-gs-gold transition-colors"
                  data-ocid={`nav.mobile.${s}.link`}
                >
                  {s}
                </button>
              ))}
              <Button
                onClick={() => scrollTo("contact")}
                className="mt-2 w-full bg-gs-gold text-gs-navy font-bold hover:bg-gs-gold-dark rounded-full"
                data-ocid="nav.mobile.get_quote.button"
              >
                Get Quote
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== HERO ===== */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center text-center px-4 pt-16 bg-gs-hero"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block bg-gs-gold/20 text-gs-gold border border-gs-gold/40 rounded-full px-4 py-1 text-sm font-semibold mb-6">
            #1 Packers &amp; Movers in Kukatpally
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Trusted Packers &amp; Movers
            <br />
            <span className="text-gs-gold">in Hyderabad</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Safe, Reliable &amp; Affordable Relocation Services. Serving
            Kukatpally and surrounding areas with 100% customer satisfaction.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => scrollTo("contact")}
              className="bg-gs-gold text-gs-navy font-bold hover:bg-gs-gold-dark rounded-full px-8 py-3 text-base"
              data-ocid="hero.free_quote.button"
            >
              Free Quote
            </Button>
            <Button
              onClick={() => scrollTo("areas")}
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-full px-8 py-3 text-base font-semibold"
              data-ocid="hero.our_areas.button"
            >
              Our Areas
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gs-navy mb-3">
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Professional packing, safe transportation, and hassle-free
              unpacking — all under one roof.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-default"
                data-ocid={`services.item.${i + 1}`}
              >
                {/* Card image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Card body */}
                <div className="p-7 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gs-gold/15 mb-5">
                    <svc.icon size={28} className="text-gs-gold" />
                  </div>
                  <h3 className="font-bold text-lg text-gs-navy mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICE AREAS ===== */}
      <section id="areas" className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gs-navy mb-3">
              Service Areas
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We serve all major areas in Hyderabad with fast &amp; reliable
              service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {AREAS.map((area, i) => (
              <span
                key={area}
                className="bg-white text-gs-navy font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm hover:-translate-y-1 transition-transform cursor-default"
                data-ocid={`areas.item.${i + 1}`}
              >
                {area}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-gs-gold py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                data-ocid={`stats.item.${i + 1}`}
              >
                <s.icon size={32} className="mx-auto text-gs-navy mb-2" />
                <span className="block text-4xl font-bold text-gs-navy">
                  {s.value}
                </span>
                <span className="text-gs-navy/80 font-medium text-sm">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-20 px-4 bg-gs-hero">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
          >
            Get Your <span className="text-gs-gold">Free Quote</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-gs-gold font-semibold text-xl mb-6">
                Contact Information
              </h3>
              <div className="space-y-5">
                <div
                  className="flex items-start gap-4"
                  data-ocid="contact.address.panel"
                >
                  <MapPin size={22} className="text-gs-gold mt-1 shrink-0" />
                  <div className="text-white/85 text-sm leading-relaxed">
                    <p className="font-semibold text-white mb-0.5">Address</p>
                    Plot no.25, Road no.4, Ramaiah Nagar Colony,
                    <br />
                    Shanthi Nagar, Kukatpally,
                    <br />
                    Hyderabad, Telangana 500072
                  </div>
                </div>
                <div
                  className="flex items-center gap-4"
                  data-ocid="contact.phone.panel"
                >
                  <Phone size={22} className="text-gs-gold shrink-0" />
                  <a
                    href="tel:7702854350"
                    className="text-white/85 hover:text-gs-gold transition-colors text-sm font-medium"
                    data-ocid="contact.phone.link"
                  >
                    +91 7702854350
                  </a>
                </div>
                <div
                  className="flex items-center gap-4"
                  data-ocid="contact.email.panel"
                >
                  <Mail size={22} className="text-gs-gold shrink-0" />
                  <a
                    href="mailto:info@sgpackersandmovers.com"
                    className="text-white/85 hover:text-gs-gold transition-colors text-sm"
                    data-ocid="contact.email.link"
                  >
                    info@sgpackersandmovers.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Quote form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-7 space-y-4"
              data-ocid="contact.quote.modal"
            >
              <div>
                <Input
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="bg-white/90 border-0 placeholder:text-gray-500 text-gray-800"
                  data-ocid="contact.name.input"
                />
              </div>
              <div>
                <Input
                  placeholder="Phone Number *"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  className="bg-white/90 border-0 placeholder:text-gray-500 text-gray-800"
                  data-ocid="contact.phone.input"
                />
              </div>
              <div>
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="bg-white/90 border-0 placeholder:text-gray-500 text-gray-800"
                  data-ocid="contact.email.input"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Tell us about your moving requirements... *"
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  rows={4}
                  className="bg-white/90 border-0 placeholder:text-gray-500 text-gray-800 resize-none"
                  data-ocid="contact.message.textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gs-gold text-gs-navy font-bold hover:bg-gs-gold-dark rounded-full py-3 text-base"
                data-ocid="contact.submit.button"
              >
                {submitting ? "Sending..." : "Get Free Quote"}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#111] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* About */}
          <div>
            <h3 className="text-gs-gold font-bold text-lg mb-3">
              GS Packers &amp; Movers
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Your trusted partner for safe and reliable relocation services in
              Hyderabad. Serving with care since 2018.
            </p>
          </div>
          {/* Quick links */}
          <div>
            <h3 className="text-gs-gold font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {["home", "services", "areas", "contact"].map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => scrollTo(s)}
                    className="text-white/60 hover:text-gs-gold text-sm capitalize transition-colors"
                    data-ocid={`footer.${s}.link`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-gs-gold font-bold text-lg mb-3">Contact</h3>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex gap-2 items-start">
                <MapPin size={14} className="mt-0.5 text-gs-gold shrink-0" />
                <span>
                  Plot no.25, Road no.4, Ramaiah Nagar Colony, Kukatpally,
                  Hyderabad 500072
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone size={14} className="text-gs-gold shrink-0" />
                <a
                  href="tel:7702854350"
                  className="hover:text-gs-gold transition-colors"
                >
                  7702854350
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <Mail size={14} className="text-gs-gold shrink-0" />
                <a
                  href="mailto:info@sgpackersandmovers.com"
                  className="hover:text-gs-gold transition-colors"
                >
                  info@sgpackersandmovers.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-white/40 text-xs space-y-1">
          <p>
            © {new Date().getFullYear()} GS Packers &amp; Movers. All rights
            reserved.
          </p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
