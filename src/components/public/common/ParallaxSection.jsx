export default function ParallaxSection({ image, overlay = 0.5, className = '', as: Tag = 'section', children }) {
  return (
    <Tag
      className={className}
      style={{
        position: 'relative',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: overlay }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </Tag>
  );
}
