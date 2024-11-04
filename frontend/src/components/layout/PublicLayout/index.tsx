import React, { PropsWithChildren, FC } from "react";

import TopNavigation from "@/components/layout/TopNavigation";
import Footer from "@/components/layout/Footer";
import MainContainer from "@/components/layout/MainContainer";

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <p>eloo</p>
      <TopNavigation />
      <MainContainer>{children}</MainContainer>
      <Footer />
    </>
  );
};

export default PublicLayout;
