import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...Builder.field('name').required().min(3).build(),
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().min(6).build(),
    ...Builder.field('passwordConfirmation').required().sameAs('password').build(),
    ...Builder.field('isRestaurant').required().build()
  ])
}
