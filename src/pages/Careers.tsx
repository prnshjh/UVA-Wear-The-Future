import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, MapPin, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Job = {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  apply_link: string;
  created_at: string;
};

const Careers = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job openings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join us in shaping the future of fashion technology.
            </h1>
          </div>

          {/* Jobs Section */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-6" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No open positions right now — stay tuned!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="overflow-hidden p-6 hover-lift transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> {job.department}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </Badge>
                    <Badge className="flex items-center gap-1 bg-gold text-background">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Posted on {new Date(job.created_at).toLocaleDateString()}
                  </div>
                  <a
                    href={job.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                      Apply Now
                    </button>
                  </a>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
