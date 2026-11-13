import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import BrandSlide from './BrandSlide';

const brands = [1, 2, 3, 4, 5, 6].map((n) => ({ src: `/assets/brand-${n}.png`, alt: `Brand ${n}` }));

export default function BrandsCarousel() {
  return (
    <div className="brands-sec3 overflow-hidden">
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <div className="brands-carousel2 bg-dark">
              <Swiper modules={[Autoplay]} loop autoplay={{ delay: 2000 }} spaceBetween={30}
                breakpoints={{ 0: { slidesPerView: 2 }, 576: { slidesPerView: 3 }, 992: { slidesPerView: 5 }, 1200: { slidesPerView: 6 } }}>
                {brands.map((b) => <SwiperSlide key={b.src}><BrandSlide {...b} /></SwiperSlide>)}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
