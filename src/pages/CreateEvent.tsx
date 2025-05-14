
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NewEventCreator from '@/components/events/NewEventCreator';
import { motion } from 'framer-motion';

const CreateEvent = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background to-accent/10">
        <motion.div
          className="container max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NewEventCreator />
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default CreateEvent;
