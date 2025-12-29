import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Mail, Lock, User, ArrowRight, Chrome } from "lucide-react";

type UserRole = "brand" | "factory";

/**
 * Auth Page
 * 
 * API Endpoints:
 * - POST /api/auth/login
 *   Request: { email: string, password: string }
 *   Response: { user: User, token: string }
 * 
 * - POST /api/auth/signup
 *   Request: { email: string, password: string, name: string, role: "brand" | "factory" }
 *   Response: { user: User, token: string }
 * 
 * - POST /api/auth/oauth/:provider
 *   Request: { provider: "google" | "linkedin" }
 *   Response: { redirectUrl: string }
 */

export default function Auth() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("mode") === "signup" ? "signup" : "login";
  
  const [selectedRole, setSelectedRole] = useState<UserRole>("brand");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // API Call: POST /api/auth/login
    // Request: { email: loginEmail, password: loginPassword }
    console.log("Login:", { email: loginEmail, password: loginPassword });
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      // On success: redirect to dashboard
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // API Call: POST /api/auth/signup
    // Request: { email: signupEmail, password: signupPassword, name: signupName, role: selectedRole }
    console.log("Signup:", { 
      email: signupEmail, 
      password: signupPassword, 
      name: signupName, 
      role: selectedRole 
    });
    
    setTimeout(() => {
      setIsLoading(false);
      // On success: redirect based on role
    }, 1000);
  };

  const handleOAuth = (provider: "google" | "linkedin") => {
    // API Call: POST /api/auth/oauth/:provider
    console.log("OAuth:", provider);
  };

  return (
    <Layout>
      <SEO 
        title="Sign In | Manufactory" 
        description="Access your Manufactory account to connect with verified manufacturers or manage your factory profile."
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
                Welcome to Manufactory
              </h1>
              <p className="text-muted-foreground">
                Connect with verified manufacturers worldwide
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
                        <Link 
                          to="/auth/forgot-password" 
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
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

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleOAuth("google")}
                      className="w-full"
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuth("linkedin")}
                      className="w-full"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </div>
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
