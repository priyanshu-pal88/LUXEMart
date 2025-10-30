import NavBar from './components/NavBar'
import MainRoutes from './routes/MainRoutes'

const App = () => {
  return (
    <div className='min-h-screen premium-bg'>
      <NavBar/>
      <MainRoutes/>
    </div>
  )
}

export default App