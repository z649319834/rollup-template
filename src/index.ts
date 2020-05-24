import { name, version } from '~/package.json'
import img from '@/images/empty-car@2x.png'
class MyLib {
  name = name
  constructor() {}

  version() {
    return version
  }

  img() {
    return img
  }
}
export default MyLib
