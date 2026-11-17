import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SectionIntro from '../common/SectionIntro';
import ReviewCard from './ReviewCard';

const reviews = [
  { name: 'Sarah Williams', avatar: '/assets/aut1.png', text: 'The transport company provides reliable service and delivers on time. Vehicles are well maintained and staff behavior is professional. A good experience. Customer support is helpful, though response time could be faster.' },
  { name: 'Bessie Cooper', avatar: '/assets/aut2.png', text: 'Good transport company with safe handling of goods and timely delivery. Vehicles are well maintained and staff behavior is professional. They were incredibly helpful and available to answer my questions.' },
  { name: 'Jacob Jones', avatar: '/assets/aut3.png', text: 'I was initially hesitant about switching logistics providers, but the Transhub customer support team made the transition seamless. They were incredibly helpful and available to answer my questions.' },
  { name: 'Jacob Jones', avatar: '/assets/aut3.png', text: 'I was initially hesitant about switching logistics providers, but the Transhub customer support team made the transition seamless. They were incredibly helpful and available to answer my questions.' },
].map((r) => ({ ...r, role: 'Marketing Manager' }));

export default function Reviews() {
  return (
    <section className="review-sec3 bg-shade sec-padding">
      <div className="container">
        <SectionIntro center subtitle="About Our Company" title="What Our Client Say's about us" />
        <div className="row">
          <div className="col-lg-12">
            <div className="review3-carousel">
              <Swiper modules={[Autoplay]} loop autoplay={{ delay: 3500 }} spaceBetween={30}
                breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}>
                {reviews.map((r, i) => <SwiperSlide key={i}><ReviewCard {...r} /></SwiperSlide>)}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
