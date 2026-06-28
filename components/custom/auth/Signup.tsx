  "use client";

  import { useState, useCallback } from "react";
  import { Eye, EyeOff, ArrowRight, MapPin, Loader2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { GoogleIcon } from "./Googleicon";
  import PhoneInput from "react-phone-input-2";
  import "react-phone-input-2/lib/style.css";
  import Select from "react-select";
  import debounce from "lodash/debounce";
  import { useSignup } from "@/hooks/useSignup";   // ← Import the hook
import GoogleSignin from "./GoogleSignin";

  const GEOAPIFY_API_KEY = "2f7af045830c472582c4be2c329688fd";

  interface SignupProps {
    onSwitchToSignin: () => void;
  }

  const sriLankaCities = [
    { value: "Colombo", label: "Colombo" },
    { value: "Kandy", label: "Kandy" },
    { value: "Galle", label: "Galle" },
    { value: "Jaffna", label: "Jaffna" },
    { value: "Negombo", label: "Negombo" },
    { value: "Mount Lavinia", label: "Mount Lavinia" },
    { value: "Moratuwa", label: "Moratuwa" },
  ];

  export default function Signup({ onSwitchToSignin }: SignupProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [addressInput, setAddressInput] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    const signupMutation = useSignup();

    const searchAddress = useCallback(
      debounce(async (query: string) => {
        if (query.length < 3) {
          setSuggestions([]);
          return;
        }

        setLoading(true);
        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
              query
            )}&filter=countrycode:lk&limit=8&apiKey=${GEOAPIFY_API_KEY}`
          );
          const data = await res.json();
          setSuggestions(data.features || []);
        } catch (error) {
          console.error("Geoapify error:", error);
        } finally {
          setLoading(false);
        }
      }, 500),
      []
    );

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAddressInput(value);
      setSelectedAddress(null);
      searchAddress(value);
    };

    const selectSuggestion = (suggestion: any) => {
      setAddressInput(suggestion.properties.formatted || "");
      setSelectedAddress(suggestion);
      setSuggestions([]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!selectedCity) {
        alert("Please select your city.");
        return;
      }
      if (!selectedAddress && addressInput.trim().length < 8) {
        alert("Please select a valid address from suggestions.");
        return;
      }

      const formData = new FormData(e.currentTarget);

      // Add controlled fields to FormData
      formData.append("city", selectedCity.value);
      formData.append("address", addressInput);
      formData.append("delivery_address", JSON.stringify(selectedAddress || {}));
      formData.append("phone", phone);

      signupMutation.mutate(formData, {
        onSuccess: (result:any) => {
          if (result.success) {
            alert("🎉 Account created successfully! Please check your email to verify.");
            onSwitchToSignin(); // Switch back to signin after success
          } else {
            alert("❌ " + (result.error || "Failed to create account"));
          }
        },
      });
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">Get started — it only takes a minute.</p>

       <GoogleSignin />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400 uppercase tracking-wide">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" name="first_name" placeholder="John" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" name="last_name" placeholder="Doe" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Phone number</Label>
            <PhoneInput
              country="lk"
              value={phone}
              onChange={setPhone}
              inputClass="w-full h-11 !pl-14 rounded-md border border-input text-sm"
              buttonClass="!h-11"
              preferredCountries={["lk"]}
              enableSearch
            />
          </div>

          <div className="space-y-1.5">
            <Label>City / Area</Label>
            <Select
              options={sriLankaCities}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Select your city..."
              isSearchable
            />
          </div>

          {/* Address Autocomplete */}
          <div className="space-y-1.5 relative">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Type your home address (e.g. Temple Road, Colombo)"
                value={addressInput}
                onChange={handleAddressChange}
                className="h-11 pl-10"
                required
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
            </div>

            {suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-none"
                  >
                    {suggestion.properties.formatted}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button 
          onClick={onSwitchToSignin} 
          className="font-semibold text-blue-600 hover:text-blue-700"
          disabled={signupMutation.isPending}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}