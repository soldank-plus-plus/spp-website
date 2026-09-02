import { Header } from "@/components/ui/custom/core/Header";
import { BrowserClient } from "@/components/layouts/Gameplay/BrowserClient";
import { Footer } from "@/components/ui/custom/core/Footer";

const Gameplay = () => {
    return (
        <>
            <Header />
            <main>
                <BrowserClient />
            </main>
            <Footer />
        </>
    );
};

export default Gameplay;
