import { ICON_PATHS, type IconName } from '../data/icons';

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      className={`${className} shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}
