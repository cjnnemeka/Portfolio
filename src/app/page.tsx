import Header from '@/components/Header'
import ImmersiveHero from '@/components/ImmersiveHero'
import ProjectsList from '@/components/ProjectsList'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 0 }}>
        <ImmersiveHero />
        <ProjectsList />
      </main>
      <Footer />
    </>
  )
}
