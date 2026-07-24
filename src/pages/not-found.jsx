import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <section className="page">
      <h1>Page Not Found</h1>
      <p>This route does not exist.</p>
      <Link to="/">Go back home</Link>
    </section>
  )
}
