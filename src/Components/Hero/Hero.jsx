import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="bg-base-100 py-20 px-6 md:px-16">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 mt-10 md:mt-0"
        >
          <h1 className="text-5xl font-extrabold leading-tight text-primary mb-6">
            Study Smarter. Together.
          </h1>
          <p className="text-lg text-base-content/70 mb-6 max-w-md">
            Empower your academic journey by collaborating with peers. Share
            assignments, peer review, and grow.
          </p>
          <button className="btn btn-primary px-6 py-2 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg">
            Get Started
          </button>
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 flex justify-center"
        >
          <img
            src="https://www.mtu.edu/admissions/academics/majors/communication/images/communication-culture-and-media-group-study-banner2400.jpg"
            alt="Students studying illustration"
            className="w-full h-auto max-w-lg rounded-xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
