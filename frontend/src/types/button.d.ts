import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../components/ui/button';

declare module '../components/ui/button' {
  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
    asChild?: boolean;
  }
}
