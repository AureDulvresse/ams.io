"use client"
import React, { useEffect } from 'react';
import {
   User,
   Shield,
   Bell,
   CreditCard,
   Key,
   Globe,
   HelpCircle
} from 'lucide-react';

import { Button } from "@/src/components/ui/button"

const sections = [
   {
      id: 'personal-info',
      label: 'Personal Information',
      icon: User,
      description: 'Manage your personal details and contact information'
   },
   {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password, 2FA, and security settings'
   },
   {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Configure your notification preferences'
   },
   {
      id: 'language',
      label: 'Language & Region',
      icon: Globe,
      description: 'Set your preferred language and regional settings'
   },
   {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help and contact support'
   }
];

const UserProfileSidebar = () => {
   const scrollToSection = (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
         element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   };

   const isElementVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top >= 0 && rect.top <= windowHeight;
   };

   useEffect(() => {
      const handleScroll = () => {
         sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element && isElementVisible(element)) {
               const sidebarItem = document.querySelector(`[data-section="${section.id}"]`);
               if (sidebarItem) {
                  document.querySelectorAll('.sidebar-item').forEach(item => {
                     item.classList.remove('bg-accent');
                  });
                  sidebarItem.classList.add('bg-accent');
               }
            }
         });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <nav className="w-64 px-3 py-4 border-r">
         <div className="space-y-2">
            {sections.map((section) => {
               const Icon = section.icon;
               return (
                  <Button
                     key={section.id}
                     variant="ghost"
                     className="w-full justify-start sidebar-item"
                     data-section={section.id}
                     onClick={() => scrollToSection(section.id)}
                  >
                     <Icon className="mr-2 h-4 w-4" />
                     <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{section.label}</span>
                        <span className="text-xs text-muted-foreground hidden group-hover:block">
                           {section.description}
                        </span>
                     </div>
                  </Button>
               );
            })}
         </div>
      </nav>
   );
};

export default UserProfileSidebar;