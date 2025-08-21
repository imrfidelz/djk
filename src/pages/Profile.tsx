
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Save, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authService, User, UpdateUserDetailsRequest } from "@/services/authService";

interface ProfileFormValues {
  name: string;
  email: string;
  userName: string;
  phoneNumber: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
      userName: "",
      phoneNumber: "",
      bio: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        
        // Update form with user data
        form.reset({
          name: userData.name || "",
          email: userData.email || "",
          userName: userData.userName || "",
          phoneNumber: userData.phoneNumber || "",
          bio:  userData.bio || "",
          address: "", // Backend doesn't have address fields yet
          city: "",
          state: "",
          zipCode: "",
          country: "",
        });
        
        setAvatarPreview(userData.image || null);
      } catch (error) {
        console.error('Failed to load user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    setIsUpdating(true);
    try {
      // Prepare update data (only include fields that exist in backend)
      const updateData: UpdateUserDetailsRequest = {
        name: values.name,
        email: values.email,
        userName: values.userName,
        phoneNumber: values.phoneNumber,
        bio: values.bio,
      };

      let updatedUser: User;
      
      if (avatarFile) {
        // Update with photo
        updatedUser = await authService.updateUserDetailsWithPhoto(updateData, avatarFile);
      } else {
        // Update without photo
        updatedUser = await authService.updateUserDetails(updateData);
      }

      setUser(updatedUser);
      setAvatarFile(null);
      setAvatarPreview(updatedUser.image || null);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-serif mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground">Unable to load your profile. Please try logging in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <Card className="border-luxury-gold/20 md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Upload a profile photo to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-2 border-luxury-gold/30">
                <AvatarImage src={avatarPreview || user.image} alt="Profile" />
                <AvatarFallback className="text-3xl bg-luxury-gold/10">
                  {user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="w-full">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center w-full py-2 border-2 border-dashed rounded-md border-luxury-gold/30 hover:border-luxury-gold/60 transition-colors">
                    <Upload className="h-4 w-4 mr-2 text-luxury-gold" />
                    <span className="text-sm font-medium">Upload Photo</span>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {avatarFile && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    New photo selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="border-luxury-gold/20 md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              className="border-luxury-gold/30 focus-visible:ring-luxury-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className="border-luxury-gold/30 focus-visible:ring-luxury-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              className="border-luxury-gold/30 focus-visible:ring-luxury-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              className="border-luxury-gold/30 focus-visible:ring-luxury-gold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            className="min-h-[100px] border-luxury-gold/30 focus-visible:ring-luxury-gold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full md:w-auto bg-luxury-gold hover:bg-luxury-gold/90"
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
