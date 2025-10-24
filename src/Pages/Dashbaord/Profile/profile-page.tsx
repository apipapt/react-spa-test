import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfile } from "@/lib/api/profile.api";
import { ResetPasswordDialog } from "./components/form-reset-password";

type Profile = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  profileImage?: string;
  roleName?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfile();
        if (mounted) setProfile(data as Profile);
      } catch (err: unknown) {
        const e = err as { message?: string } | undefined;
        if (mounted) setError(e?.message ?? "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "19rem",
      } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Profile</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>My Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-muted-foreground">
                    
                    <Avatar className="size-19">
                      <AvatarImage src={profile?.profileImage} />
                      <AvatarFallback>{profile?.name ? profile.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <CardTitle>{profile?.name ?? (loading ? 'Loading...' : 'No name')}</CardTitle>
                    <CardDescription>{profile?.email ?? ''}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{profile?.phone ?? '-'}</div>

                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-medium">{profile?.roleName ?? '-'}</div>
                </div>
                <div className="mt-4">
                  <ResetPasswordDialog />
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Account details</CardTitle>
                  <CardDescription>Summary of your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div>Loading profile...</div>
                  ) : error ? (
                    <div className="text-sm text-red-500">{error}</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Full name</div>
                        <div className="font-medium">{profile?.name ?? '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{profile?.email ?? '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-medium">{profile?.phone ?? '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-medium">{profile?.roleName ?? '-'}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
