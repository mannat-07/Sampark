import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import GrievanceForm from './GrievanceForm';
import StatusTracker from './StatusTracker';
import { FileText, Search } from 'lucide-react';

export default function GrievanceSection() {
  return (
    <section id="grievance" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Take Action
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Report or Track
            <br />
            <span className="text-gradient">Your Grievance</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Submit a new complaint or track the status of an existing one.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 p-1 bg-secondary/50 rounded-xl">
              <TabsTrigger
                value="submit"
                className="flex items-center gap-2 h-full rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Submit Grievance
              </TabsTrigger>
              <TabsTrigger
                value="track"
                className="flex items-center gap-2 h-full rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Search className="w-4 h-4" />
                Track Status
              </TabsTrigger>
            </TabsList>
            <TabsContent value="submit" className="mt-0">
              <div className="card-elevated rounded-2xl p-6 sm:p-8">
                <GrievanceForm />
              </div>
            </TabsContent>
            <TabsContent value="track" className="mt-0">
              <div className="card-elevated rounded-2xl p-6 sm:p-8">
                <StatusTracker />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
