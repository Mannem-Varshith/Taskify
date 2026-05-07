import LandingNavbar from '../components/home/LandingNavbar';
import HeroSection from '../components/home/HeroSection';
import TrustedCompanies from '../components/home/TrustedCompanies';
import FeaturesSection from '../components/home/FeaturesSection';
import WorkflowSection from '../components/home/WorkflowSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTABanner from '../components/home/CTABanner';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500/30">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustedCompanies />
        <FeaturesSection />
        <WorkflowSection />
        <TestimonialsSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
