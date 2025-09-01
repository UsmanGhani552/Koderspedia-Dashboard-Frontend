import React from 'react';
import { Icon } from '@iconify/react';

export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`d-flex justify-content-center align-items-center ${fullScreen ? 'vh-100' : ''}`}>
      <Icon icon="svg-spinners:270-ring" width={40} height={40} />
    </div>
  );
}