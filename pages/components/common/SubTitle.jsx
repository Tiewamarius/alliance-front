import TruckIcon from './TruckIcon';

export default function SubTitle({ children }) {
  return (
    <span className="sub-title fadeInUp">
      <TruckIcon />
      {children}
    </span>
  );
}
