import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ShippingReturns = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Shipping & Returns</h1>

          <section className="space-y-6 text-lg">
            <p>
              At <strong>UVA – Wear the Future</strong>, we aim to deliver your orders safely and on time.
              We ship all orders through our trusted delivery partner <strong>Delhivery</strong> across India.
            </p>

            <p>
              Estimated delivery time: <strong>5–7 business days</strong> after dispatch.
            </p>

            <p>
              All online payments are securely processed via <strong>Razorpay</strong>.
              You will receive an email and SMS confirmation once your order is shipped.
            </p>

            <h2 className="text-2xl font-semibold mt-8">Returns</h2>
            <p>
              If you receive a defective or incorrect product, please contact us within
              <strong> 7 days</strong> of delivery at{" "}
              <a href="mailto:uvafashiontrends@gmail.com" className="text-accent hover:underline">
                uvafashiontrends@gmail.com
              </a>{" "}
              with your order details and images.
            </p>
            <p>
              Once approved, you can either exchange your item or receive store credit.
              Refunds are processed within 5–10 business days.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShippingReturns;
