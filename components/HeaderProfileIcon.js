import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';
import ProfileModal from './ProfileModal';

export default function HeaderProfileIcon() {
  const [modalVisible, setModalVisible] = useState(false);
  const { isDark } = useThemeContext();

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderRadius: 14,
          padding: 4,
          marginRight: 16,
        }}
      >
        <MaterialCommunityIcons
          name="account-circle"
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
      <ProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}