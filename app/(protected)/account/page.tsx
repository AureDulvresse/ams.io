import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

const UserProfilePage = () => {
   return (
      <div className="space-y-8">
         <section id="personal-info" className="scroll-mt-16">
            <Card>
               <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="John" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Doe" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Email</label>
                     <Input type="email" placeholder="john.doe@example.com" />
                  </div>
               </CardContent>
            </Card>
         </section>

         <section id="security" className="scroll-mt-16">
            <Card>
               <CardHeader>
                  <CardTitle>Security</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Current Password</label>
                     <Input type="password" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">New Password</label>
                     <Input type="password" />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium">Two-Factor Authentication</span>
                     <Switch />
                  </div>
               </CardContent>
            </Card>
         </section>

         <section id="notifications" className="scroll-mt-16">
            <Card>
               <CardHeader>
                  <CardTitle>Notifications</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium">Email Notifications</span>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium">Push Notifications</span>
                     <Switch defaultChecked />
                  </div>
               </CardContent>
            </Card>
         </section>

         <section id="language" className="scroll-mt-16">
            <Card>
               <CardHeader>
                  <CardTitle>Language & Region</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Language</label>
                     <Select defaultValue="en">
                        <SelectTrigger>
                           <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="en">English</SelectItem>
                           <SelectItem value="fr">Français</SelectItem>
                           <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </CardContent>
            </Card>
         </section>

         <section id="help" className="scroll-mt-16">
            <Card>
               <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <p className="text-sm text-muted-foreground">
                        Need help? Contact our support team or check our documentation.
                     </p>
                     <Button variant="secondary">Contact Support</Button>
                  </div>
               </CardContent>
            </Card>
         </section>
      </div>
   );
};

export default UserProfilePage;