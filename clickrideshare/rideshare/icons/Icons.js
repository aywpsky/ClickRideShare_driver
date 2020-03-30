import React, { Component } from 'react';
import { Icon, Layout, Text } from 'react-native-ui-kitten';
import {Styles} from '../styles/Styles.js';

export const PersonIcon = (style) => (
  <Icon {...style} name='person'/>
);

export const CarIcon = (style) => (
  <Icon {...style} name='car-outline'/>
);

export const NotifyIcon = (style) => (
  <Icon {...style} name='bell-outline'/>
);

export const HistoryIcon = (style) => (
  <Icon {...style} name='clock-outline'/>
);

export const PinnedIcon = (style) => (
  <Icon {...style} name='pin-outline'/>
);

export const LogoutIcon = (style) => (
  <Icon {...style} name='log-out-outline'/>
);

export const NotificationBadge = (style) => (
  <Layout style={[style, Styles.badge]}>
    <Text style={Styles.badgeText}>5</Text>
  </Layout>
);
export const MenuIcon = (style) => (
  <Icon {...style} name='menu-2-outline' fill='#ffff'/>
);
