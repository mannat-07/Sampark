import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import GrievanceForm from './GrievanceForm';
import StatusTracker from './StatusTracker';
import { FileText, Search } from 'lucide-react';

interface GrievanceSectionProps {
  onGrievanceSubmitted?: () => void;
}

export default function GrievanceSection({ onGrievanceSubmitted }: GrievanceSectionProps) {
  return (
    <section id="grievance" className="py-16 relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-white dark:from-[#003459] dark:to-[#00171f]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#007ea7]/10 dark:bg-[#007ea7]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00a8e8]/10 dark:bg-[#00a8e8]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          {/* <span className="inline-block px-4 py-1.5 rounded-full bg-[#00a8e8]/10 dark:bg-[#00a8e8]/10 border border-[#00a8e8]/20 text-[#007ea7] dark:text-[#00a8e8] text-sm font-medium mb-4"> */}
            {/* Take Action */}
          {/* </span> */}
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 pt-12">
            Report or Track
            <br />
            <span className="bg-gradient-to-r from-[#007ea7] to-[#00a8e8] bg-clip-text text-transparent">Your Grievance</span>
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Submit a new complaint or track the status of an existing one.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1 bg-gray-100 dark:bg-[#003459]/50 rounded-xl border border-gray-200 dark:border-[#007ea7]/20">
              <TabsTrigger
                value="submit"
                className="flex items-center gap-2 h-full rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007ea7] data-[state=active]:to-[#00a8e8] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 dark:text-gray-300 font-medium transition-all duration-300"
              >
                <FileText className="w-4 h-4" />
                Submit Grievance
              </TabsTrigger>
              <TabsTrigger
                value="track"
                className="flex items-center gap-2 h-full rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007ea7] data-[state=active]:to-[#00a8e8] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 dark:text-gray-300 font-medium transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                Track Status
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="mt-0">
              <div className="bg-white dark:bg-gradient-to-br dark:from-[#00171f] dark:to-[#003459] rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-[#007ea7]/30 shadow-xl">
                <GrievanceForm onGrievanceSubmitted={onGrievanceSubmitted} />
              </div>
            </TabsContent>
            
            <TabsContent value="track" className="mt-0">
              <div className="bg-white dark:bg-gradient-to-br dark:from-[#00171f] dark:to-[#003459] rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-[#007ea7]/30 shadow-xl">
                <StatusTracker />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
