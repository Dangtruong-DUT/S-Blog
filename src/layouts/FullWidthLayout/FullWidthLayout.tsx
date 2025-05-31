import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import VirtualAssistant from 'src/components/VirtualAssistant'

interface props {
    children: React.ReactNode
}
function FullWidthLayout({ children }: props) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
            <VirtualAssistant />
        </>
    )
}

export default FullWidthLayout
