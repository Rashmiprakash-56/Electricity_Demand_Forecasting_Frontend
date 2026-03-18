import * as React from 'react';
import {
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Insights as InsightsIcon,
  ModelTraining as ModelTrainingIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {type LayoutProps } from '../types/common';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';


const drawerWidth = 200;
const settings = ['Account', 'Logout'];
const page_navigate = {
  'Dataset Overview': { path: '/', icon: DashboardIcon },
  'Predict': { path: '/predict', icon: TimelineIcon },
  'Shap Analysis': { path: '/shap', icon: InsightsIcon },
  'Train_Model': { path: '/train', icon: ModelTrainingIcon },
} as const;



type PageKey = keyof typeof page_navigate;

const pages: PageKey[] = Object.keys(page_navigate) as PageKey[];

/* ---------- Styled ---------- */

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: `-${drawerWidth}px`,
  transition: theme.transitions.create('margin'),
  ...(open && {
    marginLeft: 0,
  }),
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['width', 'margin']),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/* ---------- Component ---------- */

export default function DrawerWithResponsiveAppBar({ children }: LayoutProps) {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* ================= AppBar ================= */}
      <StyledAppBar position="fixed" open={open}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            {/* Drawer Toggle */}
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Nav */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton color="inherit" onClick={(e) => setAnchorElNav(e.currentTarget)}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => setAnchorElNav(null)}>
                    {page}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Desktop Nav */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button key={page} sx={{ color: 'white' }} onClick={() => navigate(page_navigate[page].path)}>
                  {page}
                </Button>
              ))}
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
              >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    setAnchorElUser(null);

                    if (setting === 'Account') {
                      navigate('/account');
                    } else if (setting === 'Logout') {
                      logout(); 
                    }
                  }}
                >
                  <Button>
                    {setting}
                  </Button>
                </MenuItem>
              ))}

              </Menu>
            </Box>

          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* ================= Drawer ================= */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {pages.map((page) => {
            const { path, icon: Icon } = page_navigate[page];
            return (
              <ListItem key={page} disablePadding>
                <ListItemButton 
                  onClick={() => navigate(path)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Icon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={page} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* ================= Main ================= */}
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
