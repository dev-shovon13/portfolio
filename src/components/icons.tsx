import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </Icon>
);

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </Icon>
);

export const ArrowLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 8H3M7 4L3 8l4 4" />
  </Icon>
);

export const Download = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2v8.5M4.5 7.5L8 11l3.5-3.5M2.5 13.5h11" />
  </Icon>
);

export const Copy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 5.5h8v8h-8z" />
    <path d="M10.5 5.5v-3h-8v8h3" />
  </Icon>
);

export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8.5l3.2 3L13 4.5" />
  </Icon>
);

export const Dot = (p: IconProps) => (
  <Icon {...p} stroke="none">
    <circle cx="8" cy="8" r="3" fill="currentColor" />
  </Icon>
);
