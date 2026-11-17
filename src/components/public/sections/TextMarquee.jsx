import Marquee from 'react-fast-marquee';
import MarqueeItem from './MarqueeItem'; // Sans accolades

const words = ['Transport', 'Logistic', 'Global Export', 'Transport', 'Global Import'];

export default function TextMarquee() {
  return (
    <section className="text-slide-sec sec-padding text-slide-sec3 overflow-hidden">
      <div className="marque-active">
        <div className="text-slide-wrap">
          <Marquee speed={60} gradient={false}>
            {words.map((w, i) => <MarqueeItem key={i} label={w} />)}
          </Marquee>
        </div>
      </div>
    </section>
  );
}