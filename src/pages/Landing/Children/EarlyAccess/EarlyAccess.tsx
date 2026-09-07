import { Header } from "@/components/ui/custom/core/Header";
import Versions from "@/components/layouts/Landing/Children/EarlyAccess/Versions";
import Platforms from "@/components/layouts/Landing/Children/EarlyAccess/Platforms";
import { Footer } from "@/components/ui/custom/core/Footer";

const EarlyAccess = () => {
    return (
        <>
            <Header />
            <main>
                <Versions />
                <Platforms />
            </main>
            <Footer />
        </>
    );
};

export default EarlyAccess;
