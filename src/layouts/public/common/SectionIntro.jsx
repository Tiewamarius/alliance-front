import SubTitle from './SubTitle';

export default function SectionIntro({ subtitle, title, center = false, titleClassName = '', className = '', children }) {
  return (
    <div className={`sec-intro ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {subtitle && <SubTitle>{subtitle}</SubTitle>}
      <h2 className={`sec-title ${titleClassName}`}>{title}</h2>
      {children}
    </div>
  );
}
