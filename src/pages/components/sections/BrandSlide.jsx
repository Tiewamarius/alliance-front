export default function BrandSlide({ src, alt, href = '#' }) {
  return <a href={href}><img src={src} alt={alt} /></a>;
}
