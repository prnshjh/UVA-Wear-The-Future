import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">

          <section className="space-y-6 text-lg">
            <p>
              At <strong>UVA – Wear the Future</strong>, your privacy is our priority.  
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit or make a purchase from our website.
            </p>

            <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
            <p>
              We collect personal information such as your name, email, shipping address, and payment details when you make a purchase or sign up for our newsletter.
            </p>

            <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
            <p>
              We use your data to:
              <ul className="list-disc ml-6 mt-2">
                <li>Process and fulfill your orders</li>
                <li>Send you order updates and promotional offers</li>
                <li>Improve our website and customer experience</li>
              </ul>
            </p>

            <h2 className="text-2xl font-semibold mt-6">3. Payment Security</h2>
            <p>
              All transactions are processed securely through <strong>Razorpay</strong>.  
              We do not store your credit/debit card details on our servers.
            </p>

            <h2 className="text-2xl font-semibold mt-6">4. Cookies</h2>
            <p>
              UVA uses cookies to enhance user experience and analyze traffic. You can disable cookies in your browser settings at any time.
            </p>

            <h2 className="text-2xl font-semibold mt-6">5. Contact Us</h2>
            <p>
              For questions about our privacy practices, email us at{" "}
              <a href="mailto:uvafashiontrends@gmail.com" className="text-accent hover:underline">
                uvafashiontrends@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
