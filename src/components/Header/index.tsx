import { Anchor, MainHeader } from './styles'

const Header = () => {
  return (
    <MainHeader>
      <Anchor to="/">Escolha um Quiz</Anchor>
      <Anchor to="/create">Crie seu Quiz</Anchor>
    </MainHeader>
  )
}
export default Header
