import { motion } from "framer-motion";
import { FaClipboardList, FaUserCheck, FaChartLine } from "react-icons/fa";

const features = [
  {
    title: "Create Assignments",
    icon: <FaClipboardList className="text-4xl text-primary mb-4 mx-auto" />,
    desc: "Launch and share group tasks instantly.",
  },
  {
    title: "Peer Grading",
    icon: <FaUserCheck className="text-4xl text-primary mb-4 mx-auto" />,
    desc: "Evaluate peers and receive feedback.",
  },
  {
    title: "Progress Tracking",
    icon: <FaChartLine className="text-4xl text-primary mb-4 mx-auto" />,
    desc: "Visualize your academic growth effortlessly.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-base-200 px-6 md:px-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-base-content mb-4">
          Why Choose Us?
        </h2>
        <p className="text-base-content/60 max-w-xl mx-auto">
          GroupStudyHub brings seamless collaboration, peer engagement, and
          academic efficiency to your fingertips.
        </p>
      </div>
      <div className="grid gap-10 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-base-100 rounded-xl shadow-md hover:shadow-xl p-6 text-center"
          >
            {f.icon}
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-base-content/70">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
