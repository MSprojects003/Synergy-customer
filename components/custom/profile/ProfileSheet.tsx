// components/custom/profile/ProfileSheet.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
};

type CustomerProfile = {
  phone: string | null;
  city: string | null;
  address: string | null;
};

// Fields that are saving individually
type SavingField = keyof UserProfile | keyof CustomerProfile | "image" | null;

export default function ProfileSheet({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<string>("");

  const [loadingData, setLoadingData] = useState(true);
  const [savingField, setSavingField] = useState<SavingField>(null);

  // User table fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Customer table fields
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  // Refs to track last-saved values (for blur comparison)
  const savedRef = useRef({
    firstName: "",
    lastName: "",
    city: "",
    address: "",
    phone: "",
  });

  // ── Fetch ──────────────────────────────────────────────
  useEffect(() => {
    if (!open || !user?.id) return;

    async function load() {
      setLoadingData(true);
      try {
        const [{ data: u }, { data: c }] = await Promise.all([
          supabase.from("users").select("first_name, last_name, email, profile_image").eq("id", user!.id).single(),
          supabase.from("customers").select("phone, city, address").eq("user_id", user!.id).maybeSingle(),
        ]);

        if (u) {
          setFirstName(u.first_name?.trim() ?? "");
          setLastName(u.last_name?.trim() ?? "");
          setEmail(u.email ?? "");
          setProfileImage(u.profile_image ?? null);
          savedRef.current.firstName = u.first_name?.trim() ?? "";
          savedRef.current.lastName = u.last_name?.trim() ?? "";
        }
        if (c) {
          setPhone(c.phone ?? "");
          setCity(c.city ?? "");
          setAddress(c.address ?? "");
          savedRef.current.phone = c.phone ?? "";
          savedRef.current.city = c.city ?? "";
          savedRef.current.address = c.address ?? "";
        }
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoadingData(false);
      }
    }

    load();
  }, [open, user?.id]);

  // ── Save user field on blur ────────────────────────────
  async function saveUserField(field: "first_name" | "last_name", value: string, refKey: "firstName" | "lastName") {
    if (value.trim() === savedRef.current[refKey]) return;
    setSavingField(refKey === "firstName" ? "first_name" : "last_name");
    try {
      const { error } = await supabase.from("users").update({ [field]: value.trim() }).eq("id", user!.id);
      if (error) throw error;
      savedRef.current[refKey] = value.trim();
      toast.success("Saved.");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSavingField(null);
    }
  }

  // ── Save customer field on blur ───────────────────────
  async function saveCustomerField(field: "city" | "address" | "phone", value: string, refKey: "city" | "address" | "phone") {
    if (value === savedRef.current[refKey]) return;
    setSavingField(field);
    try {
      const { error } = await supabase
        .from("customers")
        .update({ [field]: value || null })
        .eq("user_id", user!.id);
      if (error) throw error;
      savedRef.current[refKey] = value;
      toast.success("Saved.");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSavingField(null);
    }
  }

  // ── Image upload ──────────────────────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setSavingField("image");
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/profile-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("profile_images").getPublicUrl(path);
      const url = data.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image: url })
        .eq("id", user.id);
      if (updateError) throw updateError;

      setProfileImage(url);
      toast.success("Profile photo updated.");
    } catch {
      toast.error("Failed to upload photo.");
    } finally {
      setSavingField(null);
      e.target.value = "";
    }
  }

  const initials = [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || "?";

  // ── Field wrapper ─────────────────────────────────────
  function FieldWrapper({ fieldKey, label, children }: { fieldKey: SavingField; label: string; children: React.ReactNode }) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-500">{label}</Label>
          {savingField === fieldKey && (
            <span className="flex items-center gap-1 text-[11px] text-blue-500">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving…
            </span>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[420px] overflow-y-auto p-0 gap-0">
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-gray-100">
          <SheetTitle className="text-lg font-bold text-gray-900">My Profile</SheetTitle>
          <p className="text-xs text-gray-400 mt-0.5">Changes are saved automatically when you leave a field.</p>
        </SheetHeader>

        {loadingData ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3 pb-6 border-b border-gray-100">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                  {profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{initials}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={savingField === "image"}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-60"
                >
                  {savingField === "image"
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Camera className="w-4 h-4" />
                  }
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900">{[firstName, lastName].filter(Boolean).join(" ") || "Your Name"}</p>
              <p className="text-xs text-gray-400">{email}</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Personal Info</p>

              <FieldWrapper fieldKey="first_name" label="First Name">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => saveUserField("first_name", firstName, "firstName")}
                  placeholder="First name"
                  className="rounded-xl border-gray-200 text-sm h-11"
                />
              </FieldWrapper>

              <FieldWrapper fieldKey="last_name" label="Last Name">
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => saveUserField("last_name", lastName, "lastName")}
                  placeholder="Last name"
                  className="rounded-xl border-gray-200 text-sm h-11"
                />
              </FieldWrapper>

              <FieldWrapper fieldKey={null} label="Email">
                <Input
                  value={email}
                  disabled
                  className="rounded-xl border-gray-200 text-sm h-11 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </FieldWrapper>
            </div>

            {/* Contact & Location */}
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Contact & Location</p>

              <FieldWrapper fieldKey="phone" label="Phone Number">
                <PhoneInput
                  country="lk"
                  value={phone}
                  onChange={(val) => { setPhone(val); phoneRef.current = val; }}
                  onBlur={() => saveCustomerField("phone", phoneRef.current, "phone")}
                  inputClass="!w-full !h-11 !text-sm !rounded-xl !border-gray-200"
                  containerClass="!w-full"
                  buttonClass="!rounded-l-xl !border-gray-200"
                  enableSearch
                  disableSearchIcon
                />
              </FieldWrapper>

              <FieldWrapper fieldKey="city" label="City">
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => saveCustomerField("city", city, "city")}
                  placeholder="e.g. Colombo"
                  className="rounded-xl border-gray-200 text-sm h-11"
                />
              </FieldWrapper>

              <FieldWrapper fieldKey="address" label="Address">
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => saveCustomerField("address", address, "address")}
                  placeholder="Street address"
                  className="rounded-xl border-gray-200 text-sm h-11"
                />
              </FieldWrapper>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}