import * as React from 'react';
import {
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Insights as InsightsIcon,
  ModelTraining as ModelTrainingIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { type LayoutProps } from '../types/common';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const drawerWidth = 220;
const settings = ['Account', 'Logout'];
const page_navigate = {
  'Dataset Overview': { path: '/', icon: DashboardIcon },
  'Predict': { path: '/predict', icon: TimelineIcon },
  'Shap Analysis': { path: '/shap', icon: InsightsIcon },
  'Train Model': { path: '/train', icon: ModelTrainingIcon },
} as const;

type PageKey = keyof typeof page_navigate;
const pages: PageKey[] = Object.keys(page_navigate) as PageKey[];

/* ---------- Styled components ---------- */

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile',
})<{ open?: boolean; isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // On mobile, never offset by drawer — it's an overlay
  marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
  ...(open &&
    !isMobile && {
      marginLeft: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile',
})<{ open?: boolean; isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // On mobile, appbar stays full width even when drawer is open
  ...(open &&
    !isMobile && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Close drawer on route change (mobile)
  React.useEffect(() => {
    if (isMobile) setOpen(false);
  }, [location.pathname, isMobile]);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) setOpen(false);
  };

  /* ----- Drawer contents (shared between mobile & desktop) ----- */
  const drawerContent = (
    <>
      <DrawerHeader>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ flex: 1, pl: 2, color: 'primary.main', letterSpacing: 0.5 }}
        >
          ⚡ EDF
        </Typography>
        <IconButton onClick={() => setOpen(false)}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {pages.map((page) => {
          const { path, icon: Icon } = page_navigate[page];
          const isActive = location.pathname === path;
          return (
            <ListItem key={page} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  my: 0.3,
                  borderRadius: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon color={isActive ? 'inherit' : 'primary'} fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={page}
                  primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* ================= AppBar ================= */}
      <StyledAppBar position="fixed" open={open} isMobile={isMobile}>
        <Toolbar
          sx={{
            px: { xs: 1, sm: 2 },
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Single hamburger button */}
          <IconButton
            color="inherit"
            aria-label="toggle navigation"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 1, ...(open && !isMobile && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          {/* App title — always visible */}
          <Typography
            variant="subtitle1"
            noWrap
            fontWeight={700}
            sx={{
              display: { xs: 'block' },
              mr: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            Demand Forecasting
          </Typography>

          {/* Desktop inline nav buttons */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {pages.map((page) => {
              const { path } = page_navigate[page];
              const isActive = location.pathname === path;
              return (
                <Button
                  key={page}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    opacity: isActive ? 1 : 0.8,
                    borderBottom: isActive ? '2px solid white' : '2px solid transparent',
                    borderRadius: 0,
                    px: 1.5,
                    '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                  onClick={() => navigate(path)}
                >
                  {page}
                </Button>
              );
            })}
          </Box>

          {/* Spacer on mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
                  <Typography variant="body2">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* ================= Drawer ================= */}
      {isMobile ? (
        // Mobile: temporary overlay drawer
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }} // Better mobile perf
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Desktop: persistent sidebar
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* ================= Main ================= */}
      <Main open={open} isMobile={isMobile}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
