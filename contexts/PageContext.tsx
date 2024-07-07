import React, { createContext, useContext, useState, ReactNode } from "react";
import { SvgIconComponent } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";

interface Page {
  title: string;
  url: string;
  icon: SvgIconComponent;
}

interface PageContextType {
  pages: Page[];
  addPage: (page: Page) => void;
  removePage: (url: string) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pages, setPages] = useState<Page[]>([
    { title: "Home", url: "/", icon: HomeIcon },
    { title: "Dashboard", url: "/dashboard", icon: DashboardIcon },
    { title: "Orders", url: "/orders", icon: ShoppingCartIcon },
    { title: "Customers", url: "/customers", icon: PeopleIcon },
    { title: "Reports", url: "/reports", icon: BarChartIcon },
    { title: "Integrations", url: "/integrations", icon: LayersIcon },
  ]);

  const addPage = (page: Page) => {
    setPages([...pages, page]);
  };

  const removePage = (url: string) => {
    setPages(pages.filter((page) => page.url !== url));
  };

  return (
    <PageContext.Provider value={{ pages, addPage, removePage }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
};
