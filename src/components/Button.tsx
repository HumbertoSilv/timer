import { ButtonContainer, ButtonVariants } from './Button.styles'

interface ButtonContainerProps {
  variant?: ButtonVariants
}

export const Button = ({ variant = 'primary' }: ButtonContainerProps) => {
  return <ButtonContainer variant={variant}>Press</ButtonContainer>
}
