import { Sparkles, Palette, Coins, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Try-On Room",
    description: "See how clothes look on you before buying with our advanced AI virtual try-on technology.",
  },
  {
    icon: Palette,
    title: "Custom Design Studio",
    description: "Create unique pieces with our design studio. Choose colors, fabrics, and add your personal touch.",
  },
  {
    icon: Coins,
    title: "Coins & Rewards",
    description: "Earn 1 coin for every ₹1 spent. Redeem during our exclusive month-end sales.",
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Every product is crafted with the finest materials and backed by our quality guarantee.",
  },
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-lg border border-border hover:border-accent transition-all duration-300 hover:shadow-lg bg-card"
            >
              <div className="mb-4">
                <div className="inline-flex p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
