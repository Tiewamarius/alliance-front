export default function TopBarInfoItem({ icon, href, children }) {
  return (
    <li>
      {icon}
      {href ? <a href={href}>{children}</a> : children}
    </li>
  );
}
