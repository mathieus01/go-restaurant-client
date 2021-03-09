import { RemoteLoadRestaurants } from '../usecases/load-restaurants/remote-load-restaurants'
import faker from 'faker'

export const mockRemoteRestaurantModel = (): RemoteLoadRestaurants.Model => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  address: faker.random.words(),
  description: faker.random.words(),
  image: faker.internet.url(),
  type: faker.random.word()
})

export const mockRemoteRestaurantListModel = (): RemoteLoadRestaurants.Model[] => ([mockRemoteRestaurantModel()])
