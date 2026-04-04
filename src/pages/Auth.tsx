import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type UserRole = "brand" | "factory";

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const id = window.setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise
      .then((value) => {
        window.clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(id);
        reject(err);
      });
  });
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("mode") === "signup" ? "signup" : "login";
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  
  const { user, isLoading: authLoading, signIn, signUp } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>("brand");
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate(redirectTo);
    }
  }, [user, authLoading, navigate, redirectTo]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data, error } = await withTimeout(
        signIn(loginEmail, loginPassword),
        15000,
        "Sign in"
      );

      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }

      // If we have a session, redirect immediately. If not, the auth listener
      // will redirect when the user state updates.
      if (data?.session) {
        toast.success("Signed in successfully!");
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error("Auth: sign in failed", err);
      toast.error("Sign in is taking too long. Please try again.");
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data, error } = await withTimeout(
        signUp(signupEmail, signupPassword),
        15000,
        "Sign up"
      );

      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }

      // Some environments may require email confirmation; still clear loading.
      if (data?.session) {
        toast.success("Account created successfully!");
        navigate(selectedRole === "factory" ? "/onboarding/factory" : "/onboarding", { replace: true });
      } else {
        toast.success("Account created! Please check your email to confirm.");
      }
    } catch (err) {
      console.error("Auth: sign up failed", err);
      toast.error("Sign up is taking too long. Please try again.");
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Sign In | Sourcery" 
        description="Access your Sourcery account to connect with verified manufacturers or manage your factory profile."
      />
      
      <section className="section-padding min-h-[80vh] flex items-center">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome to Sourcery
              </h1>
              <p className="text-muted-foreground">
                Find and manage your manufacturing relationships
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <Tabs defaultValue={defaultTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@company.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup" className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("brand")}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedRole === "brand"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Users className="h-5 w-5 mb-2 text-primary" />
                        <div className="font-medium text-foreground">Brand</div>
                        <div className="text-xs text-muted-foreground">
                          Looking for manufacturers
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole("factory")}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedRole === "factory"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Building2 className="h-5 w-5 mb-2 text-primary" />
                        <div className="font-medium text-foreground">Factory</div>
                        <div className="text-xs text-muted-foreground">
                          Showcase my capabilities
                        </div>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">
                        {selectedRole === "brand" ? "Company Name" : "Factory Name"}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder={selectedRole === "brand" ? "Acme Inc" : "Premium Textiles Co"}
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@company.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10"
                          required
                          minLength={8}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
