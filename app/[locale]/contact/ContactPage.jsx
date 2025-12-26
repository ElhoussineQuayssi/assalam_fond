"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import gsap from "gsap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SharedHero from '@/components/Hero/SharedHero.jsx';
import { useAppData } from '@/components/AppDataContext';

const ContactPage = () => {
  const t = useTranslations('Contact');
  const formRef = useRef(null);
  const { sendMessage, allProjectImages } = useAppData();

  const [generalForm, setGeneralForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '' });
  const [projectForm, setProjectForm] = useState({ first_name: '', last_name: '', email: '', phone: '', project: '', message: '' });
  const [volunteerForm, setVolunteerForm] = useState({ first_name: '', last_name: '', email: '', phone: '', city: '', skills: '' });

  const handleGeneralSubmit = async () => {
    const { error } = await sendMessage({
      first_name: generalForm.first_name,
      last_name: generalForm.last_name,
      email: generalForm.email,
      phone: generalForm.phone || null,
      message: generalForm.message,
      type: "contact",
      status: "unread"
    });
    if (!error) {
      alert("Message sent successfully!");
      setGeneralForm({ first_name: '', last_name: '', email: '', phone: '', message: '' });
    }
  };

  const handleProjectSubmit = async () => {
    const { error } = await sendMessage({
      first_name: projectForm.first_name,
      last_name: projectForm.last_name,
      email: projectForm.email,
      phone: projectForm.phone || null,
      message: `Project: ${projectForm.project}\n${projectForm.message}`,
      type: "project",
      status: "unread"
    });
    if (!error) {
      alert("Project request sent successfully!");
      setProjectForm({ first_name: '', last_name: '', email: '', phone: '', project: '', message: '' });
    }
  };

  const handleVolunteerSubmit = async () => {
    const { error } = await sendMessage({
      first_name: volunteerForm.first_name,
      last_name: volunteerForm.last_name,
      email: volunteerForm.email,
      phone: volunteerForm.phone || null,
      message: `City: ${volunteerForm.city}, Skills: ${volunteerForm.skills}`,
      type: "volunteer",
      status: "unread"
    });
    if (!error) {
      alert("Volunteer application sent successfully!");
      setVolunteerForm({ first_name: '', last_name: '', email: '', phone: '', city: '', skills: '' });
    }
  };

  useEffect(() => {
    // GSAP Animation for the form when page loads
    gsap.from(formRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Shared Hero */}
      <SharedHero
        title={t('hero.title')}
        description={t('hero.description')}
        allProjectImages={allProjectImages}
        showScrollButton={false}
      />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* --- Left Side: Forms --- */}
          <div ref={formRef} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-3xl font-black mb-8">{t('form.title')}</h2>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 rounded-full p-1">
                <TabsTrigger value="general" className="rounded-full">{t('tabs.general')}</TabsTrigger>
                <TabsTrigger value="project" className="rounded-full">{t('tabs.project')}</TabsTrigger>
                <TabsTrigger value="volunteer" className="rounded-full">{t('tabs.volunteer')}</TabsTrigger>
              </TabsList>

              {/* Tab 1: General */}
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input value={generalForm.first_name} onChange={(e) => setGeneralForm({...generalForm, first_name: e.target.value})} placeholder={t('form.first_name')} className="rounded-xl h-12" />
                  <Input value={generalForm.last_name} onChange={(e) => setGeneralForm({...generalForm, last_name: e.target.value})} placeholder={t('form.last_name')} className="rounded-xl h-12" />
                </div>
                <Input type="email" value={generalForm.email} onChange={(e) => setGeneralForm({...generalForm, email: e.target.value})} placeholder={t('form.email')} className="rounded-xl h-12" />
                <Input value={generalForm.phone} onChange={(e) => setGeneralForm({...generalForm, phone: e.target.value})} placeholder={t('form.phone')} className="rounded-xl h-12" />
                <Textarea value={generalForm.message} onChange={(e) => setGeneralForm({...generalForm, message: e.target.value})} placeholder={t('form.message')} className="rounded-xl min-h-[150px]" />
                <Button onClick={handleGeneralSubmit} className="w-full bg-blue-600 h-12 rounded-xl">{t('form.send')}</Button>
              </TabsContent>

              {/* Tab 2: Talk about Project */}
              <TabsContent value="project" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input value={projectForm.first_name} onChange={(e) => setProjectForm({...projectForm, first_name: e.target.value})} placeholder={t('form.first_name')} className="rounded-xl h-12" />
                  <Input value={projectForm.last_name} onChange={(e) => setProjectForm({...projectForm, last_name: e.target.value})} placeholder={t('form.last_name')} className="rounded-xl h-12" />
                </div>
                <Input type="email" value={projectForm.email} onChange={(e) => setProjectForm({...projectForm, email: e.target.value})} placeholder={t('form.email')} className="rounded-xl h-12" />
                <Input value={projectForm.phone} onChange={(e) => setProjectForm({...projectForm, phone: e.target.value})} placeholder={t('form.phone')} className="rounded-xl h-12" />
                <Select value={projectForm.project} onValueChange={(value) => setProjectForm({...projectForm, project: value})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder={t('form.select_project')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rayhana">{t('projects.rayhana')}</SelectItem>
                    <SelectItem value="kafala">{t('projects.kafala')}</SelectItem>
                    <SelectItem value="imtiaz">{t('projects.imtiaz')}</SelectItem>
                    <SelectItem value="himaya">{t('projects.himaya')}</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea value={projectForm.message} onChange={(e) => setProjectForm({...projectForm, message: e.target.value})} placeholder={t('form.project_message')} className="rounded-xl min-h-[150px]" />
                <Button onClick={handleProjectSubmit} className="w-full bg-blue-600 h-12 rounded-xl">{t('form.send_request')}</Button>
              </TabsContent>

              {/* Tab 3: Volunteer */}
              <TabsContent value="volunteer" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input value={volunteerForm.first_name} onChange={(e) => setVolunteerForm({...volunteerForm, first_name: e.target.value})} placeholder={t('form.first_name')} className="rounded-xl h-12" />
                  <Input value={volunteerForm.last_name} onChange={(e) => setVolunteerForm({...volunteerForm, last_name: e.target.value})} placeholder={t('form.last_name')} className="rounded-xl h-12" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="email" value={volunteerForm.email} onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})} placeholder={t('form.email')} className="rounded-xl h-12" />
                  <Input value={volunteerForm.phone} onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})} placeholder={t('form.phone')} className="rounded-xl h-12" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input value={volunteerForm.city} onChange={(e) => setVolunteerForm({...volunteerForm, city: e.target.value})} placeholder={t('form.city')} className="rounded-xl h-12" />
                  <Input value={volunteerForm.skills} onChange={(e) => setVolunteerForm({...volunteerForm, skills: e.target.value})} placeholder={t('form.skills')} className="rounded-xl h-12" />
                </div>
                <Button onClick={handleVolunteerSubmit} className="w-full bg-emerald-600 h-12 rounded-xl">{t('form.join_us')}</Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* --- Right Side: Info & Map --- */}
          <div className="space-y-8">
            <div className="bg-blue-600 text-white p-10 rounded-[3rem] space-y-6 shadow-xl">
              <h3 className="text-2xl font-bold">{t('info.title')}</h3>
              <p className="opacity-80">{t('info.description')}</p>
              <div className="space-y-4 text-sm">
                <p>📍 {t('info.address')}</p>
                <p>📞 {t('info.phone')}</p>
                <p>✉️ {t('info.email')}</p>
              </div>
            </div>

            {/* Map Section */}
            <div className="h-[350px] w-full rounded-[3rem] overflow-hidden shadow-inner grayscale hover:grayscale-0 transition-all duration-700 border border-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8463!2d-7.6534!3d33.5897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM1JzIyLjkiTiA3wrAzOScxMi4yIlc!5e0!3m2!1sen!2sma!4v123456789"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ContactPage;