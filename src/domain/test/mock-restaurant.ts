import { RestaurantModel } from '@/domain/models'
import faker from 'faker'

export const mockRestaurantModel = (): RestaurantModel => ({
  id: faker.random.number(5),
  name: faker.name.findName(),
  address: faker.random.words(3),
  description: faker.random.words(3),
  image: faker.internet.url(),
  type: faker.random.word()
})
