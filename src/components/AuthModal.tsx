'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleSuccess = () => {
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === 'login' ? '登录' : '注册'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={switchMode}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={switchMode}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
