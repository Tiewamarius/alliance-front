import NavDropdown from './NavDropdown';

export const menu = [
  { label: 'Homess', items: [
    { label: 'Home 1', href: '/' },
    { label: 'Home 2', href: '/index-2' },
    { label: 'Home 3', href: '/index-3', current: true, badge: 'New' },
  ] },
  { label: 'Services', items: [
    { label: 'Services', href: '/services' },
    { label: 'Services 2', href: '/services-2' },
    { label: 'Services Details', href: '/single-service' },
  ] },
  { label: 'Pages', items: [
    { label: 'About Us', href: '/about' },
    { label: 'Request Quote', href: '/quote' },
    { label: 'Tracking', href: '/tracking' },
    { label: 'Team', header: 'Our Team', children: [
      { label: 'Our Team', href: '/team' },
      { label: 'Team Details', href: '/single-team' },
    ] },
    { label: 'Shop', header: 'Shop Pages', children: [
      { label: 'Shop', href: '/shop' },
      { label: 'Product Details', href: '/single-product' },
      { label: 'Cart', href: '/cart' },
      { label: 'Checkout', href: '/checkout' },
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
    ] },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: '404 Error', href: '/404' },
  ] },
  { label: 'Projects', items: [
    { label: 'Projects', href: '/case-studies' },
    { label: 'Projects 2', href: '/case-studies-2' },
    { label: 'Project Details', href: '/single-casestudy' },
  ] },
  { label: 'Blog', items: [
    { label: 'Blog Grid 01', href: '/blog' },
    { label: 'Blog Grid 02', href: '/blog-2' },
    { label: 'Blog Classic', href: '/blog-classic' },
    { label: 'Blog Details', header: 'Blog Single', children: [
      { label: 'Single Post 01', href: '/single-post' },
      { label: 'Single Post 02', href: '/single-post-2' },
    ] },
  ] },
];

export default function NavMenu() {
  return (
    <ul className="navbar-nav mx-auto align-items-lg-center">
      {menu.map((m) => <NavDropdown key={m.label} label={m.label} items={m.items} />)}
      <li className="nav-item"><a className="nav-link" href="/contact">Contact Us</a></li>
    </ul>
  );
}
