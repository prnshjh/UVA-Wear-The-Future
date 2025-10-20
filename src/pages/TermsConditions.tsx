import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

          <section className="space-y-6 text-lg">
            <p>
              Welcome to <strong>UVA – Wear the Future</strong>. By using our website, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h2 className="text-2xl font-semibold mt-6">1. General</h2>
            <p>
              These terms apply to all visitors, users, and customers of UVA.  
              We reserve the right to update these terms at any time without prior notice.
            </p>

            <h2 className="text-2xl font-semibold mt-6">2. Product Information</h2>
            <p>
              We strive to ensure all product details are accurate.  
              However, slight variations in color or measurements may occur due to photography and screen display differences.
            </p>

            <h2 className="text-2xl font-semibold mt-6">3. Pricing & Payments</h2>
            <p>
              All prices are in INR and inclusive of applicable taxes.  
              Payments are securely processed via <strong>Razorpay</strong>.
            </p>

            <h2 className="text-2xl font-semibold mt-6">4. Intellectual Property</h2>
            <p>
              All designs, images, and content on this website are property of UVA.  
              Unauthorized use, reproduction, or distribution is prohibited.
            </p>

            <h2 className="text-2xl font-semibold mt-6">5. Limitation of Liability</h2>
            <p>
              UVA shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our website.
            </p>

            <h2 className="text-2xl font-semibold mt-6">6. Contact</h2>
            <p>
              For any concerns regarding these Terms & Conditions, contact us at{" "}
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

export default TermsConditions;
