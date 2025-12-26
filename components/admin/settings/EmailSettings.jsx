"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EmailSettings({ isDarkMode = false }) {
  const handleSave = () => {
    // Implementation for saving email settings
    console.log('Saving email settings...');
  };

  return (
    <Card className={`shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
      <CardHeader>
        <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Email Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
            SMTP Host
          </label>
          <Input 
            defaultValue="smtp.gmail.com" 
            className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
              SMTP Port
            </label>
            <Input 
              defaultValue="587" 
              className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''} 
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
              Encryption
            </label>
            <Select defaultValue="tls">
              <SelectTrigger className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tls">TLS</SelectItem>
                <SelectItem value="ssl">SSL</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
            From Email
          </label>
          <Input 
            type="email" 
            defaultValue="noreply@assalam.org" 
            className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''} 
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
            From Name
          </label>
          <Input 
            defaultValue="Assalam Foundation" 
            className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''} 
          />
        </div>
        <Button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save Email Settings
        </Button>
      </CardContent>
    </Card>
  );
}