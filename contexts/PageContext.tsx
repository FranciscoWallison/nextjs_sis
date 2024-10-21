import React, { createContext, useContext, useState, ReactNode } from "react";
import { SvgIconComponent } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessIcon from '@mui/icons-material/Business';
import ViewModuleIcon from "@mui/icons-material/ViewModule"; // Adicionei o ícone

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
    { title: "Dashboard", url: "/Dashboard", icon: DashboardIcon },
    { title: "Manutenções", url: "/ManutencoesDashboard", icon: EngineeringIcon },
    { title: "Calendário", url: "/calendario", icon: CalendarMonthIcon },
    { title: "Alertas", url: "/alertas", icon: NotificationImportantIcon },
    // { title: "Activity", url: "/activity", icon: DashboardIcon },
    { title: "Gestão de Blocos", url: "/gestaoblocos", icon: ViewModuleIcon }, // Adicionado aqui
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
