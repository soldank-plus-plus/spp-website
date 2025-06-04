import React from "react"
import { Header } from "@/components/sections/Header";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { Footer } from "@/components/sections/Footer";

const Signup = function() {
    return (
        <>
            <Header />
            <main className="flex justify-center items-center min-h-screen px-4">
                <Card className="w-full max-w-sm bg-sombre rounded-xl">
                    <CardHeader>
                        <CardTitle>Sign up</CardTitle>
                        <CardDescription>
                            The only way to create an account is to do it in
                            the game. Press Sign up in the game to create an account.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" variant="secondary">
                            Sign up in the game
                        </Button>

                        <Button asChild variant="outline">
                            <Link to={"/login"}>Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </>
    );
};

export default Signup;