import { SpinnerElement } from './styles'

const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <SpinnerElement>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} />
        ))}
      </SpinnerElement>
    </div>
  )
}
export default Loader

