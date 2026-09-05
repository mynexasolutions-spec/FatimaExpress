export const site = {
  name: "Fatima Express",
  tagline: "For Wholesale Party Supplies",
  description:
    "Premium foil balloons, crystal-clear bubble balloons and professional balloon equipment, delivered across the UAE.",
  whatsapp: "+971569515903",
  whatsappDisplay: "+971 56 951 5903",
  email: "sales@fatimaexpress.ae",
  facebook: "https://www.facebook.com/share/18vf55yRmf/",
  instagram: "https://www.instagram.com/",
  location: "Dubai, United Arab Emirates",
};

export const whatsappLink = (
  message = "Hi Fatima Express, I would like to enquire about your party supplies.",
  phone = site.whatsapp,
) => `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Foil Balloons", href: "/shop?category=foil-balloons" },
  { label: "Bubble Balloons", href: "/shop?category=bubble-balloons" },
  { label: "Accessories", href: "/shop?category=accessories" },
  { label: "Shop All", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const emirates = [
  { value: "Dubai", label: "Dubai" },
  { value: "Abu Dhabi", label: "Abu Dhabi" },
  { value: "Sharjah", label: "Sharjah" },
  { value: "Ajman", label: "Ajman" },
  { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
  { value: "Fujairah", label: "Fujairah" },
  { value: "Umm Al Quwain", label: "Umm Al Quwain" },
];
