import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SectionIntro from '../common/SectionIntro';
import ProjectCard from './ProjectCard';

const projects = [
  { image: '/assets/pt1.jpg', title: 'Electric Bus Fleet Implementation' },
  { image: '/assets/pt2.jpg', title: 'AI-Based Predictive Maintenance' },
  { image: '/assets/pt3.jpg', title: 'Security For Cargo Delivery Services' },
  { image: '/assets/pt4.jpg', title: 'Sustainable Logistics and Last-Mile Delivery' },
  { image: '/assets/pt5.jpg', title: 'Real-Time Ride-Sharing and Route Optimization' },
  { image: '/assets/pt1.jpg', title: 'Smart Traffic Management System for Smart Cities' },
];

export default function RecentWork() {
  return (
    <section className="recent-work sec-padding">
      <SectionIntro center subtitle="See Our Portfolio" title="Explore Our Recent Work" />
      <div className="work-carousel">
        <Swiper modules={[Autoplay]} loop autoplay={{ delay: 3000 }} spaceBetween={30}
          breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 }, 1400: { slidesPerView: 4 } }}>
          {projects.map((p, i) => <SwiperSlide key={i}><ProjectCard {...p} /></SwiperSlide>)}
        </Swiper>
      </div>
    </section>
  );
}
