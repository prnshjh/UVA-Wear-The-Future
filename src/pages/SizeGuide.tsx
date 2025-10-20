import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const SizeGuide = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Size Guide</h1>

          <Card className="p-6 shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest (inches)</th>
                  <th className="p-3">Waist (inches)</th>
                  <th className="p-3">Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">S</td>
                  <td className="p-3">36</td>
                  <td className="p-3">30</td>
                  <td className="p-3">26</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">M</td>
                  <td className="p-3">38</td>
                  <td className="p-3">32</td>
                  <td className="p-3">27</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">L</td>
                  <td className="p-3">40</td>
                  <td className="p-3">34</td>
                  <td className="p-3">28</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">XL</td>
                  <td className="p-3">42</td>
                  <td className="p-3">36</td>
                  <td className="p-3">29</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">XXL</td>
                  <td className="p-3">44</td>
                  <td className="p-3">38</td>
                  <td className="p-3">30</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <p className="text-muted-foreground mt-6">
            *Measurements are approximate and may vary slightly depending on the fabric and fit.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SizeGuide;
