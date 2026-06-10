"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Star, 
  Plus, 
  Edit, 
  Trash, 
  X, 
  Search,
  Video,
  Calendar,
  Upload,
  Globe,
  FileVideo,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useCourseStore, type Course, type VideoLesson, type Webinar } from '@/store/useCourseStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';

export default function TutorCourses() {
  const { courses, addCourse, updateCourse, deleteCourse, addVideo, addWebinar, fetchCourses } = useCourseStore();
  const user = useAuthStore(state => state.user);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const supabase = createClient();
  
  // Modal editor active tab
  const [editorTab, setEditorTab] = useState<'info' | 'videos' | 'webinars'>('info');

  // Form states (Info tab)
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('Assessment');
  const [price, setPrice] = useState('Kshs. 5,000');
  const [duration, setDuration] = useState('6 Hours');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop');

  // Form states (Videos tab)
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10:00');

  // Form states (Webinars tab)
  const [newWebinarTitle, setNewWebinarTitle] = useState('');
  const [newWebinarDate, setNewWebinarDate] = useState('');
  const [newWebinarTime, setNewWebinarTime] = useState('14:00');
  const [newWebinarLink, setNewWebinarLink] = useState('https://zoom.us/j/');

  // Open modal in create mode
  const openCreateModal = () => {
    setEditingCourse(null);
    setEditorTab('info');
    setTitle('');
    setInstructor('');
    setCategory('Assessment');
    setPrice('Kshs. 5,000');
    setDuration('6 Hours');
    setStatus('Published');
    setImage('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop');
    setIsModalOpen(true);
  };

  // Open modal in edit mode
  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setEditorTab('info');
    setTitle(course.title);
    setInstructor(course.instructor);
    setCategory(course.category);
    setPrice(course.price);
    setDuration(course.duration);
    setStatus(course.status);
    setImage(course.image);
    setIsModalOpen(true);
  };

  // Delete Course Handler
  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId);
    }
  };

  // Submit main course form
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, { title, instructor, category, price, status, duration, image });
    } else if (user) {
      addCourse({ title, instructor, category, price, status, duration, image, videos: [], webinars: [] }, user.id);
    }

    setIsModalOpen(false);
  };

  // Add Video Lesson to course via store
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !editingCourse) return;

    const newVideo: VideoLesson = {
      id: `v_${Date.now()}`,
      title: newVideoTitle,
      duration: newVideoDuration
    };

    addVideo(editingCourse.id, newVideo);
    // Keep local editingCourse in sync for display
    setEditingCourse((prev) => prev ? { ...prev, videos: [...prev.videos, newVideo] } : prev);
    setNewVideoTitle('');
    setNewVideoDuration('10:00');
  };

  // Add Webinar to course via store
  const handleAddWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebinarTitle || !editingCourse) return;

    const newWebinar: Webinar = {
      id: `w_${Date.now()}`,
      title: newWebinarTitle,
      date: newWebinarDate || '2026-06-01',
      time: newWebinarTime,
      link: newWebinarLink
    };

    addWebinar(editingCourse.id, newWebinar);
    setEditingCourse((prev) => prev ? { ...prev, webinars: [...prev.webinars, newWebinar] } : prev);
    setNewWebinarTitle('');
    setNewWebinarDate('');
    setNewWebinarTime('14:00');
    setNewWebinarLink('https://zoom.us/j/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-covers')
        .getPublicUrl(fileName);

      setImage(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please ensure the course-covers storage bucket exists and is public.');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto relative">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Courses</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage and edit your clinical physical therapy curriculum.</p>
        </div>
        <Button onClick={openCreateModal} className="rounded-full shadow-md font-bold h-11 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Add New Course
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-4 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
          <Input 
            placeholder="Search by title or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border text-foreground"
          />
        </div>
      </div>

      {/* Courses List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            {/* Course image display */}
            <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-secondary">
              <img 
                src={course.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
              />
              <div className="absolute top-3 right-3 flex gap-1.5">
                <Badge className={`font-black text-[9px] uppercase tracking-wider border-none ${
                  course.status === 'Published' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-500 text-white shadow-sm'
                }`}>
                  {course.status}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary font-bold text-[10px] uppercase rounded-full">
                  {course.category}
                </Badge>
                <div className="flex gap-2.5 text-[10px] font-bold text-muted-foreground">
                  <span>{course.videos.length} Videos</span>
                  <span>•</span>
                  <span>{course.webinars.length} Webinars</span>
                </div>
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {course.title}
              </CardTitle>
              <CardDescription className="font-semibold text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                <BookOpen className="w-4 h-4 text-primary" />
                {course.duration} Curriculum
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-4 pt-1">
              <div className="grid grid-cols-3 gap-4 border-y border-border/85 py-3.5 text-center">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Enrolled</p>
                  <p className="text-sm font-extrabold text-foreground">{course.students}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Rating</p>
                  <p className="text-sm font-extrabold text-foreground flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{course.rating || 'N/A'}</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Price</p>
                  <p className="text-sm font-extrabold text-foreground">{course.price}</p>
                </div>
              </div>
            </CardContent>

            <div className="p-6 pt-2 flex items-center justify-between gap-3 bg-secondary/15">
              <Button onClick={() => openEditModal(course)} variant="outline" size="sm" className="rounded-full flex-1 border-border font-bold">
                <Edit className="w-4 h-4 mr-1.5" />
                Edit / Curriculum
              </Button>
              <Button onClick={() => handleDeleteCourse(course.id)} variant="ghost" size="sm" className="rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-semibold px-4">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Editor Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-fade-in space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {editingCourse ? `Edit: ${editingCourse.title}` : 'Create New Course'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingCourse ? 'Update curriculum settings, video lectures, and live sessions.' : 'Design a new physical therapy course curriculum.'}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Editing tab buttons (Only show when editing an existing course) */}
            {editingCourse ? (
              <div className="flex border-b border-border">
                {[
                  { id: 'info', label: 'Course Info', icon: Globe },
                  { id: 'videos', label: 'Videos & Lessons', icon: Video },
                  { id: 'webinars', label: 'Live Webinars', icon: Calendar }
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setEditorTab(t.id as any)}
                      className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                        editorTab === t.id 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* TAB 1: Course Info Form */}
            {editorTab === 'info' && (
              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cTitle" className="text-sm font-semibold">Course Title</Label>
                  <Input 
                    id="cTitle" 
                    placeholder="e.g. Pediatric Gait Assessment and Therapy" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="h-11 border-border bg-background" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cInstructor" className="text-sm font-semibold">Instructor Name & Title</Label>
                  <Input 
                    id="cInstructor" 
                    placeholder="e.g. Dr. Jane Smith, DPT" 
                    value={instructor} 
                    onChange={(e) => setInstructor(e.target.value)} 
                    className="h-11 border-border bg-background" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cImage" className="text-sm font-semibold">Course Banner Image</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="cImage" 
                      placeholder="Enter image URL or upload local file" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                      className="h-11 border-border bg-background text-xs flex-1" 
                    />
                    <div>
                      <input 
                        type="file" 
                        id="imageUpload" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="h-11 font-bold whitespace-nowrap"
                        onClick={() => document.getElementById('imageUpload')?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                        ) : (
                          <><Upload className="w-4 h-4 mr-2" /> Upload File</>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2 bg-secondary/30 p-2 rounded-lg">
                    <span className="font-bold">Preview:</span>
                    <span className="truncate">{image}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cCategory" className="text-sm font-semibold">Category</Label>
                    <select 
                      id="cCategory" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="w-full h-11 rounded-lg border border-border bg-background text-foreground text-sm px-3 focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
                    >
                      <option value="Assessment">Assessment</option>
                      <option value="Rehab">Rehab</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cDuration" className="text-sm font-semibold">Duration</Label>
                    <Input 
                      id="cDuration" 
                      placeholder="e.g. 6 Hours" 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)} 
                      className="h-11 border-border bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cPrice" className="text-sm font-semibold">Price</Label>
                    <Input 
                      id="cPrice" 
                      placeholder="e.g. Kshs. 5,000" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      className="h-11 border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cStatus" className="text-sm font-semibold">Publish Status</Label>
                    <select 
                      id="cStatus" 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value as any)} 
                      className="w-full h-11 rounded-lg border border-border bg-background text-foreground text-sm px-3 focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border/80">
                  <Button type="button" variant="ghost" className="rounded-full font-bold" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-full font-bold shadow-md px-6">
                    {editingCourse ? 'Save Details' : 'Create Course'}
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 2: Upload Video Lessons */}
            {editorTab === 'videos' && editingCourse && (
              <div className="space-y-6">
                
                {/* Upload Form */}
                <form onSubmit={handleAddVideo} className="p-4 border border-border bg-secondary/20 rounded-xl space-y-4">
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-primary" />
                    Upload Video Lesson
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="vidTitle" className="text-xs font-bold text-muted-foreground">Lesson Title</Label>
                      <Input 
                        id="vidTitle" 
                        placeholder="e.g. Demonstration of Cervical Traction" 
                        value={newVideoTitle} 
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        className="h-10 border-border bg-background"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vidDuration" className="text-xs font-bold text-muted-foreground">Duration</Label>
                      <Input 
                        id="vidDuration" 
                        placeholder="e.g. 15:30" 
                        value={newVideoDuration} 
                        onChange={(e) => setNewVideoDuration(e.target.value)}
                        className="h-10 border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                      <FileVideo className="w-4.5 h-4.5 text-primary" />
                      <span>Select Video File (.mp4, .mov)</span>
                    </div>
                    <Button type="submit" className="rounded-full font-bold h-9">
                      Add Video Lesson
                    </Button>
                  </div>
                </form>

                {/* Video list - read from store */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-foreground">
                    Video Playlist ({courses.find(c => c.id === editingCourse.id)?.videos.length ?? 0} videos)
                  </h4>
                  
                  {(courses.find(c => c.id === editingCourse.id)?.videos ?? []).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic bg-secondary/10 p-3 rounded-lg border border-border/80 text-center">No video lessons uploaded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {(courses.find(c => c.id === editingCourse.id)?.videos ?? []).map((vid, index) => (
                        <div key={vid.id} className="flex items-center justify-between p-3 border border-border bg-background rounded-lg hover:bg-secondary/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <span className="font-bold text-sm text-foreground">{vid.title}</span>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground">{vid.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: Schedule Live Webinars */}
            {editorTab === 'webinars' && editingCourse && (
              <div className="space-y-6">
                
                {/* Webinar Form */}
                <form onSubmit={handleAddWebinar} className="p-4 border border-border bg-secondary/20 rounded-xl space-y-4">
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    Schedule Live Webinar Session
                  </h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webTitle" className="text-xs font-bold text-muted-foreground">Webinar Topic / Title</Label>
                    <Input 
                      id="webTitle" 
                      placeholder="e.g. Knee Palpation Live Consultation & Case Review" 
                      value={newWebinarTitle} 
                      onChange={(e) => setNewWebinarTitle(e.target.value)}
                      className="h-10 border-border bg-background"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="webDate" className="text-xs font-bold text-muted-foreground">Date</Label>
                      <Input 
                        id="webDate" 
                        type="date"
                        value={newWebinarDate} 
                        onChange={(e) => setNewWebinarDate(e.target.value)}
                        className="h-10 border-border bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webTime" className="text-xs font-bold text-muted-foreground">Time (EST)</Label>
                      <Input 
                        id="webTime" 
                        placeholder="e.g. 14:00" 
                        value={newWebinarTime} 
                        onChange={(e) => setNewWebinarTime(e.target.value)}
                        className="h-10 border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webLink" className="text-xs font-bold text-muted-foreground">Zoom / Teams Meeting Link</Label>
                    <Input 
                      id="webLink" 
                      placeholder="e.g. https://zoom.us/j/123456789" 
                      value={newWebinarLink} 
                      onChange={(e) => setNewWebinarLink(e.target.value)}
                      className="h-10 border-border bg-background"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="rounded-full font-bold h-9">
                      Schedule Webinar
                    </Button>
                  </div>
                </form>

                {/* Webinar list - read from store */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-foreground">
                    Scheduled Live Webinars ({courses.find(c => c.id === editingCourse.id)?.webinars.length ?? 0})
                  </h4>
                  
                  {(courses.find(c => c.id === editingCourse.id)?.webinars ?? []).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic bg-secondary/10 p-3 rounded-lg border border-border/80 text-center">No webinars scheduled yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {(courses.find(c => c.id === editingCourse.id)?.webinars ?? []).map((web) => (
                        <div key={web.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border bg-background rounded-lg gap-2">
                          <div className="space-y-1">
                            <span className="font-bold text-sm text-foreground">{web.title}</span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                              <span>Date: {web.date}</span>
                              <span>•</span>
                              <span>Time: {web.time} EST</span>
                            </div>
                          </div>
                          <a 
                            href={web.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline shrink-0"
                          >
                            <span>Join Webinar</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
