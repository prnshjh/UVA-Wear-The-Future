import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Cancellations & Refund Policy</h1>

          <section className="space-y-6 text-lg">
            <p>
              At <strong>UVA – Wear the Future</strong>, we value your satisfaction.  
              Please review our policy below for cancellations and refunds.
            </p>

            <h2 className="text-2xl font-semibold mt-6">1. Order Cancellation</h2>
            <p>
              Orders can be cancelled within <strong>12 hours</strong> of placing them, provided they have not been shipped.  
              Once shipped, cancellations will not be accepted.
            </p>

            <h2 className="text-2xl font-semibold mt-6">2. Return Eligibility</h2>
            <p>
              You may request a return within <strong>7 days</strong> of delivery if:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>The product is defective or damaged</li>
              <li>Incorrect item was delivered</li>
              <li>The item is unused and in its original packaging</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6">3. Refunds</h2>
            <p>
              Once your return is received and inspected, we will notify you of approval or rejection.  
              Approved refunds will be processed within <strong>5–10 business days</strong> to your original payment method.
            </p>

            <h2 className="text-2xl font-semibold mt-6">4. Contact</h2>
            <p>
              To initiate a return or refund, please email us at{" "}
              <a href="mailto:uvafashiontrends@gmail.com" className="text-accent hover:underline">
                uvafashiontrends@gmail.com
              </a>{" "}
              with your order ID and reason for return.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RefundPolicy;
