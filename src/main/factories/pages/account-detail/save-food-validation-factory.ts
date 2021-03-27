import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'

export const makeSaveFoodValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...Builder.field('name').required().build(),
    ...Builder.field('type').required().build(),
    ...Builder.field('price').required().build(),
    ...Builder.field('description').required().build()
  ])
}
