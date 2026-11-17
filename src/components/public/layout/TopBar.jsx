import SocialShare from '../common/SocialShare';
import TopBarInfoItem from './TopBarInfoItem';

const PhoneIcon = () => <i className="fa fa-phone" style={{ color: '#fff' }} />;
const MailIcon = () => <i className="fa fa-envelope" style={{ color: '#fff' }} />;
const PinIcon = () => <i className="fa fa-location-dot" style={{ color: '#fff' }} />;

export default function TopBar({ phone = '+92 8208 383 727', email = 'info@transhub.com', address = '123 Street, New York, USA' }) {
  return (
    <div className="header-top bg-primary">
      <div className="container ct-container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="header-infos">
            <ul className="d-none d-xl-flex flex-wrap align-items-center gap-4">
              <TopBarInfoItem icon={<PhoneIcon />} href={`tel:${phone.replace(/[^\d]/g, '')}`}>Phone: {phone}</TopBarInfoItem>
              <TopBarInfoItem icon={<MailIcon />} href={`mailto:${email}`}>Email: {email}</TopBarInfoItem>
              <TopBarInfoItem icon={<PinIcon />}>Location<span>{address}</span></TopBarInfoItem>
            </ul>
          </div>
          <SocialShare label="Follow Us:" className="ms-4" />
        </div>
      </div>
    </div>
  );
}
