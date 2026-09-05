import ContactClient from "./ContactClient";
import { getContactPublic } from "@/lib/siteSettings";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Fatima Express for wholesale party supply enquiries, bulk quotes and delivery across the UAE.",
};

export default async function ContactPage() {
  const contact = await getContactPublic();
  return <ContactClient contact={contact} />;
}
