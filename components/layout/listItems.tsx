import * as React from 'react';
import { ListItemButton } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from "next/router";
import { SvgIconComponent } from "@mui/icons-material";

interface Page {
  title: string;
  url: string;
  icon: SvgIconComponent;
}

interface DynamicListItemsProps {
  pages: Page[];
}

export const MainListItems: React.FC<DynamicListItemsProps> = ({ pages }) => {
  const router = useRouter();

  return (
    <>
      {pages.map((page, index) => (
        <ListItemButton
          key={index}
          onClick={() => router.push(page.url)}
        >
          <ListItemIcon>
            <page.icon />
          </ListItemIcon>
          <ListItemText primary={page.title} />
        </ListItemButton>
      ))}
    </>
  );
};

export const secondaryListItems = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Teste 1" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Teste 2" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Teste 3" />
    </ListItemButton> */}
  </React.Fragment>
);
