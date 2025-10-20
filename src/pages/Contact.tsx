import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .send(
        "service_ene8m1u", 
        "template_2zuqp2t",
        formData,
        "e2nkymzveQOkHLXX7" 
      )
      .then(() => {
        setIsSending(false);
        setSent(true);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setIsSending(false);
        alert("Something went wrong. Please try again later.");
      });
  };

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div>
              <p className="text-lg mb-4">
                Have a question or need help? We’d love to hear from you.
              </p>
              <p className="mb-2">
                📧 Email:{" "}
                <a href="mailto:uvafashiontrends@gmail.com" className="text-accent hover:underline">
                  uvafashiontrends@gmail.com
                </a>
              </p>
              <p className="mb-2">
                📱 Instagram:{" "}
                <a href="https://instagram.com/fashionofuva" className="text-accent hover:underline">
                  @fashionofuva
                </a>
              </p>
            </div>

            {/* Contact Form */}
            <Card className="p-6 shadow-lg">
              <form onSubmit={sendEmail} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" disabled={isSending} className="w-full">
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
                {sent && <p className="text-green-500 text-center mt-2">Message sent successfully!</p>}
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
