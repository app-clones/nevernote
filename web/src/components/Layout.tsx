import styled from "@emotion/styled";

const LayoutStyled = styled.div`
    width: 100%;
    height: 100vh;
`;

const Layout = ({ children }: any) => <LayoutStyled>{children}</LayoutStyled>;

export default Layout;
