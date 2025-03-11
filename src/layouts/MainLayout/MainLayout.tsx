import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface props {
    children: React.ReactNode
}
function MainLayout({ children }: props) {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default MainLayout
