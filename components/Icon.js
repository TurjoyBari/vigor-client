export default function Icon({ icon: IconComponent, className = "", size = 20 }) {
  return <IconComponent className={className} width={size} height={size} />;
}
