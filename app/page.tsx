import Header from './container/Header'
import Horoscope from './container/horoscope'

const page = () => {
  return (
    <div className='main-container'>
      <Header/>
      <Horoscope/>
      
    </div>
  )
}

export default page