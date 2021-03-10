import { RemoteLoadFoodsByRestaurant } from '../usecases/load-foods-by-restaurant/remote-load-foods-by-restaurant'
import faker from 'faker'
import { RemoteLoadRestaurants } from '../usecases'

export const mockRemoteFoodModel = (): RemoteLoadFoodsByRestaurant.Model => ({
  id: faker.random.number(),
  image: faker.internet.url(),
  name: faker.name.findName(),
  price: faker.random.number(),
  description: faker.random.words(6),
  type: faker.random.word()
})

export const mockRemoteFoodModelList = (): RemoteLoadFoodsByRestaurant.Model[] => [mockRemoteFoodModel()]
