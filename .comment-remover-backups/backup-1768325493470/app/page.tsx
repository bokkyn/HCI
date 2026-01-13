import  Hero 
 from "../components/Hero";
import { TourSearch } from "../components/TourSearch";
import FeaturedTours from "../components/FeaturedTours";
import { HowItWorksPath } from "../components/HowItWorksPath";
import Gamification from "../components/Gamification";


export default function HomePage() {
  return (
    <>
      <Hero></Hero>
      <TourSearch></TourSearch>
      <FeaturedTours></FeaturedTours>
      <Gamification></Gamification>
      <HowItWorksPath></HowItWorksPath>
     
    </>
  );
}
