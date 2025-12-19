import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LoginCard: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <Card className="w-full max-w-sm bg-sombre rounded-xl">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Enter your email or username below to login to your
                        account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email/username</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" variant="secondary">
                        Login
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/signup">Sign up</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginCard;
