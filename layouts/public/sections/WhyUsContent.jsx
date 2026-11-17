import SectionIntro from '../common/SectionIntro';
import ProgressBar from '../common/ProgressBar';
import QuickCall from '../common/QuickCall';

const skills = [
  { label: 'Shipping', value: 85 },
  { label: 'Successful Delivery', value: 95 },
  { label: 'Managment', value: 78 },
];

export default function WhyUsContent() {
  return (
    <div className="why-txt">
      <SectionIntro subtitle="Why We Special" title="We Want to Make a Good Impact on Your Business" titleClassName="text-white">
        <p>At Transhub, we are committed to revolutionizing the transportation industry through innovative solutions and unparalleled service.</p>
      </SectionIntro>
      <div className="success-stat">
        {skills.map((s) => <ProgressBar key={s.label} {...s} />)}
      </div>
      <QuickCall phone="+148 359 505 285" iconClass="bg-info text-primary" linkClass="h6 text-info" />
    </div>
  );
}
