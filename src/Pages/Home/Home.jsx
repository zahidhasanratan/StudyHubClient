import WhyChooseUs from "../../Components/WhyChooseUs";
import FAQ from "../../Components/FAQ";
import Hero from "../../Components/Hero/Hero";

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Hero />
      <WhyChooseUs />
      <FAQ />
    </div>
  );
};

export default Home;
